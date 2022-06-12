import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../component/Loading.js';
import { isLogged } from "../util/loginUtil.js";
import FollowGroupRow from '../component/FollowGroupRow.js';
import { fetch } from '@tauri-apps/api/http';


class FollowGroup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogged: false,
            groupFollows: [],
            totalGroups: -1,
            groupFollowOffset: 0,
        };
    }

    async componentDidMount(){    
        document.title = "Follows - MangaDex";
        var $this = this;
        isLogged().then(function(isLogged){
            if(isLogged){
                $this.setState({isLogged:isLogged});
                $this.getGroupFollows();
            }else{
                window.location = "#/";
            }
        });
    }

    getGroupFollows = () => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        let params = {
            limit: 100,
            offset: this.state.groupFollowOffset
        };
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/user/follows/group?'+query,{
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            let groups = $this.state.groupFollows;
            for(let i = 0; i < response.data.data.length; i++){
                let group = {
                    id: response.data.data[i].id,
                    name: response.data.data[i].attributes.name,
                    languages: response.data.data[i].attributes.focusedLanguages,
                    follow: true
                }
                groups.push(group);
            }

            var emptyBox = [{
                id: "",
                name: "No groups found.",
                languages: [],
                follow: false
            }];
            if(response.data.total === 0){
                groups = emptyBox;
            }

            $this.setState({
                groupFollows: groups,
                totalGroups: response.data.total
            });
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving group follows.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    render = () => {
        var loading = (this.state.groupFollows.length === 0) ? <Loading /> : "";
        var boxFollows = [];
        if(this.state.groupFollows.length >= this.state.totalGroups){
            this.state.groupFollows.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
            for(let c = 0; c < this.state.groupFollows.length; c++){
                boxFollows.push(<FollowGroupRow data={this.state.groupFollows[c]} />);
            }
        }

        return (
            <div class="flex flex-col justify-between">
                <Toaster />
                <Header isLogged={this.state.isLogged} />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between min-h-screen">
                        <div className="box-border w-full py-2 my-4 mx-2">
                            <div className="w-full border-2 border-gray-200 dark:border-gray-900">
                                <div className="text-left text-lg flex flex-wrap border-b-2 pb-1 px-3 pt-2 border-gray-200 dark:border-gray-900">
                                    <span className="">Following Groups</span>
                                </div>
                                <div className="p-3">
                                    <table class="table-fixed w-full p-2">
                                        <thead className="border-b-2 border-gray-200 dark:border-gray-900">
                                            <th className="text-left">Name</th>
                                            <th className="text-left">Languages</th>
                                            <th className="text-left">Action</th>
                                        </thead>
                                        <tbody>
                                            {boxFollows}
                                        </tbody>
                                    </table>
                                </div>                                
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default FollowGroup;