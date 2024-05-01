import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBg4I0-x4-k8V9n4STr5lf0HgdtZXpIOcI",
  authDomain: "feyntech-allowance-calculator.firebaseapp.com",
  databaseURL: "https://feyntech-allowance-calculator-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "feyntech-allowance-calculator",
  storageBucket: "feyntech-allowance-calculator.appspot.com",
  messagingSenderId: "142052743063",
  appId: "1:142052743063:web:9b1ce4cabde47c27a196d2",
  measurementId: "G-S8ME0PSGXB"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;