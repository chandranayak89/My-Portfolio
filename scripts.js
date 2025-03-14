// Add these variables at the top of your scripts.js file
// Replace with your actual Google Apps Script Web App URL
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyyqW-csZ4QPzys5sLnXp_0s4EIH6W59XH4bvuuxXqJxNfQR-a7WIg53q9FUFKF7SDdnw/exec";

// =======================================================
// DEFINE ALL GLOBAL FUNCTIONS FIRST - BEFORE DOMContentLoaded
// =======================================================

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to save recommendation ID to localStorage
function saveRecommendationId(id, data) {
    // Get existing submissions
    let submissions = JSON.parse(localStorage.getItem('submitted_recommendations') || '[]');
    
    // Add this submission
    submissions.push({
        id: id,
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        jobRole: data.jobRole,
        relation: data.relation,
        text: data.text,
        date: new Date().toISOString(),
        status: 'Pending'
    });
    
    // Save back to localStorage
    localStorage.setItem('submitted_recommendations', JSON.stringify(submissions));
}

// =======================================================
// RECOMMENDATION BUTTON DIRECT FIX - NO CONFLICTS APPROACH
// =======================================================

// Execute this function immediately when the script loads
(function() {
    console.log("Initializing direct recommendation button fix");

    // Wait for the DOM to be completely loaded
    document.addEventListener('DOMContentLoaded', function() {
        // 1. Direct button click handlers
        var leaveButton = document.querySelector('button[data-i18n="recommendations-leave"]');
        var viewButton = document.querySelector('button[data-i8n="recommendations-view"]');
        
        if (leaveButton) {
            console.log("Found leave recommendation button, adding click handler");
            leaveButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Leave recommendation button clicked");
                openRecommendationForm();
            });
        } else {
            console.error("Leave recommendation button not found");
        }
        
        if (viewButton) {
            console.log("Found view recommendations button, adding click handler");
            viewButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("View recommendations button clicked");
                openExistingRecommendations();
            });
        } else {
            console.error("View recommendations button not found");
        }
        
        // Find cancel and back buttons too
        var cancelButton = document.querySelector('button[data-i18n="recommendations-form-cancel"]');
        var backButton = document.querySelector('button[data-i18n="recommendations-back"]');
        
        if (cancelButton) {
            console.log("Found cancel button, adding click handler");
            cancelButton.addEventListener('click', function() {
                console.log("Cancel button clicked");
                hideRecommendationForm();
            });
        }
        
        if (backButton) {
            console.log("Found back button, adding click handler");
            backButton.addEventListener('click', function() {
                console.log("Back button clicked");
                hideExistingRecommendations();
            });
        }
    });
    
    // 2. Direct control functions
    function openRecommendationForm() {
        console.log("Opening recommendation form (direct function)");
        var form = document.getElementById('recommendationForm');
        var recommendations = document.getElementById('existingRecommendations');
        var successMsg = document.getElementById('recommendationSuccessMessage');
        
        if (form) {
            console.log("Form found, displaying it");
            form.style.display = 'block';
            
            // Focus on first input field for better UX
            setTimeout(function() {
                var firstInput = form.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
            
            // Scroll to form
            form.scrollIntoView({behavior: 'smooth', block: 'start'});
        } else {
            console.error("Form element not found!", document.getElementById('recommendationForm'));
        }
        
        // Hide other elements
        if (recommendations) recommendations.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
    }
    
    function hideRecommendationForm() {
        console.log("Hiding recommendation form (direct function)");
        var form = document.getElementById('recommendationForm');
        if (form) form.style.display = 'none';
    }
    
    function openExistingRecommendations() {
        console.log("Opening existing recommendations (direct function)");
        var form = document.getElementById('recommendationForm');
        var recommendations = document.getElementById('existingRecommendations');
        
        // Hide form
        if (form) form.style.display = 'none';
        
        // Show recommendations
        if (recommendations) {
            console.log("Recommendations element found, displaying it");
            recommendations.style.display = 'block';
            recommendations.scrollIntoView({behavior: 'smooth', block: 'start'});
            
            // Fetch the latest approved recommendations when opening this section
            fetchApprovedRecommendations();
        } else {
            console.error("Recommendations element not found!");
        }
    }
    
    function hideExistingRecommendations() {
        console.log("Hiding existing recommendations (direct function)");
        var recommendations = document.getElementById('existingRecommendations');
        if (recommendations) recommendations.style.display = 'none';
    }
    
    // 3. Make functions globally available
    window.showRecommendationForm = openRecommendationForm;
    window.hideRecommendationForm = hideRecommendationForm;
    window.showExistingRecommendations = openExistingRecommendations;
    window.hideExistingRecommendations = hideExistingRecommendations;
    
    console.log("Direct recommendation button handlers initialized");
})();

// =======================================================
// KEEP ALL YOUR EXISTING CODE BELOW THIS POINT
// =======================================================

// Language switcher functionality
let currentLanguage = localStorage.getItem('language') || 'en';

