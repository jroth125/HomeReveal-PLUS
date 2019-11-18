// Good date query is below (gets the last 5 years)
// https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=792%20STERLING%20PLACE&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-01-10T14:00:00%27
/* 
to get zip code of the apartments you are looking at
let link = document.getElementsByClassName('details-titleLink')[0].href
let res = await fetch(link)
let htmltext = await res.text()
let dummy = await document.createElement('div')
dummy.innerHTML = htmltext
let addressEnd = await dummy.getElementsByClassName('backend_data')[0].getElementsByTagName('span')[0].innerText.split(' ')
let idx = addressEnd.indexOf('NY')
let boroughZipID = addressEnd[idx + 1].slice(0, 5)
*/

let state = ''
let items = Array.from(document.getElementsByClassName('item'))

chrome.runtime.sendMessage({ type: 'CONTENT' })
//listener for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  state = message
  console.log('the state is now:', message)
  let currBorough = state.borough

  items.forEach(async item => {
    

    console.log('inside loop currboroough is:', currBorough)
    let address = item.getElementsByClassName('details-titleLink')[0]
    if (address) {
      address = address.innerText.split(' ')
      address.pop()
      address = address.join(' ').toUpperCase()
      const response = await fetch(
        `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${address}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
      )
      const myJson = await response.json()
      let dataLength = myJson.length

      let linkToPopUp = document.createElement('a')
    
      linkToPopUp.innerText = `${dataLength} complaints`
      linkToPopUp.id = address
      linkToPopUp.name = currBorough
      let jsonData = document.createElement('button')
      jsonData.style.fontSize = '20px'
      jsonData.style.textAlign = 'center'
      jsonData.addEventListener('click', showComplaints)

      jsonData.appendChild(linkToPopUp)
      item.appendChild(jsonData)
    }
  })
})


const showComplaints = async (e) => {
    if (!+e.target.clicked) {
        console.log('HERE ONE')
        let button = e.target
        e.target.clicked = 1
        let currBorough = button.name
        let address = button.id
    
        let table = button.parentElement.parentElement.getElementsByClassName('row')[0]
    
        const data = await fetch(`https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${address}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`)
        const json = await data.json()
        const jsonData = json.reverse()
        let dataTable = document.createElement('table')
        dataTable.innerHTML = `
        <thead> 
            <tr> <td><b>Date of Complaint</b></td>  <td><b>Complaint Type</b></td></tr>
        </thead> 
        <tbody>${jsonData.map((incident) => {
            let createdDateArr = incident.created_date.split('-')
            let createdDateHuman = `${createdDateArr[1]}/${createdDateArr[0]}`
            return (
                `<tr>
                    <td> ${createdDateHuman}</td>       
                    <td> ${incident.complaint_type} </td>
                </tr>`)}).join('')}
        </tbody>`
        dataTable.className = 'dataTable'

        table.appendChild(dataTable)
    
    } else if (+e.target.clicked){
        console.log('HERE TWO')
        e.target.clicked = 0
        console.log('target el is: ', e.target)
        let article = e.target.parentElement.parentElement
        console.log('article is:', article)
        let dataTable = article.querySelector('.dataTable')
        dataTable.remove()
        
    } else {
        console.log('HERE THREE')
    }
}