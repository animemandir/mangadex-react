import React from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { colorTheme } from "../util/colorTheme";

class HomeTopManga extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount = () => {}

    render = () => {
        var rating = "";
        var followCount = "";
        if(this.props.data.meanRating > 0){
            rating = 
            <div className="flex text-blue-500" title="Mean Rating">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-1 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {this.props.data.meanRating}
            </div>
        }
        if(this.props.data.followCount > 0){
            followCount = 
            <div className="flex text-green-600" title="Follows">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-1 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {this.props.data.followCount.toLocaleString('en-US')}
            </div>
        }
        var stats = (this.props.data.meanRating > 0 || this.props.data.followCount > 0) ? 
        <div className="flex py-1">
            <div className="w-1/3">
                {rating}
            </div>
            <div className="w-1/3">
                {followCount}
            </div>
        </div>
        : "";

        return (
            <div className="content w-full flex border-b-2 my-2 mx-1 border-gray-200 dark:border-gray-900">
                <img 
                    className="w-1/5 pl-1 pb-1 object-contain"
                    style={{height:"fit-content"}}
                    alt={this.props.data.name}
                    src={this.props.data.coverFile} />
                <div className="item-body w-4/5 pl-1">
                    <div className="p-1 border-b border-gray-200 dark:border-gray-900">
                        <Link className={colorTheme(500).text} to={"/title/" + this.props.data.id} title={this.props.data.name}>
                            {this.props.data.name}
                        </Link>
                    </div>
                    <div className="p-1">
                        {stats}
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeTopManga;