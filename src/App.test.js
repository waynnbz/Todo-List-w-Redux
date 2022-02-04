import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { combineReducers } from "@reduxjs/toolkit";
import { store } from "./app/store";
import App from "./App";

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
      // state.find((s) => s.id === action.id).completed = true;
      return state.map((t) => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter,
});

describe("A Todo List Reducer", () => {
  const stateBefore = [
    {
      id: 0,
      text: "Learn Redux",
      completed: false,
    },
  ];
  const toggle_action = {
    type: "TOGGLE_TODO",
    id: 0,
  };
  const add_action = {
    type: "ADD_TODO",
    id: 1,
    text: "Go shopping",
  };
  const stateAfterToggle = [
    {
      id: 0,
      text: "Learn Redux",
      completed: true,
    },
  ];
  const stateAfterAdd = [
    {
      id: 0,
      text: "Learn Redux",
      completed: false,
    },
    {
      id: 1,
      text: "Go shopping",
      completed: false,
    },
  ];

  Object.freeze(stateBefore);
  Object.freeze(add_action);
  Object.freeze(toggle_action);

  it("adding a todo", () => {
    expect(todos(stateBefore, add_action)).toEqual(stateAfterAdd);
  });

  it("toggling a todo", () => {
    expect(todos(stateBefore, toggle_action)).toEqual(stateAfterToggle);
  });
});
