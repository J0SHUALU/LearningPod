# LearningPod 📚

**An offline-first learning platform designed for community centers and shelters**

LearningPod is a Progressive Web App (PWA) that brings educational content to people who may not have reliable internet access. Built specifically for homeless shelters and community centers in Lagos, Nigeria, this platform allows learners to download courses and study at their own pace, even when they're completely offline.

---

## What Makes LearningPod Special?

LearningPod was created with a specific purpose in mind: to provide literacy and vocational training to people in underserved communities. Here's what makes it different:

**Works Completely Offline** - Once you download a course, you can access all the lessons without any internet connection. Perfect for areas with unreliable connectivity or for learners who can't afford constant data usage.

**Simple and Accessible** - The interface uses large fonts, clear language, and big buttons that are easy to tap on tablets and phones. We designed it for people with varying levels of literacy and technical experience.

**Tracks Your Progress** - As you complete lessons, the app remembers where you left off. You can see how far you've come in each course, which helps keep you motivated.

**Admin-Friendly** - Center staff can easily upload new courses using simple JSON files. No complicated database setup or technical knowledge required.

**Export Progress Data** - Staff can download CSV reports showing which learners have completed which lessons. This helps track program effectiveness and report to funders.

---

## Quick Start Guide

### For Learners

**Step 1: Open the App**
- Visit the LearningPod website on any device (phone, tablet, or computer)
- The app will ask if you want to install it - click "Yes" to add it to your home screen

**Step 2: Browse Courses**
- Click "Browse Courses" to see all available courses
- You'll see courses on reading, sewing, math, and other practical skills

**Step 3: Download a Course**
- Click "Download" on any course you want to study
- Wait a few seconds while the course saves to your device
- The download button will change to show a checkmark when it's ready

**Step 4: Start Learning**
- Click "Open" to view the course
- Go through lessons one by one
- Click "Mark as Complete" when you finish each lesson
- Your progress is saved automatically

**Step 5: Study Offline**
- You can now close the internet connection
- Open the app anytime to continue studying
- All your downloaded courses and progress will still be there

### For Center Staff (Admins)

**Uploading New Courses**
1. Click "Admin Panel" in the menu
2. Prepare your course as a JSON file (see format below)
3. Click "Choose File" and select your course JSON
4. Click "Upload Course" - it will be added immediately

**Exporting Progress Reports**
1. Go to the Admin Panel
2. Click "Export Progress Data"
3. A CSV file will download to your computer
4. Open it in Excel or Google Sheets to see who completed what

---

## Course File Format

Courses are uploaded as JSON files. Here's a simple example:

```json
{
  "id": "basic-reading",
  "title": "Basic Reading Skills",
  "description": "Learn to read simple words and sentences",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "The Alphabet",
      "content": "Let's learn the ABCs! A is for Apple, B is for Ball..."
    },
    {
      "id": "lesson-2",
      "title": "Simple Words",
      "content": "Now let's put letters together to make words..."
    }
  ]
}
```

**What each field means:**
- `id` - A unique name for the course (use lowercase with dashes)
- `title` - The course name that learners will see
- `description` - A short explanation of what the course teaches
- `lessons` - A list of all the lessons in the course
  - Each lesson has its own `id`, `title`, and `content`
  - Content can include text, and you can use simple formatting

---

## Technical Setup (For Developers)

### What You Need
- Node.js version 22 or higher
- pnpm package manager
- A code editor (VS Code recommended)
- Basic knowledge of React and TypeScript

### Installation Steps

**1. Get the Code**
```bash
# Download from GitHub
git clone https://github.com/yourusername/learningpod.git
cd learningpod
```

**2. Install Dependencies**
```bash
# Install all required packages
pnpm install
```

**3. Start the Development Server**
```bash
# Run the app locally
pnpm dev
```

The app will open at `http://localhost:3000`

**4. Build for Production**
```bash
# Create an optimized version for deployment
pnpm build
```

The built files will be in the `dist/public` folder.

---

## How to Deploy

### Option 1: GitHub Pages (Free)

**Step 1: Prepare Your Repository**
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 2: Configure GitHub Pages**
1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "GitHub Actions"
4. Create a file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

**Step 3: Update Base Path**

Edit `vite.config.ts` and add:
```typescript
export default defineConfig({
  base: '/learningpod/', // Replace with your repo name
  // ... rest of config
});
```

Your site will be live at `https://yourusername.github.io/learningpod/`

### Option 2: Netlify (Free, Easier)

