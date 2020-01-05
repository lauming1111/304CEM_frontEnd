import React from 'react';

export default React.createContext({
  token: null,
  userId: null,
  userEmail: null,
  name: null,
  login: () => {
  },
  logout: () => {
  }
});
