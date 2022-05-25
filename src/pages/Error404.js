import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import { isLogged } from "../util/loginUtil.js";

class Error404 extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogged: false,
        };
    }

    componentDidMount = () => {
        document.title = "About - MangaDex";
        var $this = this;
        isLogged().then(function(isLogged){
            $this.setState({isLogged:isLogged});
        });
    }

    render = () => {
        return (
            <div class="flex flex-col h-screen justify-between">
                <Header isLogged={this.state.isLogged} />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto p-4 flex flex-wrap items-center justify-between">
                        <p>404 Not Found</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default Error404;