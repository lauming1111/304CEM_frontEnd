import React, { Component } from 'react';
import './recipe.css';
import Modal from '../../components/modal/Modal';
import Backdrop from '../../components/backdrop/Backdrop';
import axios from 'axios';
import AuthContext from '../auth/Auth-context';
import './recipe.css';
import RecipeList from '../../components/recipeList/recipeList';
import Spinner from '../../components/loading/Spinner';
import CommentModal from '../../components/comment/Comment';

class RecipePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      recipes: [],
      comments: [],
      isLoading: false,
      message: '',
      showComment: false
    };
    this.nameElRef = React.createRef();
    this.contextElRef = React.createRef();
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.getRecipe();
    this.getComment();
  }

  getRecipe = () => {
    this.setState({ isLoading: true });
    const request = {
      query: `
        query {
          recipes {
            _id
            name
            context
            createdTimestamp
            updateTimestamp
            creator {
              _id
              email
              name
            }
          }
        }
      `
    };

    return axios({
      method: 'post',
      url: 'http://localhost:5000/graphql',
      headers: {
        // 'Authorization': `public!_*_!${token}`,
        'Content-Type': 'application/json'
      },
      data: request,
    })
      .then((r) => {
        if (r.status !== 200 && r.status !== 201) {
          throw new Error('Fail to get recipe');
        }
        const recipes = r.data.data.recipes;
        this.setState({
          recipes,
          isLoading: false,
        });

      })
      .catch((e) => {
        console.log(e);
        this.setState({ isLoading: false });
        throw new Error('Cannot get recipes');
      });

  };

  getComment = () => {
    const body = {
      query: `
          query {
            comments {
              _id
              rate
              comment
              creator{
                _id
              }
            }
          }
        `
    };

    return axios({
      method: 'post',
      url: 'http://localhost:5000/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body,
    })
      .then((r => {
        if (r.status !== 200 && r.status !== 201) {
          throw new Error('Fail to get comments');
        }
        console.log(r);

        this.setState({
          comments: r.data.data.comments
        });
      }))
      .catch((e) => {
        console.log(e);
        throw e;
      });
  };

  handleCreateRecipe = () => {
    this.setState({
      creating: true
    });
  };

  handleDeleteRecipe = (id) => {
    console.log(id);
    const body = {
      query: `
        mutation {
          deleteRecipe(recipeId:  "${id}"){
              _id
          }
        }
`
    };
    return axios({
      method: 'post',
      url: 'http://localhost:5000/graphql',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body,
    }).then(() => this.getRecipe());
  };


  handleModalConfirm = () => {
    this.setState({
      creating: false
    });

    const name = this.nameElRef.current.value;
    const recipeContext = this.contextElRef.current.value;
    const token = this.context.token;
    console.log('1111' + token, JSON.stringify(this.context));
    if (name.trim().length === 0) {
      throw new Error('Cannot add null');
    }
    if (!token) {
      throw new Error('Please login first');
    }

    const request = {
      query: `
        mutation {
          createRecipes(recipeInput: {name: "${name}" context:"${recipeContext}"}) {
            _id
            name
            context
            createdTimestamp
            updateTimestamp
          }
        }
      `
    };

    return axios({
      method: 'post',
      url: 'http://localhost:5000/graphql',
      headers: {
        'Authorization': `public!_*_!${token}`,
        'Content-Type': 'application/json'
      },
      data: request,
    })
      .then((r) => {
        console.log(r);
        if (r.data.error) {
          this.setState({
            message: JSON.stringify(r.error)
          });
        }

        if (r.status !== 200 && r.status !== 201) {
          throw new Error('Fail to create recipe');
        }

        this.setState(prevState => {
          const newRecipe = [
            ...prevState.recipes,
            {
              _id: r.data.data.createRecipes._id,
              name: r.data.data.createRecipes.name,
              context: r.data.data.createRecipes.context,
              createdTimestamp: r.data.data.createRecipes.createdTimestamp,
              updateTimestamp: r.data.data.createRecipes.updateTimestamp,
              creator: {
                _id: this.context.userId,
                email: this.context.userEmail,
                name: this.context.name,
              }
            }
          ];
          return { recipes: newRecipe };
        });

      })
      .catch((e) => {
        console.log(e);
        throw new Error('Cannot fetch');
      });

  };

  handleModalCancel = () => {
    this.setState({
      creating: false,
      showComment: false,
    });
  };


  render() {
    return (
      <React.Fragment>
        {
          this.state.message
        }
        {this.state.creating && <Backdrop/>}
        {this.state.creating &&
        <Modal title={'Recipe'}
               confirm
               cancel
               modalConfirm={this.handleModalConfirm}
               modalCancel={this.handleModalCancel}>

          <form>
            <div className={'form-control'}>
              <label htmlFor={'name'}>name(title):</label>
              <input type={'name'} id={'name'} ref={this.nameElRef}/>
            </div>
            <div className={'form-control'}>
              <label htmlFor={'context'}>context:</label>
              <input type={'context'} id={'context'} ref={this.contextElRef}/>
            </div>
          </form>
        </Modal>}

        <button className={'btn'} onClick={() => this.setState({
          showComment: true,
        })}>View Comments
        </button>

        {this.state.showComment && (<CommentModal comment={this.state.comments}
                                                  userId={this.context.userId}
                                                  handleDelete={this.handleDelete}
                                                  recall={this.getComment}
                                                  cancel
                                                  modalCancel={this.handleModalCancel}
        />)}


        {
          this.context.token
          && (<div className={'recipe-control'}>
            <p>Share your recipe to people who need help.</p>
            <button className={'btn'} onClick={this.handleCreateRecipe}>Create</button>
          </div>)
        }
        {
          this.state.isLoading ? (<Spinner/>) : (
            <RecipeList recipes={this.state.recipes} comments={this.state.comments} auth={this.context.userId}
                        delete={this.handleDeleteRecipe}/>
          )
        }

      </React.Fragment>
    );
  }
}

export default RecipePage;