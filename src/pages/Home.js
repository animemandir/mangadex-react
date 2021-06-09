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
        // https://api.mangadex.org/list/8018a70b-1492-4f91-a584-7451d7787f7a "Featured"
        // https://api.mangadex.org/manga?limit=20&order[createdAt]=desc newest
        // https://api.mangadex.org/chapter?limit=12&order[publishAt]=desc last chapters
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