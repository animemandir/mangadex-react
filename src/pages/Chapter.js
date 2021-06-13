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
            }
        };

        this.changeImageFit = this.changeImageFit.bind(this);
    }

    componentDidMount = () => {
        const id = this.props.match.params.id;
        this.setState({id:id});

        this.initReader();
        // this.getChapter(id);
    }

    getChapter = (id) => {
        axios.get('https://api.mangadex.org/chapter/' + id,{
            params: {
                includes: ["scanlation_group","manga"]
            }
        })
        .then(function(response){
            console.log(response);
            // let list = $this.state.chapterList;
            // for(let i = 0; i < response.data.results.length; i++){
            //     list.push(<TitleTableRow data={response.data.results[i]}/>)
            // }

            // $this.setState({chapterList: list});
        })
        .catch(function(error){
            console.log(error);
        });
    }

    initReader = () => {
        this.setMode();
        this.setMenu();
        this.setFit();
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
        console.log(fit)
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

    render = () => {
        return (
            <div class="flex flex-col justify-between">
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="flex h-screen">
                    {/* flex justify-center items-center */}
                        <div className="flex-1 flex overflow-hidden">
                            <div className="flex-1 overflow-y-auto no-scrollbar">
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
                                    <Link className="hover:opacity-75" to={"/title/"}>Oshi no Ko</Link>
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
                                        <select className="w-full p-1 m-2 focus:outline-none dark:bg-gray-700">
                                            <option value="1">Chapter 1</option>
                                            <option value="2">Chapter 2 - Long Long Long Long Long Long name</option>
                                            <option value="3">Chapter 3</option>
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
                                <div className="flex-grow">
                                    <div className="flex flex-row pl-3 pt-2 pb-2 border-b-2 border-gray-200 dark:border-gray-900">
                                        <span className="pt-3 mr-4">Theme:</span>
                                        <button onClick={this.lightDarkMode} className={this.state.btnTheme.light} title="Light Mode">
                                            Light
                                        </button>
                                        <button onClick={this.lightDarkMode} className={this.state.btnTheme.dark} title="Dark Mode">
                                            Dark
                                        </button>
                                    </div>
                                    <div className="flex flex-row pl-3 pt-2 pb-2 border-b-2 border-gray-200 dark:border-gray-900">
                                        <span className="pt-3 mr-4">Image Fit:</span>
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
                                    <div className="flex flex-row pl-3 pt-2 pb-2 border-b-2 border-gray-200 dark:border-gray-900">
                                        <span className="pt-3 mr-4">Layout:</span>
                                        <button className="text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900" >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900" >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                        <button className="text-center px-3 py-1 m-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900" >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <footer class="footer relative pt-2">
                                    <div className="text-center text-lg py-2 border-t-2  border-gray-200 dark:border-gray-900">
                                        <span>Page 1/20</span> 
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mx-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
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