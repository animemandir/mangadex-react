import React from "react";
import { Link } from "react-router-dom";
import { colorTheme } from "../util/colorTheme";
import { saveStorage } from "../util/persistentStore";
import { fetch } from '@tauri-apps/api/http';
import { appWindow } from '@tauri-apps/api/window'

class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            search: "",
            mode: "light",
            loginDrop: {
                open: false,
                class: "hidden z-20 w-40 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-100"
            },
            followDrop: {
                open: false,
                class: "hidden z-20 w-40 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-100"
            }
        };
    }

    componentDidMount = () => {
        this.setMode();
    }

    setMode = () => {
        if(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)){
            document.documentElement.classList.add('dark');
            this.setState({mode:"dark"});
        }else{
            document.documentElement.classList.remove('dark');
            this.setState({mode:"light"});
        }
    }

    lightDarkMode = () => {
        if(localStorage.theme === 'dark'){
            localStorage.theme = 'light';
        }else{
            localStorage.theme = 'dark';
        }
        saveStorage();
        this.setMode();
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.setState({search: e.target.value});
    } 

    handleSearchKeypress = (e) => {
        e.preventDefault();
        if(e.key === "Enter"){
            this.searchManga();
        }
    }

    searchManga = () => {
        if(this.state.search.length > 2){
            window.location = "#/search?manga=" + encodeURIComponent(this.state.search);
            window.location.reload();
        }
    }

    async logout(){
        let confirm = await window.confirm("Do you want to logout?");
        if(confirm === true){
            var bearer = "Bearer " + localStorage.authToken
            fetch('https://api.mangadex.org/auth/logout',{
                method: "POST",
                headers: {  
                    Authorization: bearer
                }
            })
            .then(function(response){
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
                localStorage.removeItem("authExpire");
                localStorage.removeItem("authRefresh");
                localStorage.removeItem("refreshExpire");
                saveStorage();
                window.location.reload();
            })
            .catch(function(error){
                console.log(error);
            });
        }
    }

    toggleLoginMenu = () => {
        let loginDrop = {
            open: false,
            class: "hidden z-20 w-40 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-100"
        }
        
        if(!this.state.loginDrop.open){
            loginDrop = {
                open: true,
                class: "block absolute z-20 w-40 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-100"
            }
        }

        this.setState({loginDrop:loginDrop});
    }

    toggleFollowMenu = () => {
        let followDrop = {
            open: false,
            class: "hidden z-20 w-40 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-100"
        }
        
        if(!this.state.followDrop.open){
            followDrop = {
                open: true,
                class: "block absolute z-20 w-40 rounded bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-100"
            }
        }

        this.setState({followDrop:followDrop});
    }

    refresh = () => {
        window.location.reload();
    }

    minimize = () => {
        appWindow.minimize();
    }

    maximize = () => {
        appWindow.toggleMaximize();
    }

    closeApp = () => {
        appWindow.close();
    }

    render = () => {
        var follow = (this.props.isLogged) ? 
        <li className="nav-item">
            <button onClick={this.toggleFollowMenu} type="button" className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 focus:outline-none">
                Follow
            </button>
            <div className={this.state.followDrop.class}>
                <ul class="py-1 text-sm">
                    <li>
                        <Link to="/follow" className="block px-4 py-2 hover:opacity-80">
                            Last Updates
                        </Link>
                    </li>
                    <li>
                        <Link to="/reading_list" className="block px-4 py-2 hover:opacity-80">
                            Reading List
                        </Link>
                    </li>
                    <li>
                        <Link to="/follow_group" className="block px-4 py-2 hover:opacity-80">
                            Following Groups
                        </Link>
                    </li>
                    <li>
                        <Link to="/history" className="block px-4 py-2 hover:opacity-80">
                            History
                        </Link>
                    </li>
                </ul>
            </div>
        </li> : 
        <li className="nav-item">
            <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" to="/history">
                History
            </Link>
        </li>;

        var login = (!this.props.isLogged) ? 
        <li className="nav-item">
            <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 focus:outline-none" to="/login">
                Login
            </Link>
        </li> : 
        <li className="nav-item">
            <button onClick={this.toggleLoginMenu} type="button" className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 focus:outline-none">
                User: {localStorage.authUser}
            </button>
            <div className={this.state.loginDrop.class}>
                <ul class="py-1 text-sm">
                    <li>
                        <Link to="/user/me" className="block px-4 py-2 hover:opacity-80">
                            Profile
                        </Link>
                    </li>
                    <li>
                        <button type="button" class="block px-4 py-2 hover:opacity-80" onClick={this.logout}>Logout</button>
                    </li>
                </ul>
            </div>
        </li>;

        var mode = (this.state.mode === "dark") ?
        <li className="nav-item" title="Light mode">
            <button onClick={this.lightDarkMode} className="px-3 py-1 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 cursor-pointer focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
            </button>
        </li> :
        <li className="nav-item" title="Dark mode">
            <button onClick={this.lightDarkMode} className="px-3 py-1 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 cursor-pointer focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            </button>
        </li>;

        var windowBar = (this.state.mode === "dark") ?
        <div className="float-right">
            <img className="px-1 inline cursor-pointer w-7" onClick={this.minimize} src={process.env.PUBLIC_URL + '/minimize-dark.svg'} alt="Minimize" />
            <img className="px-1 inline cursor-pointer w-7" onClick={this.maximize} src={process.env.PUBLIC_URL + '/maximize-dark.svg'} alt="Maximize" />
            <img className="pl-1 pr-2 inline cursor-pointer w-7" onClick={this.closeApp} src={process.env.PUBLIC_URL + '/close-dark.svg'} alt="Close" />
        </div> :
        <div className="float-right">
            <img className="px-1 inline cursor-pointer w-7" onClick={this.minimize} src={process.env.PUBLIC_URL + '/minimize.svg'} alt="Minimize" />
            <img className="px-1 inline cursor-pointer w-7" onClick={this.maximize} src={process.env.PUBLIC_URL + '/maximize.svg'} alt="Maximize" />
            <img className="pl-1 pr-2 inline cursor-pointer w-7" onClick={this.closeApp} src={process.env.PUBLIC_URL + '/close.svg'} alt="Close" />
        </div>
        return (
            <div>
                <nav className="flex flex-wrap items-center justify-between px-2 py-3 bg-gray-150 text-gray-600 dark:bg-gray-900 dark:text-gray-100">
                    <div className="container px-4 mx-auto flex flex-wrap items-center justify-between z-10">
                        <div className="w-auto px-4 static block justify-start">
                            <Link to="/">
                                <img className="px-2 inline" width="50px" src={process.env.PUBLIC_URL + '/navbar.svg'} alt="MangaDex" /> MangaDex
                            </Link>
                        </div>
                        <div className="flex flex-grow">
                            <ul className="flex flex-row list-none mr-auto">
                                <li className="nav-item">
                                    <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug  hover:opacity-75" to="/search">
                                        Manga
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug  hover:opacity-75" to="/search_chapter">
                                        Chapter
                                    </Link>
                                </li>
                                {follow}
                                <li className="nav-item">
                                    <Link className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75" to="/settings">
                                        Settings
                                    </Link>
                                </li>
                                {login}
                                {mode}
                                <li className="nav-item" title="Refresh">
                                    <button type="button" onClick={this.refresh} className="px-3 py-1 flex items-center text-xs uppercase font-bold leading-snug hover:opacity-75 cursor-pointer focus:outline-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                            <div className="flex w-5/12 px-4 items-stretch ml-auto">
                                <div className="relative">
                                    <input onChange={this.handleSearch} onKeyUp={this.handleSearchKeypress} value={this.state.search} type="text" className="h-8 w-96 pl-4 pr-10 rounded focus:outline-none bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500" placeholder="Search" />
                                    <div className="absolute top-0 right-0"> 
                                        <button onClick={this.searchManga} className={"h-8 w-8 text-white rounded focus:outline-none " + colorTheme(500).bg + " hover:" + colorTheme(400).bg}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {windowBar}
                </nav>
            </div>
        );
    }
}




export default Header;