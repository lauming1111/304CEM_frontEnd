import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../pages/auth/Auth-context';
import './nav.css';

const MainNav = props => (
  <AuthContext.Consumer>
    {(context) => <header className={'main-navigation'}>
      {/*{JSON.stringify(context)}*/}
      <div className={'main-navigation_logo'}>
        <h1>Homework</h1>
      </div>
      <nav className={'main-navigation_item'}>
        <ul>
          {context.token &&
          <li>
            <NavLink to={'/homeworks'}>Homework</NavLink>
          </li>
          }
          {
            !context.token && <li>
              <NavLink to={'/auth'}>Authenticate</NavLink>
            </li>
          }
        </ul>
      </nav>
    </header>}
  </AuthContext.Consumer>
);

export default MainNav;
