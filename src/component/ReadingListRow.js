import React from "react";
import { Link } from "react-router-dom";
import LanguageFlag  from './LanguageFlag.js';
import { colorTheme } from "../util/colorTheme";
import axios from 'axios';
import toast from 'react-hot-toast';
import { mangaReadingStatus } from '../util/static.js';

class ReadingListRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            follow: false,
            readingStatus: "",
            rating: ""
        };
    }

    componentDidMount = () => {
        this.setState({
            follow: this.props.data.follow,
            readingStatus: this.props.data.readingStatus,
            rating: this.props.data.rating
        });
    }

    followManga = () => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        axios.post('https://api.mangadex.org/manga/' + this.props.data.mangaId + '/follow',null,{
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            if(response.data.result === "ok"){
                $this.setState({
                    follow: true
                });
                toast.success('Following ' + $this.props.data.mangaName,{
                    duration: 1000,
                    position: 'top-right',
                });
            }
        })
        .catch(function(error){
            console.log(error);
            toast.error('Error following manga.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    unfollowManga = () => {
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        axios.delete('https://api.mangadex.org/manga/' + this.props.data.mangaId + '/follow',{
            headers: {  
                Authorization: bearer
            }
        })
        .then(function(response){
            if(response.data.result === "ok"){
                $this.setState({
                    follow: false
                });
                toast.success('Unfollowed: ' + $this.props.data.mangaName,{
                    duration: 1000,
                    position: 'top-right',
                });
            }
        })
        .catch(function(error){
            toast.error('Error unfollowing manga.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    changeReadingStatus = (e) => {
        let newStatus = e.target.value;
        if(newStatus === ""){
            newStatus = null;
        }
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        axios.post('https://api.mangadex.org/manga/' + this.props.data.mangaId + '/status',
            {status: newStatus},
            {
                headers: {  
                    Authorization: bearer
                }
            }
        )
        .then(function(response){
            if(response.data.result === "ok"){
                $this.setState({
                    readingStatus: newStatus
                });
                toast.success('Updated Status: ' + $this.props.data.mangaName + '. Please reload the page to update the list.',{
                    duration: 2000,
                    position: 'top-right',
                });
            }
        })
        .catch(function(error){
            toast.error('Error updating reading status.',{
                duration: 4000,
                position: 'top-right',
            });
        });
    }

    changeRating = (e) => {
        let newRating = e.target.value;
        var $this = this;
        var bearer = "Bearer " + localStorage.authToken;
        if(newRating === ""){
            axios.delete('https://api.mangadex.org/rating/' + this.props.data.mangaId,
                {
                    headers: {  
                        Authorization: bearer
                    }
                }
            )
            .then(function(response){
                if(response.data.result === "ok"){
                    $this.setState({
                        rating: ""
                    });
                    toast.success('Deleted Rating: ' + $this.props.data.mangaName,{
                        duration: 1000,
                        position: 'top-right',
                    });
                }
            })
            .catch(function(error){
                console.log(error);
                toast.error('Error updating rating.',{
                    duration: 4000,
                    position: 'top-right',
                });
            });
        }else{
            axios.post('https://api.mangadex.org/rating/' + $this.props.data.mangaId,
                {rating: parseInt(newRating)},
                {
                    headers: {  
                        Authorization: bearer
                    }
                }
            )
            .then(function(response){
                if(response.data.result === "ok"){
                    $this.setState({
                        rating: newRating
                    });
                    toast.success('Updated Rating: ' + $this.props.data.mangaName,{
                        duration: 1000,
                        position: 'top-right',
                    });
                }
            })
            .catch(function(error){
                toast.error('Error updating rating.',{
                    duration: 4000,
                    position: 'top-right',
                });
            });
        }
    }

    render = () => {
        var authors = this.props.data.author.map((au) => 
            <Link className={"mr-4 " + colorTheme(500).text} to={"/author/"+au.id}>{au.name}</Link>
        );
        var artists = this.props.data.artist.map((ar) => 
            <Link className={"mr-4 " + colorTheme(500).text} to={"/author/"+ar.id}>{ar.name}</Link>
        );
        var btnFollow =
        <button className="text-center px-3 py-1 my-1 h-9 mr-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900" title="Follow" onClick={this.followManga}>
            <div className="flex flex-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Follow 
            </div> 
        </button>;
        if(this.state.follow){
            btnFollow =
            <button className="text-center px-3 py-1 my-1 h-9 mr-1 hover:opacity-75 focus:outline-none border-2 border-gray-200 dark:border-gray-900" title="Unfollow" onClick={this.unfollowManga}>
                <div className="flex flex-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 mt-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Unfollow 
                </div>
            </button>;
        }
        var tdReadingStatus = 
        <select 
            className="w-auto px-3 py-1 my-1 h-9 hover:opacity-75 cursor-pointer focus:outline-none border-2 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-900" 
            value={this.state.readingStatus} 
            onChange={this.changeReadingStatus} >
            <option value="">Status (None)</option>
            {
                Object.keys(mangaReadingStatus).map((status) => 
                    <option value={status}>{mangaReadingStatus[status]}</option>
                )
            }
        </select>;

        var tdRating =
        <select 
            className="w-auto px-3 py-1 my-1 ml-1 h-9 hover:opacity-75 cursor-pointer focus:outline-none border-2 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-900" 
            value={this.state.rating} 
            onChange={this.changeRating} >
            <option value="">Rating (None)</option>
            <option value="10">10</option>
            <option value="9">9</option>
            <option value="8">8</option>
            <option value="7">7</option>
            <option value="6">6</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
        </select>

        if(this.props.data.mangaId.length === 0){
            return (
                <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                    <td></td>
                    <td className="text-left">
                        {this.props.data.mangaName}
                    </td>
                    <td className="text-left"></td>
                    <td className="text-left">{authors}</td>
                    <td className="text-left">{artists}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            )
        }

        return (
            <tr className="h-10 border-b border-gray-200 dark:border-gray-900">
                <td>
                    <img 
                        className="w-20 object-contain"
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
                <td>{btnFollow}</td>
                <td>{tdReadingStatus}</td>
                <td>{tdRating}</td>
            </tr>
        );
    }
}

export default ReadingListRow;