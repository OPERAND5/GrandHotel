document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let childrenCount = 0;
  let adultsCount = 1; // Starts at 1 adult by default

  // DOM Elements
  const childrenValueDisplay = document.getElementById('childrenValue');
  const adultsValueDisplay = document.getElementById('adultsValue');
  
  const btnDecrementChildren = document.getElementById('decrementChildren');
  const btnIncrementChildren = document.getElementById('incrementChildren');
  
  const btnDecrementAdults = document.getElementById('decrementAdults');
  const btnIncrementAdults = document.getElementById('incrementAdults');
  
  const bookingForm = document.getElementById('bookingForm');

  // --- Children Counter Handlers ---
  btnIncrementChildren.addEventListener('click', () => {
    childrenCount++;
    childrenValueDisplay.textContent = childrenCount;
  });

  btnDecrementChildren.addEventListener('click', () => {
    if (childrenCount > 0) {
      childrenCount--;
      childrenValueDisplay.textContent = childrenCount;
    }
  });

  // --- Adults Counter Handlers ---
  btnIncrementAdults.addEventListener('click', () => {
    adultsCount++;
    adultsValueDisplay.textContent = adultsCount;
  });

  btnDecrementAdults.addEventListener('click', () => {
    // Ensures at least 1 adult remains selected
    if (adultsCount > 1) {
      adultsCount--;
      adultsValueDisplay.textContent = adultsCount;
    }
  });

  // --- Form Submission ---
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevents page reload

    const checkInDate = document.getElementById('checkIn').value;
    const checkOutDate = document.getElementById('checkOut').value;

    const dataSubmission = {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      children: childrenCount,
      adults: adultsCount
    };

    console.log('Availability Request Transmitted:', dataSubmission);
    alert(`Checking rooms from ${checkInDate} to ${checkOutDate} for ${adultsCount} Adults and ${childrenCount} Children.`);
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const checkInInput = document.getElementById("widgetCheckIn");
  const checkOutInput = document.getElementById("widgetCheckOut");
  const checkoutHint = document.getElementById("checkoutHint");
  
  const minusGuestBtn = document.getElementById("minusGuest");
  const plusGuestBtn = document.getElementById("plusGuest");
  const guestCountSpan = document.getElementById("guestCount");
  
  const priceBreakdown = document.getElementById("priceBreakdown");
  const totalPriceDisplay = document.getElementById("totalPriceDisplay");

  const ROOM_PRICE_PER_NIGHT = 150; // Customize base pricing scale here
  let guestCount = 1;

  // 1. Minimum Check-In configuration (Locks past history limits)
  const today = new Date().toISOString().split("T")[0];
  checkInInput.min = today;

  // 2. Logic chain monitoring when arrival changes
  checkInInput.addEventListener("change", () => {
    if (checkInInput.value) {
      // Unlock checkout field & hide fallback text placeholder string
      checkOutInput.removeAttribute("disabled");
      checkoutHint.style.display = "none";
      
      // Enforce departure rule: minimum 1 day post arrival
      const checkInDate = new Date(checkInInput.value);
      checkInDate.setDate(checkInDate.getDate() + 1);
      const minCheckOutStr = checkInDate.toISOString().split("T")[0];
      checkOutInput.min = minCheckOutStr;

      // Adjust date value automatically if previous input defaults break logic
      if (checkOutInput.value && checkOutInput.value < minCheckOutStr) {
        checkOutInput.value = minCheckOutStr;
      }
    } else {
      // Re-lock if field gets cleared
      checkOutInput.setAttribute("disabled", "true");
      checkoutHint.style.display = "block";
    }
    calculatePrice();
  });

  checkOutInput.addEventListener("change", calculatePrice);

  // 3. Counter Controls Logic
  minusGuestBtn.addEventListener("click", () => {
    if (guestCount > 1) {
      guestCount--;
      guestCountSpan.textContent = guestCount;
      calculatePrice();
    }
  });

  plusGuestBtn.addEventListener("click", () => {
    if (guestCount < 10) { // Safety ceiling cap limit
      guestCount++;
      guestCountSpan.textContent = guestCount;
      calculatePrice();
    }
  });

  // 4. Night Matrix Math & Dropdown Logic
  function calculatePrice() {
    const checkInVal = checkInInput.value;
    const checkOutVal = checkOutInput.value;

    if (checkInVal && checkOutVal) {
      const date1 = new Date(checkInVal);
      const date2 = new Date(checkOutVal);
      
      // Calculate day difference
      const timeDiff = date2.getTime() - date1.getTime();
      const totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (totalNights > 0) {
        // Base formulation structure (scales marginally relative to guest scale metrics)
        const guestSurcharge = (guestCount - 1) * 25; 
        const totalCost = (ROOM_PRICE_PER_NIGHT + guestSurcharge) * totalNights;

        // Render variables dynamically onto container
        totalPriceDisplay.textContent = `$${totalCost}`;
        
        // Reveal container box smoothly via element styling injection
        priceBreakdown.classList.add("reveal");
        return;
      }
    }
    // Conceal container metrics safely if conditions are broken
    priceBreakdown.classList.remove("reveal");
  }

  // 5. Intercept submit execution mapping data values safely
  document.getElementById("widgetForm").addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Reservation Confirmed!\nDates: ${checkInInput.value} to ${checkOutInput.value}\nTotal Guests: ${guestCount}`);
  });
});



// --- 1. INLINE GALLERY FUNCTION ---
function switchInlinePhoto(element, imagePath) {
    // Update the main display image
    const mainView = document.getElementById('activeGalleryView');
    if (mainView) {
        mainView.src = imagePath;
    }

    // Remove active styling from all thumbnails
    const thumbnails = document.querySelectorAll('.thumb-card');
    thumbnails.forEach(thumb => thumb.classList.remove('active-thumb'));

    // Add active styling to the clicked thumbnail
    element.classList.add('active-thumb');
}

// --- 2. BOOKING WIDGET LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const checkInInput = document.getElementById('widgetCheckIn');
    const checkOutInput = document.getElementById('widgetCheckOut');
    const checkoutHint = document.getElementById('checkoutHint');
    
    const minusGuestBtn = document.getElementById('minusGuest');
    const plusGuestBtn = document.getElementById('plusGuest');
    const guestCountDisplay = document.getElementById('guestCount');
    
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const widgetForm = document.getElementById('widgetForm');

    const NIGHTLY_RATE = 15000;
    const MAX_GUESTS = 2; // As stated in your room description
    let currentGuests = 1;

    // Prevent selecting past dates for Check-In
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;

    // When Check-In changes, update Check-Out bounds
    checkInInput.addEventListener('change', () => {
        if (checkInInput.value) {
            checkOutInput.disabled = false;
            // Check-out must be at least 1 day after check-in
            const nextDay = new Date(checkInInput.value);
            nextDay.setDate(nextDay.getDate() + 1);
            
            checkOutInput.min = nextDay.toISOString().split('T')[0];
            checkoutHint.style.display = 'none';
            
            // Reset check-out if it's now invalid compared to new check-in
            if (checkOutInput.value && checkOutInput.value < checkOutInput.min) {
                checkOutInput.value = '';
            }
        } else {
            checkOutInput.disabled = true;
            checkoutHint.style.display = 'block';
        }
        calculateTotal();
    });

    checkOutInput.addEventListener('change', calculateTotal);

    // Guest counter management
    minusGuestBtn.addEventListener('click', () => {
        if (currentGuests > 1) {
            currentGuests--;
            guestCountDisplay.textContent = currentGuests;
        }
    });

    plusGuestBtn.addEventListener('click', () => {
        if (currentGuests < MAX_GUESTS) {
            currentGuests++;
            guestCountDisplay.textContent = currentGuests;
        } else {
            alert(`The Standard Room accommodates a maximum of ${MAX_GUESTS} guests.`);
        }
    });

    // Dynamic Price Calculation
    function calculateTotal() {
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);

        if (checkInInput.value && checkOutInput.value && checkOutDate > checkInDate) {
            const timeDifference = checkOutDate.getTime() - checkInDate.getTime();
            const totalNights = Math.ceil(timeDifference / (1000 * 3600 * 24));
            const totalPrice = totalNights * NIGHTLY_RATE;
            
            totalPriceDisplay.textContent = `₦ ${totalPrice}`;
        } else {
            totalPriceDisplay.textContent = '₦ 0';
        }
    }

    // Form Submission Handling
    widgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(`Booking request submitted for ${currentGuests} guest(s) from ${checkInInput.value} to ${checkOutInput.value}.`);
    });
});



document.addEventListener('DOMContentLoaded', () => {
    // DOM Structural Variables Mapped to Layout Elements
    const calendarTrigger = document.getElementById('calendarTrigger');
    const calendarPopup = document.getElementById('calendarPopup');
    const monthSelect = document.getElementById('calendarMonthSelect');
    const yearSelect = document.getElementById('calendarYearSelect');
    const daysGrid = document.getElementById('calendarDaysGrid');
    const dateRangeDisplay = document.getElementById('calendarDateRangeDisplay');
    
    const checkInHidden = document.getElementById('widgetCheckIn');
    const checkOutHidden = document.getElementById('widgetCheckOut');
    
    const minusGuestBtn = document.getElementById('minusGuest');
    const plusGuestBtn = document.getElementById('plusGuest');
    const guestCountDisplay = document.getElementById('guestCount');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const widgetForm = document.getElementById('widgetForm');

    const NIGHTLY_RATE = 15000;
    const MAX_GUESTS = 2;
    let currentGuests = 1;

    // Date engine structural state variables
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let currentDisplayMonth = today.getMonth();
    let currentDisplayYear = today.getFullYear();
    
    let selectedCheckIn = null;
    let selectedCheckOut = null;

    const monthsArray = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

    // --- Initialize Select Menus (Current Year up to 5 Years Out) ---
    function initSelectDropdowns() {
        monthsArray.forEach((month, idx) => {
            let opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = month;
            monthSelect.appendChild(opt);
        });

        for (let i = 0; i < 6; i++) {
            let year = today.getFullYear() + i;
            let opt = document.createElement('option');
            opt.value = year;
            opt.textContent = year;
            yearSelect.appendChild(opt);
        }
        
        updateSelectDropdownValues();
    }

    function updateSelectDropdownValues() {
        monthSelect.value = currentDisplayMonth;
        yearSelect.value = currentDisplayYear;
    }

    // --- Core Calendar Generation Function ---
    function renderCalendarGrid() {
        daysGrid.innerHTML = '';
        
        // Find weekday offset of the first day of the selected month
        const firstDayInstance = new Date(currentDisplayYear, currentDisplayMonth, 1);
        const startingDayOfWeek = firstDayInstance.getDay();
        const totalDaysInMonth = new Date(currentDisplayYear, currentDisplayMonth + 1, 0).getDate();

        // Create empty buffer spaces for days from the previous month
        for (let i = 0; i < startingDayOfWeek; i++) {
            let emptyCell = document.createElement('div');
            daysGrid.appendChild(emptyCell);
        }

        // Generate day cells for the current month
        for (let day = 1; day <= totalDaysInMonth; day++) {
            let dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            dayCell.textContent = day;

            const targetDate = new Date(currentDisplayYear, currentDisplayMonth, day);

            // Disable past dates
            if (targetDate < today) {
                dayCell.classList.add('disabled');
            } else {
                // Highlight Selected Ranges
                if (selectedCheckIn && targetDate.getTime() === selectedCheckIn.getTime()) {
                    dayCell.classList.add('selected-checkin');
                } else if (selectedCheckOut && targetDate.getTime() === selectedCheckOut.getTime()) {
                    dayCell.classList.add('selected-checkout');
                } else if (selectedCheckIn && selectedCheckOut && targetDate > selectedCheckIn && targetDate < selectedCheckOut) {
                    dayCell.classList.add('in-range');
                }

                // Interaction Click Logic
                dayCell.addEventListener('click', () => handleDateSelection(targetDate));
            }
            daysGrid.appendChild(dayCell);
        }
    }

    // --- Selection Logic Flow ---
    function handleDateSelection(date) {
        if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
            // First click sets check-in date
            selectedCheckIn = date;
            selectedCheckOut = null;
        } else if (selectedCheckIn && !selectedCheckOut) {
            // Second click logic processing
            if (date <= selectedCheckIn) {
                // If user clicks a date before check-in, treat it as a new check-in date
                selectedCheckIn = date;
            } else {
                selectedCheckOut = date;
                calendarPopup.classList.remove('show'); // Auto close when done
            }
        }
        
        updateFormInputsAndUI();
        renderCalendarGrid();
    }

    function updateFormInputsAndUI() {
        if (selectedCheckIn && selectedCheckOut) {
            const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            dateRangeDisplay.textContent = `${selectedCheckIn.toLocaleDateString('en-US', formatOptions)} - ${selectedCheckOut.toLocaleDateString('en-US', formatOptions)}`;
            
            // Format to standard ISO string format safely for invisible hidden tags
            checkInHidden.value = selectedCheckIn.toISOString().split('T')[0];
            checkOutHidden.value = selectedCheckOut.toISOString().split('T')[0];
        } else if (selectedCheckIn) {
            const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            dateRangeDisplay.textContent = `${selectedCheckIn.toLocaleDateString('en-US', formatOptions)} - Select Departure`;
            checkInHidden.value = selectedCheckIn.toISOString().split('T')[0];
            checkOutHidden.value = '';
        } else {
            dateRangeDisplay.textContent = "Select Check-In & Check-Out";
            checkInHidden.value = '';
            checkOutHidden.value = '';
        }
        calculateTotal();
    }

    // --- Dynamic Night/Price Calculator ---
    function calculateTotal() {
        if (selectedCheckIn && selectedCheckOut) {
            const timeDifference = selectedCheckOut.getTime() - selectedCheckIn.getTime();
            const totalNights = Math.ceil(timeDifference / (1000 * 3600 * 24));
            const totalPrice = totalNights * NIGHTLY_RATE;
            
            totalPriceDisplay.textContent = `₦ ${totalPrice}`;
            priceBreakdown.classList.add('reveal');
        } else {
            totalPriceDisplay.textContent = '₦ 0';
            priceBreakdown.classList.remove('reveal');
        }
    }

    // --- UI Listeners and Navigation Controls ---
    calendarTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        calendarPopup.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!calendarPopup.contains(e.target) && e.target !== calendarTrigger) {
            calendarPopup.classList.remove('show');
        }
    });

    document.getElementById('prevMonthBtn').addEventListener('click', () => {
        if (currentDisplayMonth === 0) {
            currentDisplayMonth = 11;
            currentDisplayYear--;
        } else {
            currentDisplayMonth--;
        }
        updateSelectDropdownValues();
        renderCalendarGrid();
    });

    document.getElementById('nextMonthBtn').addEventListener('click', () => {
        if (currentDisplayMonth === 11) {
            currentDisplayMonth = 0;
            currentDisplayYear++;
        } else {
            currentDisplayMonth++;
        }
        updateSelectDropdownValues();
        renderCalendarGrid();
    });

    monthSelect.addEventListener('change', (e) => {
        currentDisplayMonth = parseInt(e.target.value);
        renderCalendarGrid();
    });

    yearSelect.addEventListener('change', (e) => {
        currentDisplayYear = parseInt(e.target.value);
        renderCalendarGrid();
    });

    // --- Guest Counter Listeners ---
    minusGuestBtn.addEventListener('click', () => {
        if (currentGuests > 1) {
            currentGuests--;
            guestCountDisplay.textContent = currentGuests;
        }
    });

    plusGuestBtn.addEventListener('click', () => {
        if (currentGuests < MAX_GUESTS) {
            currentGuests++;
            guestCountDisplay.textContent = currentGuests;
        } else {
            alert(`The Standard Room accommodates a maximum of ${MAX_GUESTS} guests.`);
        }
    });

    // --- Handle Submit Operations ---
    widgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!checkInHidden.value || !checkOutHidden.value) {
            alert("Please complete your reservation dates selection window details.");
            return;
        }
        alert(`Booking request submitted for ${currentGuests} guest(s) from ${checkInHidden.value} to ${checkOutHidden.value}.`);
    });

    // Execution Core Ignition Calls
    initSelectDropdowns();
    renderCalendarGrid();
});




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


function updateShowcase(element) {
    const mainTarget = document.getElementById('premiumShowcaseTarget');
    const titleTarget = document.getElementById('showcaseTitleTarget');
    
    const clickedImgSrc = element.querySelector('img').src;
    const clickedTitle = element.querySelector('.thumb-title').textContent;

    // Safety check: Don't run animation if the user clicks the image that is already open
    if (mainTarget.src === clickedImgSrc) return;

    // 1. Drop opacity for smooth modern transition dip
    mainTarget.classList.add('fade-out-effect');

    setTimeout(() => {
        // 2. Swap out main visual contents
        mainTarget.src = clickedImgSrc;
        titleTarget.textContent = clickedTitle;
        
        // 3. Clear class to beautifully fade the new scene back up
        mainTarget.classList.remove('fade-out-effect');
    }, 200);

    // 4. Update selected gold highlight border ring across thumbnails
    document.querySelectorAll('.thumb-wrapper').forEach(wrapper => {
        wrapper.classList.remove('active');
    });
    element.classList.add('active');
}