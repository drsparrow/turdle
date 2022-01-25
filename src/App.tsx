import React from 'react';
import './App.css';
import { NUM_GUESSES, WORD_LENGTH } from './constants';
import { CurWordRow } from './CurWordRow';
import { blankArray } from './helpers';
import { Keyboard } from './Keyboard';
import { NextWordRow } from './NextWordRow';
import { PrevWordRow } from './PrevWordRow';
import { WORDS, WORD_SET } from './words';

function App() {
  return <Game />
}

interface GameState {
  guesses: string[];
  curGuess: string;
  isWrongGuess: boolean;
}

class Game extends React.Component<{}, GameState> {
  word: string = getRandomWord();

  state: GameState = {
    guesses: [],
    curGuess: "",
    isWrongGuess: false,
  };

  render () {
    return (
      <div className="Game">
        <div className="board">
          {this.renderPrevWordRows()}
          {this.renderCurWordRow()}
          {this.renderNextWordRows()}
          {this.isOver() ? this.word : ''}
        </div>
        <Keyboard word={this.word} guesses={this.state.guesses}/>
      </div>
    );
  }

  private renderPrevWordRows () {
    return this.state.guesses.map((guess, i) =>
      <PrevWordRow guess={guess} word={this.word} key={i} />
    )
  }

  private renderCurWordRow () {
    if (this.isOver()) { return null }

    const {guesses, curGuess, isWrongGuess} = this.state;
    if (guesses.length >= NUM_GUESSES) { return null }

    return <CurWordRow guess={curGuess} isWrong={isWrongGuess}/>
  }

  private renderNextWordRows () {
    const numRows = NUM_GUESSES - 1 - this.state.guesses.length;
    if(numRows <= 0) return;
    return blankArray(numRows).map((_, i) =>
      <NextWordRow key={i}/>
    );
  }

  private isOver(): boolean {
    const {guesses} = this.state;
    if (!guesses) return false;
    return guesses.length >= NUM_GUESSES || guesses[guesses.length-1] == this.word; ;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if(this.isOver()) return;

    if (event.keyCode >= 65 && event.keyCode <= 90) {
      this.addLetter(event);
    } else if (event.keyCode == 13) { // 'Enter' key
      this.addWord();
    } else if (event.keyCode == 8) { // 'Backspace' key
      this.deleteLetter();
    }

  }

  private addLetter(event: KeyboardEvent) {
    if (this.state.curGuess.length >= WORD_LENGTH) return;
    this.setState(state => ({ curGuess: state.curGuess + event.key }));
  }

  private addWord() {
    const {curGuess, guesses} = this.state;
    if (curGuess.length !== WORD_LENGTH) return;

    if (isRealWord(curGuess)) {
      this.setState({
        curGuess: '',
        guesses: guesses.concat([curGuess]),
      });
    } else {
      this.setState({isWrongGuess: true});
    }
  }

  private deleteLetter() {
    this.setState(state => ({
      curGuess: state.curGuess.slice(0, -1),
      isWrongGuess: false,
    }));
  }
}

function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function isRealWord(word: string): boolean {
  return WORD_SET.has(word);
}


export default App;
