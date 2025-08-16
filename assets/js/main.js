document.addEventListener('DOMContentLoaded', () => {
  // ===== Mobile menu toggle =====
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      // Skip plain "#" which is not a valid selector
      if (!targetId || targetId === '#') return;

      e.preventDefault();
      const isMobileMenuLink = mobileMenu && mobileMenu.contains(this);
      if (isMobileMenuLink) mobileMenu.classList.add('hidden');

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      const header = document.querySelector('header');
      const headerOffset = header ? header.offsetHeight : 0;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    });
  });

  // ===== Set current year in footer =====
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    if (!questionButton) return;
    questionButton.addEventListener('click', () => {
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
        }
      });
      item.classList.toggle('open');
    });
  });

    // ===== Quote Form submission (Formspree) =====
    const quoteForm = document.getElementById('quoteForm');
    const formMessage = document.getElementById('form-message');

    if (quoteForm && formMessage) {
    quoteForm.noValidate = true;   // use our custom validation only
    let submitting = false;        // prevent double submits

    console.log("Form handler attached for:", quoteForm.action);

    quoteForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // ---- guard against double-clicks
        if (submitting) return;
        submitting = true;

        // ---- honeypot (bot trap) — add the input in your HTML form (see below)
        const trap = document.getElementById('company_website');
        if (trap && trap.value) {
        formMessage.textContent = "Submission blocked.";
        formMessage.className = "mb-4 text-sm text-red-700 p-3 bg-red-100 rounded-lg";
        submitting = false;
        return;
        }

        // ---- basic front-end validation
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const service = document.getElementById('service_type')?.value;

        if (!name || !email || !service) {
        formMessage.textContent = "Please fill in all required fields (Name/Company, Email, Service Needed).";
        formMessage.className = "mb-4 text-sm text-red-700 p-3 bg-red-100 rounded-lg";
        submitting = false;
        return;
        }

        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

        try {
        const formData = new FormData(quoteForm);
        const res = await fetch(quoteForm.action, {
            method: "POST",
            body: formData,
            headers: { "Accept": "application/json" },
            mode: "cors"
        });

        if (res.ok) {
            formMessage.textContent = "Thank you! We will get back to you shortly.";
            formMessage.className = "mb-4 text-sm text-green-700 p-3 bg-green-100 rounded-lg";
            quoteForm.reset();
        } else {
            const data = await res.json().catch(() => ({}));
            const err = data?.errors ? data.errors.map(e => e.message).join(", ") : "There was a problem submitting the form.";
            formMessage.textContent = err;
            formMessage.className = "mb-4 text-sm text-red-700 p-3 bg-red-100 rounded-lg";
        }
        } catch (error) {
        console.error("Form submit error:", error);
        formMessage.textContent = "Network error. Please try again later.";
        formMessage.className = "mb-4 text-sm text-red-700 p-3 bg-red-100 rounded-lg";
        } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalBtnText || "Get My Free Quote"; }
        submitting = false; // release guard
        }
    });
    } else {
    console.warn("quoteForm or form-message not found in DOM");
    }
    });
