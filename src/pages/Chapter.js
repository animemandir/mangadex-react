import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import LanguageFlag  from '../component/LanguageFlag.js';
import { colorTheme } from "../util/colorTheme";
import { isLogged } from "../util/loginUtil.js";
import { DateTime } from "luxon";
import Select from 'react-select';
import { saveStorage } from "../util/persistentStore.js";
import { fetch } from '@tauri-apps/api/http';
import { appWindow } from '@tauri-apps/api/window'
import { Store } from 'tauri-plugin-store-api';




class Chapter extends React.Component{
    constructor(props){
        super(props);
        this.scrollTop = React.createRef();
        this.KbListener = React.createRef();
        this.ofListener = React.createRef();


        this.state = {
            id: "",
            idSelect: {value: "", label: ""},
            isLogged: false,
            chapter: "",
            mangaId: "",
            manga: "",
            groups: "",
            userId: "",
            user: "",
            translatedLanguage: "",
            hash: "",
            data: [],
            dataSaver: [],
            baseUrl: "",
            chapterList: [],
            externalUrl: "",

            progress: 1,
            progressBar: null,
            imageLoad: [],

            theme: "light",
            imageFit: "width",
            layout: "left",
            showProgress: "show",
            imageSource: "original",

            themeSelect: {value:"light", label:"Theme: Light"},
            imageFitSelect: {value:"width", label:"Image Fit: Width"},
            layoutSelect: {value:"left", label:"Page Layout: Right to Left"},
            showProgressSelect: {value:"show", label:"Progress Bar: Show"},
            imageSourceSelect: {value:"original", label:"Image Source: Original"},

            optionTheme: [
                {value:"light", label:"Theme: Light"},
                {value:"dark", label:"Theme: Dark"}
            ],
            optionImageFit: [
                {value:"width", label:"Image Fit: Width"},
                {value:"height", label:"Image Fit: Height"},
                {value:"original", label:"Image Fit: Original"},
                {value:"container", label:"Image Fit: Container (60%)"}
            ],
            optionReaderLayout: [
                {value:"left", label:"Page Layout: Right to Left"},
                {value:"right", label:"Page Layout: Left to Right"},
                {value:"single", label:"Page Layout: Long Strip"},
            ],
            optionProgressBar: [
                {value:"show", label:"Progress Bar: Show"},
                {value:"hide", label:"Progress Bar: Hide"},
            ],
            optionImageSource: [
                {value:"original", label:"Image Source: Original"},
                {value:"saver", label:"Image Source: Data Saver"},
            ],

            classMenuA: "w-3/12 flex flex-wrap",
            classMenuB: "hidden",
            classImg: "object-contain",
            nextPrevController: {
                leftClass: "mx-2 hover:opacity-75 dark:text-gray-100",
                rightClass: "mx-2 hover:opacity-75 dark:text-gray-100",
                leftTitle: "Previous",
                rightTitle: "Next",
                prevId: "",
                nextId: ""
            },
            imgContainerClass: "flex-1 overflow-y-scroll cursor-pointer no-scrollbar focus:outline-none ",
            progressBarClass: "w-2 flex flex-col",
        };
    }

    async componentDidMount(){
        const id = this.props.match.params.id;
        const page = parseInt(this.props.match.params.page);
        this.setState({
            id:id,
            progress: page
        });

        this.initReader();
        this.getChapter(id);
        let logged = await isLogged();
        if(logged){
            this.setState({isLogged:logged})
            this.markChapterRead(id);
        }
        this.KBSettings();
        this.ofListener.current.focus();
    }

    refresh = () => {
        window.location.reload();
    }

