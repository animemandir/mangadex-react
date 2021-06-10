import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';

class Title extends React.Component{
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

export default withRouter(Title);