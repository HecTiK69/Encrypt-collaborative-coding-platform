import React, { useEffect, useRef } from "react";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "../../src/App.css";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId, onCodeChange} ) => {

  const editorRef = useRef('null')
  useEffect(() => {
    async function Init() {
      editorRef.current = CodeMirror.fromTextArea(document.getElementById("realtimeEditor"), {
        mode: { name: "javascript", json: true },
        theme: 'dracula',
        autoCloseBrackets: true,
        autoCloseTags: true,
        lineNumbers: true,
      });
      editorRef.current.on('change', (instance, changes) => {
         
         const { origin } = changes;
         const code = instance.getValue();
         onCodeChange(code);
         if (origin !=='setValue'){
           socketRef.current.emit(ACTIONS.CODE_CHANGE,{
             roomId,
             code,
           })
         }
         
         
      })
      

     

      
      // editorRef.current.setValue(`console.log("Hello")`)
    }
      Init();

  }, []);

  useEffect(() => {
    if(socketRef.current){
      
     socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
       if(code !== null){
         editorRef.current.setValue(code);
         
       }
     })
    }

    return() => {
      socketRef.current.off(ACTIONS.CODE_CHANGE)
    }
 }, [socketRef.current])

  

  return <textarea  id="realtimeEditor">
    
  </textarea>;
}

export default Editor;
