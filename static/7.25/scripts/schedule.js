'use strict';


document.addEventListener('DOMContentLoaded', async function() {
    const cellBlockHeight = 2; //em
    const eventPopupOffset = 20;
    const calSkipHeight = 2;
    const blockTimeUnit = pfoSchedInterval; // minutes
    const schedRoot = $('.schedule-main');
    if(schedRoot.length == 0) { return; }

    moment.locale();
    const userTz = moment.tz.guess();
    let isClicked = false;
    
    let sched = null;
    try {
        const resp = await fetch(pfoSchedApi, { cache: 'no-cache', headers: { 'Accept': 'application/json' } });
        sched = await resp.json();
    } catch(e) {
        console.error(e);
        schedRoot.text('Unable to fetch the schedule :(');
        return;
    }

    const grid = $('<div class="schedule-grid"></div>');
    schedRoot.empty();schedRoot.text('');
    schedRoot.append(grid);

    const makeColumn = function(extraClasses) { return $(`<div class="schedule-column ${extraClasses}"></div>`); };
    const makeCell = function(extraClasses){ return $(`<div class="schedule-cell ${extraClasses}"></div>`); };
    const clickSchedule = function(e, event) {
        isClicked = true;
        showEvent(e,event);
    }
    const hoverSchedule = function(e, event) {
        if(!isClicked) {
            showEvent(e,event);
        }
    };
    const showEvent = function(e, event) {
        $('.schedule-event-pop').hide();
        event.pop.show();
        const targetCal = $(e.target).closest(".schedule-grid");

        // Calculate the window positions
        let calOffset = targetCal.offset();
        calOffset.right = calOffset.left + targetCal.width();
        calOffset.width = calOffset.right - calOffset.left
        calOffset.mid = calOffset.left + calOffset.width / 2

        let offsetX = e.pageX - calOffset.left + eventPopupOffset;
        if(e.clientX > calOffset.mid) {
            offsetX = calOffset.right - e.pageX + eventPopupOffset;
        }
        // bounds checking to prevent it from going out
        offsetX = Math.min(offsetX, targetCal.width());

        let offsetY = e.pageY - calOffset.top + eventPopupOffset;
        offsetY = Math.min(offsetY, targetCal.height() - event.pop.get()[0].getBoundingClientRect().height);

        const domPop = event.pop.get()[0]
        console.log("offset", offsetX)
        if(e.clientX < calOffset.mid) {
            domPop.style.left = offsetX;
        } else {
            domPop.style.right = offsetX;
        }
        domPop.style.top = offsetY;
    };
    const eventPopClick = function() {
        $('.schedule-event-pop').hide();
        isClicked = false;
    }
    const eventPopHoover = function() {
        if(!isClicked) {
            $('.schedule-event-pop').hide();
        }
    }
    const makeEventPop = function(myEvent, extraClasses) {
        const eventDesc = $(`<div class="schedule-event-pop ${extraClasses}"></div>`);
        // Title
        let div = $('<div class="schedule-event-pop-title"></div>');
        div.text(myEvent.title);
        eventDesc.append(div);
        // Time
        div = $('<div class="schedule-event-pop-time"></div>');
        div.text(`${myEvent.startTime.tz(userTz).format('YYYY-MM-DD h:mm A')} -- ${myEvent.endTime.tz(userTz).format('YYYY-MM-DD h:mm A')}`);
        eventDesc.append(div);
        // Time
        div = $('<div class="schedule-event-pop-panelists"></div>');
        div.text(myEvent.panelists);
        eventDesc.append(div);
        // Description
        div = $('<div class="schedule-event-pop-desc"></div>');
        div.text(myEvent.description);
        eventDesc.append(div);
        
        eventDesc.hide();
        eventDesc.click(eventPopClick);
        eventDesc.hover(eventPopHoover);
        return eventDesc;
    }
    

    let times = sched.times;
    let rooms = sched.rooms;
    let roomOrder = sched.roomOrder;
    let popDivs = [];
    {
        const col = makeColumn('schedule-time-col');
        grid.append(col);

        { // Add time header
            const colhead = makeCell('schedule-time-header');
            colhead.text(`Time (${moment.tz(userTz).format('z')})`);
            col.append(colhead);
        }

        let timeSkip = 0
        for(let i = 0; i < times.length; i++) {
            let printTime = true
            // convert times to moments
            times[i] = moment.tz(times[i], 'America/New_York');

            //if(times[i].tz. - times[i-1])
            if (i != 0) {
                let dur = moment.duration(times[i].diff(times[i-1]));
                if(dur.asMinutes() > blockTimeUnit) {
                    if(timeSkip < calSkipHeight) {
                        // Skip a block for spacing on the schedule
                        times.splice(i, 0, moment(times[i - 1]).add(Number(blockTimeUnit), 'minutes'))
                        const cell = makeCell('schedule-time-cell');
                        col.append(cell);
                        printTime = false
                        timeSkip++
                    } else if (timeSkip === calSkipHeight) {
                        // On the Skip Height, we add the date to differentiate the days
                        times.splice(i, 0, moment(times[i - 1]).add(Number(blockTimeUnit), 'minutes'))
                        const cell = makeCell('schedule-time-header');
                        cell.text(times[i].tz(userTz).format('MMM Do'))
                        col.append(cell);
                        printTime = false
                        timeSkip++
                    } else {
                        timeSkip=0
                    }
                }
            }

            if(printTime) {
                const cell = makeCell('schedule-time-cell');
                cell.text(times[i].tz(userTz).format('h:mm A'))
                col.append(cell);
            }
        }

        let colNum = 1;
        for (const key of roomOrder) {
            if (rooms.hasOwnProperty(key)) {
                const events = rooms[key];
                events.forEach( (value, index) => {
                    value.startTime = moment.tz(value.startTime, 'America/New_York');
                    value.endTime = moment.tz(value.endTime, 'America/New_York');
                    value.color = `r${colNum}-${(index%2)==0?'even':'odd'}`;
                    value.pop = makeEventPop(value, '');
                    popDivs.push(value.pop);
                });
                colNum++;

                const renderBlocks = [];
                // Build a full column in empty space too
                for(const atTime of times) {
                    // search for an event for the current time
                    let atEvent = null;
                    for (const event of events) {
                        if(atTime.isBetween(event.startTime, event.endTime, null, '[)')) {
                            atEvent = event;
                            break;
                        } else if(atTime.isBefore(event.startTime)) { // quit searching as this time be before any that will follow
                            break;
                        }
                    }

                    if(atEvent === null) {
                        const endTime = atTime.clone().add(blockTimeUnit, 'm');
                        atEvent = { id: '-blank-', color: 'blank', startTime: atTime, endTime: endTime};
                    }

                    // check for extension
                    if(renderBlocks.length > 0 && renderBlocks[renderBlocks.length - 1].id === atEvent.id ) {
                        renderBlocks[renderBlocks.length - 1].endTime = atEvent.endTime;
                    } else {
                        renderBlocks.push({
                            id: atEvent.id,
                            startTime: atEvent.startTime,
                            endTime: atEvent.endTime,
                            event: atEvent
                        });
                    }
                }

                // Render
                const roomCol = makeColumn('schedule-room-col');
                grid.append(roomCol);

                { // header
                    const colhead = makeCell('schedule-room-header');
                    colhead.text(key);
                    roomCol.append(colhead);
                }
                // cells
                for(const block of renderBlocks) {
                    const cell = makeCell(`schedule-room-cell schedule-${block.event.color} event-${(block.event.title || "").toLowerCase().replace(/[^a-z]/g, '-')}`);
                    cell.text(block.event.title);
                    const height = cellBlockHeight * (moment.duration(block.endTime.diff(block.startTime)).asMinutes() / blockTimeUnit);
                    cell.height(`${height}em`);
                    if(block.id !== '-blank-') {
                        cell.click( (e) => clickSchedule(e, block.event) );
                        cell.hover( (e) => hoverSchedule(e, block.event));
                    }
                    roomCol.append(cell);
                }

                { // footer
                    const foothead = makeCell('schedule-room-footer');
                    foothead.text(key);
                    roomCol.append(foothead);
                }
            }
        }

        grid.append(col.clone());

        for(const pop of popDivs) {
            schedRoot.append(pop);
        }
    }
});
