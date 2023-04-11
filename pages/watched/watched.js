import React, { useState, useEffect } from "react";
import { IconButton, Card, Heading, CardBody, Image } from "@chakra-ui/react";
import styles from "@/styles/Home.module.css";
import { getLocalStorageArray } from "@/utils/localStorageUtils";
import { WatchedMoviesStorage } from "@/constants/constantVars";
import { toggleWatchListMoviesWatchedStatus } from "@/utils/watchListUtils";
import { StarIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  deleteMovieFromWatched,
  updateMovieReview,
} from "@/utils/watchedUtils";

export default function Watched({ watchedMovies, setWatchedMovies }) {
  //   useEffect(() => {
  //     deleteLocalStorageVariable(WatchedMoviesStorage);
  //   }, []);

  let handleDeleteFromWatchedEvent = (event, movie) => {
    deleteMovieFromWatched(movie);
    toggleWatchListMoviesWatchedStatus(movie);
    setWatchedMovies(getLocalStorageArray(WatchedMoviesStorage));
  };

  let handleUpdateMovieReviewEvent = (event, movie, reviewScore) => {
    updateMovieReview(movie, reviewScore);
    setWatchedMovies(getLocalStorageArray(WatchedMoviesStorage));
  };

  return (
    <>
      <section className={styles.searchRes}>
        {watchedMovies !== [] &&
        watchedMovies !== null &&
        typeof watchedMovies !== "undefined" ? (
          watchedMovies.map((el, i) => {
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
                        handleDeleteFromWatchedEvent(e, el);
                      }}
                    />
                  </section>
                  <section>
                    <IconButton
                      size="xsm"
                      icon={<StarIcon />}
                      className={el.Review >= 1 ? styles.selectedStar : ""}
                      onClick={(e) => {
                        handleUpdateMovieReviewEvent(e, el, 1);
                      }}
                    />
                    <IconButton
                      size="xsm"
                      icon={<StarIcon />}
                      className={el.Review >= 2 ? styles.selectedStar : ""}
                      onClick={(e) => {
                        handleUpdateMovieReviewEvent(e, el, 2);
                      }}
                    />
                    <IconButton
                      size="xsm"
                      icon={<StarIcon />}
                      className={el.Review >= 3 ? styles.selectedStar : ""}
                      onClick={(e) => {
                        handleUpdateMovieReviewEvent(e, el, 3);
                      }}
                    />
                    <IconButton
                      size="xsm"
                      icon={<StarIcon />}
                      className={el.Review >= 4 ? styles.selectedStar : ""}
                      onClick={(e) => {
                        handleUpdateMovieReviewEvent(e, el, 4);
                      }}
                    />
                    <IconButton
                      size="xsm"
                      icon={<StarIcon />}
                      className={el.Review === 5 ? styles.selectedStar : ""}
                      onClick={(e) => {
                        handleUpdateMovieReviewEvent(e, el, 5);
                      }}
                    />
                  </section>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <h1>No movies in your watched list... Go back and start watching!</h1>
        )}
      </section>
    </>
  );
}
