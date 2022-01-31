import React from "react";
import axios from 'axios';
import { withRouter } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import MangaBox from '../component/MangaBox.js';
import Loading from '../component/Loading.js';
import Tags from '../component/Tags.js';
import { isLogged } from "../util/loginUtil.js";

class Author extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogged: false,
            id: "",
            name: "",
            image: process.env.PUBLIC_URL + "/notfound.png",
            version: "",
            twitter: null,
            pixiv: null,
            melonBook: null,
            fanBox: null,
            booth: null,
            nicoVideo: null,
            skeb: null,
            fantia: null,
            tumblr: null,
            youtube: null,
            weibo: null,
            naver: null,
            website: null,
            biography: [],
            box: [],
            mangaList: [<Loading />]
        };
    }

    async componentDidMount(){
        document.title = "Author - Mangadex";
        const id = this.props.match.params.id;
        let logged = await isLogged();
        this.setState({
            id:id,
            isLogged: logged
        },() => this.init());
    }

    init = () => {
        this.getAuthor();
    }

    getAuthor = () => {
        var $this = this;
        axios.get('https://api.mangadex.org/author/' + this.state.id)
        .then(function(response){
            let name = response.data.data.attributes.name;
            let version = response.data.data.attributes.version;
            let image = (response.data.data.attributes.imageUrl !== null) ? response.data.data.attributes.imageUrl : process.env.PUBLIC_URL + "/notfound.png";
            let biography = "";
            Object.keys(response.data.data.attributes.biography).map(function(key){
                if(key === "en" || biography === ""){
                    biography = response.data.data.attributes.biography[key];
                }
            });
            
            let twitter = response.data.data.attributes.twitter;
            let pixiv = response.data.data.attributes.pixiv;
            let melonBook = response.data.data.attributes.melonBook;
            let fanBox = response.data.data.attributes.fanBox;
            let booth = response.data.data.attributes.booth;
            let nicoVideo = response.data.data.attributes.nicoVideo;
            let skeb = response.data.data.attributes.skeb;
            let fantia = response.data.data.attributes.fantia;
            let tumblr = response.data.data.attributes.tumblr;
            let youtube = response.data.data.attributes.youtube;
            let weibo = response.data.data.attributes.weibo;
            let naver = response.data.data.attributes.naver;
            let website = response.data.data.attributes.website;

            $this.setState({
                name:name,
                version:version,
                image: image,
                biography: biography,
                twitter: twitter,
                pixiv: pixiv,
                melonBook: melonBook,
                fanBox: fanBox,
                booth: booth,
                nicoVideo: nicoVideo,
                skeb: skeb,
                fantia: fantia,
                tumblr: tumblr,
                youtube: youtube,
                weibo: weibo,
                naver: naver,
                website: website,
            });
            document.title = "Author: " + name + " - Mangadex";
            $this.getMangaList();
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving manga data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    getMangaList = () => {
        var contentRating = [];
        if(localStorage.content){
            let content = JSON.parse(localStorage.content);
            contentRating = content.map(c => c);
        }

        var $this = this;
        axios.get('https://api.mangadex.org/manga?includes[]=cover_art',{
            params: {
                limit: 100,            
                authors: [this.state.id],
                contentRating: contentRating
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
            if($this.state.isLogged){
                $this.getStatistics(mangaList);
            }else{
                let list = mangaList.map((manga) => <MangaBox data={manga} />);
                $this.setState({mangaList:list});
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

    getStatistics = (mangaList) => {
        let idList = [];
        for(let a = 0; a < mangaList.length; a++){
            idList.push(mangaList[a].mangaId);
        }
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        axios.get('https://api.mangadex.org/statistics/manga',{
            headers: {  
                Authorization: bearer
            },
            params: {
                manga: idList
            }
        })
        .then(function(response){
            for(let a = 0; a < mangaList.length; a++){
                let mean = 0;
                let followCount = 0;
                if(response.data.statistics[mangaList[a].mangaId] !== undefined){
                    mean = response.data.statistics[mangaList[a].mangaId].rating.average;
                    if(mean === undefined || mean === null){
                        mean = 0;
                    }

                    followCount = response.data.statistics[mangaList[a].mangaId].follows;
                    if(followCount === undefined || followCount === null){
                        followCount = 0;
                    }
                }
                
                mangaList[a].meanRating = mean.toFixed(2);
                mangaList[a].followCount = followCount;
            }

            let list = mangaList.map((manga) => <MangaBox data={manga} />);
            $this.setState({
                mangaList:list
            });
            
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving statistics.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    render = () => {
        var twitter = (this.state.twitter !== null && this.state.twitter !== undefined) ? <Tags name="Twitter" url={this.state.twitter}/> : "";
        var pixiv = (this.state.pixiv !== null && this.state.pixiv !== undefined) ? <Tags name="Pixiv" url={this.state.pixiv}/> : "";
        var melonBook = (this.state.melonBook !== null && this.state.melonBook !== undefined) ? <Tags name="Melon Books" url={this.state.melonBook}/> : "";
        var fanBox = (this.state.fanBox !== null && this.state.fanBox !== undefined) ? <Tags name="Fanbox" url={this.state.fanBox}/> : "";
        var booth = (this.state.booth !== null && this.state.booth !== undefined) ? <Tags name="Booth" url={this.state.booth}/> : "";
        var nicoVideo = (this.state.nicoVideo !== null && this.state.nicoVideo !== undefined) ? <Tags name="Nico Video" url={this.state.nicoVideo}/> : "";
        var skeb = (this.state.skeb !== null && this.state.skeb !== undefined) ? <Tags name="Skeb" url={this.state.skeb}/> : "";
        var fantia = (this.state.fantia !== null && this.state.fantia !== undefined) ? <Tags name="Fantia" url={this.state.fantia}/> : "";
        var tumblr = (this.state.tumblr !== null && this.state.tumblr !== undefined) ? <Tags name="Tumblr" url={this.state.tumblr}/> : "";
        var youtube = (this.state.youtube !== null && this.state.youtube !== undefined) ? <Tags name="YouTube" url={this.state.youtube}/> : "";
        var weibo = (this.state.weibo !== null && this.state.weibo !== undefined) ? <Tags name="Weibo" url={this.state.weibo}/> : "";
        var naver = (this.state.naver !== null && this.state.naver !== undefined) ? <Tags name="Naver" url={this.state.naver}/> : "";
        var website = (this.state.website !== null && this.state.website !== undefined) ? <Tags name="Website" url={this.state.website}/> : "";
        var links = <div>{twitter} {pixiv} {melonBook} {fanBox} {booth} {nicoVideo} {skeb} {fantia} {tumblr} {youtube} {weibo} {naver} {website}</div>; 

        return (
            <div class="flex flex-col justify-between">
                <Toaster />
                <Header />
                <div className="h-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-100">
                    <div className="container mx-auto px-4 flex flex-wrap justify-between min-h-screen">
                        <div className="box-border w-full py-2 mt-6 mb-2 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="text-left text-lg flex flex-wrap border-b-2 pb-1 px-3 border-gray-200 dark:border-gray-900">
                                <span className="mr-2">{this.state.name}</span> 
                            </div>
                            <div className="flex flex-wrap">
                                <div className="content flex w-full mt-2">
                                    <img 
                                        className="object-contain title-img-height flex items-start w-full sm:w-1/4 p-3"
                                        alt={this.state.name}
                                        src={this.state.image} />
                                    <div className="item-body w-full sm:w-3/4 p-3">
                                        <table class="table-auto w-full p-2">
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Author ID:</td>
                                                <td width="80%">{this.state.id}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Version:</td>
                                                <td width="80%">{this.state.version}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Biography:</td>
                                                <td width="80%" className="text-justify">{this.state.biography}</td>
                                            </tr>
                                            <tr className="text-left border-b border-gray-200 dark:border-gray-900">
                                                <td width="20%" className="font-semibold">Links:</td>
                                                <td width="80%" className="text-justify">{links}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box-border w-full pt-2 mt-2 mb-6 mr-1 border-2 border-gray-200 dark:border-gray-900">
                            <div className="flex flex-wrap p-2">
                                {this.state.mangaList}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(Author);