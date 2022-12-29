/// <reference types="react" />
interface ButtonProps {
    label: string;
}
declare const Button: (props: ButtonProps) => JSX.Element;

/**
 * 基于textarea, pre, code实现的简易编辑器
 * https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
 *
*/
declare const CodeInput: ({ value, onChange }: any) => JSX.Element;

export { Button, CodeInput };
