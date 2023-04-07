import {
  getLocalStorageArray,
  setLocalStorageArray,
} from "@/utils/localStorageUtils";
import { WatchListedMoviesStorage } from "@/constants/constantVars";

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

export function saveMovieToWatchList(movie) {
  // set movie to watched and add/make the local storage list
  movie.WatchListed = true;
  let watchlist = getLocalStorageArray(WatchListedMoviesStorage);
  // Check if there is already a watchlist and update accordingly
  if (watchlist !== null) {
    watchlist.push(movie);
    setLocalStorageArray(WatchListedMoviesStorage, watchlist);
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
