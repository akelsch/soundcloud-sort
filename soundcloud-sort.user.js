// ==UserScript==
// @name         soundcloud-sort
// @namespace    https://github.com/akelsch
// @version      1.0.0
// @description  Enables sorting tracks by likes/plays on an artists tracks page
// @author       Arthur Kelsch
// @match        https://soundcloud.com/*/tracks
// @grant        none
// ==/UserScript==

"use strict";

const compareTracksByLikes = (t1, t2) => getTrackLikes(t1) > getTrackLikes(t2) ? -1 : 1;
const compareTracksByPlays = (t1, t2) => getTrackPlays(t1) > getTrackPlays(t2) ? -1 : 1;

let sortByLikesButton = createSortButton("likes", compareTracksByLikes);
let sortByPlaysButton = createSortButton("plays", compareTracksByPlays);

// Add the new sort buttons to the page alongside the "Station", "Follow" and "Share" buttons
let pageButtons = document.querySelector(".userInfoBar__buttons > .sc-button-group");
pageButtons.prepend(sortByLikesButton, sortByPlaysButton);

/**
 * Creates a "Sort by x" button.
 */
function createSortButton(name, compareFunction) {
    let button = document.createElement("button");
    button.className = "sc-button sc-button-medium sc-button-responsive";
    button.textContent = "Sort by " + name;
    button.onclick = () => sortTracks(compareFunction);

    return button;
}

/**
 * Sorts the tracks using a compare function, e.g. by likes or plays (see below).
 */
function sortTracks(compareFunction) {
    let parent = document.querySelector(".soundList > ul");
    let tracks = Array.from(document.querySelectorAll(".soundList > ul > li"));

    tracks.sort(compareFunction);
    tracks.forEach(track => parent.appendChild(track));
}

/**
 * Gets the number of likes of a given track as a formatted string and converts
 * it into a number, e.g. "1.08M", "119K", "41.1K" and "9,766".
 */
function getTrackLikes(trackElement) {
    let rawLikes = trackElement.querySelector(".sc-button-like").textContent;
    let parsedLikes = parseFloat(removeThousandsSeperator(rawLikes));

    if (rawLikes.endsWith("K")) {
        parsedLikes *= Math.pow(10, 3);
    } else if (rawLikes.endsWith("M")) {
        parsedLikes *= Math.pow(10, 6);
    }

    return parsedLikes;
}

/**
 * Gets the number of plays of a given track and converts it into a number,
 * e.g. "11,266,303 plays" (displayed as "11.2M").
 */
function getTrackPlays(trackElement) {
    let rawPlays = trackElement.querySelector(".soundStats > li").getAttribute("title");
    let parsedPlays = parseInt(removeThousandsSeperator(rawPlays));

    return parsedPlays;
}

/**
 * Removes commas from a string, e.g. "11,266,303" -> "11266303".
 */
function removeThousandsSeperator(str) {
    return str.replace(/,/g, "");
}
