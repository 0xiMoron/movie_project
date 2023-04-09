"use client";

import React from "react";
import { useEffect } from "react";
import { IconButton, Card, Heading, CardBody, Image } from "@chakra-ui/react";
import styles from "@/styles/Home.module.css";
import {
  deleteLocalStorageVariable,
  getLocalStorageArray,
} from "@/utils/localStorageUtils";
import { WatchListedMoviesStorage } from "@/constants/constantVars";
import { deleteMovieFromWatchList } from "@/utils/watchListUtils";
import { ViewIcon, SmallCloseIcon, StarIcon } from "@chakra-ui/icons";
import { setSearchResultMoviesWatchListStatusToFalse } from "@/utils/searchResultsUtils";

export default function WatchList({ savedWatchList, setSavedWatchList }) {
  useEffect(() => {
    updateWatchList();
  }, []);

  let updateWatchList = () => {
    // update displayed watchlist with locally stored variable
    setSavedWatchList(getLocalStorageArray(WatchListedMoviesStorage));
  };

  let handleDeleteFromWatchListEvent = (event, movie) => {
    // delete from watchlist using watchlist utils
    deleteMovieFromWatchList(movie);

    // update displayed watchlist
    updateWatchList();
    setSearchResultMoviesWatchListStatusToFalse(movie);
  };

  let clearWatchList = () => {
    // delete the stored watchlist
    deleteLocalStorageVariable(WatchListedMoviesStorage);

    // delete each movie from watchlist from Searched results
    savedWatchList.map((movie, i) => {
      setSearchResultMoviesWatchListStatusToFalse(movie);
    });

    // update displayed watchlist
    updateWatchList();
  };

  return (
    <>
      <section className={styles.watchListControlCenter}>
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
