import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from "redux-devtools-extension";

import comments from './modules/comments'

export const history = createBrowserHistory();

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  comments,
})

const store = createStore(
  createRootReducer(history),
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history),
      thunk,
    )
  )
);

export default store
