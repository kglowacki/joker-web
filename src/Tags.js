import React, { Component } from 'react';
import Chip from 'material-ui/Chip';
import { withStyles } from 'material-ui/styles';

const styles = (theme)=>({
    tags : {
        display: 'flex',
        flexWrap: 'wrap',
        padding:'1em'
    },
    chip:{
        backgroundColor:'#eee',
        margin: '0.25em',
        '&.selected' : {
                backgroundColor:'#aaa'

        }
    }
});

class Tags extends Component {

    render() {
        let {tags,selected,onClick,classes} = this.props;
        tags=tags||[];
        return <div className={classes.tags}>
            {tags.map(tag=>(
                    <Chip className={classes.chip+' '+(selected[tag.en]?'selected':'')}
                    label={tag.pl || tag.en}
                    onClick={()=>onClick(tag.en)}
                    key={tag.en}/>
                ))}
        </div>
    }

}

export default withStyles(styles)(Tags);