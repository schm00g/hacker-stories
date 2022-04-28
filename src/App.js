import * as React from 'react';
import axios from 'axios';

import './App.css';
import { ReactComponent as Check } from './check.svg';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const useSemiPersistentState = (key, initialState) => {
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  
  React.useEffect(() => {
    if(!isMounted.current){
      isMounted.current = true;
    } else {
      localStorage.setItem(key, value);
    }
  }, [value, key]);

  return [value, setValue];
}

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter((story) =>
          action.payload.objectID !== story.objectID
        )
      };
    default: 
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError: false}
  );

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({type: 'STORIES_FETCH_INIT'});

    try {
      const result = await axios.get(url);
  
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      });
    } catch {
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
    }
  }, [url]);
  
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = React.useCallback((item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }, []);
    
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }
  
  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  }

  return (
    <div className="container">
      <h1 className="headline-primary">Hacker Stories</h1>
      <SearchForm 
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
      {stories.isError && <p>Something went wrong...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
        ) : (
          <List list={stories.data} onRemoveItem={handleRemoveStory}/>
        )}
    </div> 
  )
};

const InputWithLabel = ({
    id, 
    value, 
    type='text', 
    onInputChange,
    isFocused,
    children
  }) => {
    const inputRef = React.useRef();

    React.useEffect(() => {
      if(isFocused && inputRef.current){
        inputRef.current.focus();
      }
    }, [isFocused]);
  return (
    <>
      <label htmlFor={id} className="label">
        {children}
      </label>
      &nbsp;
      <input
        ref={inputRef} 
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
        className="input"
      />
    </>
  );
  }

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      onInputChange={onSearchInput}
      isFocused
    >
        <strong>Search</strong>
    </InputWithLabel>
    <button 
      type="submit" 
      disabled={!searchTerm}
      className="button button_large"
    > 
      <Check height="18px" width="18px"/>
    </button>
  </form>
);

const List = React.memo(({list, onRemoveItem}) => (
    <div>
    <ul>
      {list.map((item) => (
        <Item 
        key={item.objectID} 
        item={item} 
        onRemoveItem={onRemoveItem}/>
      ))}
    </ul>
  </div>
  )
);

const Item = ({item, onRemoveItem}) => {
  return (
    <li className="item">
      <span style={{width: '50%'}}>
        <a target="_blank" href={item.url}>{item.title}</a>
      </span>
      <span style={{width: '15%'}}>@{item.author}</span>
      <span style={{width: '15%'}}>{item.num_comments} comments</span>
      <span style={{width: '10%'}}>{item.points} points</span>
      <span style={{width: '10%'}}>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Remove
        </button>
      </span>
    </li>
  );
}

export default App;

// page 164
