# Contributing to LearningPod

Thank you for your interest in making LearningPod better! This guide will help you understand how to contribute to the project, whether you're fixing a bug, adding a feature, or improving documentation.

---

## How Can I Contribute?

There are many ways to help, and you don't need to be an expert programmer:

**Report Issues** - Found a bug? Let us know! Open an issue describing what went wrong.

**Suggest Features** - Have an idea for improvement? We'd love to hear it.

**Improve Documentation** - Help make our guides clearer and more helpful.

**Write Code** - Fix bugs, add features, or improve performance.

**Test the App** - Try it on different devices and browsers, report what works and what doesn't.

**Create Course Content** - Design educational courses that can help learners.

---

## Getting Started

### Setting Up Your Development Environment

**1. Fork and Clone**
```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR-USERNAME/learningpod.git
cd learningpod
```

**2. Install Dependencies**
```bash
# Make sure you have Node.js 22+ and pnpm installed
pnpm install
```

**3. Start the Dev Server**
```bash
pnpm dev
```

The app will open at `http://localhost:3000`

**4. Make Your Changes**
- Create a new branch: `git checkout -b my-feature-name`
- Write your code
- Test it thoroughly
- Commit with clear messages: `git commit -m "Add feature X"`

**5. Submit a Pull Request**
- Push your branch: `git push origin my-feature-name`
- Go to GitHub and create a Pull Request
- Describe what you changed and why

---

## Code Style Guidelines

### General Principles

**Write Clear Code** - Other people (including future you) need to understand what your code does. Use descriptive variable names and add comments explaining the "why" behind complex logic.

**Keep It Simple** - Don't over-engineer. The simplest solution that works is usually the best.

**Be Consistent** - Follow the existing code style in the project. If you see a pattern, stick to it.

### TypeScript Guidelines

```typescript
// ✅ Good: Clear function name, typed parameters, helpful comment
/**
 * Saves a course to the local database so it can be accessed offline.
 * Returns true if successful, false if something went wrong.
 */
async function saveCourseToDatabase(course: Course): Promise<boolean> {
  try {
    const db = await openDatabase();
    await db.put('courses', course);
    return true;
  } catch (error) {
    console.error('Failed to save course:', error);
    return false;
  }
}

// ❌ Bad: Unclear name, no types, no comments
async function save(c) {
  const d = await open();
  await d.put('courses', c);
}
```

### React Component Guidelines

```typescript
// ✅ Good: Clear component structure with comments
/**
 * CourseCard displays a single course in the catalog.
 * Shows the title, description, and a download button.
 */
export function CourseCard({ course }: { course: Course }) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Handle the download button click
  const handleDownload = async () => {
    setIsDownloading(true);
    await downloadCourse(course.id);
    setIsDownloading(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Download'}
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### CSS/Tailwind Guidelines

```tsx
// ✅ Good: Logical grouping of classes, responsive design
<div className="
  flex flex-col gap-4          // Layout
  p-6 rounded-lg               // Spacing and shape
  bg-card text-card-foreground // Colors
  shadow-md hover:shadow-lg    // Effects
  md:flex-row md:gap-6         // Responsive changes
">

// ❌ Bad: Random order, hard to read
<div className="shadow-md bg-card md:gap-6 flex p-6 text-card-foreground gap-4 hover:shadow-lg rounded-lg flex-col md:flex-row">
```

---

## Adding Comments to Your Code

Good comments explain **why** something is done, not **what** is being done (the code itself shows what).

```typescript
// ❌ Bad comment: Just repeats what the code says
// Set loading to true
setLoading(true);

// ✅ Good comment: Explains why we're doing this
// Show loading state while we fetch data from the database
// This prevents the UI from appearing broken during the delay
setLoading(true);
```

```typescript
// ❌ Bad comment: Too obvious
// Loop through courses
courses.forEach(course => { ... });

// ✅ Good comment: Adds useful context
// Check each course to see if it's already downloaded
// We do this to show the correct button state (Download vs Open)
courses.forEach(course => { ... });
```

**When to add comments:**
- Complex algorithms or logic
- Workarounds for browser bugs
- Performance optimizations
- Business logic that isn't obvious
- TODOs for future improvements

**When NOT to add comments:**
- Obvious code that's self-explanatory
- Repeating what the code already says clearly
- Outdated comments (update or remove them!)

---

## Testing Your Changes

Before submitting a pull request, make sure you've tested:

**Basic Functionality**
- Does the feature work as expected?
- Did you test both success and error cases?
- Does it work on mobile and desktop?

**Offline Support**
- Does it still work when offline?
- Is data persisted correctly?
- Does the service worker cache properly?

**Different Browsers**
- Test in Chrome, Firefox, and Safari if possible
- Check mobile browsers (Chrome Mobile, Safari iOS)

**Accessibility**
- Can you navigate with just the keyboard?
- Do buttons have clear labels?
- Is text readable (good contrast, not too small)?

---

## Pull Request Process

**1. Before You Submit**
- Make sure your code follows our style guidelines
- Add comments explaining complex parts
- Test thoroughly on different devices
- Update documentation if needed

**2. Writing a Good PR Description**

```markdown
## What This PR Does
Adds a search feature to the course catalog so users can quickly find courses by title.

