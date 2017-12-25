import React, { Component } from 'react';
import './App.css';
import jokerService from './joker.service';
import Tags from './Tags';
import JokeList from './JokeList';
import NavBar from './NavBar';
import {MuiThemeProvider,createMuiTheme} from 'material-ui/styles'
import AppDrawer from './AppDrawer';
import Auth from './Auth';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';


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
      return [
          <Auth key="1"/>,
          <Tags key="2" style={{flexGrow:3,alignContent: 'flex-start'}} tags={this.state.tags} selected={this.state.filter.tags} onClick={tag=>jokerService.toggleTag(tag)}/>,
          <Divider key="3"/>,
          <div key="4" style={{padding:'1em'}}>
          <FormControlLabel
              control={
                  <Checkbox
                      checked={this.state.checkedA}
                      onChange={()=>{}}
                      value="checkedA"
                  />
              }
              label="Notify me about new jokes"
          />
          </div>
      ]
  }

  render() {
    return (
        <MuiThemeProvider theme={theme}>
            <NavBar loading={this.state.loading} onDrawerToggleClick={()=>this.toggleMenu(!this.state.drawerOpen)}/>

            <AppDrawer drawerOpen={this.state.drawerOpen}
                     onClose={()=>this.toggleMenu(false)}
                       content={this.drawerContent()}
            />

            <JokeList jokes={this.state.jokes} loading={this.state.loading} onLoadMore={()=>{if (!this.state.loading) jokerService.loadMore()}}/>
        </MuiThemeProvider>
    );
  }
}

export default App;
