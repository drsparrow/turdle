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
  const index = Number(document.location.hash.split('#')[1]);
  if (index >= 0 && index < WORDS.length) {
    return <Game wordIndex={index}/>
  } else {
    // evil/lazy
    setGame(0);
    return null;;
  }
}

interface GameState {
  guesses: string[];
  curGuess: string;
  isWrongGuess: boolean;
}

class Game extends React.Component<{wordIndex: number}, GameState> {

  state: GameState = {
    guesses: [],
    curGuess: "",
    isWrongGuess: false,
  };

  render () {
    return (
      <div className="Game">
        <h1>TURDLE</h1>
        <div className="board">
          {this.renderControls()}
          {this.renderPrevWordRows()}
          {this.renderCurWordRow()}
          {this.renderNextWordRows()}
          {this.renderFinalWord()}
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
    const numRows = this.isOver() ?
      NUM_GUESSES - this.state.guesses.length :
      NUM_GUESSES - this.state.guesses.length - 1;
    if(numRows <= 0) return;
    return blankArray(numRows).map((_, i) =>
      <NextWordRow key={i}/>
    );
  }

  private renderControls() {
    const prev = (this.props.wordIndex - 1) % WORDS.length + WORDS.length;
    const next = (this.props.wordIndex + 1) % WORDS.length;

    return <div>
      <button onClick={() => setGame(prev)}>Prev</button>
      #{this.props.wordIndex}
      <button onClick={() => setGame(next)}>Next</button>
    </div>
  }

  private isOver(): boolean {
    const {guesses} = this.state;
    if (!guesses) return false;
    return guesses.length >= NUM_GUESSES || guesses[guesses.length-1] === this.word; ;
  }

  private renderFinalWord() {
    return this.isOver() ?
      <a className="final-word"
        href={`https://www.dictionary.com/browse/${this.word}`}
        target="_blank">
        {this.word}
      </a>
      :
      ''
      ;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if(this.isOver()) return;

    if (event.keyCode >= 65 && event.keyCode <= 90) {
      this.addLetter(event);
    } else if (event.keyCode === 13) { // 'Enter' key
      this.addWord();
    } else if (event.keyCode === 8) { // 'Backspace' key
      this.deleteLetter();
    }

  }

  private addLetter(event: KeyboardEvent) {
    if (this.state.curGuess.length >= WORD_LENGTH) return;
    this.setState(state => ({ curGuess: state.curGuess + event.key.toLowerCase() }));
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

  private get word() {
    return WORDS[this.props.wordIndex];
  }
}

// function getRandomWord(): string {
//   return WORDS[Math.floor(Math.random() * WORDS.length)];
// }

function isRealWord(word: string): boolean {
  return WORD_SET.has(word);
}

function setGame(index: number) {
  // evil/lazy:
  document.location.hash = String(index);
  document.location.reload();
}


export default App;
