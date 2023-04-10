import {
  getLocalStorageArray,
  setLocalStorageArray,
} from "@/utils/localStorageUtils";
import { SearchedMoviesStorage } from "@/constants/constantVars";

export function setSearchResultMoviesWatchListStatusToFalse(movie) {
  let searchList = getLocalStorageArray(SearchedMoviesStorage);

  if (searchList === null) {
    return;
  }

  searchList.map((slMovie, i) => {
    if (slMovie.imbdID === movie.imbdID) {
      slMovie.WatchListed = false;
    }
  });

  /// update local storage
  setLocalStorageArray(SearchedMoviesStorage, searchList);
}

export function toggleSearchedMoviesWatchListing(movie) {
  let searchList = getLocalStorageArray(SearchedMoviesStorage);

  if (searchList === null) {
    return;
  }

  searchList.map((slMovie, i) => {
    if (slMovie.imdbID === movie.imdbID) {
      // slMovie.WatchListed = false;
      slMovie.WatchListed
        ? (slMovie.WatchListed = false)
        : (slMovie.WatchListed = true);
    }
  });

  /// update local storage
  setLocalStorageArray(SearchedMoviesStorage, searchList);
}
