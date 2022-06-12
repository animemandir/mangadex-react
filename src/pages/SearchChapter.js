import React from "react";
import { withRouter } from 'react-router-dom';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import Select from 'react-select';
import { mangaContentRating,originalLanguage } from '../util/static.js';
import toast, { Toaster } from 'react-hot-toast';
import Loading from '../component/Loading.js';
import Paginator from '../component/Paginator.js';
import { isLogged } from "../util/loginUtil.js";
import { fetch } from '@tauri-apps/api/http';
import FollowChapterRow from '../component/FollowChapterRow.js';

class SearchChapter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogged: false,
            title: "",
            manga: "",
            translatedLanguage: [],
            originalLanguage: [],
            excludedOriginalLanguage: [],
            contentRating: [],
            orderBy: {value: "createdAt_desc",label: "Created At (Desc)"},
            optionLanguage: [],
            optionContentRating: [],
            optionOrder: [
                {value: "createdAt_asc",label: "Created At (Asc)"},
                {value: "createdAt_desc",label: "Created At (Desc)"},
                {value: "updatedAt_asc",label: "Updated At (Asc)"},
                {value: "updatedAt_desc",label: "Updated At (Desc)"},
                {value: "publishAt_asc",label: "Publish At (Asc)"},
                {value: "publishAt_desc",label: "Publish At (Desc)"},
                {value: "readableAt_asc",label: "Readable At (Asc)"},
                {value: "readableAt_desc",label: "Readable At (Desc)"},
                {value: "volume_asc",label: "Volume (Asc)"},
                {value: "volume_desc",label: "Volume (Desc)"},
                {value: "chapter_asc",label: "Chapter (Asc)"},
                {value: "chapter_desc",label: "Chapter (Desc)"}
            ],

            classForm: "flex flex-wrap pt-2 px-4",
            classTop: {
                left: "w-11/12 flex border-b-2 pb-1 cursor-pointer border-gray-200 dark:border-gray-900",
                right: "w-1/12 flex border-b-2 pb-1 pr-3 cursor-pointer border-gray-200 dark:border-gray-900"
            },
            resultList: [],
            activePage: 1,
            pages: 0,
        };
    }

    async componentDidMount(){
        document.title = "Search Chapter - MangaDex";

        var listMangaContentRating = [];
        var listOriginal = [];
        var contentRating = [];
        var originalLang  = [];

        Object.keys(mangaContentRating).map(function(key){
            listMangaContentRating.push({
                value: key,
                label: mangaContentRating[key]
            });
        });

        Object.keys(originalLanguage).map(function(key){
            listOriginal.push({
                value: key,
                label: originalLanguage[key]
            });
        });

        
        if(localStorage.content){
            let content = JSON.parse(localStorage.content);
            contentRating = content.map(c => {return {value: c,label: mangaContentRating[c]}});
        }

        if(localStorage.original){
            let original = JSON.parse(localStorage.original);
            originalLang = original.map(o => {return {value: o,label: originalLanguage[o]}});
        }

        this.setState({
            optionContentRating: listMangaContentRating,
            optionLanguage: listOriginal,
            contentRating: contentRating,
            originalLanguage: originalLang
        });


        // let query = new URLSearchParams(this.props.location.search);
        // let hide = false

        // if(query.get("rating")){
        //     contentRating  = [{value: query.get("rating"),label: mangaContentRating[query.get("rating")]}];
        //     hide = true;
        // }

        // if(hide){
        //     this.toggleForm();
        // }

        var $this = this;
        isLogged().then(function(isLogged){
            $this.setState({isLogged:isLogged});
        });

        this.setState({
            contentRating: contentRating
        },() => this.searchChapter(1));
    }


    toggleForm = () => {
        let form = ""
        let top = {
            left: "w-11/12 flex border-b-2 pb-1 cursor-pointer border-gray-200 dark:border-gray-900",
            right: "w-1/12 flex border-b-2 pb-1 pr-3 cursor-pointer border-gray-200 dark:border-gray-900"
        }
        if(this.state.classForm === "hidden"){
            form = "flex flex-wrap pt-2 px-4";
        }else{
            form = "hidden"
            top = {
                left: "w-11/12 flex pb-1 cursor-pointer",
                right: "w-1/12 flex pb-1 pr-3 cursor-pointer"
            }
        }

        this.setState({
            classForm:form,
            classTop: top
        });
    }

    searchChapter = (page) => {
        this.setState({resultList:[]});
        var offset = 0;
        if(page > 1){
            offset = (100 * page) - 100;
        }

        var searchParams = {limit: 100,offset: offset};
        if(this.state.title.length > 2){
            searchParams.title = this.state.manga;
        }
        if(this.state.manga.length > 2){
            searchParams.manga = this.state.manga;
        }
        if(this.state.originalLanguage.length > 0){
            let ol = this.state.originalLanguage.map(o => o.value);
            searchParams.originalLanguage = ol;
        }
        if(this.state.excludedOriginalLanguage.length > 0){
            let eol = this.state.excludedOriginalLanguage.map(o => o.value);
            searchParams.excludedOriginalLanguage = eol;
        }
        if(this.state.contentRating.length > 0){
            let cont = this.state.contentRating.map(o => o.value);
            searchParams.contentRating = cont;
        }

        let orderIndex = "createdAt";
        let orderValue = "desc";
        switch(this.state.orderBy.value){
            case "createdAt_asc":
                orderIndex = "createdAt";
                orderValue = "asc";
            break;
            case "createdAt_desc":
                orderIndex = "createdAt";
                orderValue = "desc";
            break;
            case "updatedAt_asc":
                orderIndex = "updatedAt";
                orderValue = "asc";
            break;
            case "updatedAt_desc":
                orderIndex = "updatedAt";
                orderValue = "desc";
            break;
            case "publishAt_asc":
                orderIndex = "publishAt";
                orderValue = "asc";
            break;
            case "publishAt_desc":
                orderIndex = "publishAt";
                orderValue = "desc";
            break;
            case "readableAt_asc":
                orderIndex = "readableAt";
                orderValue = "asc";
            break;
            case "readableAt_desc":
                orderIndex = "readableAt";
                orderValue = "desc";
            break;
            case "volume_asc":
                orderIndex = "volume";
                orderValue = "asc";
            break;
            case "volume_desc":
                orderIndex = "volume";
                orderValue = "desc";
            break;
            case "chapter_asc":
                orderIndex = "chapter";
                orderValue = "asc";
            break;
            case "chapter_desc":
                orderIndex = "chapter";
                orderValue = "desc";
            break;
        }

        var $this = this;
        const queryString = require('query-string');
        let query = queryString.stringify(searchParams,{arrayFormat: 'bracket'});
        fetch('https://api.mangadex.org/chapter?includes[]=manga&order[' + orderIndex + ']=' + orderValue + "&" + query)
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

            if(response.data.total > 0){
                if($this.state.isLogged){
                    $this.getChapterRead(list,mangaList,response.data.total,page);
                }else{
                    $this.getChapterInfo(list,[],response.data.total,page);
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
            toast.error('Error retrieving search data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getChapterRead = (chapterList,mangaList,totalOffset,page) => {
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
            $this.getChapterInfo(chapterList,readList,totalOffset,page);
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving read markers list.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getChapterInfo = (list,readList,totalOffset,page) => {
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
            let list = [];
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

            let total = 0;
            total = (totalOffset/100);
            total = Math.ceil(total);
            if(total < 1){
                total = 1;
            }

            $this.setState({
                resultList: list,
                pages: total,
                activePage: page
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

    changeTitle = (e) => {   
        this.setState({title: e.target.value});
    }

    keypressEnter = (e) => {
        e.preventDefault();
        if(e.key === "Enter"){
            this.searchChapter(1);
        }
    }

    changeManga = (e) => {   
        this.setState({manga: e.target.value});
    }

    keypressManga = (e) => {
        e.preventDefault();
        if(e.key === "Enter"){
            this.searchChapter(1);
        }
    }

    changeLanguage = (e) => {
        this.setState({originalLanguage: e ? e.map(x => x) : []});
    }

    changeExcludedLanguage = (e) => {
        this.setState({excludedOriginalLanguage: e ? e.map(x => x) : []});
    }

    changeContentRating = (e) => {
        this.setState({contentRating: e ? e.map(x => x) : []});
    }

    changeOrder = (e) => {
        this.setState({orderBy: e});
    }

    render = () => {
        var selectStyle = (localStorage.theme === 'dark') ? {
            control: (base) => ({
              ...base,
              background: "#1E293B",
              border: "1px solid #0F172A"
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

        var result = <Loading />
        if(this.state.resultList.length > 0){
            result = 
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
                    {this.state.resultList}
                </tbody>
            </table>
        }
        
        return (
            <div class="flex flex-col justify-between">
                <Toaster />
                <Header isLogged={this.state.isLogged} />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full pt-2 mt-6 mb-6 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="flex flex-wrap">
                                <div className={this.state.classTop.left}  onClick={this.toggleForm}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                                        <path fill-rule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clip-rule="evenodd" />
                                    </svg>
                                    Search (Chapter)
                                </div>
                                <div className={this.state.classTop.right} onClick={this.toggleForm}>
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                            </div>
                            <div className={this.state.classForm}>
                                <table className="table-auto w-full p-4">
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Title:</td>
                                        <td width="80%">
                                            <input type="text" value={this.state.title}  onChange={this.changeTitle} onKeyUp={this.keypressEnter} className="w-full px-2 h-8 rounded dark:bg-gray-600 border dark:border-gray-900" /> 
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Manga (UUID only):</td>
                                        <td width="80%">
                                            <input type="text" value={this.state.manga}  onChange={this.changeManga} onKeyUp={this.keypressEnter} className="w-full px-2 h-8 rounded dark:bg-gray-600 border dark:border-gray-900" /> 
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Original Language:</td>
                                        <td width="80%">
                                            <Select
                                                isMulti={true}
                                                options={this.state.optionLanguage}
                                                onChange={this.changeLanguage}
                                                value={this.state.originalLanguage}
                                                styles={selectStyle}
                                                className="text-gray-900 dark:text-gray-200"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Excluded Original Language:</td>
                                        <td width="80%">
                                            <Select
                                                isMulti={true}
                                                options={this.state.optionLanguage}
                                                onChange={this.changeExcludedLanguage}
                                                value={this.state.excludedOriginalLanguage}
                                                styles={selectStyle}
                                                className="text-gray-900 dark:text-gray-200"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Content Rating:</td>
                                        <td width="80%">
                                            <Select
                                                isMulti={true}
                                                options={this.state.optionContentRating}
                                                onChange={this.changeContentRating}
                                                value={this.state.contentRating}
                                                styles={selectStyle}
                                                className="text-gray-900 dark:text-gray-200"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Order By:</td>
                                        <td width="80%">
                                        <Select
                                                isMulti={false}
                                                options={this.state.optionOrder}
                                                onChange={this.changeOrder}
                                                value={this.state.orderBy}
                                                styles={selectStyle}
                                                className="text-gray-900 dark:text-gray-200"
                                            />
                                        </td>
                                    </tr>
                                </table>
                                <div className="w-full mt-2">
                                    <button onClick={() => this.searchChapter(1)} className="w-auto float-right mx-1 border-2 py-1 px-3 mb-2 cursor-pointer focus:outline-none hover:opacity-75 border-gray-200 dark:border-gray-900">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="box-border w-full min-h-screen pt-2 mb-6 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="flex flex-wrap p-2">
                                {result}
                                <div className="w-full">
                                    <Paginator active={this.state.activePage} pages={this.state.pages} func={(page) => this.searchChapter(page)}/>
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

export default withRouter(SearchChapter);