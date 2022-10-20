async function displayArtistPage() {
  let queryString = new URLSearchParams(window.location.search)
  let id = queryString.get('id')
  let apiArtist = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${id}`)
  let apiArtistSongs = await fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${id}/top?limit=50`)
  console.log(apiArtistSongs)
  // Creo l'oggetto da apiArtist
  let objectArtist = await apiArtist.json()
  // Creo l'oggetto da apiArtistSong
  let objectArtistSongs = await apiArtistSongs.json()
  let arrayArtistSongs = objectArtistSongs.data
  console.log(arrayArtistSongs)
  document.querySelector('h1').innerHTML = objectArtist.name
  document.querySelector('.artist-hero p').innerHTML = `${objectArtist.nb_fan} ascoltatori mensili`
  document.querySelector('.artist-hero').style.backgroundImage = `url(${objectArtist.picture_xl})`
  for (const arrayArtistSong of arrayArtistSongs) {
    let container = document.getElementById('artist-list-songs')
    let listElement = document.createElement('li')
    // creo il div
    let div = document.createElement('div')
    div.classList.add('artist-imgtitle')
    // creo il bottone play
    let buttonSongPlay = document.createElement('button')
    buttonSongPlay.setAttribute('type', 'button')
    buttonSongPlay.classList.add('button-artist-song')
    buttonSongPlay.addEventListener('click', () => {
      playAudio(arrayArtistSong.album.cover_medium, arrayArtistSong.artist.name, arrayArtistSong.title, arrayArtistSong.preview)
    })
    // creo l'icona
    let icon = document.createElement('i')
    icon.classList.add('fa-solid')
    icon.classList.add('fa-play')
    // inserisco l'icona nel bottone
    buttonSongPlay.appendChild(icon)
    // creo l'immagine
    let img = document.createElement('img')
    img.srcset = arrayArtistSong.album.cover_small
    // creo lo span titolo
    let spanTitle = document.createElement('span')
    spanTitle.classList.add('artist-song')
    spanTitle.innerHTML = arrayArtistSong.title
    // inserisco bottone, img e span nel div
    div.append(buttonSongPlay, img, spanTitle)
    // creo lo span followers
    let spanFoll = document.createElement('span')
    spanFoll.classList.add('artist-followers')
    spanFoll.innerHTML = arrayArtistSong.rank
    // creo lo span artist
    let spanTime = document.createElement('span')
    spanTime.classList.add('artist-time')
    spanTime.innerHTML = arrayArtistSong.duration
    // inserisco gli ultimi due span nel div
    // div.appendChild(spanFoll)
    // div.appendChild(spanTime)
    // inserisco il div nell'li
    listElement.append(div, spanFoll, spanTime)
    // inserisco tutto nell'HTML
    container.appendChild(listElement)
  }
  document.querySelector('.artist-likers p').innerHTML = `di ${objectArtist.name}`
  document.querySelector('.artist-like img').src = objectArtist.picture_medium
}


window.onload = () => {
  displayArtistPage()
}

// Funzione per il menu dropdown
function openDropdown() {
  let dropdown = document.querySelector('#dropdown-menu')
  let icondown = document.querySelector('.fa-caret-down')
  let iconup = document.querySelector('.fa-caret-up')
  dropdown.classList.toggle('visible')
  icondown.classList.toggle('invisible-icon')
  iconup.classList.toggle('invisible-icon')
}

// Funzione per l'audio tag
let player = document.querySelector('audio')
let seekbar = document.querySelector('#seekbar')
let playIcon = document.querySelector('.fa-circle-play')
let pauseIcon = document.querySelector('.fa-circle-pause')
let titleListening = document.querySelector('#title-listening')
let artistListening = document.querySelector('#artist-listening')
let coverListening = document.querySelector('#cover-listening')
let iconListening = document.querySelector('#icon-listening')
let progressBar = document.querySelector('#audio-progress')
let progressValue = progressBar.value
let interval
let intervalProgress
let timer = document.querySelector('#current-time')

function playAudio(cover, artist, title, preview) {
  playIcon.classList.add('icon-invisible')
  pauseIcon.classList.remove('icon-invisible')
  player.src = preview
  player.play();
  coverListening.srcset = cover
  titleListening.innerHTML = title
  artistListening.innerHTML = artist
  iconListening.classList.remove('icon-listening-none')
  progressValue = 0
  startProgress()
  startTimer()
}

function startTimer() {
  let s = 1
  interval = setInterval(function () {
    if (s < 10) {
      timer.innerHTML = `0:0${s}`
    }
    else {
      timer.innerHTML = `0:${s}`
    }
    s++;
  }, 1000);
}

function pauseAudio() {
  playIcon.classList.remove('icon-invisible')
  pauseIcon.classList.add('icon-invisible')
  player.pause();
  clearInterval(intervalProgress)
  clearInterval(interval);
}

function startProgress() {
  intervalProgress = setInterval(() => {
    progressValue++
    progressBar.setAttribute("value", progressValue)
  }, 1000);
}