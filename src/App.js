import React, { Component } from 'react';
import './App.css';
import jokerService from './joker.service';
import Tags from './Tags';
import JokeList from './JokeList';
import NavBar from './NavBar';
import {MuiThemeProvider,createMuiTheme} from 'material-ui/styles'
import AppDrawer from './AppDrawer';
import Auth from './Auth';

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
          tags:[],
          selected:{},
          jokes:[]
      };
      this.updateTags();
      this.updateSearch();
  }

  updateTags() {
      jokerService.getTags().then(tags=>{
          this.setState((state)=>(Object.assign(state, {tags:tags})));
      });
  }

  updateSearch() {
      jokerService.getJokes(this.state.selected).then(jokes=>{
          this.setState((state)=>(Object.assign(state, {jokes:jokes})));
      });
  }

  onTagClick(tag) {
    this.setState((state)=>{
        const selected = Object.assign({},state.selected)
        selected[tag] = !selected[tag];
        return Object.assign(state, {selected:selected});
    },()=>this.updateSearch());
  }

  toggleMenu(open) {
      this.setState((state)=>(Object.assign(state,{drawerOpen:open})));
  }

  drawerContent() {
      return <div>
          <Auth/>
          <Tags tags={this.state.tags} selected={this.state.selected} onClick={tag=>this.onTagClick(tag)}/>
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


            <JokeList jokes={this.state.jokes}/>
        </MuiThemeProvider>
    );
  }
}

export default App;
