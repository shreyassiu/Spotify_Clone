homePage = document.querySelectorAll('.homepage');
let currentAudio;
let playButton = document.getElementById("play-pause");
let currentIndex = 0; // Track the current song index
let songs = []; // This will hold the list of songs

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
}

homePage.forEach(function (element) {
    element.addEventListener('click', function () {
        window.location.href = 'index.html';
    });
});

async function getSongs() {
    let a = await fetch("/Assets/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("songs/")[1].split(".mp3")[0]);
        }
    }
    return songs;
}

const playMusic = (index) => {
    const track = songs[index];
    if (currentAudio) {
        currentAudio.pause();
    }
    currentAudio = new Audio("Assets/songs/" + track + ".mp3");
    currentAudio.play();
    playButton.src = "Assets/logo/play bar buttons/pause.svg";

    const seekbar = document.querySelector('.seekbar');

    seekbar.addEventListener('click', (e) => {
        const seekbarWidth = seekbar.clientWidth;
        const clickPosition = e.offsetX;
        const newTime = (clickPosition / seekbarWidth) * currentAudio.duration;
    
        currentAudio.currentTime = newTime;
    });

    currentAudio.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${formatTime(currentAudio.currentTime)}/${formatTime(currentAudio.duration)}`;
        document.querySelector(".song-info").innerHTML = track.replaceAll("%20", " "); // Replace %20 with space
        document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
    });
};

async function main() {
    songs = await getSongs(); // Assign songs to the global songs array

    let songUl = document.querySelector(".songs-list").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> 
                    <div class="info">
                        <img src="Assets/img/thumb.jpeg" alt="">
                        <div> <div>${song.replaceAll("%20", " ")}</div>
                        <div class="light-text small">Sourabh Yadav</div> </div>
                    </div>
                    <div class="album">
                        CodeYadav
                    </div>
                    <div class="date-added">
                        Today
                    </div>
                    <div class="playbutton">
                        <img src="Assets/logo/play bar buttons/play.svg" alt="">
                    </div> </li>`;
    }
    document.querySelectorAll(".songs-list li").forEach((e, index) => {
        e.addEventListener("click", () => {
            currentIndex = index - 1; // Adjust index to account for the heading
            if (currentIndex >= 0) {  // Make sure to avoid negative index
                playMusic(currentIndex);
            }
        });
    });

    playButton.addEventListener("click", () => {
        if (currentAudio.paused) {
            currentAudio.play();
            playButton.src = "Assets/logo/play bar buttons/pause.svg";
        } else {
            currentAudio.pause();
            playButton.src = "Assets/logo/play bar buttons/play.svg";
        }
    });
    
    document.getElementById("previous").addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--; // Move to the previous song
            playMusic(currentIndex);
        }
    });

    document.getElementById("next").addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++; // Move to the next song
            playMusic(currentIndex);
        }
    });

    // Event listener for ham in media query
    document.querySelector(".ham-button").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Event listener for closing x in media query
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });

    // Event listener for volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log("Volume set to "+e.target.value+"/100");
        currentAudio.volume = parseInt(e.target.value)/100
    })
}

main();
