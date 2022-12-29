import React, {useState} from "react";

export interface ButtonProps {
  label: string;
}

const Button = (props: ButtonProps) => {
  const [num, setNum] = useState(1)
  return <button >{props.label}</button>;
};

export default Button;