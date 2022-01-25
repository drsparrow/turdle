import React from 'react';
import './App.css';
import { NUM_GUESSES, WORD_LENGTH } from './constants';
import { CurWordRow } from './CurWordRow';
import { blankArray } from './helpers';
import { Keyboard } from './Keyboard';
import { NextWordRow } from './NextWordRow';
import { PrevWordRow } from './PrevWordRow';
import { WORDS, WORD_SET } from './words';

class App extends React.Component<{}, {wordIndex: number}> {

  state = {wordIndex: this.getIndexFromHash()}

  render() {
    const {wordIndex} = this.state;
    if (wordIndex >= 0 && wordIndex < WORDS.length) {
      return <Game wordIndex={wordIndex}/>
    } else {
      // evil/lazy
      setGame(randomIndex());
      return null;
    }
  }

  componentDidMount() {
    window.onhashchange = (() => {
      this.setState({wordIndex: this.getIndexFromHash()});
      document.body.blur();
    });
  }

  private getIndexFromHash(): number {
    return Number(document.location.hash.split('#')[1]);
  }
}

interface GameState {
  guesses: string[];
  curGuess: string;
  isWrongGuess: boolean;
}

interface GameProps { wordIndex: number }

const INIT_STATE: GameState = {
  guesses: [],
  curGuess: "",
  isWrongGuess: false,
};

class Game extends React.Component<GameProps, GameState> {

  state = INIT_STATE;

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
        <Keyboard
          word={this.word}
          guesses={this.state.guesses}
          handleCharPress={this.addLetter.bind(this)}/>
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
    const prev = ((this.props.wordIndex || WORDS.length) - 1) % WORDS.length;
    const next = (this.props.wordIndex + 1) % WORDS.length;
    const random = randomIndex();

    return <div>
      <div>#{this.props.wordIndex}</div>
      <button className="new-game-button"
        disabled={!this.isOver()}
        onClick={() => setGame(prev)}>
          Prev
      </button>
      <button className="new-game-button"
        disabled={!this.isOver()}
        onClick={() => setGame(random)}>
        Random
      </button>
      <button className="new-game-button"
        disabled={!this.isOver()}
        onClick={() => setGame(next)}>
        Next
      </button>
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
        target="_blank"
        rel="noreferrer">
        {this.word}
      </a>
      :
      ''
      ;
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillReceiveProps(newProps: GameProps) {
    if(newProps.wordIndex !== this.props.wordIndex) {
      this.setState(INIT_STATE);
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    if(this.isOver()) return;

    if (event.keyCode >= 65 && event.keyCode <= 90) {
      this.addLetter(event.key);
    } else if (event.keyCode === 13) { // 'Enter' key
      this.addWord();
    } else if (event.keyCode === 8) { // 'Backspace' key
      this.deleteLetter();
    }

  }

  private addLetter(key: string) {
    if (this.state.curGuess.length >= WORD_LENGTH) return;
    this.setState(state => ({ curGuess: state.curGuess + key.charAt(0).toLowerCase() }));

    return false;
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

function isRealWord(word: string): boolean {
  return WORD_SET.has(word);
}

function randomIndex(): number {
  return Math.floor(Math.random() * WORDS.length);
}

function setGame(index: number) {
  // evil/lazy:
  document.location.hash = String(index);
}


export default App;
