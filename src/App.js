import React, { Component } from 'react';
import './App.css';
import Modal from "./components/modal";
import SelectAcct from './components/selectAccount'
import fire from './components/account_widget/config/fbconfig'
import { IoIosClose } from "react-icons/io";
import ClipLoader from 'react-spinners/SyncLoader';
import Cookies from 'js-cookie'
const db = fire.firestore()





class Enter extends Component {
  constructor() {
    super();
    this.state = ({
      user: null,
    });
    this.authListener = this.authListener.bind(this);
  }
  
  //cross domain response to parent domain
  closeModal =()=>{
    sessionStorage.clear();
    Cookies.remove('cleavepay_check_id')
    
    fire.auth().signOut().then(end=>{
      var parent = window.parent;
      parent.postMessage({
        'closeModalClient': 'closeModal',
        'message': "Checkout cancelled",
      }, "*")
    })  
  }

  componentDidMount() {
    this.authListener(); 
  }
  

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      //console.log(user);
      if (user) {
        this.setState({ user });
        //localStorage.setItem('user', user.uid);
      } else {
        this.setState({ user: null });
        //localStorage.removeItem('user');
      }
    });
  }

  render() {
    return (
      <div className={"modal-box"}>

           {/* Modal  Header */}
            <div className={"modalHeader"}>
                <div className="appLogo" >
                   <img src={'https://cleavepaytrail.firebaseapp.com/cleavepayFull.png'} alt="logo" />
                </div>
                <div onClick={this.closeModal} className={'cancelBtn'}>
                  <IoIosClose 
                    color="grey"
                    size="25"/>
                </div>
            </div>

            

            {/* Inside modal content */}
            <div className={"modalContent"}>

              <div>
                {this.state.user ? (<SelectAcct/>) : (<Modal />)}
              </div>
              
            </div>
            <p>© 2020 Cleavepay Inc. All right reserved</p>
          </div>
      
    )
  }
}








//listen for payment_token
function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
      element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, eventHandler);
  }
}



//App main root
function App(){
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null)

  React.useEffect(()=>{ 
    //listen for payment token from parent
    bindEvent(window, 'message', function (data) {
      let payment_token = data.data.payment_token
      // console.log({react:payment_token})

      //save to session 
      //check if incoming request is valid
      if (payment_token !== undefined){
        
        //check if token is valide
        return  fetch('https://cleavepaytrail.firebaseapp.com/checkout/clientAuth/paynow/authTransaction',{
          method: 'GET',
          headers: {
          'Authorization': 'bearer ' + payment_token,
          'Content-type':'application/json'
          }, 
        })
        .then(res => res.json())
        .then(res => {
            
          //returns a transaction token and be saved
          let transaction_token = res.token
          

          //create random string
          function makeid(length) {
            var result           = '';
            var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
          }
          
          //set random string
          let session_id = makeid(25)
          //get user id
          // let user_id = fire.auth().currentUser.uid
          

          // //save token
          db.collection('session-cookie').doc(session_id).set({
            transaction_token
          })
          
          //save token
          Cookies.defaults = {
            sameSite: 'None',
            Secure: true
            }
          Cookies.set('cleavepay_check_id', session_id);
          // sessionStorage.setItem('Cleavepay_id', transaction_token);
          

          let cookie = Cookies.get('cleavepay_check_id');

          // console.log(cookie)
          if (cookie){
            setUser(cookie)
            setLoading(false)
          }else{
            
            Cookies.remove('cleavepay_check_id')
            fire.auth().signOut().then(end=>{
              var parent = window.parent;
              parent.postMessage({
                'closeModalClient': 'closeModal',
                'message': "There was an error",
              }, "*")
            })
          }
          
        })
        .catch(err => {
          // console.log(err)
          setUser(false)
          setLoading(true)
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

      }
        
    })

  }, [user])



  if(!user){
    return (
      <div className={"modal-wrapper"}>
  
        {/* Modal box background */}
        <div className={"modal-backdrop"}/>

        <div className={'loading'}>
          <ClipLoader
            margin={20}
            size={30}
            color={"#6867ae"}
          />
        </div>
      </div>
    );
  } 
  
  if(loading){
    return (
      <div className={"modal-wrapper"}>
  
        {/* Modal box background */}
        <div className={"modal-backdrop"}/>
        
        <div className={'loading'}>
          <ClipLoader
            margin={20}
            size={30}
            color={"#6867ae"}
          />
        </div>
      </div>
                
    );
  }
  return (
    <div className={"modal-wrapper"}>

      {/* Modal box background */}
      <div className={"modal-backdrop"}/>

      <Enter/>
    </div>
  );

}



export default App;

