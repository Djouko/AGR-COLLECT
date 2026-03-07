<!--
Copyright 2025 AGR-Collect
AGR-Guide - Guide d'utilisation complet
-->
<template>
  <div id="legal-guide" class="legal-page">
    <page-section>
      <template #heading>
        <span>{{ $t('title') }}</span>
      </template>
      <template #body>
        <div class="legal-content guide-content">
          <p class="legal-intro">{{ $t('intro') }}</p>

          <!-- TABLE OF CONTENTS -->
          <div class="guide-toc">
            <h4>{{ $t('toc') }}</h4>
            <ol>
              <li v-for="(item, i) in $tm('tocItems')" :key="i"><a :href="'#guide-section-' + (i+1)">{{ item }}</a></li>
            </ol>
          </div>

          <!-- 1. GETTING STARTED -->
          <h3 id="guide-section-1"><span class="section-number">1</span><span class="icon-check-circle"></span> {{ $t('start.title') }}</h3>
          <p>{{ $t('start.p1') }}</p>
          <div class="step-list">
            <div v-for="(step, i) in $tm('start.steps')" :key="i" class="step-item">
              <span class="step-number">{{ i + 1 }}</span>
              <span>{{ step }}</span>
            </div>
          </div>
          <div class="tip-box">
            <span class="icon-lightbulb-o"></span>
            <div><strong>{{ $t('tip') }}</strong> {{ $t('start.tip') }}</div>
          </div>

          <!-- 2. USER ROLES -->
          <h3 id="guide-section-2"><span class="section-number">2</span><span class="icon-users"></span> {{ $t('roles.title') }}</h3>
          <p>{{ $t('roles.intro') }}</p>
          <div class="role-section">
            <h4>{{ $t('roles.admin.title') }}</h4>
            <p>{{ $t('roles.admin.description') }}</p>
            <ul>
              <li v-for="(item, index) in $tm('roles.admin.permissions')" :key="index">{{ item }}</li>
            </ul>
          </div>
          <div class="role-section">
            <h4>{{ $t('roles.agent.title') }}</h4>
            <p>{{ $t('roles.agent.description') }}</p>
            <ul>
              <li v-for="(item, index) in $tm('roles.agent.permissions')" :key="index">{{ item }}</li>
            </ul>
          </div>
          <div class="role-section">
            <h4>{{ $t('roles.sponsor.title') }}</h4>
            <p>{{ $t('roles.sponsor.description') }}</p>
            <ul>
              <li v-for="(item, index) in $tm('roles.sponsor.permissions')" :key="index">{{ item }}</li>
            </ul>
          </div>

          <!-- 3. WEB PLATFORM GUIDE -->
          <h3 id="guide-section-3"><span class="section-number">3</span><span class="icon-desktop"></span> {{ $t('web.title') }}</h3>
          <p>{{ $t('web.intro') }}</p>
          <div class="subsection" v-for="(sub, i) in ['login','projects','forms','users','submissions','sites']" :key="sub">
            <h4>3.{{ i+1 }}. {{ $t('web.' + sub + '.title') }}</h4>
            <p>{{ $t('web.' + sub + '.desc') }}</p>
            <div class="step-list compact">
              <div v-for="(step, j) in $tm('web.' + sub + '.steps')" :key="j" class="step-item">
                <span class="step-number small">{{ j + 1 }}</span>
                <span>{{ step }}</span>
              </div>
            </div>
          </div>
          <div class="tip-box">
            <span class="icon-lightbulb-o"></span>
            <div><strong>{{ $t('tip') }}</strong> {{ $t('web.tip') }}</div>
          </div>

          <!-- 4. MOBILE APP GUIDE -->
          <h3 id="guide-section-4"><span class="section-number">4</span><span class="icon-mobile"></span> {{ $t('mobile.title') }}</h3>
          <p>{{ $t('mobile.intro') }}</p>
          <div class="subsection" v-for="(sub, i) in ['install','download','fill','draft','send','offline']" :key="sub">
            <h4>4.{{ i+1 }}. {{ $t('mobile.' + sub + '.title') }}</h4>
            <p>{{ $t('mobile.' + sub + '.desc') }}</p>
            <div class="step-list compact">
              <div v-for="(step, j) in $tm('mobile.' + sub + '.steps')" :key="j" class="step-item">
                <span class="step-number small">{{ j + 1 }}</span>
                <span>{{ step }}</span>
              </div>
            </div>
          </div>
          <div class="tip-box">
            <span class="icon-lightbulb-o"></span>
            <div><strong>{{ $t('tip') }}</strong> {{ $t('mobile.tip') }}</div>
          </div>

          <!-- 5. SYNCHRONIZATION -->
          <h3 id="guide-section-5"><span class="section-number">5</span><span class="icon-cloud-upload"></span> {{ $t('sync.title') }}</h3>
          <p>{{ $t('sync.description') }}</p>
          <p>{{ $t('sync.detail') }}</p>
          <div class="status-legend">
            <div class="status-item">
              <span class="status-badge pending">{{ $t('sync.pending') }}</span>
              <span>{{ $t('sync.pendingDesc') }}</span>
            </div>
            <div class="status-item">
              <span class="status-badge synced">{{ $t('sync.synced') }}</span>
              <span>{{ $t('sync.syncedDesc') }}</span>
            </div>
            <div class="status-item">
              <span class="status-badge error">{{ $t('sync.error') }}</span>
              <span>{{ $t('sync.errorDesc') }}</span>
            </div>
          </div>
          <div class="tip-box">
            <span class="icon-lightbulb-o"></span>
            <div><strong>{{ $t('tip') }}</strong> {{ $t('sync.tip') }}</div>
          </div>

          <!-- 6. GEOLOCATION -->
          <h3 id="guide-section-6"><span class="section-number">6</span><span class="icon-map-marker"></span> {{ $t('gps.title') }}</h3>
          <p>{{ $t('gps.description') }}</p>
          <p>{{ $t('gps.detail') }}</p>
          <ul>
            <li v-for="(item, i) in $tm('gps.tips')" :key="i">{{ item }}</li>
          </ul>

          <!-- 7. REPORTS -->
          <h3 id="guide-section-7"><span class="section-number">7</span><span class="icon-file-text"></span> {{ $t('reports.title') }}</h3>
          <p>{{ $t('reports.description') }}</p>
          <p>{{ $t('reports.detail') }}</p>
          <ul>
            <li v-for="(item, i) in $tm('reports.features')" :key="i">{{ item }}</li>
          </ul>

          <!-- 8. FAQ -->
          <h3 id="guide-section-8"><span class="section-number">8</span><span class="icon-question-circle"></span> {{ $t('faq.title') }}</h3>
          <div class="faq-list">
            <div v-for="(item, i) in $tm('faq.items')" :key="i" class="faq-item">
              <h4 class="faq-question">{{ item.q }}</h4>
              <p class="faq-answer">{{ item.a }}</p>
            </div>
          </div>
          
          <p class="legal-footer">{{ $t('footer') }}</p>
        </div>
      </template>
    </page-section>
  </div>
