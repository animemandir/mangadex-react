import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from 'axios';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';

class Chapter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: ''
        };
    }

    componentDidMount = () => {
        const id = this.props.match.params.id;
        this.setState({id:id});
        this.getChapter(id);
    }

    getChapter = (id) => {
        axios.get('https://api.mangadex.org/chapter/' + id,{
            params: {
                includes: ["scanlation_group","manga"]
            }
        })
        .then(function(response){
            console.log(response);
            // let list = $this.state.chapterList;
            // for(let i = 0; i < response.data.results.length; i++){
            //     list.push(<TitleTableRow data={response.data.results[i]}/>)
            // }

            // $this.setState({chapterList: list});
        })
        .catch(function(error){
            console.log(error);
        });
    }

    render = () => {
        return (
            <div class="flex flex-col h-screen justify-between">
                {/* <Header />               */}
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="flex flex-wrap">
                        <div className="w-9/12">
                            <p>a</p>
                        </div>
                        <div className="w-3/12 flex flex-wrap">
                            <div className="w-1/12 cursor-pointer flex h-screen justify-center items-center border-l-4 border-r-4 border-gray-200 dark:border-gray-900 dark:text-gray-900">
                                <div className="mx-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                <div className="mx-2 hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-11/12">
                                <div className="text-center text-lg border-b-4 pb-1 border-gray-200 dark:border-gray-900">
                                    <Link to={"/title/"}>Oshi no Ko</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Footer /> */}
            </div>
        );
    }
}

export default withRouter(Chapter);