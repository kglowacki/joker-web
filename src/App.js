import React, { Component } from 'react';
import './App.css';
import jokerService from './joker.service';
import Tags from './Tags';
import JokeList from './JokeList';
import NavBar from './NavBar';
import {MuiThemeProvider,createMuiTheme} from 'material-ui/styles'
import AppDrawer from './AppDrawer';
import Auth from './Auth';
import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';
import EditModal from './EditModal';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

const styles = theme=>({
    progressbar : {
        position:'fixed',
        top:0,
        left:0,
        right:0,
        zIndex:2000
    },
    msgClose: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    }
});

const theme = createMuiTheme({
    palette: {
        //primary : lightGreen
    }
});

class App extends Component {

  constructor() {
      super();
      this.state = {
          msg: {
            open:false,
            text:undefined
          },
          drawerOpen:false,
          user:null,
          jokes:[]
      };
  }

  componentWillMount() {
      this.subs = ['jokes','loading','tags','user','msg'].map(prop=>{
          return jokerService[prop].subscribe(value=>{
              const change = {};
              change[prop] = value; //deepClone?
              this.setState(state=>(Object.assign(state,change)));
          });
      });
  }

  componentWillUnmount() {
      this.subs.forEach(sub=>sub.dispose());
  }

  toggleMenu(open) {
      this.setState((state)=>(Object.assign(state,{drawerOpen:open})));
  }

  drawerContent() {
      return [
          <Auth key="1"/>,
          <Tags key="2" style={{flexGrow:3,alignContent: 'flex-start'}} tags={this.state.tags} selected={this.state.user.profile.filter.tags} onClick={tag=>jokerService.toggleTag(tag)}/>,
          <Divider key="3"/>,
          this.state.user.auth ?
          <FormControlLabel
              key="4" style={{padding:'1em'}}
              control={
                  <Checkbox
                      checked={this.state.checkedA}
                      onChange={()=>{}}
                      value="checkedA"
                  />
              }
              label="Notify me about new jokes"/>
              :''
      ]
  }

  editJoke(joke) {
      if (jokerService.isAdmin()) {
          this.setState(state => (Object.assign(state, {editJoke: joke})));
      }
  }

    handleMsgClose() {
      this.setState(state=>(Object.assign(state,{msg:{}})));
    }

  render() {
    const {classes} = this.props;
    return (
        <MuiThemeProvider theme={theme}>
            <EditModal joke={this.state.editJoke} onRequestClose={()=>this.editJoke(undefined)}/>
            <LinearProgress style={{display:this.state.loading?'block':'none'}} className={classes.progressbar} color="secondary"/>
            <NavBar loading={this.state.loading} onDrawerToggleClick={()=>this.toggleMenu(!this.state.drawerOpen)}/>

            <AppDrawer drawerOpen={this.state.drawerOpen}
                     onClose={()=>this.toggleMenu(false)}
                       content={this.drawerContent()}
            />

            <JokeList jokes={this.state.jokes}
                      loading={this.state.loading}
                      allowEdit={true}
                      onEdit={joke=>this.editJoke(joke)}
                      onLoadMore={()=>{if (!this.state.loading) jokerService.loadMore()}}/>


            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={!!this.state.msg.text}
                autoHideDuration={this.state.msg.time || 3000}
                onClose={()=>this.handleMsgClose()}
                SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{this.state.msg.text}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={classes.msgClose}
                        onClick={()=>this.handleMsgClose()}
                    >
                        <CloseIcon />
                    </IconButton>
                ]}
            />

        </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
