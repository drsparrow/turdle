import React from 'react';
import { ColorHelper } from './colorHelper';

interface PrevWordRowProps { guess: string, word: string }
export class PrevWordRow extends React.Component<PrevWordRowProps, {}> {
    render() {
        return <div className="PrevWordRow">
            {this.props.guess.split('').map((letter, letterIdx) =>
                <span key={letterIdx} className={"cell " + this.color(letter, letterIdx)}>
                    {letter}
                </span>
            )}
        </div>;
    }

    private color(letter: string, letterIdx: number) {
        return new ColorHelper(this.props.word).color(letter, letterIdx);
    }
}