document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.padding = '10px 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.classList.contains('lang-option')) {
                return; // Skip smooth scrolling for language options
            }
            
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: targetPosition - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form functionality using EmailJS
    // Initialize EmailJS with your user ID
    emailjs.init("swZlx1amPELR9W8yB");
    
    const contactForm = document.getElementById("contactForm");
    const successMessage = document.getElementById("successMessage");
    
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            
            // Display loading state
            const submitBtn = contactForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;
            
            // Prepare template parameters
            const templateParams = {
                to_name: "Chandrashekhar",
                from_name: document.getElementById("name").value,
                from_email: document.getElementById("email").value,
                subject: document.getElementById("subject").value,
                message: document.getElementById("message").value
            };
            
            // Send email using EmailJS with your actual service and template IDs
            emailjs.send('service_igp5ffv', 'template_q2r65kj', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Hide the form and show success message
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Reset form for if they come back later
                    contactForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    alert("Failed to send message. Please try again later.");
                    
                    // Reset button
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Add animations when elements come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.timeline-item, .project-card, .skill-category');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight;
            
            if (elementPosition < screenPosition - 100) {
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initially set the elements as invisible
    document.querySelectorAll('.timeline-item, .project-card, .skill-category').forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    // Run the animation function on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Run once on page load to animate elements already in view
    window.addEventListener('load', animateOnScroll);

    // Form submission for new recommendations
    const newRecommendationForm = document.getElementById('newRecommendationForm');
    if (newRecommendationForm) {
        newRecommendationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Collect form data
            const firstName = document.getElementById('recommenderFirstName').value;
            const lastName = document.getElementById('recommenderLastName').value;
            const company = document.getElementById('recommenderCompany').value;
            const jobRole = document.getElementById('recommenderJobRole').value;
            const relation = document.getElementById('recommenderRelation').value;
            const text = document.getElementById('recommendationText').value;
            
            // Create recommendation object
            const recommendation = {
                firstName: firstName,
                lastName: lastName,
                company: company,
                jobRole: jobRole,
                relation: relation,
                text: text,
                date: new Date().toISOString()
            };
            
            // Save to localStorage
            saveRecommendation(recommendation);
            
            // Hide the form and show success message
            newRecommendationForm.style.display = 'none';
            document.getElementById('recommendationSuccessMessage').style.display = 'block';
            
            // Reset the form for future use
            newRecommendationForm.reset();
        });
    }
});

// Function to save recommendation to localStorage
function saveRecommendation(recommendation) {
    // Get existing recommendations or initialize empty array
    let recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    
    // Add new recommendation
    recommendations.push(recommendation);
    
    // Save back to localStorage
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
}

// Updated function to show existing recommendations
function showExistingRecommendations() {
    document.getElementById('existingRecommendations').style.display = 'block';
    document.getElementById('recommendationForm').style.display = 'none';
    
    // Get the container for recommendations
    const recommendationsList = document.querySelector('.recommendations-list');
    
    // Get saved recommendations from localStorage
    const savedRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    
    // If there are new recommendations, add them to the list
    if (savedRecommendations.length > 0) {
        // Create HTML for each new recommendation
        savedRecommendations.forEach(rec => {
            // Check if this recommendation is already displayed (to avoid duplicates)
            const fullName = `${rec.firstName} ${rec.lastName}`;
            const existingRecs = recommendationsList.querySelectorAll('h4');
            let isDuplicate = false;
            
            existingRecs.forEach(el => {
                if (el.textContent === fullName) {
                    isDuplicate = true;
                }
            });
            
            // Only add if not a duplicate
            if (!isDuplicate) {
                const recCard = document.createElement('div');
                recCard.className = 'recommendation-card';
                
                recCard.innerHTML = `
                    <div class="recommendation-content">
                        <p class="recommendation-text">"${rec.text}"</p>
                        <div class="recommender-info">
                            <h4>${rec.firstName} ${rec.lastName}</h4>
                            <p>${rec.jobRole}, ${rec.company}</p>
                            <span class="recommendation-type">${capitalizeFirstLetter(rec.relation)}</span>
                        </div>
                    </div>
                `;
                
                // Add to the beginning to show newest first
                recommendationsList.prepend(recCard);
            }
        });
    }
    
    // Scroll to the recommendations list
    document.getElementById('existingRecommendations').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to hide existing recommendations
function hideExistingRecommendations() {
    document.getElementById('existingRecommendations').style.display = 'none';
}

// Function to show the recommendation form
function showRecommendationForm() {
    document.getElementById('recommendationForm').style.display = 'block';
    document.getElementById('existingRecommendations').style.display = 'none';
    document.getElementById('recommendationSuccessMessage').style.display = 'none';
    
    // Scroll to the form
    document.getElementById('recommendationForm').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Function to hide the recommendation form
function hideRecommendationForm() {
    document.getElementById('recommendationForm').style.display = 'none';
}

// Language switcher functionality - UPDATED WITH DEBUGGING
let currentLanguage = localStorage.getItem('language') || 'en';

// Function to update all text elements with translations
function updateLanguage(lang) {
    console.log('updateLanguage called with:', lang);
    console.log('Available translations:', Object.keys(translations));
    
    let translatedCount = 0;
    let missingCount = 0;
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        console.log(`Translating element with key: ${key}`);
        
        if (translations[lang] && translations[lang][key]) {
            const oldText = element.textContent;
            element.textContent = translations[lang][key];
            console.log(`Translated: ${oldText} -> ${translations[lang][key]}`);
            translatedCount++;
        } else {
            console.warn(`Missing translation for key: ${key} in language: ${lang}`);
            missingCount++;
        }
    });
    
    console.log(`Translation stats: ${translatedCount} translated, ${missingCount} missing`);
    
    // Update input placeholders
    document.querySelectorAll('input[data-i18n-placeholder], textarea[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Update the current language indicator
    document.querySelector('.current-lang').textContent = lang.toUpperCase();
    
    // Save language preference
    localStorage.setItem('language', lang);
    currentLanguage = lang;
    
    console.log('Language update completed');
}

// Call updateLanguage when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting initial language to:', currentLanguage);
    updateLanguage(currentLanguage);
});

