import firebase from "firebase/app";
import "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAf9CgRUFCT7TKJZrii--0OQ4DUyRRBk3w",
  authDomain: "auth-ffe2d.firebaseapp.com",
  projectId: "auth-ffe2d",
  storageBucket: "auth-ffe2d.appspot.com",
  messagingSenderId: "6327458710",
  appId: "1:6327458710:web:199f72df5dc60fbe3adbb7", 
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export { firebase, storage };
