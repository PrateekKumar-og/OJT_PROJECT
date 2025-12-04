let songs = [];
let currentSongIndex = -1;

let currentPage = 1;
const songsPerPage = 8;

let currentView = 'home'; // 'home' or 'favorites'

// FAVORITES MANAGEMENT
function getFavorites() {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

function addToFavorites(song) {
  const favorites = getFavorites();
  const exists = favorites.some(fav => fav.id === song.id);
  if (!exists) {
    favorites.push(song);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

function removeFromFavorites(songId) {
  let favorites = getFavorites();
  favorites = favorites.filter(fav => fav.id !== songId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(songId) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.id === songId);
}



const grid = document.getElementById("song-grid");
const searchInput = document.getElementById("search-input");


function renderSongs(songList) {
  grid.innerHTML = "";

  if (songList.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6;">No songs found. Try a different search!</p>';
    return;
  }

  const start = (currentPage - 1) * songsPerPage;
  const end = start + songsPerPage;
  const pageSongs = songList.slice(start, end);

  pageSongs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const isFav = isFavorite(song.id);
    const heartIcon = isFav ? '❤️' : '🤍';

    card.innerHTML = `
      <div class="thumbnail" style="background-image: url('${song.image}')"></div>
      <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${song.id}, '${song.name.replace(/'/g, "\\'")}', '${song.artist.replace(/'/g, "\\'")}', '${song.image}', '${song.audio}')">${heartIcon}</button>
      <p>${song.name}</p>
      <small style="opacity:0.6">${song.artist}</small>
    `;

    card.onclick = () => {
      currentSongIndex = songs.indexOf(song);
      playSong(song);
      document.addEventListener('keydown', (e) => {
        if (e.key === "ArrowRight") {
          playNext()
        } else if (e.key === "ArrowLeft") {
          playPrev()
        }else if (e.key === ' ') {
          togglePlay()
        }
      })
    };

    grid.appendChild(card);
  });
  renderPagination(songList.length);
}


function renderPagination(totalSongs) {
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  const totalPages = Math.ceil(totalSongs / songsPerPage);
  if (totalPages <= 1) return;


  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderSongs(songs);
  };
  container.appendChild(prevBtn);


  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("activeBtn");

    btn.onclick = () => {
      currentPage = i;
      renderSongs(songs);
    };

    container.appendChild(btn);
  }


  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderSongs(songs);
  };
  container.appendChild(nextBtn);
}



async function initializeApp() {
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading recommended tracks...</p>';
  songs = await MusicAPI.getRecommendedTracks();
  currentPage = 1;
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
  if (e.key == 'Enter') {
    const query = searchInput.value.trim();

    if (currentView === 'favorites') {
      // Search within favorites only
      const favorites = getFavorites();

      if (query === '') {
        currentPage = 1;
        renderFavorites(favorites);
      } else {
        // Filter favorites by query
        const filtered = favorites.filter(song =>
          song.name.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
        );
        currentPage = 1;

        if (filtered.length === 0) {
          grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6;">No favorites match your search.</p>';
          document.getElementById('pagination').innerHTML = '';
        } else {
          renderFavorites(filtered);
        }
      }
    } else {
      // Search API for home view
      if (query === '') {
        songs = await MusicAPI.getRecommendedTracks();
        currentPage = 1;
        renderSongs(songs);
      } else {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6;">Searching...</p>';
        const results = await MusicAPI.searchTracks(query);
        songs = results;
        currentPage = 1;
        renderSongs(results);
      }
    }
  }
})


//shows thee recommeded songs if the search is reset or empty
async function showAllSongs() {
  searchInput.value = "";
  grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Loading recommended tracks...</p>';
  songs = await MusicAPI.getRecommendedTracks();
  currentPage = 1;
  currentView = 'home';
  document.getElementById('page-title').textContent = 'Recommended';
  renderSongs(songs);
}

//FAVORITES FUNCTIONS 
function toggleFavorite(songId, name, artist, image, audio) {
  const song = { id: songId, name, artist, image, audio };

  if (isFavorite(songId)) {
    removeFromFavorites(songId);
  } else {
    addToFavorites(song);
  }

  // Re-render current view to update UI
  if (currentView === 'home') {
    renderSongs(songs);
  } else {
    showFavorites();
  }
}

function showFavorites() {
  currentView = 'favorites';
  currentPage = 1;
  document.getElementById('page-title').textContent = 'My Favorites';

  const favorites = getFavorites();

  if (favorites.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.6;">No favorites yet. Add some songs from the home page!</p>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  // Render favorites with same layout
  renderFavorites(favorites);
}

function renderFavorites(favoritesList) {
  grid.innerHTML = "";

  const start = (currentPage - 1) * songsPerPage;
  const end = start + songsPerPage;
  const pageFavorites = favoritesList.slice(start, end);

  pageFavorites.forEach((song) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="thumbnail" style="background-image: url('${song.image}')"></div>
      <button class="favorite-btn active" onclick="event.stopPropagation(); toggleFavorite(${song.id}, '${song.name.replace(/'/g, "\\'")}', '${song.artist.replace(/'/g, "\\'")}', '${song.image}', '${song.audio}')">❤️</button>
      <p>${song.name}</p>
      <small style="opacity:0.6">${song.artist}</small>
    `;

    card.onclick = () => {
      // Find song in favorites list for playback
      currentSongIndex = favoritesList.indexOf(song);
      songs = favoritesList; // Update songs array to favorites for next/prev
      playSong(song);
    };

    grid.appendChild(card);
  });

  renderPagination(favoritesList.length);
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
  progressColor: '#fff ',
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

