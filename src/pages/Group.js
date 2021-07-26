import React from "react";
import { withRouter } from "react-router";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Link } from "react-router-dom";
import { colorTheme } from "../util/colorTheme";
import Tags from '../component/Tags.js';
import FollowChapterRow from '../component/FollowChapterRow.js';
import Loading from '../component/Loading.js';
class Group extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            name: "",
            email: "",
            description: "",
            discord: "",
            ircChannel: "",
            ircServer: "",
            locked: "",
            site: "",
            leader: [],
            members: [],

            chapterList: [],
            chapterOffset: 0,
            showChapterLoad: false,
            loadControl: {
                btnClass: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900 mt-4",
                btnLabel: "Load More"
            }
        };
    }

    componentDidMount = () => {
        document.title = "Group - MangaDex";
        const id = this.props.match.params.id;
        this.setState({id:id},() => this.getGroupFeed());

        this.getGroupInfo(id);
    }

    componentDidUpdate = (prevProps,prevState) => {
        if(prevProps === undefined){
            return false;
        }

        if(this.state.id != this.props.match.params.id){
            this.setState({
                id: this.props.match.params.id,
                chapterList: [],
                showChapterLoad: false,
                loadControl: {
                    btnClass: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900 mt-4",
                    btnLabel: "Load More"
                }
            },() => this.getGroupFeed())
            this.getGroupInfo(this.props.match.params.id);
        }
    }

    getGroupInfo = (id) => {
        var $this = this;
        axios.get('https://api.mangadex.org/group/' + id + '?includes[]=leader&includes[]=member')
        .then(function(response){
            let name = "";
            let email =  "";
            let description = "";
            let discord = "";
            let ircChannel = "";
            let ircServer = "";
            let locked = "";
            let site = "";
            let leader = [];
            let members = [];

            name = response.data.data.attributes.name;
            email = response.data.data.attributes.contactEmail;
            description = response.data.data.attributes.description;
            discord = response.data.data.attributes.discord;
            ircChannel = response.data.data.attributes.ircChannel;
            ircServer = response.data.data.attributes.ircServer;
            locked = response.data.data.attributes.locked;
            site = response.data.data.attributes.website;
            
            response.data.relationships.map((relation) => {
                if(relation.type === "leader"){
                    leader.push({
                        id: relation.id,
                        name: relation.attributes.username
                    });
                }
                if(relation.type === "member"){
                    members.push({
                        id: relation.id,
                        name: relation.attributes.username
                    });
                }
            });

            document.title = "Group: " + name + " - Mangadex";
            $this.setState({
                name: name,
                email: email,
                description: description,
                discord: discord,
                ircChannel: ircChannel,
                ircServer: ircServer,
                locked: locked,
                site: site,
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

    getGroupFeed = () => {
        var translatedLanguage = ["en"];
        if(localStorage.language){
            translatedLanguage = JSON.parse(localStorage.language);
        }
        var $this = this;
        var bearer = "Bearer " + localStorage.getItem("authToken");
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
        axios.get('https://api.mangadex.org/chapter?order[publishAt]=desc',{
            params: {
                groups: [this.state.id], 
                translatedLanguage: translatedLanguage,
                offset: this.state.chapterOffset,
                limit: 50
            }
        })
        .then(function(response){
            let list = [];
            let mangaList = [];
            for(let i = 0; i < response.data.results.length; i++){
                list.push(response.data.results[i].data.id);
                response.data.results[i].relationships.map((relation) => {
                    if(relation.type === "manga"){
                        mangaList.push(relation.id);
                    }
                });
            }

            $this.getChapterRead(list,mangaList,response.data.total);
        })
        .catch(function(error){
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
        axios.get('https://api.mangadex.org/chapter?order[publishAt]=desc',{
            params: {
                ids: list,
                translatedLanguage: translatedLanguage,
                includes: ["scanlation_group","user","manga"],
                limit: 50
            }
        })
        .then(function(response){
            let list = $this.state.chapterList;
            for(let i = 0; i < response.data.results.length; i++){
                response.data.results[i].read = false;
                response.data.results[i].relationships.map((relation) => {
                    if(relation.type === "manga" && Object.keys(readList).indexOf(relation.id) > -1){
                        if(readList[relation.id].indexOf(response.data.results[i].data.id) > -1){
                            response.data.results[i].read = true;
                        }
                    }
                });
                list.push(<FollowChapterRow data={response.data.results[i]}/>)
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
            toast.error('Error retrieving chapter list.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    chapterLoadMore = () => {
        this.getGroupFeed();
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

        var site = "";
        var email = "";
        var discord = "";
        var irc = "";
        var links = "";
        var locked = 
        <tr className="text-left border-b border-gray-200 dark:border-gray-900">
            <td width="20%" className="font-semibold">Status:</td>
            <td width="80%">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-1 mx-1" viewBox="0 0 20 20" fill="currentColor" title="Unlocked">
                    <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                </svg>
            </td>
        </tr>;
        if(this.state.site){
            site = <Tags name="Website"  url={this.state.site}/>
        }
        if(this.state.email){
            email = <Tags name="Email"  url={"mailto:"+this.state.email}/>
        }
        if(this.state.discord){
            let invite = this.state.discord.startsWith('http') ? this.state.discord : "https://discord.com/invite/"+this.state.discord
            discord = <Tags name="Discord"  url={invite}/>
        }
        if(this.state.ircChannel && this.state.ircServer){
            irc = <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                <td width="20%" className="font-semibold">IRC:</td>
                <td width="80%">{this.state.ircServer} {this.state.ircChannel}</td>
            </tr>
        }
        if(this.state.locked){
            locked = 
            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                <td width="20%" className="font-semibold">Status:</td>
                <td width="80%">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-1 mx-1" viewBox="0 0 20 20" fill="currentColor" title="locked">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </td>
            </tr>
        }
        if(site || email || discord){
            links = <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                <td width="20%" className="font-semibold">Links:</td>
                <td width="80%">{site} {email} {discord}</td>
            </tr>
        }

        var chapterLoading = (this.state.chapterList.length <= 0) ? <Loading /> : "";
        var loadMore = (this.state.showChapterLoad) ? 
        <button 
            onClick={this.chapterLoadMore} 
            className={this.state.loadControl.btnClass} >
            {this.state.loadControl.btnLabel}
        </button> : "";
        return (
            <div class="flex flex-col justify-between">
                <Toaster />
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full py-2 mt-6 mb-2 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-left text-lg flex flex-wrap border-b-2 pb-1 px-3 border-gray-200 dark:border-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-1 mt-1" viewBox="0 0 20 20" fill="currentColor">
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
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Description:</td>
                                        <td width="80%">{this.state.description}</td>
                                    </tr>
                                    {locked}
                                    {/* <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Alt name:</td>
                                        <td width="80%"></td>
                                    </tr>
                                    <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                        <td width="20%" className="font-semibold">Stats:</td>
                                        <td width="80%"></td>
                                    </tr> */}
                                    {links}
                                    {irc}
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
                        <div className="box-border w-full py-2 my-4">
                            <div className="w-full p-3 border-2 border-gray-200 dark:border-gray-900">
                                {chapterLoading}
                                <table class="table-fixed w-full p-2">
                                    <thead className="border-b-2 border-gray-200 dark:border-gray-900">
                                        <th className="w-8" title="Read">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </th>
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


export default withRouter(Group);