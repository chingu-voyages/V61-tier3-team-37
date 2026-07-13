import React, { Component } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./index.css";

const noop = () => {}; //in case the program has no values, we use this null

// parent component
interface IProps {
  keyboardRef: (r: Component) => void;
  onChange: (input: string) => void;
  onEnter: () => void;
}

// Component
class KeyboardWrapper extends Component<IProps> {
  state = {
    layoutName: "default",
  };

  onKeyPress = (button: string) => {
    if (button === "{enter}") {
      this.props.onEnter();
    }
  };

  render() {
    const { layoutName } = this.state;
    const { keyboardRef = noop, onChange = noop } = this.props;

    return (
      <Keyboard
        keyboardRef={keyboardRef}
        excludeFromLayout={{
          default: [
            "@",
            ".com",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "0",
            "-",
            "=",
            "[",
            "]",
            "\\",
            ";",
            "'",
            ",",
            ".",
            "/",
            "`",
          ],
          shift: ["@", ".com"],
        }}
        layoutName={layoutName}
        onChange={onChange}
        onKeyPress={this.onKeyPress}
        onRender={() => console.log("Rendered")}
      />
    );
  }
}

export { KeyboardWrapper, Keyboard };
