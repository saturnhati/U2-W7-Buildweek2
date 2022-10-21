let queryString = new URLSearchParams(window.location.search);
let id = queryString.get("id");

async function getAlbum() {
  let httpResponse = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${id}`);
  let json = await httpResponse.json();
  let albumCover = json.cover_medium;
  let albumArtist = json.artist;
  let albumTitle = json.title;
  let albumRelease = json.release_date;
  let albumTracks = json.nb_tracks;
  let tracksArray = json.tracks.data;
  displayCover(albumCover, albumArtist, albumTitle, albumRelease, albumTracks);
  displayTracks(tracksArray);
}

function displayCover(
  albumCover,
  albumArtist,
  albumTitle,
  albumRelease,
  albumTracks
) {
  let cover = document.querySelector("#hero-image-album");
  let heroTitle = document.querySelector("#hero-title-album");
  let heroArtist = document.querySelector("#hero-artist-album");
  let miniArtistImage = document.querySelector("#mini-artist-image");
  cover.srcset = albumCover;
  heroTitle.innerHTML = albumTitle;

  heroArtist.innerHTML = `<a href="http://localhost:5500/artist-page.html?id=${albumArtist.id
    }">${albumArtist.name}</a> - ${albumRelease.slice(
      -10,
      4
    )} - ${albumTracks} brani`;
  miniArtistImage.srcset = albumArtist.picture_small;
}

//Funzione per prendere più album
async function getArtistAlbums() {
  //Fetch sull'album
  let pageAlbum = await fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/album/${id}`
  );
  let jsonPageAlbum = await pageAlbum.json();
  // Fetch sulla tracklist
  let moreAlbumArtist = await fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/artist/${jsonPageAlbum.artist.id}/top?limit=4`
  );
  let jsonMoreArtist = await moreAlbumArtist.json();
  //Prendo i dati da inserire nell'html
  document.querySelector(
    ".main-content-album"
  ).innerHTML += `<h2>Altro di ${jsonMoreArtist.data[0].artist.name}</h2>
          <div id="more-albums"></div>`;

  for (i = 0; i < jsonMoreArtist.data.length; i++) {
    document.getElementById(
      "more-albums"
    ).innerHTML += `<div class="more-album-card"><img src=${jsonMoreArtist.data[i].album.cover_medium} /><h3>${jsonMoreArtist.data[i].album.title}</h3></div>`;
  }
}

//Funzione per visualizzare le tracce
function displayTracks(tracksArray) {
  //Prendo il container
  let container = document.querySelector("#album-tracks");
  //for (i = 0; i < tracksArray.length; i++)
  for (let track of tracksArray) {
    // creo il div complessivo
    let trackPlayerDiv = document.createElement('div')
    trackPlayerDiv.classList.add('track-player')
    // creo il div che contiene il bottome, il numero e i dati della canzone
    let numberTitleDiv = document.createElement('div')
    numberTitleDiv.classList.add('number-title')
    // creo il bottone
    let buttonSongPlay = document.createElement('button')
    buttonSongPlay.setAttribute('type', 'button')
    buttonSongPlay.classList.add('button-artist-song')
    // creo l'icona
    let icon = document.createElement('i')
    icon.classList.add('fa-solid')
    icon.classList.add('fa-play')
    // inserisco l'icona nel bottone
    buttonSongPlay.appendChild(icon)
    // aggiungo l'event listener al bottone
    buttonSongPlay.addEventListener('click', () => {
      playAudio(track.album.cover_medium, track.artist.name, track.title, track.preview)
    })
    // creo il div del numerino
    let songNumberDiv = document.createElement('div')
    songNumberDiv.classList.add('song-number')
    songNumberDiv.innerHTML = tracksArray.indexOf(track) + 1
    // creo il div delle info canzone
    let songArtistDiv = document.createElement('div')
    songArtistDiv.classList.add('song-artist')
    // creo il div titolo canzone
    let titleDiv = document.createElement('div')
    titleDiv.classList.add('title')
    titleDiv.innerHTML = track.title
    // creo il div dell'artista
    let artistDiv = document.createElement('div')
    artistDiv.classList.add('artist')
    artistDiv.innerHTML = track.artist.name
    // inserisco i div titolo e artista nel div info
    songArtistDiv.appendChild(titleDiv)
    songArtistDiv.appendChild(artistDiv)
    // inserisco bottone, div numerino e div info canzoni nel div number-title
    numberTitleDiv.append(buttonSongPlay, songNumberDiv, songArtistDiv)
    // creo il div degli ascolti
    let playSongDiv = document.createElement('div')
    playSongDiv.classList.add('play-song')
    playSongDiv.innerHTML = track.rank
    // creo il div della durata
    let durationSongDiv = document.createElement('div')
    durationSongDiv.classList.add('duration-song')
    durationSongDiv.innerHTML = Math.round(track.duration / 60)
    // inserisco il div number-title, il div ascolti e il div durata dentro al div principale (track-player)
    trackPlayerDiv.append(numberTitleDiv, playSongDiv, durationSongDiv)
    // inserisco il div principale dentro al container
    container.appendChild(trackPlayerDiv)
  }
}

window.onload = () => {
  getAlbum();
  getArtistAlbums();
};

// Funzione per il menu dropdown
function openDropdown() {
  let dropdown = document.querySelector("#dropdown-menu");
  let icondown = document.querySelector(".fa-caret-down");
  let iconup = document.querySelector(".fa-caret-up");
  dropdown.classList.toggle("visible");
  icondown.classList.toggle("invisible-icon");
  iconup.classList.toggle("invisible-icon");
}

// Funzione per l'audio tag
let player = document.querySelector("audio");
let seekbar = document.querySelector("#seekbar");
let playIcon = document.querySelector(".fa-circle-play");
let pauseIcon = document.querySelector(".fa-circle-pause");
let titleListening = document.querySelector("#title-listening");
let artistListening = document.querySelector("#artist-listening");
let coverListening = document.querySelector("#cover-listening");
let iconListening = document.querySelector("#icon-listening");
let progressBar = document.querySelector("#audio-progress");
let progressValue = progressBar.value;
let interval;
let intervalProgress;
let timer = document.querySelector("#current-time");

function playAudio(cover, artist, title, preview) {
  playIcon.classList.add("icon-invisible");
  pauseIcon.classList.remove("icon-invisible");
  player.src = preview;
  player.play();
  coverListening.srcset = cover;
  titleListening.innerHTML = title;
  artistListening.innerHTML = artist;
  iconListening.classList.remove("icon-listening-none");
  progressValue = 0;
  startProgress();
  startTimer();
}

function startTimer() {
  let s = 1;
  interval = setInterval(function () {
    if (s < 10) {
      timer.innerHTML = `0:0${s}`;
    } else {
      timer.innerHTML = `0:${s}`;
    }
    s++;
  }, 1000);
}

function pauseAudio() {
  playIcon.classList.remove("icon-invisible");
  pauseIcon.classList.add("icon-invisible");
  player.pause();
  clearInterval(intervalProgress);
  clearInterval(interval);
}

function startProgress() {
  intervalProgress = setInterval(() => {
    progressValue++;
    progressBar.setAttribute("value", progressValue);
  }, 1000);
}
