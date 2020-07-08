// Ketika button Search diklik
const btnSearch = document.querySelector('.btn-search');
btnSearch.addEventListener('click', async function () {
  try {
    const inputSearch = document.querySelector('.input-search');
    const teams = await getTeams(inputSearch.value);
    updateCards(teams);
  } catch (error) {
    console.log(error);
  }
});

// Fungsi get API berdasarkan input
function getTeams(keyword) {
  return fetch(
    `https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${keyword}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === 'False') {
        throw new Error(response.Error);
      }
      return response.teams;
    });
}

function updateCards(teams) {
  let cards = '';
  teams.forEach((team) => {
    cards += showCards(team);
  });

  const teamContain = document.querySelector('.team-container');
  teamContain.innerHTML = cards;
}

// Klik details
document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('modal-detail-button')) {
    const teamID = e.target.dataset.teamid;
    const teamDetail = await getTeamDetail(teamID);
    updateModalDetail(teamDetail);
  }
});

// Fungsi get API berdasarkan ID
function getTeamDetail(teamID) {
  return fetch(
    `https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=${teamID}`
  )
    .then((response) => response.json())
    .then((team) => team.teams[0]);
}

function updateModalDetail(team) {
  const teamDetail = showTeamDetail(team);
  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = teamDetail;
}

function showCards(team) {
  return `<div class="col-sm-4 my-2">
            <div class="card">
              <div class="card-body text-center">
                <img src="${team.strTeamBadge}" class="card-img-top img-badge mb-3"
                  onerror="this.onerror=null; this.src='img/badge.png';" />
                <h2 class="card-title">${team.strTeam}</h2>
                <p class="card-text text-muted">${team.strCountry}</p>
                <a
                  href="#"
                  class="btn btn-primary modal-detail-button"
                  data-toggle="modal"
                  data-target="#TeamDetail"
                  data-teamid="${team.idTeam}"
                  >Details</a
                >
              </div>
            </div>
          </div>`;
}

function showTeamDetail(team) {
  return `<div class="container-fluid">
            <div class="row">
              <div class="col-md-4">
                <img src="${team.strTeamBadge}" class="img-fluid mb-5 p-2"
                  onerror="this.onerror=null; this.src='img/badge.png';" />
                <img src="${team.strTeamJersey}" class="img-fluid p-2"
                  onerror="this.onerror=null; this.src='img/jersey.png';" />
              </div>
              <div class="col-md">
                <ul class="list-group">
                  <li class="list-group-item">
                    <h4><b>${team.strTeam}</b></h4>
                  </li>
                  <li class="list-group-item">
                    <strong>Website : </strong>
                    <a href="https://${team.strWebsite}" target="_blank">${team.strWebsite}</a>
                  </li>
                  <li class="list-group-item">
                    <strong>Stadium : </strong> ${team.strStadium}
                  </li>
                  <li class="list-group-item">
                    <strong>Sport : </strong> ${team.strSport}
                  </li>
                  <li class="list-group-item">
                    <strong>League : </strong> ${team.strLeague}
                  </li>
                  <li class="list-group-item">
                    <strong>Description : </strong> <br />
                    ${team.strDescriptionEN}
                  </li>
                </ul>
              </div>
            </div>
          </div>`;
}
