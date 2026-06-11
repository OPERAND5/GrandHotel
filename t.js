/**
 * The Grand Hotel - Interactive Booking & Availability Calendar Engine
 * Handles synchronization between HTML date pickers and the visual matrix grid.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Select DOM nodes
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const calendarDays = document.querySelectorAll('.calendar-date-number');

    /**
     * Clear and repaint the calendar range with color shading and ticks
     */
    function updateCalendarRange() {
        // Reset all days back to their default unselected state
        calendarDays.forEach(day => day.classList.remove('selected-day'));

        // If check-in isn't selected yet, stop execution
        if (!checkinInput.value) return;

        // Parse day numbers from date strings (ex: "2026-06-15" splits to array, extracts "15")
        const checkinDay = parseInt(checkinInput.value.split('-')[2], 10);
        
        // If check-out is chosen, parse it; otherwise, default the end range to the check-in day
        let checkoutDay = checkoutInput.value ? parseInt(checkoutInput.value.split('-')[2], 10) : checkinDay;

        // Enforce logical guardrail: if check-out is set before check-in, snap it to match check-in
        if (checkoutDay < checkinDay) {
            checkoutDay = checkinDay;
            checkoutInput.value = checkinInput.value;
        }

        // Loop through all calendar cells and apply the luxury highlight class
        calendarDays.forEach(dayEl => {
            const currentDayAttr = dayEl.getAttribute('data-day');
            
            if (currentDayAttr) {
                const dayValue = parseInt(currentDayAttr, 10);
                
                // If the calendar day falls within the window, shade it and show the tick
                if (dayValue >= checkinDay && dayValue <= checkoutDay) {
                    dayEl.classList.add('selected-day');
                }
            }
        });
    }

    // Attach event listeners to monitor input adjustments instantly
    if (checkinInput && checkoutInput) {
        checkinInput.addEventListener('input', updateCalendarRange);
        checkoutInput.addEventListener('input', updateCalendarRange);
    }
});