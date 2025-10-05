
## Overview
The Disaster Response Management System (DRMS) is a comprehensive web application aimed at improving and streamlining disaster response management through AI-based prioritization, resource allocation, route optimization, and integrated real-time map visualization. It serves multiple roles such as administrators who manage resources and operational commands, and users who can submit emergency requests.

***

## Features & Functionalities

### Role-Based Access Control
- **Roles:** Admin and User.
- **Login Page:** 
  - Replaces traditional username-password authentication with role selection.
  - Stores selected role in session memory.
  - Redirects users to assigned dashboards based on their role.
  - Admin users have full access, Users have limited access (e.g., no resource addition).
- **Logout & Role Switching:** Ability to clear session and return to role selection.

### Emergency Request Management (/requests)
- **AI Priority Index:**
  - Automatically calculates a priority score for each request using the formula:  
    $$ \text{Priority} = 0.6 \times \text{Individuals Affected} + 0.4 \times \text{Severity} $$.
  - Requests are dynamically sorted by priority score in descending order.
- **Request Table:**
  - Displays columns: Request ID, Location, Individuals Affected, Severity (1-5), Priority Score, Status.
  - Statuses: Pending (Orange badge), Allocated (Blue badge), Resolved (Green badge).
  - Action buttons to update status from Pending → Allocated → Resolved.
- **Map Visualization:**
  - Leaflet map shows markers for each emergency request.
  - Color code markers by priority level (Red: High, Orange: Medium, Green: Low).
  - Clicking markers opens detail popups with request info.
- **Shortest Path Optimization Button:**
  - Simulates Dijkstra’s algorithm for fastest resource dispatch route.
  - Displays estimated travel time in flash messages.
  - Supports decision-making for resource allocation.
- **Filtering & Sorting:**
  - Filters by status (Pending, Allocated, Resolved) and location.
  - Maintains real-time refresh reflecting status updates.

### Resource Inventory Management (/view)
- **Resource Table:**
  - Displays resource name, quantity, location, category, and current status (Available, Deployed).
  - Integrates search bar to query resources by name or location simultaneously.
- **Category Filters:**
  - Dropdown with categories: All, Medical, Food/Water, Equipment, Personnel.
  - Filters resource listings in real-time.
- **Admin-Specific Actions:**
  - Edit and delete resource entries.
  - Access restriction enforced by role.
  
### Public Emergency Request Submission (/submit_request)
- **Form Fields:**
  - Location (text input).
  - Description of emergency.
  - Individuals Affected (numeric input validated).
  - Severity (Dropdown 1-5 with descriptive labels).
- **Real-Time Priority Calculation:**
  - As users input data, priority is calculated and displayed instantly.
- **Form Validation:**
  - All input fields are required with proper validation.
- **Submission Handling:**
  - Requests are added to the in-memory dataset.
  - Confirmation message shown on successful form submission.

### Admin Resource Management (/add)
- **Resource Addition Form:**
  - Inputs: Resource Name, Quantity, Location, Category.
  - Validates entries on submission.
  - Status defaults to "Available".
- **Access Control:**
  - Visible and usable by Admin role only.
- **After Submission:**
  - Redirects to the inventory page.
  - Displays success notification.

### Additional Functionalities
- **Flash Messaging System:**
  - Temporary notifications for status changes, optimizations, success messages.
- **Dynamic UI Updates:**
  - Page content updates immediately after data changes without refresh.
- **Navigation Bar:**
  - Role-sensitive menu items.
  - Current user role displayed prominently.
  - Logout/Role switch capability.
- **Responsive Design:**
  - Fully usable on mobile and desktop.
- **Search & Filter Utility:**
  - Universal search functionality for swift data access.

***

## Application Architecture Summary

| Component                 | Technology / Approach                                     | Purpose                                           |
|---------------------------|----------------------------------------------------------|--------------------------------------------------|
| Frontend                  | HTML, CSS (white-themed), JavaScript                     | UI rendering, interactions, and state management |
| Role-based Access         | In-browser role simulation                                | Control access / features without backend auth   |
| Data Storage              | In-memory JavaScript arrays                               | Temporary data holding (no persistence)          |
| Priority Calculation      | JS function implementing formula                          | Calculates request urgency/priority              |
| Map Visualisation         | Leaflet.js                                               | Display requests/resources geographically        |
| Routing Optimization      | Simulated Dijkstra's algorithm                            | Suggests optimized resource dispatch routes      |
| Dynamic Filtering         | JavaScript filters/search                                 | Data filtering without page reload                |
| Form Validation           | JavaScript form input validation                          | Ensures valid and complete data                   |
| Notifications             | Flash message system                                      | User feedback on actions                           |

***

## How to Extend This Demo Towards Production

- **Backend Implementation:** Using Flask, Django, or Node.js for persistent storage and business logic.
- **Database:** Use PostgreSQL with PostGIS for managing coordinates and resources spatially.
- **Authentication:** Integrate JWT or OAuth2 for secure login and access control.
- **Real-time Updates:** Connect WebSocket services for live status and map updates.
- **True Route Optimization:** Incorporate APIs like Google Maps or OpenStreetMap with live traffic data.
- **External Data Integration:** Weather data, volunteer reporting, and official resource tracking.
- **Secure Hosting:** Deploy on cloud with HTTPS, firewall, and monitoring services.
- **Robust UI Frameworks:** Use React, Angular, or Vue.js for production-grade frontend.

***

## Summary of Functions and Responsibilities

| Functionality                          | Description                                        |
|--------------------------------------|--------------------------------------------------|
| Role Selection                       | Choose and set user role (Admin/User)             |
| Login & Redirect                     | Show login page and redirect based on role        |
| Calculate Request Priority           | Compute priority score with weighted formula       |
| Render Emergency Request Table       | Display all requests sorted by priority            |
| Update Request Status                | Change status with buttons (Pending → Resolved)   |
| Display Requests on Map              | Place markers on interactive Leaflet map          |
| Optimize Route                      | Simulate shortest travel time for resource dispatch|
| Filter/Search Requests & Resources   | Real-time filtering and searching                   |
| Submit New Emergency Request         | Public form with input validation and priority calc|
| Add New Resource                    | Admin-only form to expand inventory                 |
| Show Flash Messages                 | Temporary notifications for success/errors         |
| Navigation Bar                      | Role-based menu and logout/role switch              |
| Responsive Layout                   | Adapt UI for desktop and mobile                      |

***
