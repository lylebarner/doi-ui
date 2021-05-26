import React, {useEffect, useState, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import {useDispatch, useSelector} from "react-redux";
import rootActions from "../actions/rootActions";


const useStyles = makeStyles((theme) => ({
  searchBar: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 500,
    marginTop: '1em',
    marginBottom: '2em'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  }
}));

const SearchBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [identifier, setIdentifier] = useState('');
  
  const searchIdentifier =  useSelector(state => {
    return state.appReducer.searchIdentifier;
  });

  const handleInputChange = (event) => {// console.log(event.target.value.trim());
    setIdentifier(event.target.value.trim());

    // doesn't need immediate listener unless real-time filter on user type
    // dispatch(rootActions.appAction.setSearchIdentifier(event.target.value.trim()));
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };
  
  const handleSearch = () => {
    dispatch(rootActions.appAction.setIsSearching(true));
    dispatch(rootActions.appAction.sendSearchRequest(identifier));
  };

  const handleClear = () => {
    dispatch(rootActions.appAction.resetSearch());
  };

  useEffect(() => {
    setIdentifier(searchIdentifier);
  }, [searchIdentifier]);
  
  return (
      <>
        <Paper component="form" className={classes.searchBar}>
          <InputBase
              placeholder='Search by DOI, LID, LIDVID, or PDS3 Data Set ID'
              className={classes.input}
              value={identifier ? identifier : ''}
              inputProps={{ 'aria-label': 'Search identifier' }}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
          />
          <IconButton
              className={classes.iconButton}
              aria-label="search"
              onClick={handleSearch}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
              className={classes.iconButton}
              aria-label="clear"
              onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        </Paper>
      </>
  )
};

export default SearchBar;