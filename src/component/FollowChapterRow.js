import React from "react";
import { Link } from "react-router-dom";
import LanguageFlag  from './LanguageFlag.js';
import { DateTime } from "luxon";
import { colorTheme } from "../util/colorTheme";

class FollowChapterRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            chapterLabel: "",
            groups: [],
            userId: "",
            userName: "",
            mangaId: "",
            mangaName: ""
        };
    }

    componentDidMount = () => {
        let label = "";
        if(this.props.data.data.attributes.volume){
            label += "Volume " + this.props.data.data.attributes.volume + " ";
        }
        if(this.props.data.data.attributes.chapter){
            label += "Chapter " + this.props.data.data.attributes.chapter + " ";
        }
        if(this.props.data.data.attributes.title){
            label += "- " + this.props.data.data.attributes.title;
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
                    let userName = relation.attributes.username;
                    this.setState({
                        userId: relation.id,
                        userName: userName
                    });
                break;
                case "manga":
                    let title = "";
                    Object.keys(relation.attributes.title).map(function(key){
                        if(key === "en" || title === ""){
                            title = relation.attributes.title[key];
                        }
                    });
                    this.setState({
                        mangaId: relation.id,
                        mangaName: title
                    });
                break;
            }
        });

        this.setState({
            chapterLabel: label
        });
    }

    render = () => {
        var readMarker = "";
        if(this.props.data.read){
            readMarker = 
            <td title="Read">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            </td>
        }else{
            readMarker = 
            <td title="Didn't Read">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            </td>
        }

        var group = this.state.groups.map((g) => 
        <div className="w-full">
            <Link className={colorTheme(400).text} to={"/group/" + g.id}>
                {g.name}
            </Link>
        </div>);

        return (
            <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                {readMarker}
                <td>
                    <Link className={colorTheme(500).text} to={"/chapter/" + this.props.data.data.id + "/1"} title={this.state.chapterLabel}>
                        {this.state.chapterLabel}
                    </Link>
                </td>
                <td>
                    <Link className={colorTheme(500).text} to={"/title/" + this.state.mangaId} title={this.state.mangaName}>
                        {this.state.mangaName}
                    </Link>
                </td>
                <td>
                    <LanguageFlag language={this.props.data.data.attributes.translatedLanguage} />
                </td>
                <td>
                    {group}
                </td>
                <td>
                    <Link className={colorTheme(400).text} to={"/user/" + this.state.userId}>
                        {this.state.userName}
                    </Link>
                </td>
                <td title={this.props.data.data.attributes.publishAt}>
                    {DateTime.fromISO(this.props.data.data.attributes.publishAt).toRelative()}
                </td>
            </tr>
        );
    }
}

export default FollowChapterRow;