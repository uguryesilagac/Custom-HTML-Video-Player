/**  @type {HTMLVideoElement} */

let VideoPlayer = document.querySelector(".VideoPlayer");
let MainVideo = document.querySelector(".MainVideo");
let ProgressAreaTime = document.querySelector(".ProgressAreaTime");
let Controls = document.querySelector(".Controls");
let ProgressArea = document.querySelector(".ProgressArea");
let ProgressBar = document.querySelector(".ProgressBar");
let replay_10 = document.querySelector(".replay_10");
let play_arrow = document.querySelector(".play_arrow");
let forward_10 = document.querySelector(".forward_10");
let volume = document.querySelector(".volume");
let VolumeRangeArea = document.querySelector(".VolumeRangeArea");
let current = document.querySelector(".current");
let deneme = document.querySelector(".deneme");
let duration = document.querySelector(".duration");
let autoplay = document.querySelector(".autoplay");
let closed_caption = document.querySelector(".closed_caption");
let captions = document.querySelector(".captions");
let ChooseSubtitle = document.querySelector(".ChooseSubtitle");
let captionsText = document.querySelector(".captionsText");
let Tracks = VideoPlayer.querySelectorAll("track");
let captionLabels = captions.querySelector("ul");
let SubtitleList = document.querySelector(".SubtitleList");
let SubtitleSettings = document.querySelector(".SubtitleSettings");
let settingsButton = document.querySelector(".settingsButton");
let picture_in_picture_alt = document.querySelector(".picture_in_picture_alt");
let fullscreen = document.querySelector(".fullscreen");
let Settings = document.querySelector(".settingsHome");
let Quality = document.querySelector(".Quality");
let PlayBack = document.querySelector(".PlayBack");
let SpeedOptions = PlayBack.querySelectorAll("ul li");
let QualityOptions = Quality.querySelectorAll("ul li");
let ThumbForProgressAreaBar = document.querySelector(".ThumbForProgressAreaBar");
let volumeProgressBar = document.querySelector(".volumeProgressBar");
let ThumbChangeOfVolume = document.querySelector(".ThumbChangeOfVolume");
let Timer = document.querySelector(".Timer");
let PersentageVolume = document.querySelector(".PersentageVolume");
let BufferedProgressBar = document.querySelector(".BufferedProgressBar");
let thumbnail = document.querySelector(".thumbnail");
let spinner = document.querySelector(".spinner");
let toolTipForSettings = document.querySelector(".toolTipForSettings");
let toolTipForCaptions = document.querySelector(".toolTipForCaptions");
let settingsHome = document.querySelector(".settingsHome");
let ForSpeedSection = document.querySelector(".ForSpeedSection");
let ForQualitySection = document.querySelector(".ForQualitySection");
let BackForSettingsHome = document.querySelectorAll(".BackForSettingsHome");
let MouseOnVideoTimeController;
let ControlsOnVideoTimeController;
let VolumeOnVideoTimeController;
let thumbnails = [];
let thumbnailWidth = 85;
let thumbnailHeight = 45;
let horizontalItemCount = 1;
let verticalItemCount = 1;
let preview_video = document.createElement("video");
preview_video.preload = "metadata";
preview_video.width = "160";
preview_video.height = "90";
preview_video.controls = true;
preview_video.src = MainVideo.src;

