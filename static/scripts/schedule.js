'use strict';

/**
 * Schedule Grid Renderer
 *
 * This script fetches schedule data from an API and renders an interactive
 * schedule grid with time slots and room columns. Events are displayed in
 * their respective rooms with popup details on hover/click.
 *
 * Dependencies:
 * - jQuery ($)
 * - moment.js with moment-timezone
 * - Global variables: pfoSchedInterval, pfoSchedApi (defined elsewhere)
 */

document.addEventListener('DOMContentLoaded', async function() {
    // ========================================================================
    // CONFIGURATION
    // ========================================================================
    const cellBlockHeight = 2;              // Height of each time block in em units
    const eventPopupOffset = 30;            // Pixel offset for event popup positioning
    const calSkipHeight = 4;                // Number of blank cells to insert before showing date header during gaps
    const blockTimeUnit = pfoSchedInterval; // Duration of each time block in minutes (from global config)
    const SOURCE_TIMEZONE = 'America/Los_Angeles'; // Timezone of the source schedule data

    const schedRoot = $('.schedule-main');
    if(schedRoot.length == 0) { return; }   // Exit if schedule container doesn't exist

    // ========================================================================
    // TIMEZONE SETUP
    // ========================================================================
    moment.locale();                        // Use browser's locale for formatting
    const userTz = moment.tz.guess();       // Auto-detect user's timezone
    let isClicked = false;                  // Track if popup was opened via click (vs hover)

    // ========================================================================
    // FETCH SCHEDULE DATA
    // ========================================================================
    let sched = null;
    try {
        const resp = await fetch(pfoSchedApi, { cache: 'no-cache', headers: { 'Accept': 'application/json' } });
        sched = await resp.json();
    } catch(e) {
        console.error(e);
        schedRoot.text('Unable to fetch the schedule :(');
        return;
    }

    // ========================================================================
    // DOM HELPER FUNCTIONS
    // ========================================================================
    const grid = $('<div class="schedule-grid"></div>');
    schedRoot.empty();
    schedRoot.append(grid);

    /** Creates a column container element */
    const makeColumn = function(extraClasses) { return $(`<div class="schedule-column ${extraClasses}"></div>`); };

    /** Creates a cell element within a column */
    const makeCell = function(extraClasses){ return $(`<div class="schedule-cell ${extraClasses}"></div>`); };

    // ========================================================================
    // EVENT POPUP HANDLERS
    // ========================================================================

    /** Handle click on a schedule event - locks popup open */
    const clickSchedule = function(e, event) {
        e.stopPropagation(); // Prevent document click handler from immediately closing
        isClicked = true;
        showEvent(e, event);
    }

    /** Handle hover on a schedule event - shows popup if not clicked */
    const hoverSchedule = function(e, event) {
        if(!isClicked) {
            showEvent(e, event);
        }
    };

    /**
     * Position and display the event popup
     * Popup appears on the opposite side of the cursor from center
     * to avoid obscuring the clicked event
     */
    const showEvent = function(e, event) {
        $('.schedule-event-pop').hide();    // Hide any other open popups
        event.pop.show();
        const targetCal = $(e.target).closest(".schedule-grid");

        // Calculate grid boundaries for positioning
        let calOffset = targetCal.offset();
        calOffset.right = calOffset.left + targetCal.width();
        calOffset.width = calOffset.right - calOffset.left;
        calOffset.mid = calOffset.left + calOffset.width / 2;

        // Position popup on opposite side of cursor from grid center
        let offsetX = e.pageX - calOffset.left + eventPopupOffset;
        if(e.clientX > calOffset.mid) {
            offsetX = calOffset.right - e.pageX + eventPopupOffset;
        }
        // Bounds checking to prevent popup from going outside grid
        offsetX = Math.min(offsetX, targetCal.width());

        // Vertical positioning with bounds check
        let offsetY = e.pageY - calOffset.top + eventPopupOffset;
        offsetY = Math.min(offsetY, targetCal.height() - event.pop.get()[0].getBoundingClientRect().height);

        // Apply position (left or right depending on cursor location)
        // Reset both properties first to avoid conflicts
        const domPop = event.pop.get()[0];
        domPop.style.left = '';
        domPop.style.right = '';
        if(e.clientX < calOffset.mid) {
            domPop.style.left = offsetX + 'px';
        } else {
            domPop.style.right = offsetX + 'px';
        }
        domPop.style.top = offsetY + 'px';
    };

    /** Close popup when clicked */
    const eventPopClick = function(e) {
        e.stopPropagation(); // Prevent event bubbling
        $('.schedule-event-pop').hide();
        isClicked = false;
    }

    /** Close popup on hover-out (only if not clicked open) */
    const eventPopHover = function() {
        if(!isClicked) {
            $('.schedule-event-pop').hide();
        }
    }

    /** Close popups when clicking outside (for mobile support) */
    $(document).on('click', function(e) {
        if(isClicked && !$(e.target).closest('.schedule-event-pop, .schedule-room-cell').length) {
            $('.schedule-event-pop').hide();
            isClicked = false;
        }
    });

    /**
     * Create the popup element for an event
     * Contains title, time range, panelists, and description
     */
    const makeEventPop = function(myEvent, extraClasses) {
        const eventDesc = $(`<div class="schedule-event-pop ${extraClasses}"></div>`);

        // Title
        let div = $('<div class="schedule-event-pop-title"></div>');
        div.text(myEvent.title);
        eventDesc.append(div);

        // Time range (converted to user's timezone)
        div = $('<div class="schedule-event-pop-time"></div>');
        div.text(`${myEvent.startTime.tz(userTz).format('YYYY-MM-DD h:mm A')} -- ${myEvent.endTime.tz(userTz).format('YYYY-MM-DD h:mm A')}`);
        eventDesc.append(div);

        // Panelists
        div = $('<div class="schedule-event-pop-panelists"></div>');
        div.text(myEvent.panelists);
        eventDesc.append(div);

        // Description
        div = $('<div class="schedule-event-pop-desc"></div>');
        div.text(myEvent.description);
        eventDesc.append(div);

        eventDesc.hide();
        eventDesc.click(eventPopClick);
        eventDesc.hover(eventPopHover);
        return eventDesc;
    }

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    /**
     * Binary search to find event containing a given time
     * Events must be sorted by startTime
     * @param {Array} events - Sorted array of events
     * @param {moment} targetTime - Time to search for
     * @returns {Object|null} - Event containing targetTime, or null
     */
    const findEventAtTime = function(events, targetTime) {
        if (events.length === 0) return null;

        let low = 0;
        let high = events.length - 1;

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const event = events[mid];

            if (targetTime.isBefore(event.startTime)) {
                // Target is before this event, search left
                high = mid - 1;
            } else if (targetTime.isSameOrAfter(event.endTime)) {
                // Target is after this event, search right
                low = mid + 1;
            } else {
                // Target is within [startTime, endTime)
                return event;
            }
        }

        return null;
    };

    // ========================================================================
    // SCHEDULE GRID RENDERING
    // ========================================================================
    // Work with copies to avoid mutating original data
    let times = sched.times.slice();  // Copy array of time slot strings
    let rooms = sched.rooms;          // Object mapping room names to event arrays
    let roomOrder = sched.roomOrder;  // Array defining column order for rooms
    let popDivs = [];                 // Collect all popup elements to append later

    {
        // --------------------------------------------------------------------
        // TIME COLUMN (leftmost column showing time labels)
        // --------------------------------------------------------------------
        const col = makeColumn('schedule-time-col');
        grid.append(col);

        // Header: Show timezone abbreviation (e.g., "Time (EST)")
        {
            const colhead = makeCell('schedule-time-header');
            colhead.text(`Time (${moment.tz(userTz).format('z')})`);
            col.append(colhead);
        }

        // Process each time slot and handle gaps between events
        let timeSkip = 0;  // Counter for blank cells inserted during gaps
        for(let i = 0; i < times.length; i++) {
            let printTime = true;

            // Convert time string to moment object in source timezone
            times[i] = moment.tz(times[i], SOURCE_TIMEZONE);

            if (i !== 0) {
                // Check for gaps between consecutive time slots
                let dur = moment.duration(times[i].diff(times[i-1]));
                if(dur.asMinutes() > blockTimeUnit) {
                    // Gap detected - insert filler cells
                    if(timeSkip < calSkipHeight) {
                        // Insert blank spacer cell (no time label)
                        times.splice(i, 0, times[i - 1].clone().add(Number(blockTimeUnit), 'minutes'));
                        const cell = makeCell('schedule-time-cell');
                        col.append(cell);
                        printTime = false;
                        timeSkip++;
                    } else if (timeSkip === calSkipHeight) {
                        // After enough spacers, insert date header to show day change
                        times.splice(i, 0, times[i - 1].clone().add(Number(blockTimeUnit), 'minutes'));
                        const cell = makeCell('schedule-time-header');
                        cell.text(times[i + 1].tz(userTz).format('MMM Do'));
                        col.append(cell);
                        printTime = false;
                        timeSkip++;
                    } else {
                        // Reset counter after date header, resume normal time display
                        timeSkip = 0;
                    }
                }
            } else {
                // First row: date header for alignment
                const cell1 = makeCell('schedule-time-header');
                cell1.text(times[i].tz(userTz).format('MMM Do'));
                col.append(cell1);
            }

            // Print the time label for this slot (unless we're in a gap)
            if(printTime) {
                const cell = makeCell('schedule-time-cell');
                cell.text(times[i].tz(userTz).format('h:mm A'));
                col.append(cell);
            }
        }

        // Footer: Repeat timezone for reference at bottom
        {
            const colhead = makeCell('schedule-time-header');
            colhead.text(`Time (${moment.tz(userTz).format('z')})`);
            col.append(colhead);
        }

        // --------------------------------------------------------------------
        // ROOM COLUMNS (one column per room/stage)
        // --------------------------------------------------------------------
        let colNum = 1;  // Track column number for alternating colors
        for (const key of roomOrder) {
            if (rooms.hasOwnProperty(key)) {
                // Create a copy of events array to avoid mutating original
                const events = rooms[key].map(function(evt) {
                    return {
                        ...evt,
                        startTime: moment.tz(evt.startTime, SOURCE_TIMEZONE),
                        endTime: moment.tz(evt.endTime, SOURCE_TIMEZONE)
                    };
                });

                // Assign colors and create popups
                events.forEach(function(value, index) {
                    value.color = `r${colNum}-${(index % 2) == 0 ? 'even' : 'odd'}`;  // Alternating colors per room
                    value.pop = makeEventPop(value, '');
                    popDivs.push(value.pop);
                });
                colNum++;

                // Build render blocks by matching events to time slots
                // This handles multi-slot events and fills gaps with blank blocks
                const renderBlocks = [];
                for(const atTime of times) {
                    // Use binary search to find event at this time
                    let atEvent = findEventAtTime(events, atTime);

                    // No event at this time - create a blank placeholder
                    if(atEvent === null) {
                        const endTime = atTime.clone().add(blockTimeUnit, 'm');
                        atEvent = { id: '-blank-', color: 'blank', startTime: atTime, endTime: endTime };
                    }

                    // Merge consecutive blocks of the same event (for multi-slot events)
                    if(renderBlocks.length > 0 && renderBlocks[renderBlocks.length - 1].id === atEvent.id) {
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

                // Render the room column
                const roomCol = makeColumn('schedule-room-col');
                grid.append(roomCol);

                // Header Row 1: Room name
                {
                    const colhead = makeCell('schedule-room-header');
                    colhead.text(key);
                    roomCol.append(colhead);
                }
                // Header Row 2: Empty cell for date alignment
                {
                    const colhead = makeCell('schedule-room-header');
                    roomCol.append(colhead);
                }

                // Render each block (event or blank)
                for(const block of renderBlocks) {
                    // Calculate height based on duration
                    const cellBlockCount = moment.duration(block.endTime.diff(block.startTime)).asMinutes() / blockTimeUnit;
                    const height = cellBlockHeight * cellBlockCount;

                    // Blank cells just take up space
                    if (block.id === '-blank-') {
                        const cell = makeCell(`schedule-room-blank schedule-${block.event.color}`);
                        cell.height(`${height}em`);
                        roomCol.append(cell);
                        continue;
                    }

                    // Event cell with title and optional panelists
                    const cell = makeCell(`schedule-room-cell schedule-${block.event.color} event-${(block.event.title || "").toLowerCase().replace(/[^a-z]/g, '-')}`);
                    cell.height(`${height}em`);

                    // Show more detail for longer events
                    if (cellBlockCount > 1) {
                        let div = $('<div class="schedule-event-pop-title"></div>');
                        div.text(block.event.title || "");
                        cell.append(div);

                        if (block.event.panelists !== undefined) {
                            div = $('<div class="schedule-event-pop-panelists"></div>');
                            div.text("[" + block.event.panelists + "]");
                            cell.append(div);
                        }
                    } else {
                        // Short events just show title
                        cell.text(block.event.title || "");
                    }

                    // Attach click/hover handlers for popup
                    if(block.id !== '-blank-') {
                        cell.click(function(e) { clickSchedule(e, block.event); });
                        cell.hover(function(e) { hoverSchedule(e, block.event); });
                    }
                    roomCol.append(cell);
                }

                // Footer: Repeat room name
                {
                    const foothead = makeCell('schedule-room-footer');
                    foothead.text(key);
                    roomCol.append(foothead);
                }
            }
        }

        // Clone time column to right side for easier reading
        grid.append(col.clone());

        // Append all popups to schedule root (outside grid for positioning)
        for(const pop of popDivs) {
            schedRoot.append(pop);
        }
    }
});
