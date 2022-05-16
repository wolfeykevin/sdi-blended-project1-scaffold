import fetch from 'node-fetch'
import 'regenerator-runtime/runtime';

// ==============================================================================================
// Schedule Functions
// ==============================================================================================

export function loadData() {
  getShows()
      .then(shows => {
          const template = getTemplate(shows);
          document.querySelector("div#content").innerHTML = template;
       })
       .catch((error) => {
           console.log(error)
       })
}

export async function getShows() {
  const response = await fetch("https://api.tvmaze.com/schedule?country=US");
  return await response.json();
}

export function organizeSchedule(posts){
  //input: array of objects. if same time then add the tv show names to a nested array 
  //return array of objects. {airtime: airtime of shows, shows : array of all shows at that airtime}
  let returnarray = [];
  let pasttime = 0;
  let currentobj = {};
  for (let obj of posts){

      let airtimetemp = obj.airtime
      let name = obj.show.name

      if (airtimetemp !== pasttime){ //new time has been encountered
          if (pasttime != 0 ){
              returnarray.push(currentobj)
          }
          currentobj = {airtime : airtimetemp, shows: [name]}
          pasttime = airtimetemp
      }
      else{
          let test = currentobj['shows']
          currentobj['shows'].push(name)
      }
      if (posts.indexOf(obj) === posts.length-1) {
        returnarray.push(currentobj)
      }
  }
  return returnarray
}

export function getTemplate(posts) {

  //function here to organize based on time
  let newposts = organizeSchedule(posts) 
  const rows = newposts.map(toRowView).join("");

  return `<table>
  <thead>
      <tr>
      <th style='color:white; text-shadow: 1px 1px 10px #fff; font-size:25px; background: rgba(0,0,0,0.7); padding-top: 0.1em; font-family:Verdana;'><u>Show Name:</u></th> 
      <th style='color:white; text-shadow: 1px 1px 10px #fff; font-size:17px; background: rgba(0,0,0,0.7); padding-top: 0.1em; font-family:Verdana;'><u>Show Time:</u></th>
      </tr>
  </thead>

  <tbody>${rows}</tbody>
  </table>`;
}

export function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

export async function tdclick(shows){ 
  //turn the 'shows' string into an array of strings
  //use promise.all to query the database for each show
  // make the child elements look nice and append them to their corresponding div
  console.log(shows)
  let arrayShows = shows.split(",")
  let showDatabaseURLs = []
  for (let show of arrayShows){
      showDatabaseURLs.push ("https://api.tvmaze.com/singlesearch/shows?q="  + show)
  }

  //removeAllChildNodes(document.querySelector('#tvcontent')) //remove old shows from previous click
  
  //use promise.all here
  await Promise.all(showDatabaseURLs.map(x => {                        
    return fetch(x)                          
        .then(response => {
            if (response.ok){
                return response.json()
            }
            throw new Error("fetch did not work")
        })       
        .then(data =>  { 

            const element = document.createElement("div");
            const division1 = document.createElement("div");
            const division2 = document.createElement("div");
            const images = document.createElement("img");
            images.src = data.image.medium;
            images.style.border = "5px solid black"
            images.style.borderRadius = "10px";
            images.style.textAlign = "left"
            images.style.backgroundColor = 'rgba(0,0,0,0.7)'

            const title = document.createElement('div');
            title.innerHTML = `<b>${data.name}</b>`
            title.style.color = 'white'
            title.style.fontSize = '23px'
            title.style.fontFamily = 'Verdana'
            title.style.backgroundColor = 'rgba(0,0,0,0.7)'

            const description = document.createElement('div');
            description.innerHTML = data.summary
            description.style.color = "white"
            description.style.fontFamily = 'Verdana'
            description.style.textAlign = "left"
            description.style.backgroundColor = 'dimgray'
            description.style.boxShadow = "3px 3px 3px black"
            description.style.borderRadius = "7px"
            description.style.borderBlockColor = 'rgba(0,0,0,0.7)'
            description.style.borderSpacing = "5px"
            description.style.fontSize = '15px'
            description.style.margin = '1em'
            description.style.padding = '1em'
            
            element.appendChild(title);
            element.appendChild(division1);
            element.appendChild(images);
            element.appendChild(division2);
            element.appendChild(description);
            document.getElementById("tvcontent").appendChild(element);
        })
        .catch((error) =>{
            console.log(error)
        } )
    }))
};  

