let searchVariables = {
  baseURL: `http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?`,
  searchString: `http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?`,
  searchCriterias: {},
  listaLanURL: `http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan`,
  listaYrkenURL: `http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden`
}

let siteNumber = document.querySelector('#siteNumber');
let siteNumberData = matchningslista.antal_sidor;


function showSiteNumbers(siteNumber) {
  console.log(siteNumber)
  for (let numbers of siteNumbers) {
    siteNumber.innerHTML += ` <div id="${numbers.antal_sidor}" class="card">
    <div class="siteNumber" id="siteNumber">

    </div>`
  }
}
