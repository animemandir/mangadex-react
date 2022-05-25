import React from "react";
import { Link } from "react-router-dom";
import LanguageFlag  from './LanguageFlag.js';
import { DateTime } from "luxon";
import { colorTheme } from "../util/colorTheme";
import toast from 'react-hot-toast';
import { fetch } from '@tauri-apps/api/http';

class TitleTableRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            chapterLabel: "",
            groups: [],
            userId: "",
            userName: "",
            chapterUrl: "",
            target: "",
            rel: "",
            read: false
        };
    }

    markChapterRead = (id) => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        fetch('https://api.mangadex.org/chapter/' + id + '/read',{
            method: "POST",
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            if(response.data.result === "ok"){
                $this.setState({read: true});
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

    markChapterUnread = (id) => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        fetch('https://api.mangadex.org/chapter/' + id + '/read',{
            method: "DELETE",
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            if(response.data.result === "ok"){
                $this.setState({read: false});
                toast.success('Chapter marked as unread.',{
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

    componentDidMount = () => {
        let url = (this.props.data.attributes.externalUrl === null) ? "/chapter/" + this.props.data.id + "/1" : this.props.data.attributes.externalUrl;
        let target = (this.props.data.attributes.externalUrl === null) ? "" : "_blank";
        let rel = (this.props.data.attributes.externalUrl === null) ? "" : "noreferrer";
        let label = "";
        if(this.props.data.attributes.volume){
            label += "Volume " + this.props.data.attributes.volume + " ";
        }
        if(this.props.data.attributes.chapter){
            label += "Chapter " + this.props.data.attributes.chapter + " ";
        }
        if(label === ""){
            label += "Oneshot ";
        }
        if(this.props.data.attributes.title){
            label += "- " + this.props.data.attributes.title;
        }

        this.props.data.relationships.map((relation) => {
            switch(relation.type){
                case "scanlation_group":
                    let groups = this.state.groups;
                    groups.push({
                        id: relation.id,
                        name:  relation.attributes.name
                    });
                    this.setState({
                        groups: groups
                    });
                break;
                case "user":
                    if(relation.attributes){
                        let userName = relation.attributes.username;
                        this.setState({
                            userId: relation.id,
                            userName: userName
                        });
                    }
                break;
            } 
        });

        this.setState({
            chapterLabel: label,
            chapterUrl: url,
            target: target,
            rel: rel,
            read: this.props.data.read
        });
    }

    render = () => {
        var readMarker = "";
        if(this.props.data.isLogged){
            if(this.state.read){
                readMarker = 
                <td title="Read">
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => this.markChapterUnread(this.props.data.id)} className="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </td>
            }else{
                readMarker = 
                <td title="Didn't Read">
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => this.markChapterRead(this.props.data.id)} className="h-5 w-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                </td>
            }
        }

        var group = this.state.groups.map((g) => 
        <div className="w-full">
            <Link className={colorTheme(500).text} to={"/group/" + g.id}>
                {g.name}
            </Link>
        </div>);

        var link = 
        <Link className={colorTheme(500).text} to={this.state.chapterUrl} title={this.state.chapterLabel} target={this.state.target} rel={this.state.rel}>
            {this.state.chapterLabel}
        </Link>
        if(this.state.target === "_blank"){
            link = 
            <a className={colorTheme(500).text} href={this.state.chapterUrl} title={this.state.chapterLabel} target={this.state.target} rel={this.state.rel}>
                {this.state.chapterLabel} 
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </a>
        }

        return (
            <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                {readMarker}
                <td>
                    {link}
                </td>
                <td>
                    <LanguageFlag language={this.props.data.attributes.translatedLanguage} />
                </td>
                <td>
                    {group}
                </td>
                <td>
                    <Link className={colorTheme(500).text} to={"/user/" + this.state.userId}>
                        {this.state.userName}
                    </Link>
                </td>
                <td className="hidden">1000</td>
                <td title={this.props.data.attributes.createdAt}>
                    {DateTime.fromISO(this.props.data.attributes.createdAt).toRelative()}
                </td>
            </tr>
        );
    }
}

export default TitleTableRow;