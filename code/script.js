const songs = [
  { name: "Heat Waves", artist: "Glass Animals", image: "https://f4.bcbits.com/img/a1078439292_10.jpg"},
  { name: "Lovely", artist: "Billie Eilish", image: "https://f4.bcbits.com/img/a0241959966_10.jpg"},
  { name: "Starboy", artist: "The Weeknd", image: "https://imgs.search.brave.com/yVjzNNjJ6Dekvi8phKwFDkUREDGMjofSIoLK6hFp4nE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzFlLzk2/LzZmLzFlOTY2ZjU5/ZDk0ZmU3ODg5M2Iy/ZTk0MTJhYjcxZWNk/LmpwZw"},
  { name: "Shape of You", artist: "Ed Sheeran", image: "https://imgs.search.brave.com/kB77pzqdcR-IOOCKVCyz2JYPSH_6ZWD_2DKqekCI-_k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLTE3RGlK/ZDhyMEo0ZC0wLXQx/MDgweDEwODAuanBn"}
];

const grid = document.getElementById("song-grid");
const searchInput = document.getElementById("search-input");

function renderSongs(list) {
  grid.innerHTML = "";
  list.forEach(song => {
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
  if(searchInput.style.display === "none"){
    searchInput.style.display = "inline-block"
  }
  else{
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
  document.getElementById("song-name").innerText = song.name;
  document.getElementById("song-thumb").style.backgroundImage =
    `url('${song.image}')`;
}

function togglePlay() {
  alert("Play/Pause clicked");
}

