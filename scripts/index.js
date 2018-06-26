

//function that runs / initiates script
async function runScript() {
  //variables ("glocals")
  const cardContainer = document.querySelector(`#cardContainer`);

  //initiate search results.
  let criteria = concatCriterias();
  const results = await searchByCriteria(`platsannonser/matchning?lanid=1&yrkesomradeid=3&antalrader=10`);
  console.log(results)
  printJobList(results.matchningslista.matchningdata)

  // to be announced: 
  // addNumberOfJobs(results.matchningslista.antal_platsannonser, results.matchningslista.antal_platserTotal, results.matchningslista.antal_sidor);
  console.log(results.matchningslista.antal_platsannonser);
  console.log(results.matchningslista.antal_sidor);

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
  //sets base URL:
  const baseURL = `http://api.arbetsformedlingen.se/af/v0/`;
  //fetches and awaits response object
  const responseObject = await fetch(baseURL + searchCriteria);
  const matches = await responseObject.json();

  return (matches);
}

function printJobList(jobList) {
  // erase list
  cardContainer.innerHTML = "";
  
  // loop through results.
  for (let jobs of jobList) {
    cardContainer.innerHTML += ` <div id="${jobs.id}" class="card" style="width: 18rem;">
      <img class="card-img-top" src="images/favicon.png" alt="Card image cap">
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
function createListners() {
  //adds submit lsitener to searhc fild.
  document.querySelector(`#userInput`).addEventListener(`submit`, submitSearch);

  //add dropdowns

  //add buttons

}

//Create search functionallity
function submitSearch(event) {
  event.preventDefault()
  const searchText = event.target.value;
  console.log(searchText);
  if (searchText == ``) {
    console.log('No search term entered');
  }
  //no, this function won't do it! rethink random input!
  concatCriterias();

};