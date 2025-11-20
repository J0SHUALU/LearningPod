import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Course, exportProgressCSV, saveCourse } from "@/lib/db";
import { Download, Upload, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Admin() {
  const [jsonInput, setJsonInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handleUploadCourse() {
    if (!jsonInput.trim()) {
      toast.error('Please paste course JSON');
      return;
    }

    setUploading(true);
    try {
      // Parse and validate JSON
      const courseData = JSON.parse(jsonInput);
      
      // Validate structure
      if (!courseData.id || !courseData.title || !Array.isArray(courseData.lessons)) {
        throw new Error('Invalid course structure. Must have id, title, and lessons array.');
      }

      // Save to IndexedDB
      await saveCourse(courseData as Course);
      
      toast.success(`✓ Course "${courseData.title}" uploaded successfully!`);
      setJsonInput('');
    } catch (error) {
      console.error('Error uploading course:', error);
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON format. Please check your syntax.');
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to upload course');
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleExportProgress() {
    setExporting(true);
    try {
      const csv = await exportProgressCSV();
      
      if (!csv || csv.split('\n').length <= 1) {
        toast.error('No progress data to export');
        return;
      }

      // Create download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learningpod-progress-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('✓ Progress data exported successfully!');
    } catch (error) {
      console.error('Error exporting progress:', error);
      toast.error('Failed to export progress data');
    } finally {
      setExporting(false);
    }
  }

  const exampleCourse = {
    id: "example-course-1",
    title: "Example Course",
    description: "This is an example course description",
    lessons: [
      {
        id: "lesson-1",
        title: "First Lesson",
        content: "This is the lesson content. You can use **markdown** formatting.\n\n- Bullet points\n- Are supported\n\n**Bold** and *italic* text work too!",
        mediaUrl: "https://example.com/video.mp4"
      },
      {
        id: "lesson-2",
        title: "Second Lesson",
        content: "Add more lessons by including them in the lessons array."
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Manage courses and export learner progress data
              </p>
            </div>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
                <TabsTrigger value="upload" className="gap-2 text-base">
                  <Upload className="w-4 h-4" />
                  Upload Course
                </TabsTrigger>
                <TabsTrigger value="export" className="gap-2 text-base">
                  <Download className="w-4 h-4" />
                  Export Data
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FileJson className="w-6 h-6" />
                      Upload Course JSON
                    </CardTitle>
                    <CardDescription className="text-base">
                      Paste course JSON data to add a new course to the catalog. The course will be saved locally and available offline.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Textarea
                      placeholder="Paste course JSON here..."
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="min-h-[350px] font-mono text-sm"
                    />
                    
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        size="lg"
                        onClick={handleUploadCourse}
                        disabled={uploading || !jsonInput.trim()}
                        className="gap-2"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" />
                            Upload Course
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        size="lg"
                        variant="outline"
                        onClick={() => setJsonInput(JSON.stringify(exampleCourse, null, 2))}
                        className="gap-2"
                      >
                        <FileJson className="w-5 h-5" />
                        Load Example
                      </Button>
                    </div>

                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Course JSON Format</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-sm overflow-x-auto text-muted-foreground">
{`{
  "id": "unique-course-id",
  "title": "Course Title",
  "description": "Course description",
  "lessons": [
    {
      "id": "lesson-id",
      "title": "Lesson Title",
      "content": "Lesson content (supports markdown)",
      "mediaUrl": "https://... (optional)"
    }
  ]
}`}
                        </pre>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <FileSpreadsheet className="w-6 h-6" />
                      Export Progress Data
                    </CardTitle>
                    <CardDescription className="text-base">
                      Download learner progress data as a CSV file for reporting and analysis.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-accent/30 border border-accent rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-lg text-foreground">What's included in the export?</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>Course ID and Course Title</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>Lesson ID and Lesson Title</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>Completion Status (Yes/No)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>Timestamp of completion</span>
                        </li>
                      </ul>
                    </div>

                    <Button 
                      size="lg"
                      onClick={handleExportProgress}
                      disabled={exporting}
                      className="gap-2"
                    >
                      {exporting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Export Progress CSV
                        </>
                      )}
                    </Button>

                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          <strong>Note:</strong> The exported CSV file can be opened in Excel, Google Sheets, 
                          or any spreadsheet application for further analysis and reporting.
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