## Why This Change Is Needed
Users requested an easier way to find specific courses when there are many available.

## How to Test
1. Go to the Catalog page
2. Type "reading" in the search box
3. Only courses with "reading" in the title should appear
4. Clear the search - all courses should reappear

## Screenshots
[Include before/after screenshots if it's a UI change]

## Checklist
- [x] Tested on mobile and desktop
- [x] Works offline
- [x] Added comments to explain the code
- [x] Updated README if needed
```

**3. Review Process**
- A maintainer will review your code
- They might suggest changes - don't take it personally!
- Make the requested changes and push again
- Once approved, we'll merge your PR

---

## Feature Requests

Have an idea? Great! Here's how to propose it:

**1. Check Existing Issues**
- Search to see if someone already suggested it
- If yes, add your thoughts to that issue
- If no, create a new one

**2. Describe Your Idea Clearly**

```markdown
## Feature Request: Audio Narration for Lessons

### The Problem
Many learners have low literacy levels and struggle with text-heavy lessons.

### Proposed Solution
Add an audio player to each lesson that reads the content aloud.
Users can tap a speaker icon to hear the lesson narrated.

### Benefits
- Helps learners with reading difficulties
- Makes content more accessible
- Allows learning while doing other tasks

### Possible Implementation
- Use Web Speech API for text-to-speech
- Add a play/pause button to each lesson
- Cache audio for offline playback

### Alternatives Considered
- Pre-recorded audio files (too much storage)
- External audio app (breaks the offline experience)
```

**3. Be Open to Discussion**
- Maintainers might suggest modifications
- Other contributors might have better ideas
- The feature might not fit the project's goals - that's okay!

---

## Bug Reports

Found a bug? Help us fix it by providing good information:

**1. Check If It's Already Reported**
- Search existing issues first
- If found, add any new details you have

**2. Write a Clear Bug Report**

```markdown
## Bug: Downloaded Courses Disappear After Browser Restart

### What I Expected
Downloaded courses should remain available even after closing and reopening the browser.

### What Actually Happened
After restarting Chrome, all my downloaded courses were gone.
I had to download them again.

### Steps to Reproduce
1. Open LearningPod in Chrome
2. Download "Basic Reading Skills" course
3. Verify it shows as downloaded (checkmark appears)
4. Close Chrome completely
5. Reopen Chrome and go to LearningPod
6. Course shows as not downloaded anymore

### Environment
- Browser: Chrome 120.0.6099.109
- OS: Windows 11
- Device: Desktop PC
- Internet: Was online the whole time

### Screenshots
[Attach screenshots showing the problem]

### Console Errors
[If you opened browser DevTools, paste any error messages]
```

---

## Documentation Improvements

Documentation is just as important as code! Help make our guides better:

**What to Improve**
- Fix typos and grammar mistakes
- Clarify confusing explanations
- Add missing information
- Update outdated instructions
- Add examples and screenshots

**How to Contribute**
1. Edit the relevant `.md` file
2. Use simple, clear language
3. Break complex topics into steps
4. Add examples when helpful
5. Submit a PR with your changes

**Writing Style**
- Use simple words (say "use" not "utilize")
- Write short sentences
- Explain technical terms
- Use "you" to address the reader
- Be friendly and encouraging

---

## Code of Conduct

**Be Respectful**
- Treat everyone with kindness and respect
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the project

**Be Collaborative**
- Share knowledge freely
- Give credit where it's due
- Ask questions when you're unsure
- Help others when you can

**Be Professional**
- No harassment, discrimination, or offensive behavior
- Keep discussions focused and productive
- Disagree respectfully
- Assume good intentions

---

## Questions?

Not sure about something? That's totally fine!

- **GitHub Discussions**: Ask questions and chat with other contributors
- **Issues**: Open an issue tagged with "question"
- **Email**: Contact the maintainers directly

We're here to help. Don't be afraid to ask!

---

## Recognition

All contributors will be:
- Listed in our CONTRIBUTORS.md file
- Credited in release notes
- Thanked publicly for their work

Your contributions, big or small, make a real difference in people's lives. Thank you for being part of this project!

---

**Happy Contributing! 🎉**
