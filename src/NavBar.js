import React, { Component }  from 'react'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import List from 'material-ui-icons/List'
import InfoOutline from 'material-ui-icons/InfoOutline'
import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';

const styles = {
    appBarIcon : {
        width: "30px",
        height: "30px",
        backgroundImage: "url('/icon2.png')",
        backgroundSize: "cover",
        marginRight: "0.5em"
    },
    title : {
        flexGrow:2,
        fontWeight: 400
    },
    progressbar : {
        position:'absolute',
        bottom:0,
        left:0,
        right:0
    }
};

class NavBar extends Component {

    render() {
        const {onDrawerToggleClick, onInfoClick,classes,loading} = this.props;
        return (
            <AppBar position="fixed" onClick={onDrawerToggleClick}>
                <LinearProgress style={{display:loading?'block':'none'}} className={classes.progressbar} color="accent"/>
                <Toolbar>
                    <div className={classes.appBarIcon}></div>
                    <Typography type="title" color="inherit" className={classes.title}>
                        Joker
                    </Typography>
                    {/*<IconButton color="contrast" onClick={onDrawerToggleClick}>*/}
                        {/*<List />*/}
                    {/*</IconButton>*/}
                </Toolbar>
            </AppBar>
        )
    }

}


export default withStyles(styles)(NavBar);