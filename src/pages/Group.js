import React from "react";
import { withRouter } from "react-router";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Link } from "react-router-dom";
import { colorTheme } from "../util/colorTheme";
class Group extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            name: "",
            leader: [],
            members: []
        };
    }

    componentDidMount = () => {
        document.title = "Group - MangaDex";
        const id = this.props.match.params.id;
        this.setState({id:id});

        this.getGroupInfo(id);
    }

    getGroupInfo = (id) => {
        var $this = this;
        axios.get('https://api.mangadex.org/group/' + id)
        .then(function(response){
            let name = "";
            let leader = [];
            let members = [];

            name = response.data.data.attributes.name;
            // leader.push({
            //     id: response.data.data.attributes.leader.id,
            //     name: response.data.data.attributes.leader.attributes.username
            // });
            // response.data.data.attributes.members.map((member) => {
            //     members.push({
            //         id: member.id,
            //         name: member.attributes.username
            //     });
            // });

            document.title = "Group: " + name + " - Mangadex";
            $this.setState({
                name: name,
                leader: leader,
                members: members
            });
        })
        .catch(function(error){
            toast.error('Error retrieving group data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    render = () => {
        var leader = this.state.leader.map((l) => 
            <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <Link className={"hover:opacity-75 mr-3 " + colorTheme(500).text} to={"/user/" + l.id}>{l.name}</Link>
            </div>
        );
        var member = this.state.members.map((m) => 
            <div className="flex flex-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <Link className={"hover:opacity-75 mr-3 " + colorTheme(500).text} to={"/user/" + m.id}>{m.name}</Link>
            </div>
        );
        return (
            <div class="flex flex-col h-screen justify-between">
                <Toaster />
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full py-2 mt-6 mb-2 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-left text-lg flex flex-wrap border-b-2 pb-1 px-3 border-gray-200 dark:border-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2 mt-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                <span className="ml-2">{this.state.name}</span>
                            </div>
                            <div className="w-full flex">
                                <table class="table-auto w-1/2 mx-3 my-2">
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Group ID:</td>
                                        <td width="80%">{this.state.id}</td>
                                    </tr>
                                    {/* <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Alt name:</td>
                                        <td width="80%"></td>
                                    </tr>
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Stats:</td>
                                        <td width="80%"></td>
                                    </tr>
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Links:</td>
                                        <td width="80%"></td>
                                    </tr> */}
                                </table>
                                <table class="table-auto w-1/2 mx-3 my-2">
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Leader:</td>
                                        <td width="80%">{leader}</td>
                                    </tr>
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Members:</td>
                                        <td width="80%">{member}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                        <div className="hidden box-border w-full py-2 mt-6 mb-2 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-left text-lg flex flex-wrap border-b-2 pb-1 px-3 border-gray-200 dark:border-gray-900">
                                <span className="mr-2">Description</span>
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


export default withRouter(Group);