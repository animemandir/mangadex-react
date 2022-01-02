import React from "react";
import { Link } from "react-router-dom";
import LanguageFlag  from './LanguageFlag.js';
import { colorTheme } from "../util/colorTheme";

class ReadingListRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }

    componentDidMount = () => {

    }

    render = () => {
        var authors = this.props.data.author.map((au) => 
            <Link className={"mr-4 " + colorTheme(500).text} to={"/author/"+au.id}>{au.name}</Link>
        );
        var artists = this.props.data.artist.map((ar) => 
            <Link className={"mr-4 " + colorTheme(500).text} to={"/author/"+ar.id}>{ar.name}</Link>
        );

        return (
            <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                <td>
                    <img 
                        className="w-20 object-contain"
                        style={{height:"fit-content"}}
                        alt={this.props.data.mangaName}
                        src={this.props.data.cover} />
                </td>
                <td className="text-left">
                    <Link className={colorTheme(500).text} to={"/title/" + this.props.data.mangaId}>{this.props.data.mangaName}</Link>
                </td>
                <td className="text-left">
                    <LanguageFlag language={this.props.data.originalLanguage} />
                </td>
                <td className="text-left">{authors}</td>
                <td className="text-left">{artists}</td>
            </tr>
        );
    }
}

export default ReadingListRow;