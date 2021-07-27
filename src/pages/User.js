import React from "react";
import { withRouter } from "react-router";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

class User extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            name: ""
        };
    }

    componentDidMount = () => {
        document.title = "User - MangaDex";
        const id = this.props.match.params.id;
        this.setState({id:id});

        this.getUserInfo(id);
    }

    getUserInfo = (id) => {
        var $this = this;
        axios.get('https://api.mangadex.org/user/' + id)
        .then(function(response){
            let name = "";
            name = response.data.data.attributes.username;

            document.title = "User: " + name + " - Mangadex";
            $this.setState({
                name: name
            });
        })
        .catch(function(error){
            toast.error('Error retrieving user data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    render = () => {
        return (
            <div class="flex flex-col h-screen justify-between">
                <Toaster />
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full py-2 mt-6 mb-2 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-left text-lg flex flex-wrap border-b-2 pb-1 px-3 border-gray-200 dark:border-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-1 mt-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                </svg>
                                <span className="ml-2">{this.state.name}</span>
                            </div>
                            <div className="w-full flex">
                                <table class="table-auto w-full mx-3 my-2">
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">User ID:</td>
                                        <td width="80%">{this.state.id}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        {/* Manga and chapters */}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default withRouter(User);