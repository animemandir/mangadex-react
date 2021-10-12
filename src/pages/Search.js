import React from "react";
import { withRouter } from 'react-router-dom';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import Select from 'react-select';
import { demographic,mangaStatus,mangaContentRating,originalLanguage } from '../util/static.js';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import MangaBox from '../component/MangaBox.js';
import Loading from '../component/Loading.js';
import Paginator from '../component/Paginator.js';
class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            manga: "",
            author: "",
            artist: "",
            originalLanguage: [],
            demographic: [],
            publication: [],
            contentRating: [],
            tagsInclude: [],
            tagsExclude: [],
            tagsInclusionMode: "and",
            tagsExclusionMode: "and",
            tagsInclusionModeChecked: [true,false],
            tagsExclusionModeChecked: [true,false],
            orderBy: {value: "upload_desc",label: "Lastest Upload"},
            
            optionLanguage: [],
            optionDemographic: [],
            optionPublication: [],
            optionContentRating: [],
            optionTags: [],
            optionOrder: [
                {value: "revelance_desc",label: "Best Match"},
                {value: "upload_desc",label: "Lastest Upload"},
                {value: "upload_asc",label: "Oldest Upload"},
                {value: "title_asc",label: "Title Ascending"},
                {value: "title_desc",label: "Title Descending"},
                {value: "created_desc",label: "Recently Added"},
                {value: "created_asc",label: "Oldest Added"},
                {value: "follow_desc",label: "Most Follows"},
                {value: "follow_asc",label: "Fewest Follows"},
                {value: "year_desc",label: "Year Descending"},
                {value: "year_asc",label: "Year Ascending"},
            ],

            classForm: "flex flex-wrap pt-2 px-4",
            classTop: {
                left: "w-11/12 flex border-b-2 pb-1 cursor-pointer border-gray-200 dark:border-gray-900",
                right: "w-1/12 flex border-b-2 pb-1 pr-3 cursor-pointer border-gray-200 dark:border-gray-900"
            },
            resultList: []
        };
    }

    componentDidMount = () => {
        document.title = "Search - MangaDex";

        var listDemographic = [];
        var listPublication = [];
        var listMangaContentRating = [];
        var listOriginal = [];
        var contentRating = [];
        var originalLang  = [];

        Object.keys(demographic).map(function(key){
            listDemographic.push({
                value: key,
                label: demographic[key]
            });
        });

        Object.keys(mangaStatus).map(function(key){
            listPublication.push({
                value: key,
                label: mangaStatus[key]
            });
        });

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
            optionDemographic: listDemographic,
            optionPublication: listPublication,
            optionContentRating: listMangaContentRating,
            optionLanguage: listOriginal,
            contentRating: contentRating,
            originalLanguage: originalLang
        });

        this.getTags();

        let query = new URLSearchParams(this.props.location.search);
        let hide = false
        let manga = "";
        let author = "";
        let artist = "";
        let demo = [];
        let tag = [];
        if(query.get("manga")){
            manga = query.get("manga");
            hide = true;
        }

        if(query.get("author")){
            author = query.get("author");
            hide = true;
        }

        if(query.get("artist")){
            artist = query.get("artist");
            hide = true;
        }

        if(query.get("demographic")){
            demo  = [{value: query.get("demographic"),label: demographic[query.get("demographic")]}];
            hide = true;
        }

        if(query.get("rating")){
            contentRating  = [{value: query.get("rating"),label: mangaContentRating[query.get("rating")]}];
            hide = true;
        }

        if(query.get("tag")){
            tag  = [{value: query.get("tag"),label: query.get("tagName")}];
            hide = true;
        }

        if(hide){
            this.toggleForm();
        }
        this.setState({
            manga:manga,
            author:author,
            artist:artist,
            demographic: demo,
            contentRating: contentRating,
            tagsInclude: tag
        },() => this.searchManga(1));
    }

    getTags = () => {
        var $this = this;
        axios.get('https://api.mangadex.org/manga/tag')
        .then(function(response){
            var tagList = [];
            response.data.data.map((tag) => {
                let label = "";
                Object.keys(tag.attributes.name).map(function(key){
                    if(key === "en" || label === ""){
                        label = tag.attributes.name[key];
                    }
                });
                tagList.push({
                    value: tag.id,
                    label: label
                });
            });

            $this.setState({
                optionTags: tagList
            });
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving tags.',{
                duration: 4000,
                position: 'top-right',
            });
        });
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

    searchManga = (page) => {
        this.setState({resultList:[<Loading />]});
        var offset = 0;
        if(page > 1){
            offset = (100 * page) - 100;
        }

        var searchParams = {limit: 100,offset: offset};
        if(this.state.manga.length > 2){
            searchParams.title = this.state.manga;
        }
        if(this.state.author.length > 2){
            searchParams.authors = [this.state.author];
        }
        if(this.state.artist.length > 2){
            searchParams.artists = [this.state.artist];
        }
        if(this.state.originalLanguage.length > 0){
            let ol = this.state.originalLanguage.map(o => o.value);
            searchParams.originalLanguage = ol;
        }
        if(this.state.demographic.length > 0){
            let demo = this.state.demographic.map(o => o.value);
            searchParams.publicationDemographic = demo;
        }
        if(this.state.publication.length > 0){
            let pub = this.state.publication.map(o => o.value);
            searchParams.status = pub;
        }
        if(this.state.contentRating.length > 0){
            let cont = this.state.contentRating.map(o => o.value);
            searchParams.contentRating = cont;
        }
        if(this.state.tagsInclude.length > 0){
            let ti = this.state.tagsInclude.map(o => o.value);
            searchParams.includedTags = ti;
            searchParams.includedTagsMode = this.state.tagsInclusionMode.toUpperCase();
        }
        if(this.state.tagsExclude.length > 0){
            let te = this.state.tagsExclude.map(o => o.value);
            searchParams.excludedTags = te;
            searchParams.excludedTagsMode = this.state.tagsExclusionMode.toUpperCase();
        }

        let orderIndex = "latestUploadedChapter";
        let orderValue = "desc";
        console.log(this.state.orderBy);
        switch(this.state.orderBy.value){
            case "revelance_desc":
                orderIndex = "relevance";
                orderValue = "desc";
            break;
            case "upload_desc":
                orderIndex = "latestUploadedChapter";
                orderValue = "desc";
            break;
            case "upload_asc":
                orderIndex = "latestUploadedChapter";
                orderValue = "asc";
            break;
            case "title_asc":
                orderIndex = "title";
                orderValue = "asc";
            break;
            case "title_desc":
                orderIndex = "title";
                orderValue = "desc";
            break;
            case "created_desc":
                orderIndex = "createdAt";
                orderValue = "desc";
            break;
            case "created_asc":
                orderIndex = "createdAt";
                orderValue = "asc";
            break;
            case "follow_desc":
                orderIndex = "followedCount";
                orderValue = "desc";
            break;
            case "follow_asc":
                orderIndex = "followedCount";
                orderValue = "asc";
            break;
            case "year_desc":
                orderIndex = "year";
                orderValue = "desc";
            break;
            case "year_asc":
                orderIndex = "year";
                orderValue = "asc";
            break;
        }

        var $this = this;
        axios.get('https://api.mangadex.org/manga?includes[]=cover_art&order[' + orderIndex + ']=' + orderValue,{
            params: searchParams
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
            
            let list = mangaList.map((manga) => <MangaBox data={manga} />);

            let total = 0;
            total = (response.data.total/100);
            total = Math.ceil(total);
            if(total < 1){
                total = 1;
            }

            $this.setState({
                resultList:list,
                pages: total,
                activePage: page
            });
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving search data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    randomManga = () => {
        this.setState({resultList:[<Loading />]});

        var $this = this;
        axios.get('https://api.mangadex.org/manga/random?includes[]=cover_art')
        .then(function(response){
            var mangaList = [];

            let coverFile = "";
            response.data.data.relationships.map((relation) => {
                switch(relation.type){
                    case "cover_art":
                        coverFile = "https://uploads.mangadex.org/covers/" +  response.data.data.id + "/" + relation.attributes.fileName + ".512.jpg";
                    break;
                } 
            });

            let title = "";
            console.log(response.data.data);
            Object.keys(response.data.data.attributes.title).map(function(key){
                if(key === "en" || title === ""){
                    title = response.data.data.attributes.title[key];
                }
            });

            let description = "";
            Object.keys(response.data.data.attributes.description).map(function(key){
                if(key === "en" || description === ""){
                    description = response.data.data.attributes.description[key];
                }
            });

            mangaList.push({
                mangaId: response.data.data.id,
                mangaName: title,
                cover: coverFile,
                originalLanguage: response.data.data.attributes.originalLanguage,
                description: description
            });
            
            let list = mangaList.map((manga) => <MangaBox data={manga} />);
            $this.setState({resultList:list});
        })
        .catch(function(error){
            console.log(error)
            toast.error('Error retrieving random data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    changeManga = (e) => {
        this.setState({manga: e.target.value});
    }

    changeAuthor = (e) => {
        this.setState({author: e.target.value});
    }

    changeArtist = (e) => {
        this.setState({artist: e.target.value});
    }

    changeLanguage = (e) => {
        this.setState({originalLanguage: e ? e.map(x => x) : []});
    }

    changeDemographic = (e) => {
        this.setState({demographic: e ? e.map(x => x) : []});
    }

    changePublication = (e) => {
        this.setState({publication: e ? e.map(x => x) : []});
    }

    changeContentRating = (e) => {
        this.setState({contentRating: e ? e.map(x => x) : []});
    }

    changeTagsInclude = (e) => {
        this.setState({tagsInclude: e ? e.map(x => x) : []});
    }

    changeTagsExclude = (e) => {
        this.setState({tagsExclude: e ? e.map(x => x) : []});
    }

    changeOrder = (e) => {
        this.setState({orderBy: e});
    }

    changeTagIncludeMode = (value) => {
        if(value === "and"){
            this.setState({
                tagsInclusionModeChecked: [true,false],
                tagsInclusionMode: value
            });
        }else{
            this.setState({
                tagsInclusionModeChecked: [false,true],
                tagsInclusionMode: value
            });
        }
    }

    changeTagExcludeMode = (value) => {
        if(value === "and"){
            this.setState({
                tagsExclusionModeChecked: [true,false],
                tagsExclusionMode: value
            });
        }else{
            this.setState({
                tagsExclusionModeChecked: [false,true],
                tagsExclusionMode: value
            });
        }
    }

    render = () => {
        var selectStyle = (localStorage.theme === 'dark') ? {
            control: (base) => ({
              ...base,
              background: "#6B7280",
            }),
            menu: (base) => ({
              ...base,
              background: "#6B7280",
              borderRadius: 0,
              marginTop: 0
            }),
            menuList: (base) => ({
              ...base,
              background: "#6B7280",
              padding: 0
            }),
            placeholder: (base) => ({
                ...base,
                color: "#D1D5DB",
            }),
            option: (base,{ isFocused }) => ({
                ...base,
                background: (isFocused) ? "#4B5563" : "#6B7280",
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
        return (
            <div class="flex flex-col justify-between">
                <Toaster />
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full pt-2 mt-6 mb-6 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="flex flex-wrap">
                                <div className={this.state.classTop.left}  onClick={this.toggleForm}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mx-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
                                        <path fill-rule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clip-rule="evenodd" />
                                    </svg>
                                    Search
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
                                        <td width="20%" className="font-semibold text-right px-4">Manga:</td>
                                        <td width="80%">
                                            <input type="text" value={this.state.manga}  onChange={this.changeManga} className="w-full px-2 h-8 rounded dark:bg-gray-600 border dark:border-gray-900" /> 
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Author (UUID only):</td>
                                        <td width="80%">
                                            <input type="text" value={this.state.author}  onChange={this.changeAuthor} className="w-full px-2 h-8 rounded dark:bg-gray-600 border dark:border-gray-900" /> 
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Artist (UUID only):</td>
                                        <td width="80%">
                                            <input type="text" value={this.state.artist}  onChange={this.changeArtist} className="w-full px-2 h-8 rounded dark:bg-gray-600 border dark:border-gray-900" /> 
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
                                        <td width="20%" className="font-semibold text-right px-4">Demographic:</td>
                                        <td width="80%">
                                            <Select
                                                isMulti={true}
                                                options={this.state.optionDemographic}
                                                onChange={this.changeDemographic}
                                                value={this.state.demographic}
                                                styles={selectStyle}
                                                className="text-gray-900 dark:text-gray-200"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Publication Status:</td>
                                        <td width="80%">
                                            <Select
                                                isMulti={true}
                                                options={this.state.optionPublication}
                                                onChange={this.changePublication}
                                                value={this.state.publication}
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
                                        <td width="20%" className="font-semibold text-right px-4">Tags Included:</td>
                                        <td width="80%">
                                            <Select
                                                isMulti={true}
                                                options={this.state.optionTags}
                                                onChange={this.changeTagsInclude}
                                                value={this.state.tagsInclude}
                                                styles={selectStyle}
                                                className="text-gray-900 dark:text-gray-200"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Tags Excluded:</td>
                                        <td width="80%">
                                        <Select
                                                isMulti={true}
                                                options={this.state.optionTags}
                                                onChange={this.changeTagsExclude}
                                                value={this.state.tagsExclude}
                                                styles={selectStyle}
                                                className="text-gray-900 dark:text-gray-200"
                                            />
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Tags inclusion mode:</td>
                                        <td width="80%">
                                            <label className="inline-flex mr-4 mt-1 cursor-pointer"  >
                                                <input 
                                                    type="radio" 
                                                    value="and" 
                                                    className="h-6 mr-2" 
                                                    name="tagsInclusion" 
                                                    onChange={() => this.changeTagIncludeMode("and")}
                                                    checked={this.state.tagsInclusionModeChecked[0]}/> All (AND)
                                            </label>
                                            <label className="inline-flex mt-1 cursor-pointer" >
                                                <input 
                                                    type="radio" 
                                                    value="or" 
                                                    className="h-6 mr-2" 
                                                    name="tagsInclusion" 
                                                    onChange={() => this.changeTagIncludeMode("or")}
                                                    checked={this.state.tagsInclusionModeChecked[1]}/> Any (OR)
                                            </label>
                                        </td>
                                    </tr>
                                    <tr className="h-12">
                                        <td width="20%" className="font-semibold text-right px-4">Tags exclusion mode:</td>
                                        <td width="80%">
                                            <label className="inline-flex mr-4 mt-1 cursor-pointer" >
                                                <input 
                                                    type="radio" 
                                                    value="and" 
                                                    className="h-6 mr-2" 
                                                    name="tagsExclusion" 
                                                    onChange={() => this.changeTagExcludeMode("and")}
                                                    checked={this.state.tagsExclusionModeChecked[0]}/> All (AND)
                                            </label>
                                            <label className="inline-flex mt-1 cursor-pointer" >
                                                <input 
                                                    type="radio" 
                                                    value="or" 
                                                    className="h-6 mr-2" 
                                                    name="tagsExclusion" 
                                                    onChange={() => this.changeTagExcludeMode("or")}
                                                    checked={this.state.tagsExclusionModeChecked[1]}/> Any (OR)
                                            </label>
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
                                    <button onClick={() => this.searchManga(1)} className="w-auto float-right mx-1 border-2 py-1 px-3 mb-2 cursor-pointer focus:outline-none hover:opacity-75 border-gray-200 dark:border-gray-900">
                                        Search
                                    </button>
                                    <button onClick={() => this.randomManga()} className="w-auto float-right mx-1 border-2 py-1 px-3 mb-2 cursor-pointer focus:outline-none hover:opacity-75 border-gray-200 dark:border-gray-900">
                                        Ignore everything and yolo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="box-border w-full min-h-screen pt-2 mb-6 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="flex flex-wrap p-2">
                                {this.state.resultList}
                                <div className="w-full">
                                    <Paginator active={this.state.activePage} pages={this.state.pages} func={(page) => this.searchManga(page)}/>
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

export default withRouter(Search);