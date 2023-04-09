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
} from "@chakra-ui/react";
import styles from "@/styles/Home.module.css";
import {
  setLocalStorageVariable,
  setAndReturnLocalStorageArray,
  getLocalStorageVariable,
  deleteLocalStorageVariable,
  getLocalStorageArray,
} from "@/utils/localStorageUtils";
import { SearchIcon, AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  SearchedMoviesStorage,
  SearchedMovieTitleStorage,
} from "@/constants/constantVars";
import {
  findMovieInWatchList,
  saveMovieToWatchList,
  deleteMovieFromWatchList,
} from "@/utils/watchListUtils";

export default function Search({
  searchResults,
  setSearchResults,
  title,
  setTitle,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOccurred, toggleErrorOccurred] = useState(false);
  const [cardAlert, setCardAlert] = useState("");

  let updateMovieResults = () => {
    let searchedMovies = getLocalStorageArray(SearchedMoviesStorage);
    if (searchedMovies !== null) {
      setSearchResults(
        setAndReturnLocalStorageArray(SearchedMoviesStorage, searchResults)
      );
    }
  };

  let displayCardAlert = (event, movie) => {
    movie.AlertThrown = true;
    movie.WatchListed
      ? setCardAlert("Added to WatchList!")
      : setCardAlert("Removed from WatchList");
    updateMovieResults();

    // alert Timeout
    setTimeout(() => {
      movie.AlertThrown = false;
      updateMovieResults();
    }, 1000);
  };

  let clearSearch = () => {
    setSearchResults([]);
    setTitle("");
    deleteLocalStorageVariable(SearchedMoviesStorage);
    deleteLocalStorageVariable(SearchedMovieTitleStorage);
  };

  let saveAndDisplaySearchResults = (res) => {
    /// when a movie is not detected the API does not return an Error, instead it returns...
    //// the response property as a string "False". So I made two seperate error handlers
    if (res.data.Response === "False") {
      toggleErrorOccurred(true);
      setErrorMessage(res.data.Error);
      clearSearch();
      return;
    }

    let movieList = [];
    res.data.Search.map((movie, i) => {
      let movieInWatchList = findMovieInWatchList(movie);
      if (movie.Type === "movie" && movieInWatchList === null) {
        movie.Review = 0;
        movie.WatchListed = false;
        movie.Watched = false;
        movie.AlertThrown = false;

        movieList.push(movie);
      }
      if (movieInWatchList !== null) {
        movieList.push(movieInWatchList);
      }
    });
    let searchedMovies = setAndReturnLocalStorageArray(
      SearchedMoviesStorage,
      movieList
    );

    // set storage variables
    setLocalStorageVariable(SearchedMovieTitleStorage, title);
    setSearchResults(searchedMovies);
  };

  let handleSaveMovieToWatchListEvent = (event, movie) => {
    // add to watchlist using watchlist utils
    saveMovieToWatchList(movie);

    // update stored searched Movies
    updateMovieResults();
  };

  let handleDeleteFromWatchListEvent = (event, movie) => {
    // delete from watchlist using watchlist utils
    deleteMovieFromWatchList(movie);

    // update stored searched Movies
    updateMovieResults();
  };

  // Ideally I would have started with TypeScript and made this a Movie Interface and...
  /// ...would make this a Movie type Array. But I started in Javascript and felt that...
  //// ... it would be a lot to change last minute...

  let sendSearchRequest = async (event) => {
    event.preventDefault();
    toggleErrorOccurred(false);

    const options = {
      method: "GET",
      url: "https://movie-database-alternative.p.rapidapi.com/",
      params: { s: title, r: "json" },
      headers: {
        "X-RapidAPI-Key": "",
        "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        saveAndDisplaySearchResults(response);
      })
      .catch(function (error) {
        toggleErrorOccurred(true);
        setErrorMessage(error);
      });
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
      <section className={styles.searchRes}>
        {searchResults !== []
          ? searchResults.map((el, i) => {
              return (
                <Card className={styles.card} key={i}>
                  <CardBody className={styles.cardBody}>
                    <Heading className={styles.cardTitle} size="md">
                      {el.Title}
                    </Heading>
                    {/* NEED TO ADD DEFAULT FOR IMAGE IF NO IMAGE */}
                    <Image
                      className={styles.poster}
                      src={el.Poster}
                      borderRadius="lg"
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
                            handleDeleteFromWatchListEvent(e, el);
                            displayCardAlert(e, el);
                          }}
                        />
                      ) : (
                        <IconButton
                          size="sm"
                          aria-label="add to watchlist"
                          icon={<AddIcon />}
                          onClick={(e) => {
                            handleSaveMovieToWatchListEvent(e, el);
                            displayCardAlert(e, el);
                          }}
                        />
                      )}
                    </section>
                    {el.AlertThrown ? (
                      <Alert status="success">
                        <AlertIcon />
                        <AlertDescription maxWidth="sm">
                          {cardAlert}
                        </AlertDescription>
                      </Alert>
                    ) : null}
                  </CardBody>
                </Card>
              );
            })
          : null}
      </section>
    </>
  );
}
