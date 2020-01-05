import React from 'react';
import './recipeItem.css';
import axios from 'axios';
import Comment from '../comment/Comment';

const RecipeItem = (props) => {
  const recipe = props.data;
  const userId = props.userId;
  let temp;
  let tempComment;
  let tempUpdateComment;

  const handleDeleteRecipe = (id) => {
    console.log(id);
    const body = {
      id
    };
    return axios({
      method: 'delete',
      url: 'http://localhost:5000/deleteRecipe',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body,
    }).then((r) => {
      console.log(JSON.stringify(r, null, 2));
      if (r.data && r.data.message === 'ok') {
        return props.getRecipe();
      }
    });
  };

  const handleUpdateRecipe = (id, data) => {
    console.log(id);
    const body = {
      id,
      data
    };
    return axios({
      method: 'put',
      url: 'http://localhost:5000/updateRecipe',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body,
    }).then((r) => {
      console.log(JSON.stringify(r, null, 2));
      if (r.data && r.data.message === 'ok') {
        return props.getRecipe();
      }
    });
  };

  const handleCreateComment = (recipeId) => {
    const body = {
      query: `
        mutation {
          createComments(commentInput: {
              comment: "${tempComment}"
              rate:1
              recipeId:"${recipeId}"
          }) {
            comment
            rate
          recipeId
          }
        }
      `
    };
    console.log(JSON.stringify(body, null, 2));
    return axios({
      method: 'POST',
      url: 'http://localhost:5000/graphql',
      headers: {
        'Authorization': `public!_*_!${props.token}`,
        'Content-Type': 'application/json'
      },
      data: body,
    }).then((r) => {
      console.log(JSON.stringify(r, null, 2));
      if (r.statusText === 'OK' || r.statusCode === 200) {
        tempComment = '';
        return props.recallComment();
      }
    })
      .catch((e) => {
        console.log(e);
      });

  };

  const handleDeleteComment = (recipeId) => {
    console.log(recipeId);
    return axios({
      method: 'delete',
      url: 'http://localhost:5000/deleteComment',
      headers: {
        'Authorization': `public!_*_!${props.token}`,
        'Content-Type': 'application/json'
      },
      data: {
        recipeId
      },
    }).then((r) => {
      console.log(JSON.stringify(r, null, 2));
      if (r.data && r.data.message === 'ok') {
        return props.recallComment();
      }
    })
      .catch((e) => {
        console.log(e);
      });

  };

  const handleUpdateComment = (id, data) => {
    console.log(id, data);
    const body = {
      id,
      data
    };
    return axios({
      method: 'put',
      url: 'http://localhost:5000/updateComment',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body,
    }).then((r) => {
      console.log(JSON.stringify(r, null, 2));
      if (r.data && r.data.message === 'ok') {
        tempUpdateComment = '';
        return props.recallComment();
      }
    });
  };

  return (
    <li key={recipe._id} className={'recipe-list_item'}>
      <div>
        <h1>Name: {recipe.name}</h1>
        <h2>Creator: {recipe.creator.name}</h2>
        <h2>Context: {recipe.context}</h2>
        <div className={'recipe-list_item_div'}>
          <p>Created by: {recipe.createdTimestamp}</p>
          <p>Last update time: {recipe.updateTimestamp}</p>
        </div>
      </div>

      < div className={'btn_list'}>
        {userId === recipe.creator._id &&
        <div>
          <input onChange={(e) => {
            temp = e.target.value;
          }}/>
          <button className={'btn'} onClick={() => handleUpdateRecipe(recipe._id, temp)}>Edit Recipe context</button>
          <button className={'btn'} onClick={() => handleDeleteRecipe(recipe._id)}>Delete</button>
        </div>
        }

        <div>
          <ul>
            {
              props.getComment ? props.getComment.map((r, index) => (
                <li key={index}>
                  <div>
                    <p>Rate: {r.rate}</p>
                    <p>Comment: {r.comment}</p>
                    <p>Creator: {r.creator && r.creator.name}</p>

                    {r.creator && r.creator._id === userId && <input onChange={(e) => {
                      tempUpdateComment = e.target.value;
                    }}/>}
                    {r.creator && r.creator._id === userId &&
                    <button onClick={() => handleDeleteComment(r._id)}>Delete</button>}
                    {r.creator && r.creator._id === userId &&
                    <button onClick={() => handleUpdateComment(r._id, tempUpdateComment)}>update</button>}
                  </div>
                </li>
              )) : <a>no comment</a>
            }
          </ul>
          {userId && <input onChange={(e) => {
            tempComment = e.target.value;
          }}/>}
          {userId && <button className={'btn'} onClick={() => handleCreateComment(recipe._id)}>add comment</button>}
        </div>
      </div>
    </li>
  );
};
export default RecipeItem;