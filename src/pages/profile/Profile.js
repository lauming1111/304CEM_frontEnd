import React, { Component } from 'react';
import axios from 'axios';
import AuthContext from '../auth/Auth-context';
import Spinner from '../../components/loading/Spinner';

class Profile extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      message: '',
      createdComments: [],
      createdRecipes: [],
    };
  }

  componentDidMount() {
    this.getProfile();
  }

  getProfile = () => {
    return axios.get(`http://localhost:5000/userid/${this.context.userId}`)
      .then(r => {
        if (!r.statusCode === 200 || r.statusCode === 201) {
          throw new Error('fetch error');
        }
        const data = r.data;
        this.setState({
          message: data.message,
          name: data.profile.name,
          email: data.profile.email,
          createdTimestamp: Date(data.profile.createdTimestamp),
          updateTimestamp: Date(data.profile.updateTimestamp),
          createdComments: data.profile.createdComments,
          createdRecipes: data.profile.createdRecipes,
        });
      });
  };

  render() {
    return (
      <div>
        <div>
          <h2>{this.state.message}</h2>
        </div>

        <div>
          <ul>
            <li><p>Your name: {this.state.name}</p></li>
            <li><p>Your email: {this.state.email}</p></li>
            <li><p>Created date: {this.state.createdTimestamp}</p></li>
            <li><p>Last updated time: {this.state.updateTimestamp}</p></li>
          </ul>

          <h3>Your Recipes</h3>
          <ul>
            {
              this.state.createdRecipes.map(r => <li>{r}</li>)
            }
          </ul>

          <h3>Your Comments</h3>
          <ul>
            {
              this.state.createdComments.map(r => <li>{r}</li>)
            }
          </ul>
        </div>

        <button className={'btn'} onClick={this.getProfile}>Refresh</button>
      </div>
    );
  }
}

export default Profile;