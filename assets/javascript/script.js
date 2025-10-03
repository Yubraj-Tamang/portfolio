 // Theme Toggle
      const themeToggle = document.getElementById("themeToggle");
      const htmlElement = document.documentElement;

      // Check for saved theme preference or default to light mode
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

      // Menu Toggle
      function toggleMenu() {
        const navCenter = document.getElementById("navCenter");
        navCenter.classList.toggle("active");
      }

      // Download Resume
      function downloadResume(event) {
        event.preventDefault();
        alert(
          "Resume download will start. Please add your actual resume file link here."
        );
        // Replace with actual resume download link
        // window.location.href = 'path/to/your/resume.pdf';
      }

      // Handle Form Submit
      function handleSubmit(event) {
        event.preventDefault();

        const formData = {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          subject: document.getElementById("subject").value,
          message: document.getElementById("message").value,
        };

        // You can integrate with your backend API or email service here
        console.log("Form Data:", formData);

        alert("Thank you for your message! I will get back to you soon.");

        // Reset form
        event.target.reset();

        // Example: Send to backend
        // fetch('/api/contact', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
      }

      // Smooth scrolling
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            // Close mobile menu if open
            document.getElementById("navCenter").classList.remove("active");
          }
        });
      });

      // Intersection Observer for animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      }, observerOptions);

      document.querySelectorAll(".skill-card, .project-card").forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
      });