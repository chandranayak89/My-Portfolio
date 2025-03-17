<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chandrashekhar Nayak | Software Testing & IT Security</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <nav id="navbar">
            <div class="container">
                <div class="logo">
                    <a href="#home">CN</a>
                </div>
                <ul class="nav-links">
                    <li><a href="#home" data-i18n="nav-home">Home</a></li>
                    <li><a href="#about" data-i18n="nav-about">About</a></li>
                    <li><a href="#experience" data-i18n="nav-experience">Experience</a></li>
                    <li><a href="#skills" data-i18n="nav-skills">Skills</a></li>
                    <li><a href="#projects" data-i18n="nav-projects">Projects</a></li>
                    <li><a href="#recommendations" data-i18n="nav-recommendations">Recommendations</a></li>
                    <li><a href="#contact" data-i18n="nav-contact">Contact</a></li>
                    <li class="nav-item dropdown">
                        <a href="#" class="language-selector" id="languageSelector">
                            <i class="fas fa-globe"></i> <span class="current-lang">EN</span>
                        </a>
                        <div class="language-dropdown" id="languageDropdown">
                            <a href="#" data-lang="en" class="lang-option" onclick="updateLanguage('en'); return false;">English</a>
                            <a href="#" data-lang="de" class="lang-option" onclick="updateLanguage('de'); return false;">Deutsch</a>
                        </div>
                    </li>
                </ul>
                <div class="hamburger">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </div>
        </nav>
    </header>

    <section id="home" class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>Chandrashekhar Nayak</h1>
                <h2 data-i18n="hero-title"> Software Testing & IT Security Specialist</h2>
                <p data-i18n="hero-description">Merging cybersecurity expertise with advanced testing methodologies for robust, secure software solutions.</p>
                <div class="hero-buttons">
                    <a href="#contact" class="btn btn-primary" data-i18n="hero-contact">Contact Me</a>
                    <a href="#projects" class="btn btn-secondary" data-i18n="hero-work">View My Work</a>
                </div>
                <div class="social-links">
                    <a href="https://bit.ly/4g3pLcL" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:chandrathod88@gmail.com"><i class="far fa-envelope"></i></a>
                    <a href="tel:+4917621241018"><i class="fas fa-phone"></i></a>
                </div>
            </div>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title" data-i18n="about-title">About Me</h2>
            <div class="about-content">
                <div class="about-image">
                    <img src="image.jpeg" alt="Chandrashekhar Nayak" class="profile-image">
                </div>
                <div class="about-text">
                    <p data-i18n="about-description">I am a dedicated IT Security and Software Testing professional with expertise spanning from penetration testing to quality assurance. With a background in mechanical engineering and a specialization in informatics and robotics, I bring a unique perspective to software security and testing challenges.</p>
                    
                    <div class="education">
                        <h3 data-i18n="about-education">Education</h3>
                        <div class="education-item">
                            <h4 data-i18n="about-ms-title">Master of Science in Mechanical Engineering</h4>
                            <p data-i18n="about-ms-details">Karlsruhe, Germany | 2022 - 2026 (expected)</p>
                            <p data-i18n="about-ms-specialization">Specialization: Informatics and Robotics</p>
                        </div>
                        <div class="education-item">
                            <h4 data-i18n="about-bs-title">Bachelor of Engineering in Mechanical Engineering</h4>
                            <p data-i18n="about-bs-details">India | 2013 - 2017</p>
                        </div>
                    </div>
                    
                    <div class="certifications">
                        <h3 data-i18n="about-certifications">Certifications</h3>
                        <ul>
                            <li data-i18n="about-cert-1">Google Cybersecurity Certificate</li>
                            <li data-i18n="about-cert-2">Google Data Science Certificate</li>
                        </ul>
                    </div>
                    
                    <div class="languages">
                        <h3 data-i18n="about-languages">Languages</h3>
                        <ul>
                            <li data-i18n="about-lang-1">German: intermediate level</li>
                            <li data-i18n="about-lang-2">English: Business Fluent</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="experience" class="experience">
        <div class="container">
            <h2 class="section-title" data-i18n="exp-title">Professional Experience</h2>
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h3 data-i18n="exp-1-title">Werkstudent – Software Testing & IT-Security</h3>
                        <h4 data-i18n="exp-1-company">Atlas Copco | Bretten</h4>
                        <p class="timeline-date" data-i18n="exp-1-date">April 2024 – März 2025</p>
                        <ul class="experience-details">
                            <li data-i18n="exp-1-detail-1">Development of test automation solutions to ensure software quality</li>
                            <li data-i18n="exp-1-detail-2">Implementation of CI/CD processes with Jenkins, Docker, </li>
                            <li data-i18n="exp-1-detail-3">Security analysis and implementation of protection measures according to IT security standards</li>
                            <li data-i18n="exp-1-detail-4">Conducting adaptive and integration tests for robtic applications</li>
                            <li data-i18n="exp-1-detail-5">crash test or fuzz tesing for reverse engineering</li>
                        </ul>
                    </div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h3 data-i18n="exp-2-title">Research Assistant – Software Development & Testing</h3>
                        <h4 data-i18n="exp-2-company">Karlsruher Institut für Technologie (KIT) | Karlsruhe</h4>
                        <p class="timeline-date" data-i18n="exp-2-date">July 2022 – June 2023</p>
                        <ul class="experience-details">
                            <li data-i18n="exp-2-detail-1">Development of machine learning models with Python, PostgreSQL, Linux, and PyTorch</li>
                            <li data-i18n="exp-2-detail-2">Implementation of automated test processes to optimize software quality</li>
                            <li data-i18n="exp-2-detail-3">Experience with continuous integration and test automation</li>
                            <li data-i18n="exp-2-detail-4">Documentation and analysis of test results for traceability</li>
                            <li data-i18n="exp-2-detail-5">Maintenance of Jenkins pipelines for test automation</li>
                        </ul>
                    </div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h3 data-i18n="exp-3-title">Information Security Analyst, Penetration Testing & Software Testing</h3>
                        <h4 data-i18n="exp-3-company">Prosaic Technologies Pvt Ltd | Bangalore, India</h4>
                        <p class="timeline-date" data-i18n="exp-3-date">Juli 2017 – März 2020</p>
                        <ul class="experience-details">
                            <li data-i18n="exp-3-detail-1">Security analysis and risk assessments according to IEC 62443</li>
                            <li data-i18n="exp-3-detail-2">Development and implementation of protection measures such as authentication, encryption, and intrusion detection systems</li>
                            <li data-i18n="exp-3-detail-3">Automation of security processes with Python and shell scripts</li>
                            <li data-i18n="exp-3-detail-4">Implementation of threat models and penetration testing</li>
                            <li data-i18n="exp-3-detail-5">Development of secure software architectures</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title" data-i18n="skills-title">Technical Skills</h2>
            <div class="skills-categories">
                <div class="skill-category">
                    <h3 data-i18n="skills-cat-1">IT Security & Data Protection</h3>
                    <div class="skill-items">
                        <div class="skill-item">IEC 62443</div>
                        <div class="skill-item">SIEM</div>
                        <div class="skill-item">IDS/IPS</div>
                        <div class="skill-item">Firewall</div>
                        <div class="skill-item">Threat Hunting</div>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h3 data-i18n="skills-cat-2">Software Testing</h3>
                    <div class="skill-items">
                        <div class="skill-item">Jenkins</div>
                        <div class="skill-item">Jira</div>
                        <div class="skill-item">Git</div>
                        <div class="skill-item">DOORS</div>
                        <div class="skill-item">Test Automation</div>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h3 data-i18n="skills-cat-3">Programming & Development</h3>
                    <div class="skill-items">
                        <div class="skill-item">Python</div>
                        <div class="skill-item">C++</div>
                        <div class="skill-item">Shell Scripting</div>
                        <div class="skill-item">javascript</div>
                        <div class="skill-item">Docker</div>
                        <div class="skill-item">Kubernetes</div>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h3 data-i18n="skills-cat-4">Web & Data</h3>
                    <div class="skill-items">
                        <div class="skill-item">React</div>
                        <div class="skill-item">HTML</div>
                        <div class="skill-item">CSS</div>
                        <div class="skill-item">XML</div>
                        <div class="skill-item">PostgreSQL</div>
                        <div class="skill-item">Data Analytics</div>
                    </div>
                </div>
                
                <div class="skill-category">
                    <h3 data-i18n="skills-cat-5">Methodologies</h3>
                    <div class="skill-items">
                        <div class="skill-item">Agile</div>
                        <div class="skill-item">Scrum</div>
                        <div class="skill-item">CI/CD</div>
                        <div class="skill-item">UX Design</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title" data-i18n="projects-title">Featured Projects</h2>
            <p class="section-subtitle" data-i18n="projects-subtitle">A selection of my professional work and academic projects</p>
            
            <div class="projects-grid">
                <!-- Project 1 -->
                <div class="project-card">
                    <div class="project-image">
                        <img src="place-holder image" alt="Project Image">
                    </div>
                    <div class="project-content">
                        <h3 data-i18n="project-1-title">Your Project Title</h3>
                        <p data-i18n="project-1-description">Detailed description of your project and your role.</p>
                        <div class="project-tech">
                            <span>Technology 1</span>
                            <span>Technology 2</span>
                        </div>
                    </div>
                </div>
                
                <!-- Project 2 -->
                <div class="project-card">
                    <div class="project-image">
                        <div class="placeholder-project">
                            <i class="fas fa-robot"></i>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 data-i18n="project-2-title">ML-Based Test Automation</h3>
                        <p class="project-details" data-i18n="project-2-description">
                            • Predictive Test Case Failure Analysis – Developed machine learning models to predict potential test case failures, reducing redundant executions and improving test efficiency.<br><br>
                            
                            • Optimized Test Execution Sequences – Implemented an intelligent scheduling algorithm to prioritize test cases based on failure probability and execution impact.<br><br>
                            
                            • Data-Driven Decision Making – Analyzed historical test results and logs to extract meaningful patterns and improve overall test strategy.<br><br>
                            
                            • Feature Engineering for Test Optimization – Engineered relevant features from test logs, execution times, and code changes to enhance model accuracy.<br><br>
                            
                            • Integration with CI/CD Pipelines – Integrated ML-powered test automation into CI/CD workflows, ensuring faster feedback loops and continuous quality assurance.
                        </p>
                        <div class="project-tech">
                            <span>Python</span>
                            <span>PyTorch</span>
                            <span>Jenkins</span>
                        </div>
                    </div>
                </div>
                
                <!-- Project 3 -->
                <div class="project-card hoverable">
                    <div class="project-image">
                        <div class="placeholder-project">
                            <i class="fas fa-code-branch"></i>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 data-i18n="project-3-title">CI/CD Pipeline for Security Testing</h3>
                        <div class="project-description">
                            <p data-i18n="project-3-description">
                                • Automated Security Scanning – Integrated static (SAST) and dynamic (DAST) security testing tools into the CI/CD pipeline to identify vulnerabilities early.<br><br>
                                
                                • Container Security Assessment – Implemented container image scanning (e.g., Trivy, Anchore) to detect misconfigurations and vulnerabilities in Docker images.<br><br>
                                
                                • Dependency Vulnerability Management – Configured automated dependency checks using tools like OWASP Dependency-Check and Snyk to prevent security flaws in third-party libraries.<br><br>
                                
                                • Compliance and Policy Enforcement – Enforced security policies and compliance checks (e.g., OWASP Top 10, CIS benchmarks) as part of the automated workflow.<br><br>
                                
                                • Secure Deployment Strategies – Ensured secure software releases by incorporating automated security gates, preventing deployments with critical vulnerabilities.
                            </p>
                        </div>
                        <div class="project-tech">
                            <span>Jenkins</span>
                            <span>Docker</span>
                            <span>Kubernetes</span>
                        </div>
                    </div>
                </div>
                
                <!-- Project 4 -->
                <div class="project-card hoverable">
                    <div class="project-image">
                        <div class="placeholder-project">
                            <i class="fas fa-lock"></i>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3 data-i18n="project-4-title">Intrusion Detection System</h3>
                        <div class="project-description">
                            <p data-i18n="project-4-description">
                                • Real-Time Threat Detection – Designed an IDS capable of detecting cyber threats in railway networks in real-time, ensuring quick response and mitigation.<br><br>
                                
                                • Anomaly-Based and Signature-Based Detection – Implemented a hybrid approach combining anomaly detection (ML models) and signature-based methods for comprehensive threat coverage.<br><br>
                                
                                • Network Traffic Analysis – Monitored and analyzed railway communication protocols to detect suspicious activities and potential cyberattacks.<br><br>
                                
                                • Lightweight and Scalable Architecture – Optimized the IDS to work efficiently on resource-constrained railway systems without compromising performance.<br><br>
                                
                                • Integration with Security Information and Event Management (SIEM) – Forwarded detected threats to SIEM platforms for centralized monitoring and incident response.
                            </p>
                        </div>
                        <div class="project-tech">
                            <span>Python</span>
                            <span>SIEM</span>
                            <span>Network Security</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="recommendations" class="recommendations">
        <div class="container">
            <h2 class="section-title" data-i18n="recommendations-title">Recommendations</h2>
            <p class="section-subtitle" data-i18n="recommendations-subtitle">What colleagues and clients say about my work</p>
            
            <div class="recommendations-buttons">
                <button class="btn btn-primary" onclick="showRecommendationForm()" data-i18n="recommendations-leave">Leave a Recommendation</button>
                <button class="btn btn-secondary" onclick="showExistingRecommendations()" data-i18n="recommendations-view">View Recommendations</button>
            </div>
            
            <!-- Find the recommendation form section and update it -->
            <div id="recommendationForm" class="recommendation-form" style="display: none;">
                <h3 data-i18n="recommendations-form-title">Share Your Experience</h3>
                <form id="newRecommendationForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="recommenderFirstName" data-i18n="recommendations-form-firstname">First Name</label>
                            <input type="text" id="recommenderFirstName" name="recommenderFirstName" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="recommenderLastName" data-i18n="recommendations-form-lastname">Last Name</label>
                            <input type="text" id="recommenderLastName" name="recommenderLastName" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="recommenderCompany" data-i18n="recommendations-form-company">Company Name</label>
                            <input type="text" id="recommenderCompany" name="recommenderCompany" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="recommenderJobRole" data-i18n="recommendations-form-jobrole">Job Role</label>
                            <input type="text" id="recommenderJobRole" name="recommenderJobRole" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="recommenderRelation" data-i18n="recommendations-form-relation">Relationship</label>
                        <select id="recommenderRelation" name="recommenderRelation" required>
                            <option value="" data-i18n="recommendations-form-select">Select...</option>
                            <option value="colleague" data-i18n="recommendations-form-colleague">Colleague</option>
                            <option value="client" data-i18n="recommendations-form-client">Client</option>
                            <option value="manager" data-i18n="recommendations-form-manager">Manager</option>
                            <option value="other" data-i18n="recommendations-form-other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="recommendationText" data-i18n="recommendations-form-message">Your Recommendation</label>
                        <textarea id="recommendationText" name="recommendationText" rows="5" required></textarea>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="btn btn-primary" data-i18n="recommendations-form-submit">Submit Recommendation</button>
                        <button type="button" class="btn btn-secondary" onclick="hideRecommendationForm()" data-i18n="recommendations-form-cancel">Cancel</button>
                    </div>
                </form>
                
                <!-- Success message -->
                <div id="recommendationSuccessMessage" class="success-message" style="display: none;">
                    <i class="fas fa-check-circle"></i>
                    <h3 data-i18n="recommendations-success-title">Thank you for your recommendation!</h3>
                    <p data-i18n="recommendations-success-message">I appreciate you taking the time to share your experience.</p>
                </div>
            </div>
            
            <!-- Existing Recommendations (initially hidden) -->
            <div id="existingRecommendations" class="existing-recommendations" style="display: none;">
                <h3 data-i18n="recommendations-list-title">What People Say</h3>
                
                <div class="recommendations-list">
                    <!-- Recommendation 1 -->
                    <div class="recommendation-card">
                        <div class="recommendation-content">
                            <p class="recommendation-text">"Chandrashekhar demonstrated exceptional software testing skills during our collaboration. His attention to detail and ability to identify critical security vulnerabilities saved our project from potential issues."</p>
                            <div class="recommender-info">
                                <h4>Dr. Martin Schmidt</h4>
                                <p>Senior Researcher, Karlsruhe Institute of Technology</p>
                                <span class="recommendation-type">Colleague</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recommendation 2 -->
                    <div class="recommendation-card">
                        <div class="recommendation-content">
                            <p class="recommendation-text">"Working with Chandrashekhar on our security testing projects was a pleasure. His technical knowledge combined with excellent communication skills made complex security concepts accessible to our entire team."</p>
                            <div class="recommender-info">
                                <h4>Lisa Wagner</h4>
                                <p>Project Manager, Atlas Copco</p>
                                <span class="recommendation-type">Manager</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Add more recommendation cards as needed -->
                </div>
                
                <button class="btn btn-secondary back-button" onclick="hideExistingRecommendations()" data-i18n="recommendations-back">Back</button>
            </div>
        </div>
    </section>

    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title" data-i18n="contact-title">Get In Touch</h2>
            <p class="section-subtitle" data-i18n="contact-subtitle">Have a project in mind or interested in my services? Let's connect!</p>
            
            <div class="contact-content">
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <h3 data-i18n="contact-location">Location</h3>
                            <p>Edisonstrasse 33, Zuffenhausen-Frauensteg<br>70439, Stuttgart, Germany</p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <h3 data-i18n="contact-email">Email</h3>
                            <p><a href="mailto:chandrathod88@gmail.com">chandrathod88@gmail.com</a></p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <div>
                            <h3 data-i18n="contact-phone">Phone</h3>
                            <p><a href="tel:+4917621241018">+49 176 2124 1018</a></p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <i class="fab fa-linkedin"></i>
                        <div>
                            <h3 data-i18n="contact-linkedin">LinkedIn</h3>
                            <p><a href="https://bit.ly/4g3pLcL" target="_blank">linkedin.com/in/chandrashekhar-nayak</a></p>
                        </div>
                    </div>
                </div>
                <!-- Replace your current contact form with this -->
                <div class="contact-form">
                    <form id="contactForm">
                        <div class="form-group">
                            <label for="name" data-i18n="contact-form-name">Name</label>
                            <input type="text" id="name" name="name" data-i18n-placeholder="contact-form-name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email" data-i18n="contact-form-email">Email</label>
                            <input type="email" id="email" name="email" data-i18n-placeholder="contact-form-email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="subject" data-i18n="contact-form-subject">Subject</label>
                            <input type="text" id="subject" name="subject" data-i18n-placeholder="contact-form-subject" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="message" data-i18n="contact-form-message">Message</label>
                            <textarea id="message" name="message" rows="5" data-i18n-placeholder="contact-form-message" required></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" data-i18n="contact-form-submit">Send Message</button>
                    </form>
                    
                    <!-- Success message (hidden by default) -->
                    <div id="successMessage" class="success-message" style="display: none;">
                        <i class="fas fa-check-circle"></i>
                        <h3 data-i18n="contact-success-title">Thank you for your message!</h3>
                        <p data-i18n="contact-success-message">I will get back to you as soon as possible.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <h3>Chandrashekhar Nayak</h3>
                    <p data-i18n="footer-title">Software Testing & IT Security Professional</p>
                </div>
                
                <div class="footer-links">
                    <a href="#home" data-i18n="nav-home">Home</a>
                    <a href="#about" data-i18n="nav-about">About</a>
                    <a href="#experience" data-i18n="nav-experience">Experience</a>
                    <a href="#skills" data-i18n="nav-skills">Skills</a>
                    <a href="#projects" data-i18n="nav-projects">Projects</a>
                    <a href="#recommendations" data-i18n="nav-recommendations">Recommendations</a>
                    <a href="#contact" data-i18n="nav-contact">Contact</a>
                </div>
                
                <div class="footer-social">
                    <a href="https://bit.ly/4g3pLcL" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:chandrathod88@gmail.com"><i class="far fa-envelope"></i></a>
                    <a href="tel:+4917621241018"><i class="fas fa-phone"></i></a>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p data-i18n="footer-copyright">&copy; 2024 Chandrashekhar Nayak. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script src="translations.js"></script>
    <script src="scripts.js"></script>
</body>
</html>
