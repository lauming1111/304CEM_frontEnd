import React from 'react';
import './recipeList.css';
import RecipeItem from './recipeItem';

const RecipeList = (props) => {
  return (
    <ul className={'recipe-list'}>
      {
        props.recipes.map(recipe => {
          return <RecipeItem key={recipe._id} data={recipe} userId={props.auth} getRecipe={props.getRecipe}
                             token={props.token} getComment={props.getComment} recallComment={props.recallComment}/>;
        })
      }
    </ul>
  );
};


export default RecipeList;