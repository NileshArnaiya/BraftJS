import React, { Component } from 'react';
import Results from './Results';

import { Button, Form, FormControl } from 'react-bootstrap'

class Define extends Component{
    constructor(props){
        super(props);
        const { URL } = this.props;
        this.state = {
            word: '',
            def: null
        }
    }

    fetchAPI(){
        fetch(this.getApiUrl())
            .then( resp => resp.json() )
            .then( resp => {
                this.setState({ def: resp });
                console.log(resp);
            })
            .catch( err => ( console.log('something went wrong... ' + err) ) 
            )
    }

    getApiUrl(){
        console.log(this.props.URL + '/' + this.state.word + '?format=json');
        return this.props.URL + '/' + this.state.word + '?format=json' ; 
    }

    handleSubmit(event){
        event.preventDefault();
        this.fetchAPI();
    }

    render(){
        return(

            <div className="dict">
            <form className='form' onSubmit={this.handleSubmit.bind(this)}>
            {/* <input type='submit' value='Go.' /> */}

                    <Form inline>
                    <FormControl type="text" placeholder="Search a word" className="mr-sm-2"
                        value={this.state.word}
                        onChange={(e) => this.setState({ word: e.target.value })}
                    
                    />
                    <Button variant="outline-success" onClick={this.fetchAPI.bind(this)} >Search Dictionary</Button>
                </Form>

                <Results def={this.state.def} />

            </form>
            </div>
        );
    }
}

export default Define;
