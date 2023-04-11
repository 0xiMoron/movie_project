"use client";

import React, { useState } from "react";
import {
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
  deleteLocalStorageVariable,
  getLocalStorageArray,
  setAndReturnLocalStorageArray,
} from "@/utils/localStorageUtils";
import { WatchListedMoviesStorage } from "@/constants/constantVars";
import {
  deleteMovieFromWatchList,
  toggleWatchListMoviesWatchedStatus,
} from "@/utils/watchListUtils";
import { ViewIcon, SmallCloseIcon, ViewOffIcon } from "@chakra-ui/icons";
import { toggleSearchedMoviesWatchListing } from "@/utils/searchResultsUtils";
import {
  saveMovieToWatched,
  deleteMovieFromWatched,
} from "@/utils/watchedUtils";

export default function WatchList({ savedWatchList, setSavedWatchList }) {
  const [alertThrown, toggleAlert] = useState(false);
  const [cardAlert, setCardAlert] = useState("");

  let displayCardAlert = (movie) => {
    toggleAlert(true);

    !movie.Watched
      ? setCardAlert("Added to Watched!")
      : setCardAlert("Removed from Watched...");

    // alert Timeout
    setTimeout(() => {
      toggleAlert(false);
    }, 2000);
  };

  let updateWatchList = () => {
    // update displayed watchlist with locally stored variable
    setSavedWatchList(getLocalStorageArray(WatchListedMoviesStorage));
  };

  let handleDeleteFromWatchListEvent = (event, movie) => {
    // delete from watchlist using watchlist utils
    deleteMovieFromWatchList(movie);

    // update displayed watchlist
    updateWatchList();
    toggleSearchedMoviesWatchListing(movie);
  };

  let handleToggleWatchedEvent = async (event, movie) => {
    await displayCardAlert(movie);
    toggleWatchListMoviesWatchedStatus(movie);

    movie.Watched ? deleteMovieFromWatched(movie) : saveMovieToWatched(movie);
  };

  let clearWatchList = () => {
    if (savedWatchList === [] || savedWatchList === null) return;
    // delete the stored watchlist
    deleteLocalStorageVariable(WatchListedMoviesStorage);

    // delete each movie from watchlist from Searched results
    savedWatchList.map((movie, i) => {
      toggleSearchedMoviesWatchListing(movie);
    });

    // update displayed watchlist
    updateWatchList();
  };

  return (
    <>
      {alertThrown ? (
        <Alert status="success">
          <AlertIcon />
          <AlertDescription maxWidth="sm">{cardAlert}</AlertDescription>
        </Alert>
      ) : null}
      <section className={styles.watchListControlCenter}>
        <h1 className={styles.clearTitle}>Clear WatchList: </h1>
        <IconButton
          size="md"
          icon={<SmallCloseIcon />}
          onClick={clearWatchList}
        />
      </section>
      <section className={styles.searchRes}>
        {savedWatchList !== [] && savedWatchList !== null ? (
          savedWatchList.map((el, i) => {
            return (
              <Card className={styles.card} key={i}>
                <CardBody className={styles.cardBody}>
                  <Heading className={styles.cardTitle} size="lg">
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
                    <IconButton
                      size="sm"
                      icon={<SmallCloseIcon />}
                      onClick={(e) => {
                        handleDeleteFromWatchListEvent(e, el);
                      }}
                    />
                    {!el.Watched ? (
                      <IconButton
                        size="sm"
                        icon={<ViewIcon />}
                        onClick={(e) => {
                          handleToggleWatchedEvent(e, el);
                        }}
                      />
                    ) : (
                      <IconButton
                        size="sm"
                        icon={<ViewOffIcon />}
                        onClick={(e) => {
                          handleToggleWatchedEvent(e, el);
                        }}
                      />
                    )}
                  </section>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <h1>
            No movies in your watch list... Go back to search and start adding
            some!
          </h1>
        )}
      </section>
    </>
  );
}
