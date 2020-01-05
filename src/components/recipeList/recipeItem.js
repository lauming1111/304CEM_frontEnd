import React from 'react';
import './recipeItem.css';
import axios from 'axios';

const RecipeItem = (props) => {
  const recipe = props.data;
  const userId = props.userId;

  return (
    <li key={recipe._id} className={'recipe-list_item'}>
      <div>
        <h1>Name: {recipe.name}</h1>
        <h2>Creator: {recipe.creator.name}</h2>
        <div className={'recipe-list_item_div'}>
          <p>Created by: {recipe.createdTimestamp}</p>
          <p>Last update time: {recipe.updateTimestamp}</p>
        </div>
      </div>
      <div className={'btn_list'}>
        {userId === recipe.creator._id &&
        <div>
          <button className={'btn'}>Edit</button>
          <button className={'btn'} onClick={props.delete(recipe.id)}>Delete</button>
        </div>
        }
      </div>
    </li>
  );
};
export default RecipeItem;