import React from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
class HomeUpdates extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <div className="content flex w-1/2 mt-2 border-b border-gray-200 dark:border-gray-900">
               <img 
                    className="w-1/5 pl-1 pb-1 object-contain"
                    alt={this.props.data.mangaName}
                    src={this.props.data.cover} />
                <div className="item-body w-4/5 pl-2">
                    <p className="text-left pb-1 border-b dark:border-gray-900 text-blue-600">
                        <Link to={"/title/" + this.props.data.mangaId}>{this.props.data.mangaName}</Link>
                    </p>
                    <p className="text-left mt-1 text-blue-500">
                        <Link className="flex" to={"/chapter/" + this.props.data.chapterId + "/1"}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Chapter {this.props.data.chapter}
                        </Link>
                    </p>
                    <p className="text-left text-blue-500">
                        <Link className="flex" to={"/group/" + this.props.data.groupId}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {this.props.data.groupName}
                        </Link>
                    </p>
                    <p className="text-left flex" title={this.props.data.publishAt}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {DateTime.fromISO(this.props.data.publishAt).toRelative()}
                    </p>
                </div>
            </div>
        );
    }
}

export default HomeUpdates;