# Project Requirements Document: Habits Tracker Website

## 1. Introduction
The Habits Tracker Website is a simple, user-friendly application that allows users to track their daily habits over time. Users can define custom habits and track their completion on a calendar-like interface, providing visual feedback on their consistency and progress.

## 2. User Stories
- As a user, I want to create custom habits so that I can track activities important to me
- As a user, I want to mark habits as complete on specific days so I can track my consistency
- As a user, I want to navigate between months to view my historical data or plan ahead
- As a user, I want to change the application language to suit my preferences
- As a user, I want to define when my habit tracking began to avoid empty data in previous months
- As a user, I want to specify recurring patterns for my habits so they match my real-life schedule

## 3. Features and Functionality

### 3.1 Habit Management
- Users can add new habits
- Each habit is defined by:
  1. A text description field (e.g., "Drink water", "Exercise", etc.)
  2. Schedule options that specify when the habit should be performed:
     - Option to select specific days of the week (e.g., only Mondays, only Sundays and Fridays)
     - Option to set custom frequency (every X days), starting from a specific date
     - Option to select specific dates of each month (e.g., the 13th of every month, or the 14th, 15th, and 16th)
- Habits display prominently at the top of the main interface

### 3.2 Calendar View
- Days of the current month are displayed in a column on the left side
- Each habit has a corresponding checkbox for each day
- Users can check/uncheck boxes to indicate habit completion for specific days

### 3.3 Month Navigation
- Forward and backward buttons allow users to change the displayed month
- Current month and year are clearly displayed

### 3.4 Settings
- Language selection (English, Arabic)
- Option to set the first month from which habits are tracked
- Settings accessible via a dedicated menu/button

## 4. User Interface Requirements

### 4.1 Main Page Layout
- Header section containing app title and settings button
- Habits arranged horizontally in a row at the top of the calendar
- Days of the month listed vertically on the left side
- Grid of checkboxes where columns represent habits and rows represent days
- Month navigation controls (previous/next buttons) near the top
- Checkboxes serve as visual indicators for days when habits are scheduled to be performed

### 4.2 Settings Page Layout
- Language selection with options for English and Arabic
- Date picker or dropdown menus to select the first month for habit tracking
- Save/Apply button to confirm settings changes
- Back/Cancel button to return to main view

### 4.3 Habit Creation/Edit Dialog
- Text field for entering the habit description
- Schedule selection interface with three options:
  - Weekday selection with checkboxes for each day of the week
  - Custom frequency selector with:
    - Number input for frequency (every X days)
    - Date picker for selecting the starting date
  - Multi-select interface for choosing specific dates of the month
- Save and Cancel buttons

## 5. Technical Requirements
- Responsive design that works on desktop and mobile devices
- Single page application with one route (no multi-page navigation)
- Data persistence (local storage or database)
- Support for internationalization (English and Arabic languages)
- Accessible interface following WCAG guidelines
- Logic to handle recurring habit patterns and display appropriate UI cues

## 6. Constraints and Limitations
- Initial version limited to two languages
- No user accounts or cloud synchronization in initial version
- Limited to monthly view (no weekly or yearly views)

## 7. Future Enhancements (Post-MVP)
- User accounts and data synchronization
- Habit categories or tags
- Streak tracking and statistics
- Reminder notifications
- Additional language support
- Weekly and yearly views
- Data export/import functionality
- More complex recurring patterns (e.g., first Monday of the month)
- Habit completion goals (e.g., 3 times a week, 5 times a month)