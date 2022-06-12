import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import toast, { Toaster } from 'react-hot-toast';
import FollowChapterRow from '../component/FollowChapterRow.js';
import Loading from '../component/Loading.js';
import { isLogged } from "../util/loginUtil.js";
import ReadingListRow from '../component/ReadingListRow.js';
import ReadingListTable from '../component/ReadingListTable.js';
import FollowGroupRow from '../component/FollowGroupRow.js';
import { fetch } from '@tauri-apps/api/http';


class Follow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogged: false,
            chapterList: [],
            chapterOffset: 0,
            showChapterLoad: false
        };
    }

    async componentDidMount(){    
        document.title = "Follows - MangaDex";
        var $this = this;
        isLogged().then(function(isLogged){
            if(isLogged){
                $this.setState({isLogged:isLogged});
                $this.getChapterFeed();
            }else{
                window.location = "#/";
            }
        });
    }

    getChapterFeed = () => {
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
        let params = {
            translatedLanguage: translatedLanguage,
            includes: ["scanlation_group","user","manga"],
            offset: this.state.chapterOffset,
            limit: 50
        };
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/user/follows/manga/feed?order[createdAt]=desc&'+query,{ 
            headers: {  
                Authorization: bearer
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

            $this.getChapterRead(list,mangaList,response.data.total);
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
        let params = {
            ids: mangaList,
            grouped: true
        };
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/manga/read?'+query,{
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
        let params = {
            ids: list,
            translatedLanguage: translatedLanguage,
            includes: ["scanlation_group","user","manga"],
            limit: 50
        };
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/chapter?order[createdAt]=desc&'+query)
        .then(function(response){
            let list = $this.state.chapterList;
            for(let i = 0; i < response.data.data.length; i++){
                response.data.data[i].read = false;
                response.data.data[i].isLogged = true;
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
        this.getChapterFeed();
    }

    render = () => {
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
                <Header isLogged={this.state.isLogged} />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between min-h-screen">
                        <div className="box-border w-full py-2 my-4 mx-2">
                            <div className="w-full border-2 border-gray-200 dark:border-gray-900">
                                <div className="text-left text-lg flex flex-wrap border-b-2 pb-1 px-3 pt-2 border-gray-200 dark:border-gray-900">
                                    <span className="">Last Updates</span>
                                </div>
                                <div className="p-3">
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
                </div>
                <Footer />
            </div>
        );
    }
}

export default Follow;