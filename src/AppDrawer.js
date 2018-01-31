import React, { Component }  from 'react'
import Drawer from 'material-ui/Drawer'
import IconButton from 'material-ui/IconButton'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    closeBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
        color:'#fff'
    },
    drawer : {

    },
    paper : {
        width:'260px',
        background:theme.palette.primary.light
    },
    flexGrow:{flex:'1 1 auto'}
});

class AppDrawer extends Component {

    render() {
        const {content,classes,drawerOpen,onClose} = this.props;
        return (
            <Drawer type="persistent" anchor="left" open={drawerOpen} classes={{paper:classes.paper}}>
                    <IconButton onClick={()=>onClose()} className={classes.closeBtn}>
                        <ChevronLeftIcon />
                    </IconButton>
                {content}
            </Drawer>
        )
    }
}

export default withStyles(styles, { withTheme: true })(AppDrawer);