export function toRowView(x) {
  let rowstr = x.shows.join(", ")
  return `<t>

  <td id="row1" style='color:white; padding-top: 1em; cursor: pointer; background: rgba(0,0,0,0.7); -webkit-scrollbar-thumb: 30px; padding-bottom: 1em; font-family:Verdana;' align="left";
  onclick='tdclick(this.innerText)';>${rowstr}</td>

  <td style='color:white; font-family:Verdana; background: rgba(0,0,0,0.7); padding-top: 0.25em;'><b>${x.airtime}</b></td>

  </tr>`;
}


// ==============================================================================================
// Search Functions
// ==============================================================================================

function makeGrid(shows) { //strech goal: make into grid box 
    
  let newarr = []
  let container =  document.createElement("div")
  container.id = "shows"

  for (let x of shows){
      newarr.push(x.show)
  }
  const elements = newarr.map(x => toHTMLElements(x)); 

  for (element of elements){
      container.appendChild(element)
  }
  return container
}

function toHTMLElements(obj){
  const container = document.createElement("div")
  const division1 = document.createElement("div");
  const division2 = document.createElement("div");
  const images = document.createElement("img");
  if (obj.image != null){
    images.src = obj.image.medium;
    images.style.border = "5px solid black"
    images.style.borderRadius = "10px";
    images.style.backgroundColor = 'rgba(0,0,0,0.7)';
    images.style.marginLeft = '175px'}
  else{
    images.innerHTML = "No image Found"
    images.src = "https://i.imgur.com/P47tX0R.png"
  }

  const title = document.createElement('div');
  title.innerHTML = `<b>${obj.name}</b>`
  title.style.color = 'white';
  title.style.fontFamily = 'verdana'
  title.style.backgroundColor = 'dimgray'
  title.style.boxShadow = "3px 3px 3px black"
  title.style.margin = '1em'
  title.style.padding = '1em'
  title.style.width = '25%'
  title.style.textAlign = 'center'
  title.style.fontSize = '25px'


  const description = document.createElement('div')
  description.innerHTML = `<b>Summary:</b></br>${obj.summary}`
  description.style.color = 'white';
  description.style.fontFamily = 'verdana'
  description.style.backgroundColor = 'dimgray'
  description.style.boxShadow = "3px 3px 3px black"
  description.style.margin = '1em'
  description.style.padding = '1em'
  description.style.width = '25%'
  description.style.display = "inline-block"


  const details = document.createElement('div')
  if (obj.network != null){
    details.innerHTML = 
    `<b><fontRating:</b>   ${obj.rating.average}</br>
    <b>Runtime:</b>   ${obj.averageRuntime} min</br>
    <b>Can be viewed on:</b> ${obj.network.name}</br>
    <b>Official Site:</b> <a href = ${obj.officialSite}>${obj.name}</a></br>
  `}
  else{
    details.innerHTML = 
    `<b>Rating:</b>   ${obj.rating.average}</br>
    <b>Runtime:</b>   ${obj.averageRuntime}</br>
    <b>Can be viewed on:</b> ${obj.webChannel.name}</br>
    <b>Official Site:</b> <a href = ${obj.officialSite}>${obj.name}</a></br>`
  }

  details.style.color = 'white';
  details.style.fontFamily = 'verdana'
  details.style.backgroundColor = 'dimgray'
  details.style.boxShadow = "3px 3px 3px black"
  details.style.margin = '1em'
  details.style.padding = '1em'
  details.style.width = '25%'
  details.style.display = "inline-block"


  container.appendChild(title);
  container.appendChild(division1);
  container.appendChild(images);
  container.appendChild(division2);
  container.appendChild(description);
  container.appendChild(details)

  return container
}