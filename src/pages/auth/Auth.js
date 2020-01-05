import React, { Component } from 'react';
import axios from 'axios';
import './auth.css';
import AuthContext from './Auth-context';

class AuthPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isSignIn: false,
      message: '',
    };
    this.nameRef = React.createRef();
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.emailRef.current.value;
    const name = (!this.state.isSignIn && this.nameRef.current.value) || null;
    const password = this.passwordRef.current.value;
    const encodedPassword = Buffer.from(password).toString('base64');
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const signUpRequest = {
      query: `
        mutation {
          createUser(userInput: {name: "${name}", email: "${email}", password: "${encodedPassword}"}) {
            name
            email
            password
          }
        }
      `
    };


    const signInRequest = {
      query: `
        query{
          login(email:"${email}",password:"${encodedPassword}"){
            userId
            email
            name
            token
            tokenExpirationDate
          }
        }
      `
    };

    console.log('this.state.isSignIn', this.state.isSignIn);
    return axios({
      method: 'post',
      url: 'http://localhost:5000/graphql',
      headers: {
        'Authorization': '',
        'Content-Type': 'application/json'
      },
      data: this.state.isSignIn ? signInRequest : signUpRequest,
    })
      .then((r) => {
        if (r.data.errors ||
          (r.data.errors && r.data.errors.length > 0)) {
          this.setState({
            message: r.data.errors[0].message
          });
        }
        if (r.status !== 200 && r.status !== 201) {
          throw new Error('Fail to create new user');
        }
        console.log('r.data.data.login', JSON.stringify(r.data.data.login));
        if (r.data.data.login && r.data.data.login.token) {
          // data field name
          this.context.login(
            r.data.data.login.token,
            r.data.data.login.userId,
            r.data.data.login.email,
            r.data.data.login.name,
            r.data.data.login.tokenExpirationDate,
          );
        }
        if (r.data.data.createUser) {
          this.setState({ message: 'Create new user successfully' });
        }

      })
      .catch((e) => {
        console.log(e);
        throw new Error('Cannot fetch');
      });
  };

  handleSwitchMode = (e) => {
    console.log('isSignIn ' + this.state.isSignIn);
    if (this.state.isSignIn) {
      this.setState({
        isSignIn: false
      });
    } else {
      this.setState({
        isSignIn: true
      });
    }
  };

  render() {
    const message = `Switch to ${this.state.isSignIn ? 'Sign Up' : 'Sign In'}`;
    return (
      <div>
        <div className={'headline'}>{this.state.isSignIn ? 'Sign In' : 'Sign Up'}</div>
        <br/>
        <form className={'auth-form'} onSubmit={this.handleSubmit}>
          {!this.state.isSignIn && (<div className={'form-control'}>
            <label htmlFor={'name'}>Username:</label>
            <input type={'name'} id={'name'} ref={this.nameRef}/>
          </div>)}

          <div className={'form-control'}>
            <label htmlFor={'email'}>Email:</label>
            <input type={'email'} id={'email'} ref={this.emailRef}/>
          </div>

          <div className={'form-control'}>
            <label htmlFor={'password'}>Passowrd:</label>
            <input type={'password'} id={'password'} ref={this.passwordRef}/>
          </div>

          <div className={'form-action'}>
            <button type={'button'} onClick={this.handleSwitchMode}>{message}</button>
            <button type={'submit'}>Submit</button>
          </div>
        </form>

        <a className={'message'}>{this.state.message}</a>
      </div>
    );
  }
}

export default AuthPage;