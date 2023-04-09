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

  console.log(searchList);
  /// update local storage
  setLocalStorageArray(SearchedMoviesStorage, searchList);
}
