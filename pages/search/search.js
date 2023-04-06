"use client";

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
  setLocalStorageArray,
  setAndReturnLocalStorageArray,
  getLocalStorageVariable,
  deleteLocalStorageVariable,
  getLocalStorageArray,
} from "@/utils/localStorageUtils";

import { SearchIcon, AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  SearchedMoviesStorage,
  SearchedMovieTitleStorage,
  WatchListedMoviesStorage,
} from "@/constants/constantVars";

import { findMovieInWatchList } from "@/utils/watchListUtils";

export default function Search() {
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [movieResults, setMovieResults] = useState([]);

  // Keep the last searched results on hard refreshes
  /// MAYBE RETHINK HOW YOU ARE DOING THIS
  /// MAKE A STATE MAP
  useEffect(() => {
    let searchedMovies = getLocalStorageArray(SearchedMoviesStorage);
    if (searchedMovies !== null) {
      setMovieResults(searchedMovies);
    }

    let searchedMovieTitle = getLocalStorageVariable(SearchedMovieTitleStorage);
    if (searchedMovieTitle !== null) {
      setTitle(searchedMovieTitle);
    }
  }, []);

  let clearSearch = () => {
    setMovieResults([]);
    setTitle("");
    deleteLocalStorageVariable(SearchedMoviesStorage);
    deleteLocalStorageVariable(SearchedMovieTitleStorage);
  };

  let saveAndDisplaySearchResults = (res) => {
    /// when a movie is not detected the API does not return an Error, instead it returns...
    //// the response property as a string "False". So I made two seperate error handlers
    if (res.data.Response === "False") {
      setErrorOccurred(true);
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
    setMovieResults(searchedMovies);
  };

  let saveMovieToWatchList = (event, movie) => {
    // set movie to watched and add/make the local storage list
    movie.WatchListed = true;
    let watchlist = getLocalStorageArray(WatchListedMoviesStorage);
    if (watchlist !== null) {
      watchlist.push(movie);
      setLocalStorageArray(WatchListedMoviesStorage, watchlist);
    } else {
      setLocalStorageArray(WatchListedMoviesStorage, [movie]);
    }

    // update stored searched Movies
    setMovieResults(
      setAndReturnLocalStorageArray(SearchedMoviesStorage, movieResults)
    );

    // /// DELETE ME
    // deleteLocalStorageVariable(WatchListedMoviesStorage);
  };

  // Ideally I would have started with TypeScript and made this a Movie Interface and...
  /// ...would make this a Movie type Array. But I started in Javascript and felt that...
  //// ... it would be a lot to change last minute...

  let sendSearchRequest = async (event) => {
    event.preventDefault();
    setErrorOccurred(false);

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
        setErrorOccurred(true);
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
        {movieResults !== []
          ? movieResults.map((el, i) => {
              return (
                <Card className={styles.card} key={i}>
                  <CardBody className={styles.cardBody}>
                    <Heading className={styles.cardTitle} size="lg">
                      {el.Title}
                    </Heading>
                    {/* NEED TO ADD DEFAULT FOR IMAGE IF NO IMAGE */}
                    <Image src={el.Poster} borderRadius="lg" />
                    <section className={styles.cardFooter}>
                      <section className={styles.cardDesColumn}>
                        <h1 className={styles.cardDesHead}>Year: </h1>
                        <h3 className={styles.cardDesText}>{el.Year}</h3>
                      </section>
                      {el.WatchListed ? (
                        <IconButton size="sm" icon={<SmallCloseIcon />} />
                      ) : (
                        <IconButton
                          size="sm"
                          aria-label="add to watchlist"
                          icon={<AddIcon />}
                          onClick={(e) => {
                            saveMovieToWatchList(e, el);
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
