'use strict';
const TARGET_DATE = new Date('2022-12-03T07:45:00-0500');
const el = document.getElementById('countdown');

/* Want a custom style for the countdown that pops */
var countdown_style = document.createElement('link');
countdown_style.rel = "stylesheet";
countdown_style.type = "text/css";
countdown_style.href = "/css/countdown.css";
document.head.appendChild(countdown_style);

let interval = setInterval(() => {
    let remaining = (TARGET_DATE.getTime() - Date.now()) / 1000;
    if (remaining < 0) {
        el.classList.add('hidden');
        clearInterval(interval);
        return;
    }
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = Math.floor(remaining % 60);
    if (hours > 0) {
        el.innerText = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    } else {
        el.innerText = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }
}, 1000);
