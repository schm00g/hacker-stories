import * as React from 'react';
import App, {storiesReducer, SearchForm, InputWithLabel, List, Item} from './App.tsx';
import {
  render,
  screen,
  fireEvent,
  act
} from '@testing-library/react';

const storyOne = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov',
  num_comments: 2,
  points: 5,
  objectID: 1
}

const storyTwo = {
  title: 'React',
  url: 'https://reactjs.org/',
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

  test('initializes story fetch', () => {
    const action = {type: 'STORIES_FETCH_INIT'};

    const state = {data: [], isLoading: false, isError: false};

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [], 
      isLoading: true, 
      isError: false
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test('stories fetch success', () => {
    const action = {type: 'STORIES_FETCH_SUCCESS', payload: stories};

    const state = {data: [], isLoading: true, isError: false};

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: stories, 
      isLoading: false, 
      isError: false
    };

    expect(newState).toStrictEqual(expectedState);
  });

  test('stories fetch failure', () => {
    const action = {type: 'STORIES_FETCH_FAILURE'};

    const state = {data: [], isLoading: true, isError: false};

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [], 
      isLoading: false, 
      isError: true
    };

    expect(newState).toStrictEqual(expectedState);
  })
});

describe('Item', () => {
  test('renders all properties', () => {
    render(<Item item={storyOne}/>);

    screen.debug();

    expect(screen.getByText('Dan Abramov')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toHaveAttribute(
      'href',
      'https://redux.js.org/'
    );
  });

  test('renders a clickable remove button', () => {
    render(<Item item={storyTwo}/>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('clicking the dismiss button calls the callback handler', () => {
    const handRemoveItem = jest.fn();

    render(<Item item={storyOne} onRemoveItem={handRemoveItem}/>);

    fireEvent.click(screen.getByRole('button'));

    expect(handRemoveItem).toHaveBeenCalledTimes(1);
  })
});

describe('Search Form', () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn()
  }

  test('renders the input field with its values', () => {
    render(<SearchForm {...searchFormProps}/>);

    // screen.debug();

    expect(screen.getByDisplayValue('React')).toBeInTheDocument();

    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  test('calls onSearchInput on input field change', () => {
    render(<SearchForm {...searchFormProps}/>);

    fireEvent.change(screen.getByDisplayValue('React'), {
      target: {value: 'Redux'}
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });
})