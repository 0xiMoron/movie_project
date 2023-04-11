const searchForMovies = async (title) => {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.API_KEY,
      "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };

  const res = await fetch(
    `https://movie-database-alternative.p.rapidapi.com/?s=${title}&r=json`,
    options
  );
  const data = await res.json();
  return data;
};

export default async function handler(req, res) {
  const movieResults = await searchForMovies(req.body);
  if (movieResults.Response === "False") res.status(200).send(movieResults);
  res.status(200).json(movieResults.Search);
}
