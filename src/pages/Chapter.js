import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';

class Chapter extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount = () => {
        const id = this.props.match.params.id;
        console.log(id);
    }

    render = () => {
        return (
            <div class="flex flex-col h-screen justify-between">
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(Chapter);