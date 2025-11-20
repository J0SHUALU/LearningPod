import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Course, getCourse, getProgress, initDB, toggleLessonComplete } from "@/lib/db";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Loader2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function LessonView() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [courseId, lessonId]);

  async function loadLesson() {
    if (!courseId || !lessonId) return;
    
    try {
      await initDB();
      const courseData = await getCourse(courseId);
      
      if (courseData) {
        setCourse(courseData);
        
        // Load progress for this lesson
        const progress = await getProgress(courseId, lessonId);
        setIsCompleted(progress?.done || false);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleComplete() {
    if (!courseId || !lessonId || toggling) return;
    
    setToggling(true);
    try {
      const newState = await toggleLessonComplete(courseId, lessonId);
      setIsCompleted(newState);
      toast.success(
        newState 
          ? '✓ Lesson marked as complete!' 
          : 'Lesson marked as incomplete',
        { duration: 2000 }
      );
    } catch (error) {
      console.error('Error toggling completion:', error);
      toast.error('Failed to update progress');
    } finally {
      setToggling(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-xl text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course || !lessonId) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <p className="text-xl text-muted-foreground">Lesson not found</p>
              <Link href="/catalog">
                <Button size="lg">Back to Catalog</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const lesson = course.lessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <p className="text-xl text-muted-foreground">Lesson not found</p>
              <Link href={`/course/${courseId}`}>
                <Button size="lg">Back to Course</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = lessonIndex < course.lessons.length - 1 ? course.lessons[lessonIndex + 1] : null;
  const prevLesson = lessonIndex > 0 ? course.lessons[lessonIndex - 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <Link href={`/course/${courseId}`}>
              <Button variant="ghost" size="lg" className="gap-2 -ml-2">
                <ArrowLeft className="w-5 h-5" />
                Back to {course.title}
              </Button>
            </Link>

            {/* Lesson Header */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-3">
                      Lesson {lessonIndex + 1} of {course.lessons.length}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {lesson.title}
                    </h1>
                  </div>
                  <Button
                    size="lg"
                    variant={isCompleted ? "default" : "outline"}
                    onClick={handleToggleComplete}
                    disabled={toggling}
                    className="gap-2 md:min-w-[200px]"
                  >
                    {toggling ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating...
                      </>
                    ) : isCompleted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="w-5 h-5" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Card>
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <Streamdown>{lesson.content}</Streamdown>
                </div>
                
                {lesson.mediaUrl && (
                  <div className="mt-8 p-6 bg-accent/30 rounded-lg border border-accent">
                    <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Additional Resource
                    </h3>
                    <a 
                      href={lesson.mediaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-lg break-all"
                    >
                      {lesson.mediaUrl}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex gap-4 justify-between pt-4">
              {prevLesson ? (
                <Link href={`/course/${courseId}/lesson/${prevLesson.id}`}>
                  <Button size="lg" variant="outline" className="gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Previous Lesson</span>
                    <span className="sm:hidden">Previous</span>
                  </Button>
                </Link>
              ) : (
                <div />
              )}
              
              {nextLesson ? (
                <Link href={`/course/${courseId}/lesson/${nextLesson.id}`}>
                  <Button size="lg" className="gap-2">
                    <span className="hidden sm:inline">Next Lesson</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link href={`/course/${courseId}`}>
                  <Button size="lg" variant="default" className="gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Finish Course</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
