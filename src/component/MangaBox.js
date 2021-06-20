import React from "react";
import { Link } from "react-router-dom";
import LanguageFlag  from './LanguageFlag.js';

class MangaBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <div className="content flex w-1/2 mt-2 px-2 border-b border-gray-200 dark:border-gray-900">
               <img 
                    className="w-1/5 pl-1 pb-1 object-contain"
                    style={{height:"fit-content"}}
                    alt={this.props.data.mangaName}
                    src={this.props.data.cover} />
                <div className="item-body w-4/5 pl-2">
                    <p className="text-left pb-1 border-b flex dark:border-gray-900 text-blue-600">
                        <LanguageFlag language={this.props.data.originalLanguage} />
                        <Link className="ml-2" to={"/title/" + this.props.data.mangaId}>{this.props.data.mangaName}</Link>
                    </p>
                    <div className="text-justify max-h-48 overflow-ellipsis overflow-hidden">
                        {this.props.data.description}
                    </div>
                </div>
            </div>
        );
    }
}

export default MangaBox;