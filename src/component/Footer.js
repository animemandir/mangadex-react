import React from "react";
import { Link } from "react-router-dom";

class Footer extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <footer class="footer relative pt-1 bg-gray-150 text-gray-600 dark:bg-gray-900 dark:text-gray-100">
                <div class="container mx-auto px-3">
                    <div class="mt-4 border-t-2 border-gray-800 dark:border-gray-100 flex flex-col items-center">
                        <div class="sm:w-2/3 text-center py-6">
                            <p class="text-sm text-gray-800 dark:text-gray-100 font-bold mb-2">
                                © 2021 
                                <a className="text-blue-500" href="https://mangadex.org/" target="_blank"> MangaDex (Official)</a> |
                                <Link className="text-blue-500" to="/about"> About</Link> |
                                <a className="text-blue-500" href="https://github.com/Saymon600/mangadex-react" target="_blank"> GitHub</a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;