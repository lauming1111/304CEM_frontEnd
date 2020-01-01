import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter,
  Redirect,
  Switch,
  Route,
} from 'react-router-dom';
// import { Router, Route, Switch } from 'react-router';
import AuthPage from './pages/auth/Auth';
import AuthContext from './pages/auth/Auth-context';
import HomeworkPage from './pages/homework/Homework';
import MainNav from './components/nav/Nav';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userId: null,
      tokenExpirationDate: null,
    };
  }


  login = (userId, token, tokenExpirationDate) => {
    console.log(userId, token, tokenExpirationDate);

    this.setState({
      token,
      userId,
      tokenExpirationDate
    });
    console.log(this.state.token);
  };

  logout = () => {
    // this.setState({
    //   token: null,
    //   userId: null,
    //   tokenExpirationDate: null,
    // });
  };

  render() {
    const context = {
      userId: this.state.userId,
      token: this.state.token,
      login: this.login,
      logout: this.logout,
    };
    console.log('token', this.state.token);
    return (
      <div className="main-content">
        <BrowserRouter>
          <AuthContext.Provider value={context}>
            <MainNav/>
            <Switch>
              {!this.state.token && <Redirect from={'/'} to={'/auth'} exact/>}
              {!this.state.token && <Redirect from={'/homeworks'} to={'/auth'} exact/>}
              {this.state.token && <Redirect from={'/auth'} to={'/homeworks'} exact/>}
              {/*<Route path={'/'} component={null}/>*/}
              {!this.state.token && <Route path={'/auth'} component={AuthPage}/>}
              {this.state.token && <Route path={'/homeworks'} component={HomeworkPage}/>}
            </Switch>
          </AuthContext.Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
