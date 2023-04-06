import { getLocalStorageArray } from "@/utils/localStorageUtils";

import { WatchListedMoviesStorage } from "@/constants/constantVars";

export function findMovieInWatchList(movie) {
  let watchList = getLocalStorageArray(WatchListedMoviesStorage);
  console.log(watchList);
  if (watchList === null) {
    return null;
  }
  let foundMovie = null;
  watchList.map((wlMovie, i) => {
    if (wlMovie.imdbID === movie.imdbID) {
      foundMovie = wlMovie;
      return;
    }
  });
  return foundMovie;
}

/// need to add delete
