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
                    <div className="container relative m-16">
                        <p>Using this as a todo list/note to self (not a priority list):</p>
                        <ul className="list-disc ml-4">
                            <li>Settings Page </li>
                            <li>Quick search</li>
                            <li>Search</li>
                            <li>Follows </li>
                            <li>Title page clean if it doesn't have any info</li>
                            <li>Title page author/artist links</li>
                            <li>Setting hide progress bar</li>
                            <li>Setting switch data/dataSaver</li>
                            <li>Site color setting (default blue)</li>
                            <li>user page </li>
                            <li>group page </li>
                            <li>author page/redirect to search (check what's best)</li>
                            <li>header dark/light mode icon: change light mode icon</li>
                            <li>Heroku deploy </li>
                            <li>Replace moment with luxon </li>
                            <li>Bug on title/c78418b0-1941-4874-8283-14d5a72f4fc1</li>
                            <li>Reader next/prev page to next/prev chapter resulting on progress 0 or bigger than page count</li>
                            <li>do a better layout for reader settings in chapter lmaoo</li>
                        </ul>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default About;