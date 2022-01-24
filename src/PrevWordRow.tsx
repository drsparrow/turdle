import React from 'react';

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
        const { word } = this.props;
        if (word.charAt(letterIdx) == letter) {
            return 'green';
        } else if (word.includes(letter)) {
            return 'yellow';
        } else {
            return 'gray';
        }
    }
}