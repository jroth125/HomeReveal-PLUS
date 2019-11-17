import React from 'react'

export default class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      message: 'Hey BACKGROUND!!!'
    }
    this.clickHandler = this.clickHandler.bind(this)
  }

  componentDidMount() {
      
  }

  clickHandler(e) {
      console.log(e.target.value)
      chrome.runtime.sendMessage({type: 'BOROUGH', borough: e.target.value})

  }

  boroughHandler(e) {
      e.preventDefault()
      

  }

  render() {
    return (
      <div>
        <h1>What borough do you live in?</h1>
        <select onChange={this.clickHandler}>
          <option value="MANHATTAN">Manhattan</option>
          <option value="BROOKLYN">Brooklyn</option>
          <option value="QUEENS">Queens</option>
          <option value="BRONX">Bronx</option>
          <option value="STATEN ISLAND">Staten Island</option>
        </select>
      </div>
    )
  }
}
