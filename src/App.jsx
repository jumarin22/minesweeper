import React, { Component } from 'react'

export class App extends Component {
  state = {
    id: '',
    board: [
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ],
    state: '',
    mines: '',
  }

  handleNewGame = async () => {
    // Make a POST to ask for a new game
    const response = await fetch(
      'https://minesweeper-api.herokuapp.com/games/',

      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }
    )
    if (response.status === 200) {
      // Get the response as JSON
      const game = await response.json()
      console.log(game)
      // Make that the new state!
      this.setState(game)
      // Update Game ID display
      let notify = document.querySelector('p')
      notify.textContent = `Game ID: ${this.state.id}`
    }
  }

  checkStateState() {
    if (this.state.state === 'won') {
      let notify = document.querySelector('p')
      notify.textContent = `You Win!`
    }
    if (this.state.state === 'lost') {
      let notify = document.querySelector('p')
      notify.textContent = `You Lose :(`
    }
  }

  handleClickOnCell = async (clickedRowIndex, clickedColumnIndex) => {
    if (this.state.id === '') {
      return
    }
    // Generate the URL we need
    const url = `https://minesweeper-api.herokuapp.com/games/${this.state.id}/check`
    // Make an object to send as JSON
    const body = {
      row: clickedRowIndex,
      col: clickedColumnIndex,
    }
    // Make a POST request to make a move
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.status === 200) {
      // Get the response as JSON
      const game = await response.json()
      // Make that the new state!
      this.setState(game)
      this.checkStateState()
    }
  }

  handleFlagOnCell = async (clickedRowIndex, clickedColumnIndex) => {
    if (this.state.id === '') {
      return
    }
    const url = `https://minesweeper-api.herokuapp.com/games/${this.state.id}/flag`
    const body = {
      row: clickedRowIndex,
      col: clickedColumnIndex,
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.status === 200) {
      const game = await response.json()
      this.setState(game)
      this.checkStateState()
    }
  }

  render() {
    return (
      <div>
        <header>
          <h1>Welcome to Boom Flagger</h1>
          <p>Click on New Game!</p>
        </header>
        <button onClick={this.handleNewGame}>New Game</button>
        <ul>
          {this.state.board.map((row, rowIndex) => {
            return row.map((cell, columnIndex) => {
              return (
                <li
                  key={columnIndex}
                  onClick={() => this.handleClickOnCell(rowIndex, columnIndex)}
                  onContextMenu={() =>
                    this.handleFlagOnCell(rowIndex, columnIndex)
                  }
                >
                  {cell}
                </li>
              )
            })
          })}
        </ul>
      </div>
    )
  }
}
