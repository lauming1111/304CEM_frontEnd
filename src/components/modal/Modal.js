import React from 'react';
import './modal.css';

const Modal = props => (

  <div className={'modal'}>
    <header className={'modal_header'}>
      <h1>{props.title}</h1>
    </header>
    <section className={'modal_content'}>
      {props.children && <a>{props.children}</a>}
    </section>
    <section className={'modal_actions'}>
      {props.confirm && <button className={'btn'} onClick={props.modalConfirm}>Confirm</button>}
      {props.cancel && <button className={'btn'} onClick={props.modalCancel}>Cancel</button>}
    </section>
  </div>
);

export default Modal;