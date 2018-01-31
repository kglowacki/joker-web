import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import {ListItem} from 'material-ui/List';
import Typography from 'material-ui/Typography';

const styles = theme => ({
    joke: {
        whiteSpace: "pre-wrap",
        padding: "1em",
        textAlign: "left",
        borderBottom: "1px solid #ccc",
        lineHeight:"1.5em",
        display:"block"
    }
});

class Joke extends Component {

    state = {
        open:false
    };

    /*
     <Collapse in={this.state.open}>
                {
                    Object.getOwnPropertyNames(joke.data.tags || {})
                    .filter(tag=>(joke.data.tags[tag]))
                    .map(tag=>(<Chip label={tag}/>))
                }
                {allowEdit?<IconButton onClick={(e)=>{e.stopPropagation();e.preventDefault();if (onEditClick) onEditClick()}}><ModeEdit/></IconButton> :''}
            </Collapse>
     */


    render() {
        const {joke,classes,onEditClick}=this.props;
        return (<ListItem button className={classes.joke} onClick={()=>{if (onEditClick) onEditClick();}}>
            <Typography>{joke.data.text}</Typography>
        </ListItem>);
    }
}

export default withStyles(styles)(Joke)