import React from 'react'

export default class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      message: 'Hey BACKGROUND!!!',
    }
    this.clickHandler = this.clickHandler.bind(this)
  }

  componentDidMount() {}

  clickHandler(e) {
    console.log(e.target.value)
    chrome.runtime.sendMessage({ type: 'BOROUGH', borough: e.target.value })
  }

  boroughHandler(e) {
    e.preventDefault()
  }

  render() {
    return (
      <div className="d-flex flex-column">
        <div className="flex-item">
          <h3 className="text-center align-center">What Borough are you searching in?</h3>
          <select onChange={this.clickHandler} className="text-center btn btn-primary align-middle">
            <option value="MANHATTAN">Manhattan</option>
            <option value="BROOKLYN">Brooklyn</option>
            <option value="QUEENS">Queens</option>
            <option value="BRONX">Bronx</option>
            <option value="STATEN ISLAND">Staten Island</option>
          </select>
        </div>
        <div className="flex-item">
          <h3 className="text-center">What are you interested in seeing? </h3>
          <div class="form-check align-middle">
            <input
              class="form-check-input"
              type="checkbox"
              value="three11"
              id="three11Check"
            />
            <label class="form-check-label" for="three11Check">
              311 complaints
            </label>{' '}
            <br />
            <input
              class="form-check-input"
              type="checkbox"
              value="Grocery"
              id="defaultCheck1"
            />
            <label class="form-check-label" for="groceryCheck">
              Local Grocery Stores
            </label>
          </div>
        </div>
      </div>
    )
  }
}
