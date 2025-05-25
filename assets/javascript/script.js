 document.addEventListener('DOMContentLoaded', function() {
            const landingPage = document.getElementById('landingPage');
            const enterBtn = document.getElementById('enterBtn');
            const homeNavBtn = document.getElementById('homeNavBtn');
            const bookContainer = document.getElementById('bookContainer');
            const navigation = document.getElementById('navigation');

            const book = document.getElementById('book');
            const pages = document.querySelectorAll('.page');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            // IMPORTANT: totalPages will now be 6
            const totalPages = pages.length;
            let currentPage = 1; // Start on the first page (Cover Page)
            let isTurning = false;

            // Get references to new buttons
            const viewProjectsBtn = document.getElementById('viewProjectsBtn');
            const contactMeBtn = document.getElementById('contactMeBtn');
            const backToCoverBtn = document.getElementById('backToCoverBtn');

            // Define page numbers for direct navigation
            // IMPORTANT: Adjust these indices as page numbers have shifted
            const PROJECTS_PAGE_INDEX = 4; // Corresponds to id="page4" now
            const CONTACT_PAGE_INDEX = 5;  // Corresponds to id="page5" now

            // Show landing page initially
            landingPage.classList.remove('hidden');

            // Enter portfolio button
            enterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                landingPage.classList.add('hidden');
                bookContainer.classList.add('visible');
                navigation.classList.add('visible');
                initPages(); // Re-initialize pages to ensure correct starting state
                updateButtons();
            });

            // Home navigation button
            homeNavBtn.addEventListener('click', function(e) {
                e.preventDefault();
                landingPage.classList.remove('hidden');
                bookContainer.classList.remove('visible');
                navigation.classList.remove('visible');
                goToPage(1); // Return to first page (Cover)
            });

            // Event listeners for new buttons on the cover page
            if (viewProjectsBtn) {
                viewProjectsBtn.addEventListener('click', function() {
                    goToPage(PROJECTS_PAGE_INDEX);
                });
            }

            if (contactMeBtn) {
                contactMeBtn.addEventListener('click', function() {
                    goToPage(CONTACT_PAGE_INDEX);
                });
            }

            // Event listener for the Back to Cover button on the last page
            if (backToCoverBtn) {
                backToCoverBtn.addEventListener('click', function() {
                    goToPage(1); // Navigate to the first page (Cover Page)
                });
            }

            // Initialize pages
            function initPages() {
                pages.forEach((page, index) => {
                    if (index === 0) { // Cover page (page1)
                        page.style.transform = 'rotateY(0deg)';
                        page.style.zIndex = totalPages; // Keep cover on top
                    } else {
                        // All other pages start rotated to the back
                        page.style.transform = 'rotateY(180deg)';
                        page.style.zIndex = totalPages - index;
                    }
                });
                currentPage = 1; // Ensure currentPage is set to 1 (Cover Page)
            }

            // Update button states
            function updateButtons() {
                prevBtn.disabled = currentPage === 1 || isTurning;
                nextBtn.disabled = currentPage === totalPages || isTurning; // next button disabled on the last page
            }

            // Go to specific page
            function goToPage(pageNumber) {
                if (pageNumber < 1 || pageNumber > totalPages || isTurning) return;

                isTurning = true;

                const oldCurrentPage = currentPage;
                currentPage = pageNumber;
                updateButtons();

                // Apply turning class for realistic page curl effect for pages that are about to flip
                if (pageNumber > oldCurrentPage) {
                    for (let i = oldCurrentPage - 1; i < pageNumber - 1; i++) {
                        pages[i].classList.add('turning');
                    }
                } else {
                    for (let i = pageNumber - 1; i < oldCurrentPage - 1; i++) {
                        pages[i].classList.add('turning');
                    }
                }

                pages.forEach((page, index) => {
                    if (index < currentPage - 1) {
                        // Pages that are already flipped past
                        setTimeout(() => {
                            page.style.transform = 'rotateY(-180deg)';
                            page.style.zIndex = totalPages - (currentPage - 1 - index);
                            page.classList.remove('turning');
                        }, 700);
                    } else if (index === currentPage - 1) {
                        // The current active page
                        setTimeout(() => {
                            page.style.transform = 'rotateY(0deg)';
                            page.style.zIndex = totalPages; // Keep current page on top
                            page.classList.remove('turning');
                        }, 700);
                    } else {
                        // Pages not yet flipped to
                        setTimeout(() => {
                            page.style.transform = 'rotateY(180deg)';
                            page.style.zIndex = totalPages - (index - (currentPage - 1));
                            page.classList.remove('turning');
                        }, 700);
                    }
                });

                // Reset turning flag after animation completes
                setTimeout(() => {
                    isTurning = false;
                    updateButtons();
                }, 700);
            }

            // Next page
            function nextPage() {
                if (currentPage < totalPages && !isTurning) {
                    goToPage(currentPage + 1);
                }
            }

            // Previous page
            function prevPage() {
                if (currentPage > 1 && !isTurning) {
                    goToPage(currentPage - 1);
                }
            }

            // Event listeners for general navigation
            nextBtn.addEventListener('click', nextPage);
            prevBtn.addEventListener('click', prevPage);

            // Touch and swipe events for mobile
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

            function handleSwipe(duration) {
                const distance = touchEndX - touchStartX;
                const absDistance = Math.abs(distance);
                const isFastSwipe = duration < 300 && absDistance > 50;
                const isLongSwipe = absDistance > 100;

                if (isFastSwipe || isLongSwipe) {
                    if (distance < 0) {
                        // Swipe left - next page
                        nextPage();
                    } else {
                        // Swipe right - previous page
                        prevPage();
                    }
                }
            }

            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowRight') {
                    nextPage();
                } else if (e.key === 'ArrowLeft') {
                    prevPage();
                }
            });
        });