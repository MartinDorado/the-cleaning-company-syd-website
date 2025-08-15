// Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const isMobileMenuLink = mobileMenu.contains(this);
                if (isMobileMenuLink) {
                    mobileMenu.classList.add('hidden'); 
                }
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerOffset = document.querySelector('header').offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });

        // Set current year in footer
        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
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
        quoteForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Basic front-end validation
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const service = document.getElementById('service_type')?.value;

            if (!name || !email || !service) {
            formMessage.textContent = "Please fill in all required fields (Name/Company, Email, Service Needed).";
            formMessage.className = "mb-4 text-sm text-red-700 p-3 bg-red-100 rounded-lg";
            return;
            }

            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : "";
            if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
            }

            try {
            const formData = new FormData(quoteForm);
            const res = await fetch(quoteForm.action, {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            });

            if (res.ok) {
                formMessage.textContent = "Thank you! We will get back to you shortly.";
                formMessage.className = "mb-4 text-sm text-green-700 p-3 bg-green-100 rounded-lg";
                quoteForm.reset();
            } else {
                // Try to read errors from Formspree
                const data = await res.json().catch(() => ({}));
                const err = data.errors ? data.errors.map(e => e.message).join(", ") : "There was a problem submitting the form.";
                formMessage.textContent = err;
                formMessage.className = "mb-4 text-sm text-red-700 p-3 bg-red-100 rounded-lg";
            }
            } catch (error) {
            formMessage.textContent = "Network error. Please try again later.";
            formMessage.className = "mb-4 text-sm text-red-700 p-3 bg-red-100 rounded-lg";
            } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText || "Get My Free Quote";
            }
            }
        });
        }
