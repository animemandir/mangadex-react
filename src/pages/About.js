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
                    Using this as a todo list/note to self
                    Settings Page
                    Quick search
                    Search
                    Follows 
                    Login
                    Title page load all chapter
                    Title page clean if it doesn't have any info
                    Title page chapter/cover tab bug
                    Title page author/artist links
                    Loading/loader
                    Catch Error UI message zzzzzzzzzzzzzzz
                    Setting hide progress bar 
                    Setting switch data/dataSaver
                    Site color setting (default blue)
                    user page 
                    group page 
                    author page/redirect to search (check what's best)
                    header dark/light mode icon: change light mode icon
                    Heroku deploy 
                </div>
                <Footer />
            </div>
        );
    }
} 


export default About;