import Rx from 'rx-lite';
import firebase from 'firebase';
import cloneDeep from 'lodash/cloneDeep'


//var firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");


const defaultProfile = ()=>({
   filter : {
       tags : {},
       lang : 'pl'
   }
});

const defaultUser = ()=>({
    auth:null,
    profile: defaultProfile()
});

class JokerService {

    user = new Rx.BehaviorSubject(defaultUser());

    jokes = new Rx.BehaviorSubject([]);

    loading = new Rx.BehaviorSubject(false);

    tags = new Rx.BehaviorSubject([]);

    msg = new Rx.BehaviorSubject({});

    constructor() {
        firebase.initializeApp({
            apiKey: 'AIzaSyC_K1p87HPvJIQR1DWh60GW8pTabELUqnw',
            authDomain: 'joker-b9714.firebaseapp.com',
            projectId: 'joker-b9714'
        });

        firebase.auth().onAuthStateChanged(user => {
            console.log("onAuthStateChanged", user ? user.uid : 'logged out');
            if (user) {
                this.notifySuccess('Signed in',1);
                this.db.collection('users').doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        console.log("read existing profile", doc.data());
                        this.user.onNext({auth:user, profile: Object.assign(defaultProfile(), doc.data())});
                        this.loadJokes();
                    } else {
                        console.log('save new user profile');
                        this.user.onNext(Object.assign(this.user.value, {auth:user}));
                        this.storeProfile();
                    }
                });
            } else {
                this.user.onNext(Object.assign(this.user.value, {auth:null, profile:{...this.user.value.profile, account:undefined}}));
            }
        });

        // firebase.firestore().enablePersistence().then(()=>{
        //     console.log('persistence enabled');
        // });
        this.db = firebase.firestore();
        this.loadJokes();
        this.loadTags();
        //this.triggerMsg();
    }

    triggerMsg() {
        let i = Math.round(Math.random() * 10 + 1);
        this.msg.onNext({text:"Next msg in "+i+"seconds..."});
        setTimeout(()=>this.triggerMsg(), i * 1000);
    }

    storeProfile() {
        if (this.user.value.auth) {
            this.db.collection('users')
                .doc(this.user.value.auth.uid)
                .set(this.user.value.profile)
                .catch(e=>this.notifyError(e));
        }
    }

    updateFilter(updater) {
        const newFilter = updater(this.user.value.profile.filter);
        this.user.onNext(Object.assign(this.user.value, {profile:{filter:newFilter}}));
        this.storeProfile();
        this.loadJokes();
    }

    toggleTag(tag) {
        this.updateFilter((filter)=>{
            const change = {};
            change[tag] = !filter.tags[tag];
            return Object.assign(filter, {tags:change});
        });
    }

    loadMore() {
        //we don't modify filter, and we need to append new result to previous one
        this.loadJokes(true);
    }

    loadJokes(more) {
        const filter = this.user.value.profile.filter;
        console.log('filter',JSON.stringify(filter));
        let ref = this.db.collection('jokes').where("lang","==",filter.lang);

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
        this.db.collection("tags").get().then(querySnapshot=>{
            const all = [];
            querySnapshot.forEach((doc) => {
                all.push(Object.assign({en:doc.id}, doc.data()));
            });
            this.tags.onNext(all);
        });
    }

    signOut() {
        firebase.auth().signOut();
    }

    notifyError(e) {
        this.msg.onNext({text:e.name+' ('+e.code+')'});
    }

    notifySuccess(text, time) {
        this.msg.onNext({text:text, time:time*1000});
    }


    saveJoke(joke) {
        let data = cloneDeep(joke.data);
        data.text = data.text.trim();
        data.tsm = firebase.firestore.FieldValue.serverTimestamp();
        return this.db.collection('jokes').doc(joke.id).set(data)
            .then(ok=>this.notifySuccess('Saved'), e=>this.notifyError(e));
    }

    isAdmin() {
        return this.user.value && this.user.value.profile.account && this.user.value.profile.account.admin
    }

}

const instance = new JokerService();

export default instance;