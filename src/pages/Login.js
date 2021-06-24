import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from "luxon";
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user: '',
            password: '',
            remember: 0
        };

        this.handleUser = this.handleUser.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleRemember = this.handleRemember.bind(this);
        this.authLogin = this.authLogin.bind(this);
    }

    componentDidMount = () => {
        document.title = "Login - MangaDex";
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

    authLogin = (e) => {
        var $this = this;
        e.preventDefault();
        axios.post('https://api.mangadex.org/auth/login',{
            username: this.state.user,
            password: this.state.password
        })
        .then(function(response){
            if(response.data.result == "ok"){
                localStorage.authToken = response.data.token.session;
                localStorage.authUser = $this.state.user;
                let now = DateTime.now().plus({minutes: 15});
                localStorage.authExpire = now.toSeconds();
                if($this.state.remember == 1){
                    localStorage.authRefresh = response.data.token.refresh;
                    let nowRef = DateTime.now().plus({days: 30});
                    localStorage.refreshExpire = nowRef.toSeconds();
                }
                window.location = "#/";
            }else{
                toast.error('Something went wrong. Please try again',{
                    duration: 4000,
                    position: 'top-right',
                });
            }
        })
        .catch(function(error){
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
                <Header />
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
                                                />
                                            </div>
                                            <div>
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
                                                    className="bg-blue-500 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:opacity-80 outline-none focus:outline-none mr-1 mb-1 w-full"
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