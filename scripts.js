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

    // Update this function to fix hover/tap functionality for all devices
    function setupUniversalTouchInteraction() {
        console.log("Setting up universal touch interaction for all devices");
        
        // First, remove any existing event listeners that might conflict
        const projectCards = document.querySelectorAll('.project-card');
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        // Clear existing event listeners (by cloning and replacing elements)
        projectCards.forEach(card => {
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
        });
        
        timelineItems.forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });
        
        // Get fresh references after replacing
        const freshProjectCards = document.querySelectorAll('.project-card');
        const freshTimelineItems = document.querySelectorAll('.timeline-item');
        
        console.log(`Found ${freshProjectCards.length} project cards and ${freshTimelineItems.length} timeline items`);
        
        // Project cards interaction
        freshProjectCards.forEach(card => {
            const description = card.querySelector('p');
            if (description) {
                console.log("Setting up project card:", card.textContent.substring(0, 20) + "...");
                
                // Force descriptions to be initially visible then hidden by JS
                // This ensures content exists for screen readers even when hidden
                description.style.display = 'none';
                
                // Desktop hover events
                card.addEventListener('mouseenter', function() {
                    console.log("Project card hover enter");
                    description.style.display = 'block';
                });
                
                card.addEventListener('mouseleave', function() {
                    console.log("Project card hover leave");
                    if (!this.classList.contains('active')) {
                        description.style.display = 'none';
                    }
                });
                
                // Universal click/tap for all devices
                card.addEventListener('click', function(e) {
                    console.log("Project card clicked/tapped");
                    // For mobile devices or touch screens
                    if (isTouchDevice()) {
                        e.preventDefault();
                        this.classList.toggle('active');
                        
                        if (this.classList.contains('active')) {
                            description.style.display = 'block';
                        } else {
                            description.style.display = 'none';
                        }
                    }
                });
            }
        });
        
        // Timeline items interaction - similar approach
        freshTimelineItems.forEach(item => {
            // Try different selectors to find details
            const details = item.querySelector('.experience-details') || 
                            item.querySelector('.timeline-content ul') ||
                            item.querySelector('.timeline-content p:not(:first-child)');
            
            if (details) {
                console.log("Setting up timeline item:", item.textContent.substring(0, 20) + "...");
                
                // Force details to be initially hidden
                details.style.display = 'none';
                
                // Desktop hover
                item.addEventListener('mouseenter', function() {
                    console.log("Timeline item hover enter");
                    details.style.display = 'block';
                });
                
                item.addEventListener('mouseleave', function() {
                    console.log("Timeline item hover leave");
                    if (!this.classList.contains('active')) {
                        details.style.display = 'none';
                    }
                });
                
                // Universal click for all devices
                item.addEventListener('click', function(e) {
                    console.log("Timeline item clicked/tapped");
                    // For mobile devices
                    if (isTouchDevice()) {
                        e.preventDefault();
                        this.classList.toggle('active');
                        
                        if (this.classList.contains('active')) {
                            details.style.display = 'block';
                        } else {
                            details.style.display = 'none';
                        }
                    }
                });
            } else {
                console.warn("No details found in timeline item:", item);
            }
        });
        
        console.log("Universal interaction setup complete");
    }

    // Call our updated interaction setup function
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
        
        // First, try to find the correct container
        const recommendationsContainer = document.getElementById('recommendationsList');
        if (!recommendationsContainer) {
            console.error("Recommendations container not found - looking for element with id 'recommendationsList'");
            // Let's try to find any possible container
            const existingRecommendations = document.getElementById('existingRecommendations');
            if (existingRecommendations) {
                console.log("Found fallback container", existingRecommendations);
                // Create the list container if it doesn't exist
                if (!existingRecommendations.querySelector('#recommendationsList')) {
                    const listDiv = document.createElement('div');
                    listDiv.id = 'recommendationsList';
                    existingRecommendations.appendChild(listDiv);
                    console.log("Created missing recommendationsList container");
                }
            } else {
                console.error("No recommendation containers found at all!");
                return;
            }
        }
        
        // Try again after potential creation
        const container = document.getElementById('recommendationsList');
        if (!container) return;
        
        // Show loading indicator
        container.innerHTML = '<div class="loading-spinner">Loading recommendations...</div>';
        
        // Log the URL we're fetching from
        const fetchUrl = `${GOOGLE_SHEET_API_URL}?action=getApproved`;
        console.log("Fetching from URL:", fetchUrl);
        
        // Fetch approved recommendations from Google Sheet API
        fetch(fetchUrl)
            .then(response => {
                console.log("Received response:", response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Received data:", data);
                
                if (data.success && data.recommendations && data.recommendations.length > 0) {
                    // Clear loading indicator
                    container.innerHTML = '';
                    
                    console.log(`Displaying ${data.recommendations.length} recommendations`);
                    
                    // Display each recommendation
                    data.recommendations.forEach((recommendation, index) => {
                        console.log(`Processing recommendation ${index}:`, recommendation);
                        
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
                        container.appendChild(card);
                    });
                } else {
                    // No recommendations or error
                    container.innerHTML = `
                        <div class="no-recommendations">
                            <p>${translations[currentLanguage]['recommendations-none'] || 'No recommendations found. Be the first to leave a recommendation!'}</p>
                        </div>
                    `;
                    console.log("No recommendations found or success=false in response");
                }
            })
            .catch(error => {
                console.error("Error fetching recommendations:", error);
                container.innerHTML = `
                    <div class="error-message">
                        <p>Error loading recommendations. Please try again later.</p>
                        <p class="error-details">${error.message}</p>
                    </div>
                `;
            });
    }

    // Special function to fix project cards with proper CSS class handling
    function fixProjectCards() {
        console.log("Applying comprehensive fix for project cards");
        
        // Get all project cards
        const projectCards = document.querySelectorAll('.project-card');
        console.log(`Found ${projectCards.length} project cards to fix`);
        
        projectCards.forEach((card, index) => {
            // First find the description using various selectors to be flexible
            const description = 
                card.querySelector('.project-description') || 
                card.querySelector('p') || 
                card.querySelector('.description') ||
                card.querySelector('.card-content');
            
            if (description) {
                console.log(`Found description in card ${index}:`, description);
                
                // Add proper description class if missing
                if (!description.classList.contains('project-description')) {
                    description.classList.add('project-description');
                }
                
                // Force initial state - hide description
                description.style.display = 'none';
                
                // Remove and re-establish event listeners
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
                
                // Get fresh description reference
                const freshDescription = 
                    newCard.querySelector('.project-description') || 
                    newCard.querySelector('p');
                    
                if (!freshDescription) {
                    console.error(`Could not find description after cloning card ${index}`);
                    return;
                }
                
                // Desktop hover events
                newCard.addEventListener('mouseenter', function() {
                    console.log(`Project card ${index} hovered`);
                    freshDescription.style.display = 'block';
                });
                
                newCard.addEventListener('mouseleave', function() {
                    console.log(`Project card ${index} hover ended`);
                    if (!this.classList.contains('active')) {
                        freshDescription.style.display = 'none';
                    }
                });
                
                // Mobile tap events
                newCard.addEventListener('click', function(e) {
                    console.log(`Project card ${index} clicked/tapped`);
                    if (isTouchDevice() || window.innerWidth <= 768) {
                        e.preventDefault();
                        this.classList.toggle('active');
                        
                        if (this.classList.contains('active')) {
                            freshDescription.style.display = 'block';
                        } else {
                            freshDescription.style.display = 'none';
                        }
                    }
                });
                
                // Add hover/tap indicator if not present
                if (!newCard.querySelector('.hover-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'hover-indicator';
                    indicator.textContent = isTouchDevice() ? 'Tap for details' : 'Hover for details';
                    indicator.style.fontSize = '0.8rem';
                    indicator.style.color = 'var(--primary-color, #0066cc)';
                    indicator.style.textAlign = 'center';
                    indicator.style.marginTop = '10px';
                    
                    // Find a good place to insert it
                    const content = newCard.querySelector('.project-content') || newCard;
                    content.appendChild(indicator);
                }
            } else {
                console.error(`No description found in project card ${index}`);
            }
        });
        
        // Add CSS for project cards if not already present
        if (!document.getElementById('project-card-styles')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'project-card-styles';
            styleEl.textContent = `
                .project-card {
                    position: relative;
                    border: 2px solid transparent;
                    border-radius: var(--border-radius, 8px);
                    background-color: white;
                    box-shadow: var(--shadow, 0 4px 6px rgba(0,0,0,0.1));
                    transition: all 0.3s ease;
                    overflow: hidden;
                }
                
                .project-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary-color, #0066cc);
                    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
                }
                
                .project-description {
                    display: none;
                    padding: 10px 0;
                }
                
                .project-card:hover .project-description {
                    display: block;
                }
                
                .project-card:hover .hover-indicator {
                    display: none;
                }
                
                .project-card.active .hover-indicator {
                    display: none;
                }
                
                .project-card.active .project-description {
                    display: block;
                }
            `;
            document.head.appendChild(styleEl);
        }
        
        console.log("Project card fix applied");
    }

    // Call this in the DOMContentLoaded event
    document.addEventListener('DOMContentLoaded', function() {
        // ... existing code ...
        
        // Call our updated interaction setup function
        setupUniversalTouchInteraction();
        
        // Add the special project card fix
        fixProjectCards();
        
        // ... existing code ...
    });

    // Direct fix for project cards - place this at the end of your file
    (function() {
        // Wait for full page load to ensure all elements exist
        window.addEventListener('load', function() {
            console.log("🔍 DIRECT PROJECT CARD FIX - STARTING");
            
            // Get all project cards by class name
            const cards = document.getElementsByClassName('project-card');
            console.log(`📋 Found ${cards.length} project cards`);
            
            // Log the first card's HTML structure to diagnose
            if (cards.length > 0) {
                console.log("📄 First card HTML structure:", cards[0].innerHTML);
            }
            
            // Function to fix each card
            function fixCard(card) {
                // Remove all existing event listeners by cloning
                const clone = card.cloneNode(true);
                card.parentNode.replaceChild(clone, card);
                
                // Find ALL paragraphs in the card
                const paragraphs = clone.getElementsByTagName('p');
                console.log(`📝 Found ${paragraphs.length} paragraphs in card`);
                
                // Process each paragraph - try to find the description
                let description = null;
                for (let i = 0; i < paragraphs.length; i++) {
                    const p = paragraphs[i];
                    // Skip very short paragraphs (likely not descriptions)
                    if (p.textContent.trim().length > 20) {
                        description = p;
                        console.log(`✅ Found description paragraph: "${p.textContent.substring(0, 30)}..."`);
                        break;
                    }
                }
                
                // If no paragraph found, try divs with description class
                if (!description) {
                    description = clone.querySelector('.project-description, .description, .card-description');
                    if (description) console.log("✅ Found description via class selector");
                }
                
                // If still not found, try any div in the card content
                if (!description) {
                    const content = clone.querySelector('.project-content, .card-content');
                    if (content) {
                        const divs = content.getElementsByTagName('div');
                        if (divs.length > 0) {
                            description = divs[0];
                            console.log("✅ Found description via content div");
                        }
                    }
                }
                
                // Apply fix if description found
                if (description) {
                    // Force hide initially with !important
                    description.style.cssText = "display: none !important;";
                    
                    // Add hover effect with direct inline styles
                    clone.onmouseenter = function() {
                        console.log("🖱️ Mouse entered card");
                        description.style.cssText = "display: block !important;";
                    };
                    
                    clone.onmouseleave = function() {
                        console.log("🖱️ Mouse left card");
                        description.style.cssText = "display: none !important;";
                    };
                    
                    // Add visible indicator
                    const indicator = document.createElement('div');
                    indicator.style.cssText = "font-size: 12px; color: blue; text-align: center; margin-top: 5px;";
                    indicator.textContent = "Hover to see details";
                    clone.appendChild(indicator);
                    
                    clone.onmouseenter = function() {
                        description.style.cssText = "display: block !important;";
                        indicator.style.display = "none";
                    };
                    
                    clone.onmouseleave = function() {
                        description.style.cssText = "display: none !important;";
                        indicator.style.display = "block";
                    };
                    
                    return true;
                } else {
                    console.log("❌ No description found in this card");
                    return false;
                }
            }
            
            // Process all cards
            let successes = 0;
            for (let i = 0; i < cards.length; i++) {
                console.log(`🔄 Processing card ${i+1}/${cards.length}`);
                if (fixCard(cards[i])) {
                    successes++;
                }
            }
            
            console.log(`✅ Successfully fixed ${successes}/${cards.length} project cards`);
            
            // Add emergency CSS override
            const css = document.createElement("style");
            css.innerHTML = `
                .project-card p, .project-card .project-description {
                    display: none !important;
                }
                .project-card:hover p, .project-card:hover .project-description {
                    display: block !important;
                }
            `;
            document.head.appendChild(css);
            console.log("🎨 Emergency CSS fix added");
        });
    })();
});
