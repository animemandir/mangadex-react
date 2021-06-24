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
                        <p className="w-full">Fucking forgot totally about cors now I need a fucking proxy</p>
                        <p className="w-full">Using this as a todo list/note to self (not a priority list):</p>
                        <ul className="list-disc ml-4">
                            <li>Setting hide progress bar</li>
                            <li>Setting switch data/dataSaver</li>
                            <li>Site color setting (default blue)</li>
                            <li>User page </li>
                            <li>Group page </li>
                            <li>Title page clean if it doesn't have any info</li>
                            <li>Do a better layout for reader settings in chapter lmaoo</li>
                            <li>Adjust border bottom when hiding search form</li>
                        </ul>

                        <p className="w-full mt-3">Waiting for API full support:</p>
                        <ul className="list-disc ml-4">
                            <li>Title: stats and ratings</li>
                            <li>Title: Edit progress</li>
                            <li>Search: stats and ratings</li>
                            <li>Follow/Unfollow manga</li>
                            <li>Mark/Unmark chapter as read (?)</li>
                            <li>Home: Top chapters</li>
                            <li>Home: Top manga</li>
                        </ul>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default About;