preview_video.addEventListener("loadeddata", async function () {
    preview_video.pause();
    let count = 1;
    let id = 1;
    let x = 0, y = 0;
    let array = [];
    let duration = parseInt(this.duration);
    for (let i = 1; i <= duration; i++) {
        array.push(i);
    }
    let canvas;
    let i, j;
    for (i = 0, j = array.length; i < j; i += horizontalItemCount) {
        for (let startIndex of array.slice(i, i + horizontalItemCount)) {
            let backgroundPositionX = x * thumbnailWidth;
            let backgroundPositionY = y * thumbnailHeight;
            let item = thumbnails.find(x => x.id === id);
            if (!item) {
                canvas = document.createElement('canvas');
                canvas.width = thumbnailWidth * horizontalItemCount;
                canvas.height = thumbnailHeight * verticalItemCount;
                thumbnails.push({
                    id: id,
                    canvas: canvas,
                    sec: [{
                        index: startIndex,
                        backgroundPositionX: -backgroundPositionX,
                        backgroundPositionY: -backgroundPositionY
                    }]
                });
            } else {
                canvas = item.canvas;
                item.sec.push({
                    index: startIndex,
                    backgroundPositionX: -backgroundPositionX,
                    backgroundPositionY: -backgroundPositionY
                });
            }
            let context = canvas.getContext('2d');
            preview_video.currentTime = startIndex;
            await new Promise(function (resolve) {
                let event = function () {
                    context.drawImage(preview_video, backgroundPositionX, backgroundPositionY,
                        thumbnailWidth, thumbnailHeight);
                    x++;
                    preview_video.removeEventListener('canplay', event);
                    resolve();
                };
                preview_video.addEventListener('canplay', event);
            });
            count++;
        }
        x = 0;
        y++;
        if (count > horizontalItemCount * verticalItemCount) {
            count = 1;
            x = 0;
            y = 0;
            id++;
        }
    }
    thumbnails.forEach(function (item) {
        item.canvas.toBlob(blob => item.data = URL.createObjectURL(blob), 'image/jpeg');
        delete item.canvas;
    });
});
function HideMouseCursor() {
    MainVideo.style.cursor = "none";
}
function ShowMouseCursor() {
    MainVideo.style.cursor = "auto";
}
MainVideo.addEventListener("mousemove", () => {
    clearTimeout(MouseOnVideoTimeController);
    ShowMouseCursor();
    MouseOnVideoTimeController = setTimeout(HideMouseCursor, 5000);

});
MainVideo.addEventListener("mouseleave", () => {
    clearTimeout(MouseOnVideoTimeController);
    ShowMouseCursor();
});
window.addEventListener("load", () => {
    Controls.classList.add("active");
});
let StateOfMouse = false;
MainVideo.addEventListener("mousemove", () => {
    StateOfMouse = true;
    if (play_arrow.classList.contains("play_arrow")) {
        clearTimeout(ControlsOnVideoTimeController);
        Controls.classList.add("active");
    }
    else {
        clearTimeout(ControlsOnVideoTimeController);
        ControlsOnVideoTimeController = setTimeout(() => {
            Controls.classList.remove("active");
            settingsHome.style.display = "none";
            Quality.style.display = "none";
            PlayBack.style.display = "none";
            VolumeRangeArea.style.visibility = "hidden";
        }, 5000);
    }
    if (StateOfMouse) {
        Controls.classList.add("active");
        StateOfMouse = false;
    }
});
function PlayVideo() {
    play_arrow.innerHTML = "pause";
    play_arrow.title = "Pause";
    play_arrow.classList.remove("play_arrow");
    play_arrow.classList.add("paused");
    MainVideo.play();
    Controls.classList.remove("active");
    clearTimeout(MouseOnVideoTimeController);
    HideMouseCursor();
}
function PauseVideo() {
    play_arrow.innerHTML = "play_arrow";
    play_arrow.title = "Play";
    play_arrow.classList.remove("paused");
    play_arrow.classList.add("play_arrow");
    MainVideo.pause();
    Controls.classList.add("active");
    clearTimeout(MouseOnVideoTimeController);
    ShowMouseCursor();
}
play_arrow.addEventListener("click", () => {
    let isVideoPaused = play_arrow.classList.contains("paused");
    isVideoPaused ? PauseVideo() : PlayVideo();
});
MainVideo.addEventListener("click", () => {
    let isVideoPaused = play_arrow.classList.contains("paused");
    isVideoPaused ? PauseVideo() : PlayVideo();
});
replay_10.addEventListener("click", () => {
    MainVideo.currentTime -= 10;
});
forward_10.addEventListener("click", () => {
    MainVideo.currentTime += 10;
});
MainVideo.addEventListener("play", () => {
    PlayVideo();
});
MainVideo.addEventListener("pause", () => {
    PauseVideo();
});
MainVideo.addEventListener("loadeddata", (e) => {
    let VideoDuration = e.target.duration;
    let Seconds = Math.floor(VideoDuration % 60);
    let Minutes = Math.floor(VideoDuration / 60);
    let Hours = Math.floor(Minutes / 60);
    if (Seconds > 9 && Minutes > 9 && Hours > 9) {
        duration.innerHTML = `${Hours}:${Minutes}:${Seconds}`;
    }
    if (Seconds < 10 && Minutes > 9 && Hours > 9) {
        duration.innerHTML = `${Hours}:${Minutes}:0${Seconds}`;
    }
    if (Seconds < 10 && Minutes < 10 && Hours > 9) {
        duration.innerHTML = `${Hours}:0${Minutes}:0${Seconds}`;
    }
    if (Seconds < 10 && Minutes < 10 && Hours < 10) {
        duration.innerHTML = `0${Hours}:0${Minutes}:0${Seconds}`;
    }
    if (Seconds > 9 && Minutes > 9 && Hours < 10) {
        duration.innerHTML = `0${Hours}:${Minutes}:${Seconds}`;
    }
    if (Seconds > 9 && Minutes < 10 && Hours < 10) {
        duration.innerHTML = `0${Hours}:0${Minutes}:${Seconds}`;
    }
    if (Seconds > 9 && Minutes < 10 && Hours > 9) {
        duration.innerHTML = `${Hours}:0${Minutes}:${Seconds}`;
    }
    if (Seconds < 10 && Minutes > 9 && Hours < 10) {
        duration.innerHTML = `0${Hours}:${Minutes}:0${Seconds}`;
    }
});
MainVideo.addEventListener("timeupdate", (e) => {
    let VideoDuration = e.target.duration;
    let VideoCurrentTime = e.target.currentTime;
    let Seconds = Math.floor(VideoCurrentTime % 60);
    let Minutes = Math.floor(VideoCurrentTime / 60);
    let Hours = Math.floor(Minutes / 60);
    if (Seconds > 9 && Minutes > 9 && Hours > 9) {
        current.innerHTML = `${Hours}:${Minutes}:${Seconds}`;
    }
    if (Seconds < 10 && Minutes > 9 && Hours > 9) {
        current.innerHTML = `${Hours}:${Minutes}:0${Seconds}`;
    }
    if (Seconds < 10 && Minutes < 10 && Hours > 9) {
        current.innerHTML = `${Hours}:0${Minutes}:0${Seconds}`;
    }
    if (Seconds < 10 && Minutes < 10 && Hours < 10) {
        current.innerHTML = `0${Hours}:0${Minutes}:0${Seconds}`;
    }
    if (Seconds > 9 && Minutes > 9 && Hours < 10) {
        current.innerHTML = `0${Hours}:${Minutes}:${Seconds}`;
    }
    if (Seconds > 9 && Minutes < 10 && Hours < 10) {
        current.innerHTML = `0${Hours}:0${Minutes}:${Seconds}`;
    }
    if (Seconds > 9 && Minutes < 10 && Hours > 9) {
        current.innerHTML = `${Hours}:0${Minutes}:${Seconds}`;
    }
    if (Seconds < 10 && Minutes > 9 && Hours < 10) {
        current.innerHTML = `0${Hours}:${Minutes}:0${Seconds}`;
    }
    let ProgressBarWidth = (VideoCurrentTime / VideoDuration) * 100;
    ProgressBar.style.width = ProgressBarWidth + "%";
});
ProgressArea.addEventListener("click", (e) => {
    let VideoDuration = MainVideo.duration;
    let ProgressBarWidthValue = ProgressArea.clientWidth;
    let ClickOffsetX = e.offsetX;
    MainVideo.currentTime = (ClickOffsetX / ProgressBarWidthValue) * VideoDuration;

    let ProgressBarWidth = (MainVideo.currentTime / VideoDuration) * 100;
    ProgressBar.style.width = ProgressBarWidth + "%";
    let VideoCurrentTime = MainVideo.currentTime;
    let Seconds = Math.floor(VideoCurrentTime % 60);
    let Minutes = Math.floor(VideoCurrentTime / 60);
    let Hours = Math.floor(Minutes / 60);
    if (Seconds > 9 && Minutes > 9 && Hours > 9) {
        current.innerHTML = `${Hours}:${Minutes}:${Seconds}`;
    }
    if (Seconds < 10 && Minutes > 9 && Hours > 9) {
        current.innerHTML = `${Hours}:${Minutes}:0${Seconds}`;
    }
    if (Seconds < 10 && Minutes < 10 && Hours > 9) {
        current.innerHTML = `${Hours}:0${Minutes}:0${Seconds}`;
    }
    if (Seconds < 10 && Minutes < 10 && Hours < 10) {
        current.innerHTML = `0${Hours}:0${Minutes}:0${Seconds}`;
    }
    if (Seconds > 9 && Minutes > 9 && Hours < 10) {
        current.innerHTML = `0${Hours}:${Minutes}:${Seconds}`;
    }
    if (Seconds > 9 && Minutes < 10 && Hours < 10) {
        current.innerHTML = `0${Hours}:0${Minutes}:${Seconds}`;
    }
    if (Seconds > 9 && Minutes < 10 && Hours > 9) {
        current.innerHTML = `${Hours}:0${Minutes}:${Seconds}`;
    }
    if (Seconds < 10 && Minutes > 9 && Hours < 10) {
        current.innerHTML = `0${Hours}:${Minutes}:0${Seconds}`;
    }
});
MainVideo.addEventListener("waiting", () => {
    spinner.style.display = "block";
});
MainVideo.addEventListener("canplay", () => {
    spinner.style.display = "none";
});
VideoPlayer.addEventListener("mouseenter", () => {
    Controls.classList.add("active");
})
ThumbForProgressAreaBar.addEventListener("mousedown", () => {
    ProgressArea.classList.add("ChangeTimeWithThumb");
    ProgressArea.addEventListener("mousemove", (event) => {
        if (ProgressArea.classList.contains("ChangeTimeWithThumb")) {
            let VideoDuration = MainVideo.duration;
            let ProgressBarWidth = ProgressArea.clientWidth;
            let ClickOffsetX = event.offsetX;
            let PersentageForProgressBar = (ClickOffsetX / ProgressBarWidth) * 100;
            MainVideo.currentTime = (ClickOffsetX / ProgressBarWidth) * VideoDuration;
            ProgressBar.style.width = PersentageForProgressBar + "%";
        }
    });
    ThumbForProgressAreaBar.addEventListener("mouseup", () => {
        ProgressArea.classList.remove("ChangeTimeWithThumb");
    });
    ProgressArea.addEventListener("mouseleave", () => {
        ProgressArea.classList.remove("ChangeTimeWithThumb");
    });
});
fullscreen.addEventListener("click", () => {
    if (fullscreen.classList.contains("fullscreen")) {
        fullscreen.innerHTML = "fullscreen_exit";
        VideoPlayer.requestFullscreen();
        toolTipForSettings.style.top = "91.629%";
        toolTipForSettings.style.left = "92.5%";
        toolTipForCaptions.style.top = "91.629%";
        toolTipForCaptions.style.left = "90.4%";
        fullscreen.classList.remove("fullscreen");

    }
    else {
        fullscreen.classList.add("fullscreen");
        document.exitFullscreen();
        toolTipForSettings.style.top = "84.5%";
        toolTipForSettings.style.left = "87%";
        toolTipForCaptions.style.top = "84.5%";
        toolTipForCaptions.style.left = "82.5%";
        fullscreen.innerHTML = "fullscreen";
    }
});
MainVideo.addEventListener("dblclick", () => {
    if (fullscreen.classList.contains("fullscreen")) {
        fullscreen.innerHTML = "fullscreen_exit";
        VideoPlayer.requestFullscreen();
        MainVideo.style.border = "none";
        fullscreen.classList.remove("fullscreen");
    }
    else {
        fullscreen.classList.add("fullscreen");
        document.exitFullscreen();
        fullscreen.innerHTML = "fullscreen";
    }
});
autoplay.addEventListener("click", () => {
    autoplay.classList.toggle("active");
    if (autoplay.classList.contains("active")) {
        autoplay.title = "Auto Play Open";
    }
    else {
        autoplay.title = "Auto Play Close";
    }
});
MainVideo.addEventListener("ended", () => {
    if (autoplay.classList.contains("active")) {
        PlayVideo();
    }
    else {
        play_arrow.innerHTML = "replay";
        play_arrow.title = "Replay";

    }
});
ProgressArea.addEventListener("mousemove", (e) => {
    if (MainVideo.readyState === 4) {
        let ProgressBarValue = ProgressArea.clientWidth;
        let x = e.offsetX;
        let VideoDuration = MainVideo.duration;
        let ProgressTime = Math.floor((x / ProgressBarValue) * VideoDuration);
        let Seconds = Math.floor(ProgressTime % 60);
        let Minutes = Math.floor(ProgressTime / 60);
        let Hours = Math.floor(Minutes / 60);
        if (Seconds > 9 && Minutes > 9 && Hours > 9) {
            ProgressAreaTime.innerHTML = `${Hours}:${Minutes}:${Seconds}`;
        }
        if (Seconds < 10 && Minutes > 9 && Hours > 9) {
            ProgressAreaTime.innerHTML = `${Hours}:${Minutes}:0${Seconds}`;
        }
        if (Seconds < 10 && Minutes < 10 && Hours > 9) {
            ProgressAreaTime.innerHTML = `${Hours}:0${Minutes}:0${Seconds}`;
        }
        if (Seconds < 10 && Minutes < 10 && Hours < 10) {
            ProgressAreaTime.innerHTML = `0${Hours}:0${Minutes}:0${Seconds}`;
        }
        if (Seconds > 9 && Minutes > 9 && Hours < 10) {
            ProgressAreaTime.innerHTML = `0${Hours}:${Minutes}:${Seconds}`;
        }
        if (Seconds > 9 && Minutes < 10 && Hours < 10) {
            ProgressAreaTime.innerHTML = `0${Hours}:0${Minutes}:${Seconds}`;
        }
        if (Seconds > 9 && Minutes < 10 && Hours > 9) {
            ProgressAreaTime.innerHTML = `${Hours}:0${Minutes}:${Seconds}`;
        }
        if (Seconds < 10 && Minutes > 9 && Hours < 10) {
            ProgressAreaTime.innerHTML = `0${Hours}:${Minutes}:0${Seconds}`;
        }
        if (x >= ProgressBarValue - 80) {
            x = ProgressBarValue - 80;
        }
        else if (x <= 75) {
            x = 75;
        }
        else {
            x = e.offsetX;
        }
        ProgressAreaTime.style.setProperty("--x", `${x + 11.3}px`);
        ProgressAreaTime.style.display = "block";
        thumbnail.style.setProperty("--x", `${x - 72}px`);
        thumbnail.style.display = "block";
        for (let item of thumbnails) {
            let data = item.sec.find(x1 => x1.index === ProgressTime);
            if (data) {
                if (item.data != undefined) {
                    thumbnail.style.backgroundImage = `url(${item.data})`;
                    thumbnail.style.backgroundPositionX = data.backgroundPositionX + "px";
                    thumbnail.style.backgroundPositionY = data.backgroundPositionY + "px";
                    thumbnail.style.setProperty("--x", `${x - 72}px`);
                    thumbnail.style.backgroundSize = "cover";
                    thumbnail.style.backgroundRepeat = "no-repaet";
                    thumbnail.style.display = "block";
                    return;
                }
            }
        }
    }
});
ProgressArea.addEventListener("mouseleave", () => {
    ProgressAreaTime.style.display = "none";
    thumbnail.style.display = "none";
});
picture_in_picture_alt.addEventListener("click", () => {
    MainVideo.requestPictureInPicture();
});
function removeActiveClasses(e) {
    e.forEach((event) => {
        event.classList.remove("active");
    });
}
settingsButton.addEventListener("click", () => {
    let StyleOfSettingsHome = window.getComputedStyle(settingsHome).display;
    let StyleOfCaptions = window.getComputedStyle(captions).display;
    let StyleOfQuality = window.getComputedStyle(Quality).display;
    let StyleOfPlayBack = window.getComputedStyle(PlayBack).display;
    if (StyleOfPlayBack == "block") {
        PlayBack.style.display = "none";
    }
    else {
        if (StyleOfSettingsHome == "none") {
            settingsHome.style.display = "block";
            toolTipForSettings.style.visibility = "visible";
            if (StyleOfCaptions == "block") {
                captions.style.display = "none";
                toolTipForCaptions.style.visibility = "hidden";
            }
        }
        else {
            settingsHome.style.display = "none";
            toolTipForSettings.style.visibility = "hidden";
        }
    }
    if (StyleOfQuality == "block") {
        Quality.style.display = "none";
    }
    else {
        if (StyleOfSettingsHome == "none") {
            settingsHome.style.display = "block";
            toolTipForSettings.style.visibility = "visible";
            if (StyleOfCaptions == "block") {
                captions.style.display = "none";
                toolTipForCaptions.style.visibility = "hidden";
            }
        }
        else {
            settingsHome.style.display = "none";
            toolTipForSettings.style.visibility = "hidden";
        }
    }
});
ForQualitySection.addEventListener("click", () => {
    settingsHome.style.display = "none";
    Quality.style.display = "block";
});
ForSpeedSection.addEventListener("click", () => {
    settingsHome.style.display = "none";
    PlayBack.style.display = "block";
});
BackForSettingsHome[0].addEventListener("click", () => {
    settingsHome.style.display = "block";
    PlayBack.style.display = "none";
})
BackForSettingsHome[1].addEventListener("click", () => {
    settingsHome.style.display = "block";
    Quality.style.display = "none";
})
closed_caption.addEventListener("click", () => {
    let StyleOfSettingsHome = window.getComputedStyle(settingsHome).display;
    let StyleOfQuality = window.getComputedStyle(Quality).display;
    let StyleOfPlayBack = window.getComputedStyle(PlayBack).display;
    let StyleOfCaptions = window.getComputedStyle(captions).display;
    if (StyleOfCaptions == "none") {
        captions.style.display = "block";
        toolTipForCaptions.style.visibility = "visible";
        if (StyleOfSettingsHome == "block") {
            settingsHome.style.display = "none";
            toolTipForSettings.style.visibility = "hidden";
        }
        if (StyleOfQuality == "block") {
            Quality.style.display = "none";
            toolTipForSettings.style.visibility = "hidden";
        }
        if (StyleOfPlayBack == "block") {
            PlayBack.style.display = "none";
            toolTipForSettings.style.visibility = "hidden";
        }
    }
    else {
        captions.style.display = "none";
        toolTipForCaptions.style.visibility = "hidden";
    }
});
QualityOptions.forEach((event) => {
    event.addEventListener("click", () => {
        removeActiveClasses(QualityOptions);
        event.classList.add("active");
        //This place should be contain for different videos for qualty options
    });
});
SpeedOptions.forEach((event) => {
    event.addEventListener("click", () => {
        removeActiveClasses(SpeedOptions);
        event.classList.add("active");
        let Speed = event.getAttribute("data-speed");
        MainVideo.playbackRate = Speed;
    });
});
if (Tracks.length != 0) {
    captionLabels.insertAdjacentHTML("afterbegin", `<li data-track="OFF" class="active" >Kapalı</li>`);
    for (let i = 0; i < Tracks.length; i++) {
        let trackli = `<li data-track="${Tracks[i].label}">${Tracks[i].label}</li>`;
        captionLabels.insertAdjacentHTML("beforeend", trackli);
    }
}
let Subtitles = captions.querySelectorAll("li");
Subtitles.forEach((event) => {
    event.addEventListener("click", () => {
        removeActiveClasses(Subtitles);
        event.classList.add("active");
        ChangeCaption(event);
    });
});
let track = MainVideo.textTracks;
function ChangeCaption(lable) {
    let controlForOFF = lable.getAttribute("data-track");
    let trackLable = lable.getAttribute("data-track");
    if (controlForOFF == "OFF") {
        captionsText.style.backgroundColor = "transparent";
        captionsText.innerHTML = "";
        for (let i = 0; i < track.length; i++) {
            track[i].mode == "disabled";
        }
    }
    else {
        captionsText.style.backgroundColor = "#00000089";
    }
    for (let i = 0; i < track.length; i++) {
        track[i].mode == "disabled";
        if (track[i].label == trackLable) {
            track[i].mode = "showing";
        }
        else {
            track[i].mode = "disabled";
        }
    }
}
for (let i = 0; i < track.length; i++) {
    track[i].addEventListener("cuechange", () => {
        if (track[i].mode == "showing") {
            if (track[i].activeCues[0]) {
                let span = `<span>${track[i].activeCues[0].text} </span>`;
                captionsText.innerHTML = span;
            }
            else {
                captionsText.innerHTML = "";
            }
        }
    })

}
if (track.length == 0) {
    SubtitleList.remove();
    let NoSubtitlelu = document.createElement("ul");
    let NoSubtitleli = document.createElement("li");
    NoSubtitleli.innerHTML = "Subtitle Missing";
    captions.appendChild(NoSubtitlelu);
    NoSubtitlelu.appendChild(NoSubtitleli);
}
if (track.length > 5) {
    captions.style.overflowY = "scroll";
}
if (QualityOptions.length > 5) {
    Quality.style.overflowY = "scroll";
}
else {
    Quality.style.overflowY = "hidden";
}
MainVideo.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});
window.addEventListener("load", () => {
    MainVideo.volume = 0.7;
    volumeProgressBar.style.width = "70px";
    captionsText.style.backgroundColor = "transparent";

});
ThumbChangeOfVolume.addEventListener("mousedown", () => {
    volume.classList.add("VolumeChangeable");
    VolumeRangeArea.addEventListener("mousemove", (event) => {
        let ControlForVisibility = window.getComputedStyle(VolumeRangeArea).visibility;
        if (volume.classList.contains("VolumeChangeable")) {
            if (ControlForVisibility == "visible") {
                let hoveredElement = document.elementFromPoint(event.clientX, event.clientY).className;
                if (hoveredElement === "volumeProgressBar ThumbChangeOfVolume") {
                    let VolumeChangeableValue = event.offsetX;
                    if (VolumeChangeableValue <= 100 && VolumeChangeableValue >= 0) {
                        volumeProgressBar.style.width = VolumeChangeableValue + "px";
                        PersentageVolume.innerHTML = VolumeChangeableValue;
                        MainVideo.volume = VolumeChangeableValue / 100;
                        if (MainVideo.volume >= 0.5) {
                            volume.innerHTML = "volume_up";
                        }
                        if (MainVideo.volume <= 0.4) {
                            volume.innerHTML = "volume_down";
                        }
                        if (MainVideo.volume == 0) {
                            volume.innerHTML = "volume_off";
                        }
                    }
                }
            }
        }
    });
});
VolumeRangeArea.addEventListener("mousedown", (event) => {
    let ControlForVisibility = window.getComputedStyle(VolumeRangeArea).visibility;
    if (ControlForVisibility == "visible") {
        let hoveredElement = document.elementFromPoint(event.clientX, event.clientY).className;
        if (hoveredElement === "VolumeRangeArea") {
            let VolumeChangeableValue = event.offsetX;
            if (VolumeChangeableValue <= 100 && VolumeChangeableValue >= 0) {
                volumeProgressBar.style.width = VolumeChangeableValue + "px";
                MainVideo.volume = VolumeChangeableValue / 100;
                PersentageVolume.innerHTML = VolumeChangeableValue;
                if (MainVideo.volume >= 0.5) {
                    volume.innerHTML = "volume_up";
                }
                if (MainVideo.volume <= 0.4) {
                    volume.innerHTML = "volume_down";
                }
                if (MainVideo.volume == 0) {
                    volume.innerHTML = "volume_off";
                }
            }
        }
        if (hoveredElement === "volumeProgressBar ThumbChangeOfVolume") {
            let VolumeChangeableValue = event.offsetX;
            if (VolumeChangeableValue <= 100 && VolumeChangeableValue >= 0) {
                volumeProgressBar.style.width = VolumeChangeableValue + "px";
                MainVideo.volume = VolumeChangeableValue / 100;
                PersentageVolume.innerHTML = VolumeChangeableValue;
                if (MainVideo.volume >= 0.5) {
                    volume.innerHTML = "volume_up";
                }
                if (MainVideo.volume <= 0.4) {
                    volume.innerHTML = "volume_down";
                }
                if (MainVideo.volume == 0) {
                    volume.innerHTML = "volume_off";
                }
            }
        }
    }
});
let LastVolume = 0.7;
let isMuted = false;
volume.addEventListener("click", () => {
    if (isMuted) {
        MainVideo.volume = LastVolume;
        PersentageVolume.innerHTML = LastVolume * 100;
        volumeProgressBar.style.width = LastVolume * 100 + "%";
        PersentageVolume.innerHTML = LastVolume*100;
        isMuted = false;
        if (MainVideo.volume >= 0.5) {
            volume.innerHTML = "volume_up";
        }
        if (MainVideo.volume <= 0.4) {
            volume.innerHTML = "volume_down";
        }
        if (MainVideo.volume == 0) {
            volume.innerHTML = "volume_off";
        }
    }
    else {
        LastVolume = MainVideo.volume;
        MainVideo.volume = 0;
        volumeProgressBar.style.width = "0%";
        isMuted = true;
        volume.innerHTML = "volume_off";
        PersentageVolume.innerHTML = 0;
    }
});
volume.addEventListener("mouseover", () => {
    clearTimeout(VolumeOnVideoTimeController);
    VolumeRangeArea.style.visibility = "visible";
});
volume.addEventListener("mouseleave", () => {
    clearTimeout(VolumeOnVideoTimeController);
    VolumeOnVideoTimeController = setTimeout(() => {
        VolumeRangeArea.style.visibility = "hidden";
    }, 12000);
});
ThumbChangeOfVolume.addEventListener("mousemove", () => {
    VolumeRangeArea.style.visibility = "visible";
});
ThumbChangeOfVolume.addEventListener("mouseup", () => {
    volume.classList.remove("VolumeChangeable");
});
VolumeRangeArea.addEventListener("mouseleave", () => {
    volume.classList.remove("VolumeChangeable");
    VolumeRangeArea.style.visibility = "hidden";
});
ThumbChangeOfVolume.addEventListener("mouseleave", () => {
    volume.classList.remove("VolumeChangeable");
});
volumeProgressBar.addEventListener("mouseleave", () => {
    volume.classList.remove("VolumeChangeable");
});
VolumeRangeArea.addEventListener("mouseup", () => {
    volume.classList.remove("VolumeChangeable");
});
ThumbChangeOfVolume.addEventListener("mouseup", () => {
    volume.classList.remove("VolumeChangeable");
});
volumeProgressBar.addEventListener("mouseup", () => {
    volume.classList.remove("VolumeChangeable");
});
MainVideo.addEventListener("loadeddata", () => {
    setInterval(() => {
        let VideoBufferdTime = MainVideo.buffered.end(0);
        let duration = MainVideo.duration;
        let BufferedProgressBarWidth = (VideoBufferdTime / duration) * 100;
        BufferedProgressBar.style.width = BufferedProgressBarWidth + "%";
    });
});
// let xhr = new XMLHttpRequest();
// xhr.open("GET", "Videos/Video1.mp4");
// xhr.responseType = "arraybuffer";
// xhr.onload = (e) => {
//     let blob = new Blob([xhr.response]);
//     let url = URL.createObjectURL(blob);
//     MainVideo.src = url;
// }
// xhr.send();

