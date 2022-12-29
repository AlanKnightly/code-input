/// <reference types="react" />
import './index.css';
import 'prismjs/components/prism-json';
/**
 * 基于textarea, pre, code实现的简易编辑器
 * https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
 *
*/
declare const CodeInput: ({ value, onChange }: any) => JSX.Element;
export default CodeInput;
