import {
  getLocalStorageArray,
  setLocalStorageArray,
  deleteLocalStorageVariable,
} from "@/utils/localStorageUtils";
import { WatchListedMoviesStorage } from "@/constants/constantVars";
import { findWatchedMovie } from "./watchedUtils";

export function findMovieInWatchList(movie) {
  // check if there is a watchlist
  let watchList = getLocalStorageArray(WatchListedMoviesStorage);
  if (watchList === null) {
    return null;
  }
  // find and return searched movie
  let foundMovie = null;
  watchList.map((wlMovie, i) => {
    if (wlMovie.imdbID === movie.imdbID) {
      foundMovie = wlMovie;
      return;
    }
  });
  return foundMovie;
}

export function toggleWatchListMoviesWatchedStatus(movie) {
  let watchList = getLocalStorageArray(WatchListedMoviesStorage);
  if (watchList === null) {
    return null;
  }
  watchList.map((wlMovie, i) => {
    if (wlMovie.imdbID === movie.imdbID) {
      wlMovie.Watched ? (wlMovie.Watched = false) : (wlMovie.Watched = true);
    }
  });

  setLocalStorageArray(WatchListedMoviesStorage, watchList);
}

export function saveMovieToWatchList(movie) {
  // set movie to watched and add/make the local storage list
  movie.WatchListed = true;
  let watchList = getLocalStorageArray(WatchListedMoviesStorage);

  let copyOfMovieAlreadyWatched = findWatchedMovie(movie);
  if (copyOfMovieAlreadyWatched !== null) {
    movie.Watched = true;
  }

  // Check if there is already a watchlist and update accordingly
  if (watchList !== null) {
    watchList.push(movie);
    setLocalStorageArray(WatchListedMoviesStorage, watchList);
  } else {
    setLocalStorageArray(WatchListedMoviesStorage, [movie]);
  }
}

export function deleteMovieFromWatchList(movie) {
  // set the object watchlisted to false
  movie.WatchListed = false;
  // check and set the watchlist array
  let watchList = getLocalStorageArray(WatchListedMoviesStorage);
  if (watchList === null) {
    return null;
  }

  // if the watchList only has one movie delete the var
  if (watchList.length === 1) {
    deleteLocalStorageVariable(WatchListedMoviesStorage);
    return;
  }

  // remove the passed movie
  watchList.map((wlMovie, i) => {
    if (wlMovie.imdbID === movie.imdbID) {
      watchList.splice(i, 1);
      return;
    }
  });

  // update the local storage array
  setLocalStorageArray(WatchListedMoviesStorage, watchList);
}
