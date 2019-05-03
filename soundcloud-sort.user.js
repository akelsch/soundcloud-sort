// ==UserScript==
// @name         soundcloud-sort
// @namespace    https://github.com/akelsch
// @version      0.1
// @description  Enables sorting by likes/plays on a "Tracks" page
// @author       Arthur Kelsch
// @match        https://soundcloud.com/*/tracks
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function removeThousandsSeperator(numberText) {
        return numberText.replace(/,/g, "");
    }

    function getTrackPlays(soundListItem) {
        let plays = soundListItem.querySelector(".soundStats > li").getAttribute("title");
        return parseInt(removeThousandsSeperator(plays));
    }

    function sortTracks() {
        let parent = document.querySelector(".soundList > ul");
        let tracks = Array.from(document.querySelectorAll(".soundList > ul > li"));

        tracks.sort((t1, t2) => getTrackPlays(t1) > getTrackPlays(t2) ? -1 : 1);
        tracks.forEach(track => parent.appendChild(track));
    }

    let sortByPlaysButton = document.createElement("button");
    sortByPlaysButton.className = "sc-button sc-button-medium sc-button-responsive";
    sortByPlaysButton.textContent = "Sort by plays"
    sortByPlaysButton.onclick = sortTracks;

    let sortByLikesButton = document.createElement("button");
    sortByLikesButton.className = "sc-button sc-button-medium sc-button-responsive";
    sortByLikesButton.textContent = "Sort by likes"
    sortByLikesButton.onclick = sortTracks;

    let buttons = document.querySelector(".userInfoBar__buttons > .sc-button-group");
    buttons.prepend(sortByPlaysButton);
    buttons.prepend(sortByLikesButton);
})();
