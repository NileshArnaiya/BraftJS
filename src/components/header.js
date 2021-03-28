import React, { Component } from 'react';
import logo from './../logo.png';
import Editor from 'braft-editor'
import 'braft-editor/dist/index.css'
import './../App.css';
import 'braft-extensions/dist/table.css';
import Table from 'braft-extensions/dist/table';
import { EditorState, ContentState } from 'draft-js';
import swal from 'sweetalert2';
import { RichUtils, convertToRaw, convertFromRaw, convertFromHTML, KeyBindingUtil, getDefaultKeyBinding } from 'draft-js';
import { Entity, Modifier, genKey, ContentBlock, SelectionState, NestedUtils, DefaultBlockRenderMap } from 'draft-js';
import { CompositeDecorator } from 'draft-js';
import DictionaryPage from './dictionary/DictionaryPage';
import firebase from 'firebase';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Keyboard from 'react-simple-keyboard';
import Draggable from 'react-draggable';
import 'simple-keyboard/build/css/index.css';
import htmlDocx from 'html-docx-js/dist/html-docx';
import layout from "simple-keyboard-layouts/build/layouts/hindi";
import accounticon from './../accounticon.jpg';
import mic from './../mic.png';
import keyboard from './../keyboard.png';
import translate from './../translate.png';

//import * as jsPDF from 'jspdf'
var FileSaver = require('file-saver');

const URL = 'https://cors-anywhere.herokuapp.com/https://owlbot.info/api/v2/dictionary';

const config = {
    apiKey: "AIzaSyA0NSD-B-BhGax2KUgKUpgmyCwACbfr33A",
    authDomain: "gnani-editor.firebaseapp.com",
    databaseURL: "https://gnani-editor.firebaseio.com",
    projectId: "gnani-editor",
    storageBucket: "gnani-editor.appspot.com",
    messagingSenderId: "835120974623"
};
firebase.initializeApp(config)

Editor.use(Table({
    includeEditors: ['editor-with-table'],
    defaultColumns: 5,
    defaultRows: 4
}))

var elem = document.body;



export default class MyCustomHeader extends React.Component {