// Function to update all text elements with translations
function updateLanguage(lang) {
    console.log('updateLanguage called with:', lang);
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
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
}

// =======================================================
// NOW THE REGULAR DOCUMENT READY EVENT
// =======================================================

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
            
            // Show loading state
            const submitBtn = newRecommendationForm.querySelector("button[type='submit']");
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Submitting...";
            submitBtn.disabled = true;
            
            // Prepare recommendation data for Google Sheet
            const recommendationData = {
                firstName: firstName,
                lastName: lastName,
                company: company,
                jobRole: jobRole,
                relation: relation,
                text: text
            };
            
            // Send to Google Sheet and also via email
            Promise.all([
                // 1. Send to Google Sheet
                fetch(GOOGLE_SHEET_API_URL, {
                    method: 'POST',
                    body: JSON.stringify(recommendationData)
                }).then(response => response.json()),
                
                // 2. Send via EmailJS as a backup and notification
                emailjs.send('service_igp5ffv', 'template_q2r65kj', {
                    to_name: "Chandrashekhar",
                    from_name: firstName + " " + lastName,
                    from_email: "recommendation@portfolio.com",
                    subject: "New Portfolio Recommendation from " + firstName + " " + lastName,
                    message: `New recommendation submission:
                    
Full Name: ${firstName} ${lastName}
Company: ${company}
Job Role: ${jobRole}
Relationship: ${relation}
                    
Recommendation:
"${text}"
                    
This has been saved to your Google Sheet for review.`
                })
            ])
            .then(([sheetResponse, emailResponse]) => {
                console.log('Recommendation saved to Google Sheet:', sheetResponse);
                console.log('Email notification sent:', emailResponse);
                
                // Save recommendation ID to localStorage for tracking
                saveRecommendationId(sheetResponse.id, recommendationData);
                
                // Hide the form and show success message
                newRecommendationForm.style.display = 'none';
                document.getElementById('recommendationSuccessMessage').style.display = 'block';
                
                // Reset form
                newRecommendationForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error submitting recommendation:', error);
                alert("There was a problem submitting your recommendation. Please try again.");
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // Improved touch device detection that works better across platforms
    function isTouchDevice() {
        return (('ontouchstart' in window) || 
                (navigator.maxTouchPoints > 0) || 
                (navigator.msMaxTouchPoints > 0));
    }

    // Add this function to properly handle iOS touch events
    function setupUniversalTouchInteraction() {
        console.log("Setting up universal touch interaction for all devices");
        
        // Project cards interaction
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const description = card.querySelector('p');
            if (description) {
                // Force hide details initially
                description.style.display = 'none';
                
                // Desktop hover events
                card.addEventListener('mouseenter', function() {
                    if (!isTouchDevice()) {
                        description.style.display = 'block';
                    }
                });
                
                card.addEventListener('mouseleave', function() {
                    if (!isTouchDevice() && !this.classList.contains('active')) {
                        description.style.display = 'none';
                    }
                });
                
                // Touch events that work on all mobile devices including iOS
                card.addEventListener('touchstart', function(e) {
                    // Don't prevent default here to allow scrolling
                    if (!this.classList.contains('processing-touch')) {
                        this.classList.add('processing-touch');
                    }
                }, {passive: true});
                
                card.addEventListener('touchend', function(e) {
                    if (this.classList.contains('processing-touch')) {
                        e.preventDefault(); // Prevent ghost click
                        this.classList.remove('processing-touch');
                        this.classList.toggle('active');
                        
                        if (this.classList.contains('active')) {
                            description.style.display = 'block';
                        } else {
                            description.style.display = 'none';
                        }
                        
                        console.log("Touch handled on project card");
                    }
                });
            }
        });
        
        // Timeline items interaction - same approach
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            // Try different selectors to find details
            const details = item.querySelector('.experience-details') || 
                            item.querySelector('.timeline-content ul');
            
            if (details) {
                // Force hide details initially
                details.style.display = 'none';
                
                // Desktop hover
                item.addEventListener('mouseenter', function() {
                    if (!isTouchDevice()) {
                        details.style.display = 'block';
                    }
                });
                
                item.addEventListener('mouseleave', function() {
                    if (!isTouchDevice() && !this.classList.contains('active')) {
                        details.style.display = 'none';
                    }
                });
                
                // Touch events for all devices
                item.addEventListener('touchstart', function(e) {
                    if (!this.classList.contains('processing-touch')) {
                        this.classList.add('processing-touch');
                    }
                }, {passive: true});
                
                item.addEventListener('touchend', function(e) {
                    if (this.classList.contains('processing-touch')) {
                        e.preventDefault();
                        this.classList.remove('processing-touch');
                        this.classList.toggle('active');
                        
                        if (this.classList.contains('active')) {
                            details.style.display = 'block';
                        } else {
                            details.style.display = 'none';
                        }
                        
                        console.log("Touch handled on timeline item");
                    }
                });
            }
        });
        
        console.log("Universal touch interaction setup complete");
    }

    // Call our new universal touch setup function
    setupUniversalTouchInteraction();

    // Initialize language
    updateLanguage(currentLanguage);

    // =======================================================
    // FIX FOR RECOMMENDATION BUTTONS & PROJECT CARDS
    // =======================================================

    // 1. Fix for recommendation buttons
    const leaveRecommendationBtn = document.querySelector('button[data-i18n="recommendations-leave"]');
    const viewRecommendationsBtn = document.querySelector('button[data-i8n="recommendations-view"]');
    const cancelBtn = document.querySelector('button[data-i18n="recommendations-form-cancel"]');
    const backBtn = document.querySelector('button[data-i18n="recommendations-back"]');

    if (leaveRecommendationBtn) {
        console.log("Found leave recommendation button");
        // Remove any existing event listeners
        leaveRecommendationBtn.removeAttribute('onclick');
        // Add fresh event listener
        leaveRecommendationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Leave recommendation button clicked");
            // Direct DOM manipulation instead of calling a function
            const form = document.getElementById('recommendationForm');
            const recommendations = document.getElementById('existingRecommendations');
            const successMsg = document.getElementById('recommendationSuccessMessage');
            
            if (form) form.style.display = 'block';
            if (recommendations) recommendations.style.display = 'none';
            if (successMsg) successMsg.style.display = 'none';
            
            // Scroll to form
            if (form) form.scrollIntoView({behavior: 'smooth', block: 'start'});
        });
    }

    if (viewRecommendationsBtn) {
        console.log("Found view recommendations button");
        // Remove any existing onclick attribute
        viewRecommendationsBtn.removeAttribute('onclick');
        // Add fresh event listener
        viewRecommendationsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("View recommendations button clicked");
            // Direct DOM manipulation
            const form = document.getElementById('recommendationForm');
            const recommendations = document.getElementById('existingRecommendations');
            
            if (form) form.style.display = 'none';
            if (recommendations) {
                recommendations.style.display = 'block';
                recommendations.scrollIntoView({behavior: 'smooth', block: 'start'});
                // Fetch the latest approved recommendations
                fetchApprovedRecommendations();
            }
        });
    }

    // 2. Fix for project card hover effect - replace your existing project card code
    // IMPORTANT: Remove or comment out any other project card initialization code
    const allProjectCards = document.querySelectorAll('.project-card');
    console.log("Found", allProjectCards.length, "project cards");

    allProjectCards.forEach(card => {
        // Get the description
        const description = card.querySelector('p');
        if (!description) {
            console.warn("No description paragraph found in project card");
            return;
        }
        
        // Initially hide descriptions
        description.style.display = 'none';
        
        // Desktop hover
        card.addEventListener('mouseenter', function() {
            console.log("Project card hover enter");
            description.style.display = 'block';
        });
        
        card.addEventListener('mouseleave', function() {
            console.log("Project card hover leave");
            // Only hide if not active (for mobile)
            if (!this.classList.contains('active')) {
                description.style.display = 'none';
            }
        });
        
        // Mobile tap
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                console.log("Project card clicked (mobile)");
                this.classList.toggle('active');
                
                if (this.classList.contains('active')) {
                    description.style.display = 'block';
                } else {
                    description.style.display = 'none';
                }
            }
        });
    });

    // Function to fetch approved recommendations from Google Sheet
    function fetchApprovedRecommendations() {
        console.log("Fetching approved recommendations");
        
        const recommendationsContainer = document.getElementById('recommendationsList');
        if (!recommendationsContainer) {
            console.error("Recommendations container not found");
            return;
        }
        
        // Show loading indicator
        recommendationsContainer.innerHTML = '<div class="loading-spinner">Loading recommendations...</div>';
        
        // Fetch approved recommendations from Google Sheet API
        fetch(`${GOOGLE_SHEET_API_URL}?action=getApproved`)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.recommendations && data.recommendations.length > 0) {
                    // Clear loading indicator
                    recommendationsContainer.innerHTML = '';
                    
                    // Display each recommendation
                    data.recommendations.forEach(recommendation => {
                        const card = document.createElement('div');
                        card.className = 'recommendation-card';
                        
                        const html = `
                            <div class="recommendation-header">
                                <h4>${recommendation.firstName} ${recommendation.lastName}</h4>
                                <p class="job-title">${recommendation.jobRole} at ${recommendation.company}</p>
                                <p class="relation">${capitalizeFirstLetter(recommendation.relation)}</p>
                            </div>
                            <div class="recommendation-content">
                                <p>"${recommendation.text}"</p>
                            </div>
                        `;
                        
                        card.innerHTML = html;
                        recommendationsContainer.appendChild(card);
                    });
                } else {
                    // No recommendations or error
                    recommendationsContainer.innerHTML = `
                        <div class="no-recommendations">
                            <p>${translations[currentLanguage]['recommendations-none'] || 'No recommendations found.'}</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error("Error fetching recommendations:", error);
                recommendationsContainer.innerHTML = `
                    <div class="error-message">
                        <p>Error loading recommendations. Please try again later.</p>
                    </div>
                `;
            });
    }
});
