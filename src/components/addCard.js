import React, { Component } from 'react';
import { isValid } from 'cc-validate';
import fire from './account_widget/config/fbconfig';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/SyncLoader';


const override = css`
  display: block;
  margin: 0 auto;
`;


class Addcard extends Component {
    constructor(props){
        super(props);
        this.addNow = this.addNow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            disabled: false,
            loading: false,
            loginBtn: true,
            cardNumber: '',
            cardName: '',
            expDate: '',
            ccv: '',
            address: '',
            city: '',
            state: '',
            zipcode: '',
            errorMessage: '',
            successMessage: ''
        };
    }

    //accept all character
    handleChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    //accept only numbers
    onChange(e) {
        const re = /^[0-9\b]+$/;
          if (e.target.value === '' || re.test(e.target.value)) {
             this.setState({[e.target.id]: e.target.value})
             
          }
    }

    

    async addNow(e){
        e.preventDefault();
        let card = this.state.cardNumber

        //Validate card
        let result = isValid(card);
        let validateCard = result.isValid === true
        let validateCardName = result.cardType
        let cardEnding = '****'+card.slice(card.length - 4)

    
        //Validate Name
        let cardName = this.state.cardName
        let notemtycardName = cardName !== ''
        
        //Validate expiring date
        let expDate = this.state.expDate
       let monthNumb =  (new Date().getMonth() + 1).toString().padStart(2, "0");
       let yearNumb =  (new Date().getFullYear().toString().substr(-2));
        let currentDate = monthNumb + yearNumb
        let validateDate = expDate !== null

        //Validate CCV 
        let cvv = this.state.ccv
        let validateCCV = cvv.length > 2

        //get user data
        let user = fire.auth().currentUser.uid;

        //Validate Zipcode
        let zipcode = this.state.zipcode
        let Validatezip = zipcode.length > 4
        

        const account_data ={
            cardName, card, cvv, expDate, zipcode,
            userId: user,
            accountName: validateCardName +'  '+cardEnding, 
            account_subtype: "Card",
            bankAccountToken: "fghjkl;i89765",
            bankName: validateCardName,
            transaction_type: "DCC"
        }
    
    //------------Check and display error message-----------//
        //check name
        if(!notemtycardName){
            let error = "Name can not be empty"
            return this.setState({errorMessage: error})
        }

        //check Card number
        if(!validateCard){
            let error = "Invalid card number"
            return this.setState({errorMessage: error})
        }
        //check date
        if(!validateDate){
            let error = "Date can not be in the past"
            return this.setState({errorMessage: error})
        }
        //check CCV
        if(!validateCCV){
            let error = "Invalid CCV"
            return this.setState({errorMessage: error})
        }
        //check zipcode
        if(!Validatezip){
            let error = "Invalid Zipcode "
            return this.setState({errorMessage: error})
        }


        if(validateCard && notemtycardName && validateDate && validateCCV && Validatezip ){
            //send to backend
            const that = this;
            that.setState({loading: true, loginBtn: false,  disabled: true});            
            async function addbank(data){
                return  fetch('https://cleavepaytrail.firebaseapp.com/checkout/addaccount',{
                   method: 'POST',
                   headers: {
                     'Content-type':'application/json'
                   }, 
               
                   body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(function(res){
                    that.setState({loading: false, loginBtn: true,  disabled: false});
                    that.setState({successMessage: res.message})
                    that.setState({cardNumber: '',cardName: '',expDate: '',ccv: '',
            address: '',city: '',state: '',zipcode: '',errorMessage: ''})
                })
                .catch(function(error){
                    that.setState({errorMessage: error.message})
                })
            }
            addbank(account_data)
            

            //---set input to empty
            this.setState({loading: false, loginBtn: true,  disabled: false});
            

        }else{
            let error = "There was an error adding your card, please try again"
            this.setState({loading: false, loginBtn: true,  disabled: false});
            this.setState({errorMessage: error})

        }
        
    }
        


    render(){
        return(
           <form className="cardInput">
                <div className={"errorMessage"}>
                    {this.state.errorMessage}
                </div>
                <div className={"successMessage"}>
                    {this.state.successMessage}
                </div>
                <input 
                    // value={this.state.cardName}
                    className="card" 
                    htmlFor="cardName" 
                    type="name" 
                    id="cardName"
                    placeholder="Card holder"
                    autoComplete="off"
                    value={this.state.cardName}
                    onChange={this.handleChange}
                />

               <input 
                    id="cardNumber"
                    value={this.state.cardNumber}
                    onChange={this.onChange}
                    className="card" 
                    htmlFor="cardNumber" 
                    type="text" 
                    placeholder="Card number"
                    maxLength="16"
                />

               <input 
                    // value={this.state.expire}
                    id="expDate"
                    className={"short"} 
                    maxLength="4"
                    placeholder="MM/YYYY"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.expDate}
                    onChange={this.onChange}
                />

               <input                     
                    id="ccv"
                    className={"short"} 
                    placeholder="CCV"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.ccv}
                    onChange={this.onChange}
                    maxLength="4"
                />

                <input  
                    id="zipcode"
                    className={"short"}
                    placeholder="Zipcode"
                    autoComplete="off"
                    autoCorrect="off"
                    value={this.state.zipcode}
                    onChange={this.onChange}
                    maxLength="5"
                />

                <button className={"addnow"} disabled={this.state.disabled}  onClick={this.addNow}>
                    <div className="sweet-loading">
                      <ClipLoader
                        css={override}
                        size={10}
                        color={"#6867ae"}
                        loading={this.state.loading}
                      />
                    </div>
                    {this.state.loginBtn && "Add"}
                </button>
            </form>
        );
    }
    
}
export default Addcard;