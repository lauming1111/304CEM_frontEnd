import React, { Component } from 'react';
import axios from 'axios';
import './auth.css';
import AuthContext from './Auth-context';

class AuthPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isLogin: true,
      massage: '',
    };
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const email = this.emailRef.current.value;
    const password = this.passwordRef.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const signUpRequest = {
      query: `
        mutation {
          createUser(userInput: {name: "lm", email: "${email}", password: "${password}"}) {
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
          login(email:"${email}",password:"${password}"){
            userId
            token
            tokenExpirationDate
          }
        }
      `
    };


    return axios({
      method: 'post',
      url: 'http://localhost:5000/graphql',
      headers: {
        'Authorization': '',
        'Content-Type': 'application/json'
      },
      data: this.state.isLogin ? signUpRequest : signInRequest,
    })
      .then((r) => {
        if (r.status !== 200 && r.status !== 201) {
          throw new Error('Fail to create new user');
        }
        console.log(JSON.stringify(r, null, 2));
        if (r.data.data.login && r.data.data.login.token) {
          this.context.login(
            r.data.data.login.userId,
            r.data.data.login.token,
            r.data.data.login.tokenExpirationDate,
          );
        }
        if (r.data.data.createUser) {
          this.setState({ massage: 'Create new user' });
        }


      })
      .catch((e) => {
        console.log(e);
        throw new Error('Cannot fetch');
      });
  };

  handleSwitchMode = (e) => {
    console.log(this.state.isLogin);
    this.setState({
      isLogin: false
    });
  };

  render() {
    const message = `Switch to ${this.state.isLogin ? 'Sign Up' : 'Sign In'}`;
    return (
      <div>
        <a>{this.state.isLogin ? 'Sign Up' : 'Sign In'}</a>
        <br/>
        <a>{this.state.massage}</a>
        <form className={'auth-form'} onSubmit={this.handleSubmit}>
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
      </div>
    );
  }
}

export default AuthPage;