import React from "react";
import fire from './account_widget/config/fbconfig';
import firebase from 'firebase'
import PasswordMask from 'react-password-mask';
import { css } from '@emotion/core';
import ClipLoader from 'react-spinners/SyncLoader';
var passwordValidator = require('password-validator');


const db = firebase.firestore()

const override = css`
  display: block;
  margin: 0 auto;
`;


class Modal extends React.Component{
  //Show whihc screen, LOGIN/ REGISTER
  constructor(props){
    super(props);
    this.state = { 
      isLoginOpen: true, 
      isRegisterOpen: false,
    };
  }


  //Show Login/ Register screen
  showLoginrbox(){
      this.setState({isRegisterOpen: false, isLoginOpen: true});
  }
  showRegisterbox(){
      this.setState({isRegisterOpen: true, isLoginOpen: false});
  }

    render() {

      return (
        <div className={"modal-Access"}>
          <div className={"modalLink"}>

            <div id={"btn"} className={"loginBtn" + (this.state.isRegisterOpen ? "selected": "")} onClick={this.showLoginrbox.bind(this)} >
              <p>Login in</p>
            </div>

            <div id={"btn1"} className={"loginBtn" + (this.state.isLoginOpen ? "selected": "")} onClick={this.showRegisterbox.bind(this)}>
              <p>Sign up now</p>
            </div>

          </div>

          <div className={""}>
                 {this.state.isLoginOpen && 
                    <LoginBox />
                  }
                 {this.state.isRegisterOpen && 
                    <RegisterBox />
                  }
             </div>


        </div>
      );
    }

  }



  //Login Box state
class LoginBox extends React.Component{
    constructor(props){
      super(props);
      this.login = this.login.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        disable: false,
        loading: false,
        loginBtn: true,
        email: '',
        password: '',
        errorMessage: ''
      };
    }
    handleChange(e) {
      this.setState({ [e.target.id]: e.target.value });
    }



     async login(e) {
      e.preventDefault();
      
      ////Test
      // alert(this.state.email)
      if(this.state.email===''){
        return this.setState({errorMessage: "Email is required"})
      }
      if (this.state.password===''){
        return this.setState({errorMessage: "Password is required"})
      }else{
        this.setState({loading: true, loginBtn: false,  disable: true});
        await fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((u)=>{
        // console.log('welcome')
      }).catch((err) => {
        this.setState({loading: false, loginBtn: true,  disable: false});
          this.setState({errorMessage: err.message})
        });
      }
     
    }

    
    render(){
        return(
        <div className={"signInContainer"}>
          <form className={"signInModal"} >
              <h2>Login to continue</h2>

              <div className={"errorMessage"}>
                {this.state.errorMessage}
              </div>

              <input id="email" 
                type="email" 
                name={this.email}
                required 
                placeholder="Email" 
                value={this.state.email} 
                onChange={this.handleChange}
                autoComplete={false}
              />
              <PasswordMask
                type="password"
                id="password"
                required 
                autoComplete={false}
                name={this.password}
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleChange}
              />

              <button 
                type="submit"
                onClick={this.login}  
                disabled={this.state.disable}
                >
                <div className="sweet-loading">
                  <ClipLoader
                    css={override}
                    size={10}
                    color={"#6867ae"}
                    loading={this.state.loading}
                  />
                </div>

                {this.state.loginBtn && "LOGIN"}
              </button>
          </form>

        </div>
        );
    }
  }



  




