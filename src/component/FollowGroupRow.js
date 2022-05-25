import React from "react";
import { Link } from "react-router-dom";
import LanguageFlag  from './LanguageFlag.js';
import { colorTheme } from "../util/colorTheme";
import toast from 'react-hot-toast';
import { fetch } from '@tauri-apps/api/http';


class FollowGroupRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            follow: false
        };
    }

    componentDidMount = () => {
        this.setState({
            follow: this.props.data.follow
        });
    }

    followGroup = () => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        fetch('https://api.mangadex.org/group/' + this.props.data.id + '/follow',{
            method: "POST",
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            if(response.data.result === "ok"){
                $this.setState({
                    follow: true
                });
                toast.success('Following group:' + $this.props.data.name,{
                    duration: 1000,
                    position: 'top-right',
                });
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error following group.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    unfollowGroup = () => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        fetch('https://api.mangadex.org/group/' + this.props.data.id + '/follow',{
            method: "DELETE",
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            if(response.data.result === "ok"){
                $this.setState({
                    follow: false
                });
                toast.success('Unfollowed group: ' + $this.props.data.name,{
                    duration: 1000,
                    position: 'top-right',
                });
            }
        })
        .catch(function(error){
            toast.error('Error unfollowing group.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    render = () => {
        var btnFollow =
        <button className="text-center px-3 py-1 my-1 h-9 mr-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900" title="Follow" onClick={this.followGroup}>
            <div className="flex flex-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Follow 
            </div> 
        </button>;
        if(this.state.follow){
            btnFollow =
            <button className="text-center px-3 py-1 my-1 h-9 mr-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900" title="Unfollow" onClick={this.unfollowGroup}>
                <div className="flex flex-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Unfollow 
                </div>
            </button>;
        }

        var languages = this.props.data.languages.map((l) => 
            <div className="flex">
                <LanguageFlag language={l} />
            </div>
        );

        if(this.props.data.id.length === 0){
            return (
                <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                    <td className="text-left">
                        {this.props.data.name}
                    </td>
                    <td></td>
                    <td></td>
                </tr>
            )
        }

        return (
            <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                <td className="text-left">
                    <Link className={colorTheme(500).text} to={"/group/" + this.props.data.id}>{this.props.data.name}</Link>
                </td>
                <td>{languages}</td>
                <td>{btnFollow}</td>
            </tr>
        );
    }
}

export default FollowGroupRow;