import React, { Component }  from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import jokerService from './joker.service';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Clear from 'material-ui-icons/Clear';
import IconButton from 'material-ui/IconButton';
import firebase from 'firebase';

const styles = theme => ({
    avatar : {
        width:'100px',
        height:'100px'
    },
    authPanel: {
        padding:'1em',
        background:theme.palette.primary.dark,
        minHeight:'200px',
        '& .light' : {
            color:'#fff'
        },
        display:'flex',
        alignItems: 'flex-end',
        justifyContent:'center',

        '& .firebaseui-card-content': {
            padding: '0 12px'
        }
    },
    userInfo: {
        display:'flex',
        marginTop:'10px'
    },
    flexGrow: {
        flexGrow:2
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
        jokerService.signOut();
    }

    render() {
        const {classes} = this.props;
        return <div className={classes.authPanel}>
            {!this.state.user.auth &&
                <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
            }
            {this.state.user.auth &&
            <div className={classes.flexGrow}>
                <Avatar className={classes.avatar} src={this.state.user.auth.photoURL}/>
                <div className={classes.userInfo}>
                    <div className={classes.flexGrow}>
                        <Typography type="title" className="light">{this.state.user.auth.displayName}</Typography>
                        <Typography type="subheading" className="light">{this.state.user.auth.email}</Typography>
                    </div>
                    <IconButton className="light" onClick={this.onLogout}><Clear/></IconButton>
                </div>
            </div>
            }
        </div>
    }
}


export default withStyles(styles)(Auth);