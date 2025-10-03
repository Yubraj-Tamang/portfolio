// Theme Toggle
      const themeToggle = document.getElementById("themeToggle");
      const htmlElement = document.documentElement;

      // Check for saved theme preference
      const currentTheme = localStorage.getItem("theme") || "light";
      htmlElement.setAttribute("data-theme", currentTheme);

      if (currentTheme === "dark") {
        themeToggle.checked = true;
      }

      themeToggle.addEventListener("change", function () {
        if (this.checked) {
          htmlElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
        } else {
          htmlElement.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
        }
      });

      // Project Filtering
      const filterButtons = document.querySelectorAll(".filter-btn");
      const projectCards = document.querySelectorAll(".project-card");

      filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Remove active class from all buttons
          filterButtons.forEach((btn) => btn.classList.remove("active"));

          // Add active class to clicked button
          this.classList.add("active");

          const filter = this.getAttribute("data-filter");

          projectCards.forEach((card) => {
            if (filter === "all") {
              card.style.display = "flex";
              // Restart animation
              card.style.animation = "none";
              setTimeout(() => {
                card.style.animation = "fadeIn 0.5s forwards";
              }, 10);
            } else {
              const categories = card.getAttribute("data-category");
              if (categories.includes(filter)) {
                card.style.display = "flex";
                card.style.animation = "none";
                setTimeout(() => {
                  card.style.animation = "fadeIn 0.5s forwards";
                }, 10);
              } else {
                card.style.display = "none";
              }
            }
          });
        });
      });