// IndexedDB utilities for offline storage

const DB_NAME = 'LearningPodDB';
const DB_VERSION = 1;
const COURSES_STORE = 'courses';
const PROGRESS_STORE = 'progress';

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
}

export interface Progress {
  key: string; // format: "progress:{courseId}:{lessonId}"
  courseId: string;
  lessonId: string;
  done: boolean;
  timestamp: number;
}

let dbInstance: IDBDatabase | null = null;

export async function initDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create courses store
      if (!db.objectStoreNames.contains(COURSES_STORE)) {
        db.createObjectStore(COURSES_STORE, { keyPath: 'id' });
      }

      // Create progress store
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: 'key' });
      }
    };
  });
}

// Course operations
export async function saveCourse(course: Course): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COURSES_STORE], 'readwrite');
    const store = transaction.objectStore(COURSES_STORE);
    const request = store.put(course);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getCourse(id: string): Promise<Course | undefined> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COURSES_STORE], 'readonly');
    const store = transaction.objectStore(COURSES_STORE);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllCourses(): Promise<Course[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COURSES_STORE], 'readonly');
    const store = transaction.objectStore(COURSES_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteCourse(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([COURSES_STORE], 'readwrite');
    const store = transaction.objectStore(COURSES_STORE);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Progress operations
export async function saveProgress(progress: Progress): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);
    const request = store.put(progress);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getProgress(courseId: string, lessonId: string): Promise<Progress | undefined> {
  const db = await initDB();
  const key = `progress:${courseId}:${lessonId}`;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllProgress(): Promise<Progress[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function getCourseProgress(courseId: string): Promise<Progress[]> {
  const allProgress = await getAllProgress();
  return allProgress.filter(p => p.courseId === courseId);
}

export async function toggleLessonComplete(courseId: string, lessonId: string): Promise<boolean> {
  const existing = await getProgress(courseId, lessonId);
  const newDone = !existing?.done;
  
  const progress: Progress = {
    key: `progress:${courseId}:${lessonId}`,
    courseId,
    lessonId,
    done: newDone,
    timestamp: Date.now()
  };
  
  await saveProgress(progress);
  return newDone;
}

// Export progress as CSV
export async function exportProgressCSV(): Promise<string> {
  const allProgress = await getAllProgress();
  const courses = await getAllCourses();
  
  // Create a map for quick course/lesson lookup
  const courseMap = new Map(courses.map(c => [c.id, c]));
  
  const rows = [
    ['Course ID', 'Course Title', 'Lesson ID', 'Lesson Title', 'Completed', 'Timestamp']
  ];
  
  for (const progress of allProgress) {
    const course = courseMap.get(progress.courseId);
    const lesson = course?.lessons.find(l => l.id === progress.lessonId);
    
    rows.push([
      progress.courseId,
      course?.title || 'Unknown',
      progress.lessonId,
      lesson?.title || 'Unknown',
      progress.done ? 'Yes' : 'No',
      new Date(progress.timestamp).toISOString()
    ]);
  }
  
  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}
