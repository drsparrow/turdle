import React from "react";
import { Color, ColorHelper } from "./colorHelper";
import './Keyboard.css';

interface KeyboardProps {
    word: string,
    guesses: string[],
    handleCharPress: (key: string) => void,
    handleDelPress: () => void,
    handleEnterPress: () => void,
};
export class Keyboard extends React.Component <KeyboardProps, {}> {
    render() {
        const {guesses, word} = this.props;
        const colorMap = new ColorHelper(word).masterColors(guesses);
        return <div className="Keyboard">
            <div>
                {'qwertyuiop'.split('').map(k => this.keyboardKey(k, colorMap[k]))}
            </div>
            <div>
                {'asdfghjkl'.split('').map(k => this.keyboardKey(k, colorMap[k]))}
            </div>
            <div>
                {this.enterKey()}
                {'zxcvbnm'.split('').map(k => this.keyboardKey(k, colorMap[k]))}
                {this.delKey()}
            </div>
        </div>
    }

    enterKey() {
        return <span
            className="KeyboardKey enter"
            onClick={this.props.handleEnterPress}>
            ↵
        </span>
    }

    delKey() {
        return <span
            className="KeyboardKey delete"
            onClick={this.props.handleDelPress}>
            ⌫
        </span>
    }

    keyboardKey(char: string, color: Color) {
        return <span
            className={`KeyboardKey ${color}`}
            key={char}
            onClick={() => this.props.handleCharPress(char)}>
            {char}
        </span>
    }
}