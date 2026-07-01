import React, { Component } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./index.css";

const noop = () => {};  //in case the program has no values, we use this null

//parent component 
interface IProps {
  keyboardRef: (r: Component) => void; 
  onChange: (input: string) => void;
}

//Componet
class KeyboardWrapper extends Component<IProps> {
  state = {
    layoutName: "default"
  };

  // triggered on user input
  onKeyPress = (button: string) => {
    console.log("Button pressed", button);
  };

  render() {
    const { layoutName } = this.state;
    const { keyboardRef = noop, onChange = noop } = this.props;

    return (
      <Keyboard
        keyboardRef={keyboardRef}
        layoutName={layoutName}
        onChange={onChange}
        onKeyPress={this.onKeyPress}
        onRender={() => console.log("Rendered")}
      />
    );
  }
}

export { KeyboardWrapper, Keyboard };