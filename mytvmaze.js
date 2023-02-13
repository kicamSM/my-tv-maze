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

//this function is adding the shows onto the page. Orginally when I got this working I only had the show at index zero. It is also appending a button on the screen which you can barely see that will be later used to display the episodes

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const searchTerm = $("#search-query").val();
  //obtaining the value in the input to pass into the function
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
 // obtaining the data from the API using the proper id 
  return episodesResponse.data.map(e => ({
      id: e.id,
      name: e.name,
      season: e.season,
      number: e.number,
    }));

    //returning the propper information from the data 
}


function populateEpisodes(episodes) { 
  $episodesList.empty(); 

  for (let episode of episodes) {
    const $episode = $(
        `
          <h5>${episode.name}</h5>
          <li>
            Season ${episode.season},
            Episode ${episode.number}
          </li>
      `);
      $episodesList.append($episode)
}
$episodesArea.show();

//this is pushing the episodes list into into html/ so it will appaer on the browser. Note: that later on this could be fixed by pushing that data in the browser at a more visible space. I thought it was not appending to the screen because it was at the bottom and I didn't see it. Also, show the episodes area which was previously hiddden.
}

async function getEpisodesAndDisplay(evt) {
//this one is obtaining the episodes and by cliking on the taget and showing the episodes. 
  const showId = $(evt.target).closest(".Show").data("show-id");

  const episodes = await getEpisodesOfShow(showId);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getEpisodesAndDisplay);
//this is our event listener

//note would like to go back and style this later but need to move forward due to time constraints. 
