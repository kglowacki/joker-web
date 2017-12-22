import Rx from 'rx-lite';
import firebase from 'firebase';

//var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");


class JokerService {

    user = new Rx.BehaviorSubject(null);

    constructor() {
        firebase.initializeApp({
            apiKey: 'AIzaSyC_K1p87HPvJIQR1DWh60GW8pTabELUqnw',
            authDomain: 'joker-b9714.firebaseapp.com',
            projectId: 'joker-b9714'
        });

        firebase.auth().onAuthStateChanged(user => {
            this.user.onNext(user);
            if (user) {
                this.db.collection('users').doc(user.uid).get().then((u) => {
                    console.log("I can read /users/"+user.uid, u);
                });
            }
        });

        // firebase.firestore().enablePersistence().then(()=>{
        //     console.log('persistence enabled');
        // });
        this.db = firebase.firestore();
    }

    getJokes(tags) {
        console.log('query',tags);
        let ref = this.db.collection('jokes').where("lang","==","pl");

        Object.getOwnPropertyNames(tags||{}).forEach(tag=>{
            //TODO can we detect missing index here?
            if (tags[tag]) {
                ref = ref.where('tags.' + tag, "==", true)
            }
        });
        return ref
            .orderBy("ts","desc")
            .limit(10).get().then(querySnapshot=> {
                const all = [];
                querySnapshot.forEach((doc) => {
                    all.push({id: doc.id, data: doc.data()});
                });
                return all;
            });
    }

    getTags() {
        return this.db.collection("tags").get().then((querySnapshot)=>{
            const all = [];
            querySnapshot.forEach((doc) => {
                all.push(Object.assign({en:doc.id}, doc.data()));
            });
            return all;
        });
    }

}

const instance = new JokerService();

export default instance;