    getChapter = (id) => {
        var $this = this;
        let params = {
            includes: ["scanlation_group","manga","user"]
        };
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/chapter/' + id + "?" + query)
        .then(async function(response){
            let chapterId = "";
            let chapter = "";
            let title = "";
            let mangaId = "";
            let manga = "";
            let groups = [];
            let userId = "";
            let user = "";
            let translatedLanguage = "";
            let externalUrl = "";

            response.data.data.relationships.map((relation) => {
                switch(relation.type){
                    case "manga":
                        mangaId = relation.id;
                        Object.keys(relation.attributes.title).map(function(key){
                            if(key === "en" || manga === ""){
                                manga = relation.attributes.title[key];
                            }
                        });
                    break;
                    case "scanlation_group":
                        groups.push({
                            id: relation.id,
                            name: relation.attributes.name
                        });
                    break;
                    case "user":
                        userId = relation.id;
                        user = relation.attributes.username;
                    break;
                }
            });

            translatedLanguage = response.data.data.attributes.translatedLanguage;            
            externalUrl = response.data.data.attributes.externalUrl;
            chapterId = response.data.data.id;
            chapter = response.data.data.attributes.chapter;
            title = response.data.data.attributes.title;

            $this.setState({
                mangaId: mangaId,
                manga: manga,
                groups: groups,
                userId: userId,
                user: user,
                chapter: chapter,
                translatedLanguage: translatedLanguage,
                
                externalUrl: externalUrl
            });

            const store = new Store('.dex.dat');
            let readingHistory = [];
            let inReadingHistory = false;
            let storeHistory = await store.get('readingHistory');
            if(storeHistory){
                readingHistory = JSON.parse(storeHistory);
            }

            if(readingHistory.length > 0){
                for(let a = 0; a < readingHistory.length; a++){
                    if(readingHistory[a].chapterId === chapterId){
                        inReadingHistory = true;
                    }
                }
            }

            if(!inReadingHistory){
                readingHistory.push({
                    chapterId: chapterId,
                    chapter: chapter,
                    title: title,
                    mangaId: mangaId,
                    manga: manga,
                    groups: groups,
                    userId: userId,
                    user: user,
                    translatedLanguage: translatedLanguage,
                    externalUrl: externalUrl,
                    readAt: DateTime.now().toISO()
                });
                await store.set('readingHistory',JSON.stringify(readingHistory));
            }

            $this.getChapterList(mangaId,0);
            $this.getBaseUrl(id);
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving chapter info.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getBaseUrl = (id) => {
        var $this = this;
        fetch('https://api.mangadex.org/at-home/server/' + id)
        .then(function(response){
            let baseUrl = "";
            let hash = "";
            let data = [];
            let dataSaver = [];
            baseUrl = response.data.baseUrl;
            hash = response.data.chapter.hash;
            data = response.data.chapter.data;
            dataSaver = response.data.chapter.dataSaver;

            $this.setState({
                baseUrl: baseUrl,
                hash: hash,
                data: data,
                dataSaver: dataSaver
            });

            $this.setFit();
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving base url.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getChapterList = (id,offset) => {
        var $this = this;

        var translatedLanguage = ["en"];
        if(localStorage.language){
            translatedLanguage = JSON.parse(localStorage.language);
        }

        var contentRating = [];
        if(localStorage.content){
            contentRating = JSON.parse(localStorage.content);
        }
        let params = {
            manga: id,
            translatedLanguage: translatedLanguage,
            contentRating: contentRating,
            includes: ["scanlation_group","user"],
            offset: offset,
            limit: 100
        };
        const queryString = require('query-string');
        let query = queryString.stringify(params,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/chapter?order[chapter]=desc&'+query)
        .then(function(response){
            let list = $this.state.chapterList;
            for(let i = 0; i < response.data.data.length; i++){
                let label = "";
                if(response.data.data[i].attributes.volume){
                    label += "Volume " + response.data.data[i].attributes.volume + " ";
                }
                if(response.data.data[i].attributes.chapter){
                    label += "Chapter " + response.data.data[i].attributes.chapter + " ";
                }
                if(label === ""){
                    label += "Oneshot ";
                }
                if(response.data.data[i].attributes.title){
                    label += "- " + response.data.data[i].attributes.title;
                }
                list.push({
                    id: response.data.data[i].id,
                    label: label,
                    chapter:  response.data.data[i].attributes.chapter
                });
            }

            $this.setState({chapterList: list});
            if(response.data.total >= (offset+100)){
                $this.getChapterList(id,offset+100);
            }else{
                let prev = "";
                let next = "";
                let index = 0;
                let chapterIndex = "";
                let idSelect = {value:$this.state.id,label:""};
                for(let a = 0; a < list.length; a++){
                    if(list[a].id === $this.state.id){
                        document.title = list[a].label + " - " + $this.state.manga + " - MangaDex";
                        index = a;
                        chapterIndex = parseFloat(list[a].chapter);     
                        idSelect = {
                            value: list[a].id,
                            label: list[a].label
                        };                
                    }
                }
                for(let a = 0; a < list.length; a++){
                    if(a < index && parseFloat(list[a].chapter) !== chapterIndex){
                        next = list[a].id;
                    }
                }
                for(let a = list.length-1; a >= 0; a--){
                    if(a > index && parseFloat(list[a].chapter) !== chapterIndex){
                        prev = list[a].id;
                    }
                }
                let nextPrevController = $this.state.nextPrevController;
                nextPrevController.prevId = prev;
                nextPrevController.nextId = next;
                $this.setState({
                    nextPrevController:nextPrevController,
                    idSelect: idSelect
                });
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving chapter list.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    markChapterRead = (id) => {
        var bearer = "Bearer " + localStorage.authToken;
        fetch('https://api.mangadex.org/chapter/' + id + '/read',{
            method: "POST",
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            if(response.data.result === "ok"){
                toast.success('Chapter marked as read.',{
                    duration: 1000,
                    position: 'top-right',
                });
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error marking chapter.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    initReader = () => {
        if(!localStorage.showReaderMenu){
            localStorage.showReaderMenu = 1;
        }
        if(!localStorage.imageFit){
            localStorage.imageFit = "width";
        }
        if(!localStorage.readerlayout){
            localStorage.readerlayout = "left";
        }
        if(!localStorage.showProgressBar){
            localStorage.showProgressBar = "show";
        }
        if(!localStorage.imageSource){
            localStorage.imageSource = "original";
        }
        saveStorage();

        this.setMode();
        this.setMenu();
        this.setLayout();
        this.setFit();
        this.changeImageSource({value:localStorage.imageSource});
    }

    // Reader Settings 
    setMode = () => {
        if(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)){
            document.documentElement.classList.add('dark');
            this.setState({
                theme: "dark",
                themeSelect: {value:"dark", label:"Theme: Dark"}
            });
        }else{
            document.documentElement.classList.remove('dark');
            this.setState({
                theme: "light",
                themeSelect: {value:"light", label:"Theme: Light"},
            });
        }
    }

    lightDarkMode = (e) => {
        localStorage.theme = e.value;
        saveStorage();
        this.setMode();
    }

    toggleMenu = () => {
        localStorage.showReaderMenu = (parseInt(localStorage.showReaderMenu) === 1) ? 0 : 1;
        saveStorage();
        this.setMenu();
    }

    setMenu = () => {
        if(parseInt(localStorage.showReaderMenu) === 1){
            this.setState({
                classMenuA: "w-3/12 flex flex-wrap",
                classMenuB: "hidden",
            });
        }else{
            this.setState({
                classMenuA: "hidden",
                classMenuB: "w-12 hover:opacity-75 cursor-pointer flex h-screen justify-center items-center border-l-4 border-gray-200 dark:border-gray-900 dark:text-gray-900",
            });
        }
    }

    changeImageFit = (e) => {
        localStorage.imageFit = e.value;
        saveStorage();
        this.setFit();
    }

    setFit = () => {
        this.setState({imageFit: localStorage.imageFit});
        switch(localStorage.imageFit){
            case "original":
                this.setState({
                    classImg: "object-none",
                    imageFitSelect: {value:"original", label:"Image Fit: Original"}
                },() => this.updateReader("update"));
            break;
            case "height":
                this.setState({
                    classImg: "h-screen",
                    imageFitSelect:  {value:"height", label:"Image Fit: Height"}
                },() => this.updateReader("update"));
            break;
            case "container":
                this.setState({
                    classImg: "object-contain w-4/6",
                    imageFitSelect: {value:"container", label:"Image Fit: Container (60%)"}
                },() => this.updateReader("update"));
            break;
            case "width":
            default:
                this.setState({
                    classImg: "object-contain px-8",
                    imageFitSelect: {value:"width", label:"Image Fit: Width"}
                },() => this.updateReader("update"));      
            break;
        }        
    }

    changeReaderLayout = (e) => {
        localStorage.readerlayout = e.value;
        saveStorage();
        this.setLayout();
    }

    setLayout = () => {
        let nextPrevController = this.state.nextPrevController;
        let scrollbar = (localStorage.showProgressBar === "show") ? colorTheme().scrollbar : "no-scrollbar";
        let showProgressSelect = (localStorage.showProgressBar === "show") ? {value:"show", label:"Progress Bar: Show"} : {value:"hide", label:"Progress Bar: Hide"};
        this.setState({
            layout: localStorage.readerlayout,
            showProgress: localStorage.showProgressBar,
            showProgressSelect: showProgressSelect
        });
        switch(localStorage.readerlayout){
            case "right":
                nextPrevController.leftTitle = "Previous";
                nextPrevController.rightTitle = "Next";
                this.setState({
                    nextPrevController: nextPrevController,
                    imgContainerClass: "flex-1 overflow-y-scroll cursor-pointer no-scrollbar focus:outline-none",
                    progressBarClass: (localStorage.showProgressBar === "show") ? "w-2 flex flex-col" : "hidden",
                    layoutSelect: {value:"right", label:"Page Layout: Left to Right"}
                },() => this.updateReader("update"));
            break;
            case "single":
                nextPrevController.leftTitle = "Previous";
                nextPrevController.rightTitle = "Next";
                this.setState({
                    nextPrevController: nextPrevController,
                    imgContainerClass: "flex-1 overflow-y-scroll focus:outline-none " + scrollbar,
                    progressBarClass: "hidden",
                    layoutSelect: {value:"single", label:"Page Layout: Long Strip"}
                },() => this.updateReader("single"));            
            break;
            case "left":
            default:
                nextPrevController.leftTitle = "Next";
                nextPrevController.rightTitle = "Previous";
                this.setState({
                    nextPrevController: nextPrevController,
                    imgContainerClass: "flex-1 overflow-y-scroll cursor-pointer no-scrollbar focus:outline-none",
                    progressBarClass: (localStorage.showProgressBar === "show") ? "w-2 flex flex-col" : "hidden",
                    layoutSelect: {value:"left", label:"Page Layout: Right to Left"}
                },() => this.updateReader("update"));
            break;
        }
    }

    changeProgressBar = (e) => {
        localStorage.showProgressBar = e.value;
        saveStorage();
        this.setLayout();
    }

    changeImageSource = (e) => {
        localStorage.imageSource = e.value;
        saveStorage();
        let imageSourceSelect = (localStorage.imageSource === "original") ? {value:"original", label:"Image Source: Original"} : {value:"saver", label:"Image Source: Data Saver"};
        this.setState({
            imageSource: e.value,
            imageSourceSelect: imageSourceSelect
        },() => this.updateReader("update"));
    }

    // Reader Actions 
    changeChapter = (e) => {
        window.location = '#/chapter/' + e.value + "/1";
        window.location.reload();   
    }

    leftChapter = () => {
        switch(localStorage.readerlayout){
            case "left":
                if(this.state.nextPrevController.nextId.length > 0){
                    window.location = '#/chapter/' + this.state.nextPrevController.nextId + "/1";
                    window.location.reload();
                }else{
                    window.location = '#/title/' + this.state.mangaId;
                    window.location.reload();
                }
            break;
            case "single":
            case "right":
            default:
                if(this.state.nextPrevController.prevId.length > 0){
                    window.location = '#/chapter/' + this.state.nextPrevController.prevId + "/1";
                    window.location.reload();
                }else{
                    window.location = '#/title/' + this.state.mangaId;
                    window.location.reload();
                }                 
            break;
        }
    }

    rightChapter = () => {
        switch(localStorage.readerlayout){
            case "left":
                if(this.state.nextPrevController.prevId.length > 0){
                    window.location = '#/chapter/' + this.state.nextPrevController.prevId + "/1";
                    window.location.reload();
                }else{
                    window.location = '#/title/' + this.state.mangaId;
                    window.location.reload();
                }
            break;
            case "single":
            case "right":
            default:
                if(this.state.nextPrevController.nextId.length > 0){
                    window.location = '#/chapter/' + this.state.nextPrevController.nextId + "/1";
                    window.location.reload();
                }else{
                    window.location = '#/title/' + this.state.mangaId;
                    window.location.reload();
                }
            break;
        }
    }

    clickListener = (e) => {
        let readerwidth = document.getElementById('mainReader').clientWidth;
        if(e.clientX <= (readerwidth/2)){
            this.leftSide();
        }else{
            this.rightSide();
        }
        e.preventDefault();
    }
    
    leftSide = () => {
        switch(localStorage.readerlayout){
            case "left":
                this.updateReader("next");
            break;
            case "right":
                this.updateReader("prev");
            break;
        }
    }

    rightSide = () => {
        switch(localStorage.readerlayout){
            case "left":
                this.updateReader("prev");
            break;
            case "right":
                this.updateReader("next");
            break;
        }
    }

    goToPage = (page) => {
        this.setState({
            progress: page
        },() => this.updateReader("update"));
    }

    updateReader = (action) => {
        var progress = this.state.progress;
        let imageLoad = [];
        let progressBar = [];
        switch(action){
            case "next":
                progress = progress + 1;
            break;
            case "prev":
                progress = progress - 1;
            break;
            case "update":
            break;
            case "single":
                progress = 1;
            break;
        }

        
        if(progress <= 0){
            if(this.state.nextPrevController.prevId.length > 0){
                window.location = '#/chapter/' + this.state.nextPrevController.prevId + "/1";
                window.location.reload();
                return false;
            }else{
                window.location = '#/title/' + this.state.mangaId;
                window.location.reload();
                return false;
            }
        }

        if(progress > this.state.data.length && this.state.data.length > 0){
            if(this.state.nextPrevController.nextId.length > 0){
                window.location = '#/chapter/' + this.state.nextPrevController.nextId  + "/1";
                window.location.reload();
                return false;
            }else{
                window.location = '#/title/' + this.state.mangaId;
                window.location.reload();
                return false;
            }
        }

        let path = "#/chapter/" + this.state.id + "/" + progress;
        window.history.pushState({path: path}, '', path);
        imageLoad.push(<div className="invisible" ref={this.scrollTop}></div>);

        if(localStorage.readerlayout !== "single"){
            for(let a = 0; a < this.state.data.length; a++){
                let imageOriginal = `${this.state.baseUrl}/data/${this.state.hash}/${this.state.data[a]}`;
                let imageSaver = `${this.state.baseUrl}/data-saver/${this.state.hash}/${this.state.dataSaver[a]}`;
                let image = (this.state.imageSource === "original") ? imageOriginal : imageSaver; 
                let pageLoad = (localStorage.pageLoad) ? parseInt(localStorage.pageLoad) : 5;
                if((a+1) < progress){
                    progressBar.push(
                        <div 
                            className={"flex-grow cursor-pointer border-b-2 border-gray-300 dark:border-gray-900 " + colorTheme(300).bg} 
                            title={a+1} 
                            onClick={() => this.goToPage(a+1)}></div>
                    );
                    imageLoad.push(
                        <div className="flex flex-row justify-center items-center">
                            <img 
                                alt={"Page " + progress}
                                className={this.state.classImg + " hidden"}
                                src={image} />
                        </div>
                    );
                }
                if((a+1) === progress){
                    progressBar.push(
                        <div 
                            className={"flex-grow cursor-pointer border-b-2 border-gray-300 dark:border-gray-900 " + colorTheme(600).bg}
                            title={a+1} 
                            onClick={() => this.goToPage(a+1)}></div>
                    );
                    imageLoad.push(
                        <div className="flex flex-row justify-center items-center" >
                            <img 
                                alt={"Page " + progress}
                                className={this.state.classImg + " overflow-scroll"}
                                src={image} />
                        </div>
                    );
                }
                if((a+1) > progress){
                    progressBar.push(
                        <div 
                            className={"flex-grow cursor-pointer border-b-2 border-gray-300 dark:border-gray-900 " + colorTheme(200).bg}
                            title={a+1} 
                            onClick={() => this.goToPage(a+1)}></div>
                    );
                    if((progress + pageLoad) >= (a+1)){
                        imageLoad.push(
                            <div className="flex flex-row justify-center items-center">
                                <img 
                                    alt={"Page " + progress}
                                    className={this.state.classImg + " hidden"}
                                    src={image} />
                            </div>
                        );
                    }
                }
            }
        }else{
            for(let a = 0; a < this.state.data.length; a++){
                let image = `${this.state.baseUrl}/data/${this.state.hash}/${this.state.data[a]}`;
                imageLoad.push(
                    <div className="flex flex-row justify-center items-center">
                        <img 
                            alt={"Page " + progress}
                            className={this.state.classImg + " mt-1"}
                            src={image} />
                    </div>
                );
            }
        }
         
        this.setState({
            progress: progress,
            progressBar: progressBar,
            imageLoad: imageLoad,
        },() => {
            this.scrollTop.current.scrollIntoView();
            this.ofListener.current.focus();
        });
    }

    KBSettings = () => {
        this.KbListener.current.addEventListener('keydown',this.KbController);
    } 

    KbController = (e) => {
        this.ofListener.current.focus();
        switch(e.keyCode){
            case 38: //arrow up
            break;
            case 40: //arrow down
            break;
            case 37: //arrow left
                this.leftSide();
            break;
            case 39: //arrow right
                this.rightSide();
            break;
            case 27: //ESC
                this.toggleMenu();
            break;
        }
    }

    minimize = () => {
        appWindow.minimize();
    }

    maximize = () => {
        appWindow.toggleMaximize();
    }

    closeApp = () => {
        appWindow.close();
    }

    render = () => {
        var selectStyle = (localStorage.theme === 'dark') ? {
            control: (base) => ({
            ...base,
            background: "#1E293B",
            border: "2px solid #0F172A",
            height: "44px",
            minHeight: "44px"
            }),
            container: (base) => ({
            ...base,
            height: "44px"
            }),
            menu: (base) => ({
            ...base,
            background: "#1E293B",
            borderRadius: 0,
            marginTop: 0
            }),
            menuList: (base) => ({
            ...base,
            background: "#1E293B",
            padding: 0
            }),
            placeholder: (base) => ({
                ...base,
                color: "#D1D5DB",
            }),
            option: (base,{ isFocused }) => ({
                ...base,
                background: (isFocused) ? "#4B5563" : "#1E293B",
            }),
            multiValueRemove: base => ({
                ...base,
                color: "#111827",
            }),
            singleValue: (base,{ isFocused }) => ({
                ...base,
                color: "#D1D5DB",
            }),
        } : {};

        var chapterList = [];
        this.state.chapterList.map((i) => {
            chapterList.push({
                value: i.id,
                label: i.label
            });
        });
        var externalUrl = (this.state.externalUrl !== "" && this.state.externalUrl !== undefined && this.state.externalUrl !== null) ? 
        <div className="flex flex-row px-3 pb-3">
            <a className={colorTheme(500).text + " " + colorTheme(500).border + " text-center text-lg px-3 py-2 focus:outline-none border-2 h-12 mt-2 w-full"} href={this.state.externalUrl} target="_blank" title={this.state.externalUrl} rel="noopener noreferrer">
                Open External Link
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a> 
        </div>: "";

        var group = "";
        if(this.state.groups.length > 0){
            let temp = []
            for(let a = 0; a < this.state.groups.length; a++){
                temp.push(
                <Link className={"hover:opacity-75 mx-1 " + colorTheme(500).text} to={"/group/" + this.state.groups[a].id}>
                    {this.state.groups[a].name}
                </Link>);
            }
            group = 
            <div className="grid">
                {temp}
            </div>
        }

        var pages = 
        <div className="text-center text-lg py-2 border-t-2  border-gray-200 dark:border-gray-900">
            <span>Page {this.state.progress} / {this.state.data.length}</span> 
        </div>
        if(localStorage.readerlayout === "single"){
            pages = "";
        }

        var windowBar = (this.state.theme === "dark") ?
        <div className="float-right">
            <img className="px-1 inline cursor-pointer w-7" onClick={this.minimize} src={process.env.PUBLIC_URL + '/minimize-dark.svg'} alt="Minimize" />
            <img className="px-1 inline cursor-pointer w-7" onClick={this.maximize} src={process.env.PUBLIC_URL + '/maximize-dark.svg'} alt="Maximize" />
            <img className="pl-1 pr-2 inline cursor-pointer w-7" onClick={this.closeApp} src={process.env.PUBLIC_URL + '/close-dark.svg'} alt="Close" />
        </div> :
        <div className="float-right">
            <img className="px-1 inline cursor-pointer w-7" onClick={this.minimize} src={process.env.PUBLIC_URL + '/minimize.svg'} alt="Minimize" />
            <img className="px-1 inline cursor-pointer w-7" onClick={this.maximize} src={process.env.PUBLIC_URL + '/maximize.svg'} alt="Maximize" />
            <img className="pl-1 pr-2 inline cursor-pointer w-7" onClick={this.closeApp} src={process.env.PUBLIC_URL + '/close.svg'} alt="Close" />
        </div>

        return (
            <div class="flex flex-col justify-between" ref={this.KbListener} tabIndex={0}>
                <Toaster />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="flex h-screen">
                        <div className="flex-1 flex overflow-hidden focus:outline-none" id="mainReader" onClick={this.clickListener} >
                            <div className={this.state.imgContainerClass} ref={this.ofListener} tabIndex={0}>
                                {this.state.imageLoad}
                            </div>   
                        </div>
                        

                        <div className={this.state.progressBarClass}>
                            {this.state.progressBar}
                        </div>
                        
                        <div className={this.state.classMenuA}>
                            <div onClick={this.toggleMenu} title="Hide Menu" className="w-12 hover:opacity-75 cursor-pointer h-screen flex justify-center items-center border-l-4 border-r-4 border-gray-200 dark:border-gray-900 dark:text-gray-900">
                                <div className="mx-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col h-screen justify-between">  
                                <div className="text-center text-lg py-2 border-b-2  border-gray-200 dark:border-gray-900">
                                    <Link className={"hover:opacity-75 " + colorTheme(500).text} to={"/title/" + this.state.mangaId}>{this.state.manga}</Link>
                                </div>
                                <div className="flex flex-wrap border-b-2 pb-1 border-gray-200 dark:border-gray-900">
                                    <div className="w-1/6 cursor-pointer justify-center items-center flex">
                                        <div className={this.state.nextPrevController.leftClass} title={this.state.nextPrevController.leftTitle} onClick={this.leftChapter}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="w-4/6 content-center">
                                        <Select
                                            options={chapterList}
                                            onChange={this.changeChapter}
                                            value={this.state.idSelect}
                                            styles={selectStyle}
                                            className="text-gray-900 dark:text-gray-200 w-full m-2"
                                        />
                                    </div>
                                    <div className="w-1/6 cursor-pointer justify-center items-center flex">
                                        <div className={this.state.nextPrevController.rightClass} title={this.state.nextPrevController.rightTitle} onClick={this.rightChapter}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>    
                                <div className="flex justify-center items-center text-center py-2 border-b-2  border-gray-200 dark:border-gray-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                    {group}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mx-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                                    </svg>
                                    <Link className={"hover:opacity-75 mr-3 " + colorTheme(500).text} to={"/user/" + this.state.userId}>{this.state.user}</Link>
                                    <LanguageFlag language={this.state.translatedLanguage} />
                                </div>
                                <div className="flex flex-wrap justify-center items-center border-b-4 pb-1 border-gray-200 dark:border-gray-900">
                                    <a 
                                        className={"text-center px-2 py-2 cursor-pointer focus:outline-none border h-10 mt-2 mb-1 mx-2 w-1/3"} 
                                        href={"https://mangadex.org/chapter/" + this.state.id + "/1"} 
                                        target="_blank" 
                                        title={"Read on MangaDex"} 
                                        rel="noopener noreferrer">
                                        MangaDex
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <a 
                                        className={"text-center px-2 py-2 cursor-pointer focus:outline-none border h-10 mt-2 mb-1 mx-2 w-1/3"} 
                                        href={"https://cubari.moe/read/mangadex/" + this.state.mangaId + "/" + ((this.state.chapter !== null && this.state.chapter !== undefined) ? this.state.chapter.replace(".","-") : "0-0") + "/1"} 
                                        target="_blank" 
                                        title={"Read on Cubari"} 
                                        rel="noopener noreferrer">
                                        Cubari
                                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a> 
                                    <button onClick={this.refresh} className="px-2 py-2 hover:opacity-75 cursor-pointer focus:outline-none" title="Refresh">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 w-5"}  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>      
                                <div className="flex-grow mt-2">
                                    {externalUrl}
                                    <div className="flex flex-row px-3">
                                        <Select
                                            options={this.state.optionTheme}
                                            onChange={this.lightDarkMode}
                                            value={this.state.themeSelect}
                                            styles={selectStyle}
                                            className="text-gray-900 dark:text-gray-200 w-full m-2"
                                        />
                                    </div>
                                    <div className="flex flex-row px-3">
                                        <Select
                                            options={this.state.optionImageFit}
                                            onChange={this.changeImageFit}
                                            value={this.state.imageFitSelect}
                                            styles={selectStyle}
                                            className="text-gray-900 dark:text-gray-200 w-full m-2"
                                        />
                                    </div>
                                    <div className="flex flex-row px-3">
                                        <Select
                                            options={this.state.optionReaderLayout}
                                            onChange={this.changeReaderLayout}
                                            value={this.state.layoutSelect}
                                            styles={selectStyle}
                                            className="text-gray-900 dark:text-gray-200 w-full m-2"
                                        />
                                    </div>
                                    <div className="flex flex-row px-3">
                                        <Select
                                            options={this.state.optionProgressBar}
                                            onChange={this.changeProgressBar}
                                            value={this.state.showProgressSelect}
                                            styles={selectStyle}
                                            className="text-gray-900 dark:text-gray-200 w-full m-2"
                                        />
                                    </div>
                                    <div className="flex flex-row px-3">
                                        <Select
                                            options={this.state.optionImageSource}
                                            onChange={this.changeImageSource}
                                            value={this.state.imageSourceSelect}
                                            styles={selectStyle}
                                            className="text-gray-900 dark:text-gray-200 w-full m-2"
                                        />
                                    </div>
                                </div>
                                <footer class="footer relative pt-2">
                                    {pages}
                                    <div className="flex text-lg py-2 border-t-2  border-gray-200 dark:border-gray-900">
                                        <div className="w-1/3">
                                            <Link className={"hover:opacity-75 ml-4 " + colorTheme(600).text} to={"/"}>Home</Link>
                                            <span className="mx-2">|</span>
                                            <Link className={"hover:opacity-75 " + colorTheme(600).text} to={"/follow"}>Follows</Link>
                                        </div>
                                        <div className="w-1/3">
                                        </div>
                                        <div className="w-1/3">
                                            {windowBar}
                                        </div>
                                    </div>
                                </footer>
                            </div>
                        </div>

                        <div title="Show Menu" onClick={this.toggleMenu} className={this.state.classMenuB}>
                            <div className="mx-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Chapter);