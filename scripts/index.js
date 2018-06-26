

//function that runs / initiates script
async function runScript() {
  //variables ("glocals")
  const cardContainer = document.querySelector(`#cardContainer`);

  //presumtions
  let criteria = concatCriterias();
  const results = await searchByCriteria(`platsannonser/matchning?lanid=1&yrkesomradeid=3&antalrader=10`);
  console.log(results.matchningslista.matchningdata[0].annonsrubrik);
  printJobList(results.matchningslista.matchningdata)

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
  //fethces adn awaits response object
  const responseObject = await fetch(baseURL + searchCriteria);
  const matches = await responseObject.json();
  console.log(matches);
  return (matches);
}

function printJobList(jobList) {
  cardContainer.innerHTML = "";

  for (let jobs of jobList) {
    cardContainer.innerHTML += ` <div id="${jobs.id}" class="card" style="width: 60em;">
      <img class="card-img-top" src=".../100px180/" alt="Card image cap">
      <div class="card-body">
        <h5 class="card-title">${jobs.annonsrubrik}</h5>
        <p class="card-text">${jobs.kommunnnamn}, ${jobs.lan}</p>
        <a href="${jobs.annonsurl}" class="btn btn-primary">Annonsen hos AF</a>
      </div>
    </div>`
      }
}
