

let searchVariables = {
  baseURL: `http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?`,
  searchString: `http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?`,
  searchCriterias: {},
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
  countingAds(results.matchningslista);
  settingSitePage(results.matchningslista);

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
      <div class="img-container"><img class="card-img" src="http://api.arbetsformedlingen.se/af/v0/platsannonser/${jobs.annonsid}/logotyp" alt="No logo"></div>
      <div class="card-body">
        <h5 class="card-title">${jobs.annonsrubrik}</h5>
        <p class="card-text">${jobs.kommunnamn}, ${jobs.lan}</p>
        <a href="${jobs.annonsurl}" class="btn btn-primary">Annonsen hos AF</a>
      </div>
    </div>`
  }
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
}

//Create search functionallity
async function submitSearch(event) {
  //prevents site from reloading!
  event.preventDefault();
  //get search field element
  let searchInput = document.getElementById(`userInput`);

  //handles empty case!
  if (searchInput.value == ``) {
    // if empty asks for new search!
    if (searchVariables.searchCriterias.searchTerm) {
      delete searchVariables.searchCriterias.searchTerm
    }
    return searchInput.placeholder = `Prova igen`;
  } else {
    // split string
    //update string
    const searchQuery = `&nyckelord=${searchInput.value}`
    obj = {
      dataset: { value: `` },
      id: "searchTerm"
    };
    appendSearchString(searchQuery, obj);
    updateSearchString();
    const matches = await newSearch();
    printJobList(matches.matchningslista.matchningdata);
    countingAds(matches.matchningslista);
    settingSitePage(matches.matchningslista);
  }
}

//adds filter buttons and their functionallity 
//including new searched when clicked
async function addLanFilter(event) {
  event.preventDefault();
  // 1. show button in filter field
  showInFilterField(`&yrkesomradeid=`, event.target);
  // 2. hide button
  hideButton(event.target);
  // 3. add lanFilter to array

  // perform new serarch
  const matches = await newSearch();
  printJobList(matches.matchningslista.matchningdata);
  countingAds(matches.matchningslista);
  settingSitePage(matches.matchningslista);
  //remove object from search string

}

async function addYrkesFilter(event) {
  event.preventDefault();
  // 1. show button in filter field
  showInFilterField(`&lanid=`, event.target);
  // 2. hide button
  hideButton(event.target);
  // 3. add lanFilter to array

  // perform new serarch
  const matches = await newSearch();
  printJobList(matches.matchningslista.matchningdata);
  //remove object from search string

}
// does the async fetch command!
async function fetchData(url) {
  const responseObject = await fetch(url);
  const matches = await responseObject.json();
  return matches;
}

//ads dropdown menus
async function insertDropdownMenu(list, dropdownElement) {
  dropdownElement.innerHTML = ``;
  for (let item of list.soklista.sokdata) {
    //get element value attribute
    dropdownElement.innerHTML += `<a class="dropdown-item" id="${list.soklista.listnamn}${item.id}" data-value="${item.id}" href="#">${item.namn}</a>`;
  }
}
async function showInFilterField(details, targetObject) {

  const newFilter = createFilterDiv(targetObject);
  document.getElementById(`filters`).appendChild(newFilter);
  appendSearchString(details, targetObject);
  updateSearchString();
  const matches = await newSearch();
  printJobList(matches.matchningslista.matchningdata);

  newFilter.addEventListener(`click`, async (event) => {
    event.preventDefault();
    //show dropdown button again
    hideButton(targetObject);
    //remove object in fitler list
    removeSearchString(newFilter);
    updateSearchString();
    const matches = await newSearch();
    printJobList(matches.matchningslista.matchningdata);
    //remove object from search string
    removeFilter(newFilter)
  })
}

function hideButton(targetObject) {
  //toggle hide class!
  targetObject.classList.toggle(`hideElement`);
}

function appendSearchString(details, targetObject) {
  searchVariables.searchCriterias[targetObject.id] = details + targetObject.dataset.value;
}

function removeSearchString(targetObject) {
  for (let i in searchVariables.searchCriterias) {
    if (searchVariables.searchCriterias[i] == targetObject.dataset.value) {
      delete searchVariables.searchCriterias[i];
      return;
    }
  }
}

function createFilterDiv(targetObject) {
  const newFilter = document.createElement("div");
  newFilter.classList.add(`filter-button`);
  newFilter.setAttribute("id", targetObject.id);
  newFilter.setAttribute("data-value", targetObject.dataset.value);
  newFilter.innerText = targetObject.innerHTML;
  return newFilter;
}

function removeFilter(newFilter) {
  newFilter.remove();
}

function updateSearchString() {

  searchVariables.searchString = searchVariables.baseURL;
  for (let option in searchVariables.searchCriterias) {
    searchVariables.searchString += searchVariables.searchCriterias[option];
  }
}

async function newSearch() {
  console.log(searchVariables.searchString);
  return await fetchData(searchVariables.searchString);
}

function countingAds (matchningslista) {
  const numberOfAds = document.querySelector('#quantityOfAdsDiv');
  let adCount = matchningslista.antal_platsannonser;
  numberOfAds.innerHTML = `Visar 10 av totalt ${adCount} lediga jobb.`;
}

function settingSitePage (matchningslista){
const siteNumber = document.querySelector('#siteNumber');
const siteCount = matchningslista.antal_sidor;
siteNumber.innerHTML = `Antal sidor ${siteCount}`;
}