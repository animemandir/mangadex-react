import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import { colorTheme } from "../util/colorTheme";
class About extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        document.title = "About - MangaDex";
    }

    render = () => {
        return (
            <div class="flex flex-col h-screen justify-between">
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto flex flex-wrap justify-between mt-2">
                        <div className="w-full my-2 mx-6">
                            <h2 className="border-b text-2xl mb-2">About</h2>
                            <p className="w-full text-justify">
                                I wanted a manga reader to resemble the old MangaDex and I wanted to relearn React so I did one on my own. 
                                Unfortunately I suck at UI and I don't care for mobiles, I'm sorry.  
                            </p>
                            <p className="w-full text-justify">
                                This app was not made to abuse MangaDex API, please don't try to.
                            </p>
                            <p className="w-full text-justify">
                                This app was made in order to review React, electron and such, I ended doing almost everything I wanted already. 
                                For more information about the project structure, access the <a className={colorTheme(500).text} href="https://github.com/Saymon600/mangadex-react" target="_blank" rel="noreferrer"> GitHub repository</a>.
                            </p>
                            <p className="w-full text-justify">
                                I have no plans to add features such as <i>upload chapters</i>, <i>report</i>, <i>create a new account</i>, <i>password recover</i> and others.
                                If you need any of above, please use the official client.
                            </p>
                            <p className="w-full text-justify">
                                I plan to give some support to this project, if you want another language on settings, bug report or some new feature, please open an issue on 
                                <a className={colorTheme(500).text} href="https://github.com/Saymon600/mangadex-react/issues" target="_blank" rel="noreferrer"> GitHub</a>.
                            </p>

                            <h2 className="border-b text-xl my-3">Alternatives:</h2>
                            <ul className="list-disc">
                                <li>
                                    <a 
                                        className={colorTheme(500).text} 
                                        href="https://mangadex.org/" target="_blank" rel="noreferrer"> 
                                        Official MangaDex Client
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        className={colorTheme(500).text} 
                                        href="https://proxy.cubari.moe/#/" target="_blank" rel="noreferrer"> 
                                        Cubari.moe
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        className={colorTheme(500).text} 
                                        href="https://tachiyomi.org/" target="_blank" rel="noreferrer"> 
                                        Tachiyomi (Android)
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        className={colorTheme(500).text} 
                                        href="https://paperback.moe/" target="_blank" rel="noreferrer"> 
                                        Paperback (iOS)
                                    </a>
                                </li>
                            </ul>

                            <h2 className="border-b text-xl my-3">To do list/Waiting for API full support/Note to self:</h2>
                            <ul className="list-disc">
                                <li>Title: stats and ratings</li>
                                <li>Title: Edit progress</li>
                                <li>MangaBox: stats and ratings</li>
                                <li>Home: Top chapters</li>
                                <li>Home: Top manga</li>
                                <li>Complete user page</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default About;