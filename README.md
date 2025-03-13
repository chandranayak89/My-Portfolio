# My-Portfolio


# Professional Portfolio Website

A modern, responsive portfolio website designed for software testing and IT security professionals. This portfolio template is built with clean, semantic HTML5, CSS3, and vanilla JavaScript.

## Overview

This portfolio is designed to showcase your professional experience, technical skills, and projects in an elegant, user-friendly interface. It features a responsive design that works across all devices and includes interactive elements to engage visitors.

![Portfolio Preview](portfolio-preview.png)

## Features

- **Responsive Design**: Fully responsive layout that adapts to all screen sizes
- **Modern UI/UX**: Clean and professional design with smooth animations
- **Interactive Elements**: Animated navigation, skill badges, and project cards
- **Contact Form**: Functional contact form with validation
- **SEO-Friendly**: Semantic HTML structure and optimized for search engines
- **Cross-Browser Compatible**: Works on all modern browsers
- **Optimized Performance**: Fast loading times with optimized code

## Project Structure

```
portfolio/
├── index.html         # Main HTML file
├── styles.css         # CSS styles
├── scripts.js         # JavaScript functionality
├── images/            # Directory for images
│   ├── hero-bg.jpg    # Hero section background
│   └── profile.jpg    # Profile photo
├── resume.pdf         # Downloadable resume (optional)
└── README.md          # Documentation
```

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts

## Installation and Setup

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd portfolio
   ```

3. **Open the project**
   You can open the files in your preferred code editor to make customizations, or directly open the `index.html` file in a browser to view the portfolio.

## Customization Guide

### 1. Personal Information

Update your personal information in the `index.html` file:

- Name, title, and contact information
- About section text
- Education and certification details
- Work experience entries

### 2. Projects

Replace the placeholder projects with your own work:

- Add project titles, descriptions, and technologies used
- Include project screenshots in the `images` folder
- Link to live demos or GitHub repositories

### 3. Skills

Modify the skills section to reflect your expertise:

- Update skill categories and individual skills
- Adjust skill levels if using progress indicators

### 4. Visual Customization

Customize the visual aspects in `styles.css`:

- Color scheme (modify CSS variables at the top of the file)
- Typography (font families, sizes)
- Spacing and layout preferences

### 5. Contact Form

Set up the contact form functionality:

- Connect it to a backend service like Formspree, Netlify Forms, or your own server
- Update the form handling in `scripts.js`

## Deployment

You can deploy this portfolio to various hosting platforms:

- **GitHub Pages**: Perfect for a simple, free hosting solution
- **Netlify/Vercel**: Offers easy deployment from Git repositories with additional features
- **Traditional Web Hosting**: Upload the files via FTP to your hosting provider

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- Font Awesome for icons
- Google Fonts for typography
- Unsplash for placeholder images (if used)

## Contact

If you have any questions or feedback about this template, please contact:

Chandrashekhar Nayak  
Email: chandrathod88@gmail.com  

## Recommendation System Setup

The portfolio includes a recommendation collection and display system that uses Google Sheets as a backend to manage and approve recommendations. This allows visitors to submit recommendations, and you to review and approve them without editing code.

### Setting Up the Google Sheets Integration

1. **Create a Google Sheet**
   - Go to [Google Sheets](https://sheets.google.com/) and create a new spreadsheet
   - Name it "Portfolio Recommendations"
   - Set up the following columns in row 1:
     - A: First Name
     - B: Last Name
     - C: Company
     - D: Job Role
     - E: Relationship
     - F: Recommendation Text
     - G: Date Submitted
     - H: Status (Pending/Approved/Rejected)
     - I: ID (auto-generated)

2. **Set up Google Apps Script**
   - In your Google Sheet, go to **Extensions > Apps Script**
   - Replace any code with the following:

   ```javascript
   // Set up the web app
   function doGet(e) {
     return ContentService.createTextOutput(JSON.stringify(getApprovedRecommendations()))
       .setMimeType(ContentService.MimeType.JSON);
   }

   // Handle form submissions
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     
     // Prepare the data for the sheet
     var timestamp = new Date().toISOString();
     var id = Utilities.getUuid();
     
     // Add the new row
     sheet.appendRow([
       data.firstName,
       data.lastName,
       data.company,
       data.jobRole,
       data.relation,
       data.text,
       timestamp,
       "Pending",
       id
     ]);
     
     return ContentService.createTextOutput(JSON.stringify({
       result: 'success',
       id: id
     })).setMimeType(ContentService.MimeType.JSON);
   }

   // Get all approved recommendations
   function getApprovedRecommendations() {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = sheet.getDataRange().getValues();
     var recommendations = [];
     
     // Skip the header row (row 1)
     for (var i = 1; i < data.length; i++) {
       // Check if recommendation is approved
       if (data[i][7] === "Approved") {
         recommendations.push({
           firstName: data[i][0],
           lastName: data[i][1],
           company: data[i][2],
           jobRole: data[i][3],
           relation: data[i][4],
           text: data[i][5],
           date: data[i][6],
           id: data[i][8]
         });
       }
     }
     
     return recommendations;
   }
   ```

3. **Deploy the Apps Script**
   - Click **Deploy > New deployment**
   - Select **Web app** as the deployment type
   - Description: "Portfolio Recommendations API"
   - Execute as: "Me"
   - Who has access: "Anyone" (this allows your website to access the data)
   - Click **Deploy**
   - Copy the Web App URL

4. **Update your scripts.js file**
   - Find the line `const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";`
   - Replace `YOUR_SCRIPT_ID` with your actual script ID from the Web App URL

### Managing Recommendations

The system works as follows:

1. **Collection**: When someone submits a recommendation via your form, it:
   - Gets sent to your Google Sheet with a status of "Pending"
   - Gets added to the submitter's browser localStorage (only they can see it)
   - Sends you an email notification with the recommendation details

2. **Approval Process**:
   - Open your Google Sheet to see all submitted recommendations
   - Review each recommendation
   - In column H (Status), change "Pending" to "Approved" for recommendations you want to display
   - Change to "Rejected" for recommendations you don't want to display

3. **Display**:
   - Approved recommendations will automatically appear on your site for all visitors
   - Pending recommendations are only visible to the person who submitted them, with a "Pending Review" badge
   - Rejected recommendations won't be displayed to anyone

### Troubleshooting

- If recommendations aren't displaying, check:
  - Your Google Sheet URL is correctly set in scripts.js
  - Your Apps Script has been deployed as a web app
  - The recommendation has been marked as "Approved" in the Google Sheet

---