class RegisterBox extends React.Component{
  constructor(props){
    super(props);
    this.signup = this.signup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      loading: false,
      loginBtn: true,
      disabled: true,
      phone: '',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      errorMessage: ''
    };
  }


  onChange(e) {
    const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
         this.setState({phone: e.target.value})
      }
  }
  
  handleChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  async signup(e) {
    //avoid page reload
    e.preventDefault();

    //declear var
    let email = this.state.email
    let password =  this.state.password
    let username =  this.state.username.toLowerCase()
    let phone = "+1"+this.state.phone
    let phon = this.state.phone
    let firstName = this.state.firstName
    let lastName = this.state.lastName

    
    //validation
    //email
    let lastAtPos = email.lastIndexOf('@');
    let lastDotPos = email.lastIndexOf('.');
    let notValidEmail = !(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)

    //name, first and last
    let matchfirst = !firstName.match(/^[a-zA-Z]+$/)
    let matchlast = !lastName.match(/^[a-zA-Z]+$/)
    let notEmpty = !lastName
    let notValidName = matchfirst || matchlast || notEmpty

    //password 
    var schema = new passwordValidator();
     
      schema                                          // Add properties to it
      .is().min(8)                                    // Minimum length 8
      .is().max(20)                                  // Maximum length 100
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits()                                 // Must have digits
      .has().not().spaces()                           // Should not have spaces
      .is().not().oneOf(['Passw0rd', 'Password123'])

    let notValidPass = !schema.validate(password) === true
    //Use validators
    if(phon.length !== 10){
      let error = "Phone number not valide"
      return this.setState({errorMessage: error})
      // alert(error)
    }
    //Use validators
    if(notValidEmail){
      let error = "Email not valid"
      return this.setState({errorMessage: error})
      // alert(error)
    }
    if(username === ''){
      let error = "Username can not be empty"
      return this.setState({errorMessage: error})
      // alert(error)
    }
    if(notValidName){
      let error = "Please check name"
      return this.setState({errorMessage: error})
      // alert(error)
    }
    if(notValidPass){
      let error = "Password must have uppercase, lowercase, digits, no space and min lenght 8"
      return this.setState({errorMessage: error})
      // alert(error)
    }else{
      if(username === '' || notValidPass || notValidName || notValidEmail){
        alert("Error")
      }else{
        this.setState({loading: true, loginBtn: false,  disabled: true});


        let getPhone = fire.firestore().collection('usernames').where('phone', '==', phone).get()
        let getUsername = db.collection('usernames').where("username", "==",username).get()



        getPhone.then((querySnapshot) => {
          if (!querySnapshot.empty) {
            // User found with this phone number.
            this.setState({loading: false, loginBtn: true,  disabled: false});
            return this.setState({errorMessage: 'Sorry, this phone number is already in use.'})            
          }else{
            getUsername.then((querySnapshot) => {
              
              if (!querySnapshot.empty) {
                // User found with this phone number.
                this.setState({loading: false, loginBtn: true,  disabled: false});
                return this.setState({errorMessage: 'Username is already in use.'})            
              }else{

                fire.auth().createUserWithEmailAndPassword(email, password)
                .then((userRecord)=>{
                  let uid = userRecord.user.uid

                  fire.auth().currentUser.updateProfile({
                    displayName: firstName,
                    phoneNumber: phone
                  });
      
                  db.collection('users').doc(uid).set({
                    email,firstName,lastName,username, phone
                  })
                  db.collection('usernames').doc().set({
                    username, phone, uid
                  })
                  
                })
                .catch((error) => {
                  this.setState({loading: false, loginBtn: true,  disabled: false});
                  return this.setState({errorMessage: error.message})
                  })
     
              }
              
            })
            .catch((error) => {
              // there was an error
              let newStatus;
              if (error.message === 'already-exists') {
                newStatus = 'Username is already in use.';
                this.setState({loading: false, loginBtn: true,  disabled: false});
                return this.setState({errorMessage: newStatus})            
              }
            });       
 
          }
          
        })
        .catch((error) => {
          // there was an error
          let newStatus;
          if (error.message === 'already-exists') {
            newStatus = 'Sorry, this phone number is already in use.';
            this.setState({loading: false, loginBtn: true,  disabled: false});
            return this.setState({errorMessage: newStatus})            
          }
        });
      }
    } 
  }

     

  handleCheckBox(event){
    if(event.target.checked){
      this.setState({ disabled: false });

    } else {
          this.setState({ disabled: true });
    }
  }




    render(){
        return(
        <div className={"signInContainer"}>
          <div className={"signInModal"} >
              <h2>Register now to start splitting</h2>
              <div className={"errorMessage"}>
                {this.state.errorMessage}
              </div>
              <input id="phone" 
                format="(###) ###-####"
                required type="phone" 
                placeholder="Phone number" 
                autoComplete="off"
                autoCorrect="off"
                onChange={this.onChange}
                value={this.state.phone}
                maxLength="10"
              />

              <input id='username'
                required 
                placeholder="Username" 
                onChange={this.handleChange}
                value={this.state.username}
                autoComplete="off"
                autoCorrect="off"
              />

              <input id='firstName'
                className={"half"} 
                required  placeholder="Fist name" 
                onChange={this.handleChange}
                value={this.state.firstName}
                autoComplete="off"
                autoCorrect="off"
              />

              <input id='lastName'
                className={"half"} 
                required  placeholder="Last name" 
                onChange={this.handleChange}
                value={this.state.lastName}
                autoComplete="off"
                autoCorrect="off"
              />

              <input id='email'
                 placeholder="Email"  
                required 
                onChange={this.handleChange}
                value={this.state.email}
                autoComplete="off"
                autoCorrect="off"
              />

              <input id='password'
                type="password" 
                required  placeholder="Password" 
                onChange={this.handleChange}
                value={this.state.password}

              />


              {/* Cleavepay Terms and conditions */}
              <div className={"termsAndCond2"}>
                <div className={"checkbox"}>
                    <input onChange={(event) => this.handleCheckBox(event)} type="checkbox"/>
                </div>

                <div className={"termsWord"} >
                    <span>By checking this box, you accept to our <a href="http://cleavepay.com" rel="noopener noreferrer" target="_blank">terms and conditions</a></span>
                </div>

              </div>

              {/* submit Button  */}
              <div className={"submitReg"}>
                <button htmlFor="submit" 
                  disabled={this.state.disabled} 
                  onClick={this.signup} 
                >
                  <div className="sweet-loading">
                    <ClipLoader
                      css={override}
                      size={10}
                      margin={4}
                      color={"#6867ae"}
                      loading={this.state.loading}
                    />
                  </div>
                  {this.state.loginBtn && "REGISTER"}
                </button>
              </div>
          </div>

        </div>
        );
    }
  }




  export default Modal;




