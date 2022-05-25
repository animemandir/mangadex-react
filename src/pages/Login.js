import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from "luxon";
import { isLogged } from "../util/loginUtil.js";
import { colorTheme } from "../util/colorTheme";
import { saveStorage } from "../util/persistentStore.js";
import { fetch } from '@tauri-apps/api/http';
import { Body } from "@tauri-apps/api/http"


class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: '',
            password: '',
            remember: 0,
            isLogged: false,
        };

        this.handleUser = this.handleUser.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRemember = this.handleRemember.bind(this);
        this.authLogin = this.authLogin.bind(this);
    }

    async componentDidMount(){
        document.title = "Login - MangaDex";
        let logged = await isLogged();
        if(logged){
            window.location = "#/";
        }
    }

    handleRemember = (e) => {
        if(e.target.checked){
            this.setState({remember: 1});
        }else{
            this.setState({remember: 0});
        }
    }

    handleUser = (e) => {
        this.setState({user: e.target.value});
    }

    handlePassword = (e) => {
        this.setState({password: e.target.value});
    }

    handlePwdKeypress = (e) => {
        e.preventDefault();
        if(e.key === "Enter"){
            this.authLogin(e);
        }
    }

    authLogin = (e) => {
        var $this = this;
        e.preventDefault();
        let body = Body.json({
            username: this.state.user,
            password: this.state.password
        })
        fetch('https://api.mangadex.org/auth/login',{
            method: "POST",
            body: body
        })
        .then(function(response){
            console.log(response)
            if(response.data.result === "ok"){
                localStorage.authToken = response.data.token.session;
                localStorage.authUser = $this.state.user;
                let now = DateTime.now().plus({minutes: 5});
                localStorage.authExpire = now.toSeconds();
                localStorage.authRefresh = response.data.token.refresh;
                let nowRef = DateTime.now().plus({days: 30});
                localStorage.refreshExpire = nowRef.toSeconds();
                saveStorage();
                window.location = "#/";
            }else{
                toast.error('Something went wrong. Please try again',{
                    duration: 4000,
                    position: 'top-right',
                });
            }
        })
        .catch(function(error){
            console.log(error)
            toast.error('Something went wrong. Please try again',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    render = () => {
        return (
            <div class="flex flex-col h-screen justify-between">
                <Toaster />
                <Header isLogged={this.state.isLogged} />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 h-full">
                        <div className="flex content-center items-center justify-center h-full">
                            <div className="w-full lg:w-4/12 px-4">
                                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 border-0 ">
                                    <div className="flex-auto px-4 lg:px-10 py-10 pt-0 mt-7">
                                        <form>
                                            <div className="relative w-full mb-3">
                                                <label className="block uppercase  text-xs font-bold mb-2" tmlFor="grid-password">
                                                    User
                                                </label>
                                                <input 
                                                    type="text" 
                                                    className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                                    placeholder="User"
                                                    value={this.state.user}
                                                    onChange={this.handleUser}
                                                />
                                            </div>
                                            <div className="relative w-full mb-3">
                                                <label className="block uppercase text-xs font-bold mb-2" htmlFor="grid-password">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                                                    placeholder="Password"
                                                    value={this.state.password}
                                                    onChange={this.handlePassword}
                                                    onKeyUp={this.handlePwdKeypress}
                                                />
                                            </div>
                                            <div className="hidden">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        id="rememberMe"
                                                        type="checkbox"
                                                        className="form-checkbox border-0 rounded text-gray-800 ml-1 w-5 h-5"
                                                        onChange={this.handleRemember}
                                                    />
                                                    <span className="ml-2 text-sm font-semibold">
                                                        Remember me
                                                    </span>
                                                </label>
                                            </div>
                                            <div className="text-center mt-6">
                                                <button
                                                    className={"text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:opacity-80 outline-none focus:outline-none mr-1 mb-1 w-full " + colorTheme(500).bg}
                                                    type="button"
                                                    onClick={this.authLogin}
                                                    style={{ transition: "all .15s ease" }}>
                                                    Sign In
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <Footer />
            </div>
        );
    }
} 


export default Login;