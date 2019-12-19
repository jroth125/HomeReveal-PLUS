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

//Helper functions
const getZipCode = async () => {
  let link = document.getElementsByClassName('details-titleLink')[0].href;
  let res = await fetch(link);
  let htmltext = await res.text();
  let dummy = await document.createElement('div');
  dummy.innerHTML = htmltext;
  let addressEnd = await dummy
    .getElementsByClassName('backend_data')[0]
    .getElementsByTagName('span')[0]
    .innerText.split(' ');
  let idx = addressEnd.indexOf('NY');
  let boroughZipID = addressEnd[idx + 1].slice(0, 3);
  return boroughZipID;
};

const getCurrentBorough = currentZipCode => {
  switch (currentZipCode) {
    case '100':
      return 'MANHATTAN';
    case '112':
      return 'BROOKLYN';
    case '103':
      return 'BRONX';
    default:
      return 'QUEENS';
  }
};

const pathNames = location.pathname.split('/');

if (pathNames[1] === 'for-rent') {
  let state = '';
  let items = Array.from(document.getElementsByClassName('item'));

  chrome.runtime.sendMessage({ type: 'CONTENT' });
  //listener for messages
  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      const currentZipCode = await getZipCode();
      let currBorough;
      switch (currentZipCode) {
        case '100':
          currBorough = 'MANHATTAN';
          break;
        case '112':
          currBorough = 'BROOKLYN';
          break;
        case '103':
          currBorough = 'BRONX';
          break;
        default:
          currBorough = 'QUEENS';
      }
      state = message;

      items.forEach(async item => {
        let address = item.getElementsByClassName('details-titleLink')[0];
        if (address) {
          address = address.innerText.split(' ');
          address.pop();
          address = address.join(' ').toUpperCase();
          const response = await fetch(
            `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${address}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
          );
          const myJson = await response.json();
          let dataLength = myJson.length ? myJson.length : 'No';

          let linkToPopUp = document.createElement('a');

          linkToPopUp.innerText = `${dataLength} complaints`;
          linkToPopUp.style = 'padding-top: 40px;';
          linkToPopUp.id = address;
          linkToPopUp.name = currBorough;
          let jsonData = document.createElement('button');
          jsonData.style =
            'font-size: 20px; padding: 2% 4%; text-align: center; margin-left: 4px';

          jsonData.addEventListener('click', showComplaints);

          jsonData.appendChild(linkToPopUp);
          item.appendChild(jsonData);
        }
      });
    }
  );

  const showComplaints = async e => {
    if (!+e.target.clicked) {
      let button = e.target;
      e.target.clicked = 1;
      let currBorough = button.name;
      let address = button.id;

      let table = button.parentElement.parentElement.getElementsByClassName(
        'row'
      )[0];

      const data = await fetch(
        `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${address}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
      );
      const json = await data.json();
      const jsonData = json.reverse();
      let dataTable = document.createElement('table');
      if (json[0]) {
        dataTable.innerHTML = `
          <thead> 
              <tr> <td><b style="margin-right: 7px;">Date of Complaint</b></td>  <td><b>Complaint Type</b></td></tr>
          </thead> 
          <tbody>${jsonData
            .map(incident => {
              let createdDateArr = incident.created_date.split('-');
              let createdDateHuman = `${createdDateArr[1]}/${createdDateArr[0]}`;
              return `<tr>
                      <td style="margin-right: 7px;"> ${createdDateHuman}</td>       
                      <td> ${incident.complaint_type} </td>
                  </tr>`;
            })
            .join('')}
          </tbody>`;
      } else {
        dataTable.innerHTML = `
          <thead> 
              <tr> <b style='text-align: center;'> No complaints to show </b></tr>
          </thead>`;
      }
      dataTable.className = 'dataTable';
      table.appendChild(dataTable);
    } else if (+e.target.clicked) {
      e.target.clicked = 0;
      let article = e.target.parentElement.parentElement;
      let dataTable = article.querySelector('.dataTable');
      dataTable.remove();
    } else {
      console.log('HERE THREE');
    }
  };
} else if (pathNames[1] === 'building' && pathNames[3]) {
  let addressEnd = document
    .getElementsByClassName('backend_data')[0]
    .getElementsByTagName('span')[0]
    .innerText.split(' ');
  let idx = addressEnd.indexOf('NY');
  let boroughZipID = addressEnd[idx + 1].slice(0, 3);
  const currBorough = getCurrentBorough(boroughZipID);
  console.log('the current borough is...', currBorough);

  const simpleAddress = document
    .getElementsByClassName('backend_data')[0]
    .getElementsByTagName('a')[0]
    .innerText.toUpperCase();

  function clickHandler(e, complaintData) {
    if (!+e.target.clicked) {
      e.target.innerText = 'Hide'
      let button = e.target;
      e.target.clicked = 1;

      let table = button.parentElement.parentElement;

      let dataTable = document.createElement('table');
      if (complaintData[0]) {
        dataTable.innerHTML = `
          <thead> 
              <tr> <td><b style="margin-right: 7px;">Date of Complaint</b></td>  <td><b>Complaint Type</b></td></tr>
          </thead> 
          <tbody>${complaintData
            .map(incident => {
              let createdDateArr = incident.created_date.split('-');
              let createdDateHuman = `${createdDateArr[1]}/${createdDateArr[0]}`;
              return `<tr>
                      <td style="margin-right: 7px;"> ${createdDateHuman}</td>       
                      <td> ${incident.complaint_type} </td>
                  </tr>`;
            })
            .join('')}
          </tbody>`;
      } else {
        dataTable.innerHTML = `
          <thead> 
              <tr> <b style='text-align: center;'> No complaints to show </b></tr>
          </thead>`;
      }
      dataTable.className = 'dataTable';
      const tableContainer = document.createElement('div')
      tableContainer.style = 'background-color: #FFFBB6; margin-top: 0px; display: flex; justify-content: center; align-content: center;';
      tableContainer.appendChild(dataTable)
      table.appendChild(tableContainer);
    } else if (+e.target.clicked) {
      e.target.innerText = 'Click here to see more'
      e.target.clicked = 0;
      let article = e.target.parentElement.parentElement;
      let dataTable = article.querySelector('.dataTable');
      dataTable.remove();
    }
  }

  let complaintData;
  fetch(
    `https://data.cityofnewyork.us/resource/erm2-nwe9.json?incident_address=${simpleAddress}&$where=created_date%20between%20%272015-01-10T12:00:00%27%20and%20%272019-11-10T14:00:00%27&borough=${currBorough}&location_type=RESIDENTIAL BUILDING`
  ).then(data => {
    data.json().then(jsonData => {
      console.log('the complaint data is...', jsonData);
      complaintData = jsonData;

      const complaints = document.createElement('div');
      complaints.className = 'details_info';
      complaints.innerHTML = `<span class="nobreak" style="color: red;">This apartment has <b>${complaintData.length}</b> complaints</span> <button id="dataButton" clicked="0" style="width: 150px; height: 30px; font-size: 12px; margin: 8px 6px;">Click here to see more</button>`;
      complaints.style = 'background-color: #FFFBB6; margin-bottom: 0px'

      const holdingDiv = document.getElementsByClassName('details')[0];
      holdingDiv.appendChild(complaints);
      complaints.querySelector('#dataButton').onclick = e =>
        clickHandler(e, complaintData);
    });
  });
}
