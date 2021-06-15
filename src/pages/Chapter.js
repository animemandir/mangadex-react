import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from 'axios';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';

class Chapter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            mangaId: "",
            manga: "",
            groupId: "",
            group: "",
            userId: "",
            user: "",
            hash: "",
            data: [],
            dataSaver: [],
            baseUrl: "",
            chapterList: [],

            classMenuA: "w-3/12 flex flex-wrap",
            classMenuB: "hidden",
            classImg: "object-contain",
            btnTheme: {
                light: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                dark: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900"
            },
            btnFit: {
                original: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                width: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                height: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
            },
            btnLayout: {
                left: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                right: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                single: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
            }
        };

        this.changeImageFit = this.changeImageFit.bind(this);
    }

    componentDidMount = () => {
        const id = this.props.match.params.id;
        this.setState({id:id});

        this.initReader();
        this.getChapter(id);
        this.getBaseUrl(id);
    }

    getChapter = (id) => {
        var $this = this;
        axios.get('https://api.mangadex.org/chapter/' + id,{
            params: {
                includes: ["scanlation_group","manga","user"]
            }
        })
        .then(function(response){
            console.log(response);
            let mangaId = "";
            let manga = "";
            let groupId = "";
            let group = "";
            let userId = "";
            let user = "";
            let hash = "";
            let data = [];
            let dataSaver = [];

            response.data.relationships.map((relation) => {
                switch(relation.type){
                    case "manga":
                        mangaId = relation.id;
                        Object.keys(relation.attributes.title).map(function(key){
                            if(key == "en" || manga == ""){
                                manga = relation.attributes.title[key];
                            }
                        });
                    break;
                    case "scanlation_group":
                        groupId = relation.id;
                        group = relation.attributes.name;
                    break;
                    case "user":
                        userId = relation.id;
                        user = relation.attributes.username;
                    break;
                }
            });

            hash = response.data.data.attributes.hash;
            data = response.data.data.attributes.data;
            dataSaver = response.data.data.attributes.dataSaver;

            $this.setState({
                mangaId: mangaId,
                manga: manga,
                groupId: groupId,
                group: group,
                userId: userId,
                user: user,
                hash: hash,
                data: data,
                dataSaver: dataSaver
            });

            $this.getChapterList(mangaId,0);
        })
        .catch(function(error){
            console.log(error);
        });
    }

    getBaseUrl = (id) => {
        var $this = this;
        axios.get('https://api.mangadex.org/at-home/server/' + id)
        .then(function(response){
            console.log(response);

            let baseUrl = "";
            baseUrl = response.data.baseUrl;

            $this.setState({
                baseUrl: baseUrl
            });
        })
        .catch(function(error){
            console.log(error);
        });
    }

    getChapterList = (id,offset) => {
        var $this = this;
        axios.get('https://api.mangadex.org/chapter?order[chapter]=desc',{
            params: {
                manga: id,
                translatedLanguage: ['en'],
                includes: ["scanlation_group","user"],
                offset: offset,
                limit: 100
            }
        })
        .then(function(response){
            let list = $this.state.chapterList;
            for(let i = 0; i < response.data.results.length; i++){
                let label = "";
                if(response.data.results[i].data.attributes.volume){
                    label += "Volume " + response.data.results[i].data.attributes.volume + " ";
                }
                if(response.data.results[i].data.attributes.chapter){
                    label += "Chapter " + response.data.results[i].data.attributes.chapter + " ";
                }
                if(response.data.results[i].data.attributes.title){
                    label += "- " + response.data.results[i].data.attributes.title;
                }
                list.push({
                    id: response.data.results[i].data.id,
                    label: label
                });
            }

            $this.setState({chapterList: list});
            if(response.data.total >= (offset+100)){
                $this.getChapterList(id,offset+100);
            }

            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        });
    }

    initReader = () => {
        this.setMode();
        this.setMenu();
        this.setFit();
        this.setLayout();
    }

    setMode = () => {
        if(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)){
            document.documentElement.classList.add('dark');
            this.setState({btnTheme: {
                light: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                dark: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200"
            }});
        }else{
            document.documentElement.classList.remove('dark');
            this.setState({btnTheme: {
                light: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                dark: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900"
            }});
        }
    }

    lightDarkMode = () => {
        if(localStorage.theme === 'dark'){
            localStorage.theme = 'light';
        }else{
            localStorage.theme = 'dark';
        }

        this.setMode();
    }

    toggleMenu = () => {
        localStorage.showReaderMenu = (localStorage.showReaderMenu == 1) ? 0 : 1;
        this.setMenu();
    }

    setMenu = () => {
        if(localStorage.showReaderMenu == 1){
            this.setState({
                classMenuA: "w-3/12 flex flex-wrap",
                classMenuB: "hidden",
            });
        }else{
            this.setState({
                classMenuA: "hidden",
                classMenuB: "w-12 hover:opacity-75 cursor-pointer flex h-screen justify-center items-center border-l-4 border-gray-200 dark:border-gray-900 dark:text-gray-900",
            });
        }
    }

    changeImageFit = (fit) => {
        localStorage.imageFit = fit;
        this.setFit();
    }

    setFit = () => {
        switch(localStorage.imageFit){
            case "original":
                this.setState({
                    btnFit: {
                        original: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        width: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        height: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    },
                    classImg: "object-none"
                });
            break;
            case "height":
                this.setState({
                    btnFit: {
                        original: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        width: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        height: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                    },
                    classImg: "h-screen"
                });
            break;
            case "width":
            default:
                this.setState({
                    btnFit: {
                        original: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        width: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        height: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    },
                    classImg: "object-contain"
                });            
            break;
        }
    }

    changeReaderLayout = (layout) => {
        localStorage.readerlayout = layout;
        this.setLayout();
    }

    setLayout = () => {
        switch(localStorage.readerlayout){
            case "right":
                this.setState({
                    btnLayout: {
                        left: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        single: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        right: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                    }
                });
            break;
            case "single":
                this.setState({
                    btnLayout: {
                        left: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        single: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        right: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    }
                });            
            break;
            case "left":
            default:
                this.setState({
                    btnLayout: {
                        left: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        single: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        right: "text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    }
                });
            break;
        }
    }


    clickListener = (e) => {
        let readerwidth = document.getElementById('mainReader').clientWidth;
        if(e.clientX <= (readerwidth/2)){
            this.leftSide();
        }else{
            this.rightSide();
        }
        e.preventDefault();
    }
    
    leftSide = () => {
        console.log("left");
    }

    rightSide = () => {
        console.log("right");
    }

    render = () => {
        var chapterList = this.state.chapterList.map((i) => <option value={i.id}>{i.label}</option>);
        return (
            <div class="flex flex-col justify-between">
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="flex h-screen">
                        <div className="flex-1 flex overflow-hidden" id="mainReader" onClick={this.clickListener}>
                            <div className="flex-1 overflow-y-auto scrollbar-blue">
                                <div className="flex flex-row justify-center items-center">
                                    <img 
                                        alt="page"
                                        className={this.state.classImg}
                                        src="https://guya.moe/media/manga/Original-Hinatazaka/chapters/0001_x5w805dw/9/04.png?v4" />
                                </div>
                                <div className="flex flex-row justify-center items-center">
                                    <img 
                                        alt="page"
                                        className={this.state.classImg}
                                        src="https://guya.moe/media/manga/Original-Hinatazaka/chapters/0001_x5w805dw/9/04.png?v4" />
                                </div>
                                <div className="flex flex-row justify-center items-center">
                                    <img 
                                        alt="page"
                                        className={this.state.classImg}
                                        src="https://guya.moe/media/manga/Original-Hinatazaka/chapters/0001_x5w805dw/9/04.png?v4" />
                                </div>
                            </div>   
                        </div>
                        

                        {/* <div className="w-2 flex flex-col">
                            <div className="flex-grow bg-blue-600 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                            <div className="flex-grow bg-blue-200 border-b-2 border-gray-900"></div>
                        </div> */}
                        
                        <div className={this.state.classMenuA}>
                            <div onClick={this.toggleMenu} title="Hide Menu" className="w-12 hover:opacity-75 cursor-pointer h-screen flex justify-center items-center border-l-4 border-r-4 border-gray-200 dark:border-gray-900 dark:text-gray-900">
                                <div className="mx-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col h-screen justify-between">  
                                <div className="text-center text-lg py-2 border-b-2  border-gray-200 dark:border-gray-900">
                                    <Link className="hover:opacity-75 text-blue-500" to={"/title/" + this.state.mangaId}>{this.state.manga}</Link>
                                </div>
                                <div className="flex flex-wrap border-b-2 pb-1 border-gray-200 dark:border-gray-900">
                                    <div className="w-1/6 cursor-pointer justify-center items-center flex">
                                        <div className="mx-2 hover:opacity-75 dark:text-gray-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="w-4/6 content-center">
                                        <select className="w-full p-1 m-2 focus:outline-none dark:bg-gray-700 scrollbar-blue" value={this.state.id}>
                                            {chapterList}
                                        </select>
                                    </div>
                                    <div className="w-1/6 cursor-pointer justify-center items-center flex">
                                        <div className="mx-2 hover:opacity-75 dark:text-gray-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>    
                                <div className="flex justify-center items-center text-center py-2 border-b-4  border-gray-200 dark:border-gray-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                    <Link className="hover:opacity-75 text-blue-500" to={"/group/" + this.state.groupId}>{this.state.group}</Link>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                    </svg>
                                    <Link className="hover:opacity-75 text-blue-500" to={"/user/" + this.state.userId}>{this.state.user}</Link>
                                </div>             
                                <div className="flex-grow mt-4">
                                    <div className="flex flex-row pl-3 py-2 border-b- border-gray-200 dark:border-gray-900">
                                        <span className="pt-3 mr-4">Theme:</span>
                                        <button onClick={this.lightDarkMode} className={this.state.btnTheme.light} title="Light Mode">
                                            Light
                                        </button>
                                        <button onClick={this.lightDarkMode} className={this.state.btnTheme.dark} title="Dark Mode">
                                            Dark
                                        </button>
                                    </div>
                                    <div className="flex flex-row pl-3 py-2 border-b- border-gray-200 dark:border-gray-900">
                                        <span className="pt-3 mr-3">Image Fit:</span>
                                        <button onClick={() => this.changeImageFit("original")} className={this.state.btnFit.original} title="Original size">
                                            1:1
                                        </button>
                                        <button onClick={() => this.changeImageFit("width")} className={this.state.btnFit.width}  title="Fit Width">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => this.changeImageFit("height")} className={this.state.btnFit.height} title="Fit Height">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex flex-row pl-3 py-2 border-b- border-gray-200 dark:border-gray-900">
                                        <span className="pt-3 mr-4">Layout:</span>
                                        <button onClick={() => this.changeReaderLayout("left")} className={this.state.btnLayout.left} >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                        <button onClick={() => this.changeReaderLayout("right")} className={this.state.btnLayout.right} >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                        <button onClick={() => this.changeReaderLayout("single")} className={this.state.btnLayout.single} >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <footer class="footer relative pt-2">
                                    <div className="text-center text-lg py-2 border-t-2  border-gray-200 dark:border-gray-900">
                                        <span>Page 1/20</span> 
                                    </div>
                                    <div className="text-center text-lg py-2 border-t-2  border-gray-200 dark:border-gray-900">
                                        <Link className="text-blue-600 hover:opacity-75" to={"/"}>Home</Link>
                                    </div>
                                </footer>
                            </div>
                        </div>

                        <div title="Show Menu" onClick={this.toggleMenu} className={this.state.classMenuB}>
                            <div className="mx-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Chapter);