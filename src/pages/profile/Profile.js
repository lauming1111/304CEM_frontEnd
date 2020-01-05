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
      newUserName: '',
      createdComments: [],
      createdRecipes: [],
      success: ''
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

  updateName = () => {
    const data = {
      id: this.context.userId,
      new: this.state.newUserName
    };

    return axios.get(`http://localhost:5000/newUserName/${JSON.stringify(data)}`)
      .then(r => {
        console.log(r);
        if (!r.statusCode === 200 || r.statusCode === 201) {
          throw new Error('fetch error');
        }
        // const data = r.data;
        this.setState({
          success: 'Rename successfully'
        });
        this.getProfile();
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

          <h3>Your Recipes History</h3>
          <ul>
            {
              this.state.createdRecipes.map((r, index) => <li key={index}>{r}</li>)
            }
          </ul>

          <h3>Your Comments History</h3>
          <ul>
            {
              this.state.createdComments.map((r, index) => <li key={index}>{r}</li>)
            }
          </ul>
        </div>
        <p>{this.state.success}</p>
        <input onChange={e => this.setState({ newUserName: e.target.value })}/>
        <button className={'btn'} onClick={this.updateName}>Update your name</button>
      </div>
    );
  }
}

export default Profile;