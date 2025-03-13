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

    // Get the recommendation form
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
            
            // Prepare data for submission - UPDATED for better email formatting
            const formData = {
                to_name: "Chandrashekhar", // Same as in your contact form
                from_name: firstName + " " + lastName,
                from_email: "recommendation@portfolio.com", // Placeholder since we don't collect email
                subject: "New Portfolio Recommendation from " + firstName + " " + lastName,
                message: `New recommendation submission:
                
Full Name: ${firstName} ${lastName}
Company: ${company}
Job Role: ${jobRole}
Relationship: ${relation}
                
Recommendation:
"${text}"
                
This recommendation has been saved as pending review on the submitter's device.`,
            };
            
            // Send data using EmailJS - using the same template as contact form
            emailjs.send('service_igp5ffv', 'template_q2r65kj', formData)
                .then(function(response) {
                    console.log('Recommendation sent to your email!', response.status);
                    
                    // Hide the form and show success message
                    newRecommendationForm.style.display = 'none';
                    document.getElementById('recommendationSuccessMessage').style.display = 'block';
                    
                    // Also save to localStorage so the user can see their own recommendation immediately
                    saveRecommendation({
                        firstName: firstName,
                        lastName: lastName,
                        company: company,
                        jobRole: jobRole,
                        relation: relation,
                        text: text,
                        date: new Date().toISOString()
                    });
                    
                    // Reset the form for future use
                    newRecommendationForm.reset();
                }, function(error) {
                    console.log('Failed to send recommendation', error);
                    alert("There was a problem submitting your recommendation. Please try again.");
                });
        });
    }

    // Check if we're on a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        // Add click handler to recommendation cards for mobile devices
        document.querySelectorAll('.recommendation-card').forEach(card => {
            card.addEventListener('click', function() {
                // Toggle active class to show/hide recommendation
                this.classList.toggle('active');
            });
        });
        
        // Add event listener to document to handle adding new cards
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('recommendation-card')) {
                            node.addEventListener('click', function() {
                                this.classList.toggle('active');
                            });
                        }
                    });
                }
            });
        });
        
        // Start observing the recommendations list
        observer.observe(document.querySelector('.recommendations-list'), { 
            childList: true, 
            subtree: true 
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

// Create a recommendations.js file that will store approved recommendations
// Create a function to load these predefined recommendations
function loadPredefinedRecommendations() {
    // These are recommendations you want to show to everyone
    return [
        {
            firstName: "Martin",
            lastName: "Schmidt",
            company: "Karlsruhe Institute of Technology",
            jobRole: "Senior Researcher",
            relation: "colleague",
            text: "Chandrashekhar demonstrated exceptional software testing skills during our collaboration. His attention to detail and ability to identify critical security vulnerabilities saved our project from potential issues."
        },
        {
            firstName: "Lisa",
            lastName: "Wagner",
            company: "Atlas Copco",
            jobRole: "Project Manager",
            relation: "manager",
            text: "Working with Chandrashekhar on our security testing projects was a pleasure. His technical knowledge combined with excellent communication skills made complex security concepts accessible to our entire team."
        },
        // When you receive a new recommendation by email that you want to approve,
        // simply add it here following the same format
        // {
        //     firstName: "New",
        //     lastName: "Person",
        //     company: "Their Company",
        //     jobRole: "Their Role",
        //     relation: "colleague",
        //     text: "Copy their recommendation text here."
        // },
    ];
}

// Update the showExistingRecommendations function to show both predefined and local recommendations
function showExistingRecommendations() {
    document.getElementById('existingRecommendations').style.display = 'block';
    document.getElementById('recommendationForm').style.display = 'none';
    
    // Get the container for recommendations
    const recommendationsList = document.querySelector('.recommendations-list');
    
    // Clear existing recommendations to avoid duplicates
    recommendationsList.innerHTML = '';
    
    // Load predefined recommendations
    const predefinedRecommendations = loadPredefinedRecommendations();
    
    // Add predefined recommendations to the list
    predefinedRecommendations.forEach(rec => {
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
        
        recommendationsList.appendChild(recCard);
    });
    
    // Get saved recommendations from localStorage (these are ones the current user submitted)
    const savedRecommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    
    // Add a note if there are pending recommendations
    if (savedRecommendations.length > 0) {
        const pendingNote = document.createElement('div');
        pendingNote.className = 'pending-recommendations-note';
        pendingNote.innerHTML = `
            <p><strong>You have submitted ${savedRecommendations.length} recommendation(s).</strong></p>
            <p>Important notes about recommendations:</p>
            <ul>
                <li>Your recommendations are only visible on this device</li>
                <li>I've received your recommendation by email and will review it</li>
                <li>After approval, your recommendation will be visible to all visitors</li>
                <li>Thank you for taking the time to share your experience!</li>
            </ul>
        `;
        document.getElementById('existingRecommendations').insertBefore(pendingNote, document.querySelector('.recommendations-list'));
        
        // Add local recommendations (these will only be visible to the person who submitted them)
        savedRecommendations.forEach(rec => {
            const recCard = document.createElement('div');
            recCard.className = 'recommendation-card pending-recommendation';
            
            recCard.innerHTML = `
                <div class="recommendation-content">
                    <div class="pending-badge">Pending Review</div>
                    <p class="recommendation-text">"${rec.text}"</p>
                    <div class="recommender-info">
                        <h4>${rec.firstName} ${rec.lastName}</h4>
                        <p>${rec.jobRole}, ${rec.company}</p>
                        <span class="recommendation-type">${capitalizeFirstLetter(rec.relation)}</span>
                    </div>
                </div>
            `;
            
            recommendationsList.appendChild(recCard);
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

