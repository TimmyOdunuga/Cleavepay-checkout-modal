import React from 'react';
import ListOfAccount from './account_widget/accounts';
import checkout from './checkout.svg';
import fire from './account_widget/config/fbconfig'
import Cookies from 'js-cookie'
import firebase from 'firebase';

const db = fire.firestore()

// export class Selectaccount extends Component{
//     constructor(props){
//         super(props);
//         this.state = { isSelectAcctOpen: true, isSplitFrndOpen: false};
//       }
  
//       showSplitFrnd(){
//           this.setState({isSelectAcctOpen: false, isSplitFrndOpen: true});
//       }
  
//       showSelectAcct(){
//           this.setState({isSelectAcctOpen: true, isSplitFrndOpen: false});
//       }
      
//       continue = e => {
//           e.preventDefault();
//           this.props.nextStep();
//       };
//       render() {
//         return (
//           <div className={"modal-Access"}>

//             <div className={"modalLink"}>

//               {/* <div onClick={this.showSelectAcct.bind(this)}>
//                 <p> Select account</p>
//               </div>

//               <div onClick={this.showSplitFrnd.bind(this)}>
//                 <p>Add frinds</p>
//               </div> */}

//             </div>

//             <div className={""}>

//               <SelectAcct/>
//                 {/* {this.state.isSelectAcctOpen && <SelectAcct/>}
//                {this.state.isSplitFrndOpen && <SplitFrnd/>} */}
//             </div>
            
            
//           </div>
//         );
//       }    
// }






 

class SelectAcct extends React.Component{
  constructor(props) {
    super(props);
    this.user = fire.auth().currentUser.displayName
    this.setPrice = React.createRef();
    this.state = {
      firstName: this.user,
      genres: '',
      price: '',
      business: '',
      transaction: ''
    }
  }


  componentDidMount(){
    //get cookie id
    let cookie = Cookies.get('cleavepay_check_id');

    // exchange cookie id for transaction_token
    db.collection('session-cookie').doc(cookie).get()
    .then(snap =>{
      console.log(snap)
      // transaction token
      let data = snap.data().transaction_token

      return  fetch('https://cleavepaytrail.firebaseapp.com/checkout/clientAuth/paynow/getTransactionData',{
          method: 'GET',
          headers: {
          'Authorization': 'bearer ' + data,
          'Content-type':'application/json'
          }, 
        })
        .then(res => res.json())
        .then(snapData =>{ 
         
          let transPrice = snapData.transactionData.payment_token.transactions.price
          let business = snapData.transactionData.payment_token.business
          let transaction = snapData.transactionData.payment_token.transactions

          // console.log(snapData.transactionData.payment_token.business.client_name)
          
          this.setState({business: business})
          this.setState({price: transPrice})
          this.setState({transaction: transaction})
          this.setPrice.current.onprice(transPrice);

        })
        .catch(err =>{
          let dataShot = snap.data().transaction_token
          // console.log(err)
          return  fetch('https://cleavepaytrail.firebaseapp.com/checkout/clientAuth/paynow/getTransactionData',{
            method: 'GET',
            headers: {
            'Authorization': 'bearer ' + dataShot,
            'Content-type':'application/json'
            }, 
          })
          .then(res => res.json())
          .then(snapData =>{ 
          
            let transPrice = snapData.transactionData.payment_token.transactions.price
            let business = snapData.transactionData.payment_token.business
            let transaction = snapData.transactionData.payment_token.transactions

            // console.log(snapData.transactionData.payment_token.business.client_name)
            
            this.setState({business: business})
            this.setState({price: transPrice})
            this.setState({transaction: transaction})
            this.setPrice.current.onprice(transPrice);

          })
          .catch(err =>{
            // console.log(err)
            sessionStorage.clear();
            Cookies.remove('cleavepay_check_id')
            
            fire.auth().signOut().then(end=>{
              var parent = window.parent;
              parent.postMessage({
                'closeModalClient': 'closeModal',
                'message': "There was an error",
              }, "*")
            })
          })
        })

    })
    .catch(err =>{
      // console.log(err)
      sessionStorage.clear();
      Cookies.remove('cleavepay_check_id')
      
      fire.auth().signOut().then(end=>{
        var parent = window.parent;
        parent.postMessage({
          'closeModalClient': 'closeModal',
          'message': "There was an error, Please allow cookie for this site",
        }, "*")
      })
    })
    fire.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  }


    


    render(){
        return(
            <div className={"signInContainer"}>
                <div className={"accountContainer"}>
              
                  <div className={"modalLink"}>
                    <div className={"checkoutSide"}>
                      <h2>Welcome {this.state.firstName} !</h2>
                    </div>

                    <div className={"checkoutSide1"}>
                      <img src={checkout} className="App-logo" alt="logo" /><h3 className={"checkoutLogo"}>$ {this.state.price}</h3>
                    </div>
                  </div>

                    <div className={"split"}>
                        <ListOfAccount
                        {...this.state}
                        ref={this.setPrice}
                        />
                    </div>

                </div>
                {/* <a href="https://verify.authorize.net/anetseal/?pid=d4b4931a-a0fe-41f2-8f75-dd67806930e4&rurl=https://cleavepay.com/">
                  <img src={authNet} className="AuthNet" alt="Auth.Net logo" />
                </a> */}
            </div>
            
        );
    }
  }





  
  export default SelectAcct;