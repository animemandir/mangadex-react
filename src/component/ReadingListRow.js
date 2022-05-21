import React from "react";
import { Link } from "react-router-dom";
import LanguageFlag  from './LanguageFlag.js';
import { colorTheme } from "../util/colorTheme";
import axios from 'axios';
import toast from 'react-hot-toast';
import { mangaReadingStatus } from '../util/static.js';
import Select from 'react-select';

class ReadingListRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            follow: false,
            readingStatus: {value:"",label:"Reading Status (none)"},
            rating: {value:"",label:"Rating (none)"},
            optionStatus: [],
            optionRating: []
        };
    }

    componentDidMount = () => {
        var listStatus = [{value:"",label:"Reading Status (none)"}];
        var listRating = [{value:"",label:"Rating (none)"}];
        Object.keys(mangaReadingStatus).map((key) => {
            listStatus.push({
                value: key,
                label: mangaReadingStatus[key]
            });
        });
        for(let rt = 10; rt >= 1; rt--){
            listRating.push({
                value: rt,
                label: rt
            });
        }
        
        let saveStatus = {value:"",label:"Reading Status (none)"};
        let saveRating = {value:"",label:"Rating (none)"};
        Object.keys(mangaReadingStatus).map((key) => {
            if(key === this.props.data.readingStatus){
                saveStatus = {
                    value: key,
                    label: mangaReadingStatus[key]
                }
            }
        });
        if(parseInt(this.props.data.rating) > 0){
            saveRating = {value:this.props.data.rating,label:this.props.data.rating};
        }
        this.setState({
            follow: this.props.data.follow,
            readingStatus: saveStatus,
            rating: saveRating,
            optionStatus: listStatus,
            optionRating: listRating
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
        let newStatus = e.value;
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
                let saveStatus = {value:"",label:"Reading Status (none)"};
                Object.keys(mangaReadingStatus).map((key) => {
                    if(key === newStatus){
                        saveStatus = {
                            value: key,
                            label: mangaReadingStatus[key]
                        }
                    }
                });
                $this.setState({
                    readingStatus: saveStatus
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
        let newRating = e.value;
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
                        rating: {value:"",label:"Rating (none)"}
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
                        rating: {value:newRating,label:newRating}
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
        var selectStyle = (localStorage.theme === 'dark') ? {
            control: (base) => ({
            ...base,
            background: "#1E293B",
            border: "2px solid #0F172A",
            height: "36px",
            minHeight: "36px"
            }),
            container: (base) => ({
            ...base,
            height: "36px"
            }),
            menu: (base) => ({
            ...base,
            background: "#1E293B",
            borderRadius: 0,
            marginTop: 0
            }),
            menuList: (base) => ({
            ...base,
            background: "#1E293B",
            padding: 0
            }),
            placeholder: (base) => ({
                ...base,
                color: "#D1D5DB",
            }),
            option: (base,{ isFocused }) => ({
                ...base,
                background: (isFocused) ? "#4B5563" : "#1E293B",
            }),
            multiValueRemove: base => ({
                ...base,
                color: "#111827",
            }),
            singleValue: (base,{ isFocused }) => ({
                ...base,
                color: "#D1D5DB",
            }),
        } : {};

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
                <td>
                    <Select
                        options={this.state.optionStatus}
                        onChange={this.changeReadingStatus}
                        value={this.state.readingStatus}
                        styles={selectStyle}
                        className="text-gray-900 dark:text-gray-200 w-full"
                    />
                </td>
                <td>
                    <Select
                        options={this.state.optionRating}
                        onChange={this.changeRating}
                        value={this.state.rating}
                        styles={selectStyle}
                        className="text-gray-900 dark:text-gray-200 my-1 w-full"
                    />
                </td>
            </tr>
        );
    }
}

export default ReadingListRow;