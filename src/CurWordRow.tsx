import React from "react";
import { WORD_LENGTH } from "./constants";

interface CurWordRowProps { guess: string, isWrong: boolean }
export class CurWordRow extends React.Component<CurWordRowProps, {}> {
    render() {
        const {guess, isWrong} = this.props;
        return <div className={"CurWordRow " + (isWrong ? 'red' : '')}>
            {guess.padEnd(WORD_LENGTH, '_').split('').map((letter, letterIdx) =>
                <span key={letterIdx} className="cell guess">
                    {letter}
                </span>
            )}
        </div>;
    }
}