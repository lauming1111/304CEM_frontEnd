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
import RecipePage from './pages/recipe/Recipe';
import MainNav from './components/nav/Nav';
import Profile from './pages/profile/Profile';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userId: null,
      userEmail: null,
      name: null,
      tokenExpirationDate: null,
    };
  }


  login = (token, userId, userEmail, name, tokenExpirationDate) => {
    this.setState({
      token,
      userId,
      userEmail,
      name,
      tokenExpirationDate
    });
    console.log(this.state.token);
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
      userEmail: null,
      name: this.state.name,
      tokenExpirationDate: null,
    });
  };

  render() {
    const context = {
      token: this.state.token,
      userId: this.state.userId,
      userEmail: this.state.userEmail,
      name: this.state.name,
      login: this.login,
      logout: this.logout,
    };

    return (
      <div className="main-content">
        <BrowserRouter>
          <AuthContext.Provider value={context}>
            <MainNav/>
            <Switch>
              {!this.state.token && <Redirect from={'/'} to={'/auth'} exact/>}
              {!this.state.token && <Redirect from={'/userid'} to={'/auth'} />}
              {/*{!this.state.token && <Redirect from={'/recipes'} to={'/auth'} exact/>}*/}

              {this.state.token && <Redirect from={'/auth'} to={'/recipes'} exact/>}
              {/*<Route path={'/'} component={null}/>*/}
              {!this.state.token && <Route path={'/auth'} component={AuthPage}/>}
              <Route path={'/recipes'} component={RecipePage}/>
              <Route path={`/userid/${this.state.userId}`} component={Profile}/>
            </Switch>
          </AuthContext.Provider>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
