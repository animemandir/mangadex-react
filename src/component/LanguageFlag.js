import React from "react";

class LanguageFlag extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <div>
                <img 
                    className="inline" 
                    width="25px" 
                    alt={this.props.language} 
                    title={this.props.language}
                    src={process.env.PUBLIC_URL + '../language/' + this.props.language + '.svg'} />
            </div>
        );
    }
}

export default LanguageFlag;