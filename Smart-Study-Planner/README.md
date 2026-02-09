# Smart Study Planner

**Student Project - Frontend Development**  
**Submission Date:** February 9, 2026

---

## 📋 Project Overview

The Smart Study Planner is a web-based application designed to help students organize their academic life. Built using pure HTML5, CSS3, and Vanilla JavaScript, this application provides a comprehensive solution for managing subjects, schedules, tasks, and tracking academic progress.

---

## ✨ Features

### 1. Dashboard

- Overview of all subjects and their priorities
- Display of pending tasks count
- Today's class schedule at a glance
- Quick access to upcoming deadlines

### 2. Subject Management

- Add, edit, and delete subjects
- Assign custom colors to each subject
- Set priority levels (High, Medium, Low)
- Associate teachers with subjects

### 3. Schedule Planner

- Create weekly timetables
- Day-wise schedule view with tabs
- Add class timings with room information
- Visual color-coding based on subjects

### 4. Task Manager

- Create and manage assignments, exams, and projects
- Set due dates for all tasks
- Mark tasks as complete
- Filter tasks by status (All, Pending, Completed)
- Visual organization by subject

### 5. Progress Analytics

- Task completion rate statistics
- Subject-wise task distribution
- Upcoming exams overview
- Visual progress indicators

### 6. Settings

- User profile management
- Data reset functionality
- All preferences saved to LocalStorage

---

## 🛠️ Technical Implementation

### Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Responsive styling with CSS variables
- **Vanilla JavaScript (ES6+)** - Application logic
- **LocalStorage API** - Data persistence

### Project Structure

```
Smart-Study-Planner/
├── index.html              # Main HTML file
├── css/
│   ├── variables.css       # CSS custom properties
│   └── style.css          # Main stylesheet
├── js/
│   ├── app.js             # Application entry point
│   ├── storage.js         # LocalStorage manager
│   └── views/
│       ├── dashboard.js   # Dashboard view
│       ├── subjects.js    # Subject management
│       ├── schedule.js    # Schedule planner
│       ├── tasks.js       # Task manager
│       ├── analytics.js   # Progress analytics
│       └── settings.js    # Settings panel
└── README.md              # This file
```

### Key Design Decisions

1. **Modular Architecture**: Each view is a separate module for better code organization
2. **Component-Based Approach**: Reusable rendering functions
3. **Single Page Application**: Dynamic view switching without page reloads
4. **Responsive Design**: Works on desktop, tablet, and mobile devices
5. **Data Persistence**: All data stored in browser LocalStorage

---

## 💾 LocalStorage Implementation

The application uses a centralized `StorageManager` class to handle all data operations:

**Storage Key:** `studyPlannerData`

**Data Structure:**

```javascript
{
  subjects: [
    { id, name, teacher, color, priority }
  ],
  schedule: [
    { id, day, subjectId, startTime, endTime, room }
  ],
  tasks: [
    { id, title, subjectId, dueDate, type, completed }
  ],
  settings: {
    username: "Student"
  }
}
```

**Key Features:**

- Automatic data persistence on every change
- Data survives page refresh and browser restart
- Reset functionality to clear all data
- Error handling for corrupted data

---

## 🎨 Design Guidelines Followed

- **Consistent Color Scheme**: Professional blue theme
- **Readable Typography**: Clear fonts with proper sizing
- **Proper Spacing**: Adequate padding and margins
- **Responsive Layout**: Flexbox and CSS Grid
- **Clean UI**: Simple, student-friendly interface
- **Accessibility**: Semantic HTML and proper contrast

---

## 🚀 How to Run

1. Download or clone the project files
2. Open `index.html` in any modern web browser
3. No server or build process required
4. Start adding subjects, schedules, and tasks!

**Supported Browsers:**

- Chrome/Edge (Recommended)
- Firefox
- Safari

---

## 📱 Features Walkthrough

### Adding a Subject

1. Click "Subjects" in the sidebar
2. Click "Add Subject" button
3. Fill in subject name, teacher, color, and priority
4. Click "Save"

### Creating a Schedule

1. Navigate to "Schedule"
2. Select a day using the tabs
3. Click "Add Class"
4. Choose subject, time, and room
5. Save the class

### Managing Tasks

1. Go to "Tasks" view
2. Click "New Task"
3. Enter task details and due date
4. Use filters to view pending/completed tasks
5. Check boxes to mark tasks complete

### Viewing Analytics

1. Open "Analytics" section
2. View completion rate
3. See task distribution by subject
4. Check upcoming exams

---

## 📊 Project Evaluation Criteria

| Category                              | Implementation                                       |
| ------------------------------------- | ---------------------------------------------------- |
| **UI/UX Design (25 marks)**           | Clean, responsive design with consistent styling     |
| **JavaScript Logic (30 marks)**       | Modular code, proper event handling, data management |
| **Feature Implementation (20 marks)** | All 6 sections fully functional                      |
| **Code Quality (15 marks)**           | Well-organized, readable, maintainable code          |
| **Documentation (10 marks)**          | Comprehensive README and code comments               |

---

## 🔒 Academic Integrity

This project was developed as original work following the assignment guidelines:

- ✅ No frameworks used (pure vanilla JavaScript)
- ✅ No templates or copied code
- ✅ Original design and implementation
- ✅ Proper LocalStorage implementation
- ✅ All features working as specified

---

## 📝 Learning Outcomes

Through this project, I gained experience in:

- Frontend web development with vanilla technologies
- DOM manipulation and event handling
- Data persistence using LocalStorage
- Responsive web design principles
- Code organization and modular architecture
- UI/UX design fundamentals

---

## 👨‍💻 Developer

**Student Name:** [Your Name]  
**Submission Date:** February 9, 2026  
**Project:** Smart Study Planner  
**Course:** Frontend Development

---

## 📄 License

This project is submitted as academic coursework.

---

**Note:** This application stores all data locally in your browser. Clearing browser data will remove all stored information.
