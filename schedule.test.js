import {loadData} from "../src/functions.js";
import {getShows} from "../src/functions.js";
import {organizeSchedule} from "../src/functions.js";
import {getTemplate} from "../src/functions.js";
import {removeAllChildNodes} from "../src/functions.js";
import {tdclick} from "../src/functions.js";
import {toRowView} from "../src/functions.js";
import {makeGrid} from "../src/functions.js";
import {toHTMLElements} from "../src/functions.js";
import fetch from 'node-fetch'
import 'regenerator-runtime/runtime';

describe ('Schedule', () => {
  beforeAll(() => {
    global.fetch = () =>
    Promise.reject(
      {ok: false}
    )
  })

  test('Should be able to load data', async () => {
    expect(loadData()).toBe(undefined)
  })

   /*
  test('Should be able to get data', async () => {
    expect(await getShows()).toStrictEqual(await (await fetch("https://api.tvmaze.com/schedule?country=US")).json())
  })*/

  test('Should be able to organize schedule', () => {
    let x = [{show: {name: "Hello"}, airtime: '0900'},{show : {name: "World"}, airtime: '0900'},{show : {name: "Goodbye"}, airtime: '1000'}]

    expect(organizeSchedule(x)).toEqual([ { airtime: '0900', shows: [ 'Hello', 'World' ] },{ airtime: '1000', shows: [ 'Goodbye' ] } ])
  })

  test('Should be able to get template', () => {
    let x = [{show: {name: "Hello"}, airtime: '0900'},{show : {name: "World"}, airtime: '0900'},{show : {name: "Goodbye"}, airtime: '1000'}]
    
    expect(typeof(getTemplate(x))).toBe('string')
    expect(getTemplate(x)).toEqual(
  `<table>
  <thead>
      <tr>
      <th style='color:white; text-shadow: 1px 1px 10px #fff; font-size:25px; background: rgba(0,0,0,0.7); padding-top: 0.1em; font-family:Verdana;'><u>Show Name:</u></th> 
      <th style='color:white; text-shadow: 1px 1px 10px #fff; font-size:17px; background: rgba(0,0,0,0.7); padding-top: 0.1em; font-family:Verdana;'><u>Show Time:</u></th>
      </tr>
  </thead>

  <tbody><t>

  <td id=\"row1\" style='color:white; padding-top: 1em; cursor: pointer; background: rgba(0,0,0,0.7); -webkit-scrollbar-thumb: 30px; padding-bottom: 1em; font-family:Verdana;' align=\"left\";
  onclick='tdclick(this.innerText)';>Hello, World</td>

  <td style='color:white; font-family:Verdana; background: rgba(0,0,0,0.7); padding-top: 0.25em;'><b>0900</b></td>

  </tr><t>

  <td id=\"row1\" style='color:white; padding-top: 1em; cursor: pointer; background: rgba(0,0,0,0.7); -webkit-scrollbar-thumb: 30px; padding-bottom: 1em; font-family:Verdana;' align=\"left\";
  onclick='tdclick(this.innerText)';>Goodbye</td>

  <td style='color:white; font-family:Verdana; background: rgba(0,0,0,0.7); padding-top: 0.25em;'><b>1000</b></td>

  </tr></tbody>
  </table>`)
  })
  
  test('Should be able to remove all child nodes', () => {
    let container = document.createElement("div")
    let element = document.createElement("div")
    container.appendChild(element)
    removeAllChildNodes(container)
    expect(container.children.length).toEqual(0)
  })

  test('Should be able to output data on click', () => {
    expect(tdclick("show1, show2")).toBe({})
  })

  test('Should be able to join all rows together', () => {
    global.document = {};
    let shows = {shows: ["show1", "show2, show3"], airtime: '0900'}
    const ele = toRowView(shows);
    expect(ele).toEqual(
      `<t>

  <td id="row1" style='color:white; padding-top: 1em; cursor: pointer; background: rgba(0,0,0,0.7); -webkit-scrollbar-thumb: 30px; padding-bottom: 1em; font-family:Verdana;' align="left";
  onclick='tdclick(this.innerText)';>show1, show2, show3</td>

  <td style='color:white; font-family:Verdana; background: rgba(0,0,0,0.7); padding-top: 0.25em;'><b>0900</b></td>

  </tr>`)
  })

  afterAll(() => {
    // global.fetch = unmockedFetch
  })
})

describe ('Search', () => {
  beforeAll(() => {
    global.fetch = () =>
    Promise.reject(
      {ok: false}
    )
  })

  
  test("makegrid should add information from shows to a container", () => {
    let show1= {
      id: 1,
      show:{
      name: "name",
      image: null,
      summary: "summary",
      network : {name:"network"},
      averageRuntime: 60,
      officialSite: "site",
      rating: {average: 8}}
      }
    
      let show2= {
        id: 1,
        show:{
        name: "name",
        image: null,
        summary: "summary",
        network : {name:"network"},
        averageRuntime: 60,
        officialSite: "site",
        rating: {average: 8}}
        }
      let shows = [show1, show2]
      let container = makeGrid(shows)
      expect(container.children.length).toBe(2)
    })
   
    
    test("toHTMLElements should add info from objs to a container as html elements", ()=> {
    let element = {
        name: "name",
        image: null,
        summary: "summary",
        network : {name:"network"},
        averageRuntime: 60,
        officialSite: "site",
        rating: {average: 8}
        }
        let container = toHTMLElements(element)
        expect(container.length).toBe(6)//expect the length to be 6
      })
  
  afterAll(() => {
    // global.fetch = unmockedFetch
  })

})
