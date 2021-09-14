import React from "react";
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import FollowChapterRow from '../component/FollowChapterRow.js';
import Loading from '../component/Loading.js';
import MangaBox from '../component/MangaBox.js';
import { isLogged } from "../util/loginUtil.js";
class Follow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            chapterList: [],
            chapterOffset: 0,
            showChapterLoad: false,
            tabControl: {
                btnChapter: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                btnManga: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                contentChapter: "w-full p-3 border-2 border-gray-200 dark:border-gray-900",
                contentManga: "w-full hidden p-3 border-2 border-gray-200 dark:border-gray-900",
            },
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
        };
    }

    async componentDidMount(){    
        document.title = "Follows - MangaDex";
        let logged = await isLogged();
        if(logged){
            var $this = this;
            $this.getChapterFeed();
            // $this.getTitleStatus();
        }else{
            window.location = "#/";
        }
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
        axios.get('https://api.mangadex.org/user/follows/manga/feed?order[publishAt]=desc',{
            params: {
                translatedLanguage: translatedLanguage,
                includes: ["scanlation_group","user","manga"],
                offset: this.state.chapterOffset,
                limit: 50
            },
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
            for(let i = 0; i < response.data.data.length; i++){
                response.data.data[i].read = false;
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

    getTitleInfo = (ids,status) => {
        var $this = this;
        axios.get('https://api.mangadex.org/manga?includes[]=cover_art',{
            params: {
                ids: ids,
                limit: 100
            }
        })
        .then(function(response){
            var mangaList = [];
            response.data.data.map((result) => {
                let coverFile = "";
                result.relationships.map((relation) => {
                    switch(relation.type){
                        case "cover_art":
                            coverFile = "https://uploads.mangadex.org/covers/" +  result.id + "/" + relation.attributes.fileName + ".512.jpg";
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
                    description: description
                });
            });
            
            var list = [];
            switch(status){
                case "reading":
                    list = $this.state.boxReading;
                    mangaList.map((manga) => {
                        list.push(<MangaBox data={manga} />);
                    });
                    $this.setState({boxReading:list});
                break;
                case "on_hold":
                    list = $this.state.boxOnHold;
                    mangaList.map((manga) => {
                        list.push(<MangaBox data={manga} />);
                    });
                    $this.setState({boxOnHold:list});
                break;
                case "plan_to_read":
                    list = $this.state.boxPlan;
                    mangaList.map((manga) => {
                        list.push(<MangaBox data={manga} />);
                    });
                    $this.setState({boxPlan:list});
                break;
                case "dropped":
                    list = $this.state.boxDropped;
                    mangaList.map((manga) => {
                        list.push(<MangaBox data={manga} />);
                    });
                    $this.setState({boxDropped:list});
                break;
                case "re_reading":
                    list = $this.state.boxReReading;
                    mangaList.map((manga) => {
                        list.push(<MangaBox data={manga} />);
                    });
                    $this.setState({boxReReading:list});
                break;
                case "completed":
                    list = $this.state.boxCompleted;
                    mangaList.map((manga) => {
                        list.push(<MangaBox data={manga} />);
                    });
                    $this.setState({boxCompleted:list});
                break;
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving search data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getTitleStatus = (readStatus) => {
        var $this = this;
        var bearer = "Bearer " + localStorage.getItem("authToken");

        axios.get('https://api.mangadex.org/manga/status?status=' + readStatus,{
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

            switch(readStatus){
                case "reading":
                    $this.setState({totalReading: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        let emptyBox = [];
                        emptyBox.push(
                            <span className="h-10 mt-2">
                                No titles found.
                            </span>
                        )
                        $this.setState({boxReading: emptyBox});
                    }
                break;
                case "on_hold":
                    $this.setState({totalOnHold: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        let emptyBox = [];
                        emptyBox.push(
                            <span className="h-10 mt-2">
                                No titles found.
                            </span>
                        )
                        $this.setState({boxOnHold: emptyBox});
                    }
                break;
                case "plan_to_read":
                    $this.setState({totalPlanToRead: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        let emptyBox = [];
                        emptyBox.push(
                            <span className="h-10 mt-2">
                                No titles found.
                            </span>
                        )
                        $this.setState({boxPlan: emptyBox});
                    }
                break;
                case "dropped":
                    $this.setState({totalDropped: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        let emptyBox = [];
                        emptyBox.push(
                            <span className="h-10 mt-2">
                                No titles found.
                            </span>
                        )
                        $this.setState({boxDropped: emptyBox});
                    }
                break;
                case "re_reading":
                    $this.setState({totalReReading: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        let emptyBox = [];
                        emptyBox.push(
                            <span className="h-10 mt-2">
                                No titles found.
                            </span>
                        )
                        $this.setState({boxReReading: emptyBox});
                    }
                break;
                case "completed":
                    $this.setState({totalCompleted: Object.keys(response.data.statuses).length});
                    if(Object.keys(response.data.statuses).length === 0){
                        let emptyBox = [];
                        emptyBox.push(
                            <span className="h-10 mt-2">
                                No titles found.
                            </span>
                        )
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

    changeTabs = (tab) => {
        switch(tab){
            case "chapter":
                this.setState({tabControl: {
                    btnChapter: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                    btnManga: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    contentChapter: "w-full p-3 border-2 border-gray-200 dark:border-gray-900",
                    contentManga: "w-full hidden p-3 border-2 border-gray-200 dark:border-gray-900"
                }});
                
            break;
            case "manga":
                if(this.state.boxReading.length === 0){
                    this.getTitleStatus("reading");
                }
                this.setState({tabControl: {
                    btnChapter: "text-center px-3 py-1 mr-3 mb-3 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900",
                    btnManga: "text-center px-3 py-1 hover:opacity-75 focus:outline-none border-2 border-gray-900 dark:border-gray-200",
                    contentChapter: "w-full hidden p-3 border-2 border-gray-200 dark:border-gray-900",
                    contentManga: "w-full p-3 border-2 border-gray-200 dark:border-gray-900"
                }});
            break;
        }
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
                        contentReading: "w-full min-h-screen flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
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
                        contentReReading: "w-full min-h-screen flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
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
                        contentCompleted: "w-full min-h-screen flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
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
                        contentOnHold: "w-full min-h-screen flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
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
                        contentPlan: "w-full min-h-screen flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
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
                        contentDropped: "w-full min-h-screen flex flex-wrap p-3 border-t-2 border-gray-200 dark:border-gray-900",
                    }
                });
            break;
        }
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
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full py-2 my-4 mx-2">
                            <button onClick={() => this.changeTabs("chapter")} className={this.state.tabControl.btnChapter} >
                                Last Updates
                            </button>
                            <button onClick={() => this.changeTabs("manga")} className={this.state.tabControl.btnManga}>
                                Reading List
                            </button>

                            <div className={this.state.tabControl.contentChapter}>
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
                        
                            <div className={this.state.tabControl.contentManga}>
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
                                    {this.state.boxReading.length > 0 ? this.state.boxReading : <Loading /> }
                                </div>
                                <div className={this.state.titleTabControl.contentReReading}>
                                    {this.state.boxReReading.length > 0 ? this.state.boxReReading : <Loading /> }
                                </div>
                                <div className={this.state.titleTabControl.contentCompleted}>
                                    {this.state.boxCompleted.length > 0 ? this.state.boxCompleted : <Loading /> }
                                </div>
                                <div className={this.state.titleTabControl.contentOnHold}>
                                    {this.state.boxOnHold.length > 0 ? this.state.boxOnHold : <Loading /> }
                                </div>
                                <div className={this.state.titleTabControl.contentPlan}>
                                    {this.state.boxPlan.length > 0 ? this.state.boxPlan : <Loading /> }
                                </div>
                                <div className={this.state.titleTabControl.contentDropped}>
                                    {this.state.boxDropped.length > 0 ? this.state.boxDropped : <Loading /> }
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