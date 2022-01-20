import React, { Component } from 'react';



export class SplitFriends extends Component{
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
    };

    render(){
        return (
            <div className={"signInContainer"}>
              
              
            </div>
        )
    }    
}

export default SplitFriends;

