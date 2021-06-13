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

  nameCell = cell => {
    switch (cell) {
      case '_':
        return 'empty'
      case 'F':
        return 'cell flag'
      case '*':
        return 'boom'
      default:
        return 'cell'
    }
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
      // Make that the new state!
      this.setState(game)
      // Update Game ID display
      let notify = document.querySelector('p')
      notify.textContent = `Game ID: ${this.state.id}`
      this.checkStateState()
    }
  }

  checkStateState() {
    let notify = document.querySelector('p')
    let info = document.querySelector('section')
    if (this.state.state === 'won') {
      notify.textContent = `You Win!`
    }
    if (this.state.state === 'lost') {
      notify.textContent = `You Lose :(`
    }
    info.textContent = `Booms remaining to Flag: ${this.state.mines}`
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
      <>
        <header>
          <h1>Welcome to Boom Flagger</h1>
          <p>Click on New Game!</p>
          <button onClick={this.handleNewGame}>New Game</button>
          <table>
            <thead>
              <tr>
                <th colSpan={2}>How to play:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Left Click: Boom?</td>
                <td>Right Click: Flag</td>
              </tr>
            </tbody>
          </table>
          <section>Remaining Booms to Flag: 0</section>
        </header>
        <div className="container">
          {this.state.board.map((row, rowIndex) => {
            return row.map((cell, columnIndex) => {
              return (
                <div
                  className={this.nameCell(cell)}
                  key={columnIndex}
                  onClick={() => this.handleClickOnCell(rowIndex, columnIndex)}
                  onContextMenu={() =>
                    this.handleFlagOnCell(rowIndex, columnIndex)
                  }
                >
                  {cell}
                </div>
              )
            })
          })}
        </div>
      </>
    )
  }
}
