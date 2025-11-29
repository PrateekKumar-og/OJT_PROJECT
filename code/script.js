const songs = [
  { name: "Heat Waves", artist: "Glass Animals", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://f4.bcbits.com/img/a1078439292_10.jpg" },
  { name: "Lovely", artist: "Billie Eilish", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://f4.bcbits.com/img/a0241959966_10.jpg" },
  { name: "Starboy", artist: "The Weeknd", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://imgs.search.brave.com/yVjzNNjJ6Dekvi8phKwFDkUREDGMjofSIoLK6hFp4nE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzFlLzk2/LzZmLzFlOTY2ZjU5/ZDk0ZmU3ODg5M2Iy/ZTk0MTJhYjcxZWNk/LmpwZw" },
  { name: "Shape of You", artist: "Ed Sheeran", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://imgs.search.brave.com/kB77pzqdcR-IOOCKVCyz2JYPSH_6ZWD_2DKqekCI-_k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTE3RGlK/ZDhyMEo0ZC0wLXQx/MDgweDEwODAuanBn" },
  { name: "Blinding Lights", artist: "The Weeknd", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/6e774a96396119.5eae9e4c542ce.jpg" },
  { name: "Happier", artist: "Marshmello", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://i1.sndcdn.com/artworks-000390226092-1vzsos-t1080x1080.jpg" },
  { name: "Believer", artist: "Imagine Dragons", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://i1.sndcdn.com/artworks-s3zOCWcV8XQVtQcv-0emq8A-t500x500.jpg" },
  { name: "Bad Guy", artist: "Billie Eilish", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR-8GazGx2-mzDLlbvX9JeKUm5147aBgBd7w&s" },
  { name: "Senorita", artist: "Shawn Mendes", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://i.scdn.co/image/ab67616d0000b273bbda2325afa7cfda80ccd856" },
  { name: "saiyaara", artist: "sankalp Sadanah", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRefVwqymgmk6TwAKxiYmP5yYXFVy5iZZbK9Q&s" },
  { name: "Ik vaari aa", artist: "Amitabh Bhattacharya", audio: "./audio/Glass_animal_-_Heat_Waves_(mp3.pm).mp3", image: "https://a10.gaanacdn.com/gn_img/song/ZaP37OR3Dy/P37zwEq1KD/size_m_1516001169.jpg" }
]

 const grid = document.getElementById("song-grid");
 const searchInput = document.getElementById("search-input");

function renderSongs(songList) {
  grid.innerHTML = "";
  songList.forEach(song => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => playSong(song);
    card.innerHTML = `
      <div class="thumbnail" style="background-image: url('${song.image}')"></div>
      <p>${song.name}</p>
      <small style="opacity:0.6">${song.artist}</small>
    `;
   grid.appendChild(card);
  });
 }

 renderSongs(songs);

function toggleSearch() {
  if (searchInput.style.display === "none") {
    searchInput.style.display = "inline-block"
  }
  else {
    searchInput.style.display = "none"
  }
  searchInput.focus();
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = songs.filter(song =>
    song.name.toLowerCase().includes(query) ||
    song.artist.toLowerCase().includes(query)
  );
  renderSongs(filtered);
});


function showAllSongs() {
  searchInput.value = "";
  renderSongs(songs);
}

function playSong(song) {
  document.getElementById("song-name").innerHTML = song.name;
  document.getElementById("song-thumb").style.backgroundImage =
    `url('${song.image}')`;
  document.getElementById('audioEle').src = song.audio;
}

function togglePlay() {
  alert("Play/Pause clicked");
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

// document.getElementById("shuffle-btn").addEventListener("click", () => {
//   const randomIndex = Math.floor(Math.random() * songs.length);
//   playSong(songs[randomIndex]);
// });
