import React from "react";
import { Link } from "react-router-dom";
import { colorTheme } from "../util/colorTheme";

class Footer extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <footer className="footer relative pt-1 bg-gray-150 text-gray-600 dark:bg-gray-900 dark:text-gray-100">
                <div className="container mx-auto px-3">
                    <div className="mt-4 border-t-2 border-gray-800 dark:border-gray-100 flex flex-col items-center">
                        <div className="sm:w-2/3 text-center py-6">
                            <p className="text-sm text-gray-800 dark:text-gray-100 font-bold mb-2">
                                © 2021 
                                <a className={colorTheme(500).text} href="https://mangadex.org/" target="_blank" rel="noopener noreferrer"> MangaDex (Official)</a>
                                <span className="mx-1">|</span>
                                <Link className={colorTheme(500).text} to="/about"> About</Link>
                                <span className="mx-1">|</span>
                                <a className={colorTheme(500).text} href="https://github.com/Saymon600/mangadex-react" target="_blank" rel="noopener noreferrer"> GitHub</a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;