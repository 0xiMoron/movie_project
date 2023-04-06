"use client";

import {
  Input,
  IconButton,
  Card,
  Heading,
  CardBody,
  Text,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import styles from "@/styles/Home.module.css";
import {
  setLocalStorageVariable,
  setAndReturnLocalStorageVariable,
  getLocalStorageVariable,
  deleteLocalStorageVariable,
} from "@/utils/localStorage";
import { SearchIcon, AddIcon, CheckIcon } from "@chakra-ui/icons";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Search() {
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [movieResults, setMovieResults] = useState([]);

  // Keep the last searched results on hard refreshes
  useEffect(() => {
    let searchedMovies = getLocalStorageVariable("searchedMovies");
    if (searchedMovies !== null) {
      setMovieResults(JSON.parse(searchedMovies));
    }

    let searchedMovieTitle = getLocalStorageVariable("searchedMovieTitle");
    if (searchedMovieTitle !== null) {
      setTitle(searchedMovieTitle);
    }
  }, []);

  let clearSearch = () => {
    setMovieResults([]);
    setTitle("");
    deleteLocalStorageVariable("searchedMovies");
    deleteLocalStorageVariable("searchedMovieTitle");
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
      if (movie.Type === "movie") {
        movie.Review = 0;
        movie.Bookmarked = false;
        movie.Watched = false;
        movie.SearchId = i;

        movieList.push(movie);
      }
    });
    let searchedMovies = setAndReturnLocalStorageVariable(
      "searchedMovies",
      JSON.stringify(movieList)
    );

    setLocalStorageVariable("searchedMovieTitle", title);

    setMovieResults(JSON.parse(searchedMovies));
  };

  // Ideally I would have started with TypeScript and made this a Movie Interface and...
  /// ...would make this a Movie type Array. But I started in Javascript and felt that...
  //// ... it would be a lot to change last minute...

  let searchMovies = async (event) => {
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
          onSubmit={searchMovies}>
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
                      <Text>Year: {el.Year}</Text>
                      {el.Bookmarked ? (
                        <IconButton icon={<CheckIcon />} />
                      ) : (
                        <IconButton icon={<AddIcon />} />
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
