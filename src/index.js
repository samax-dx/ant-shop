import './index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import { interpret } from 'xstate';

import { App } from './App';
import { AppMachine } from './machines/AppMachine';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
    <React.StrictMode>
        <App actor={interpret(AppMachine).start()} />
    </React.StrictMode>,
    document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// class ActorNode {
//   constructor() {
//       this.value = null
//       this._prev = null;
//   }
//   nextNode() {
//       const node = new ActorNode();
//       node._prev = this;
//       node.value = this.value && this.value.getSnapshot().context.actor;
//       return node;
//   }
//   prevNode() {
//       return this._prev;
//   }
// }

// const appActorNode = (node => {
//   return () => {
//       if (node.value === null) {
//           node.value = interpret(AppMachine).start();
//       }
//       return node;
//   };
// })(new ActorNode());
