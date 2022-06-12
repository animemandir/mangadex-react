import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../component/Loading.js';
import { isLogged } from "../util/loginUtil.js";
import ReadingListRow from '../component/ReadingListRow.js';
import ReadingListTable from '../component/ReadingListTable.js';
import { fetch } from '@tauri-apps/api/http';


class ReadingList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogged: false,
            titleTabControl:{
                btnReading: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                btnReReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                btnCompleted: "text-center px-3  mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                btnOnHold: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                btnPlan: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                btnDropped: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                contentReading: "w-full min-h-screen flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
                contentReReading: "hidden",
                contentCompleted: "hidden",
                contentOnHold: "hidden",
                contentPlan: "hidden",
                contentDropped: "hidden",
            },
            loadControl: {
                btnClass: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900 mt-4",
                btnLabel: "Load More"
            },
            boxReading: [],
            boxReReading: [],
            boxCompleted: [],
            boxOnHold: [],
            boxPlan: [],
            boxDropped: [],
            titleList: [],
            titleStatus: [],
            totalReading: -1,
            totalOnHold: -1,
            totalPlanToRead: -1,
            totalDropped: -1,
            totalReReading: -1,
            totalCompleted: -1,
            follows: [],
            followOffset: 0,
        };
    }

    async componentDidMount(){    
        document.title = "Follows - MangaDex";
        var $this = this;
        isLogged().then(function(isLogged){
            if(isLogged){
                $this.setState({isLogged:isLogged});
                $this.getFollows();
            }else{
                window.location = "#/";
            }
        });
    }

    getTitleStatus = (readStatus) => {
        var $this = this;
        var bearer = "Bearer " + localStorage.getItem("authToken");

        fetch('https://api.mangadex.org/manga/status?status=' + readStatus,{
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            var reading = [];
            var onhold = [];
            var plan = [];
            var dropped = [];
            var rereading = [];
            var completed = [];
            var emptyBox = [{
                mangaId: "",
                mangaName: "No titles found.",
                cover: "",
                originalLanguage: "",
                description: "",
                artist: [],
                author:[],
                readingStatus: "",
                follow: false
            }];

            switch(readStatus){
                case "reading":
                    $this.setState({totalReading: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        $this.setState({boxReading: emptyBox});
                    }
                break;
                case "on_hold":
                    $this.setState({totalOnHold: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        $this.setState({boxOnHold: emptyBox});
                    }
                break;
                case "plan_to_read":
                    $this.setState({totalPlanToRead: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        $this.setState({boxPlan: emptyBox});
                    }
                break;
                case "dropped":
                    $this.setState({totalDropped: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        $this.setState({boxDropped: emptyBox});
                    }
                break;
                case "re_reading":
                    $this.setState({totalReReading: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        $this.setState({boxReReading: emptyBox});
                    }
                break;
                case "completed":
                    $this.setState({totalCompleted: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        $this.setState({boxCompleted: emptyBox});
                    }
                break;
            }
            Object.keys(response.data.statuses).map(function(key){
                switch(response.data.statuses[key]){
                    case "reading":
                        reading.push(key);
                        if(reading.length === 100){
                            $this.getTitleInfo(reading,"reading");
                            reading = [];
                        }
                    break;
                    case "on_hold":
                        onhold.push(key);
                        if(onhold.length === 100){
                            $this.getTitleInfo(onhold,"on_hold");
                            onhold = [];
                        }
                    break;
                    case "plan_to_read":
                        plan.push(key);
                        if(plan.length === 100){
                            $this.getTitleInfo(plan,"plan_to_read");
                            plan = [];
                        }
                    break;
                    case "dropped":
                        dropped.push(key);
                        if(dropped.length === 100){
                            $this.getTitleInfo(dropped,"dropped");
                            dropped = [];
                        }
                    break;
                    case "re_reading":
                        rereading.push(key);
                        if(rereading.length === 100){
                            $this.getTitleInfo(rereading,"re_reading");
                            rereading = [];
                        }
                    break;
                    case "completed":
                        completed.push(key);
                        if(completed.length === 100){
                            $this.getTitleInfo(completed,"completed");
                            completed = [];
                        }
                    break;
                }
            });
            if(reading.length > 0){
                $this.getTitleInfo(reading,"reading");
            }
            if(onhold.length > 0){
                $this.getTitleInfo(onhold,"on_hold");
            }
            if(plan.length > 0){
                $this.getTitleInfo(plan,"plan_to_read");
            }
            if(dropped.length > 0){
                $this.getTitleInfo(dropped,"dropped");
            }
            if(rereading.length > 0){
                $this.getTitleInfo(rereading,"re_reading");
            }
            if(completed.length > 0){
                $this.getTitleInfo(completed,"completed");
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving title status.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getTitleInfo = (ids,status) => {
        var $this = this;
        let params = {
            ids: ids,
            limit: 100
        };
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/manga?includes[]=cover_art&includes[]=author&includes[]=artist&'+query)
        .then(function(response){
            var mangaList = [];
            response.data.data.map((result) => {
                let coverFile = "";
                let authors = [];
                let artists = [];
                result.relationships.map((relation) => {
                    switch(relation.type){
                        case "artist":
                            artists.push({id:relation.id,name:relation.attributes.name});
                        break;
                        case "author":
                            authors.push({id:relation.id,name:relation.attributes.name});
                        break;
                        case "cover_art":
                            if(relation.attributes !== undefined){
                                coverFile = "https://uploads.mangadex.org/covers/" +  result.id + "/" + relation.attributes.fileName + ".512.jpg";
                            }                            
                        break;
                    } 
                });
                
                let title = "";
                Object.keys(result.attributes.title).map(function(key){
                    if(key === "en" || title === ""){
                        title = result.attributes.title[key];
                    }
                });

                let description = "";
                Object.keys(result.attributes.description).map(function(key){
                    if(key === "en" || description === ""){
                        description = result.attributes.description[key];
                    }
                });

                mangaList.push({
                    mangaId: result.id,
                    mangaName: title,
                    cover: coverFile,
                    originalLanguage: result.attributes.originalLanguage,
                    description: description,
                    artist:artists,
                    author:authors,
                    readingStatus: status,
                    follow: $this.state.follows.indexOf(result.id) > -1 ? true : false
                });
            });

            //wtf
            if(ids.length > mangaList.length){                
                switch(status){
                    case "reading":
                        $this.setState({totalReading: ($this.state.totalReading - (ids.length - mangaList.length))});
                    break;
                    case "on_hold":
                        $this.setState({totalOnHold: ($this.state.totalOnHold - (ids.length - mangaList.length))});
                    break;
                    case "plan_to_read":
                        $this.setState({totalPlanToRead: ($this.state.totalPlanToRead - (ids.length - mangaList.length))});
                    break;
                    case "dropped":
                        $this.setState({totalDropped: ($this.state.totalDropped - (ids.length - mangaList.length))});
                    break;
                    case "re_reading":
                        $this.setState({totalReReading: ($this.state.totalReReading - (ids.length - mangaList.length))});
                    break;
                    case "completed":
                        $this.setState({totalCompleted: ($this.state.totalCompleted - (ids.length - mangaList.length))});
                    break;
                }
            }
            $this.getTitleRating(ids,mangaList,status);
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving title data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getTitleRating = (ids,mangaList,status) => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        let params = {
            manga: ids
        };
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/rating?'+query,{
            headers: {  
                Authorization: bearer
            }            
        })
        .then(function(response){
            for(let i = 0; i < mangaList.length; i++){
                let rating = "";
                if(response.data.ratings[mangaList[i].mangaId] !== undefined){
                    rating = response.data.ratings[mangaList[i].mangaId].rating;
                    if(rating === undefined || rating === null){
                        rating = "";
                    }
                }

                mangaList[i].rating = rating;
            }

            var list = [];
            switch(status){
                case "reading":
                    list = $this.state.boxReading;
                    mangaList.map((manga) => {
                        list.push(manga);
                    });
                    $this.setState({boxReading:list});
                break;
                case "on_hold":
                    list = $this.state.boxOnHold;
                    mangaList.map((manga) => {
                        list.push(manga);
                    });
                    $this.setState({boxOnHold:list});
                break;
                case "plan_to_read":
                    list = $this.state.boxPlan;
                    mangaList.map((manga) => {
                        list.push(manga);
                    });
                    $this.setState({boxPlan:list});
                break;
                case "dropped":
                    list = $this.state.boxDropped;
                    mangaList.map((manga) => {
                        list.push(manga);
                    });
                    $this.setState({boxDropped:list});
                break;
                case "re_reading":
                    list = $this.state.boxReReading;
                    mangaList.map((manga) => {
                        list.push(manga);
                    });
                    $this.setState({boxReReading:list});
                break;
                case "completed":
                    list = $this.state.boxCompleted;
                    mangaList.map((manga) => {
                        list.push(manga);
                    });
                    $this.setState({boxCompleted:list});
                break;
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving rating data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    changeTitleTabs = (tab) => {
        switch(tab){
            case "reading":
                if(this.state.boxReading.length === 0){
                    this.getTitleStatus("reading");
                }
                this.setState({
                    titleTabControl:{
                        btnReading: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        btnReReading: "text-center px-3 mr-3 mb-3 hover:opacity-75 py-1 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnCompleted: "text-center px-3  mr-3 mb-3 hover:opacity-75 py-1 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnOnHold: "text-center px-3 mr-3 mb-3 hover:opacity-75 py-1 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnPlan: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnDropped: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        contentReading: "w-full flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
                        contentReReading: "hidden",
                        contentCompleted: "hidden",
                        contentOnHold: "hidden",
                        contentPlan: "hidden",
                        contentDropped: "hidden",
                    }
                });
            break;
            case "rereading":
                if(this.state.boxReReading.length === 0){
                    this.getTitleStatus("re_reading");
                }
                this.setState({
                    titleTabControl:{
                        btnReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnReReading: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        btnCompleted: "text-center px-3  mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnOnHold: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnPlan: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnDropped: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        contentReading: "hidden",
                        contentReReading: "w-full flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
                        contentCompleted: "hidden",
                        contentOnHold: "hidden",
                        contentPlan: "hidden",
                        contentDropped: "hidden",
                    }
                });
            break;
            case "completed":
                if(this.state.boxCompleted.length === 0){
                    this.getTitleStatus("completed");
                }
                this.setState({
                    titleTabControl:{
                        btnReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnReReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnCompleted: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        btnOnHold: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnPlan: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnDropped: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        contentReading: "hidden",
                        contentReReading: "hidden",
                        contentCompleted: "w-full flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
                        contentOnHold: "hidden",
                        contentPlan: "hidden",
                        contentDropped: "hidden",
                    }
                });
            break;
            case "onhold":
                if(this.state.boxOnHold.length === 0){
                    this.getTitleStatus("on_hold");
                }
                this.setState({
                    titleTabControl:{
                        btnReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnReReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnCompleted: "text-center px-3  mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnOnHold: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        btnPlan: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnDropped: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        contentReading: "hidden",
                        contentReReading: "hidden",
                        contentCompleted: "hidden",
                        contentOnHold: "w-full flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
                        contentPlan: "hidden",
                        contentDropped: "hidden",
                    }
                });
            break;
            case "plan":
                if(this.state.boxPlan.length === 0){
                    this.getTitleStatus("plan_to_read");
                }
                this.setState({
                    titleTabControl:{
                        btnReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnReReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnCompleted: "text-center px-3  mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnOnHold: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnPlan: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        btnDropped: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        contentReading: "hidden",
                        contentReReading: "hidden",
                        contentCompleted: "hidden",
                        contentOnHold: "hidden",
                        contentPlan: "w-full flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
                        contentDropped: "hidden",
                    }
                });
            break;
            case "dropped":
                if(this.state.boxDropped.length === 0){
                    this.getTitleStatus("dropped");
                }
                this.setState({
                    titleTabControl:{
                        btnReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnReReading: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnCompleted: "text-center px-3  mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnOnHold: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnPlan: "text-center px-3 mr-3 mb-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                        btnDropped: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                        contentReading: "hidden",
                        contentReReading: "hidden",
                        contentCompleted: "hidden",
                        contentOnHold: "hidden",
                        contentPlan: "hidden",
                        contentDropped: "w-full flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
                    }
                });
            break;
        }
    }

    getFollows = () => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        let params = {
            limit: 100,
            offset: this.state.followOffset
        }
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/user/follows/manga?'+query,{
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            let follows = $this.state.follows;
            for(let i = 0; i < response.data.data.length; i++){
                follows.push(response.data.data[i].id);
            }

            let offset = parseInt($this.state.followOffset) + 100;
            let block = true;
            if(offset >= response.data.total){
                block = false;
            }
            if(block){
                $this.setState({
                    follows: follows,
                    followOffset: offset,
                },() => $this.getFollows());
            }else{
                $this.setState({
                    follows: follows
                },() => $this.getTitleStatus("reading"));
            }
        })
        .catch(function(error){
            console.log(error);
        });
    }

    render = () => {       
        var boxReading = [];
        var boxReReading = [];
        var boxCompleted = [];
        var boxOnHold = [];
        var boxPlan = [];
        var boxDropped = [];

        if(this.state.boxReading.length >= this.state.totalReading){
            this.state.boxReading.sort((a,b) => (a.mangaName > b.mangaName) ? 1 : ((b.mangaName > a.mangaName) ? -1 : 0));
            for(let c = 0; c < this.state.boxReading.length; c++){
                boxReading.push(<ReadingListRow data={this.state.boxReading[c]} />);
            }
        }

        if(this.state.boxReReading.length >= this.state.totalReReading){
            this.state.boxReReading.sort((a,b) => (a.mangaName > b.mangaName) ? 1 : ((b.mangaName > a.mangaName) ? -1 : 0));
            for(let c = 0; c < this.state.boxReReading.length; c++){
                boxReReading.push(<ReadingListRow data={this.state.boxReReading[c]} />);
            }
        }

        if(this.state.boxCompleted.length >= this.state.totalCompleted){
            this.state.boxCompleted.sort((a,b) => (a.mangaName > b.mangaName) ? 1 : ((b.mangaName > a.mangaName) ? -1 : 0));
            for(let c = 0; c < this.state.boxCompleted.length; c++){
                boxCompleted.push(<ReadingListRow data={this.state.boxCompleted[c]} />);
            }
        }

        if(this.state.boxOnHold.length >= this.state.totalOnHold){
            this.state.boxOnHold.sort((a,b) => (a.mangaName > b.mangaName) ? 1 : ((b.mangaName > a.mangaName) ? -1 : 0));
            for(let c = 0; c < this.state.boxOnHold.length; c++){
                boxOnHold.push(<ReadingListRow data={this.state.boxOnHold[c]} />);
            }
        }

        if(this.state.boxPlan.length >= this.state.totalPlanToRead){
            this.state.boxPlan.sort((a,b) => (a.mangaName > b.mangaName) ? 1 : ((b.mangaName > a.mangaName) ? -1 : 0));
            for(let c = 0; c < this.state.boxPlan.length; c++){
                boxPlan.push(<ReadingListRow data={this.state.boxPlan[c]} />);
            }
        }

        if(this.state.boxDropped.length >= this.state.totalDropped){
            this.state.boxDropped.sort((a,b) => (a.mangaName > b.mangaName) ? 1 : ((b.mangaName > a.mangaName) ? -1 : 0));
            for(let c = 0; c < this.state.boxDropped.length; c++){
                boxDropped.push(<ReadingListRow data={this.state.boxDropped[c]} />);
            }
        }

        return (
            <div class="flex flex-col justify-between">
                <Toaster />
                <Header isLogged={this.state.isLogged} />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between min-h-screen">
                        <div className="box-border w-full py-2 my-4 mx-2">                            
                            <div className="w-full p-3 border-2 border-gray-200 dark:border-gray-900">
                                <button onClick={() => this.changeTitleTabs("reading")} className={this.state.titleTabControl.btnReading} >
                                    {this.state.totalReading > -1 ? "Reading (" + this.state.totalReading + ")" : "Reading"}
                                </button>
                                <button onClick={() => this.changeTitleTabs("rereading")} className={this.state.titleTabControl.btnReReading} >
                                    {this.state.totalReReading > -1 ? "Rereading (" + this.state.totalReReading + ")" : "Rereading"}
                                </button>
                                <button onClick={() => this.changeTitleTabs("completed")} className={this.state.titleTabControl.btnCompleted} >
                                    {this.state.totalCompleted > -1 ? "Completed (" + this.state.totalCompleted + ")" : "Completed"}
                                </button>
                                <button onClick={() => this.changeTitleTabs("onhold")} className={this.state.titleTabControl.btnOnHold} >
                                    {this.state.totalOnHold > -1 ? "On Hold (" + this.state.totalOnHold + ")" : "On Hold"}
                                </button>
                                <button onClick={() => this.changeTitleTabs("plan")} className={this.state.titleTabControl.btnPlan} >
                                    {this.state.totalPlanToRead > -1 ? "Plan to Read (" + this.state.totalPlanToRead + ")" : "Plan to Read"}
                                </button>
                                <button onClick={() => this.changeTitleTabs("dropped")} className={this.state.titleTabControl.btnDropped} >
                                    {this.state.totalDropped > -1 ? "Dropped (" + this.state.totalDropped + ")" : "Dropped"}
                                </button>

                                <div className={this.state.titleTabControl.contentReading}>
                                    {
                                        this.state.boxReading.length > 0 ? 
                                        <ReadingListTable data={boxReading} /> : 
                                        <Loading /> 
                                    }
                                </div>
                                <div className={this.state.titleTabControl.contentReReading}>
                                    {
                                        this.state.boxReReading.length > 0 ? 
                                        <ReadingListTable data={boxReReading} /> : 
                                        <Loading /> 
                                    }
                                </div>
                                <div className={this.state.titleTabControl.contentCompleted}>
                                    {
                                        this.state.boxCompleted.length > 0 ? 
                                        <ReadingListTable data={boxCompleted} /> : 
                                        <Loading /> 
                                    }
                                </div>
                                <div className={this.state.titleTabControl.contentOnHold}>
                                    {
                                        this.state.boxOnHold.length > 0 ? 
                                        <ReadingListTable data={boxOnHold} /> : 
                                        <Loading /> 
                                    }
                                </div>
                                <div className={this.state.titleTabControl.contentPlan}>
                                    {
                                        this.state.boxPlan.length > 0 ? 
                                        <ReadingListTable data={boxPlan} /> : 
                                        <Loading /> 
                                    }
                                </div>
                                <div className={this.state.titleTabControl.contentDropped}>
                                    {
                                        this.state.boxDropped.length > 0 ? 
                                        <ReadingListTable data={boxDropped} /> : 
                                        <Loading /> 
                                    }
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

export default ReadingList;