**Step 1: Sign Up**
- Go to [netlify.com](https://netlify.com)
- Sign up with your GitHub account

**Step 2: Deploy**
1. Click "Add new site" → "Import an existing project"
2. Choose GitHub and select your repository
3. Build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist/public`
4. Click "Deploy site"

Your site will be live in 2-3 minutes at a free Netlify URL!

### Option 3: Vercel (Free, Very Fast)

**Step 1: Sign Up**
- Go to [vercel.com](https://vercel.com)
- Sign up with your GitHub account

**Step 2: Deploy**
1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Vercel will auto-detect the settings
4. Click "Deploy"

Done! Your site is live.

---

## Project Structure

Here's what each folder contains:

```
learningpod/
├── client/                 # Frontend code (what users see)
│   ├── public/            # Static files (images, course data)
│   │   ├── courses.json   # Sample courses
│   │   ├── sw.js          # Service worker for offline support
│   │   └── manifest.json  # PWA configuration
│   └── src/
│       ├── components/    # Reusable UI pieces
│       │   ├── Header.tsx # Top navigation bar
│       │   └── Footer.tsx # Bottom page footer
│       ├── pages/         # Different screens in the app
│       │   ├── Home.tsx   # Landing page
│       │   ├── Catalog.tsx    # Course browsing
│       │   ├── CourseView.tsx # Individual course view
│       │   ├── LessonView.tsx # Lesson content viewer
│       │   └── Admin.tsx      # Admin panel
│       ├── lib/           # Helper functions
│       │   └── db.ts      # IndexedDB operations (offline storage)
│       └── App.tsx        # Main app component
├── package.json           # Project dependencies
├── vite.config.ts         # Build tool configuration
└── README.md              # This file!
```

---

## Key Technologies Used

**React 19** - A popular library for building user interfaces. Makes it easy to create interactive components that update automatically when data changes.

**TypeScript** - JavaScript with type checking. Helps catch errors before they happen and makes the code more reliable.

**Tailwind CSS** - A utility-first CSS framework. Instead of writing custom CSS, we use pre-made classes like `text-center` and `bg-blue-500`.

**IndexedDB** - A browser database that stores data locally. This is what allows courses to work offline - they're saved right on the user's device.

**Service Workers** - Background scripts that intercept network requests. They cache the app files so everything loads even without internet.

**Wouter** - A tiny routing library. Handles navigation between different pages without full page reloads.

**Vite** - A modern build tool. Compiles and bundles our code super fast during development and creates optimized files for production.

---

## How Offline Support Works

LearningPod uses two strategies to work offline:

**1. Service Worker Caching**
When you first visit the site, a service worker downloads and caches all the core app files (HTML, CSS, JavaScript). This means the app shell loads instantly even offline.

**2. IndexedDB Storage**
When you download a course, all its data is saved in IndexedDB - a database built into your browser. This data persists even if you close the browser or restart your device.

Together, these technologies mean learners can:
- Open the app without internet
- Access all downloaded courses
- Complete lessons and track progress
- Everything syncs automatically when they reconnect

---

## Customization Guide

### Changing Colors

Edit `client/src/index.css` to change the color scheme:

```css
:root {
  /* Main brand color - used for buttons and highlights */
  --primary: 24 67% 50%;  /* Orange-red color */
  
  /* Background color - the main page background */
  --background: 30 40% 96%;  /* Light beige */
  
  /* Text color - main text throughout the app */
  --foreground: 20 14% 10%;  /* Dark brown */
}
```

Colors use the OKLCH format: `lightness chroma hue`

### Adding More Courses

Create a new JSON file following this structure:

```json
{
  "id": "your-course-id",
  "title": "Your Course Title",
  "description": "What students will learn",
  "lessons": [
    {
      "id": "lesson-1",
      "title": "First Lesson",
      "content": "Lesson content here. You can use **bold** and *italic* text."
    }
  ]
}
```

Upload it through the Admin Panel or add it to `client/public/courses.json`.

### Changing the App Name

1. Edit `shared/const.ts`:
```typescript
export const APP_TITLE = "Your App Name";
```

2. Edit `client/public/manifest.json`:
```json
{
  "name": "Your App Name",
  "short_name": "YourApp"
}
```

---

## Troubleshooting

**Problem: Courses won't download**
- Check your browser's storage settings - make sure it allows websites to store data
- Try clearing your browser cache and refreshing the page
- Make sure you have enough free space on your device

**Problem: Progress isn't saving**
- Don't use private/incognito mode - it clears data when you close the browser
- Check if your browser supports IndexedDB (all modern browsers do)
- Try a different browser if the issue persists

**Problem: App won't work offline**
- Make sure you visited the site while online first (to cache the files)
- Check if service workers are enabled in your browser
- Some browsers block service workers in private mode

**Problem: Build fails**
- Make sure you're using Node.js 22 or higher: `node --version`
- Delete `node_modules` and reinstall: `rm -rf node_modules && pnpm install`
- Check for any TypeScript errors: `pnpm tsc --noEmit`

---

## Contributing

We welcome contributions! Here's how you can help:

**Report Bugs**
- Open an issue on GitHub describing what went wrong
- Include steps to reproduce the problem
- Mention your browser and device type

**Suggest Features**
- Open an issue explaining your idea
- Describe how it would help learners or staff
- We prioritize features that improve accessibility

**Submit Code**
1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and add comments explaining what you did
4. Test thoroughly - try it on mobile and offline
5. Submit a pull request with a clear description

---

## License

This project is open source and available under the MIT License. This means you can:
- Use it for any purpose (including commercial)
- Modify it to fit your needs
- Distribute it to others
- Include it in your own projects

The only requirement is that you include the original copyright notice.

---

## Credits

**Created for:** Homeless and community shelters in Lagos, Nigeria

**Built with:** React, TypeScript, Tailwind CSS, and love ❤️

**Inspired by:** The need to make education accessible to everyone, regardless of their circumstances or internet connectivity

---

## Support

Need help? Have questions?

- **GitHub Issues**: [github.com/yourusername/learningpod/issues](https://github.com/yourusername/learningpod/issues)
- **Email**: your.email@example.com

---

## Roadmap

Features we're planning to add:

- **Audio narration** for lessons to help learners with lower reading levels
- **Multiple user profiles** so different people can track their own progress
- **Quizzes and assessments** to test understanding after each course
- **Certificates** that learners can print when they complete a course
- **More course categories** including job skills, health education, and financial literacy
- **Multi-language support** starting with Yoruba, Igbo, and Hausa

Want to help build any of these? Check out our Contributing section above!

---

**Made with ❤️ for community education**

*Empowering learners everywhere, one download at a time.*
