import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Course, getCourse, getCourseProgress, initDB } from "@/lib/db";
import { CheckCircle2, Circle, Loader2, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";

export default function CourseView() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    if (!courseId) return;
    
    try {
      await initDB();
      const courseData = await getCourse(courseId);
      
      if (courseData) {
        setCourse(courseData);
        
        // Load progress
        const progress = await getCourseProgress(courseId);
        const completed = new Set(
          progress.filter(p => p.done).map(p => p.lessonId)
        );
        setCompletedLessons(completed);
      }
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground">Loading course...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold text-card-foreground">Course not found</h3>
              <p className="text-muted-foreground">This course may not be downloaded yet</p>
              <Link href="/catalog">
                <Button size="lg" className="gap-2">
                  Browse Catalog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const completedCount = completedLessons.size;
  const totalLessons = course.lessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Course Header */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-3 text-foreground">{course.title}</h1>
                  <p className="text-lg text-muted-foreground">{course.description}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-muted-foreground">Your Progress</span>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-semibold">
                        {completedCount} of {totalLessons} lessons
                      </span>
                      <Badge variant={progressPercent === 100 ? "default" : "secondary"} className="text-base px-3">
                        {progressPercent}%
                      </Badge>
                    </div>
                  </div>
                  
                  <Progress value={progressPercent} className="h-3" />
                  
                  {progressPercent === 100 && (
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Course Complete! Great job! 🎉</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lessons List */}
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-foreground">Lessons</h2>
              
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  
                  return (
                    <Link 
                      key={lesson.id} 
                      href={`/course/${courseId}/lesson/${lesson.id}`}
                    >
                      <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
                        <CardHeader className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xl mb-1">{lesson.title}</CardTitle>
                            </div>
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="flex items-center gap-2 text-primary">
                                  <CheckCircle2 className="w-7 h-7" />
                                  <span className="hidden sm:inline font-semibold">Complete</span>
                                </div>
                              ) : (
                                <Circle className="w-7 h-7 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
