//const declear
const apikey = "bd56d952bc77d601ea37f0b1800f4522";
const apiEndPoint = "https://api.themoviedb.org/3";
const imagePath = "https://image.tmdb.org/t/p/original";

const apiPath = {
  fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apikey}`,
  fetchAllMovies: (id) =>
    `${apiEndPoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  fetchTrendingMovie: `${apiEndPoint}/trending/all/day?api_key=${apikey}`,
};
function init() {
  fetchTrendingMovie();
  fetchAndBuildAllSection();
}
function fetchTrendingMovie() {
  fetchAndBuildMovieSection(apiPath.fetchTrendingMovie, "Trending Now")
    .then((list) => {
      const randomList = parseInt(Math.random() * list.length);
      console.log(randomList);
      fetchAndBulidHeaderSection(list[randomList]);
    })
    .catch((err) => console.error(err));
}

function fetchAndBulidHeaderSection(movie) {
  // movie.rand();
  const banner_cont = document.getElementById("banner_cont");
  banner_cont.style.backgroundImage = `url(${imagePath}/${movie.backdrop_path})`;
  const div = document.createElement("div");
  const movieOverview = movie.overview;
  if (movieOverview >= 100) {
    return movieOverview.slice(0, 100).trim() + "...";
  } else {
    movieOverview;
  }
  div.className = "contant";
  div.innerHTML = `<div class="contant">
          <h1 class="banner_title">${movie.title}</h1>
          <p class="sab_title"><i class="fa-regular fa-star-half-stroke" style="color:yellow;"></i> ${parseInt(
            movie.vote_average
          )}</p>
          <p class="description">${
            movie.overview && movie.overview.length > 200
              ? movie.overview.slice(0, 100).trim() + "..."
              : movie.overview
          }
          </p>
          <div class="button">
            <button><i class="fa-solid fa-play"></i><span>Play</span></button>
            <button class="gray_btn">
              <i class="fa fa-circle-info"></i>
              <span>More info</span>
            </button>
          </div>
        </div>`;
  banner_cont.append(div);
}

function fetchAndBuildAllSection() {
  fetch(apiPath.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndBuildMovieSection(
            apiPath.fetchAllMovies(category.id),
            category.name
          );
          //console.table(category);
        });
      }
      //console.table(categories);
    })
    .catch((err) => {
      console.error(err);
    });
}
function fetchAndBuildMovieSection(fetchurl, categoryName) {
  console.log(fetchurl, categoryName);
  return fetch(fetchurl)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => console.error(err));
}

function buildMoviesSection(movieList, categoryName) {
  //console.log(movieList, categoryName);
  const movieCont = document.getElementById("movie-con");
  const movieListHTML = movieList
    .map((item) => {
      return `
        <img
          class="movies_images"
          src="${imagePath}/${item.backdrop_path}"
          alt="${item.title}"
        />
        `;
    })
    .join("");
  const movieSectionHTML = `
      <h2>${categoryName} <span>Explore Now</span></h2>
      <div class="movies_row">
     
      ${movieListHTML}
      </div>
    `;
  const div = document.createElement("div");
  div.className = "movie_section container";
  div.innerHTML = movieSectionHTML;
  movieCont.append(div);
}
window.addEventListener("load", function () {
  init();
  // sticky navbar

  document.addEventListener("scroll", function () {
    nav.classList.toggle("active", window.scrollY > 30);
  });
  // sticky navbar
});
