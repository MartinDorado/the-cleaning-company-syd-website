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
        
        // Basic Quote Form Submission (for demonstration)
        const quoteForm = document.getElementById('quoteForm');
        const formMessage = document.getElementById('form-message');

        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service_type').value;

            if (!name || !email || service === "Choose a service") {
                formMessage.textContent = "Please fill in all required fields (Name/Company, Email, Service Needed).";
                formMessage.className = "mb-4 text-sm text-red-600 p-3 bg-red-100 rounded-lg";
                return;
            }
            
            formMessage.textContent = "Thank you for your request! We will get back to you shortly.";
            formMessage.className = "mb-4 text-sm text-green-700 p-3 bg-green-100 rounded-lg";
            quoteForm.reset(); 
        });