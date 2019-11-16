// Good date query is below (gets the last 5 years)
// https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=792%20STERLING%20PLACE&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-01-10T14:00:00%27

let items = Array.from(document.getElementsByClassName('item'))

async function getHousingData() {
  console.log('hellooooo!!!')
}

items.forEach(async item => {
  let address = item.getElementsByClassName('details-titleLink')[0]
  if (address) {
    address = address.innerText.split(' ')
    address.pop()
    address = address.join(' ').toUpperCase()
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${address}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-01-10T14:00:00%27&borough=BROOKLYN&location_type=RESIDENTIAL BUILDING`
    )
    const myJson = await response.json()
    let dataLength = myJson.length

    let linkToPopUp = document.createElement('a')
    linkToPopUp.href = 'https://google.com'
    let jsonData = document.createElement('button')
    linkToPopUp.appendChild(jsonData)
    jsonData.innerText = `${dataLength} complaints`
    jsonData.style.fontSize='20px'
    jsonData.style.textAlign = 'center'

    item.appendChild(linkToPopUp)
  }
})
