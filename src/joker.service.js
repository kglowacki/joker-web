import Rx from 'rx-lite';
import firebase from 'firebase';

//var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");

const defaultFilter = ()=>({
    tags : {},
    lang : 'pl'
});

class JokerService {

    user = new Rx.BehaviorSubject(null);

    /*
     * because filter is persisted in account, it makes sense to keep it here, rather than route auth=>App=>filter=>here?
     */
    filter = new Rx.BehaviorSubject(defaultFilter());

    jokes = new Rx.BehaviorSubject([]);

    loading = new Rx.BehaviorSubject(false);

    tags = new Rx.BehaviorSubject([]);

    constructor() {
        firebase.initializeApp({
            apiKey: 'AIzaSyC_K1p87HPvJIQR1DWh60GW8pTabELUqnw',
            authDomain: 'joker-b9714.firebaseapp.com',
            projectId: 'joker-b9714'
        });

        firebase.auth().onAuthStateChanged(user => {
            console.log("onAuthStateChanged", user ? user.uid : 'logged out');
            this.user.onNext(user);
            if (user) {
                this.db.collection('users').doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        console.log("read existing profile", doc.data());
                        this.updateFilter(()=>(Object.assign(defaultFilter(), doc.data().filter)), true);
                    } else {
                        console.log('save new user profile');
                        this.updateUserProfile();
                    }
                });
            }
        });

        // firebase.firestore().enablePersistence().then(()=>{
        //     console.log('persistence enabled');
        // });
        this.db = firebase.firestore();
        this.loadJokes();
        this.loadTags();
    }

    updateUserProfile() {
        if (this.user.value) {
            this.db.collection('users').doc(this.user.value.uid).set({"filter":this.filter.value});
        }
    }

    updateFilter(updater, skipSave) {
        this.filter.onNext(updater(this.filter.value));
        if (!skipSave) this.updateUserProfile();
        this.loadJokes();
    }

    toggleTag(tag) {
        this.updateFilter((filter)=>{
            const change = {};
            change[tag] = !filter.tags[tag];
            return Object.assign(filter, {tags:Object.assign(filter.tags, change)});
        });
    }

    loadMore() {
        //we don't modify filter, and we need to append new result to previous one
        this.loadJokes(true);
    }

    loadJokes(more) {
        const filter = this.filter.value;
        console.log('filter',JSON.stringify(filter));
        let ref = this.db.collection('jokes').where("lang","==","pl");

        Object.getOwnPropertyNames(filter.tags||{}).forEach(tag=>{
            //TODO can we detect missing index here?
            if (filter.tags[tag]) {
                ref = ref.where('tags.' + tag, "==", true)
            }
        });
        this.loading.onNext(true);
        ref = ref
            .orderBy("ts","desc")
            .limit(3);                  //maybe in case of reload we should keep previous records.

        if (more) {
            ref = ref.startAfter(this.jokes.value[this.jokes.value.length-1].data.ts);
        }

            ref.get().then(querySnapshot=> {
                const all = [];
                querySnapshot.forEach((doc) => {
                    all.push({id: doc.id, data: doc.data()});
                });
                return all;
            })
            .then(jokes=>this.jokes.onNext(
                (more ? this.jokes.value : []).concat(jokes)
            ))
            .then(()=>this.loading.onNext(false),()=>this.loading.onNext(false));
    }

    loadTags() {
        this.db.collection("tags").get().then((querySnapshot)=>{
            const all = [];
            querySnapshot.forEach((doc) => {
                all.push(Object.assign({en:doc.id}, doc.data()));
            });
            this.tags.onNext(all);
        });
    }

}

const instance = new JokerService();

export default instance;