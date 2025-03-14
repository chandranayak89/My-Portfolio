// Add these variables at the top of your scripts.js file
// Replace with your actual Google Apps Script Web App URL
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwnbOnKUsOfXkL7xymSjLkRGP6BIeyot6PqekgSLhDsnY-x4Y0-poRQAhkLrIKyFhSRQQ/exec";

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
        var viewButton = document.querySelector('button[data-i18n="recommendations-view"]');
        
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

        // Add click handler to project cards for mobile devices
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function() {
                // Toggle active class to show/hide project details
                this.classList.toggle('active');
            });
        });

        // Add click handler to timeline items for mobile devices
        document.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', function() {
                // Toggle active class to show/hide experience details
                this.classList.toggle('active');
            });
        });
    }

    // Simplified direct solution for project descriptions
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const description = card.querySelector('p');
        
        // Ensure description is hidden initially
        if (description) {
            description.style.display = 'none';
        }
        
        // Add event listeners for hover
        card.addEventListener('mouseenter', function() {
            if (description) {
                description.style.display = 'block';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (description) {
                description.style.display = 'none';
            }
        });
        
        // For mobile devices
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                if (description.style.display === 'block') {
                    description.style.display = 'none';
                } else {
                    description.style.display = 'block';
                }
            }
        });
    });

    // New simpler approach for project card interaction
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        const projectCards = document.querySelectorAll('.project-card.hoverable');
        projectCards.forEach(card => {
            card.addEventListener('click', function() {
                // Toggle active class only on touch devices
                this.classList.toggle('active');
            });
        });
    }

    // Handle projects and timeline hover/tap
    const projectCards = document.querySelectorAll('.project-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Function to handle hover/tap for both project cards and timeline items
    function setupInteraction(elements) {
        elements.forEach(el => {
            // Get the details element
            const details = el.classList.contains('timeline-item') 
                ? el.querySelector('.timeline-content ul') 
                : el.querySelector('p');
                
            if (details) {
                // Force hide details initially
                details.style.display = 'none';
                
                // Desktop hover
                el.addEventListener('mouseenter', function() {
                    console.log('Mouse entered', el);
                    details.style.display = 'block';
                });
                
                el.addEventListener('mouseleave', function() {
                    console.log('Mouse left', el);
                    if (!el.classList.contains('active')) {
                        details.style.display = 'none';
                    }
                });
                
                // Mobile tap
                el.addEventListener('click', function() {
                    console.log('Clicked', el);
                    if (window.innerWidth <= 768) {
                        el.classList.toggle('active');
                        details.style.display = details.style.display === 'block' ? 'none' : 'block';
                    }
                });
            }
        });
    }
    
    // Setup interactions
    setupInteraction(projectCards);
    setupInteraction(timelineItems);

    // Add this function to your scripts.js file
    function setupTimelineInteraction() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            const details = item.querySelector('.experience-details');
            
            if (details) {
                // Force hide details initially
                details.style.display = 'none';
                
                // Desktop hover
                item.addEventListener('mouseenter', function() {
                    console.log('Timeline item entered');
                    details.style.display = 'block';
                });
                
                item.addEventListener('mouseleave', function() {
                    console.log('Timeline item left');
                    if (!this.classList.contains('active')) {
                        details.style.display = 'none';
                    }
                });
                
                // Mobile tap
                item.addEventListener('click', function() {
                    console.log('Timeline item clicked');
                    if (window.innerWidth <= 768) {
                        this.classList.toggle('active');
                        details.style.display = details.style.display === 'block' ? 'none' : 'block';
                    }
                });
            }
        });
    }

    // Call this function when the document is ready
    setupTimelineInteraction();

    // Initialize language
    updateLanguage(currentLanguage);
});
