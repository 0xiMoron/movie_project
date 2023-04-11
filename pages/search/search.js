"use client";

import React from "react";
import {
  Input,
  IconButton,
  Card,
  Heading,
  CardBody,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";
import styles from "@/styles/Home.module.css";
import {
  setLocalStorageVariable,
  setAndReturnLocalStorageArray,
  deleteLocalStorageVariable,
} from "@/utils/localStorageUtils";
import { SearchIcon, AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { useState } from "react";
import {
  SearchedMoviesStorage,
  SearchedMovieTitleStorage,
} from "@/constants/constantVars";
import {
  findMovieInWatchList,
  saveMovieToWatchList,
  deleteMovieFromWatchList,
} from "@/utils/watchListUtils";

import { toggleSearchedMoviesWatchListing } from "@/utils/searchResultsUtils";

export default function Search({
  searchResults,
  setSearchResults,
  title,
  setTitle,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOccurred, toggleErrorOccurred] = useState(false);
  const [alertThrown, toggleAlert] = useState(false);
  const [cardAlert, setCardAlert] = useState("");
  const [isLoading, toggleIsLoading] = useState(false);

  let displayCardAlert = (movie) => {
    toggleAlert(true);
    movie.WatchListed
      ? setCardAlert("Added to WatchList!")
      : setCardAlert("Removed from WatchList");

    // alert Timeout
    setTimeout(() => {
      toggleAlert(false);
    }, 2000);
  };

  let clearSearch = () => {
    setSearchResults([]);
    setTitle("");
    deleteLocalStorageVariable(SearchedMoviesStorage);
    deleteLocalStorageVariable(SearchedMovieTitleStorage);
  };

  let handleToggleWatchListEvent = async (event, movie) => {
    // update the displayed movie card
    toggleSearchedMoviesWatchListing(movie);

    // add to watchlist using watchlist utils
    movie.WatchListed
      ? deleteMovieFromWatchList(movie)
      : saveMovieToWatchList(movie);

    // display alert and update stored searched Movies
    await displayCardAlert(movie);
  };

  // Ideally I would have started with TypeScript and made this a Movie Interface and...
  /// ...would make this a Movie type Array. But I started in Javascript and felt that...
  //// ... it would be a lot to change last minute...

  let saveAndDisplaySearchResults = (res) => {
    /// when a movie is not detected the API does not return an Error, instead it returns...
    //// the response property as a string "False". So I made two seperate error handlers
    if (res.Response === "False") {
      toggleErrorOccurred(true);
      setErrorMessage(res.Error);
      clearSearch();
      return;
    }

    let movieList = [];
    res.map((movie, i) => {
      // this is to check the MovieListed movies status just to keep the data consistent
      let movieInWatchList = findMovieInWatchList(movie);
      if (movie.Type === "movie" && movieInWatchList === null) {
        movie.Review = 0;
        movie.WatchListed = false;
        movie.Watched = false;

        movieList.push(movie);
      }
      if (movieInWatchList !== null) {
        movieList.push(movieInWatchList);
      }
    });
    // set the local storage array so we can keep the results on refresh
    let searchedMovies = setAndReturnLocalStorageArray(
      SearchedMoviesStorage,
      movieList
    );

    // set storage variables
    setLocalStorageVariable(SearchedMovieTitleStorage, title);
    setSearchResults(searchedMovies);
  };

  let sendSearchRequest = async (event) => {
    // This is to prevent the refresh and routing to the called api
    event.preventDefault();
    // If there is a displayed error this will shut it off
    toggleErrorOccurred(false);

    // turn on the spinner
    toggleIsLoading(true);

    // setting the request to post made it really easy to pass the title as a body
    const requestRes = await fetch("api/searchMovies", {
      method: "POST",
      body: title,
    });

    // turn off the spinner
    toggleIsLoading(false);

    const movieReqRes = await requestRes.json();
    saveAndDisplaySearchResults(movieReqRes);
  };

  return (
    <>
      {errorOccurred ? (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}
      <section>
        <form
          className={styles.searchBar}
          method="post"
          onSubmit={sendSearchRequest}>
          <Input
            variant="filled"
            placeholder="Search for a movie!"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <IconButton
            type="submit"
            className={styles.searchButton}
            aria-label="Search"
            icon={<SearchIcon />}
          />
          <IconButton
            className={styles.searchButton}
            aria-label="Search"
            icon={<SmallCloseIcon />}
            onClick={clearSearch}
          />
        </form>
      </section>

      {alertThrown ? (
        <Alert status="success">
          <AlertIcon />
          <AlertDescription maxWidth="sm">{cardAlert}</AlertDescription>
        </Alert>
      ) : null}

      {isLoading ? (
        <Spinner
          className={styles.spinner}
          thickness="4px"
          size="xl"
          marginTop="15vh"
          marginLeft="40vw"
        />
      ) : null}
      <section className={styles.cardDisplay}>
        {searchResults !== [] &&
        searchResults !== null &&
        typeof searchResults !== "undefined"
          ? searchResults.map((el, i) => {
              return (
                <Card className={styles.card} key={i}>
                  <CardBody className={styles.cardBody}>
                    <Heading
                      overflow="hidden"
                      textOverflow="ellipsis"
                      width="90%"
                      whiteSpace="nowrap"
                      fontSize="90%"
                      marginBottom="1rem">
                      {el.Title}
                    </Heading>
                    <Image
                      className={styles.poster}
                      src={el.Poster}
                      borderRadius="lg"
                      fallbackSrc="https://via.placeholder.com/150"
                    />
                    <section className={styles.cardFooter}>
                      <section className={styles.cardDesColumn}>
                        <h1 className={styles.cardDesHead}>Year: </h1>
                        <h3 className={styles.cardDesText}>{el.Year}</h3>
                      </section>
                      {el.WatchListed ? (
                        <IconButton
                          size="sm"
                          icon={<SmallCloseIcon />}
                          onClick={(e) => {
                            handleToggleWatchListEvent(e, el);
                          }}
                        />
                      ) : (
                        <IconButton
                          size="sm"
                          aria-label="add to watchlist"
                          icon={<AddIcon />}
                          onClick={(e) => {
                            handleToggleWatchListEvent(e, el);
                          }}
                        />
                      )}
                    </section>
                  </CardBody>
                </Card>
              );
            })
          : null}
      </section>
    </>
  );
}
