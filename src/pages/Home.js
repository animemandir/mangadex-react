import React from "react";
import axios from 'axios';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import HomeUpdates from '../component/HomeUpdates.js';
import HomeReadingHistory from '../component/HomeReadingHistory.js';
import HomeTopManga from '../component/HomeTopManga.js';
import Loading from '../component/Loading.js';
import toast, { Toaster } from 'react-hot-toast';
import { isLogged } from "../util/loginUtil.js";

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lastChapters: [],
            lastChaptersData: [],
            history: [],
            isLogged: false,
            mangaTabControl: {
                active: "follow",
                btnFollow: "text-center w-1/2 px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                btnRating: "text-center w-1/2 px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900"
            },
            chapterTabControl: {
                active: "6h",
                btn6h: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                btn24h: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                btn7d: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-t-2 border-b-2 border-r-2 border-gray-200 dark:border-gray-900"
            },
            updatesComponent: <Loading />,
            mangaComponent: "",
            chapterComponent: <p className="ml-2">Someday</p>
        };
    }

    async componentDidMount(){
        document.title = "Home - MangaDex";
        this.getLastChapters();
        this.getReadingHistory();
        let logged = await isLogged();
        this.setState({
            isLogged: logged
        },() => this.getTopManga());
    }

    getLastChapters = () => {
        var $this = this;

        var translatedLanguage = ["en"];
        if(localStorage.language){
            translatedLanguage = JSON.parse(localStorage.language);
        }

        var originalLanguage = ["ja"];
        if(localStorage.original){
            originalLanguage = JSON.parse(localStorage.original);
        }

        var contentRating = [];
        if(localStorage.content){
            contentRating = JSON.parse(localStorage.content);
        }
       
        axios.get('https://api.mangadex.org/chapter?order[createdAt]=desc',{
            params: {
                translatedLanguage: translatedLanguage,
                originalLanguage: originalLanguage,
                contentRating: contentRating,
                includes: ["scanlation_group","manga"],
                limit: 100,
            }
        })
        .then(function(response){
            let chapters = [];
            let mangaIds = [];
            response.data.data.map((chapter,i) => {
                let mangaId = "";
                let mangaName = "";
                let groups = [];
                let originalLanguage = "";
                let contentRating = "";
                chapter.relationships.map((relation) => {
                    if(relation.type === "manga"){
                        mangaId = relation.id;
                        originalLanguage = relation.attributes.originalLanguage;
                        contentRating = relation.attributes.contentRating;

                        Object.keys(relation.attributes.title).map(function(key){
                            if(key === "en" || mangaName === ""){
                                mangaName = relation.attributes.title[key];
                            }
                        });
                    }

                    if(relation.type === "scanlation_group"){
                        groups.push({
                            id: relation.id,
                            name: relation.attributes.name
                        });
                    }
                });
                
                let temp = {
                    chapterId: chapter.id,
                    publishAt: chapter.attributes.publishAt,
                    chapter: chapter.attributes.chapter,
                    mangaId: mangaId,
                    mangaName: mangaName,
                    groups: groups,
                    translatedLanguage: chapter.attributes.translatedLanguage,
                    originalLanguage:originalLanguage
                };

                if(Object.keys(chapters).indexOf(mangaId) <= -1){
                    if(localStorage.content){
                        let content = JSON.parse(localStorage.content);
                        if(content.length > 0){
                            if(content.indexOf(contentRating) > -1){
                                mangaIds.push(mangaId);
                                chapters[mangaId] = temp;
                            }
                        }else if(contentRating !== "erotica" && contentRating !== "pornographic"){
                            mangaIds.push(mangaId);
                            chapters[mangaId] = temp;
                        }
                    }else if(contentRating !== "erotica" && contentRating !== "pornographic"){
                        mangaIds.push(mangaId);
                        chapters[mangaId] = temp;
                    }
                }
            });

            var mangaIdsUnique = [...new Set(mangaIds)]
            $this.setState({lastChapters:mangaIdsUnique});
            $this.getLCCovers(chapters,mangaIdsUnique);
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving Last chapters.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getLCCovers = (chapters,mangaIds) => {
        var $this = this;

        var contentRating = [];
        if(localStorage.content){
            contentRating = JSON.parse(localStorage.content);
        }

        axios.get('https://api.mangadex.org/manga?includes[]=cover_art',{
            params: {
                ids: mangaIds,
                contentRating: contentRating,
                limit: 100
            }
        })
        .then(function(response){
            response.data.data.map((manga,i) => {
                let mangaId = manga.id;
                manga.relationships.map((relation) => {
                    if(relation.type === "cover_art"){
                        if(relation.attributes !== undefined){
                            let coverFile = "https://uploads.mangadex.org/covers/" +  mangaId + "/" + relation.attributes.fileName + ".512.jpg";
                            if(chapters[mangaId]){
                                chapters[mangaId].cover = coverFile;
                            }
                        }                        
                    }                    
                });
            });

            $this.setState({lastChaptersData:chapters});
            $this.renderHomeUpdates();
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving Last chapters\'s covers.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    renderHomeUpdates = () => {
        var comp = [];
        for(let a = 0; a < this.state.lastChapters.length; a++){
            comp.push(<HomeUpdates data={this.state.lastChaptersData[this.state.lastChapters[a]]}/>);
        }

        this.setState({updatesComponent: comp});
    }

    getReadingHistory = () => {
        let history = [];
        let readingHistory = [];
        let count = 0
        if(localStorage.readingHistory){
            readingHistory = JSON.parse(localStorage.readingHistory);
            count = readingHistory.length;
            for(let a = readingHistory.length-1; a >= readingHistory.length-10; a--){
                if(readingHistory[a] !== undefined){
                    history.push(<HomeReadingHistory data={readingHistory[a]} />);
                }
            }
        }else{
            history.push(
                <div className="my-2 mx-1">
                    <div className="p-1">
                       No chapters found.
                    </div>
                </div>
            )
        }

        this.setState({
            history: history        
        });
    }

    getTopManga = () => {
        var $this = this;
        this.setState({mangaComponent: 
        <div className="inline-flex ml-2">
            <img className="w-16 h-16" alt="Loading" src={process.env.PUBLIC_URL + '/spin.svg'} />
        </div>});

        var contentRating = [];
        if(localStorage.content){
            contentRating = JSON.parse(localStorage.content);
        }

        var orderBy = "order[followedCount]=desc";
        if(this.state.mangaTabControl.active === "rating"){
            this.setState({mangaComponent: <p className="ml-2">Someday</p>});
            return false;
        }

        axios.get('https://api.mangadex.org/manga?includes[]=cover_art&' + orderBy,{
            params: {
                contentRating: contentRating,
                limit: 10
            }
        })
        .then(function(response){
            let mangaList = [];
            response.data.data.map((manga,i) => {
                let id = manga.id;
                let coverFile = "";
                let title = "";
                Object.keys(manga.attributes.title).map(function(key){
                    if(key === "en" || title === ""){
                        title = manga.attributes.title[key];
                    }
                });
                manga.relationships.map((relation) => {
                    if(relation.type === "cover_art"){
                        if(relation.attributes !== undefined){
                            coverFile = "https://uploads.mangadex.org/covers/" +  id + "/" + relation.attributes.fileName + ".512.jpg";
                        }                        
                    }                    
                });

                mangaList.push({
                    id: id,
                    name: title,
                    coverFile: coverFile,
                });
            });

            if($this.state.isLogged){
                $this.getTopMangaStats(mangaList);
            }else{
                let list = mangaList.map((manga) => <HomeTopManga data={manga} />);
                $this.setState({mangaComponent:list});
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving manga list.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getTopMangaStats = (mangaList) => {
        let idList = [];
        for(let a = 0; a < mangaList.length; a++){
            idList.push(mangaList[a].id);
        }
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        axios.get('https://api.mangadex.org/statistics/manga',{
            headers: {  
                Authorization: bearer
            },
            params: {
                manga: idList
            }
        })
        .then(function(response){
            for(let a = 0; a < mangaList.length; a++){
                let mean = 0;
                let followCount = 0;
                if(response.data.statistics[mangaList[a].id] !== undefined){
                    mean = response.data.statistics[mangaList[a].id].rating.average;
                    if(mean === undefined || mean === null){
                        mean = 0;
                    }

                    followCount = response.data.statistics[mangaList[a].id].follows;
                    if(followCount === undefined || followCount === null){
                        followCount = 0;
                    }
                }
                
                mangaList[a].meanRating = mean.toFixed(2);
                mangaList[a].followCount = followCount;
            }

            let list = mangaList.map((manga) => <HomeTopManga data={manga} />);
            $this.setState({
                mangaComponent:list
            });
            
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving statistics.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    changeMangaTab = (tab) => {
        switch(tab){
            case "follow":
                this.setState({mangaTabControl: {
                    active: "follow",
                    btnFollow: "text-center w-1/2 px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                    btnRating: "text-center w-1/2 px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                }},() => this.getTopManga());
            break;
            case "rating":
                this.setState({mangaTabControl: {
                    active: "rating",
                    btnFollow: "text-center w-1/2 px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    btnRating: "text-center w-1/2 px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                }},() => this.getTopManga());
            break;
        }
    }

    changeChapterTab = (tab) => {
        switch(tab){
            case "6h":
                this.setState({chapterTabControl: {
                    active: "6h",
                    btn6h: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                    btn24h: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    btn7d: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-t-2 border-b-2 border-r-2 border-gray-200 dark:border-gray-900"
                }});
            break;
            case "24h":
                this.setState({chapterTabControl: {
                    active: "24h",
                    btn6h: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    btn24h: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                    btn7d: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900"
                }});
            break;
            case "7d":
                this.setState({chapterTabControl: {
                    active: "7d",
                    btn6h: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-t-2 border-b-2 border-l-2 border-gray-200 dark:border-gray-900",
                    btn24h: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    btn7d: "text-center px-3 w-1/3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200"
                }});
            break;
        }
    }

    render = () => {
        var comp = [];
        for(let a = 0; a < this.state.lastChapters.length; a++){
            comp.push(<HomeUpdates data={this.state.lastChaptersData[this.state.lastChapters[a]]}/>);
        }
        return (
            <div class="flex flex-col justify-between">
                <Toaster />
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full md:flex-1 md:mr-4 py-2 mt-6 mb-6 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-center border-b-2 pb-1 border-gray-200 dark:border-gray-900">
                                Last Updates
                            </div>
                            <div className="hidden">
                                <button className="w-1/2 text-center p-2 border-b-2 border-r-2 border-gray-200 dark:border-gray-900">
                                    All
                                </button>
                                <button className="w-1/2 text-center p-2 border-b-2 border-gray-200 dark:border-gray-900">
                                    Follows
                                </button>
                            </div>
                            <div className="flex flex-wrap p-1">
                                {this.state.updatesComponent}
                            </div>
                            
                        </div>
                        <div className="w-full md:w-2/6 py-2 mt-4">
                            <div className="box-border mb-2 border-2 border-gray-200 dark:border-gray-900">
                                <div className="text-center border-b-2 py-1 border-gray-200 dark:border-gray-900">
                                    Top Chapters
                                </div>
                                <div className="w-full flex p-2 border-b-2 border-gray-200 dark:border-gray-900">
                                    <button onClick={() => this.changeChapterTab("6h")} className={this.state.chapterTabControl.btn6h} >
                                        6h
                                    </button>
                                    <button onClick={() => this.changeChapterTab("24h")} className={this.state.chapterTabControl.btn24h}>
                                        24h
                                    </button>
                                    <button onClick={() => this.changeChapterTab("7d")} className={this.state.chapterTabControl.btn7d}>
                                        7d
                                    </button>
                                </div>
                                <div className="p-1">
                                    {this.state.chapterComponent}
                                </div>
                            </div>
                            <div className="box-border mb-2 border-2 border-gray-200 dark:border-gray-900">
                                <div className="text-center border-b-2 py-1 border-gray-200 dark:border-gray-900">
                                    Top Manga
                                </div>
                                <div className="w-full flex p-2 border-b-2 border-gray-200 dark:border-gray-900">
                                    <button onClick={() => this.changeMangaTab("follow")} className={this.state.mangaTabControl.btnFollow} >
                                        Follows
                                    </button>
                                    <button onClick={() => this.changeMangaTab("rating")} className={this.state.mangaTabControl.btnRating}>
                                        Rating
                                    </button>
                                </div>
                                <div className="p-1">
                                    {this.state.mangaComponent}
                                </div>
                            </div>
                            <div className="box-border mb-2 border-2 border-gray-200 dark:border-gray-900">
                                <div className="text-center border-b-2 py-1 border-gray-200 dark:border-gray-900">
                                    Reading History
                                </div>
                                {this.state.history}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default Home;