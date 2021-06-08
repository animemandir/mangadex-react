import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';

class Error404 extends React.Component{
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
                    <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
                        <p>404 Not Found</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default Error404;