'use strict';

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const button = document.querySelector(".button-menu");
        const header = button.parentElement.parentElement.parentElement;
        button.addEventListener("click", () => {
            if (header.classList.contains("closed")) {
                header.className = "topbar open";
                button.innerHTML = "&times;";
            } else if (header.classList.contains("open")) {
                header.className = "topbar closed";
                button.innerHTML = "Menu";
            }
        });

        updatePanels();
        setInterval(updatePanels, 10000);
    });

    async function updatePanels() {
        for (const el of document.getElementsByClassName('menu-room-current-event')) {
            const room = el.dataset.room;
            const event = await getCurrentEvent(room);
            if (event) {
                el.innerText = event.title;
                el.style.display = 'block';
            } else {
                el.innerText = '';
                el.style.display = 'none';
            }
        }
    }
})();

(function() {
    let panels = {};
    const lastUpdate = 0;
    async function fetchPanels() {
        if (Date.now() - lastUpdate < 300000) {
            return panels;
        }
        const response = await fetch("https://schedule-api.ponyfest.horse/schedule");
        const roomJson = await response.json();
        const rooms = roomJson.rooms;
        const newPanels = {}
        for (const roomName of Object.keys(rooms)) {
            newPanels[roomName] = rooms[roomName].map(x => ({...x,  startTime: moment(x.startTime), endTime: moment(x.endTime)}));
        }
        panels = newPanels;
        console.log(panels);
        return panels;
    }

    async function getCurrentEvent(room) {
        const events = (await fetchPanels())[room];
        if (!events) {
            return null;
        }
        const now = moment();
        for (let panel of events) {
            if (now.isSameOrAfter(panel.startTime)) {
                if (now.isBefore(panel.endTime)) {
                    return panel;
                }
            }
        }
        return null;
    }

    window.getCurrentEvent = getCurrentEvent;
})();
