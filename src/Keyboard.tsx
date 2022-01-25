import React from "react";
import { Color, ColorHelper } from "./colorHelper";
import './Keyboard.css';

interface KeyboardProps {
    word: string,
    guesses: string[],
    handleCharPress: (key: string) => void,
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
                {'zxcvbnm'.split('').map(k => this.keyboardKey(k, colorMap[k]))}
            </div>
        </div>
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