setInterval(() => {
    if (Controls.classList.contains("active")) {
        ShowMouseCursor();
    }
    else {
        HideMouseCursor();
    }
    if (!Controls.classList.contains("active")) {
        VolumeRangeArea.style.visibility = "hidden";
        settingsHome.style.display = "none";
        Quality.style.display = "none";
        PlayBack.style.display = "none";
        toolTipForSettings.style.visibility = "hidden";
        captions.style.display = "none";
        toolTipForCaptions.style.visibility = "hidden";
    }
    let ArrowVolumeControl = MainVideo.volume * 100;
    document.onmousemove = (event1) => {
        let ElementSelector = document.elementFromPoint(event1.clientX, event1.clientY).className;
        document.onkeydown = (event2) => {
            let KeyboardEvent = event2.code;
            if (ElementSelector !== null) {
                if (ElementSelector === "MainVideo" && KeyboardEvent == "Space") {
                    let isVideoPaused = play_arrow.classList.contains("paused");
                    isVideoPaused ? PauseVideo() : PlayVideo();
                }
                if (ElementSelector === "MainVideo" && KeyboardEvent == "KeyF") {

                    if (fullscreen.classList.contains("fullscreen")) {
                        fullscreen.innerHTML = "fullscreen_exit";
                        VideoPlayer.requestFullscreen();
                        fullscreen.classList.remove("fullscreen");
                    }
                    else {
                        fullscreen.classList.add("fullscreen");
                        document.exitFullscreen();
                        fullscreen.innerHTML = "fullscreen";
                    }
                }
                if (ElementSelector === "MainVideo" && KeyboardEvent == "ArrowUp") {
                    ArrowVolumeControl += 2;
                    let UseableArrowVolumeControlForIncrease = ArrowVolumeControl / 100;
                    if (UseableArrowVolumeControlForIncrease <= 1 && UseableArrowVolumeControlForIncrease >= 0) {
                        MainVideo.volume = UseableArrowVolumeControlForIncrease;
                        volumeProgressBar.style.width = UseableArrowVolumeControlForIncrease * 100 + "px";
                        if (MainVideo.volume >= 0.5) {
                            volume.innerHTML = "volume_up";
                        }
                        if (MainVideo.volume <= 0.4) {
                            volume.innerHTML = "volume_down";
                        }
                        if (MainVideo.volume == 0) {
                            volume.innerHTML = "volume_off";
                        }
                    }
                }
                if (ElementSelector === "MainVideo" && KeyboardEvent == "ArrowDown") {
                    ArrowVolumeControl -= 2;
                    let UseableArrowVolumeControlForDecrease = ArrowVolumeControl / 100;
                    if (UseableArrowVolumeControlForDecrease <= 1 && UseableArrowVolumeControlForDecrease >= 0) {
                        MainVideo.volume = UseableArrowVolumeControlForDecrease;
                        volumeProgressBar.style.width = UseableArrowVolumeControlForDecrease * 100 + "px";
                        if (MainVideo.volume >= 0.5) {
                            volume.innerHTML = "volume_up";
                        }
                        if (MainVideo.volume <= 0.4) {
                            volume.innerHTML = "volume_down";
                        }
                        if (MainVideo.volume == 0) {
                            volume.innerHTML = "volume_off";
                        }
                    }
                }
                if (ElementSelector === "MainVideo" && KeyboardEvent == "ArrowLeft") {
                    MainVideo.currentTime -= 10;
                }
                if (ElementSelector === "MainVideo" && KeyboardEvent == "ArrowRight") {
                    MainVideo.currentTime += 10;
                }
            }

        }

    }
});
