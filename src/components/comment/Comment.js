import React from 'react';
import axios from 'axios';

const handleDelete = (commentId) => {
  const body = {
    query: `
        mutation {
          deleteComment(commentId:  "${commentId}"){
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
  });
};

const handleSubmitComment = (r) => {
  console.log(r);
};

const CommentModal = props => {
  console.log(JSON.stringify(props.comment));
  return (<div className={'modal'}>
    <header className={'modal_header'}>
      <h1>Comments from this recipe</h1>
    </header>
    <ul>
      {
        props.comment.map((r, index) => {
          return (
            <li key={index}>
              <p>Comment: {r.comment}</p>
              <p>Create by: {r.creator._id}</p>
              <p>Rate: {r.rate}</p>
              {
                props.userId === r.creator._id ?
                  <button onClick={() => {
                    props.recall() &&
                    handleDelete(r._id);
                  }}>Delete</button> : null
              }
            </li>
          );
        })
      }
    </ul>
    <section className={'modal_actions'}>
      {/*{props.feedback && (*/}
        <div>
          <form onSubmit={handleSubmitComment()}>
            <input/>
            <button className={'btn'}>leave comment</button>
          </form>
        </div>
      {/*)}*/}
      {props.cancel && <button className={'btn'} onClick={props.modalCancel}>Cancel</button>}
    </section>
  </div>);
};

export default CommentModal;