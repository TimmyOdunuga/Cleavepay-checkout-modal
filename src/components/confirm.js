import React, { Component } from 'react';



export class Confirm extends Component{
    continue = e => {
        this.props.nextStep();
        // app.auth().signOut()
    };

    render(){
        return (
            <div className={"signInContainer"}>
              <form className={"signInModal"} >
                  <h2>Confirm page</h2>       
              </form>
            </div>
        )
    }    
}

export default Confirm;
