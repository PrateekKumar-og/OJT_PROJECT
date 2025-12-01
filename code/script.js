
// SONG DATA & STATE
let songs = []; // Will be populated from API
let currentSongIndex = -1; // Track current song

const grid = document.getElementById("song-grid");
const searchInput = document.getElementById("search-input");


// RENDER SONGS
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


// INITIALIZE APP
async function initializeApp() {
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading recommended tracks...</p>';
  songs = await MusicAPI.getRecommendedTracks();
  renderSongs(songs);
}

// Load recommended tracks on page load
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

// SEARCH FUNCTIONALITY
searchInput.addEventListener("keydown", async (e) => {
  if (e.key=='Enter'){
    const query = searchInput.value.trim();
    if (query === '') {
      // Show recommended tracks when search is empty
      songs = await MusicAPI.getRecommendedTracks();
      renderSongs(songs);
    } else {
      // Search API for tracks
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

  // blur animation
  document.body.classList.add("theme-blur");

  setTimeout(() => {

    // toggle theme class
    const nowDark = !document.body.classList.contains("light");
    document.body.classList.toggle("light", nowDark);

    // update icon 
    toggle.textContent = nowDark ? "🌙" : "☀️";
    localStorage.setItem("theme", nowDark ? "light" : "dark");

    // remove blur
    setTimeout(() => document.body.classList.remove("theme-blur"), 250);

  }, 120);
});




// WAVESURFER SETUP

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


// Load song when clicked
function playSong(song) {
  document.getElementById("song-name").innerHTML = song.name;
  document.getElementById("song-thumb").style.backgroundImage = `url('${song.image}')`;

  // Load into WaveSurfer
  wavesurfer.load(song.audio);

  // Play automatically
  wavesurfer.on('ready', () => {
    wavesurfer.play();
  });
}

// Play / Pause button
function togglePlay() {
  wavesurfer.playPause();
}


// currentSongIndex is now declared at the top of the file


// NEXT SONG
function playNext() {
  if (currentSongIndex === -1 || currentSongIndex >= songs.length - 1) {
    currentSongIndex = 0; // wrap to first song
  } else {
    currentSongIndex++;
  }
  const nextSong = songs[currentSongIndex];

  // Update footer info
  document.getElementById("song-name").textContent = nextSong.name;
  document.getElementById("song-thumb").style.backgroundImage = `url('${nextSong.image}')`;

  // Load and play in WaveSurfer
  wavesurfer.load(nextSong.audio);
  wavesurfer.once('ready', () => wavesurfer.play());
}

// PREVIOUS SONG
function playPrev() {
  if (currentSongIndex <= 0) {
    currentSongIndex = songs.length - 1; // wrap to last song
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
