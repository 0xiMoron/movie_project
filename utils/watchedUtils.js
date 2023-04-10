import {
  getLocalStorageArray,
  setLocalStorageArray,
} from "@/utils/localStorageUtils";
import { WatchedMoviesStorage } from "@/constants/constantVars";

export function saveMovieToWatched(movie) {
  movie.Watched = true;
  let watchedMovies = getLocalStorageArray(WatchedMoviesStorage);

  if (watchedMovies !== null) {
    watchedMovies.push(movie);
    setLocalStorageArray(WatchedMoviesStorage, watchedMovies);
  } else {
    setLocalStorageArray(WatchedMoviesStorage, [movie]);
  }
}

export function deleteMovieFromWatched(movie) {
  movie.Watched = false;
  let watchedMovies = getLocalStorageArray(WatchedMoviesStorage);
  if (watchedMovies === null) {
    return null;
  }

  watchedMovies.map((wMovie, i) => {
    if (wMovie.imdbID === movie.imdbID) {
      watchedMovies.splice(i, 1);
      return;
    }
  });

  setLocalStorageArray(WatchedMoviesStorage, watchedMovies);
}

export function updateMovieReview(movie, pointScore) {
  let watchedMovies = getLocalStorageArray(WatchedMoviesStorage);
  if (watchedMovies === null) {
    return null;
  }

  watchedMovies.map((wMovie, i) => {
    if (wMovie.imdbID === movie.imdbID) {
      wMovie.Review = pointScore;
    }
  });

  setLocalStorageArray(WatchedMoviesStorage, watchedMovies);
}

export function findWatchedMovie(movie) {
  let watchedMovies = getLocalStorageArray(WatchedMoviesStorage);
  if (watchedMovies === null) {
    return null;
  }

  let foundMovie = null;
  watchedMovies.map((wMovie, i) => {
    if (wMovie.imdbID === movie.imdbID) {
      foundMovie = wMovie;
    }
  });
  return foundMovie;
}
