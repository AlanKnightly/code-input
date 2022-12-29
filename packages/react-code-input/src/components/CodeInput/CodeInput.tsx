import React, {useEffect,useState, useRef } from 'react';
import { Button,message,Radio,Popover,Space,RadioChangeEvent } from 'antd';
import {highlightElement,highlightAll } from 'prismjs';
import './index.css'
import 'prismjs/components/prism-json'; 
/** 
 * 基于textarea, pre, code实现的简易编辑器
 * https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
 * 
*/
const CodeInput = ({value,onChange}:any)=>{
  const previewElRef = useRef<HTMLPreElement|null>(null);
  const textareaRef = useRef<HTMLTextAreaElement|null>(null);
  const codeElRef = useRef<any>(null);
  
  const update=()=> {
    if(textareaRef&&textareaRef.current &&codeElRef&& codeElRef.current){
      let text = textareaRef.current.value
      // Handle final newlines (see article)
      if(text[text.length-1] == "\n") {
        text += " ";
      }
      codeElRef.current.innerHTML = text.replace(new RegExp("&", "g"), "&amp;").replace(new RegExp("<", "g"), "&lt;"); /* Global RegExp */
      // Syntax Highlight
      highlightElement(codeElRef.current);
      highlightAll();
    }
  }
  const syncScroll = ()=> {
    if(textareaRef&&textareaRef.current && previewElRef&&previewElRef.current){
      /* Scroll result to scroll coords of event - sync with textarea */
      // Get and set x and y
      previewElRef.current.scrollTop = textareaRef.current.scrollTop;
      previewElRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }

  const handleInput = ()=>{
    update();
    syncScroll();
  }

  const formatJSON = ()=>{
    try{
      if(textareaRef&&textareaRef.current){
        const temp = JSON.stringify(JSON.parse(textareaRef.current.value),null,2)
        onChange(temp)
        handleInput()
      }
    }catch(e){
      console.log(e)
      message.error("当前配置内容不是正确的json格式")
    }
  }
  
  const checkTab = (event: React.KeyboardEvent)=> {
    if(textareaRef&&textareaRef.current){
      const element = textareaRef.current
      let code = textareaRef.current.value;
      if(event.key == "Tab") {
        /* Tab key pressed */
        event.preventDefault(); // stop normal
        let before_tab = code.slice(0, element.selectionStart); // text before tab
        let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
        let cursor_pos = element.selectionStart + 1; // where cursor moves after tab - moving forward by 1 char to after tab
        element.value = before_tab + "\t" + after_tab; // add tab char
        // move cursor
        element.selectionStart = cursor_pos;
        element.selectionEnd = cursor_pos;
        update(); // Update text to include indent
      }
    }
  }

  useEffect(()=>{
    handleInput()
  },[value])
  
  const [theme, setTheme] = useState('default') 
  const changeTheme = (e: RadioChangeEvent)=>{
    setTheme(e.target.value)
    localStorage.setItem('code-input-theme',e.target.value)
    handleInput()
  }
  useEffect(()=>{
    const customizeTheme = localStorage.getItem('code-input-theme')
    if(customizeTheme){
      setTheme(customizeTheme)
    }
  },[])
  
  return <>
   <div className={theme} style={{height: 320, position:'relative', marginBottom:30 }}>
      <textarea  style={{height: 320}}  placeholder="请输入JSON" ref={textareaRef} value={value} id="editing" spellCheck="false" onInput={handleInput} onScroll={syncScroll} onKeyDown={checkTab} onChange={onChange}></textarea>
      <pre id="highlighting" style={{height: 320}}  aria-hidden="true" ref={previewElRef}>
          <code className="language-json" ref={codeElRef} id="highlighting-content"></code>
      </pre>

      <Popover content={
        <div style={{background:'#fff'}}>
          <Radio.Group defaultValue={theme} size="small"  onChange={changeTheme}>
            <Space direction="vertical">
              <Radio value="default">default</Radio>
              <Radio value="solarizedlight">solarizedlight</Radio>
              <Radio value="twilight">twilight</Radio>
              <Radio value="tomorrow">tomorrow</Radio>
            </Space>
          </Radio.Group>
        </div>
        }
        placement="topLeft"
        title={null} 
        trigger="hover"
      >
        <Button style={{position:'absolute', top:'calc(100% + 8px)', left:0}} type="link" >当前主题：<span className='fw-5' style={{color:'rgb(134 133 132)'}}>{theme}</span> </Button>
      </Popover>
      <Button style={{position:'absolute', top:'calc(100% + 8px)', right:4}} type="link" onClick={formatJSON}>格式化JSON</Button>
   </div>
  </>
}

export default CodeInput