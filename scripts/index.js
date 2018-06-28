

//function that runs / initiates script
async function runScript() {
  //variables ("glocals")
  const cardContainer = document.querySelector(`#cardContainer`);

  //initiate search results.
  const results = await searchByCriteria(`lanid=1&yrkesomradeid=3&antalrader=10`);
  console.log(results);
  printJobList(results.matchningslista.matchningdata)

  // to be announced:
  // addNumberOfJobs(results.matchningslista.antal_platsannonser, results.matchningslista.antal_platserTotal, results.matchningslista.antal_sidor);

  createListeners();
}
// runs script
runScript();

// ALL FUNCTIONS BELOW

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

  // loop through results and srite innerHTML.
  for (let jobs of jobList) {
    cardContainer.innerHTML += ` <div id="${jobs.annonsid}" class="card">
      <div class="imgContainer"><img class="card-img  " src="http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobs.annonsid}/logotyp" alt="Card image cap"></div>
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
function createListeners() {
  //adds submit lsitener to search fild.
  console.log(`creating listeners...`)
  const searchField = document.getElementById(`formField`);
  searchField.addEventListener(`submit`, submitSearch);
  const lanMenu = document.getElementById(`dropdownMenuLan`);
  lanMenu.addEventListener(`click`, submitLan);

  const yrkesMenu = document.getElementById(`dropdownMenuYrkesomrade`);
  yrkesMenu.addEventListener(`click`, submitYrke);
  console.log(`created listeners!`)

}

//Create search functionallity
async function submitSearch(event) {
  //prevents site from reloading!
  event.preventDefault();
  //get search field elelmtn
  let searchInput = document.getElementById(`userInput`);

  //handles empty case!
  if (searchInput.value == ``) {
    // if empty asks for new search!
    return searchInput.placeholder = `Prova igen`;
  } else {
    //search API for word!
    const searchResults = await searchByWords(searchInput.value);
    printJobList(searchResults.matchningslista.matchningdata);
  }
}

// finds Lan id from Lan data!
async function submitLan(event) {
  event.preventDefault();
  let lanInput = event.target.id;
  console.log(`Klickat på län: ${lanInput}`);
  //CHECK LAN ID!!!
  const lanList = await searchByLan(lanInput);
  console.log(lanList);
  printJobList(lanList.matchningslista.matchningdata);
}

// find job based on yrkesområde!
async function submitYrke(event) {
  event.preventDefault();
  let yrkesInput = event.target.id;
  console.log(`Klickat på yrkesområde: ${yrkesInput}`);
  //CHECK LAN ID!!!
  const yrkesList = await searchByYrkesomrade(yrkesInput);
  console.log(yrkesList);
  printJobList(yrkesList.matchningslista.matchningdata);
}

async function searchByWords(criteria) {
  // Should split search string by _space_ or commas
  // const newCriteria = splitSearchString();

  //concat free word search term!
  const searchURL = `nyckelord=${criteria}`;
  console.log(searchURL);
  // fetch data!
  const matches = await fetchData(searchURL);
  return matches;
}
async function searchByLan(criteria) {
  console.log(criteria);
  const searchURL = `lanid=${criteria}`
  const matches = await fetchData(searchURL);
  return matches;
}

async function searchByYrkesomrade(criteria) {
  console.log(criteria);
  const searchURL = `yrkesomradeid=${criteria}`
  const matches = await fetchData(searchURL);
  return matches;
}

async function fetchData(criteria) {
  //sets base URL:
  const baseURL = `http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?`;
  //creates array of search resutl objects
  const responseObject = await fetch(baseURL + criteria);
  const matches = await responseObject.json();
  return matches;
}

// This function is set on hold
// For now we hard code buttons with ids similar to lanID from the API
//
// async function getLanID(lanName){
//   const lanURL= `platsannonser/soklista/lan`;
//   const lanList = await fetchData(lanURL);
//   console.log(lanList)
//       for (let lan of lanList.soklista.sokdata){
//         console.log(`${lan.id} tillhör ${lan.namn}` )
//       }
// }
