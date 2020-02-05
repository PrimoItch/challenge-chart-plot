import {UnControlled as CodeMirror} from 'react-codemirror2'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/material.css'
import '../../node_modules/codemirror/mode/javascript/javascript'
import '../App.css'

import React, { Component } from 'react'

export default function DataInput(props) {

    const options  = {
        mode:{name:'javascript',
                json: true } ,
        theme: 'material',
        lineNumbers: true,        
        autoScroll: true,             
        }
    
    return (
        <CodeMirror 
        onChange={(editor, data, value) => props.onChange(value)}
        options={options}/>
   
    )
}

