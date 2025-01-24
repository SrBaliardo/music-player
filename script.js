const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const playPause = document.getElementById("play-pause");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const songTime = document.getElementById("song-time");
const totalTime = document.getElementById("total-time");
const likeButton = document.getElementById("like");

//music var //////////////////////////////////////////////
const music1 = {
  songName: "Redbone",
  artist: "Childish Gambino",
  file: "childish-gambino-redbone",
  liked: false,
};

const music2 = {
  songName: "Believer",
  artist: "Imagine Dragons",
  file: "imagine-dragons-believer",
  liked: false,
};

const music3 = {
  songName: "Enemy",
  artist: "Imagine Dragons feat. JID",
  file: "imagine-dragons-jid-enemy",
  liked: false,
};

const music4 = {
  songName: "Wait",
  artist: "M83",
  file: "m83-wait",
  liked: false,
};

const music5 = {
  songName: "Take Me Somewhere Nice",
  artist: "Mogwai",
  file: "mogwai-take-me-somewhere-nice",
  liked: false,
};

const music6 = {
  songName: "Snuff",
  artist: "Slipknot",
  file: "slipknot-snuff",
  liked: false,
};

const music7 = {
  songName: "Stubbornd Love",
  artist: "The Lumineers",
  file: "the-lumineers-stubborn-love",
  liked: false,
};

const music8 = {
  songName: "Chlorine",
  artist: "Twenty One Pilots",
  file: "twenty-one-pilots-chlorine",
  liked: false,
};

const music9 = {
  songName: "Youth",
  artist: "Daughter",
  file: "youth-daughter",
  liked: false,
};

///////////////////////////////////////////////////////////////////////

let isPlaying = false;
const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [
  music1,
  music2,
  music3,
  music4,
  music5,
  music6,
  music7,
  music8,
  music9,
];
let index = 3;
let isShuffled = false;
let sortedPlaylist = [...originalPlaylist];
let repeatOn = false;

function playSong() {
  song.play();
  playPause.querySelector(".bi").classList.remove("bi-play-circle-fill");
  playPause.querySelector(".bi").classList.add("bi-pause-circle-fill");
}

function pauseSong() {
  song.pause();
  playPause.querySelector(".bi").classList.remove("bi-pause-circle-fill");
  playPause.querySelector(".bi").classList.add("bi-play-circle-fill");
}

function playPauseDecider() {
  if (isPlaying === false) {
    playSong();
    isPlaying = true;
  } else {
    pauseSong();
    isPlaying = false;
  }
}

function initializeSong() {
  cover.src = `./images/${sortedPlaylist[index].file}.jpg`;
  song.src = `./songs/${sortedPlaylist[index].file}.mp3`;
  songName.innerText = sortedPlaylist[index].songName;
  bandName.innerText = sortedPlaylist[index].artist;
  likeButtonRender();
}

function previousSong() {
  if (index === 0) {
    index = sortedPlaylist.length - 1;
  } else {
    index -= 1;
  }
  initializeSong();
  playSong();
}

function nextSong() {
  if (index === sortedPlaylist.length - 1) {
    index = 0;
  } else {
    index += 1;
  }
  initializeSong();
  playSong();
}

function updateProgress() {
  const barWidth = (song.currentTime / song.duration) * 100;
  currentProgress.style.setProperty("--progress", `${barWidth}%`);
  songTime.innerText = toHHMMSS(song.currentTime);
}

function jumpTo(event) {
  const width = progressContainer.clientWidth;
  const clickPosition = event.offsetX;
  const jumpToTime = (clickPosition / width) * song.duration;
  song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
  const size = preShuffleArray.length;
  let currentIndex = size - 1;
  while (currentIndex > 0) {
    let randomIndex = Math.floor(Math.random() * size);
    let aux = preShuffleArray[currentIndex];
    preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
    preShuffleArray[randomIndex] = aux;
    currentIndex -= 1;
  }
}

function shuffleButtonClicked() {
  if (isShuffled === false) {
    isShuffled = true;
    shuffleArray(sortedPlaylist);
    shuffleButton.classList.add("button-active");
  } else {
    isShuffled = false;
    shuffleArray(...originalPlaylist);
    shuffleButton.classList.remove("button-active");
  }
}

function repeatButtonClicked() {
  if (repeatOn === false) {
    repeatOn = true;
    repeatButton.classList.add("button-active");
  } else {
    repeatOn = false;
    repeatButton.classList.remove("button-active");
  }
}

function nextOrRepeat() {
  if (repeatOn === false) {
    nextSong();
  } else {
    playSong();
  }
}

function toHHMMSS(originalNumber) {
  let hours = Math.floor(originalNumber / 3600);
  let min = Math.floor((originalNumber - hours * 3600) / 60);
  let secs = Math.floor(originalNumber - hours * 3600 - min * 60);

  return `${hours.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateTotalTime() {
  totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonRender() {
  if (sortedPlaylist[index].liked === true) {
    likeButton.querySelector(".bi").classList.remove("bi-heart");
    likeButton.querySelector(".bi").classList.add("bi-heart-fill");
    likeButton.classList.add("button-active");
  } else {
    likeButton.querySelector(".bi").classList.remove("bi-heart-fill");
    likeButton.querySelector(".bi").classList.add("bi-heart");
    likeButton.classList.remove("button-active");
  }
}

function likeButtonClicked() {
  if (sortedPlaylist[index].liked === false) {
    sortedPlaylist[index].liked = true;
  } else {
    sortedPlaylist[index].liked = false;
  }
  likeButtonRender();
  localStorage.setItem("playlist", JSON.stringify(originalPlaylist));
}

initializeSong();

playPause.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgress);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
progressContainer.addEventListener("click", jumpTo);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);
