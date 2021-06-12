import React from "react";
import moment from 'moment'
import { Link } from "react-router-dom";

class HomeUpdates extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <div className="content flex w-1/2 mt-2 border-b border-gray-200 dark:border-gray-900">
               <img 
                    className="w-1/5 pl-1 pb-1"
                    alt={this.props.data.mangaName}
                    src={this.props.data.cover} />
                <div className="item-body w-4/5 pl-2">
                    <p className="text-left text-blue-500">
                        <Link to={"/title/" + this.props.data.mangaId}>{this.props.data.mangaName}</Link>
                    </p>
                    <p className="text-left text-blue-400">
                        <Link to={"/chapter/" + this.props.data.chapterId}>Chapter {this.props.data.chapter}</Link>
                    </p>
                    <p className="text-left">
                        {moment(this.props.data.publishAt).fromNow()}
                    </p>
                </div>
            </div>
        );
    }
}

export default HomeUpdates;