

let searchVariables = {
  baseURL: `http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?`,
  // lanid: `1`,
  // yrkesomradeid: `3`,
  // antalrader: `10`,
  listaLanURL: `http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan`,
  listaYrkenURL: `http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden`
}
// save all searchFilters in an object to be used in search
let searchFilters = {
  lanid: `&lanid=1`,
  yrkesomradeid: `&yrkesomradeid=3`,
  antalrader: `&antalrader=10`
}

//function that runs / initiates script
async function runScript() {
  //variables ("glocals")
  const cardContainer = document.querySelector(`#cardContainer`);

  //initiate search results.
  const results = await searchByCriteria(`&lanid=1&yrkesomradeid=3&antalrader=10`);
  printJobList(results.matchningslista.matchningdata)

  // to be announced: 
  // addNumberOfJobs(results.matchningslista.antal_platsannonser, results.matchningslista.antal_platserTotal, results.matchningslista.antal_sidor);

  createDropdowns();
  createListeners();
}
// runs script
runScript();

// ALL FUNCTIONS BELOW

//simple search by concatenated search criteria
async function searchByCriteria(searchCriteria) {
  //fetches and awaits response object
  const matches = await fetchData(searchVariables.baseURL + searchCriteria);
  // returns matching list items
  return matches;
}

function printJobList(jobList) {
  // erase list
  cardContainer.innerHTML = "";

  // loop through results and srite innerHTML.
  for (let jobs of jobList) {
    cardContainer.innerHTML += ` <div id="${jobs.annonsid}" class="card">
      <img class="card-img  " src="http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobs.annonsid}/logotyp" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${jobs.annonsrubrik}</h5>
        <p class="card-text">${jobs.kommunnamn}, ${jobs.lan}</p>
        <a href="${jobs.annonsurl}" class="btn btn-primary">Annonsen hos AF</a>
      </div>
    </div>`
  }
}

function addNumberOfJobs(antalTraffar, antalPerSida, antalSidor) {
  //adds details to page about search result numbers
  document.querySelector(`#quantityOfAdsDiv`).innerHTML = antalTraffar + antalPerSida, antalSidor;
  // adjust row above and add the numbers to the right row!
}

// designated function that adds listners to buttons and search fields.
function createListeners() {
  //adds submit lsitener to search fild.
  const searchField = document.getElementById(`formField`);
  searchField.addEventListener(`submit`, submitSearch);
  const lanMenu = document.getElementById(`dropdownLan`);
  lanMenu.addEventListener(`click`, addLanFilter);

  const yrkesMenu = document.getElementById(`dropdownYrke`);
  yrkesMenu.addEventListener(`click`, addYrkesFilter);
}

async function createDropdowns() {
  const lanList = await fetchData(searchVariables.listaLanURL);
  insertDropdownMenu(lanList, document.getElementById(`dropdownLan`));

  const yrkenList = await fetchData(searchVariables.listaYrkenURL);
  insertDropdownMenu(yrkenList, document.getElementById(`dropdownYrke`));
  //lägg tryckta knappar på en rad under sökrubriker!
  console.log(`created dropdowns`)
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
// async function submitLan(event) {
//   event.preventDefault();
//   let lanInput = event.target.value;
//   const lanList = await searchByLan(lanInput);
//   console.log(lanList);
//   printJobList(lanList.matchningslista.matchningdata);
// }
async function addLanFilter(event) {
  event.preventDefault();
  // 1. show button in filter field
)
  showInFilterField(event.target)
  // 2. hide button
  hideButton(event.target)
  // 3. add lanFilter to array

}

async function addYrkesFilter(event) {
  event.preventDefault();
  // 1. show button in filter field
  //showInFilterField(event.target)
  // 2. hide button
  //hideInFilterField(event.target)
  // 3. add lanFilter to array
  //addLanFIlter(event.target)

}

// find job based on yrkesområde!
async function submitYrke(event) {
  event.preventDefault();
  let yrkesInput = event.target.id;

  //CHECK LAN ID!!!
  const yrkesList = await searchByYrkesomrade(yrkesInput);

  printJobList(yrkesList.matchningslista.matchningdata);
}

async function searchByWords(criteria) {
  // Should split search string by _space_ or commas
  // const newCriteria = splitSearchString();
  //concat free word search term!

  // fetch data!
  const matches = await fetchData(`${searchVariables.baseURL}nyckelord=${criteria}`);
  return matches;
}
async function searchByLan(criteria) {
  const matches = await fetchData(`${searchVariables.baseURL}lanid=${criteria}`);
  return matches;
}

async function searchByYrkesomrade(criteria) {
  const matches = await fetchData(`${searchVariables.baseURL}yrkesomradeid=${criteria}`);
  return matches;
}

async function fetchData(url) {

  const responseObject = await fetch(url);
  const matches = await responseObject.json();
  return matches;
}

// This function is set on hold
// For now we hard code buttons with ids similar to lanID from the API
//
async function insertDropdownMenu(list, dropdownElement) {
  dropdownElement.innerHTML = ``;
  for (let item of list.soklista.sokdata) {
    //get element value attribute
    dropdownElement.innerHTML += `<a class="dropdown-item" id="${list.soklista.listnamn}${item.id}" value ="${item.id}" href="#">${item.namn}</a>`;
  }
}
function showInFilterField(targetObject){
  document.getElementById(`filters`).innerHTML += `<div class="filter-button" id="${targetObject.id}" value ="${targetObject.value}">${targetObject.innerHTML}</div>`;
}

function hideButton(targetObject){
  targetObject.classList.toggle(`hideElement`)
}
