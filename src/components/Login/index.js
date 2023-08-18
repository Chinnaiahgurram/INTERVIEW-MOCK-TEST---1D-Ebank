import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {userIdInput: '', pinInput: ' ', errorMsg: '', showSubmitError: false}

  onSubmitForm = async event => {
    event.preventDefault()

    const {userIdInput, pinInput} = this.state
    const userDetails = {userIdInput, pinInput}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.renderSuccessView(data.jwt_token)
    } else {
      this.renderFailureView(data.error_msg)
    }
  }

  onChangeUserId = event => {
    this.setState({userIdInput: event.target.value})
  }

  onChangePin = event => {
    this.setState({pinInput: event.target.value})
  }

  renderInputField = () => {
    const {userIdInput} = this.state
    return (
      <>
        <div className="input-container">
          <label htmlFor="inputText">User Id</label>
          <input
            type="text"
            id="inputText"
            className="input-text"
            value={userIdInput}
            onChange={this.onChangeUserId}
            placeholder="Enter User Id"
          />
        </div>
      </>
    )
  }

  renderPasswordField = () => {
    const {pinInput} = this.state
    return (
      <>
        <div className="input-container">
          <label htmlFor="passwordText">PIN</label>
          <input
            type="password"
            id="passwordText"
            className="input-text"
            value={pinInput}
            onChange={this.onChangePin}
            placeholder="Enter PIN"
          />
        </div>
      </>
    )
  }

  renderSuccessView = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  renderFailureView = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  render() {
    const {errorMsg, showSubmitError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <div className="image-and-login-container">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <div className="login-container">
            <h1 className="login-heading">Welcome Back</h1>
            <form onSubmit={this.onSubmitForm}>
              {this.renderInputField()}
              {this.renderPasswordField()}
              <button type="submit" className="login-button">
                Login
              </button>
              {showSubmitError && <p>*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
