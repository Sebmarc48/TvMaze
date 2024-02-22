"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get(
    `http://api.tvmaze.com/search/shows?q=${term}`
  );
  let movies = [];
  for (let i = 0; i < response.data.length; i++) {
    let movieObj = {
      id: response.data[i].show.id,
      name: response.data[i].show.name,
      summary: response.data[i].show.summary,
      image: response.data[i].show.image.original,
    };
    movies.push(movieObj);
  }

  return movies;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>`
    );
    $show.data("id", show.id).data("name", show.name);
    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
  $(".Show-getEpisodes").click(async function () {
    $("#episodesArea").show();
    const allShows = $("#showsList").find(".Show");
    for (let show of allShows) {
      let id = $(show).data("id");
      let episodes = await getEpisodesOfShow(id);
      await populateEpisodes(episodes);
    }
  });
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = [];
  for (let episode of response.data) {
    episodes.push(episode);
    console.log(episode);
  }
  console.log(episodes);
  return episodes;
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  for (let { name, season, number } of episodes) {
    let ep = $("<li>").text(`${name} (${season} ${number})`);
    $("#episodesList").append(ep);
  }

  $("#episodesArea").show();
}
