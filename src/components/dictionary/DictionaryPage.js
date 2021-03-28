import React, { Component } from 'react';
import './../../App.css';
import 'whatwg-fetch';
import Define from './Define';

const URL = 'https://cors-anywhere.herokuapp.com/https://owlbot.info/api/v2/dictionary';

class DictionaryPage extends Component {
    render() {
        return (
            <div className="App">
                <h5 className="dict_header" ></h5>
                <Define URL = {URL}/>
            </div>
        );
    }
}

export default DictionaryPage;