"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodesList = $("#episodes-list")


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchTerm}`);
  
  // const id = response.data[0]['show']['id'];
  // const name = response.data[0]['show']['name']
  // const summary = response.data[0]['show']['summary']
  // const image = response.data[0]['show']['image']['medium']

  // const shows = [{id: id, name: name, summary:summary, image: image}]

  return response.data.map(result => {
    const show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : 'https://tinyurl.com/tv-missing', 

    };
//note i did need help with this. I was just returning the first result initially at index 0

  });

// populateShows(shows);


  // ADD: Remove placeholder & make request to TVMaze search shows API.
 }


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${show.image} 
              alt="Not Found"
              oneerror="this.src='https://tinyurl.com/tv-missing'
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const searchTerm = $("#search-query").val();
  const shows = await getShowsByTerm(searchTerm);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const episodesResponse = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(episodesResponse.data)
  const episodes = episodesResponse
  return episodesResponse.data.map(e => ({
      id: e.id,
      name: e.name,
      season: e.season,
      number: e.number,
    }));
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodesList.empty(); 

  for (let episode of episodes) {
    const $episode = $(
        `<ul>
          <h5>${episode.name}</h5>
          <li>
            <h6>${episode.season}<h6>
          </li>
          <li>
            <h7>${episode.number}</h7>
          </li>
      `);
      $episodesList.append($episode)
}
$episodesArea.show();

}

async function getEpisodesAndDisplay(evt) {

  const showId = $(evt.target).closest(".Show").data("show-id");

  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
