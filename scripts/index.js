

//function that runs / initiates script
async function runScript() {
  //variables ("glocals")
  const cardContainer = document.querySelector(`#cardContainer`);

  //initiate search results.
  let criteria = concatCriterias();
  const results = await searchByCriteria(`platsannonser/matchning?lanid=1&yrkesomradeid=3&antalrader=10`);
  console.log(results);
  printJobList(results.matchningslista.matchningdata)

  // to be announced: 
  // addNumberOfJobs(results.matchningslista.antal_platsannonser, results.matchningslista.antal_platserTotal, results.matchningslista.antal_sidor);

  createListners();
}
// runs script
runScript();


// ALL FUNCTIONS BELOW


//concatenates a criteria string to be attatched to baseURL
// needs to be improved further on!
function concatCriterias(lanid = `1`, yrkesomradeid = `3`, antalrader = `10`) {
  const lan = `lanid=${lanid}`;
  const yrkesOmrade = `yrkesområdeid=${yrkesomradeid}`;
  const antalRader = `antalrader=${antalrader}`;

  const criterias = `platsannonser/matchning?${lan}&${yrkesOmrade}&${antalRader}`
  return criterias;
}

//simple search by concatenated search criteria
async function searchByCriteria(searchCriteria) {

  //fetches and awaits response object
  const matches = await fetchData(searchCriteria);
  // returns matching list items
  return matches;
}

function printJobList(jobList) {
  // erase list
  cardContainer.innerHTML = "";

  // loop through results.
  for (let jobs of jobList) {
    cardContainer.innerHTML += ` <div id="${jobs.annonsid}" class="card" style="width: 60%; height: 12rem;">
      <img class="card-img  " src="http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobs.annonsid}/logotyp" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${jobs.annonsrubrik}</h5>
        <p class="card-text">${jobs.kommunnamn}, ${jobs.lan}</p>
        <a href="${jobs.annonsurl}" class="btn btn-primary">Annonsen hos AF</a>
      </div>
    </div>`
  }
  // for (let jobs of jobList) {
  //   cardContainer.
  // }
}

function addNumberOfJobs(antalTraffar, antalPerSida, antalSidor) {
  //adds details to page about search result numbers
  document.querySelector(`#quantityOfAdsDiv`).innerHTML = antalTraffar + antalPerSida, antalSidor;
  // adjust row above and add the numbers to the right row!
}

// designated function that adds listners to buttons and search fields.
function createListners() {
  //adds submit lsitener to search fild.
  console.log(`creating listeners...`)
  const searchField = document.getElementById(`formField`);
  searchField.addEventListener(`submit`, submitSearch);
  console.log(`created listeners!`)
  //add dropdowns

  //add buttons

}

//Create search functionallity
function submitSearch(event) {
  console.log(`event registrerat!`)  
  event.preventDefault();
  let searchInput = document.getElementById(`userInput`);
  if (searchInput.value == ``) {
      return searchInput.placeholder = `Prova igen`;
  } else {
    console.log(`gick det hem`)  
    const searchTerm = searchByWord()
    ///v0/platsannonser/{annonsid}/logotyp
// Hämta logotyp
    //searchByCriteria() 
  }
}

function searchByWord() {


}
async function fetchData(criteria) {
  //sets base URL:
  const baseURL = `http://api.arbetsformedlingen.se/af/v0/`;
  //creates array of search resutl objects
  const responseObject = await fetch(baseURL + criteria);
  const matches = await responseObject.json();
  return matches;
}