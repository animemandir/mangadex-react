import React from "react";

class ReadingListTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    componentDidMount = () => {

    }

    render = () => {
        return (
            <table class="table-fixed w-full p-2">
                <thead className="border-b-2 border-gray-200 dark:border-gray-900">
                    <th className="w-24"></th>
                    <th className="text-left">Name</th>
                    <th className="text-left w-8" title="Language">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                    </th>
                    <th className="text-left">Author</th>
                    <th className="text-left">Artist</th>
                    <th className="text-left">Follow</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Rating</th>
                </thead>
                <tbody>
                    {this.props.data}
                </tbody>
            </table>
        );
    }
}

export default ReadingListTable;