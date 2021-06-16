import React from "react";

class ChapterImage extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <div className="flex flex-row justify-center items-center">
                <img 
                    alt={this.props.page}
                    className={this.props.classImg}
                    src={this.props.src} />
            </div>
        );
    }
}

export default ChapterImage;