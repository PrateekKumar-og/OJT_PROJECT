let songs = []; 
let currentSongIndex = -1; 

const grid = document.getElementById("song-grid");
const searchInput = document.getElementById("search-input");


function renderSongs(songList) {
  grid.innerHTML = "";

  if (songList.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6;">No songs found. Try a different search!</p>';
    return;
  }

  songList.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => {
      currentSongIndex = songs.indexOf(song);
      playSong(song);
    };
    card.innerHTML = `
      <div class="thumbnail" style="background-image: url('${song.image}')"></div>
      <p>${song.name}</p>
      <small style="opacity:0.6">${song.artist}</small>
    `;
    grid.appendChild(card);
  });
}


async function initializeApp() {
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading recommended tracks...</p>';
  songs = await MusicAPI.getRecommendedTracks();
  renderSongs(songs);
}

initializeApp();

function toggleSearch() {
  if (searchInput.style.display === "none") {
    searchInput.style.display = "inline-block"
  }
  else {
    searchInput.style.display = "none"
  }
  searchInput.focus();
}


searchInput.addEventListener("keydown", async (e) => {
  if (e.key=='Enter'){
    const query = searchInput.value.trim();
    if (query === '') {
      songs = await MusicAPI.getRecommendedTracks();
      renderSongs(songs);
    } else {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6;">Searching...</p>';
      const results = await MusicAPI.searchTracks(query);
      songs = results;
      renderSongs(results);
    }
  }
})


async function showAllSongs() {
  searchInput.value = "";
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading recommended tracks...</p>';
  songs = await MusicAPI.getRecommendedTracks();
  renderSongs(songs);
}



const toggle = document.getElementById('themeToggle')

toggle.addEventListener("click", () => {

  
  document.body.classList.add("theme-blur");

  setTimeout(() => {

    
    const nowDark = !document.body.classList.contains("light");
    document.body.classList.toggle("light", nowDark);

    
    toggle.textContent = nowDark ? "🌙" : "☀️";
    localStorage.setItem("theme", nowDark ? "light" : "dark");

    
    setTimeout(() => document.body.classList.remove("theme-blur"), 250);

  }, 120);
});


let wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#999',
  progressColor: '#fff',
  height: 50,
  responsive: true
});

const playBtn = document.querySelector('.controls button[onclick="togglePlay()"]');

wavesurfer.on('play', () => {
  playBtn.textContent = "⏸";
});

wavesurfer.on('pause', () => {
  playBtn.textContent = "⏯";
});

const footer = document.querySelector('footer')

function playSong(song) {
  document.getElementById("song-name").innerHTML = song.name;
  document.getElementById("song-thumb").style.backgroundImage = `url('${song.image}')`;
  footer.style.display = "block";
requestAnimationFrame(() => {
  footer.style.opacity = "1";
  footer.style.transform = "translateY(0)";
});


  wavesurfer.load(song.audio);


  wavesurfer.on('ready', () => {
    wavesurfer.play();
  });
}


function togglePlay() {
  wavesurfer.playPause();
}



function playNext() {
  if (currentSongIndex === -1 || currentSongIndex >= songs.length - 1) {
    currentSongIndex = 0; 
  } else {
    currentSongIndex++;
  }
  const nextSong = songs[currentSongIndex];


  document.getElementById("song-name").textContent = nextSong.name;
  document.getElementById("song-thumb").style.backgroundImage = `url('${nextSong.image}')`;


  wavesurfer.load(nextSong.audio);
  wavesurfer.once('ready', () => wavesurfer.play());
}


function playPrev() {
  if (currentSongIndex <= 0) {
    currentSongIndex = songs.length - 1;
  } else {
    currentSongIndex--;
  }
  const prevSong = songs[currentSongIndex];

  document.getElementById("song-name").textContent = prevSong.name;
  document.getElementById("song-thumb").style.backgroundImage = `url('${prevSong.image}')`;

  wavesurfer.load(prevSong.audio);
  wavesurfer.once('ready', () => wavesurfer.play());

}
document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowRight") {
    playNext()
  } else if (e.key === "ArrowLeft") {
    playPrev()
  }
})
