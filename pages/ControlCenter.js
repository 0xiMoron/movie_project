"use client";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import Search from "./search/search";
import WatchList from "./watchList/watchList";
import MyReviews from "./myReviews/myReviews";
import {
  setAndReturnLocalStorageArray,
  getLocalStorageArray,
  getLocalStorageVariable,
} from "@/utils/localStorageUtils";

import {
  SearchedMoviesStorage,
  SearchedMovieTitleStorage,
  WatchListedMoviesStorage,
} from "@/constants/constantVars";

export default function ControlCenter() {
  const [searchResults, setSearchResults] = useState([]);
  const [title, setTitle] = useState("");
  const [savedWatchList, setSavedWatchList] = useState([]);

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

  let updateDisplayedResults = () => {
    /// MIGHT NEED TO ADD A NULL CHECK
    let searchedMovies = getLocalStorageArray(SearchedMoviesStorage);
    setSearchResults(
      setAndReturnLocalStorageArray(SearchedMoviesStorage, searchedMovies)
    );

    let watchListedMovies = getLocalStorageArray(WatchListedMoviesStorage);
    setSavedWatchList(
      setAndReturnLocalStorageArray(WatchListedMoviesStorage, watchListedMovies)
    );
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
        <Tab>Your Reviews</Tab>
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
        <TabPanel>c</TabPanel>
        <TabPanel>
          <MyReviews
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