    constructor(props) {
        super(props);


        this.state = {
            editorState: EditorState.createEmpty(),
            currentValue: 0,
            isToggled: false,
            input: ""

        };
        this.selectedLanguage = "english";

        this.onEditorStateChange = editorState => {
            //this.props.setDownloadState(convertToRaw(this.state.editorState.getCurrentContent()));
            this.setState({ editorState });
        };
    }
    componentDidMount() {
        let displayedNote = this.props.displayedNote

        if (typeof displayedNote == "object") {
            let rawContentFromFile = displayedNote
            this.setState({
                editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.displayedNote.content)), this.decorator())
            })
        } else {
            this.setState({
                noteTitle: "",
                editorState: EditorState.createEmpty(this.decorator())
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.displayedNote != this.props.displayedNote) {
            let displayedNote = this.props.displayedNote
            if (typeof displayedNote == "object") {
                let rawContentFromFile = displayedNote
                let persistedTitle = displayedNote.title
                this.setState({
                    editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.displayedNote.content))),
                    noteTitle: persistedTitle
                })
            } else {
                this.setState({
                    noteTitle: "",
                    editorState: EditorState.createEmpty()
                })

            }
        }
    }


    submitEditor = () => {
        let displayedNote = this.props.displayedNote
        let contentState = this.state.editorState.getCurrentContent()
        let note = { title: this.state.noteTitle, content: convertToRaw(contentState) }
        // if (this.state.noteTitle == "" || (note.content.blocks.length <= 1 && note.content.blocks[0].depth === 0 && note.content.blocks[0].text == "")) {
        //   alert("Note cannot be saved if title or content is blank")
        // } else {
        note["content"] = JSON.stringify(note.content)
        this.setState({
            noteTitle: "",
            editorState: EditorState.createEmpty()
        }, () => displayedNote == "new" ? this.props.createNote(note.title, note.content) : this.props.updateNote(displayedNote.id, note.title, note.content))
        // }
    }

    keyBindingFn = (event) => {
        var style = this.selectedLanguage;

        var e = document.getElementById("languages");
        var strUser = e.options[e.selectedIndex].value;
        if (event.keyCode === 13) { return '\n' }
        if (style == "kannada" || strUser=="kannada") {

            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 49) { return '೧'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 50) { return '೨'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 51) { return '೩'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 52) { return '೪'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 53) { return '೫'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 54) { return '೬'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 55) { return '೭'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 56) { return '೮'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 57) { return '೯'; }


            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 65) { return 'ಓ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 66) { return ''; } //b
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 67) { return 'ಣ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 68) { return 'ಅ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 69) { return 'ಆ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 70) { return 'ಇ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 71) { return 'ಉ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 72) { return 'ಫ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 73) { return 'ಘ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 74) { return 'ಱ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 75) { return 'ಖ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 76) { return 'ಥ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 77) { return 'ಶ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 78) { return 'ಳ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 79) { return 'ಧ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 80) { return 'ಝ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 81) { return 'ಔ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 82) { return 'ಈ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 83) { return 'ಏ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 84) { return 'ಊ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 85) { return 'ಙ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 86) { return 'ಔ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 87) { return 'ಐ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 88) { return ''; } //x
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 89) { return 'ಭ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 90) { return 'ಎ'; }


            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 189) { return 'ಃ'; }
            if (KeyBindingUtil.isOptionKeyCommand(event) && event.keyCode === 187) { return 'ಋ'; }

            if (event.keyCode === 65) { return 'ೋ'; }
            if (event.keyCode === 66) { return 'ವ'; }
            if (event.keyCode === 67) { return 'ಮ'; }
            if (event.keyCode === 68) { return '್'; }
            if (event.keyCode === 69) { return 'ಾ'; }
            if (event.keyCode === 70) { return 'ಿ'; }
            if (event.keyCode === 71) { return 'ು'; }
            if (event.keyCode === 72) { return 'ಗ'; }
            if (event.keyCode === 73) { return 'ರ'; }
            if (event.keyCode === 74) { return 'ಕ'; }
            if (event.keyCode === 75) { return 'ತ'; }
            if (event.keyCode === 76) { return 'ಸ'; }
            if (event.keyCode === 77) { return 'ಲ'; }
            if (event.keyCode === 78) { return 'ದ'; }
            if (event.keyCode === 79) { return 'ಜ'; }
            if (event.keyCode === 80) { return 'ೌ'; }
            if (event.keyCode === 81) { return 'ೀ'; }
            if (event.keyCode === 82) { return 'ೇ'; }
            if (event.keyCode === 83) { return 'ೂ'; }
            if (event.keyCode === 84) { return 'ಹ'; }
            if (event.keyCode === 85) { return 'ನ'; }
            if (event.keyCode === 86) { return 'ೈ'; }
            if (event.keyCode === 87) { return 'ಂ'; }
            if (event.keyCode === 88) { return 'ಬ'; }
            if (event.keyCode === 89) { return 'ೆ'; }
            if (event.keyCode === 90) { return 'ॆ'; }


            if (event.keyCode === 189) { if (event.nativeEvent.shiftKey) return 'ಃ'; } // -
            if (event.keyCode === 187) { if (event.nativeEvent.shiftKey) return 'ಋ'; else return 'ೃ'; } // +
            if (event.nativeEvent.shiftKey && event.keyCode === 188) { return 'ಷ'; }
            if (event.keyCode === 186) { if (event.nativeEvent.shiftKey) return 'ಛ'; else return 'ಚ'; } // ;
            if (event.keyCode === 191) { return 'ಯ'; }
            if (event.keyCode === 192) { if (event.nativeEvent.shiftKey) return 'ಒ'; else return 'ೊ'; }
            if (event.keyCode === 219) { if (event.nativeEvent.shiftKey) return 'ಢ'; else return 'ಡ'; }
            if (event.keyCode === 220) { return 'ॉ'; }
            if (event.keyCode === 221 && event.nativeEvent.shiftKey) { return 'ಞ'; }
            if (event.keyCode === 222) { if (event.nativeEvent.shiftKey) return 'ಠ'; else return 'ಟ'; }

            return getDefaultKeyBinding(event)

        }
        else if (style == "nudi" || strUser == "nudi") {

            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 49) { return '೧'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 50) { return '೨'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 51) { return '೩'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 52) { return '೪'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 53) { return '೫'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 54) { return '೬'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 55) { return '೭'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 56) { return '೮'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 57) { return '೯'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 114) { return 'ಱ'; }
            if (KeyBindingUtil.isCtrlKeyCommand(event) && event.keyCode === 108) { return 'ೞ'; }


            if (event.keyCode === 16 && event.keyCode === 65) { return 'ಆ'; }
            if (event.keyCode === 16 && event.keyCode === 66) { return 'ಭ'; }
            if (event.keyCode === 16 && event.keyCode === 67) { return 'ಛ'; }
            if (event.keyCode === 16 && event.keyCode === 68) { return 'ಧ'; }
            if (event.keyCode === 16 && event.keyCode === 69) { return 'ಏ'; }
            if (event.keyCode === 16 && event.keyCode === 71) { return 'ಘ'; }
            if (event.keyCode === 16 && event.keyCode === 72) { return 'ಃ'; }
            if (event.keyCode === 16 && event.keyCode === 73) { return 'ಈ'; }
            if (event.keyCode === 16 && event.keyCode === 74) { return 'ಝ'; }
            if (event.keyCode === 16 && event.keyCode === 75) { return 'ಖ'; }
            if (event.keyCode === 16 && event.keyCode === 76) { return 'ಳ'; }
            if (event.keyCode === 16 && event.keyCode === 77) { return 'ಂ'; }
            if (event.keyCode === 16 && event.keyCode === 78) { return 'ಣ'; }
            if (event.keyCode === 16 && event.keyCode === 79) { return 'ಓ'; }
            if (event.keyCode === 16 && event.keyCode === 80) { return 'ಫ'; }
            if (event.keyCode === 16 && event.keyCode === 81) { return 'ಠ'; }
            if (event.keyCode === 16 && event.keyCode === 82) { return 'ಋ'; }
            if (event.keyCode === 16 && event.keyCode === 83) { return 'ಷ'; }
            if (event.keyCode === 16 && event.keyCode === 84) { return 'ಥ'; }
            if (event.keyCode === 16 && event.keyCode === 85) { return 'ಊ'; }
            if (event.keyCode === 16 && event.keyCode === 86) { return 'ಔ'; }
            if (event.keyCode === 16 && event.keyCode === 87) { return 'ಢ'; }
            if (event.keyCode === 16 && event.keyCode === 88) { return '಼'; }
            if (event.keyCode === 16 && event.keyCode === 89) { return 'ಐ'; }
            if (event.keyCode === 16 && event.keyCode === 90) { return 'ಙ'; }


            if (event.keyCode === 65) { return 'ಅ'; }
            if (event.keyCode === 66) { return 'ಬ'; }
            if (event.keyCode === 67) { return 'ಚ'; }
            if (event.keyCode === 68) { return 'ದ'; }
            if (event.keyCode === 69) { return 'ಎ'; }
            if (event.keyCode === 70) { return 'ಔ'; }
            if (event.keyCode === 71) { return 'ಗ'; }
            if (event.keyCode === 72) { return 'ಹ'; }
            if (event.keyCode === 73) { return 'ಇ'; }
            if (event.keyCode === 74) { return 'ಜ'; }
            if (event.keyCode === 75) { return 'ಕ'; }
            if (event.keyCode === 76) { return 'ಲ'; }
            if (event.keyCode === 77) { return 'ಮ'; }
            if (event.keyCode === 78) { return 'ನ'; }
            if (event.keyCode === 79) { return 'ಒ'; }
            if (event.keyCode === 80) { return 'ಪ'; }
            if (event.keyCode === 81) { return 'ಟ'; }
            if (event.keyCode === 82) { return 'ರ'; }
            if (event.keyCode === 83) { return 'ಸ'; }
            if (event.keyCode === 84) { return 'ತ'; }
            if (event.keyCode === 85) { return 'ಉ'; }
            if (event.keyCode === 86) { return 'ವ'; }
            if (event.keyCode === 87) { return 'ಡ'; }
            if (event.keyCode === 88) { return 'ಶ'; }
            if (event.keyCode === 89) { return 'ಯ'; }
            if (event.keyCode === 90) { return 'ಞ'; }

            if (event.keyCode === 186) { return 'च'; }
            if (event.keyCode === 187) { return 'ृ'; }
            if (event.keyCode === 191) { return 'य'; }
            if (event.keyCode === 192) { return 'ॊ'; }
            if (event.keyCode === 219) { return 'ड'; }
            if (event.keyCode === 220) { return 'ॉ'; }
            if (event.keyCode === 221) { return '़'; }
            if (event.keyCode === 222) { return 'ट'; }

            return getDefaultKeyBinding(event);

        }
        else if (style == "hindi" || strUser == "hindi") {

            if (event.keyCode === 50) { return 'ॅ'; }
            if (event.keyCode === 51) { return '्र'; }
            if (event.keyCode === 52) { return 'र्'; }
            if (event.keyCode === 49) { return 'ऍ'; }
            if (event.keyCode === 53) { return 'ज्ञ'; }
            if (event.keyCode === 54) { return 'त्र'; }
            if (event.keyCode === 55) { return 'क्ष'; }
            if (event.keyCode === 56) { return 'श्र'; }

            if (event.keyCode === 189) { if (event.nativeEvent.shiftKey) return 'ः'; } // -
            if (event.keyCode === 187) { if (event.nativeEvent.shiftKey) return 'ऋ'; } // +

            if (event.nativeEvent.shiftKey && event.keyCode === 190) { return '।'; } // .
            if (event.nativeEvent.shiftKey && event.keyCode === 188) { return 'ष'; } // ,

            if (event.nativeEvent.shiftKey && event.keyCode === 65) { return 'ओ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 66) { return 'ऴ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 67) { return 'ण'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 68) { return 'अ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 69) { return 'आ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 70) { return 'इ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 71) { return 'उ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 72) { return 'फ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 73) { return 'घ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 74) { return 'ऱ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 75) { return 'ख'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 76) { return 'थ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 77) { return 'श'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 78) { return 'ळ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 79) { return 'ध'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 80) { return 'झ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 81) { return 'औ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 82) { return 'ई'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 83) { return 'ए'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 84) { return 'ऊ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 85) { return 'ङ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 86) { return 'ऩ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 87) { return 'ऐ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 88) { return 'ँ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 89) { return 'भ'; }
            if (event.nativeEvent.shiftKey && event.keyCode === 90) { return 'ऎ'; }


            if (event.keyCode === 65) { return 'ो'; } // a
            if (event.keyCode === 66) { return 'व'; }
            if (event.keyCode === 67) { return 'म'; }
            if (event.keyCode === 68) { return '्'; }
            if (event.keyCode === 69) { return 'ा'; }
            if (event.keyCode === 70) { return 'ि'; }
            if (event.keyCode === 71) { return 'ु'; }
            if (event.keyCode === 72) { return 'प'; }
            if (event.keyCode === 73) { return 'ग'; }
            if (event.keyCode === 74) { return 'र'; }
            if (event.keyCode === 75) { return 'क'; }
            if (event.keyCode === 76) { return 'त'; }
            if (event.keyCode === 77) { return 'स'; }
            if (event.keyCode === 78) { return 'ल'; }
            if (event.keyCode === 79) { return 'द'; }
            if (event.keyCode === 80) { return 'ज'; }
            if (event.keyCode === 81) { return 'ौ'; }
            if (event.keyCode === 82) { return 'ी'; }
            if (event.keyCode === 83) { return ' े '; }
            if (event.keyCode === 84) { return 'ू'; }
            if (event.keyCode === 85) { return 'ह'; }
            if (event.keyCode === 86) { return 'न'; }
            if (event.keyCode === 87) { return 'ै'; }
            if (event.keyCode === 88) { return 'ं'; }
            if (event.keyCode === 89) { return 'ब'; }
            if (event.keyCode === 90) { return 'ॆ'; } // z

            if (event.keyCode === 186) { return 'च'; } // ;
            if (event.keyCode === 187) { return 'ृ'; } //
            if (event.keyCode === 191) { if (event.nativeEvent.shiftKey) return 'य़'; else return 'य'; } //   '/'
            if (event.keyCode === 192) { return 'ॊ'; } // ~
            if (event.keyCode === 219) { return 'ड'; } // [
            if (event.keyCode === 220) { return 'ॉ'; } // \
            if (event.keyCode === 221) { return '़'; } // ]
            if (event.keyCode === 222) { return 'ट'; } // '

            return getDefaultKeyBinding(event);
        }

        else if (style == "telugu" || strUser == "telugu") {

            // with shift key
            if (event.keyCode === 187) { if (event.nativeEvent.shiftKey) return 'ఋ'; }
            if (event.keyCode === 189) { if (event.nativeEvent.shiftKey) return ' ః'; }

            if (event.keyCode === 51) { if (event.nativeEvent.shiftKey) return '్ర'; }
            if (event.keyCode === 52) { if (event.nativeEvent.shiftKey) return 'ర్'; }
            if (event.keyCode === 53) { if (event.nativeEvent.shiftKey) return 'జ్ఞ'; }
            if (event.keyCode === 54) { if (event.nativeEvent.shiftKey) return 'త్ర'; }
            if (event.keyCode === 55) { if (event.nativeEvent.shiftKey) return 'క్ష'; }
            if (event.keyCode === 56) { if (event.nativeEvent.shiftKey) return 'శ్ర'; }

            if (event.keyCode === 65) { if (event.nativeEvent.shiftKey) return 'ఓ'; }
            if (event.keyCode === 66) { if (event.nativeEvent.shiftKey) return ''; } //b
            if (event.keyCode === 67) { if (event.nativeEvent.shiftKey) return 'ణ'; }
            if (event.keyCode === 68) { if (event.nativeEvent.shiftKey) return 'అ'; }
            if (event.keyCode === 69) { if (event.nativeEvent.shiftKey) return 'ఆ'; }
            if (event.keyCode === 70) { if (event.nativeEvent.shiftKey) return 'ఇ'; }
            if (event.keyCode === 71) { if (event.nativeEvent.shiftKey) return 'ఉ'; }
            if (event.keyCode === 72) { if (event.nativeEvent.shiftKey) return 'ఫ'; }
            if (event.keyCode === 73) { if (event.nativeEvent.shiftKey) return 'ఘ'; }
            if (event.keyCode === 74) { if (event.nativeEvent.shiftKey) return 'ఱ'; }
            if (event.keyCode === 75) { if (event.nativeEvent.shiftKey) return 'ఖ'; }
            if (event.keyCode === 76) { if (event.nativeEvent.shiftKey) return 'థ'; }
            if (event.keyCode === 77) { if (event.nativeEvent.shiftKey) return 'శ'; }
            if (event.keyCode === 78) { if (event.nativeEvent.shiftKey) return 'ళ'; }
            if (event.keyCode === 79) { if (event.nativeEvent.shiftKey) return 'ధ'; }
            if (event.keyCode === 80) { if (event.nativeEvent.shiftKey) return 'ఝ'; }
            if (event.keyCode === 81) { if (event.nativeEvent.shiftKey) return 'ఔ'; }
            if (event.keyCode === 82) { if (event.nativeEvent.shiftKey) return 'ఈ'; }
            if (event.keyCode === 83) { if (event.nativeEvent.shiftKey) return 'ఏ'; }
            if (event.keyCode === 84) { if (event.nativeEvent.shiftKey) return 'ఊ'; }
            if (event.keyCode === 85) { if (event.nativeEvent.shiftKey) return 'ఙ'; }
            if (event.keyCode === 86) { if (event.nativeEvent.shiftKey) return ''; }    //v
            if (event.keyCode === 87) { if (event.nativeEvent.shiftKey) return 'ఐ'; }
            if (event.keyCode === 88) { if (event.nativeEvent.shiftKey) return ' ఁ'; }
            if (event.keyCode === 89) { if (event.nativeEvent.shiftKey) return 'భ'; }
            if (event.keyCode === 90) { if (event.nativeEvent.shiftKey) return 'ఎ'; }


            // without shift
            if (event.keyCode === 65) { return 'ో'; }
            if (event.keyCode === 66) { return 'వ'; }
            if (event.keyCode === 67) { return 'మ'; }
            if (event.keyCode === 68) { return '్'; }
            if (event.keyCode === 69) { return 'ా'; }
            if (event.keyCode === 70) { return 'ి'; }
            if (event.keyCode === 71) { return 'ు'; }
            if (event.keyCode === 72) { return 'ప'; }
            if (event.keyCode === 73) { return 'గ'; }
            if (event.keyCode === 74) { return 'ర'; }
            if (event.keyCode === 75) { return 'క'; }
            if (event.keyCode === 76) { return 'త'; }
            if (event.keyCode === 77) { return 'స'; }
            if (event.keyCode === 78) { return 'ల'; }
            if (event.keyCode === 79) { return 'ద'; }
            if (event.keyCode === 80) { return 'జ'; }
            if (event.keyCode === 81) { return '  ౌ'; }
            if (event.keyCode === 82) { return ' ీ'; }
            if (event.keyCode === 83) { return ' ే'; }
            if (event.keyCode === 84) { return ' ూ'; }
            if (event.keyCode === 85) { return 'హ'; }
            if (event.keyCode === 86) { return 'న'; }
            if (event.keyCode === 87) { return ' ై'; }
            if (event.keyCode === 88) { return ' ం'; }
            if (event.keyCode === 89) { return 'బ'; }
            if (event.keyCode === 90) { return ' ె '; }


            if (event.keyCode === 187) { return 'ృ'; }
            if (event.keyCode === 191) { return 'య'; }
            if (event.keyCode === 192) { if (event.nativeEvent.shiftKey) return 'ఒ'; else return 'ొ'; }

            // if (event.keyCode === 219) { return 'ड'; }
            // if (event.keyCode === 220) { return 'ॉ'; }
            // if (event.keyCode === 221) { return '़'; }
            // if (event.keyCode === 222) { return 'ट'; }
            return getDefaultKeyBinding(event);
        }

        else if (style == "tamil(inscript)" || strUser == "tamil") {
            // with shift key
            if (event.keyCode === 186) { return 'ச'; }
            if (event.keyCode === 187) { if (event.nativeEvent.shiftKey) return '஋'; }
            if (event.keyCode === 189) { if (event.nativeEvent.shiftKey) return 'ஃ'; }
            if (event.keyCode === 188) { if (event.nativeEvent.shiftKey) return 'ஷ'; }


            if (event.keyCode === 51) { if (event.nativeEvent.shiftKey) return '்ர'; }
            if (event.keyCode === 52) { if (event.nativeEvent.shiftKey) return 'ர்'; }
            if (event.keyCode === 53) { if (event.nativeEvent.shiftKey) return 'ஜ்ஞ'; }
            if (event.keyCode === 54) { if (event.nativeEvent.shiftKey) return 'த்ர'; }
            if (event.keyCode === 55) { if (event.nativeEvent.shiftKey) return 'க்'; }
            if (event.keyCode === 56) { if (event.nativeEvent.shiftKey) return 'ஶ்ர '; }

            if (event.keyCode === 65) { if (event.nativeEvent.shiftKey) return 'ஓ'; }
            if (event.keyCode === 66) { if (event.nativeEvent.shiftKey) return 'ழ'; } //b
            if (event.keyCode === 67) { if (event.nativeEvent.shiftKey) return 'ண'; }
            if (event.keyCode === 68) { if (event.nativeEvent.shiftKey) return 'அ'; }
            if (event.keyCode === 69) { if (event.nativeEvent.shiftKey) return 'ஆ'; }
            if (event.keyCode === 70) { if (event.nativeEvent.shiftKey) return 'இ'; }
            if (event.keyCode === 71) { if (event.nativeEvent.shiftKey) return 'உ'; }

            if (event.keyCode === 74) { if (event.nativeEvent.shiftKey) return 'ற'; }

            if (event.keyCode === 77) { if (event.nativeEvent.shiftKey) return 'ஶ'; }
            if (event.keyCode === 78) { if (event.nativeEvent.shiftKey) return 'ள'; }
            if (event.keyCode === 81) { if (event.nativeEvent.shiftKey) return 'ஔ'; }
            if (event.keyCode === 82) { if (event.nativeEvent.shiftKey) return 'ஈ'; }
            if (event.keyCode === 83) { if (event.nativeEvent.shiftKey) return 'ஏ'; }
            if (event.keyCode === 84) { if (event.nativeEvent.shiftKey) return 'ஊ'; }
            if (event.keyCode === 85) { if (event.nativeEvent.shiftKey) return 'ங'; }
            if (event.keyCode === 86) { if (event.nativeEvent.shiftKey) return 'ன'; }
            if (event.keyCode === 87) { if (event.nativeEvent.shiftKey) return 'ஐ'; }
            if (event.keyCode === 90) { if (event.nativeEvent.shiftKey) return 'எ'; }


            // without shift
            if (event.keyCode === 65) { return 'ோ'; }
            if (event.keyCode === 66) { return 'வ'; }
            if (event.keyCode === 67) { return 'ம'; }
            if (event.keyCode === 68) { return ' ்'; }
            if (event.keyCode === 69) { return ' ா'; }
            if (event.keyCode === 70) { return ' ி'; }
            if (event.keyCode === 71) { return ' ு'; }
            if (event.keyCode === 72) { return 'ப'; }
            if (event.keyCode === 73) { return ''; }
            if (event.keyCode === 74) { return 'ர'; }
            if (event.keyCode === 75) { return 'க'; }
            if (event.keyCode === 76) { return 'த'; }
            if (event.keyCode === 77) { return 'ஸ'; }
            if (event.keyCode === 78) { return 'ல'; }
            if (event.keyCode === 79) { return ''; }
            if (event.keyCode === 80) { return 'ஜ'; }
            if (event.keyCode === 81) { return ' ௌ'; }
            if (event.keyCode === 82) { return ' ீ'; }
            if (event.keyCode === 83) { return ' ே'; }
            if (event.keyCode === 84) { return 'ூ '; }
            if (event.keyCode === 85) { return 'ஹ'; }
            if (event.keyCode === 86) { return 'ந'; }
            if (event.keyCode === 87) { return ' ை'; }
            if (event.keyCode === 88) { return 'ஂ'; }
            if (event.keyCode === 89) { return ''; } // y
            if (event.keyCode === 90) { return ' ெ'; }

            if (event.keyCode === 191) { if (event.nativeEvent.shiftKey) return ','; else return 'ய'; }
            if (event.keyCode === 192) { if (event.nativeEvent.shiftKey) return 'ஒ'; else return 'ொ'; }

            if (event.nativeEvent.shiftKey && event.keyCode === 221) { return 'ஞ'; }
            if (event.keyCode === 222) { return 'ட'; }

            return getDefaultKeyBinding(event);

        }

        else if (style == "tamil(type-writer)") {

            // with shift key

            if (event.keyCode === 186) { return '்'; }
            if (event.keyCode === 187) { if (event.nativeEvent.shiftKey) return '஋'; }
            if (event.keyCode === 189) { if (event.nativeEvent.shiftKey) return 'ஸ்ரீ'; }
            if (event.keyCode === 188) { if (event.nativeEvent.shiftKey) return 'ஈ'; else return 'இ'; }


            if (event.keyCode === 49) { if (event.nativeEvent.shiftKey) return 'ஸ'; }
            if (event.keyCode === 52) { if (event.nativeEvent.shiftKey) return 'ஜ'; }
            if (event.keyCode === 53) { if (event.nativeEvent.shiftKey) return 'ஶ'; }
            if (event.keyCode === 54) { if (event.nativeEvent.shiftKey) return 'ஷ'; }
            if (event.keyCode === 55) { if (event.nativeEvent.shiftKey) return 'க்'; }
            if (event.keyCode === 56) { if (event.nativeEvent.shiftKey) return 'ஶ்ர '; }

            if (event.keyCode === 65) { if (event.nativeEvent.shiftKey) return ''; }
            if (event.keyCode === 66) { if (event.nativeEvent.shiftKey) return 'க்'; } //b
            if (event.keyCode === 67) { if (event.nativeEvent.shiftKey) return 'ஊ'; }
            if (event.keyCode === 68) { if (event.nativeEvent.shiftKey) return 'னு'; }
            if (event.keyCode === 69) { if (event.nativeEvent.shiftKey) return 'நு'; }
            if (event.keyCode === 70) { if (event.nativeEvent.shiftKey) return 'கு'; }
            if (event.keyCode === 71) { if (event.nativeEvent.shiftKey) return 'ழு'; }

            if (event.keyCode === 72) { if (event.nativeEvent.shiftKey) return 'ழ'; }
            if (event.keyCode === 73) { if (event.nativeEvent.shiftKey) return 'ஐ'; }

            if (event.keyCode === 74) { if (event.nativeEvent.shiftKey) return 'து'; }
            if (event.keyCode === 75) { if (event.nativeEvent.shiftKey) return 'மு'; }
            if (event.keyCode === 76) { if (event.nativeEvent.shiftKey) return 'டு'; }
            if (event.keyCode === 77) { if (event.nativeEvent.shiftKey) return 'ஆ'; }
            if (event.keyCode === 78) { if (event.nativeEvent.shiftKey) return 'சூ'; }
            if (event.keyCode === 79) { if (event.nativeEvent.shiftKey) return 'டீ'; }
            if (event.keyCode === 80) { if (event.nativeEvent.shiftKey) return ' ீ'; }

            if (event.keyCode === 82) { if (event.nativeEvent.shiftKey) return 'சு'; }
            if (event.keyCode === 83) { if (event.nativeEvent.shiftKey) return 'ளு'; }
            if (event.keyCode === 84) { if (event.nativeEvent.shiftKey) return 'கூ'; }
            if (event.keyCode === 85) { if (event.nativeEvent.shiftKey) return 'ரு'; }
            if (event.keyCode === 86) { if (event.nativeEvent.shiftKey) return 'ஏ'; }
            if (event.keyCode === 87) { if (event.nativeEvent.shiftKey) return 'று'; }
            if (event.keyCode === 88) { if (event.nativeEvent.shiftKey) return 'ஓ'; }
            if (event.keyCode === 89) { if (event.nativeEvent.shiftKey) return 'லு'; }
            if (event.keyCode === 90) { if (event.nativeEvent.shiftKey) return 'ஷ'; }


            // without shift
            if (event.keyCode === 65) { return 'ய'; }
            if (event.keyCode === 66) { return ' ெ'; }
            if (event.keyCode === 67) { return 'உ'; }
            if (event.keyCode === 68) { return ' ்ன'; }
            if (event.keyCode === 69) { return 'ந'; }
            if (event.keyCode === 70) { return 'க'; }
            if (event.keyCode === 71) { return 'ப'; }
            if (event.keyCode === 72) { return ' ா'; }
            if (event.keyCode === 73) { return ' ை'; }
            if (event.keyCode === 74) { return 'த'; }
            if (event.keyCode === 75) { return 'ம'; }
            if (event.keyCode === 76) { return 'ட'; }
            if (event.keyCode === 77) { return 'அ'; }
            if (event.keyCode === 78) { return ' ே'; }
            if (event.keyCode === 79) { return 'டி'; }
            if (event.keyCode === 80) { return ' ி'; }
            if (event.keyCode === 81) { return 'ணு'; }
            if (event.keyCode === 82) { return 'ச'; }
            if (event.keyCode === 83) { return 'ள'; }
            if (event.keyCode === 84) { return 'வ'; }
            if (event.keyCode === 85) { return 'ர'; }
            if (event.keyCode === 86) { return 'எ'; }
            if (event.keyCode === 87) { return 'ற'; }
            if (event.keyCode === 88) { return 'ஒ'; }
            if (event.keyCode === 89) { return 'ல'; } // y
            if (event.keyCode === 90) { return 'ண'; }

            if (event.keyCode === 191) { if (event.nativeEvent.shiftKey) return ','; else return 'ய'; }
            if (event.keyCode === 192) { if (event.nativeEvent.shiftKey) return 'ஒ'; else return 'ொ'; }

            if (event.keyCode === 221) { if (event.nativeEvent.shiftKey) return ' ௌ'; else return 'ஹ'; }
            if (event.keyCode === 222) { if (event.nativeEvent.shiftKey) return 'ஞ'; else return 'ங'; }

            if (event.keyCode === 219) { if (event.nativeEvent.shiftKey) return 'ூ'; else return 'ு'; }
            return getDefaultKeyBinding(event);

        }

        else if (style == "gujarati" || strUser == "gujarati") {

            // with shift key
            if (event.keyCode === 187) { if (event.nativeEvent.shiftKey) return 'ઋ'; else return 'ૃ' }
            if (event.keyCode === 188 && event.nativeEvent.shiftKey) return 'ષ';

            if (event.keyCode === 186) { if (event.nativeEvent.shiftKey) return 'છ'; else return 'ચ' }


            if (event.keyCode === 189) { if (event.nativeEvent.shiftKey) return 'ઃ'; }

            if (event.keyCode === 51) { if (event.nativeEvent.shiftKey) return '్ర'; }
            if (event.keyCode === 52) { if (event.nativeEvent.shiftKey) return 'ర్'; }
            if (event.keyCode === 53) { if (event.nativeEvent.shiftKey) return 'జ్ఞ'; }
            if (event.keyCode === 54) { if (event.nativeEvent.shiftKey) return 'త్ర'; }
            if (event.keyCode === 55) { if (event.nativeEvent.shiftKey) return 'క్ష'; }
            if (event.keyCode === 56) { if (event.nativeEvent.shiftKey) return 'శ్ర'; }

            if (event.keyCode === 65) { if (event.nativeEvent.shiftKey) return 'ઓ'; }
            if (event.keyCode === 66) { if (event.nativeEvent.shiftKey) return ''; } //b
            if (event.keyCode === 67) { if (event.nativeEvent.shiftKey) return 'ણ'; }
            if (event.keyCode === 68) { if (event.nativeEvent.shiftKey) return 'અ'; }
            if (event.keyCode === 69) { if (event.nativeEvent.shiftKey) return 'આ'; }
            if (event.keyCode === 70) { if (event.nativeEvent.shiftKey) return 'ઇ'; }
            if (event.keyCode === 71) { if (event.nativeEvent.shiftKey) return 'ઉ'; }
            if (event.keyCode === 72) { if (event.nativeEvent.shiftKey) return 'ફ'; }
            if (event.keyCode === 73) { if (event.nativeEvent.shiftKey) return 'ઘ'; }
            if (event.keyCode === 74) { if (event.nativeEvent.shiftKey) return 'j'; }
            if (event.keyCode === 75) { if (event.nativeEvent.shiftKey) return 'ખ'; }
            if (event.keyCode === 76) { if (event.nativeEvent.shiftKey) return 'થ'; }
            if (event.keyCode === 77) { if (event.nativeEvent.shiftKey) return 'શ'; }
            if (event.keyCode === 78) { if (event.nativeEvent.shiftKey) return 'ળ'; }
            if (event.keyCode === 79) { if (event.nativeEvent.shiftKey) return 'ધ'; }
            if (event.keyCode === 80) { if (event.nativeEvent.shiftKey) return 'ઝ'; }
            if (event.keyCode === 81) { if (event.nativeEvent.shiftKey) return 'ઔ'; }
            if (event.keyCode === 82) { if (event.nativeEvent.shiftKey) return 'ઈ'; }
            if (event.keyCode === 83) { if (event.nativeEvent.shiftKey) return 'એ'; }
            if (event.keyCode === 84) { if (event.nativeEvent.shiftKey) return 'ઊ'; }
            if (event.keyCode === 85) { if (event.nativeEvent.shiftKey) return 'ઙ'; }
            if (event.keyCode === 86) { if (event.nativeEvent.shiftKey) return ''; }    //v
            if (event.keyCode === 87) { if (event.nativeEvent.shiftKey) return 'ઐ'; }
            if (event.keyCode === 88) { if (event.nativeEvent.shiftKey) return ' ઁ'; }
            if (event.keyCode === 89) { if (event.nativeEvent.shiftKey) return 'ભ'; }
            if (event.keyCode === 90) { if (event.nativeEvent.shiftKey) return ''; } //z


            // without shift
            if (event.keyCode === 65) { return 'ો'; }
            if (event.keyCode === 66) { return 'વ'; }
            if (event.keyCode === 67) { return 'મ'; }
            if (event.keyCode === 68) { return ' ્'; }
            if (event.keyCode === 69) { return ' ા'; }
            if (event.keyCode === 70) { return ' િ'; }
            if (event.keyCode === 71) { return ' ુ'; }
            if (event.keyCode === 72) { return 'પ'; }
            if (event.keyCode === 73) { return 'ગ'; }
            if (event.keyCode === 74) { return 'ર'; }
            if (event.keyCode === 75) { return 'ક'; }
            if (event.keyCode === 76) { return 'ત'; }
            if (event.keyCode === 77) { return 'સ'; }
            if (event.keyCode === 78) { return 'લ'; }
            if (event.keyCode === 79) { return 'દ'; }
            if (event.keyCode === 80) { return 'જ'; }
            if (event.keyCode === 81) { return ' ૌ'; }
            if (event.keyCode === 82) { return ' ી'; }
            if (event.keyCode === 83) { return ' ે'; }
            if (event.keyCode === 84) { return ' ૂ'; }
            if (event.keyCode === 85) { return 'હ'; }
            if (event.keyCode === 86) { return 'ન'; }
            if (event.keyCode === 87) { return ' ૈ'; }
            if (event.keyCode === 88) { return ' ં'; }
            if (event.keyCode === 89) { return 'બ'; }
            if (event.keyCode === 90) { return 'z'; } // z

            if (event.keyCode === 191) { return 'ય'; }
            if (event.keyCode === 192) { if (event.nativeEvent.shiftKey) return 'ఒ'; else return 'ొ'; }

            if (event.keyCode === 219) { if (event.nativeEvent.shiftKey) return 'ઢ'; else return 'ડ'; }
            if (event.keyCode === 220) { if (event.nativeEvent.shiftKey) return 'ઑ'; else return 'ૉ'; }
            if (event.keyCode === 221) { if (event.nativeEvent.shiftKey) return 'ઞ'; else return '઼'; }
            if (event.keyCode === 222) { if (event.nativeEvent.shiftKey) return 'ઠ'; else return 'ટ'; }

            return getDefaultKeyBinding(event);

        }
        else {
            return getDefaultKeyBinding(event);
        }
    }
    selectedChoice = function (value) {
        console.log(value);

        
        if (value === "kannada")
            this.selectedLanguage = "kannada";

        else if (value === "nudi")
            this.selectedLanguage = "nudi";

        else if (value === "hindi")
            this.selectedLanguage = "hindi";

        else if (value === "english")
            this.selectedLanguage = "english";

        else if (value === "telugu")
            this.selectedLanguage = "telugu";

        else if (value === "tamil(inscript)")
            this.selectedLanguage = "tamil(inscript)";

        else if (value === "tamil(type-writer)")
            this.selectedLanguage = "tamil(type-writer)";

        else if (value === "marathi")
            this.selectedLanguage = "hindi";

        else if (value === "gujarati")
            this.selectedLanguage = "gujarati";
    }

    onChange = (editorState) => {
        if (editorState.getDecorator() !== null) {
            this.setState({
                editorState,
                editorContentHtml: stateToHTML(editorState.getCurrentContent())
            });
        }

    }

    decorator = () => new CompositeDecorator([
        {
            strategy: this.linkStrategy,
            component: this.Link,
        },
    ]);

    linkStrategy = (contentBlock, callback, contentState) => {
        contentBlock.findEntityRanges(
            (character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === 'LINK'
                );
            },
            callback
        );
    };


    Link = (props) => {
        const { contentState, entityKey } = props;
        const { url } = contentState.getEntity(entityKey).getData();
        return (
            <a
                className="link"
                rel="noopener noreferrer"
                target="_blank"
                aria-label={url}
                href={url}
            >{props.children}</a>
        );
    };




    handleKeyCommand = (command) => {
        let newState;

        if (command == 'backspace') {
            command = ''
        }


        const editorState = this.state.editorState;
        const currentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        let contentState;
        if (selection.isCollapsed()) {
            contentState = Modifier.insertText(currentState, selection, command);
        }
        else {
            contentState = Modifier.replaceText(currentState, selection, "");
        }
        this.setState({ editorState: EditorState.push(this.state.editorState, contentState, 'insert-fragment') });

        if (newState) {
            this.setState({ editorState: newState });
            return 'handled';
        }
        return 'not-handled';

    }

    insertTable = () => {
        Editor.use(Table({
            includeEditors: ['editor-with-table'],
            defaultColumns: 5,
            defaultRows: 4
        }))
        Editor.createEditorState('editorstate', { editorId: 'editor-with-table' })
    }

    newClicked = () => {
        const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
        this.setState({ editorState });
        document.getElementById("input").value = "";
    }

    renameFile = () => {

        let fileName = '';
        swal.fire({
            title: 'Rename File',
            input: 'text',
            inputPlaceholder: 'File name',
            allowOutsideClick: false,
            showCancelButton: true
        })
            .then(data => {
                fileName = data.value;
                console.log(fileName);
                document.getElementById("input").value = fileName;
            })
            .catch(error => swal('Error!', `Something went wrong!`, 'Error'));
    }

    undo = () => {
        const editorState = this.state.editorState;
        this.setState({
            editorState: EditorState.undo(editorState)
        })
    }

    redo = () => {
        const editorState = this.state.editorState;
        this.setState({
            editorState: EditorState.redo(editorState)
        })
    }
    copy = () => {
        const editorState = this.state.editorState;
        var selectionState = editorState.getSelection();
        var anchorKey = selectionState.getAnchorKey();
        var currentContent = editorState.getCurrentContent();
        var currentContentBlock = currentContent.getBlockForKey(anchorKey);
        var start = selectionState.getStartOffset();
        var end = selectionState.getEndOffset();
        var selectedText = currentContentBlock.getText().slice(start, end);

        navigator.clipboard.writeText(selectedText).then(function () {
            console.log("copied");
        }, function () {
            console.error("not copied");
        });
        console.log(selectedText);

    }

    wordCount = () => {
        const editorState = this.state.editorState;
        const currentState = editorState.getCurrentContent();
        const stringToCount = currentState.getPlainText();
        var wordCount = stringToCount.trim().split(/\s+/).length;
        if (stringToCount == "") {
            swal.fire('word count is 0');
        }
            swal.fire('Word count is ' + wordCount)

        //return str.trim().split(/\s+/).length;
    }

    selectAll = () => {
        const editorState = this.state.editorState;
        const currentContent = editorState.getCurrentContent();
        const firstBlock = currentContent.getBlockMap().first();
        const lastBlock = currentContent.getBlockMap().last();
        const firstBlockKey = firstBlock.getKey();
        const lastBlockKey = lastBlock.getKey();
        const lengthOfLastBlock = lastBlock.getLength();

        const selection = new SelectionState({
            anchorKey: firstBlockKey,
            anchorOffset: 0,
            focusKey: lastBlockKey,
            focusOffset: lengthOfLastBlock,
        });

        this.setState({
            editorState: EditorState.forceSelection(editorState, selection),
        });

        const selectiontext = editorState.getSelection();
        console.log(selectiontext);
    }

    convertToDocx = () => {

        var that = this;
        const editorState = this.state.editorState;

        let contentState = this.state.editorState.getCurrentContent()
        var content = contentState.getPlainText();

        var totalContent = content;
        this.html = "<!DOCTYPE html><html><head><title></title>" +
            "<meta http-equiv='Content-Type' content='application/vnd.openxmlformats-officedocument.wordprocessingml.document' charset='UTF-8'></head><body>"
            + stateToHTML(contentState) + "</body></html>";

        try {


            var blob = new Blob([totalContent], {
                type: "application/msword;charset=utf-8"
            });

            var converted = htmlDocx.asBlob(this.html);
            console.log(converted);
            FileSaver.saveAs(converted, "yea.docx");
            console.log("success");
        }
        catch (error) {
            console.log(error);
        }

        var convertedHtml = convertFromHTML(this.html);
        console.log(convertedHtml);

        var databaseRef = firebase.database().ref();
        console.log(databaseRef);

        var htmla = stateToHTML(contentState)
        var dataUsersRef = databaseRef.child("yea");
        dataUsersRef.set({
            htmla
        });

        var node = document.createElement("LI");
        var anchor = document.createElement("a");

        var textnode = document.createTextNode("yea");
        anchor.appendChild(textnode);
        anchor.title = "file";
        anchor.onclick = function () {

            var anchorText = anchor.innerHTML;
            var query = firebase.database().ref().orderByKey();
            console.log(query);
            query.once("value").then(function (snapshot) {

                snapshot.forEach(function (childSnapshot) {
                    var key = childSnapshot.key;


                    //console.log(titleContent);
                    if (key == anchorText) {
                        console.log("matched");

                        childSnapshot.forEach(function (childSnapshot) {

                            var val = childSnapshot.val();
                            console.log(childSnapshot.val());
                            const blocksFromHTML = convertFromHTML(val);
                            const titleState = ContentState.createFromBlockArray(
                                blocksFromHTML.contentBlocks,
                                blocksFromHTML.entityMap
                            );

                            console.log(blocksFromHTML);

                            that.setState({ editorState: EditorState.push(editorState, titleState, 'insert-fragment') });

                        })

                        return true;

                    }
                });

            });
        }

        anchor.style = 'color:black;background:white'
        node.appendChild(anchor);
        document.getElementById("myList").appendChild(node);

        var storageRef = firebase.storage().ref();
        var usersRef = storageRef.child('users');
        var savedRef = usersRef.child('saved/docs/' + 'yay' + '.docx');

        var filetoblob = this.blobToFile(converted, "yay" + ".docx");
        console.log(filetoblob);
        savedRef.put(filetoblob).then(function () {
            console.log("done");
        });

    }
    blobToFile = (blob, fileName) => {
        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        blob.lastModifiedDate = new Date();
        blob.name = fileName;
        return blob;
    }

    convertToTxt = () => {

        let contentState = this.state.editorState.getCurrentContent()
        var content = contentState.getPlainText();
        const editorState = this.state.editorState;
        var that = this;

        var blob = new Blob([content], { type: "text/plain;charset=utf-8" });

        //convert blob to file
        function blobToFile(blob, fileName) {
            //A Blob() is almost a File() - it's just missing the two properties below which we will add
            blob.lastModifiedDate = new Date();
            blob.name = fileName;
            return blob;
        }
        // var now = new Date();

        //firebase refs
        var usersRef = this.storageRef.child('users');
        var savedRef = usersRef.child('saved/' + 'save.txt');

        //local save
        FileSaver.saveAs(blob, "save" + ".txt");
        var filetoblob = blobToFile(blob, "save" + ".txt");

    }


    convertToPdf = () => {


        let editorContent = document.querySelector('.DraftEditor-editorContainer');

        const pdf = new jsPDF();
        html2canvas(editorContent).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            var databaseRef = firebase.database().ref();

            var dataUsersRef = databaseRef.child('users');
            dataUsersRef.set({
                'thumbnail': imgData
            });

            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("download.pdf");
            var blob = pdf.output("blob");

            console.log(blob);
            var usersRef = this.storageRef.child('users');
            var savedRef = usersRef.child('saved/same.pdf');

            savedRef.put(blob).then(function () {
                console.log("done");

            });

        });
    }



    pageSetup = async () => {
        var editor = document.getElementsByClassName("editors");
        const inputOptions = new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    'Portrait': 'Portrait',
                    'Landscape': 'Landscape'
                })
            }, 500)
        })

        const { value: orientation } = await swal.fire({
            title: 'Select orientation',
            input: 'radio',
            inputOptions: inputOptions,
            inputValidator: (value) => {
                return !value && 'You need to choose something!'
            }
        })
        if (orientation) {
            const { value: size } = await swal.fire({
                title: 'Select Paper Size',
                input: 'select',
                inputOptions: {
                    'Letter': 'Letter(8.5" x 11")',
                    'Tabloid': 'Tabloid(11" x 17"',
                    'Legal': 'Legal(8.5" x 14")',
                    'A4': 'A4(8.27" x 11.69")'
                },
                inputPlaceholder: 'Select a Size',
                showCancelButton: true,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value === 'Letter') {

                            for (var i = 0; i < editor.length; i++) {

                                editor[i].style.width = "330mm";
                                editor[i].style.height = "130mm";

                            }
                            resolve()
                        }
                        else {
                            resolve('select something')
                        }
                    })
                }
            })
        }
    }

    printDiv = (divName) => {

        var printContents = document.getElementById(divName).innerHTML;
        var originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;

    }

    onChange1 = (input) => {
        this.setState({
            input: input
        });
    }
    onChangeInput = event => {
        let input = event.target.value;

        console.log(input);
        //this.setState({ editorState: EditorState.push(this.state.editorState, contentState, 'insert-fragment') });

        this.setState(
            {
                input: input
            },
            () => {
                this.keyboard.setInput(input);
            }
        );
    };

    onKeyPress1 = (button) => {
        if (button === "{shift}" || button === "{lock}") this.handleShift();
        console.log("", button);

        const editorState = this.state.editorState;
        const currentState = editorState.getCurrentContent();

        const selection = editorState.getSelection();
        let contentState = Modifier.insertText(currentState, selection, button);

        this.setState({ editorState: EditorState.push(this.state.editorState, contentState, 'insert-fragment') });


    }
    handleShift = () => {
        let layoutName = this.state.layoutName;


        this.setState({
            layoutName: layoutName === "default" ? "shift" : "default"
        });
    };



    getDictionary = () => {

        this.setState({ isToggled: true });
        document.getElementById("mydiv").style.left = "0px";
        document.getElementById("pulse-button").style.position = "fixed";

        // document.getElementById('mydiv').style


    }

    requestFullScreen = (element) => {
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        }
    }

    render() {
        const { editorState } = this.state;
        return (
            <div className="header">
                <div className="whiteBar">

                    <a href="#">
                        <img className="gnani-logo" src={logo} alt="" /></a>

                    <h1 id="untitled">
                        <input className="input" id="input" type="text" placeholder="My Note 1"  ></input>
                    </h1>

                    <div class="navbar1">
                        <div class="dropdown1">
                            <button class="dropbtn1">File
      <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content1">
                                <a href="#" onClick={this.newClicked}>New</a>
                            
                                <a href="#" > 
                                 <label for="files" class="btn">Select Audio</label> 
                                 <input type="file"  id="files" accept="audio/*"/> </a>
                                <a href={"https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=contact@gmail.com&su=" + {} + "&body=" + "body"}
                                    target="_blank">Share</a>
                                <a href="#">Download As</a>
                                <ul>
                                    <li class="cl-dropdown"><a href="#" onClick={this.convertToDocx}>Docx</a></li>
                                    <li class="cl-dropdown"><a href="#" onClick={this.convertToPdf}>Pdf</a></li>
                                    <li class="cl-dropdown"><a href="#" onClick={this.convertToTxt}>.Txt</a></li>
                                </ul>

                                <a href="#" class="languages">Language</a>


                                <ul>
                                    <li><a href="#" onClick={() => this.selectedChoice("hindi")}>Hindi</a></li>
                                    <li><a href="#" onClick={() => this.selectedChoice("kannada")}>Kannada</a></li>
                                    <li><a href="#" onClick={() => this.selectedChoice("tamil(inscript)")}>Tamil</a></li>
                                    <li><a href="#" onClick={() => this.selectedChoice("gujarati")}>Gujarati</a></li>
                                    <li><a href="#" onClick={() => this.selectedChoice("telugu")}>Telugu</a></li>
                                    <li><a href="#" onClick={() => this.selectedChoice("nudi")}>Kannada(Nudi)</a></li>
                                </ul>

                                <div>
                                    <ul id="myList">

                                    </ul>
                                </div>
                                <a href="#" onClick={this.renameFile}>Rename</a>
                                <a href="#">Templates(Coming soon)</a>
                                <a href="#" onClick={this.pageSetup}>Page Setup</a>
                                <a href="#" onClick={() => this.printDiv("printable")}>Print</a>
                            </div>
                        </div>
                        <div class="dropdown1">
                            <button class="dropbtn1">Edit
      <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content1">
                                <a href="#" onClick={this.undo}>Undo</a>
                                <a href="#" onClick={this.redo}>Redo</a>
                                <a href="#">Cut</a>
                                <a href="#" onClick={this.copy}>Copy</a>
                                <a href="#">Paste</a>
                                <a href="#">Paste Without Formatting</a>
                                <a href="#">Delete</a>
                                <a href="#" onClick={this.selectAll}>Highlight text</a>
                                <a href="#">Find & Replace</a>

                            </div>
                        </div>

                        <div class="dropdown1">
                            <button class="dropbtn1">View
      <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content1">
                                <a href="#">Print Layout</a>
                                <a href="#">Zoom</a>
                                <a href="#" onClick={() => this.requestFullScreen(elem)}>FullScreen</a>
                                <a href="#">Show Ruler</a>
                            </div>
                        </div>

                        <div class="dropdown1">
                            <button class="dropbtn1">Insert
      <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content1">
                                <a href="#" onClick={this.insertTable}>Table</a>
                                <a href="#">Footnote</a>
                                <a href="#">Header</a>
                                <a href="#">Footer</a>
                                <a href="#">Add Comments</a>
                                <a href="#">Track Changes</a>
                                <a href="#">Highlight text</a>

                            </div>
                        </div>

                        <div class="dropdown1">
                            <button class="dropbtn1">Format
      <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content1">
                                <a href="#">Text</a>
                                <a href="#">Paragraph Styling</a>
                                <a href="#">Align & Indent</a>
                                <a href="#">Align & Indent</a>
                                <a href="#">Line Spacing</a>
                                <a href="#">Bullets & Numbering</a>
                            </div>
                        </div>

                        <div class="dropdown1">
                            <button class="dropbtn1">Tools
      <i class="fa fa-caret-down"></i>
                            </button>
                            <div class="dropdown-content1">
                                <a href="#" onClick={this.wordCount}>Word Count</a>
                                <a href="#">Voice Typing</a>
                                <a href="#" onClick={this.virtualKeyboard}>Type in your Language</a>
                                <a href="#" onClick={this.getDictionary}>Dictionary</a>

                            </div>
                        </div>
                    </div>



                    <div className="rightSide">
                        <img src={accounticon} class="account" />
                    </div>

                </div>

                <Draggable>
                    <div id="mydiv">

                        <div id="mydivheader"> <Keyboard
                            onChange={input =>
                                this.onChange1(input)}
                            onKeyPress={button =>
                                this.onKeyPress1(button)}
                            layout={layout}
                            className="keyboard"
                        /></div>

                    </div>
                </Draggable>

                <div className="editors" id="printable">
                    <Editor
                        value={editorState}
                        id="editor-with-table"
                        onChange={this.onChange}
                        onSave={this.submitContent}
                        editorState={this.state.editorState}
                        onEditorStateChange={this.onEditorStateChange}
                        blockStyleFn={this.blockStyleFn}
                        blockRenderMap={this.blockRenderMap}
                        blockRendererFn={this.blockRendererFn}
                        editorClassName="page"
                        keyBindingFn={this.keyBindingFn}
                        handleKeyCommand={this.handleKeyCommand}
                    />
                </div>

                <div class="middle-man">
                    <div class="dropdowns">
                        <label class="custom-select">
                            <select name='options'>
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="kannada">Kannada</option>
                                <option value="tamil">Tamil</option>
                                <option value="telugu">Telugu</option>
                                <option value="gujarati">Gujarati</option>
                            </select>
                        </label>

                        <img src={mic} class="my-img" />
                    </div>
                    <div class="dropdowns">
                        <label class="custom-select">
                            <select name='options' id="languages">
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="kannada">Kannada</option>
                                <option value="tamil">Tamil</option>
                                <option value="telugu">Telugu</option>
                                <option value="gujarati">Gujarati</option>
                            </select>
                        </label>

                        <img src={keyboard} class="my-img" />
                    </div>
                    <div class="dropdowns">
                        <label class="custom-select">
                            <select name='options'>
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="kannada">Kannada</option>
                                <option value="tamil">Tamil</option>
                                <option value="telugu">Telugu</option>
                                <option value="gujarati">Gujarati</option>
                            </select>
                        </label>

                        <img src={translate} class="my-img" />
                    </div>
                </div>
                <button class="pulse-button" id="pulse-button"></button>


                {this.state.isToggled ? <DictionaryPage /> : null}


            </div>

        )
    }
}
