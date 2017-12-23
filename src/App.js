import React, { Component } from 'react';
import './App.css';
import jokerService from './joker.service';
import Tags from './Tags';
import JokeList from './JokeList';
import NavBar from './NavBar';
import {MuiThemeProvider,createMuiTheme} from 'material-ui/styles'
import AppDrawer from './AppDrawer';
import Auth from './Auth';
import { LinearProgress } from 'material-ui/Progress';

const theme = createMuiTheme({
    palette: {
        //primary : lightGreen
    }
});

class App extends Component {

  constructor() {
      super();
      this.state = {
          drawerOpen:false,
          filter:{},
          jokes:[]
      };
  }

  componentWillMount() {
      this.subs = ['jokes','loading','filter','tags'].map(prop=>{
          return jokerService[prop].subscribe(value=>{
              const change = {};
              change[prop] = value;
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
      return <div>
          <Auth/>
          <Tags tags={this.state.tags} selected={this.state.filter.tags} onClick={tag=>jokerService.toggleTag(tag)}/>
      </div>
  }

  render() {
    return (
        <MuiThemeProvider theme={theme}>
            <NavBar onDrawerToggleClick={()=>this.toggleMenu(!this.state.drawerOpen)}/>

            <AppDrawer drawerOpen={this.state.drawerOpen}
                     onClose={()=>this.toggleMenu(false)}
                       content={this.drawerContent()}
            />
            <LinearProgress style={{display:this.state.loading?'block':'none',position:'fixed',zIndex:1200,top:'55px',left:0,right:0}} color="accent"/>


            <JokeList jokes={this.state.jokes} loading={this.state.loading} onLoadMore={()=>{if (!this.state.loading) jokerService.loadMore()}}/>
        </MuiThemeProvider>
    );
  }
}

export default App;
