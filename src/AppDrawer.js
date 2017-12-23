import React, { Component }  from 'react'
import Drawer from 'material-ui/Drawer'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    drawer : {

    },
    drawerHeader: {
        ...theme.mixins.toolbar,
        background:'#fff',
        display:'flex',
        alignItems:'center',
        paddingLeft:'20px'
    },
    paper : {
        width:'260px'
        //background:"rgba(0,0,0,0.2)"
    },
    flexGrow:{flex:'1 1 auto'}
});

class AppDrawer extends Component {

    render() {
        const {content,classes,drawerOpen,onClose} = this.props;
        return (
            <Drawer type="persistent" anchor="left" open={drawerOpen} classes={{paper:classes.paper}}>
                <div className={classes.drawerHeader}>
                    <Typography type="title" color="inherit" className="title">
                        Settings
                    </Typography>
                    <div className={classes.flexGrow}/>
                    <IconButton onClick={()=>onClose()}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                {content}
            </Drawer>
        )
    }
}

export default withStyles(styles, { withTheme: true })(AppDrawer);