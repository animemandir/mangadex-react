import React from "react";
import axios from 'axios';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import HomeUpdates from '../component/HomeUpdates.js';
import Loading from '../component/Loading.js';
import toast, { Toaster } from 'react-hot-toast';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lastChapters: [],
            lastChaptersData: [],
            updatesComponent: <Loading />
        };
    }

    componentDidMount = () => {
        document.title = "Home - MangaDex";
        this.getLastChapters();
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
                        <div className="box-border w-full md:w-2/6 py-2 mt-6 mb-6 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-center border-b-2 pb-1 border-gray-200 dark:border-gray-900">
                                Top Chapters
                            </div>
                            {/* <div>
                                <button className="w-1/3 text-center p-2 border-b-2 border-r-2 border-gray-200 dark:border-gray-900">
                                    6h
                                </button>
                                <button className="w-1/3 text-center p-2 border-b-2 border-r-2 border-gray-200 dark:border-gray-900">
                                    24h
                                </button>
                                <button className="w-1/3 text-center p-2 border-b-2 border-gray-200 dark:border-gray-900">
                                    7d
                                </button>
                            </div> */}
                            <div className="h-auto p-4">
                                {/* <p>Coming when api supports it</p> */}
                                {/* <Loading /> */}
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