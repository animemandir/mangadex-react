import React from "react";
import { Link } from "react-router-dom";

class Tags extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        let component = null;
        if(!this.props.url){
            component = 
            <span className="text-gray-700 bg-gray-300 text-xs font-semibold py-1 px-2 uppercase rounded mr-1">
                {this.props.name}
            </span>
        }else if(this.props.url.startsWith('http') || this.props.url.startsWith('mailto')){
            component = <a href={this.props.url} target="_blank">
                <span className="text-gray-700 bg-gray-300 text-xs font-semibold py-1 px-2 uppercase rounded mr-1">
                    {this.props.name}
                </span>
            </a>
        }else{
            component = 
            <Link to={this.props.url}>
                <span className="text-gray-700 bg-gray-300 text-xs font-semibold py-1 px-2 uppercase rounded mr-1">
                    {this.props.name}
                </span>
            </Link>
        }
        return (
            component
        );
    }
}

export default Tags;