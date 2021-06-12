import React from "react";
import axios from 'axios';
import { withRouter } from "react-router";
import { demographic,mangaStatus } from '../util/static.js';
import { linkParser } from '../util/linkParser.js';
import { Link } from "react-router-dom";
import Tags from '../component/Tags.js';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';

class Title extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: '',
            coverFile: '',
            author: '',
            artist: '',
            title: '',
            demo: '',
            status: '',
            description: '',
            originalLanguage: '',
            altTitles: [],
            genre: [],
            theme: [],
            official: [],
            retail: [],
            information: [],
        };
    }

    componentDidMount = () => {
        document.title = "Manga - Mangadex";
        const id = this.props.match.params.id;
        this.setState({id:id});
        this.getMangaInfo(id)
    }

    getMangaInfo = (id) => {
        var $this = this;
        axios.get('https://api.mangadex.org/manga/' + id + '?includes[]=author&includes[]=artist&includes[]=cover_art')
        .then(function(response){
            console.log(response);

            response.data.relationships.map((relation) => {
                switch(relation.type){
                    case "artist":
                        let artist = relation.attributes.name;
                        $this.setState({artist:artist});
                    break;
                    case "author":
                        let author = relation.attributes.name;
                        $this.setState({author:author});
                    break;
                    case "cover_art":
                        let coverFile = "https://uploads.mangadex.org/covers/" +  id + "/" + relation.attributes.fileName + ".512.jpg";
                        $this.setState({coverFile:coverFile});
                    break;
                } 
            });

            let title = "";
            Object.keys(response.data.data.attributes.title).map(function(key){
                if(key == "en" || title == ""){
                    title = response.data.data.attributes.title[key];
                }
            });

            let altTitles = [];
            for(let i = 0; i < response.data.data.attributes.altTitles.length; i++){
                Object.keys(response.data.data.attributes.altTitles[i]).map(function(key){
                    altTitles.push(response.data.data.attributes.altTitles[i][key]);
                });
            }

            let genre = [];
            let theme = [];
            for(let i = 0; i < response.data.data.attributes.tags.length; i++){
                let tempTag = "";
                Object.keys(response.data.data.attributes.tags[i].attributes.name).map(function(key){
                    tempTag = response.data.data.attributes.tags[i].attributes.name[key];
                });
                switch(response.data.data.attributes.tags[i].attributes.group){
                    case "genre":
                        genre.push(tempTag);
                    break;
                    case "theme":
                        theme.push(tempTag);
                    break;
                }
            }

            let parsedLinks = linkParser(response.data.data.attributes.links);

            let originalLanguage = response.data.data.attributes.originalLanguage;
            let demo = demographic[response.data.data.attributes.publicationDemographic];
            let status = mangaStatus[response.data.data.attributes.status];
            let description = response.data.data.attributes.description.en;

            $this.setState({
                title:title,
                demo:demo,
                status: status,
                description: description,
                originalLanguage: originalLanguage,
                altTitles: altTitles,
                genre: genre,
                theme: theme,
                official: parsedLinks.official,
                retail: parsedLinks.retail,
                information: parsedLinks.information,
            });
            document.title = title + " - Mangadex";
        })
        .catch(function(error){
            console.log(error);
        });
    }

    render = () => {
        var altTitles = this.state.altTitles.map((alt) => <li>{alt}</li>);
        var genre = this.state.genre.map((g) => <Tags name={g} />);
        var theme = this.state.theme.map((t) => <Tags name={t} />);
        var official = this.state.official.map((o) => <Tags name={o.name} url={o.url}/>);
        var retail = this.state.retail.map((r) => <Tags name={r.name}  url={r.url}/>);
        var information = this.state.information.map((i) => <Tags name={i.name}  url={i.url}/>);
        return (
            <div class="flex flex-col h-screen justify-between">
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between">
                        <div className="box-border w-full py-2 mt-6 mb-6 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-left text-lg border-b-2 pb-1 px-2 border-gray-200 dark:border-gray-900">
                                {this.state.title}
                            </div>
                            <div className="flex flex-wrap">
                                <div className="content flex w-full mt-2">
                                    <img 
                                        className="object-contain w-full sm:w-1/4 p-3"
                                        style={{height:"fit-content"}}
                                        alt={this.state.title}
                                        src={this.state.coverFile} />
                                    <div className="item-body w-full sm:w-3/4 p-3">
                                        <table class="table-auto w-full p-2 ">
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Title ID:</td>
                                                <td width="80%">{this.state.id}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Alt name(s):</td>
                                                <td width="80%">
                                                    <ul>{altTitles}</ul>
                                                </td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Author:</td>
                                                <td width="80%">{this.state.author}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Artist:</td>
                                                <td width="80%">{this.state.artist}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Demographic:</td>
                                                <td width="80%"><Tags name={this.state.demo}/></td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Genre:</td>
                                                <td width="80%">{genre}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Theme:</td>
                                                <td width="80%">{theme}</td>
                                            </tr>
                                            <tr className="text-left hidden border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Rating:</td>
                                                <td width="80%">Coming soon (?)</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Pub. status:</td>
                                                <td width="80%">{this.state.status}</td>
                                            </tr>
                                            <tr className="text-left hidden border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Stats:</td>
                                                <td width="80%">Coming soon (?)</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Description:</td>
                                                <td width="80%" className="text-justify">{this.state.description}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Official:</td>
                                                <td width="80%">{official}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Retail:</td>
                                                <td width="80%">{retail}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Information:</td>
                                                <td width="80%">{information}</td>
                                            </tr>
                                            <tr className="text-left hidden border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Reading progress:</td>
                                                <td width="80%">Coming soon (?)</td>
                                            </tr>
                                            <tr className="text-left hidden">
                                                <td width="20%" className="font-semibold">Actions:</td>
                                                <td width="80%">Coming soon (?)</td>
                                            </tr>
                                        </table>
                                    </div>
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

export default withRouter(Title);