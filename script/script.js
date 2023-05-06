const cover = document.getElementById("cover");
const songName = document.getElementById("song_name");
const bandName = document.getElementById("band_name");
const song = document.getElementById("audio");
const like = document.getElementById("like");
const play = document.getElementById("play");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const shuffle = document.getElementById("shuffle");
const repeat = document.getElementById("repeat");
const currentProgress = document.getElementById("current_progress");
const progressContainer = document.getElementById("progress_container");
const songTime = document.getElementById("song_time");
const totalTime = document.getElementById("total_time");

const calmDown = {
    songName: "Calm Down",
    bandName: "Rema",
    img_link:
        "https://drive.google.com/uc?id=1SDgKXW-WofSNiWpofsvkcUUNv2CqutLv",
    song_link:
        "https://drive.google.com/uc?id=15kz1jdFZbD4bbgVAhNBfDhGu6eEDM-zC",
    liked: false,
};
const apologize = {
    songName: "Apologize",
    bandName: "Timbaland - ft. OneRepublic",
    img_link:
        "https://drive.google.com/uc?id=1kvuQGQQf6YY_9bneDksZ0JM3tvURyfNF",
    song_link:
        "https://drive.google.com/uc?id=16nBdioK_h6raiaO2JmAMHOf4DtgDWnHb",
    liked: false,
};
const flowers = {
    songName: "Flowers",
    bandName: "Miley Cyrus",
    img_link:
        "https://drive.google.com/uc?id=19YTCqOuLKMzpC4jpxIQL1WAjUCVe6peV",
    song_link:
        "https://drive.google.com/uc?id=1kXyvUdGRi1-3oXgYyhrSAjWPtoS9yGXI",
    liked: false,
};
const oldTownRoadBilly = {
    songName: "Old Town Road Billy",
    bandName: "Lil Nas X",
    img_link:
        "https://drive.google.com/uc?id=1tUUSkd667MCktZl1Cj_qkG9aGzBBtZ9Z",
    song_link:
        "https://drive.google.com/uc?id=1z-KK9PIHw_2UlBOVDUVauwwgTroGpLfO",
    liked: false,
};

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [
    calmDown,
    apologize,
    flowers,
    oldTownRoadBilly,
];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

function playSong() {
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function initializeSong() {
    cover.src = sortedPlaylist[index].img_link;
    song.src = sortedPlaylist[index].song_link;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].bandName;
    likeRender();
}

function previousSong() {
    if (index === 0) {
        index = sortedPlaylist.length - 1;
    } else {
        --index;
    }
    initializeSong();
    playSong();
}

function nextSong() {
    if (index === sortedPlaylist.length - 1) {
        index = 0;
    } else {
        index++;
    }
    initializeSong();
    playSong();
}

function nextOrRepeat() {
    if (repeatOn) {
        playSong();
    } else {
        nextSong();
    }
}

function updatePregress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
    totalTime.innerText = toHHMMSS(song.duration - song.currentTime);
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleClicked() {
    if (isShuffled) {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffle.classList.remove("button_active");
    } else {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffle.classList.add("button_active");
    }
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        --currentIndex;
    }
}

function repeatClicked() {
    if (repeatOn) {
        repeatOn = false;
        repeat.classList.remove("button_active");
    } else {
        repeatOn = true;
        repeat.classList.add("button_active");
    }
}

function toHHMMSS(originalTime) {
    let hours = Math.floor(originalTime / 3600);
    let min = Math.floor((originalTime - hours * 3600) / 60);
    let secs = Math.floor(originalTime - hours * 3600 - min * 60);

    return `${hours.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function likeClicked() {
    if (sortedPlaylist[index].liked) {
        sortedPlaylist[index].liked = false;
    } else {
        sortedPlaylist[index].liked = true;
    }
    likeRender();
    localStorage.setItem("playlist", JSON.stringify(originalPlaylist));
}

function likeRender() {
    if (sortedPlaylist[index].liked) {
        like.querySelector(".bi").classList.remove("bi-heart");
        like.querySelector(".bi").classList.add("bi-heart-fill");
        like.classList.add("button_active");
    } else {
        like.querySelector(".bi").classList.remove("bi-heart-fill");
        like.querySelector(".bi").classList.add("bi-heart");
        like.classList.remove("button_active");
    }
}

initializeSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updatePregress);
song.addEventListener("loadedmetadata", updatePregress);
song.addEventListener("ended", nextOrRepeat);
progressContainer.addEventListener("click", jumpTo);
shuffle.addEventListener("click", shuffleClicked);
repeat.addEventListener("click", repeatClicked);
like.addEventListener("click", likeClicked);
