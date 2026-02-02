# EBTT Capstone - Database Design (Schema)

This document outlines the database structure for the Elsinore Bennu Think Tank (EBTT) website. 
These collections are managed via Wix CMS and queried using Wix Velo.

## 1. Collection: Resources
**Purpose:** An informational hub for toolkits, curricula, and reading lists. All organization resources will be found here.

| Field Name | Field Key | Data Type | Purpose |
| :--- | :--- | :--- | :--- |
| Title | `resourceTitle` | Text | Name of the resource/document. |
| Category | `category` | Tags | e.g., Toolkit, Reading List, Curriculum. |
| Description | `description` | Rich Text | Plain language summary of the content. |
| File Attachment | `file` | Document | The downloadable PDF or tool. |
| External Link | `link` | URL | Link to partner sites or outside resources. |
| Display on Site | `displayResource` | Boolean | Administrative toggle to hide/show items. |

## 2. Collection: CommunityVoices
**Purpose:** Share stories and testimonials of community members.

| Field Name | Field Key | Data Type | Purpose |
| :--- | :--- | :--- | :--- |
| Name | `contributorName` | Text | Name of the individual. |
| Story Title | `title` | Text | A concise headline for the narrative. |
| Narrative | `content` | Rich Text | The full testimonial or story. |
| Photo | `image` | Image | Portrait of the contributor. |
| Date Added | `createdDate` | Date | System field used to sort by newest stories. |
| Display on Site | `isVisible` | Boolean | Administrative toggle to hide/show items. |

## 3. Collection: Events
**Purpose:** A dynamic calendar for workshops, seminars, and meetings.

| Field Name | Field Key | Data Type | Purpose |
| :--- | :--- | :--- | :--- |
| Event Name | `title` | Text | Title of the event or meeting. |
| Date and Time | `eventDateTime` | Date/Time | When the event starts. |
| Location | `location` | Text | e.g., Canevin Hall, Zoom Link, etc. |
| Description | `eventSummary` | Text | Brief overview of what will happen. |
| Registration Link | `registrationUrl` | URL | Link to a sign-up form or Zoom registration. |
| Event Status | `isPastEvent` | Boolean | Used to move events to the "Archive" section. |

---

## Technical Notes for Full-Stack Integration
- **Search Logic:** Custom Velo functions in `dataService.jsw` will query these collections.
- **Accessibility:** All image fields in these collections will require `Alt Text` descriptions for screen readers to ensure inclusive design.