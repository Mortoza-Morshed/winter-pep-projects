# Smart Study Planner

A simple, clean study planner web application to help students manage their subjects, schedule, and tasks.

## Features

- **Subject Management** - Add and organize your subjects with custom colors
- **Weekly Schedule** - Plan your classes for each day of the week
- **Task Tracking** - Create and manage assignments, exams, and projects
- **Analytics** - View your progress and completion statistics
- **Dark Mode** - Toggle between light and dark themes
- **Local Storage** - All data saved in your browser

## Project Structure

```
Smart-Study-Planner/
├── index.html              # Dashboard page
├── subjects.html           # Subjects management
├── schedule.html           # Weekly schedule
├── tasks.html              # Task management
├── analytics.html          # Statistics and analytics
├── settings.html           # Settings page
├── css/
│   └── style.css          # All styles
└── js/
    └── common.js          # Shared functions
```

## How to Use

1. **Open the Application**
   - Simply open `index.html` in your web browser
   - No installation or build process required!

2. **Add Subjects**
   - Go to the Subjects page
   - Click "Add Subject" and fill in the details
   - Choose a color to identify your subject

3. **Create a Schedule**
   - Navigate to the Schedule page
   - Select a day and click "Add Class"
   - Fill in the subject, time, and room details

4. **Manage Tasks**
   - Go to the Tasks page
   - Click "New Task" to create assignments or exams
   - Check off tasks as you complete them

5. **View Analytics**
   - Check the Analytics page to see your progress
   - View task completion rates by subject

6. **Customize Settings**
   - Toggle between light and dark themes
   - Reset all data if needed

## Technologies Used

- **HTML5** - Page structure
- **CSS3** - Styling and layout
- **Vanilla JavaScript** - Functionality and interactivity
- **LocalStorage API** - Data persistence

## Features Explained

### Multi-Page Navigation

The app uses traditional HTML navigation with separate pages for each section. Click the sidebar links to navigate between pages.

### Data Persistence

All your data (subjects, schedule, tasks) is automatically saved to your browser's LocalStorage. Your data persists even after closing the browser.

### Theme Toggle

Switch between light and dark modes using the "Toggle Theme" button in the header. Your preference is saved automatically.

### Responsive Design

The interface is clean and works well on different screen sizes.

## Browser Compatibility

Works on all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## Local Development

No build process needed! Just:

1. Clone or download this repository
2. Open `index.html` in your browser
3. Start using the app

## Data Storage

All data is stored locally in your browser using LocalStorage under the key `studyPlannerData`.

**Note:** Clearing your browser data will delete all your planner information. Use the export/backup feature if you need to preserve your data.

## License

This is a student project - feel free to use and modify as needed for educational purposes.

## Credits

Created as a school project to demonstrate HTML, CSS, and JavaScript skills.
