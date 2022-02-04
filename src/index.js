import React, { useState, useRef, Component } from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import "./index.css";
import { combineReducers, createStore } from "@reduxjs/toolkit";
import * as serviceWorker from "./serviceWorker";

// Actions
const setVisibilityFilter = (filter) => {
  return {
    type: "SET_VISIBILITY_FILTER",
    filter,
  };
};

const toggleTodo = (id) => {
  return { type: "TOGGLE_TODO", id };
};

let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: "ADD_TODO",
    id: nextTodoId++,
    text,
  };
};

// Reducers
const todo = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed,
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];
    case "TOGGLE_TODO":
      return state.map((t) => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter; //returns the filter as the new visiblity state
    default:
      return state;
  }
};

// Combined reducer on which the store is created
const todoApp = combineReducers({
  todos,
  visibilityFilter,
});

// PRESENTATION COMPONENTS
// Add Todo Input & Button
let AddTodo = ({ dispatch }) => {
  // local var is used in video, how about useRef()? it also works but which is more appropriate?
  const inputRef = useRef(null);

  return (
    <div>
      <input ref={inputRef}></input>
      <button onClick={(text) => dispatch(addTodo(inputRef.current?.value))}>
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

// Rendering Todo List
const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{ textDecoration: completed ? "line-through" : "none" }}
  >
    {text}
  </li>
);

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map((todo) => (
      // the id is consumed at this List level, no need to pass further
      <Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
    ))}
  </ul>
);

// generating the container component using 'connect'
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter),
  };
};
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => dispatch(toggleTodo(id)),
  };
};
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);

// Filter Selector Footer
const Link = ({ active, onClick, children }) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="/#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
};

const mapStateToFooterLinkProps = (state, ownProps) => {
  return {
    active: state.visibilityFilter === ownProps.filter,
  };
};
const mapDispatchToFooterLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => dispatch(setVisibilityFilter(ownProps.filter)),
  };
};
const FilterLink = connect(
  mapStateToFooterLinkProps,
  mapDispatchToFooterLinkProps
)(Link);

const Footer = ({ visibilityFilter, onFilterClick }) => (
  <p>
    Show: <FilterLink filter="SHOW_ALL">All</FilterLink>
    {", "}
    <FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
    {", "}
    <FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
  </p>
);

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_COMPLETED":
      return todos.filter((t) => t.completed);
    case "SHOW_ACTIVE":
      return todos.filter((t) => !t.completed);
    default:
      return todos;
  }
};

// Main App
const TodoApp = ({ todos, visibilityFilter }) => (
  <div>
    <AddTodo />

    <VisibleTodoList />

    <Footer />
  </div>
);

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
