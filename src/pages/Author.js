import React from "react";
import axios from 'axios';
import { withRouter } from "react-router";
import toast, { Toaster } from 'react-hot-toast';
import Header from '../component/Header.js';
import Footer from '../component/Footer.js';
import MangaBox from '../component/MangaBox.js';
import Loading from '../component/Loading.js';
class Author extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id: "",
            name: "",
            image: "",
            version: "",
            biography: [],
            box: [],
            mangaList: [<Loading />]
        };
    }

    componentDidMount = () => {
        document.title = "Author - Mangadex";
        const id = this.props.match.params.id;
        this.setState({id:id},() => this.init());
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
            let image = response.data.data.attributes.imageUrl;
            let biography = response.data.data.attributes.biography;

            $this.setState({
                name:name,
                version:version,
                image: image,
                biography: biography,
            });
            document.title = name + " - Mangadex";
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
            
            let list = mangaList.map((manga) => <MangaBox data={manga} />);
            $this.setState({mangaList:list});
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error retrieving search data.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    render = () => {
        var bio = this.state.biography.map((b) => 
            <div className="text-justify">
                {b}
            </div>
        )
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
                                                <td width="80%" className="text-justify">{bio}</td>
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