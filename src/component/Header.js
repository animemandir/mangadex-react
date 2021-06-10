import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";

class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    
        this.lightDarkMode = this.lightDarkMode.bind(this);
    }

    componentDidMount = () => {
        this.setMode();
    }

    setMode = () => {
        if(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)){
            document.documentElement.classList.add('dark');
        }else{
            document.documentElement.classList.remove('dark');
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

    isLogged = () => {
        console.log("b");
    }

    render = () => {
        return (
            <div>
                <nav className="relative flex flex-wrap items-center justify-between px-2 py-3  bg-gray-150 text-gray-600 dark:bg-gray-900 dark:text-gray-100">
                    <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
                        <div className="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
                            <Link to="/">
                                <img className="px-2 inline" width="50px" src={process.env.PUBLIC_URL + '/navbar.svg'} /> MangaDex
                            </Link>
                        </div>
                        <div className="lg:flex flex-grow items-center" id="example-navbar-warning">
                            <ul className="flex flex-col lg:flex-row list-none mr-auto">
                                <li className="nav-item">
                                    <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug  hover:opacity-75" to="/search">
                                        Manga
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" to="/follow">
                                        Follows
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" to="/settings">
                                        Settings
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <a onClick={this.lightDarkMode} className="px-3 py-1 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
                                    </a>
                                </li>
                            </ul>
                            <div class="relative flex w-full sm:w-7/12 md:w-5/12 px-4 flex-wrap items-stretch lg:ml-auto">
                                <div class="flex">
                                    <span class="font-normal leading-snug flex text-center white-space-no-wrap border border-solid items-center rounded-r-none pl-2 py-1 rounded-full text-sm border-r-0 border-gray-600 dark:border-gray-1000 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-800 dark:placeholder-gray-100">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </div>
                                <input type="text" class="px-2 py-1 h-8 border border-solid rounded-full text-sm leading-snug shadow-none outline-none focus:outline-none w-full font-normal rounded-l-none flex-1 border-l-0 border-gray-600 dark:border-gray-1000 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-800 dark:placeholder-gray-100" placeholder="Search"/>
                            </div>
                        </div>
                    </div>
                </nav>
    
            </div>
        );
    }
}




export default Header;