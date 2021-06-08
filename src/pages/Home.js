import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';

class Home extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        document.title = "Home - MangaDex";
    }

    render = () => {
        return (
            <div class="flex flex-col h-screen justify-between">
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    a
                </div>
                <Footer />
            </div>
        );
    }
} 


export default Home;