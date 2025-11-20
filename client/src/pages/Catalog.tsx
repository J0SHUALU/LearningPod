import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Course, getAllCourses, getCourseProgress, initDB, saveCourse } from "@/lib/db";
import { BookOpen, Download, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Catalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [downloadedCourses, setDownloadedCourses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      await initDB();
      
      // Load courses from IndexedDB
      const localCourses = await getAllCourses();
      
      // If no local courses, fetch from courses.json
      if (localCourses.length === 0) {
        const response = await fetch('/courses.json');
        const remoteCourses: Course[] = await response.json();
        setCourses(remoteCourses);
      } else {
        setCourses(localCourses);
        setDownloadedCourses(new Set(localCourses.map(c => c.id)));
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  }

  async function downloadCourse(course: Course) {
    setDownloading(course.id);
    try {
      await saveCourse(course);
      setDownloadedCourses(prev => new Set(prev).add(course.id));
      toast.success(`✓ Downloaded: ${course.title}`);
    } catch (error) {
      console.error('Error downloading course:', error);
      toast.error('Failed to download course');
    } finally {
      setDownloading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground">Loading courses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Course Catalog</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Browse and download courses to start your learning journey
              </p>
            </div>

            {courses.length === 0 ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="pt-12 pb-12 text-center space-y-4">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto" />
                  <h3 className="text-xl font-semibold text-card-foreground">No courses available</h3>
                  <p className="text-muted-foreground">
                    Check back later or contact your administrator to add courses
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {courses.map(course => {
                  const isDownloaded = downloadedCourses.has(course.id);
                  const isDownloading = downloading === course.id;
                  
                  return (
                    <Card 
                      key={course.id} 
                      className="flex flex-col hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-2xl">{course.title}</CardTitle>
                          {isDownloaded && (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Downloaded
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.lessons.length} lesson{course.lessons.length !== 1 ? 's' : ''}</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {isDownloaded ? (
                          <Link href={`/course/${course.id}`} className="w-full">
                            <Button size="lg" className="w-full text-lg gap-2">
                              <BookOpen className="w-5 h-5" />
                              Open Course
                            </Button>
                          </Link>
                        ) : (
                          <Button 
                            size="lg" 
                            className="w-full text-lg gap-2"
                            onClick={() => downloadCourse(course)}
                            disabled={isDownloading}
                          >
                            {isDownloading ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="w-5 h-5" />
                                Download Course
                              </>
                            )}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
