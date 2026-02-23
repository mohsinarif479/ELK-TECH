const path = window.location.pathname.toLowerCase();
const links = document.querySelectorAll(".nav-link");

links.forEach((link) => {
    const page = link.dataset.page;
    const isHome = page === "home" && (path.endsWith("/portfolio.html") || path.endsWith("/") || path.endsWith("/index.html"));
    const isAbout = page === "about" && path.endsWith("/about.html");
    const isContact = page === "contact" && path.endsWith("/contact.html");

    if (isHome || isAbout || isContact) {
        link.classList.add("active");
    }
});

const yearElement = document.getElementById("year");
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

const form = document.getElementById("contactForm");
if (form) {
    const formMessage = document.getElementById("formMessage");
    const submitButton = form.querySelector("button[type='submit']");
    const recipientEmail = "mohsinarif479@gmail.com";

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !message) {
            formMessage.textContent = "Please complete all fields before submitting.";
            formMessage.className = "form-message error";
            return;
        }

        if (!emailPattern.test(email)) {
            formMessage.textContent = "Please enter a valid email address.";
            formMessage.className = "form-message error";
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
            formMessage.textContent = "Submitting your message...";
            formMessage.className = "form-message";

            const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    _subject: `Portfolio Contact: ${name}`,
                    _template: "table"
                })
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }

            formMessage.textContent = "Thanks. Your message has been submitted successfully.";
            formMessage.className = "form-message success";
            form.reset();
        } catch (error) {
            formMessage.textContent = "Message could not be sent. Please try again.";
            formMessage.className = "form-message error";
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
        }
    });
}
