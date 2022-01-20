import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firebase-firestore';


var firebaseConfig = {
    apiKey: "*************************",
    authDomain: "*************************",
    databaseURL: "*************************",
    projectId: "*************************",
    storageBucket: "*************************",
    messagingSenderId: "",
    appId: "*************************",
    measurementId: "*************************"
};

// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
firebase.analytics();


export default fire;