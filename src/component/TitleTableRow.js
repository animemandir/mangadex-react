import React from "react";
import { Link } from "react-router-dom";
import LanguageFlag  from './LanguageFlag.js';
import moment from 'moment'

class TitleTableRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            chapterLabel: "",
            groupId: "",
            groupName: "",
            userId: "",
            userName: ""
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
                    let groupName = relation.attributes.name;
                    this.setState({
                        groupId: relation.id,
                        groupName: groupName
                    });
                break;
                case "user":
                    let userName = relation.attributes.username;
                    this.setState({
                        userId: relation.id,
                        userName: userName
                    });
                break;
            } 
        });

        this.setState({
            chapterLabel: label
        });
    }

    render = () => {
        return (
            <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                <td className="hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </td>
                <td>
                    <Link className="text-blue-500" to={"/chapter/" + this.props.data.data.id + "/1"} title={this.state.chapterLabel}>
                        {this.state.chapterLabel}
                    </Link>
                </td>
                <td>
                    <LanguageFlag language={this.props.data.data.attributes.translatedLanguage} />
                </td>
                <td>
                    <Link className="text-blue-400" to={"/group/" + this.state.groupId}>
                        {this.state.groupName}
                    </Link>
                </td>
                <td>
                    <Link className="text-blue-400" to={"/user/" + this.state.userId}>
                        {this.state.userName}
                    </Link>
                </td>
                <td className="hidden">1000</td>
                <td>
                    {moment(this.props.data.data.attributes.publishAt).fromNow()}
                </td>
            </tr>
        );
    }
}

export default TitleTableRow;