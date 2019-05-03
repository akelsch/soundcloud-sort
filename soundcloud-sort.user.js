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

    /**
     * Although plays are displayed formatted, e.g. "11.2M", their exact
     * integer value is given in the title attribute, e.g. "11,266,303 plays".
     */
    function getTrackPlays(soundListItem) {
        let rawPlays = soundListItem.querySelector(".soundStats > li").getAttribute("title");
        let parsedPlays = parseInt(removeThousandsSeperator(rawPlays));

        return parsedPlays;
    }

    /**
     * There are no exact values for likes available so we have to convert
     * the formatted strings like "119K", "41.1K" and "9,766" manually.
     */
    function getTrackLikes(soundListItem) {
        let rawLikes = soundListItem.querySelector(".sc-button-like").textContent;
        let parsedLikes = parseFloat(removeThousandsSeperator(rawLikes));

        if (rawLikes.endsWith("K"))
            parsedLikes *= 1000;

        return parsedLikes;
    }

    const compareTracksByPlays = (t1, t2) => getTrackPlays(t1) > getTrackPlays(t2) ? -1 : 1;
    const compareTracksByLikes = (t1, t2) => getTrackLikes(t1) > getTrackLikes(t2) ? -1 : 1;

    function sortTracks(compareFunction) {
        let parent = document.querySelector(".soundList > ul");
        let tracks = Array.from(document.querySelectorAll(".soundList > ul > li"));

        tracks.sort(compareFunction);
        tracks.forEach(track => parent.appendChild(track));
    }

    let sortByPlaysButton = document.createElement("button");
    sortByPlaysButton.className = "sc-button sc-button-medium sc-button-responsive";
    sortByPlaysButton.textContent = "Sort by plays"
    sortByPlaysButton.onclick = () => sortTracks(compareTracksByPlays);

    let sortByLikesButton = document.createElement("button");
    sortByLikesButton.className = "sc-button sc-button-medium sc-button-responsive";
    sortByLikesButton.textContent = "Sort by likes"
    sortByLikesButton.onclick = () => sortTracks(compareTracksByLikes);

    let buttons = document.querySelector(".userInfoBar__buttons > .sc-button-group");
    buttons.prepend(sortByPlaysButton);
    buttons.prepend(sortByLikesButton);
})();
