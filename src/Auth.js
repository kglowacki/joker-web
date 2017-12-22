import React, { Component }  from 'react';
import Button from 'material-ui/Button';
import { FirebaseAuth } from 'react-firebaseui';
import jokerService from './joker.service';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import firebase from 'firebase';

//const firebase = require("firebase/app");

const styles = theme => ({
    avatar : {
        width:'100px',
        height:'100px'
    },
    authPanel: {
        padding:'1em',
        background:'#eee',
        minHeight:'150px'
    }
});

class Auth extends Component {

    state = {
        user:null
    };

    uiConfig = {
        signInFlow: 'popup',
        callbacks: {
            signInSuccess: ()=>(false) //stop redirect
        },
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            //firebase.auth.GithubAuthProvider.PROVIDER_ID,
            //firebase.auth.EmailAuthProvider.PROVIDER_ID,
            //firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ]
    };

    componentWillMount() {
        this.userSub = jokerService.user.subscribe((user)=>{
            this.setState((state)=>(Object.assign(state,{user:user})));
        });
    }

    componentWillUnmount() {
        this.userSub.dispose();
    }

    onLogout() {
        firebase.auth().signOut();
    }

    render() {
        const {classes} = this.props;
        return <div className={classes.authPanel}>
            {!this.state.user &&
            <div>
                <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
            </div>
            }
            {this.state.user &&
            <div>
                <Avatar className={classes.avatar} src={this.state.user.photoURL}/>
                <Typography type="title">{this.state.user.displayName}</Typography>
                <Typography type="subheading">{this.state.user.email}</Typography>

                <Button onClick={this.onLogout}>Logout</Button>
                </div>
            }
        </div>
    }
}


export default withStyles(styles)(Auth);