import React from "react";
import Plaid from "../plaid";
import Addcard from "../addCard";
import fire from './/config/fbconfig'
import visaLogo from '../images/visaLogo.svg'
import santandeLogo from '../images/santandeLogo.jpg'
import masterLogo from '../images/masterLogo.png'
import amexLogo from '../images/amexLogo.png'
import discoverLogo from '../images/discoverLogo.svg'
import boaLogo from '../images/boaLogo.jpg'
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/ClipLoader';
import Cookies from 'js-cookie'


const override = css`
  display: block;
  margin: 10px;
`;

const db = fire.firestore()


class SelectableCardList extends React.Component {
  constructor(props) {
    super(props);
    var selected = [];
    var initialState = {
      selected: selected
    };
    this.listener = this.listener.bind(this);
    this.state = {
      selected: [],
      accoutList: [],
      initialState
    };
  }

  componentDidMount(){
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.listener();
      }
    });      
  }
  componentDidUpdate(){
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.listener();
      }
    });
  }

  async listener(){
    let that = this
    let uid = fire.auth().currentUser.uid
        db.collection("accounts").doc(uid).get()
        .then(data => {
         // console.log(data.exists)
         if(data.exists === false){
            that.setState({
            accoutList: []
          });

          }else{
            let accountArray = data.data().account
            that.setState({
              accoutList: accountArray
            });
        }

        });

     
  }
  

  onItemSelected(index, account) {
    let currentPrice = this.props.priceFrom
    var selectedIndexes = this.state.selected;
    var selectedIndex = selectedIndexes.indexOf(index);
    if(currentPrice < 5){
      if (selectedIndex > -1) {
        selectedIndexes.splice(selectedIndex, 1);
        // console.log(selectedIndexes);
        this.props.onChange(selectedIndexes)
        
      } else {
        if (!(selectedIndexes.length >= 1)) {
          selectedIndexes.push(index);          
          this.props.onChange(selectedIndexes)
          if(selectedIndexes.length === 1){
            // if(index){
              console.log("you cant slpit less than $5")
            // }
          }
        }
      }
      
    } else{
      if (selectedIndex > -1) {
        selectedIndexes.splice(selectedIndex, 1);
        // console.log(selectedIndexes);
        this.props.onChange(selectedIndexes)
        
      } else {
        if (!(selectedIndexes.length >= 2)) {
          selectedIndexes.push(index);          
          this.props.onChange(selectedIndexes)
        }
      }
    }
         
  }


  render() {

    var content = this.state.accoutList.map((cardContent, i) => {

      var selected = this.state.selected.indexOf(i) > -1

        var isSelected = selected ? "selected" : "";
        var className = "selectable " + isSelected;

        //display card type image
        const selectedAccount = cardContent.accountName
        const condition = cardContent.bankName === 'Visa';
        const condition1 = cardContent.bankName === 'MasterCard';
        const condition2 = cardContent.bankName === 'Santander';
        const condition3 = cardContent.bankName === 'Discover';
        const condition4 = cardContent.bankName === 'American Express';
        const condition5 = cardContent.bankName === 'Bank of America';


      return (
        <div key={i} className="card" selected={selected}  onClick={(e) => this.onItemSelected(i, selectedAccount)} >
          <div className={className} >
            <div className="accountBox">
                <div className={"accountImg"}
                  style={{ backgroundImage: condition ? "url(" + visaLogo + ")" : 
                    condition ? "url(" + visaLogo + ")" : 
                    condition5 ?  "url(" + boaLogo + ")" :
                    condition4 ?  "url(" + amexLogo + ")" : 
                    condition3 ?  "url(" + discoverLogo + ")" : 
                    condition2 ?  "url(" + santandeLogo + ")" : 
                    condition1 ?  "url(" + masterLogo + ")"  : "" ,  
                  
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <p></p>
                </div>
                        
                <div className={"accountSide"}>
                  
                  <div className={"accountInfo"}>
                    {cardContent.bankName}
                  </div>

                  <div className={"accountInfo"}>
                    {cardContent.accountName}
                  </div>
                </div>
            </div>
          </div>
        </div>
      );
    });
    return <div className="cardlist">{content}</div>;
  }
}
  
 





  

    //Multiply selection 
  class ListOfAccount extends React.Component {
    constructor(props){
      super(props);
      this.sliderChange = this.sliderChange.bind(this)
      this.state = {
        oneAcct:[],
        firstPrice:"",
        secPrice:"",
        firstAcct: '',
        secAcct: '',
        splitSelected:[],
        disabled: true,
        splitPayment: false,
        slideValue: "",
        priceFrom: '',
        processing: false,
        responseMessage: "error",
        processingLoader: true,
        processingBtn: false
      };
    }
    onprice(price){
      this.setState({
        priceFrom: price
      });
    }
    async onListChanged(selected) {
      let priceFrom = this.state.priceFrom
      // console.log(priceFrom)
      this.setState({
        selected: selected,
        // priceFrom: priceFrom
      });
      
      //get user id
      let uid = fire.auth().currentUser.uid

      //get acccount info with index
      await db.collection("accounts").doc(uid).get()
      .then(doc =>{

        //get account name
        let acct = doc.data().account
        

        let l = selected

        //loop through selected index to get user account
        for (var i of l ) {          
          var arrayLth = l.length

          if(arrayLth === 1){
            this.setState({
              oneAcct: {acct:acct[i].accountName,i}
            })

          }else{
            this.setState({
              oneAcct: []
            })
          }

          //check if length of array is 2 or more
          if(arrayLth > 1){
            let splitSeld = this.state.splitSelected
            let acctlist = {acct:acct[i].accountName,i}
            splitSeld.push(acctlist)

            this.setState({
              splitPayment: true
            });

            let prices = (this.props.price)/2


            this.setState({
              firstPrice: prices,
              secPrice: prices,
            })

            this.setState({
              slideValue: 50
            })
            
          }else{
            this.setState({
              splitPayment: false
            });
            this.setState({
              splitSelected: []
            });

            let prices = this.props.price
            this.setState({
              firstPrice: prices,
              secPrice: '',
            })

            this.setState({
              slideValue: 100
            })

            
          }
          
          // console.log({list:acct[i].bankName,i})
        }

        var Lth = l.length
        if (Lth > 1){
          this.setState({
              firstAcct: this.state.splitSelected[0].acct,
              secAcct: this.state.splitSelected[1].acct
            })
        }

      })
    }

    

    

    submit(e) {
      this.setState({
        processing: true,
        processingLoader: true,
        processingBtn: false
      })
      //get current user
      let uid = fire.auth().currentUser.uid
      
      // get selected account
      let selectedAcct = this.state.selected

      //transaction and payment data
      let totalPrice = this.props.price
      let business = this.props.business
      let transaction = this.props.transaction
      let that = this
      //create fetch funtion payment 
      function chargeNow(paymentdata){
        return fetch('https://cleavepaytrail.firebaseapp.com/checkout/makepayment',{
          method: 'POST',
          headers: {
            'Content-type':'application/json'
          }, 

          body: JSON.stringify(paymentdata)
        })
        .then(res => res.json())
        .then(res => {
          // console.log(res)
          if (res.errorMessage !== undefined ){
            that.setState({
              responseMessage: res.errorMessage,
              processing: true,
              processingLoader: false,
              processingBtn: true
            })
          }else{
            that.setState({
              processing: false
            })
            
            //end session and send metadata to client
            sessionStorage.clear();
            Cookies.remove('cleavepay_check_id')
            
            fire.auth().signOut().then(end=>{
              var parent = window.parent;
              parent.postMessage({
                'closeModalClient': 'closeModal',
                'message': res,
              }, "*")
            })  
          }
          
        })
        .catch((error) => {
          // console.log(error)
          if (error.errorMessage !== null){
            that.setState({
              responseMessage: error.errorMessage
            })
          }
          that.setState({
            responseMessage: "There was an error, Please try again.",
            processing: true,
            processingLoader: false,
            processingBtn: true
          })
        })
      }

      // Charge split payment
      function chargeSplitNow(paymentdata){
        return fetch('https://cleavepaytrail.firebaseapp.com/checkout/makeSplitpayment',{
          method: 'POST',
          headers: {
            'Content-type':'application/json'
          }, 

          body: JSON.stringify(paymentdata)
        })
        .then(res => res.json())
        .then(res => {
          // console.log(res)
          if (res.errorMessage !== undefined ){
            that.setState({
              responseMessage: res.errorMessage,
              processing: true,
              processingLoader: false,
              processingBtn: true
            })
          }else{
            if (res.errorMessage2 !== undefined ){
              that.setState({
                responseMessage: res.errorMessage2,
                processing: true,
                processingLoader: false,
                processingBtn: true
              })
            }else{
              that.setState({
                processing: false
              })
  
              // end session and send metadata to client
              sessionStorage.clear();
              Cookies.remove('cleavepay_check_id')
              
              fire.auth().signOut().then(end=>{
                var parent = window.parent;
                parent.postMessage({
                  'closeModalClient': 'closeModal',
                  'message': res,
                }, "*")
              }) 
            }
          }
          
        })
        .catch((error) => {
          // console.log(error)
          if (error.errorMessage !== null){
            that.setState({
              responseMessage: error.errorMessage
            })
          }
          that.setState({
            responseMessage: "There was an error, Please try again.",
            processing: true,
            processingLoader: false,
            processingBtn: true
          })
        })
      }
      
      // an account must be selected 
      if (selectedAcct === undefined || selectedAcct.length === 0){
        // console.log("Please select an account")
        this.setState({
          responseMessage: "Please select an account.",
          processing: true,
          processingLoader: false,
          processingBtn: true
        })  

      }else{
        if(selectedAcct.length === 1){

          //get price
          let firstPrice = totalPrice
          //get account selected
          let account1 = this.state.oneAcct

          let user_id = uid
          let chargeAcct1 = {account1,firstPrice}

          let chargeable = {chargeAcct1}   

          //create payment details
          let PaymentDetails = {
            user_id,
            totalPrice,
            chargeable,
            business,
            transaction
          }
          
          // console.log(PaymentDetails);
          chargeNow(PaymentDetails) 

        }else{

          //if split is more
          if(selectedAcct.length === 2){
            let  account1 = this.state.splitSelected[0]
            let account2 = this.state.splitSelected[1]
    
            let firstPrice = this.state.firstPrice
            let secPrice = this.state.secPrice

            let chargeAcct1 = {account1,firstPrice}
            let chargeAcct2 = {account2,secPrice}

            let user_id = uid

            let chargeable = {chargeAcct1,chargeAcct2}

            //create payment details
            let PaymentDetails = {
              user_id,
              totalPrice,
              chargeable,
              business,
              transaction
            }
            
            // console.log(PaymentDetails); 
            
            chargeSplitNow(PaymentDetails) 
          }else{
            this.setState({
              responseMessage: "You can't select more than 2 accounts.",
              processing: true,
              processingLoader: false,
              processingBtn: true
            })
          }
        }

      }
    }


    //Track sliders 
    sliderChange(e){
      this.setState({ slideValue: e.target.value })
      var curentPerc = e.target.value
      let percent = e.target.max

      let price = this.props.price


      let firstPrice = (curentPerc/percent)*price

      let secPrice = price - firstPrice

      this.setState({
        firstPrice: firstPrice.toFixed(2),
        secPrice: secPrice.toFixed(2),
      })      
    }
    
    tryAgin(){
      this.setState({
        processing: false
      })
    }


    state = {
        show: false
    }
    
    handleCheck(event){
      if(event.target.checked){
            this.setState({ disabled: false });

      } else {
            this.setState({ disabled: true });
      }
    }

    
      toggle = () => this.setState((currentState) => ({show: !currentState.show}));

    render() {
      return (
        <div className="column">

          {this.state.processing && <div className={"processing"}>
            {this.state.processingLoader && <div className={'loading'}>
              <ClipLoader
                margin={10}
                size={40}
                color={"#28275c"}
              />
            </div>}
            {this.state.processingBtn && <div className={"modalSpace"}>
              <div>
                {this.state.responseMessage}

              </div>
              <button 
                className={"tryAgainBtn"}
                type="submit"
                onClick={(e) => this.tryAgin()}
                >
                Try Again
              </button>
            </div>}
          </div>}

          <div className={"addNewAcct"}>
                <Plaid/>
                <div id={"addcard"} className={"plaidDiv"} onClick={this.toggle}>              
                  <span>Add debit/credit card{this.state.show ? ': hide' : ''}</span>
                </div>
          </div>


            {/* Add new card shows here */}
          {this.state.show && <Addcard/>}

          <SelectableCardList
            {...this.state}
            onChange={this.onListChanged.bind(this)}
          />

            {this.state.splitPayment && 
          <div className={"slider"}>
            <div className={"splitnow"}>
              Split
            </div>
              
            <div className={"sliderr"}>
            
              <input type="range" min="0" max="100" 
              value={this.state.slideValue}
              onChange={this.sliderChange}
              />
              <div className={"splitAcctName"}>
                <div className={"splitAcctech"}>
                  <span><h1>${this.state.firstPrice}</h1>{this.state.firstAcct}</span>
                </div>

                <div className={"splitAcctech"}>
                  <span><h1>${this.state.secPrice}</h1>{this.state.secAcct}</span>                  
                </div>
              </div>
            </div>       
                     
          </div>}
            
           
            <div className={"termsAndCond"}> 
                <div className={"checkbox"}>
                  <input onChange={(event) => this.handleCheck(event)} type="checkbox"/>
                </div>

                <div className={"termsWord"} >
                  <span>By checking this box, you authorize this payment and you accept to our <a href="http://cleavepay.com"  rel="noopener noreferrer" target="_blank">terms and conditions</a>. Payment is processed by Autherize.Net, check our website for more info</span>
                </div>

            </div>
  
            <button className="card" disabled={this.state.disabled} onClick={(e) => this.submit()}>
                Confirm
            </button>
        </div>
      );
    }
  }
  
  
  

  




export default ListOfAccount