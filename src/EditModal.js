import React, { Component }  from 'react';
import Dialog from 'material-ui/Dialog';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {FormControlLabel} from 'material-ui/Form'
import Tags from './Tags';
import Switch from 'material-ui/Switch';
import jokerService from "./joker.service";
import {mutator} from './utils'

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const styles = {
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    body: {
        display:'flex',
        flexDirection:'column',
        padding:'1em'
    }

};

class EditModal extends Component {

    state = {
    };

    componentWillMount() {
        this.subs = ['tags'].map(prop=>{
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

    onTextEdit(e) {
        this.setState(mutator({edited:true,'joke.data.text':e.target.value}));
    }

    onTagEdit(tag) {
        this.setState(mutator({edited:true, ['joke.data.tags.'+tag]:!this.state.joke.data.tags[tag]}));
    }

    onVisibilityEdit(checked) {
        this.setState(mutator({edited:true,'joke.data.public':checked}));
    }

    renderContent() {
        if (!this.state.joke) return '';
        return (
            <div className={this.props.classes.body}>
            <TextField
                id="textarea"
                value={this.state.joke.data.text}
                placeholder="Text"
                multiline
                className={this.props.classes.textField}
                margin="normal"
                onChange={e=>this.onTextEdit(e)}
            />
                <FormControlLabel
                    label="Public"
                    control={<Switch checked={this.state.joke.data.public!==false} onChange={(e,checked)=>this.onVisibilityEdit(checked)}/>}/>
                <Tags tags={this.state.tags} selected={this.state.joke.data.tags} onClick={tag=>this.onTagEdit(tag)}/>
            </div>
        )
    }

    setJoke(joke) {
        this.setState(mutator({joke: joke}, true));
    }

    onSave() {
        jokerService.saveJoke(this.state.joke).then(()=>this.props.onRequestClose());
    }

    render() {
        const {joke, onRequestClose, classes} = this.props;
        return (

            <Dialog
                fullScreen
                open={!!joke}
                transition={Transition}
                onEnter={()=>this.setJoke(joke)}
                onExited={()=>this.setJoke(undefined)}
            >

                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={onRequestClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            Edit
                        </Typography>
                        <Button color="inherit" disabled={!this.state.edited} onClick={()=>this.onSave()}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                {this.renderContent()}
            </Dialog>
        );
    }
}

export default withStyles(styles)(EditModal);