</template>

<script>
import PageSection from '../page/section.vue';

export default {
  name: 'LegalGuide',
  components: { PageSection }
};
</script>

<style lang="scss">
.guide-content {
  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    
    span[class^="icon-"] {
      color: #2e7d32;
      font-size: 20px;
    }
    
    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: #2e7d32;
      color: #fff;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }
  }

  .guide-toc {
    background: #f0faf0;
    border: 1px solid #c8e6c9;
    border-radius: 8px;
    padding: 20px 24px;
    margin-bottom: 32px;

    h4 {
      margin: 0 0 12px;
      color: #2e7d32;
    }
    
    ol {
      margin: 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 6px;
        
        a {
          color: #2e7d32;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
  
  .role-section {
    margin-left: 20px;
    margin-bottom: 20px;
    padding: 16px 20px;
    background: #f8f9fa;
    border-left: 4px solid #2e7d32;
    border-radius: 0 8px 8px 0;
    
    h4 {
      color: #2e7d32;
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 16px;
    }
    
    ul {
      margin-bottom: 0;
    }
  }

  .subsection {
    margin-left: 12px;
    margin-bottom: 24px;
    padding-left: 16px;
    border-left: 2px solid #e0e0e0;

    h4 {
      color: #1b5e20;
      margin-top: 0;
      margin-bottom: 8px;
    }
  }

  .step-list {
    margin: 16px 0;

    &.compact {
      margin: 8px 0;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
      line-height: 1.6;

      .step-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 30px;
        height: 30px;
        background: #2e7d32;
        color: #fff;
        border-radius: 50%;
        font-size: 14px;
        font-weight: 700;
        flex-shrink: 0;

        &.small {
          min-width: 24px;
          height: 24px;
          font-size: 12px;
          background: #4caf50;
        }
      }
    }
  }

  .tip-box {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: #fff8e1;
    border: 1px solid #ffe082;
    border-radius: 8px;
    margin: 16px 0 28px;
    font-size: 14px;
    line-height: 1.6;

    .icon-lightbulb-o {
      color: #f9a825;
      font-size: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }
  }
  
  .status-legend {
    margin: 16px 0;
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      min-width: 100px;
      text-align: center;
      
      &.pending {
        background: #ffc107;
        color: #000;
      }
      
      &.synced {
        background: #2e7d32;
        color: #fff;
      }
      
      &.error {
        background: #dc3545;
        color: #fff;
      }
    }
  }

  .faq-list {
    margin: 16px 0;

    .faq-item {
      margin-bottom: 20px;
      padding: 16px 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #2e7d32;

      .faq-question {
        color: #1b5e20;
        margin: 0 0 8px;
        font-size: 15px;
      }

      .faq-answer {
        margin: 0;
        color: #374151;
        line-height: 1.7;
      }
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": "AGR-Guide - Complete User Guide",
    "intro": "Welcome to the AGR-Collect user guide. This comprehensive document will walk you through every feature of the platform, step by step. Whether you are an administrator, a field agent, or a sponsor, you will find precise instructions to make the most of AGR-Collect.",
    "toc": "Table of Contents",
    "tocItems": [
      "Getting Started",
      "User Roles & Permissions",
      "Web Platform Guide",
      "Mobile Application Guide",
      "Synchronization & Data Transfer",
      "Geolocation & GPS",
      "Reports & Data Analysis",
      "Frequently Asked Questions"
    ],
    "tip": "Tip:",
    "start": {
      "title": "Getting Started",
      "p1": "AGR-Collect is a complete field data collection platform developed for SAAHDEL. It consists of two main components: a web platform (for administrators and sponsors) and a mobile application (for field agents). Here is how to get started:",
      "steps": [
        "Obtain your login credentials from your administrator (email and password for web, or a QR code for mobile).",
        "For web access: Open your browser and navigate to the platform URL (e.g., https://your-domain.com). Log in with your email and password.",
        "For mobile access: Download AGR-Collect from the Google Play Store on your Android device. Open the app and scan the QR code provided by your administrator, or enter the server URL manually.",
        "Once logged in, explore the dashboard to familiarize yourself with the available features for your role.",
        "If you are an administrator, start by creating a project, uploading forms, and inviting users. If you are a field agent, download the forms assigned to you and begin collecting data."
      ],
      "tip": "Save your login credentials in a safe place. If you forget your password, contact your administrator to reset it. Never share your credentials with others."
    },
    "roles": {
      "title": "User Roles & Permissions",
      "intro": "AGR-Collect uses a role-based access system. Each role has specific permissions tailored to its responsibilities within the organization. Understanding your role will help you use the platform effectively.",
      "admin": {
        "title": "Administrator",
        "description": "The administrator is the main manager of the platform. They have full control over all features and are responsible for setting up the system, managing users, and overseeing data collection activities.",
        "permissions": [
          "Create, modify, and delete user accounts and assign roles to each user",
          "Create and manage projects, which are containers for forms, users, and data",
          "Upload, modify, publish, and archive data collection forms (XLSForm or XForm format)",
          "Register and manage collection sites with GPS coordinates, status tracking, and categorization",
          "View all submissions on a map, in a table, or download them as CSV/Excel files",
          "Generate summary reports with date filters and export them as PDF documents",
          "Configure app users (field agents) and generate QR codes for mobile app configuration",
          "Access detailed audit logs to track all actions performed on the platform"
        ]
      },
      "agent": {
        "title": "Field Agent",
        "description": "The field agent is the primary data collector. They use the mobile application to fill out forms, capture photos and GPS coordinates, and submit data from the field. Field agents can also work offline and synchronize data when connectivity is available.",
        "permissions": [
          "Download forms assigned to their project from the server",
          "Fill out data collection forms with text, numbers, photos, audio, and GPS coordinates",
          "Save forms as drafts and resume editing them later",
          "Finalize and send completed forms to the server",
          "Work offline — all data is stored locally and sent automatically when internet is available",
          "View their own submitted forms and track submission status",
          "Generate personal activity reports showing their collection statistics"
        ]
      },
      "sponsor": {
        "title": "Sponsor / Observer",
        "description": "The sponsor has read-only access to the platform for monitoring purposes. They can view reports, consult maps, and track the progress of field activities without modifying any data.",
        "permissions": [
          "View summary dashboards with key collection statistics",
          "Consult the interactive map showing all collection points and sites",
          "View submitted data in table format",
          "Export reports in PDF format for external sharing and presentations"
        ]
      }
    },
    "web": {
      "title": "Web Platform Guide",
      "intro": "The web platform is accessed through your browser. It provides administrators and sponsors with tools to manage projects, forms, users, sites, and submissions. Here is a detailed guide for each section.",
      "login": {
        "title": "Logging In & Dashboard",
        "desc": "Access the web platform by navigating to your server URL. Use your administrator-provided credentials to log in.",
        "steps": [
          "Open your browser (Chrome, Firefox, Edge, or Safari recommended) and go to your AGR-Collect URL.",
          "Enter your email address and password, then click \"Log In\".",
          "You will land on the Projects page — this is your main dashboard showing all available projects.",
          "Click on a project name to access its forms, submissions, users, and settings.",
          "Use the language selector (top right) to switch between French and English at any time."
        ]
      },
      "projects": {
        "title": "Managing Projects",
        "desc": "Projects are the top-level containers in AGR-Collect. Each project groups together related forms, users, and data.",
        "steps": [
          "From the Projects page, click \"New\" to create a new project. Give it a meaningful name (e.g., \"Water Survey 2025\").",
          "Once created, you can upload forms, invite users, and configure project settings.",
          "To modify a project, click on its name, then go to the \"Settings\" tab.",
          "You can archive or delete a project from its Settings page when it is no longer active."
        ]
      },
      "forms": {
        "title": "Managing Forms",
        "desc": "Forms define the questions and fields for data collection. AGR-Collect supports XLSForm (.xlsx) and XForm (.xml) formats.",
        "steps": [
          "Inside a project, click \"New\" to upload a new form. Select your XLSForm file (.xlsx) from your computer.",
          "The form will be created as a Draft. You can preview it using the web form viewer to check it before publishing.",
          "When satisfied, click \"Publish\" to make the form available for download by field agents.",
          "To update a form, go to the form page, create a new Draft with the updated file, preview it, then Publish it.",
          "To remove a form from use, set its state to \"Closing\" (no new submissions) or \"Closed\" (fully archived)."
        ]
      },
      "users": {
        "title": "Managing Users & App Users",
        "desc": "There are two types of users: Web Users (who log in to the web platform) and App Users (who connect via the mobile app).",
        "steps": [
          "To create a Web User: Go to \"Users\" in the top navigation, click \"Create User\", enter their email and assign a role.",
          "To create an App User: Inside a project, go to the \"App Users\" tab, click \"Create\", give it a display name.",
          "After creating an App User, a QR code is generated. Click the QR code icon to display it — field agents scan this QR to configure their mobile app.",
          "To manage form access for App Users, go to the \"Form Access\" tab and check which forms each App User can download.",
          "App Users can be revoked at any time from the App Users tab if they should no longer have access."
        ]
      },
      "submissions": {
        "title": "Viewing Submissions",
        "desc": "Submitted data can be viewed in multiple ways: as a table, on a map, or downloaded for analysis.",
        "steps": [
          "Inside a form, click the \"Submissions\" tab to view all submitted records in a table format.",
          "Click on any row to see the full submission details, including attached photos and GPS coordinates.",
          "Use the Map view to visualize all geolocated submissions on an interactive map. Click any point to see its details.",
          "To download data, use the export options available (CSV, Excel). The exported file includes all fields and metadata.",
          "Submissions can be reviewed (approved, rejected, or flagged) to track data quality."
        ]
      },
      "sites": {
        "title": "Managing Sites",
        "desc": "Sites represent physical collection locations (villages, health centers, schools, etc.) that can be registered and tracked on a map.",
        "steps": [
          "Go to the Sites section from the project or main navigation menu.",
          "Click \"New Site\" to register a site with a name, coordinates (latitude/longitude), status, and category.",
          "Use the Grid view for a visual overview of all sites with status badges, or the List view for a compact table.",
          "Switch to the Map view to see all sites plotted on an interactive map. Click any marker to view site details.",
          "Edit or delete a site by clicking on it in the grid or list view."
        ]
      },
      "tip": "Use the keyboard shortcut Ctrl+F (or Cmd+F on Mac) to quickly search within tables and lists. Bookmark your most-used project pages for quick access."
    },
    "mobile": {
      "title": "Mobile Application Guide",
      "intro": "The mobile application is designed for field agents to collect data on the ground, even without internet. Here is a complete guide for every feature of the app.",
      "install": {
        "title": "Installation & Configuration",
        "desc": "Install the app and connect it to your server in minutes.",
        "steps": [
          "Download \"AGR-Collect\" from the Google Play Store on your Android phone or tablet.",
          "Open the app. On the first launch screen, choose \"Configure with QR Code\" (recommended) or \"Manually enter project details\".",
          "If using QR code: Ask your administrator for the QR code, then point your camera at it. The app will configure automatically.",
          "If configuring manually: Enter the server URL (e.g., https://your-domain.com) and your credentials.",
          "Once connected, you will see the main menu with all available actions: fill forms, view drafts, send data, etc."
        ]
      },
      "download": {
        "title": "Downloading Forms",
        "desc": "Before collecting data, you need to download the forms from the server.",
        "steps": [
          "From the main menu, tap \"Get Blank Forms\" (or the download icon in grid view).",
          "The app will contact the server and display all forms available to your account.",
          "Select the forms you need (or tap \"Select All\"), then tap \"Get Selected\".",
          "The forms are now stored on your device and ready to use, even without internet."
        ]
      },
      "fill": {
        "title": "Filling Out a Form",
        "desc": "This is the core activity: collecting data in the field by answering form questions.",
        "steps": [
          "From the main menu, tap \"Fill Blank Form\" (or the pencil icon in grid view).",
          "Select the form you want to fill from the list. The form will open on the first question.",
          "Answer each question by entering text, selecting options, taking a photo, or capturing GPS coordinates as required.",
          "Swipe left or use the \"Next\" button to advance to the next question. Swipe right to go back.",
          "For GPS questions: Tap the location button, wait for the accuracy indicator to turn green (under 5 meters is ideal), then accept.",
          "For photo questions: Tap the camera button, take a clear photo, and confirm. Ensure good lighting.",
          "When you reach the end, choose \"Finalize\" to mark the form as ready for submission, or \"Save as Draft\" to continue later."
        ]
      },
      "draft": {
        "title": "Managing Drafts",
        "desc": "Drafts are partially completed forms that you can resume editing at any time.",
        "steps": [
          "From the main menu, tap \"Drafts\" to see all saved incomplete forms.",
          "Tap on a draft to resume filling it from where you left off.",
          "When the form is complete, finalize it — it will move to \"Ready to Send\".",
          "You can also delete unwanted drafts by long-pressing on them."
        ]
      },
      "send": {
        "title": "Sending Finalized Forms",
        "desc": "Once a form is finalized, it needs to be sent to the server for your administrator to review.",
        "steps": [
          "From the main menu, tap \"Ready to Send\" to see all finalized forms waiting to be submitted.",
          "Make sure you have an internet connection (Wi-Fi or mobile data).",
          "Tap \"Send All\" to submit all pending forms at once, or select specific forms to send.",
          "A green checkmark will appear next to each successfully sent form.",
          "Sent forms are automatically moved to \"View Sent Forms\" where you can review them."
        ]
      },
      "offline": {
        "title": "Working Offline",
        "desc": "AGR-Collect is designed to work in areas with limited or no internet connectivity.",
        "steps": [
          "Download your forms while you have internet — once on your device, they work without any connection.",
          "Fill out forms normally in the field, even with zero connectivity. All data is saved securely on your device.",
          "When you return to an area with internet, open the app and go to \"Ready to Send\".",
          "Tap \"Send All\" — all your finalized forms will be uploaded automatically.",
          "The app will retry sending automatically if the connection drops during upload."
        ]
      },
      "tip": "Always charge your phone fully before going to the field. Enable GPS before opening any geolocated form. Take clear, well-lit photos. Save your work as a draft regularly when filling long forms."
    },
    "sync": {
      "title": "Synchronization & Data Transfer",
      "description": "AGR-Collect uses a robust synchronization system to ensure your data is never lost. Data flows from the mobile app to the central server and is then available on the web platform.",
      "detail": "When a field agent finalizes and sends a form, the data is transmitted securely over HTTPS (encrypted) to the central server. If the connection is interrupted during transfer, the app will automatically retry. The server processes the data, extracts GPS coordinates, and makes the submission available for viewing on the web platform.",
      "pending": "Pending",
      "pendingDesc": "The form is finalized on the device, waiting for internet to send",
      "synced": "Synced",
      "syncedDesc": "Data has been successfully received and stored on the server",
      "error": "Error",
      "errorDesc": "Transmission failed — the app will retry automatically when connection is restored",
      "tip": "If you see submissions stuck in \"Pending\" status, check your internet connection and ensure your server URL is correct. You can also try sending forms one at a time."
    },
    "gps": {
      "title": "Geolocation & GPS",
      "description": "GPS geolocation is a core feature of AGR-Collect. Every submission can capture precise coordinates, which are then displayed on interactive maps on the web platform.",
      "detail": "For accurate GPS capture, follow these best practices:",
      "tips": [
        "Enable Location Services (GPS) on your device before opening a form. Go to Settings > Location and turn it on.",
        "When outdoors, wait for the GPS accuracy to reach at least 5 meters before accepting the coordinates. The accuracy indicator will show green when ready.",
        "Avoid capturing GPS indoors, under dense tree cover, or near tall buildings — these can reduce accuracy significantly.",
        "If GPS accuracy is poor (more than 10m), try moving to an open area and wait 30 seconds for the signal to stabilize.",
        "GPS coordinates are captured automatically and cannot be manually edited, ensuring data authenticity and traceability.",
        "On the web platform, all geolocated submissions appear on an interactive map where you can click markers to view details."
      ]
    },
    "reports": {
      "title": "Reports & Data Analysis",
      "description": "AGR-Collect provides reporting tools on both the web platform and the mobile application to help track collection progress and analyze data.",
      "detail": "Reports can be generated and filtered using multiple criteria:",
      "features": [
        "Filter by date range: View data collected today, this week, this month, or a custom date range.",
        "Filter by agent: See which field agents submitted data and how many forms each one completed.",
        "Filter by form: Analyze submissions for a specific form to track completion rates.",
        "Export to PDF: Generate professional PDF reports suitable for sharing with stakeholders and sponsors.",
        "Map visualization: View all geolocated submissions on an interactive map to identify coverage gaps.",
        "On mobile: Use the \"Generate Report\" feature from the main menu to see your personal collection statistics with date filters."
      ]
    },
    "faq": {
      "title": "Frequently Asked Questions",
      "items": [
        {
          "q": "I forgot my password. How do I reset it?",
          "a": "Contact your administrator. They can reset your password from the Users section of the web platform. For app users, the administrator can generate a new QR code."
        },
        {
          "q": "My forms are not appearing on the mobile app. What should I do?",
          "a": "Make sure you are connected to the internet, then go to \"Get Blank Forms\" and refresh the list. If forms still don't appear, check with your administrator that your App User has been granted access to the forms in the \"Form Access\" settings."
        },
        {
          "q": "Can I edit a form after I've submitted it?",
          "a": "Once a form is sent to the server, it cannot be edited from the mobile app. However, administrators can view and review submissions on the web platform. If you need to correct data, contact your administrator."
        },
        {
          "q": "What happens if I lose my phone with unsent data?",
          "a": "Unsent data is stored locally on the device. If the phone is lost, that data is unfortunately not recoverable. To minimize risk, send your finalized forms as soon as you have internet access. Consider sending data at the end of each working day."
        },
        {
          "q": "The GPS is not working or is very inaccurate. What can I do?",
          "a": "Make sure Location Services (GPS) are enabled in your phone settings. Go outdoors to an open area away from buildings and trees. Wait 30-60 seconds for the GPS signal to stabilize. If the problem persists, restart your phone and try again."
        },
        {
          "q": "How do I switch the app language to French?",
          "a": "The mobile app follows your phone's system language. Change your phone language to French in Settings > System > Language, and the app will switch automatically. On the web platform, use the language selector at the top right of the page."
        },
        {
          "q": "Can multiple agents use the same phone?",
          "a": "Yes, but it is recommended that each agent has their own device for traceability. If sharing a device, each agent should use their own App User account (QR code) to ensure submissions are correctly attributed."
        },
        {
          "q": "How much storage space does the app need?",
          "a": "The app itself requires about 50 MB. Each form with photos and GPS data typically uses 1-5 MB. For a field campaign of 500 submissions with photos, plan for approximately 1-2 GB of free storage on the device."
        }
      ]
    },
    "footer": "For additional assistance, contact the SAAHDEL support team at emmanueljuniordequa2{'@'}gmail.com or +237 690 624 051. We are available Monday to Friday, 8am to 5pm."
  },
  "fr": {
    "title": "AGR-Guide - Guide d'Utilisation Complet",
    "intro": "Bienvenue dans le guide d'utilisation d'AGR-Collect. Ce document complet vous accompagnera à travers chaque fonctionnalité de la plateforme, étape par étape. Que vous soyez administrateur, agent de terrain ou sponsor, vous trouverez ici des instructions précises pour exploiter pleinement AGR-Collect.",
    "toc": "Table des Matières",
    "tocItems": [
      "Démarrage Rapide",
      "Rôles Utilisateurs & Permissions",
      "Guide de la Plateforme Web",
      "Guide de l'Application Mobile",
      "Synchronisation & Transfert de Données",
      "Géolocalisation & GPS",
      "Rapports & Analyse de Données",
      "Questions Fréquentes"
    ],
    "tip": "Astuce :",
    "start": {
      "title": "Démarrage Rapide",
      "p1": "AGR-Collect est une plateforme complète de collecte de données terrain développée pour SAAHDEL. Elle se compose de deux éléments principaux : une plateforme web (pour les administrateurs et sponsors) et une application mobile (pour les agents de terrain). Voici comment démarrer :",
      "steps": [
        "Obtenez vos identifiants de connexion auprès de votre administrateur (email et mot de passe pour le web, ou un code QR pour le mobile).",
        "Pour l'accès web : Ouvrez votre navigateur et rendez-vous sur l'URL de la plateforme (ex : https://votre-domaine.com). Connectez-vous avec votre email et mot de passe.",
        "Pour l'accès mobile : Téléchargez AGR-Collect depuis le Google Play Store sur votre appareil Android. Ouvrez l'application et scannez le code QR fourni par votre administrateur, ou entrez l'URL du serveur manuellement.",
        "Une fois connecté, explorez le tableau de bord pour vous familiariser avec les fonctionnalités disponibles pour votre rôle.",
        "Si vous êtes administrateur, commencez par créer un projet, téléverser des formulaires et inviter des utilisateurs. Si vous êtes agent de terrain, téléchargez les formulaires qui vous sont assignés et commencez la collecte."
      ],
      "tip": "Conservez vos identifiants dans un endroit sûr. Si vous oubliez votre mot de passe, contactez votre administrateur pour le réinitialiser. Ne partagez jamais vos identifiants avec d'autres personnes."
    },
    "roles": {
      "title": "Rôles Utilisateurs & Permissions",
      "intro": "AGR-Collect utilise un système d'accès basé sur les rôles. Chaque rôle dispose de permissions spécifiques adaptées à ses responsabilités au sein de l'organisation. Comprendre votre rôle vous aidera à utiliser la plateforme efficacement.",
      "admin": {
        "title": "Administrateur",
        "description": "L'administrateur est le gestionnaire principal de la plateforme. Il a le contrôle total sur toutes les fonctionnalités et est responsable de la mise en place du système, de la gestion des utilisateurs et de la supervision des activités de collecte.",
        "permissions": [
          "Créer, modifier et supprimer des comptes utilisateurs et attribuer des rôles à chacun",
          "Créer et gérer des projets, qui regroupent formulaires, utilisateurs et données",
          "Téléverser, modifier, publier et archiver des formulaires de collecte (format XLSForm ou XForm)",
          "Enregistrer et gérer les sites de collecte avec coordonnées GPS, suivi de statut et catégorisation",
          "Visualiser toutes les soumissions sur une carte, dans un tableau ou les télécharger en CSV/Excel",
          "Générer des rapports de synthèse avec filtres par date et les exporter en PDF",
          "Configurer les utilisateurs mobile (agents de terrain) et générer des codes QR pour la configuration de l'app",
          "Accéder aux journaux d'audit détaillés pour tracer toutes les actions effectuées sur la plateforme"
        ]
      },
      "agent": {
        "title": "Agent de Terrain",
        "description": "L'agent de terrain est le principal collecteur de données. Il utilise l'application mobile pour remplir les formulaires, capturer des photos et coordonnées GPS, et soumettre les données depuis le terrain. Les agents peuvent travailler hors-ligne et synchroniser les données lorsque la connectivité est disponible.",
        "permissions": [
          "Télécharger les formulaires assignés à leur projet depuis le serveur",
          "Remplir les formulaires de collecte avec texte, nombres, photos, audio et coordonnées GPS",
          "Sauvegarder des formulaires comme brouillons et reprendre l'édition plus tard",
          "Finaliser et envoyer les formulaires complétés au serveur",
          "Travailler hors-ligne — toutes les données sont stockées localement et envoyées automatiquement quand internet est disponible",
          "Consulter leurs propres formulaires soumis et suivre le statut d'envoi",
          "Générer des rapports personnels d'activité montrant leurs statistiques de collecte"
        ]
      },
      "sponsor": {
        "title": "Sponsor / Observateur",
        "description": "Le sponsor a un accès en lecture seule à la plateforme pour le suivi des activités. Il peut consulter les rapports, la carte interactive et suivre la progression des activités de terrain sans modifier aucune donnée.",
        "permissions": [
          "Consulter les tableaux de bord avec les statistiques clés de collecte",
          "Consulter la carte interactive montrant tous les points de collecte et sites",
          "Visualiser les données soumises sous forme de tableau",
          "Exporter les rapports au format PDF pour partage externe et présentations"
        ]
      }
    },
    "web": {
      "title": "Guide de la Plateforme Web",
      "intro": "La plateforme web est accessible depuis votre navigateur. Elle fournit aux administrateurs et sponsors les outils pour gérer projets, formulaires, utilisateurs, sites et soumissions. Voici un guide détaillé pour chaque section.",
      "login": {
        "title": "Connexion & Tableau de Bord",
        "desc": "Accédez à la plateforme web en naviguant vers l'URL de votre serveur. Utilisez les identifiants fournis par votre administrateur.",
        "steps": [
          "Ouvrez votre navigateur (Chrome, Firefox, Edge ou Safari recommandé) et accédez à l'URL de votre AGR-Collect.",
          "Entrez votre adresse email et votre mot de passe, puis cliquez sur « Connexion ».",
          "Vous arriverez sur la page Projets — c'est votre tableau de bord principal montrant tous les projets disponibles.",
          "Cliquez sur le nom d'un projet pour accéder à ses formulaires, soumissions, utilisateurs et paramètres.",
          "Utilisez le sélecteur de langue (en haut à droite) pour basculer entre français et anglais à tout moment."
        ]
      },
      "projects": {
        "title": "Gestion des Projets",
        "desc": "Les projets sont les conteneurs de premier niveau dans AGR-Collect. Chaque projet regroupe des formulaires, des utilisateurs et des données liés.",
        "steps": [
          "Depuis la page Projets, cliquez sur « Nouveau » pour créer un projet. Donnez-lui un nom explicite (ex : « Enquête Eau 2025 »).",
          "Une fois créé, vous pouvez y téléverser des formulaires, inviter des utilisateurs et configurer les paramètres.",
          "Pour modifier un projet, cliquez sur son nom, puis allez dans l'onglet « Paramètres ».",
          "Vous pouvez archiver ou supprimer un projet depuis sa page Paramètres quand il n'est plus actif."
        ]
      },
      "forms": {
        "title": "Gestion des Formulaires",
        "desc": "Les formulaires définissent les questions et champs pour la collecte. AGR-Collect supporte les formats XLSForm (.xlsx) et XForm (.xml).",
        "steps": [
          "Dans un projet, cliquez sur « Nouveau » pour téléverser un formulaire. Sélectionnez votre fichier XLSForm (.xlsx) depuis votre ordinateur.",
          "Le formulaire sera créé en tant que Brouillon. Vous pouvez le prévisualiser pour le vérifier avant publication.",
          "Quand vous êtes satisfait, cliquez sur « Publier » pour rendre le formulaire disponible au téléchargement par les agents.",
          "Pour mettre à jour un formulaire, allez sur sa page, créez un nouveau Brouillon avec le fichier mis à jour, prévisualisez, puis Publiez.",
          "Pour retirer un formulaire, changez son état en « En fermeture » (plus de nouvelles soumissions) ou « Fermé » (archivé)."
        ]
      },
      "users": {
        "title": "Gestion des Utilisateurs & Utilisateurs Mobile",
        "desc": "Il existe deux types d'utilisateurs : les Utilisateurs Web (qui se connectent à la plateforme web) et les Utilisateurs Mobile (qui se connectent via l'application).",
        "steps": [
          "Pour créer un Utilisateur Web : Allez dans « Utilisateurs » dans la navigation, cliquez « Créer », entrez l'email et attribuez un rôle.",
          "Pour créer un Utilisateur Mobile : Dans un projet, allez dans l'onglet « Utilisateurs Mobile », cliquez « Créer », donnez un nom d'affichage.",
          "Après création d'un Utilisateur Mobile, un code QR est généré. Cliquez sur l'icône QR pour l'afficher — les agents le scannent pour configurer leur app.",
          "Pour gérer l'accès aux formulaires, allez dans l'onglet « Accès aux Formulaires » et cochez les formulaires que chaque utilisateur mobile peut télécharger.",
          "Les Utilisateurs Mobile peuvent être révoqués à tout moment depuis l'onglet correspondant s'ils ne doivent plus avoir accès."
        ]
      },
      "submissions": {
        "title": "Consultation des Soumissions",
        "desc": "Les données soumises peuvent être visualisées de plusieurs façons : en tableau, sur une carte, ou téléchargées pour analyse.",
        "steps": [
          "Dans un formulaire, cliquez sur l'onglet « Soumissions » pour voir tous les enregistrements sous forme de tableau.",
          "Cliquez sur une ligne pour voir les détails complets, y compris les photos jointes et les coordonnées GPS.",
          "Utilisez la vue Carte pour visualiser toutes les soumissions géolocalisées sur une carte interactive. Cliquez sur un point pour voir ses détails.",
          "Pour télécharger les données, utilisez les options d'export (CSV, Excel). Le fichier exporté inclut tous les champs et métadonnées.",
          "Les soumissions peuvent être révisées (approuvées, rejetées ou signalées) pour suivre la qualité des données."
        ]
      },
      "sites": {
        "title": "Gestion des Sites",
        "desc": "Les sites représentent les lieux physiques de collecte (villages, centres de santé, écoles, etc.) qui peuvent être enregistrés et suivis sur une carte.",
        "steps": [
          "Accédez à la section Sites depuis le menu de navigation du projet.",
          "Cliquez « Nouveau Site » pour enregistrer un site avec nom, coordonnées (latitude/longitude), statut et catégorie.",
          "Utilisez la vue Grille pour un aperçu visuel de tous les sites avec badges de statut, ou la vue Liste pour un tableau compact.",
          "Passez à la vue Carte pour voir tous les sites sur une carte interactive. Cliquez sur un marqueur pour voir les détails du site.",
          "Modifiez ou supprimez un site en cliquant dessus dans la vue grille ou liste."
        ]
      },
      "tip": "Utilisez le raccourci clavier Ctrl+F (ou Cmd+F sur Mac) pour rechercher rapidement dans les tableaux et listes. Ajoutez en favoris les pages de projet que vous utilisez le plus souvent."
    },
    "mobile": {
      "title": "Guide de l'Application Mobile",
      "intro": "L'application mobile est conçue pour permettre aux agents de terrain de collecter des données sur le terrain, même sans internet. Voici un guide complet pour chaque fonctionnalité de l'application.",
      "install": {
        "title": "Installation & Configuration",
        "desc": "Installez l'application et connectez-la à votre serveur en quelques minutes.",
        "steps": [
          "Téléchargez « AGR-Collect » depuis le Google Play Store sur votre téléphone ou tablette Android.",
          "Ouvrez l'application. Sur l'écran de premier lancement, choisissez « Configurer avec Code QR » (recommandé) ou « Saisir manuellement ».",
          "Si vous utilisez le code QR : Demandez le code QR à votre administrateur, puis pointez votre caméra dessus. L'app se configurera automatiquement.",
          "Si vous configurez manuellement : Entrez l'URL du serveur (ex : https://votre-domaine.com) et vos identifiants.",
          "Une fois connecté, vous verrez le menu principal avec toutes les actions : remplir formulaires, voir brouillons, envoyer données, etc."
        ]
      },
      "download": {
        "title": "Téléchargement des Formulaires",
        "desc": "Avant de collecter des données, vous devez télécharger les formulaires depuis le serveur.",
        "steps": [
          "Depuis le menu principal, appuyez sur « Télécharger formulaire » (ou l'icône de téléchargement en vue grille).",
          "L'application contactera le serveur et affichera tous les formulaires disponibles pour votre compte.",
          "Sélectionnez les formulaires dont vous avez besoin (ou « Tout sélectionner »), puis appuyez sur « Télécharger ».",
          "Les formulaires sont maintenant stockés sur votre appareil et prêts à l'emploi, même sans internet."
        ]
      },
      "fill": {
        "title": "Remplir un Formulaire",
        "desc": "C'est l'activité principale : collecter des données sur le terrain en répondant aux questions du formulaire.",
        "steps": [
          "Depuis le menu principal, appuyez sur « Remplir un formulaire » (ou l'icône crayon en vue grille).",
          "Sélectionnez le formulaire à remplir dans la liste. Le formulaire s'ouvrira sur la première question.",
          "Répondez à chaque question en saisissant du texte, en sélectionnant des options, en prenant une photo ou en capturant les coordonnées GPS selon les besoins.",
          "Glissez vers la gauche ou utilisez le bouton « Suivant » pour passer à la question suivante. Glissez à droite pour revenir.",
          "Pour les questions GPS : Appuyez sur le bouton de localisation, attendez que l'indicateur de précision passe au vert (moins de 5 mètres idéalement), puis acceptez.",
          "Pour les questions photo : Appuyez sur le bouton appareil photo, prenez une photo claire et confirmez. Assurez-vous d'un bon éclairage.",
          "À la fin, choisissez « Finaliser » pour marquer le formulaire comme prêt à envoyer, ou « Enregistrer comme brouillon » pour continuer plus tard."
        ]
      },
      "draft": {
        "title": "Gestion des Brouillons",
        "desc": "Les brouillons sont des formulaires partiellement remplis que vous pouvez reprendre à tout moment.",
        "steps": [
          "Depuis le menu principal, appuyez sur « Brouillons » pour voir tous les formulaires incomplets sauvegardés.",
          "Appuyez sur un brouillon pour reprendre le remplissage là où vous vous êtes arrêté.",
          "Quand le formulaire est complet, finalisez-le — il sera déplacé vers « Prêt à envoyer ».",
          "Vous pouvez aussi supprimer des brouillons non désirés en appuyant longuement dessus."
        ]
      },
      "send": {
        "title": "Envoi des Formulaires Finalisés",
        "desc": "Une fois un formulaire finalisé, il doit être envoyé au serveur pour que votre administrateur puisse le consulter.",
        "steps": [
          "Depuis le menu principal, appuyez sur « Prêt à envoyer » pour voir tous les formulaires en attente d'envoi.",
          "Assurez-vous d'avoir une connexion internet (Wi-Fi ou données mobiles).",
          "Appuyez sur « Tout envoyer » pour soumettre tous les formulaires en attente, ou sélectionnez ceux à envoyer.",
          "Une coche verte apparaîtra à côté de chaque formulaire envoyé avec succès.",
          "Les formulaires envoyés sont automatiquement déplacés vers « Envoyé » où vous pouvez les consulter."
        ]
      },
      "offline": {
        "title": "Travailler Hors-Ligne",
        "desc": "AGR-Collect est conçu pour fonctionner dans les zones à connectivité limitée ou inexistante.",
        "steps": [
          "Téléchargez vos formulaires quand vous avez internet — une fois sur votre appareil, ils fonctionnent sans connexion.",
          "Remplissez normalement les formulaires sur le terrain, même avec zéro connectivité. Toutes les données sont sauvegardées localement.",
          "Quand vous revenez dans une zone avec internet, ouvrez l'app et allez dans « Prêt à envoyer ».",
          "Appuyez sur « Tout envoyer » — tous vos formulaires finalisés seront téléversés automatiquement.",
          "L'application réessaiera automatiquement l'envoi si la connexion est interrompue pendant le transfert."
        ]
      },
      "tip": "Chargez toujours votre téléphone complètement avant de partir sur le terrain. Activez le GPS avant d'ouvrir un formulaire géolocalisé. Prenez des photos claires et bien éclairées. Sauvegardez régulièrement votre travail comme brouillon lors du remplissage de formulaires longs."
    },
    "sync": {
      "title": "Synchronisation & Transfert de Données",
      "description": "AGR-Collect utilise un système de synchronisation robuste pour garantir que vos données ne sont jamais perdues. Les données circulent de l'application mobile vers le serveur central et sont ensuite disponibles sur la plateforme web.",
      "detail": "Lorsqu'un agent finalise et envoie un formulaire, les données sont transmises de manière sécurisée via HTTPS (chiffré) au serveur central. Si la connexion est interrompue pendant le transfert, l'application réessaiera automatiquement. Le serveur traite les données, extrait les coordonnées GPS et rend la soumission disponible pour consultation sur la plateforme web.",
      "pending": "En attente",
      "pendingDesc": "Le formulaire est finalisé sur l'appareil, en attente d'internet pour l'envoi",
      "synced": "Synchronisé",
      "syncedDesc": "Les données ont été reçues et stockées avec succès sur le serveur",
      "error": "Erreur",
      "errorDesc": "La transmission a échoué — l'application réessaiera automatiquement quand la connexion sera rétablie",
      "tip": "Si vous voyez des soumissions bloquées en statut « En attente », vérifiez votre connexion internet et assurez-vous que l'URL du serveur est correcte. Vous pouvez aussi essayer d'envoyer les formulaires un par un."
    },
    "gps": {
      "title": "Géolocalisation & GPS",
      "description": "La géolocalisation GPS est une fonctionnalité centrale d'AGR-Collect. Chaque soumission peut capturer des coordonnées précises, qui sont ensuite affichées sur des cartes interactives sur la plateforme web.",
      "detail": "Pour une capture GPS précise, suivez ces bonnes pratiques :",
      "tips": [
        "Activez les Services de localisation (GPS) sur votre appareil avant d'ouvrir un formulaire. Allez dans Paramètres > Localisation et activez-le.",
        "En extérieur, attendez que la précision GPS atteigne au moins 5 mètres avant d'accepter les coordonnées. L'indicateur de précision passera au vert quand c'est prêt.",
        "Évitez de capturer le GPS en intérieur, sous une végétation dense ou près de grands bâtiments — cela peut réduire significativement la précision.",
        "Si la précision GPS est faible (plus de 10 m), essayez de vous déplacer vers une zone ouverte et attendez 30 secondes pour que le signal se stabilise.",
        "Les coordonnées GPS sont capturées automatiquement et ne peuvent pas être modifiées manuellement, garantissant l'authenticité et la traçabilité des données.",
        "Sur la plateforme web, toutes les soumissions géolocalisées apparaissent sur une carte interactive où vous pouvez cliquer sur les marqueurs pour voir les détails."
      ]
    },
    "reports": {
      "title": "Rapports & Analyse de Données",
      "description": "AGR-Collect fournit des outils de reporting sur la plateforme web et l'application mobile pour aider à suivre la progression des collectes et analyser les données.",
      "detail": "Les rapports peuvent être générés et filtrés selon plusieurs critères :",
      "features": [
        "Filtrer par période : Visualiser les données collectées aujourd'hui, cette semaine, ce mois ou une période personnalisée.",
        "Filtrer par agent : Voir quels agents ont soumis des données et combien de formulaires chacun a complétés.",
        "Filtrer par formulaire : Analyser les soumissions d'un formulaire spécifique pour suivre les taux de complétion.",
        "Export PDF : Générer des rapports PDF professionnels adaptés au partage avec les parties prenantes et sponsors.",
        "Visualisation cartographique : Voir toutes les soumissions géolocalisées sur une carte interactive pour identifier les lacunes de couverture.",
        "Sur mobile : Utilisez la fonctionnalité « Générer Rapport » depuis le menu principal pour voir vos statistiques personnelles de collecte avec filtres par date."
      ]
    },
    "faq": {
      "title": "Questions Fréquentes",
      "items": [
        {
          "q": "J'ai oublié mon mot de passe. Comment le réinitialiser ?",
          "a": "Contactez votre administrateur. Il peut réinitialiser votre mot de passe depuis la section Utilisateurs de la plateforme web. Pour les utilisateurs mobile, l'administrateur peut générer un nouveau code QR."
        },
        {
          "q": "Mes formulaires n'apparaissent pas dans l'application mobile. Que faire ?",
          "a": "Assurez-vous d'être connecté à internet, puis allez dans « Télécharger formulaire » et rafraîchissez la liste. Si les formulaires n'apparaissent toujours pas, vérifiez avec votre administrateur que votre Utilisateur Mobile a bien accès aux formulaires dans les paramètres « Accès aux Formulaires »."
        },
        {
          "q": "Puis-je modifier un formulaire après l'avoir envoyé ?",
          "a": "Une fois qu'un formulaire est envoyé au serveur, il ne peut plus être modifié depuis l'application mobile. Cependant, les administrateurs peuvent consulter et réviser les soumissions sur la plateforme web. Si vous devez corriger des données, contactez votre administrateur."
        },
        {
          "q": "Que se passe-t-il si je perds mon téléphone avec des données non envoyées ?",
          "a": "Les données non envoyées sont stockées localement sur l'appareil. Si le téléphone est perdu, ces données ne sont malheureusement pas récupérables. Pour minimiser les risques, envoyez vos formulaires finalisés dès que vous avez accès à internet. Pensez à envoyer vos données à la fin de chaque journée de travail."
        },
        {
          "q": "Le GPS ne fonctionne pas ou est très imprécis. Que puis-je faire ?",
          "a": "Assurez-vous que les Services de localisation (GPS) sont activés dans les paramètres de votre téléphone. Allez en extérieur dans une zone ouverte, loin des bâtiments et des arbres. Attendez 30 à 60 secondes pour que le signal GPS se stabilise. Si le problème persiste, redémarrez votre téléphone et réessayez."
        },
        {
          "q": "Comment changer la langue de l'application en français ?",
          "a": "L'application mobile suit la langue système de votre téléphone. Changez la langue de votre téléphone en français dans Paramètres > Système > Langue, et l'application basculera automatiquement. Sur la plateforme web, utilisez le sélecteur de langue en haut à droite de la page."
        },
        {
          "q": "Plusieurs agents peuvent-ils utiliser le même téléphone ?",
          "a": "Oui, mais il est recommandé que chaque agent ait son propre appareil pour la traçabilité. En cas de partage d'appareil, chaque agent doit utiliser son propre compte Utilisateur Mobile (code QR) pour que les soumissions soient correctement attribuées."
        },
        {
          "q": "Combien d'espace de stockage l'application nécessite-t-elle ?",
          "a": "L'application elle-même nécessite environ 50 Mo. Chaque formulaire avec photos et données GPS utilise typiquement 1 à 5 Mo. Pour une campagne de 500 soumissions avec photos, prévoyez environ 1 à 2 Go d'espace libre sur l'appareil."
        }
      ]
    },
    "footer": "Pour une assistance supplémentaire, contactez l'équipe de support SAAHDEL à emmanueljuniordequa2{'@'}gmail.com ou au +237 690 624 051. Nous sommes disponibles du lundi au vendredi, de 8h à 17h."
  }
}
</i18n>
