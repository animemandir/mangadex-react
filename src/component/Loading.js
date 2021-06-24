import React from "react";

class Loading extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render = () => {
        return (
            <div className="flex mt-8 justify-center w-full h-screen">
                <img className="w-36 h-36" alt="Loading" src={process.env.PUBLIC_URL + '/spin.svg'} />
            </div>
        );
    }
}

export default Loading;