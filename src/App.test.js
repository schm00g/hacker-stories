import * as React from 'react';
import App, {storiesReducer, SearchForm, InputWithLabel, List, Item} from './App.tsx';

const storyOne = {
  title: 'Redux',
  url: '',
  author: 'Dan Abramov, Andrew Clarke',
  num_comments: 2,
  points: 5,
  objectID: 1
}

const storyTwo = {
  title: 'React',
  url: '',
  author: 'Jorge Walke',
  num_comments: 3,
  points: 3.9,
  objectID: 2
}

const stories = [storyOne, storyTwo];

describe('something truthy and falsy', () => {
  test('true to be true', () => {
    expect(true).toBe(true);
  });

  test('expect false to be false', () => {
    expect(false).toBe(false);
  });
});


describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action = {type: 'REMOVE_STORY', payload: storyOne};

    const state = {data: stories, isLoading: false, isError: false};

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo], 
      isLoading: false, 
      isError: false
    };

    expect(newState).toStrictEqual(expectedState);
  });
});