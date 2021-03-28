import React, { Component } from 'react';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import './App.css';

class App extends Component {

  state = {
    editorState: null
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState })
  }
  render() {

    return (
      <div className="container">

      

      </div>

    )
  }
}

export default App;
