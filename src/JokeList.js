import React, { Component } from 'react';
import Joke from './Joke';

import { withStyles } from 'material-ui/styles';
import List, {ListItem} from 'material-ui/List';

const styles = theme => ({
    root: {
        //width: 300,
        //background: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        padding: '0.5em 0 0 0',
        marginTop:'50px' //TODO take it from theme?
    },
    item: {
        borderBottom:'1px solid #ccc'
    },
    loadMore : {
        height:'150px',
        justifyContent:'center'
    }
});

class JokeList extends Component {

    render() {
        const {classes,jokes,onLoadMore,loading} = this.props;
        return <List className={classes.root}>
            {(jokes || []).map(joke=>(<ListItem button className={classes.item} key={joke.id}><Joke joke={joke}/></ListItem>))}
            {(jokes || []).length ?
            <ListItem button className={classes.loadMore} style={{opacity:loading?0.5:1}} onClick={onLoadMore}>Load more dirty jokes!</ListItem>
                :''}
        </List>
    }

}

export default withStyles(styles)(JokeList);