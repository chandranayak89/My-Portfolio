// Add these variables at the top of your scripts.js file
// Replace with your actual Google Apps Script Web App URL
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbzy7T56oZp2bgLiA3-9XDFP0uZQxyygzUixFHY1tAhSezk10nXAuglC5iD_FLv0qpL0FQ/exec";

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

    // Improved fetch function that handles the direct JSON response format from your script
    function fetchApprovedRecommendations() {
        console.log("🔄 FETCHING APPROVED RECOMMENDATIONS - STARTED");
        
        // Get the container
        const container = document.getElementById('recommendationsList') || 
                         document.querySelector('#existingRecommendations > div') ||
                         document.getElementById('existingRecommendations');
        
        if (!container) {
            console.error("❌ No recommendation container found");
            return;
        }
        
        // Show loading indicator
        container.innerHTML = '<div class="loading-spinner">Loading recommendations...</div>';
        
        // Generate a unique timestamp to prevent caching
        const timestamp = new Date().getTime();
        const fetchUrl = `${GOOGLE_SHEET_API_URL}?nocache=${timestamp}`;
        
        console.log("🌐 Fetching recommendations from:", fetchUrl);
        
        // Fetch the recommendations with cache-busting
        fetch(fetchUrl, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        })
        .then(response => {
            console.log("📥 Response status:", response.status);
            if (!response.ok) {
                throw new Error(`Network response error: ${response.status}`);
            }
            return response.json();
        })
        .then(recommendations => {
            console.log("📊 Received recommendations:", recommendations);
            
            if (recommendations && recommendations.length > 0) {
                // Clear the container
                container.innerHTML = '';
                
                // Display each recommendation
                recommendations.forEach((recommendation, index) => {
                    console.log(`📝 Processing recommendation ${index+1}:`, recommendation);
                    
                    const card = document.createElement('div');
                    card.className = 'recommendation-card';
                    
                    // Helper function to safely display text
                    const safeText = (text) => text || '';
                    
                    // Format the relation with first letter capitalized
                    const formatRelation = (relation) => {
                        return relation ? relation.charAt(0).toUpperCase() + relation.slice(1) : '';
                    };
                    
                    // Create HTML for the card
                    const html = `
                        <div class="recommendation-header">
                            <h4>${safeText(recommendation.firstName)} ${safeText(recommendation.lastName)}</h4>
                            <p class="job-title">${safeText(recommendation.jobRole)} at ${safeText(recommendation.company)}</p>
                            <p class="relation">${formatRelation(recommendation.relation)}</p>
                        </div>
                        <div class="recommendation-content">
                            <p>"${safeText(recommendation.text)}"</p>
                        </div>
                    `;
                    
                    card.innerHTML = html;
                    container.appendChild(card);
                });
                
                console.log(`✅ Successfully displayed ${recommendations.length} recommendations`);
            } else {
                // No recommendations found
                container.innerHTML = `
                    <div class="no-recommendations">
                        <p>No recommendations found. Be the first to leave a recommendation!</p>
                    </div>
                `;
                console.log("ℹ️ No recommendations found in the response");
            }
        })
        .catch(error => {
            console.error("❌ Error fetching recommendations:", error);
            container.innerHTML = `
                <div class="error-message">
                    <p>Error loading recommendations: ${error.message}</p>
                </div>
            `;
        });
    }

    // Set up the view recommendations button
    document.addEventListener('DOMContentLoaded', function() {
        console.log("🔄 Setting up recommendation buttons");
        
        const viewBtn = document.querySelector('button[data-i18n="recommendations-view"]');
        if (viewBtn) {
            // Remove existing listeners
            const newViewBtn = viewBtn.cloneNode(true);
            viewBtn.parentNode.replaceChild(newViewBtn, viewBtn);
            
            // Add fresh listener
            newViewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("👆 View recommendations button clicked");
                
                // Show the recommendations section
                const form = document.getElementById('recommendationForm');
                const recommendations = document.getElementById('existingRecommendations');
                
                if (form) form.style.display = 'none';
                if (recommendations) {
                    recommendations.style.display = 'block';
                    recommendations.scrollIntoView({behavior: 'smooth'});
                    
                    // Fetch fresh recommendations
                    fetchApprovedRecommendations();
                }
            });
            
            console.log("✅ View recommendations button setup complete");
        }
    });

    // Final solution for project cards - place at the end of your file
    (function() {
        // Execute when DOM is fully loaded
        window.addEventListener('load', function() {
            console.log("🔄 FINAL PROJECT CARD FIX - EXECUTING");
            
            // 1. Add emergency CSS that addresses height issues and uses !important
            const css = document.createElement("style");
            css.id = "emergency-project-card-fix";
            css.innerHTML = `
                .project-card {
                    position: relative !important;
                    min-height: 200px !important;
                    height: auto !important;
                    display: flex !important;
                    flex-direction: column !important;
                    cursor: pointer !important;
                    overflow: visible !important;
                    transition: all 0.3s ease !important;
                }
                
                .project-card:hover {
                    transform: translateY(-5px) !important;
                    border-color: var(--primary-color, #0066cc) !important;
                    box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2) !important;
                    z-index: 10 !important;
                }
                
                .project-card p, 
                .project-card .project-description,
                .project-card div[class*="description"] {
                    display: none !important;
                    opacity: 0 !important;
                    transition: opacity 0.3s ease !important;
                    max-height: none !important;
                    overflow: visible !important;
                }
                
                .project-card:hover p, 
                .project-card:hover .project-description,
                .project-card:hover div[class*="description"],
                .project-card.active p,
                .project-card.active .project-description,
                .project-card.active div[class*="description"] {
                    display: block !important;
                    opacity: 1 !important;
                }
                
                @media (max-width: 768px) {
                    .project-card .hover-indicator:after {
                        content: "Tap for details" !important;
                        display: block !important;
                        font-size: 0.8rem !important;
                        color: var(--primary-color, #0066cc) !important;
                        text-align: center !important;
                        margin-top: 10px !important;
                    }
                    
                    .project-card.active .hover-indicator:after,
                    .project-card:hover .hover-indicator:after {
                        display: none !important;
                    }
                }
            `;
            document.head.appendChild(css);
            console.log("🎨 Emergency CSS override applied");
            
            // 2. Process all project cards
            const projectCards = document.querySelectorAll('.project-card');
            console.log(`🔍 Found ${projectCards.length} project cards`);
            
            projectCards.forEach((card, index) => {
                // Remove existing event listeners
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
                
                // Try multiple ways to find the description content
                const description = 
                    newCard.querySelector('.project-description') || 
                    newCard.querySelector('p:not(:empty)') || 
                    newCard.querySelector('div[class*="description"]') ||
                    newCard.querySelector('.project-content > div:not(:first-child)');
                    
                if (description) {
                    console.log(`✅ Card ${index+1}: Found description element`);
                    
                    // Add hover indicator if not present
                    if (!newCard.querySelector('.hover-indicator')) {
                        const indicator = document.createElement('div');
                        indicator.className = 'hover-indicator';
                        newCard.appendChild(indicator);
                    }
                    
                    // Setup desktop hover events with direct style manipulation
                    newCard.addEventListener('mouseenter', function() {
                        description.style.display = 'block';
                        description.style.opacity = '1';
                        console.log(`🖱️ Mouse entered card ${index+1}`);
                    });
                    
                    newCard.addEventListener('mouseleave', function() {
                        if (!this.classList.contains('active')) {
                            description.style.display = 'none';
                            description.style.opacity = '0';
                        }
                        console.log(`🖱️ Mouse left card ${index+1}`);
                    });
                    
                    // Setup mobile tap events
                    newCard.addEventListener('click', function(e) {
                        if (window.innerWidth <= 768) {
                            this.classList.toggle('active');
                            
                            if (this.classList.contains('active')) {
                                description.style.display = 'block';
                                description.style.opacity = '1';
                            } else {
                                description.style.display = 'none';
                                description.style.opacity = '0';
                            }
                            console.log(`👆 Card ${index+1} tapped, active: ${this.classList.contains('active')}`);
                        }
                    });
                } else {
                    console.error(`❌ Card ${index+1}: No description found`);
                }
            });
            
            console.log("✅ Project cards fix complete - please check hover functionality now");
        });
    })();

    // HOVER-TO-REVEAL RECOMMENDATION SOLUTION
    (function() {
        console.log("🚀 Starting hover-to-reveal recommendation solution");
        
        // Get the correct API URL
        const API_URL = "https://script.google.com/macros/s/AKfycbzy7T56oZp2bgLiA3-9XDFP0uZQxyygzUixFHY1tAhSezk10nXAuglC5iD_FLv0qpL0FQ/exec";
        
        // Wait for page to be fully loaded
        window.addEventListener('load', function() {
            console.log("🔄 DOM fully loaded - setting up hover-to-reveal recommendations");
            
            // 1. Find view recommendations button
            let viewButton = null;
            document.querySelectorAll('button').forEach(button => {
                const text = button.textContent.toLowerCase().trim();
                if (text.includes('view') && text.includes('recommendation')) {
                    viewButton = button;
                }
            });
            
            if (!viewButton) {
                viewButton = document.querySelector('[data-i18n="recommendations-view"]');
            }
            
            if (viewButton) {
                console.log("✅ Found view recommendations button");
            } else {
                console.error("❌ Could not find view recommendations button");
                return;
            }
            
            // 2. Find recommendations container
            const existingRecommendations = document.getElementById('existingRecommendations');
            if (!existingRecommendations) {
                console.error("❌ Could not find existingRecommendations container");
                return;
            }
            
            // Create a dedicated container for the list if it doesn't exist
            let listContainer = document.getElementById('recommendationsList');
            if (!listContainer) {
                listContainer = document.createElement('div');
                listContainer.id = 'recommendationsList';
                existingRecommendations.appendChild(listContainer);
                console.log("✅ Created new recommendationsList container");
            }
            
            // 3. Add CSS for hover-to-reveal effect
            const style = document.createElement('style');
            style.textContent = `
                .recommendation-card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 15px;
                    background: white;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    position: relative;
                    overflow: hidden;
                    cursor: pointer;
                }
                
                .recommendation-card:hover,
                .recommendation-card:focus-within {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
                    border-color: var(--primary-color, #0066cc);
                }
                
                .recommendation-card .recommendation-header {
                    position: relative;
                    z-index: 2;
                }
                
                .recommendation-card .recommendation-header h4 {
                    margin: 0 0 5px 0;
                    color: var(--primary-color, #0066cc);
                }
                
                .recommendation-card .recommendation-header p {
                    margin: 0 0 5px 0;
                    color: #666;
                }
                
                .recommendation-card .recommendation-header .relation {
                    font-style: italic;
                }
                
                .recommendation-card .recommendation-content {
                    height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: all 0.4s ease;
                    margin-top: 0;
                    position: relative;
                    z-index: 1;
                }
                
                .recommendation-card:hover .recommendation-content,
                .recommendation-card:focus-within .recommendation-content {
                    height: auto;
                    opacity: 1;
                    margin-top: 15px;
                }
                
                .recommendation-card::after {
                    content: "Hover to see recommendation";
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    font-size: 12px;
                    color: #999;
                    font-style: italic;
                    transition: opacity 0.3s ease;
                }
                
                .recommendation-card:hover::after,
                .recommendation-card:focus-within::after {
                    opacity: 0;
                }
                
                /* Remove any default/template cards */
                .recommendation-card.template-card {
                    display: none !important;
                }
                
                /* Responsive adjustments for mobile */
                @media (max-width: 768px) {
                    .recommendation-card::after {
                        content: "Tap to see recommendation";
                    }
                    
                    .recommendation-card.active .recommendation-content {
                        height: auto;
                        opacity: 1;
                        margin-top: 15px;
                    }
                    
                    .recommendation-card.active::after {
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            console.log("✅ Added hover-to-reveal styles for recommendation cards");
            
            // 4. Function to fetch and display recommendations
            function fetchAndDisplayRecommendations() {
                console.log("🔄 Fetching recommendations from Google Sheets");
                
                // Show loading message
                listContainer.innerHTML = '<div style="text-align:center;padding:20px;">Loading recommendations...</div>';
                
                // Generate timestamp for cache busting
                const timestamp = new Date().getTime();
                
                // First, find and hide any hardcoded cards 
                removeHardcodedCards();
                
                // Make the fetch request
                fetch(`${API_URL}?t=${timestamp}`)
                    .then(response => {
                        console.log(`📥 Server response: ${response.status} ${response.statusText}`);
                        if (!response.ok) {
                            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                        }
                        return response.text();
                    })
                    .then(text => {
                        // Log the raw response for debugging
                        console.log(`📄 Raw server response: ${text.substring(0, 100)}...`);
                        
                        // Try to parse the response
                        try {
                            const data = JSON.parse(text);
                            
                            if (Array.isArray(data)) {
                                console.log(`✅ Successfully parsed ${data.length} recommendations`);
                                displayRecommendations(data);
                            } else {
                                console.error("❌ Response is not an array:", data);
                                listContainer.innerHTML = '<div style="color:red;padding:20px;">Invalid data format returned from server</div>';
                            }
                        } catch (e) {
                            console.error("❌ JSON parse error:", e);
                            listContainer.innerHTML = `<div style="color:red;padding:20px;">Error parsing data from server: ${e.message}</div>`;
                        }
                    })
                    .catch(error => {
                        console.error("❌ Fetch error:", error);
                        listContainer.innerHTML = `<div style="color:red;padding:20px;">Error loading recommendations: ${error.message}</div>`;
                    });
            }
            
            // Function to remove hardcoded Lisa Wagner and Dr. Martin Schmidt cards
            function removeHardcodedCards() {
                console.log("🔍 Looking for hardcoded recommendation cards to remove");
                
                // Find all existing recommendation cards
                const existingCards = existingRecommendations.querySelectorAll('.recommendation-card');
                
                existingCards.forEach(card => {
                    // Check if this is one of the hardcoded cards
                    const cardText = card.textContent.toLowerCase();
                    if (cardText.includes('lisa wagner') || 
                        cardText.includes('martin schmidt') || 
                        cardText.includes('template')) {
                        
                        // Mark the card as a template so CSS can hide it
                        card.classList.add('template-card');
                        console.log("🗑️ Marked hardcoded card for removal:", cardText.substring(0, 20) + "...");
                    }
                });
            }
            
            // 5. Function to display recommendations
            function displayRecommendations(recommendations) {
                if (!recommendations || recommendations.length === 0) {
                    listContainer.innerHTML = '<div style="text-align:center;padding:20px;">No recommendations found</div>';
                    return;
                }
                
                // Clear the container
                listContainer.innerHTML = '';
                
                // Create each recommendation card
                recommendations.forEach((rec, index) => {
                    console.log(`Creating card for ${rec.firstName} ${rec.lastName}`);
                    
                    const card = document.createElement('div');
                    card.className = 'recommendation-card';
                    card.tabIndex = 0; // Make focusable for keyboard accessibility
                    
                    // Helper for null/undefined values
                    const safe = text => text || '';
                    
                    card.innerHTML = `
                        <div class="recommendation-header">
                            <h4>${safe(rec.firstName)} ${safe(rec.lastName)}</h4>
                            <p class="job-title">${safe(rec.jobRole)} at ${safe(rec.company)}</p>
                            <p class="relation">${safe(rec.relation)}</p>
                        </div>
                        <div class="recommendation-content">
                            <p>"${safe(rec.text)}"</p>
                        </div>
                    `;
                    
                    // For mobile: toggle active class on click
                    card.addEventListener('click', function() {
                        if (window.innerWidth <= 768) {
                            this.classList.toggle('active');
                        }
                    });
                    
                    // Add to container
                    listContainer.appendChild(card);
                });
                
                console.log(`✅ Successfully displayed ${recommendations.length} recommendations with hover-to-reveal effect`);
            }
            
            // 6. Set up button click event
            const newButton = viewButton.cloneNode(true);
            viewButton.parentNode.replaceChild(newButton, viewButton);
            
            newButton.addEventListener('click', function(event) {
                event.preventDefault();
                console.log("👆 View recommendations button clicked");
                
                // Show recommendations section
                existingRecommendations.style.display = 'block';
                
                // Hide form if it exists
                const form = document.getElementById('recommendationForm');
                if (form) form.style.display = 'none';
                
                // Remove hardcoded cards and fetch new ones
                fetchAndDisplayRecommendations();
                
                // Scroll to recommendations
                existingRecommendations.scrollIntoView({behavior: 'smooth', block: 'start'});
            });
            
            console.log("✅ Set up click handler for view recommendations button");
            
            // 7. Add a debug button for direct testing
            const debugButton = document.createElement('button');
            debugButton.textContent = "Refresh Recommendations";
            debugButton.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:9999;padding:8px 16px;background:#007bff;color:white;border:none;border-radius:4px;';
            debugButton.addEventListener('click', fetchAndDisplayRecommendations);
            document.body.appendChild(debugButton);
            
            console.log("✅ Hover-to-reveal recommendation solution setup complete");
        });
    })();
});
