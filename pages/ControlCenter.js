"use client";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import Search from "./search/search";
import WatchList from "./watchList/watchList";
import Watched from "./watched/watched";
import {
  setAndReturnLocalStorageVariable,
  getLocalStorageArray,
  getLocalStorageVariable,
} from "@/utils/localStorageUtils";

import {
  SearchedMoviesStorage,
  SearchedMovieTitleStorage,
  WatchListedMoviesStorage,
  WatchedMoviesStorage,
} from "@/constants/constantVars";

export default function ControlCenter() {
  const [searchResults, setSearchResults] = useState([]);
  const [title, setTitle] = useState("");
  const [savedWatchList, setSavedWatchList] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);

  useEffect(() => {
    /// REMEMBER AND TRIPLE CHECK FOR THE UNDEFINED ERROR
    let searchedMovies = getLocalStorageArray(SearchedMoviesStorage);
    if (searchedMovies !== null) {
      updateDisplayedResults();
    }
    let searchedMovieTitle = getLocalStorageVariable(SearchedMovieTitleStorage);
    if (searchedMovieTitle !== null) {
      setTitle(searchedMovieTitle);
    }
  }, []);

  let updateSearchedMovieDisplay = () => {
    setSearchResults(getLocalStorageArray(SearchedMoviesStorage));

    let searchedMovieTitle = getLocalStorageVariable(SearchedMovieTitleStorage);
    if (searchedMovieTitle !== null) {
      setTitle(searchedMovieTitle);
    } else {
      setTitle(setAndReturnLocalStorageVariable(SearchedMovieTitleStorage, ""));
    }
  };

  let updateWatchListedMovies = () => {
    setSavedWatchList(getLocalStorageArray(WatchListedMoviesStorage));
  };

  let updateWatchedMovies = () => {
    setWatchedMovies(getLocalStorageArray(WatchedMoviesStorage));
  };

  let updateDisplayedResults = () => {
    /// NEED TO ADD A NULL CHECK?
    updateSearchedMovieDisplay();
    updateWatchListedMovies();
    updateWatchedMovies();
  };

  return (
    <Tabs
      isFitted
      variant="soft-rounded"
      colorScheme="green"
      onChange={updateDisplayedResults}>
      <TabList>
        <Tab>Search</Tab>
        <Tab>WatchList</Tab>
        <Tab>Watched</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Search
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            title={title}
            setTitle={setTitle}
          />
        </TabPanel>
        <TabPanel>
          <WatchList
            savedWatchList={savedWatchList}
            setSavedWatchList={setSavedWatchList}
          />
        </TabPanel>
        <TabPanel>
          <Watched
            watchedMovies={watchedMovies}
            setWatchedMovies={setWatchedMovies}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
