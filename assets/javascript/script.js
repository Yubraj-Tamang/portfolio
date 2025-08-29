document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element References ---
    const landingPage = document.getElementById('landingPage');
    const enterBtn = document.getElementById('enterBtn');
    const homeNavBtn = document.getElementById('homeNavBtn');
    const bookContainer = document.getElementById('bookContainer');
    const navigation = document.getElementById('navigation');

    const book = document.getElementById('book');
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Get references to direct navigation buttons on the cover page
    const viewProjectsBtn = document.getElementById('viewProjectsBtn');
    const contactMeBtn = document.getElementById('contactMeBtn');
    // Get reference to the "Back to Cover" button on the last page
    const backToCoverBtn = document.getElementById('backToCoverBtn');

    // --- State Variables ---
    const totalPages = pages.length; // Total number of pages in the book (including cover and back cover)
    let currentPage = 1; // Tracks the current active page, starting at 1 (Cover Page)
    let isTurning = false; // Flag to prevent multiple page turns while one is in progress

    // Define page numbers for direct navigation (1-based index)
    const PROJECTS_PAGE_INDEX = 4; // Corresponds to id="page4" (My Projects)
    const CONTACT_PAGE_INDEX = 5;  // Corresponds to id="page5" (Contact Me)

    // --- Initial Setup ---
    // Show the landing page when the document first loads
    landingPage.classList.remove('hidden');

    // --- Event Listeners ---

    // Event listener for the 'Enter Portfolio' button on the landing page
    enterBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor link behavior
        landingPage.classList.add('hidden'); // Hide the landing page
        bookContainer.classList.add('visible'); // Show the book container
        navigation.classList.add('visible'); // Show navigation buttons
        initPages(); // Initialize page transforms and z-index for the book view
        updateButtons(); // Update navigation button states
    });

    // Event listener for the 'Home' navigation button (returns to landing page)
    homeNavBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor link behavior
        landingPage.classList.remove('hidden'); // Show the landing page
        bookContainer.classList.remove('visible'); // Hide the book container
        navigation.classList.remove('visible'); // Hide navigation buttons
        goToPage(1); // Ensure book returns to the first page (Cover)
    });

    // Event listeners for direct navigation buttons on the cover page
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', function() {
            goToPage(PROJECTS_PAGE_INDEX); // Navigate directly to the Projects page
        });
    }

    if (contactMeBtn) {
        contactMeBtn.addEventListener('click', function() {
            goToPage(CONTACT_PAGE_INDEX); // Navigate directly to the Contact Me page
        });
    }

    // Event listener for the 'Back to Profile' button on the last page
    if (backToCoverBtn) {
        backToCoverBtn.addEventListener('click', function() {
            goToPage(1); // Navigate back to the first page (Cover Page)
        });
    }

    // Event listeners for the 'Next' and 'Previous' page buttons
    nextBtn.addEventListener('click', nextPage);
    prevBtn.addEventListener('click', prevPage);

    // Touch/Swipe event listeners for mobile navigation
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;

    book.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
    }, false);

    book.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const touchDuration = Date.now() - touchStartTime;
        handleSwipe(touchDuration);
    }, false);

    // Keyboard navigation (Arrow Left/Right)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            nextPage();
        } else if (e.key === 'ArrowLeft') {
            prevPage();
        }
    });

    // --- Functions ---

    /**
     * Initializes the state of all pages when the book is first displayed.
     * Sets the cover page to visible (0deg rotation) and all other pages to hidden (180deg rotation).
     * Manages initial z-index for correct stacking.
     */
    function initPages() {
        pages.forEach((page, index) => {
            if (index === 0) { // The very first page (Cover Page)
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = totalPages; // Ensure cover is always on top initially
            } else {
                // All other pages start flipped to the back
                page.style.transform = 'rotateY(180deg)';
                // Set z-index for correct stacking order from back to front
                page.style.zIndex = totalPages - index;
            }
        });
        currentPage = 1; // Reset current page to 1 (Cover Page)
    }

    /**
     * Updates the disabled state of the 'Previous' and 'Next' navigation buttons
     * based on the currentPage and turning status.
     */
    function updateButtons() {
        prevBtn.disabled = currentPage === 1 || isTurning; // Disable if on first page or turning
        nextBtn.disabled = currentPage === totalPages || isTurning; // Disable if on last page or turning
    }

    /**
     * Navigates to a specific page number with animation.
     *
     * @param {number} pageNumber The target page number (1-based index).
     */
    function goToPage(pageNumber) {
        // Prevent navigation if target is invalid or another turn is in progress
        if (pageNumber < 1 || pageNumber > totalPages || isTurning) return;

        isTurning = true; // Set turning flag to prevent rapid clicks/swipes

        const oldCurrentPage = currentPage; // Store the page we are coming from
        currentPage = pageNumber; // Update the current page
        updateButtons(); // Update button states immediately

        // Apply 'turning' class to pages that are actively flipping
        if (pageNumber > oldCurrentPage) {
            // Flipping forward: apply 'turning' to pages from oldCurrentPage up to (but not including) new currentPage
            for (let i = oldCurrentPage - 1; i < pageNumber - 1; i++) {
                pages[i].classList.add('turning');
            }
        } else {
            // Flipping backward: apply 'turning' to pages from new currentPage up to (but not including) oldCurrentPage
            for (let i = pageNumber - 1; i < oldCurrentPage - 1; i++) {
                pages[i].classList.add('turning');
            }
        }

        // Iterate through all pages to apply correct transformations and z-index
        pages.forEach((page, index) => {
            // Set a timeout to apply the final transform after a brief delay,
            // allowing the CSS transition to play out for the 'turning' class.
            // This timeout should be roughly equal to or slightly longer than the CSS transition duration.
            const animationDuration = 500; // Aligned with CSS transition duration (0.5s)

            if (index < currentPage - 1) {
                // Pages that are already flipped and behind the current active page
                setTimeout(() => {
                    page.style.transform = 'rotateY(-180deg)'; // Flipped backward
                    // Adjust z-index for stacking order of already turned pages
                    page.style.zIndex = totalPages - (currentPage - 1 - index);
                    page.classList.remove('turning'); // Remove turning class once animation is done
                }, animationDuration);
            } else if (index === currentPage - 1) {
                // The current active page (the one being viewed)
                setTimeout(() => {
                    page.style.transform = 'rotateY(0deg)'; // Facing forward
                    page.style.zIndex = totalPages; // Keep current page on top
                    page.classList.remove('turning'); // Remove turning class once animation is done
                }, animationDuration);
            } else {
                // Pages not yet flipped to (still in their initial 'closed' state)
                setTimeout(() => {
                    page.style.transform = 'rotateY(180deg)'; // Flipped forward (to hide content)
                    // Adjust z-index for stacking order of upcoming pages
                    page.style.zIndex = totalPages - (index - (currentPage - 1));
                    page.classList.remove('turning'); // Remove turning class once animation is done
                }, animationDuration);
            }
        });

        // Reset the turning flag after all page animations are expected to complete
        setTimeout(() => {
            isTurning = false;
            updateButtons(); // Update buttons again to ensure correct state after turn
        }, 500); // This timeout should match or slightly exceed `animationDuration`
    }

    /**
     * Navigates to the next page if not on the last page and no turn is in progress.
     */
    function nextPage() {
        if (currentPage < totalPages && !isTurning) {
            goToPage(currentPage + 1);
        }
    }

    /**
     * Navigates to the previous page if not on the first page and no turn is in progress.
     */
    function prevPage() {
        if (currentPage > 1 && !isTurning) {
            goToPage(currentPage - 1);
        }
    }

    /**
     * Handles swipe gestures for page navigation.
     * @param {number} duration The duration of the touch swipe in milliseconds.
     */
    function handleSwipe(duration) {
        const distance = touchEndX - touchStartX;
        const absDistance = Math.abs(distance);
        const isFastSwipe = duration < 300 && absDistance > 50; // Fast swipe: quick and short
        const isLongSwipe = absDistance > 100; // Long swipe: slow but significant distance

        // Trigger page turn if it's a fast or long enough swipe
        if (isFastSwipe || isLongSwipe) {
            if (distance < 0) {
                // Swipe left means go to next page
                nextPage();
            } else {
                // Swipe right means go to previous page
                prevPage();
            }
        }
    }
});

// --- Email Sending Function (Outside DOMContentLoaded to be globally accessible if needed for onclick) ---
/**
 * Sends an email using EmailJS service.
 * Retrieves values from the contact form fields.
 */
function sendMail() {
    let parms = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
    };

    // Ensure EmailJS is initialized before attempting to send
    // (Initialization happens via the script tag in HTML)
    emailjs.send("service_k9vxeov", "template_34c0ffm", parms)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Your message has been sent successfully!'); // User feedback
            // Optionally clear the form after successful submission
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("subject").value = "";
            document.getElementById("message").value = "";
        }, function(error) {
            console.log('FAILED...', error);
            alert('Failed to send message. Please try again later.'); // User feedback on error
        });
}

// When index.html loads, check if there's a hash like #page4
window.addEventListener("load", function () {
  const hash = window.location.hash;

  if (hash.startsWith("#page")) {
    const target = document.querySelector(hash);
    if (target) {
      // Remove 'active' from all pages
      document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

      // Add 'active' only to the target page
      target.classList.add("active");
    }
  }
});
