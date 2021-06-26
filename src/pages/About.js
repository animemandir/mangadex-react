import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';

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
                    <div className="container mx-auto flex flex-wrap justify-between mt-6">
                        <div className="w-full">
                            
                        </div>

                        <p className="w-full">Using this as a todo list/note to self (not a priority list):</p>
                        <ul className="list-disc ml-4">
                            <li>Title/Search: redirect demographic,theme,genre,content rating to search</li>
                            <li>Search: random</li>                            
                        </ul>

                        <p className="w-full mt-3">Waiting for API full support</p>
                        <ul className="list-disc ml-4">
                            <li>Title: stats and ratings</li>
                            <li>Title: Edit progress</li>
                            <li>MangaBox: stats and ratings</li>
                            <li>Follow/Unfollow manga</li>
                            <li>Mark/Unmark/Show chapter as read</li>
                            <li>Home: Top chapters</li>
                            <li>Home: Top manga</li>
                            <li>Search: Order (waiting more options)</li>
                            <li>Complete user page </li>
                            <li>Complete group page </li>
                        </ul>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default About;