import React, { Component } from 'react';
import './Joke.css';


export default class Joke extends Component {

    render() {
        const {joke}=this.props;
        return (<div className="Joke">
                {joke.data.text}
            </div>);
    }
}