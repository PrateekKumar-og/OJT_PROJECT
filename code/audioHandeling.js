"use strict";

const audioEle = document.getElementById('audioEle');

function togglePlay() {
    if(audioEle.paused) {
        audioEle.play()
    } else {
        audioEle.pause()
    }
}