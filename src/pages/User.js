import React from "react";
import { withRouter } from "react-router";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Tags from '../component/Tags.js';
import FollowChapterRow from '../component/FollowChapterRow.js';
import Loading from '../component/Loading.js';
import { isLogged } from "../util/loginUtil.js";

class User extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            name: "",
            image: process.env.PUBLIC_URL + "/notfound.png",
            version: "",
            roles: [],
            groupsId: [],
            groups: [],
            uploadCount: 0,
            isLogged: false,

            chapterList: [],
            chapterOffset: 0,
            showChapterLoad: false,
            loadControl: {
                btnClass: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900 mt-4",
                btnLabel: "Load More"
            }
        };
    }

    async componentDidMount(){
        document.title = "User - MangaDex";
        const id = this.props.match.params.id;
        let logged = await isLogged();
        this.setState({
            id:id,
            isLogged: logged
        },() => this.getUserFeed());

        this.getUserInfo(id);
    }

    getUserInfo = (id) => {
        var $this = this;
        axios.get('https://api.mangadex.org/user/' + id)
        .then(function(response){
            let name = "";
            let version = "";
            let roles = [];
            let groupsId = [];
            name = response.data.data.attributes.username;
            version = response.data.data.attributes.version;

            response.data.data.attributes.roles.map((relation) => {
                roles.push(relation.replace(/^ROLE_/,'').replace(/_/g,' ')); 
            });

            response.data.data.relationships.map((relation) => {
                if(relation.type === "scanlation_group"){
                    groupsId.push(relation.id);
                }
            });

            document.title = "User: " + name + " - Mangadex";
            $this.setState({
                name: name,
                version: version,
                roles: roles,
                groupsId: groupsId
            },() => {
                if($this.state.groupsId.length > 0){
                    $this.getGroups();
                }
            });
        })
        .catch(function(error){
            console.log(error)
            toast.error('Error retrieving user data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getGroups = () => {
        var $this = this;
        axios.get('https://api.mangadex.org/group',{
            params: {
                ids: this.state.groupsId
            }
        })
        .then(function(response){
            let groups = [];
            response.data.data.map((result) => {
                let name = result.attributes.name;
                let id = result.id;
                groups.push({id:id,name:name});
            });
            $this.setState({
                groups: groups
            });
        })
        .catch(function(error){
            console.log(error)
            toast.error('Error retrieving user data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getUserFeed = () => {
        var translatedLanguage = ["en"];
        if(localStorage.language){
            translatedLanguage = JSON.parse(localStorage.language);
        }
        var $this = this;
        this.setState({
            loadControl: {
                btnClass: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900 mt-4",
                btnLabel:  
                <div className="inline-flex">
                    <span className="mr-2">Loading</span> 
                    <img className="w-6 h-6" alt="Loading" src={process.env.PUBLIC_URL + '/spin.svg'} />
                </div>
            }
        });
        axios.get('https://api.mangadex.org/chapter?order[createdAt]=desc',{
            params: {
                uploader: this.state.id, 
                translatedLanguage: translatedLanguage,
                offset: this.state.chapterOffset,
                limit: 50
            }
        })
        .then(function(response){
            let list = [];
            let mangaList = [];
            for(let i = 0; i < response.data.data.length; i++){
                list.push(response.data.data[i].id);
                response.data.data[i].relationships.map((relation) => {
                    if(relation.type === "manga"){
                        mangaList.push(relation.id);
                    }
                });
            }

            $this.setState({
                uploadCount: response.data.total
            });

            if(response.data.total > 0){
                if($this.state.isLogged){
                    $this.getChapterRead(list,mangaList,response.data.total);
                }else{
                    $this.getChapterInfo(list,[],response.data.total);
                }
            }else{
                $this.setState({
                    chapterList: 
                    <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                        <td></td>
                        <td>No chapters found</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                })
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving chapter feed list.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getChapterRead = (chapterList,mangaList,totalOffset) => {
        var $this = this;
        var bearer = "Bearer " + localStorage.getItem("authToken");
        axios.get('https://api.mangadex.org/manga/read',{
            params: {
                ids: mangaList,
                grouped: true
            },
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            let readList = response.data.data;
            $this.getChapterInfo(chapterList,readList,totalOffset);
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving read markers list.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getChapterInfo = (list,readList,totalOffset) => {
        var translatedLanguage = ["en"];
        if(localStorage.language){
            translatedLanguage = JSON.parse(localStorage.language);
        }
        var $this = this;
        axios.get('https://api.mangadex.org/chapter?order[createdAt]=desc',{
            params: {
                ids: list,
                translatedLanguage: translatedLanguage,
                includes: ["scanlation_group","user","manga"],
                limit: 50
            }
        })
        .then(function(response){
            let list = $this.state.chapterList;
            for(let i = 0; i < response.data.data.length; i++){
                response.data.data[i].read = false;
                response.data.data[i].isLogged = $this.state.isLogged;
                response.data.data[i].relationships.map((relation) => {
                    if(relation.type === "manga" && Object.keys(readList).indexOf(relation.id) > -1){
                        if(readList[relation.id].indexOf(response.data.data[i].id) > -1){
                            response.data.data[i].read = true;
                        }
                    }
                });
                list.push(<FollowChapterRow data={response.data.data[i]}/>)
            }

            let offset = parseInt($this.state.chapterOffset) + 50;
            let showMore = true;
            if(offset >= totalOffset){
                showMore = false;
            }

            $this.setState({
                chapterList: list,
                chapterOffset: offset,
                showChapterLoad: showMore,
                loadControl: {
                    btnClass: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900 mt-4",
                    btnLabel: "Load More"
                }
            });
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving chapter list.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    chapterLoadMore = () => {
        this.getUserFeed();
    }

    render = () => {
        var roles = this.state.roles.map((r) => <Tags name={r} url="" />);
        var groups = this.state.groups.map((g) => <Tags name={g.name} url={"/group/" + g.id} />);

        var chapterLoading = (this.state.chapterList.length <= 0) ? <Loading /> : "";
        var loadMore = (this.state.showChapterLoad) ? 
        <button 
            onClick={this.chapterLoadMore} 
            className={this.state.loadControl.btnClass} >
            {this.state.loadControl.btnLabel}
        </button> : "";

        var thRead = "";
        if(this.state.isLogged){
            thRead = 
            <th className="w-8" title="Read">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </th>
        }

        return (
            <div class="flex flex-col justify-between h-screen bg-gray-100 dark:bg-gray-800">
                <Toaster />
                <Header isLogged={this.state.isLogged} />
                <div className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full py-2 mt-6 mb-2 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-left text-lg flex flex-wrap border-b-2 pb-1 px-3 border-gray-200 dark:border-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-1 mt-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                </svg>
                                <span className="ml-2">{this.state.name}</span>
                            </div>
                            <div className="flex flex-wrap">
                                <div className="content flex w-full mt-2">
                                    <img 
                                        className="object-contain flex items-start w-full sm:w-1/4 p-3"
                                        alt={this.state.name}
                                        src={this.state.image} />
                                    <div className="item-body w-full sm:w-3/4 p-3">
                                        <table class="table-auto w-full p-2">
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">User ID:</td>
                                                <td width="80%">{this.state.id}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Version:</td>
                                                <td width="80%">{this.state.version}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Uploads:</td>
                                                <td width="80%">{this.state.uploadCount}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Roles:</td>
                                                <td width="80%">{roles}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Groups:</td>
                                                <td width="80%">{groups}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box-border w-full py-2 my-4">
                            <div className="w-full p-3 border-2 border-gray-200 dark:border-gray-900">
                                {chapterLoading}
                                <table class="table-fixed w-full p-2">
                                    <thead className="border-b-2 border-gray-200 dark:border-gray-900">
                                        {thRead}
                                        <th title="Chapter">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </th>
                                        <th title="Manga">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                            </svg>
                                        </th>
                                        <th className="w-8" title="Language">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                        </th>
                                        <th title="Group">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </th>
                                        <th title="Uploader">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </th>
                                        <th title="Age">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-right" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </th>
                                    </thead>
                                    <tbody>
                                        {this.state.chapterList}
                                    </tbody>
                                </table>
                                {loadMore}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
} 


export default withRouter(User);