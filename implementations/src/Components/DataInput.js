import React from 'react'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import '../../node_modules/codemirror/lib/codemirror.css'
import '../../node_modules/codemirror/theme/material.css'
import '../../node_modules/codemirror/mode/javascript/javascript'


export default function DataInput() {

    const options  = {
        mode:{name:'javascript',
                json: true } ,
        theme: 'material',
        lineNumbers: true,
    };
        
    return <div>
                <CodeMirror
                value="{type: 'data', timestamp: 1519780251000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3}"
                options={options}/>
            </div>          

}