import React from "react";
import { colorTheme } from "../util/colorTheme";

class Paginator extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            last: 1
        };
    }

    accessFunction = (page) => {
        return this.props.func(page);
    }

    render = () => {
        var pages = [];
        let prev = this.props.active - 1;
        let next = this.props.active + 1;
        if(prev < 1){
            prev = 1;
        }
        if(next > this.props.pages){
            next = this.props.pages;
        }
        let init = 1;
        if(this.props.active > 5){
            init = parseInt(this.props.active) - 5;
        }

        pages.push(
            <div title="First" onClick={() => this.accessFunction(1)} className="h-10 w-10 m-1 flex justify-center items-center hover:opacity-75 cursor-pointer border-2 border-gray-200 dark:border-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
            </div>
        );
        pages.push(
            <div title="Previous" onClick={() => this.accessFunction(prev)} className="h-10 w-10 m-1 flex justify-center items-center hover:opacity-75 cursor-pointer border-2 border-gray-200 dark:border-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </div>
        );
        for(let a = init; a <= this.props.pages; a++){
            if(parseInt(this.props.active) === parseInt(a)){
                pages.push(
                    <div onClick={() => this.accessFunction(a)} className={"h-10 w-10 m-1 flex justify-center items-center text-center  hover:opacity-75 cursor-pointer border-2 border-gray-200 dark:border-gray-900 " + colorTheme(500).bg}>
                        {a}
                    </div>
                )
            }else{
                pages.push(
                    <div onClick={() => this.accessFunction(a)} className="h-10 w-10 m-1 flex justify-center items-center text-center hover:opacity-75 cursor-pointer border-2 border-gray-200 dark:border-gray-900">
                        {a}
                    </div>
                )
            }
            if(a >= (init + 10)){
                break;
            }
        }
        pages.push(
            <div title="Next" onClick={() => this.accessFunction(next)} className="h-10 w-10 m-1 flex justify-center items-center hover:opacity-75 cursor-pointer border-2 border-gray-200 dark:border-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        );
        pages.push(
            <div title="Last" onClick={() => this.accessFunction(this.props.pages)} className="h-10 w-10 m-1 flex justify-center items-center hover:opacity-75 cursor-pointer border-2 border-gray-200 dark:border-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
            </div>
        );


        return (
            <div className="flex w-auto mt-2">
                {pages}
                <span className="mx-2 my-4 text-sm">
                    Pages: {this.props.active}/{this.props.pages}
                </span>
            </div>
        );
    }
}

export default Paginator;