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

    function getTrackPlays(soundListItem) {
        let plays = soundListItem.querySelector(".soundStats > li").getAttribute("title");
        return parseInt(plays.replace(/,/g, ""));
    }

    function sortTracks() {
        let parent = document.querySelector(".soundList > ul");
        let tracks = Array.from(document.querySelectorAll(".soundList > ul > li"));

        tracks.sort((t1, t2) => getTrackPlays(t1) > getTrackPlays(t2) ? -1 : 1);
        tracks.forEach(track => parent.appendChild(track));
    }

    let sortButton = document.createElement("button");
    sortButton.className = "sc-button sc-button-medium sc-button-responsive";
    sortButton.textContent = "Sort by views"
    sortButton.onclick = sortTracks;

    let siteButtons = document.querySelector(".userInfoBar__buttons > .sc-button-group");
    siteButtons.prepend(sortButton);
})();
