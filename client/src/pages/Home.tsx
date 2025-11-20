import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BookOpen, Download, TrendingUp, Upload, Wifi, WifiOff } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block animate-bounce">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-lg">
                  <BookOpen className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">
                Welcome to <span className="text-primary">LearningPod</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Access literacy and vocational training courses designed for community centers. 
                Learn at your own pace, even without internet!
              </p>

              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <Link href="/catalog">
                  <Button size="lg" className="text-lg px-8 h-14 gap-2 shadow-lg hover:shadow-xl transition-all">
                    <BookOpen className="w-5 h-5" />
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 gap-2">
                    <Upload className="w-5 h-5" />
                    Admin Panel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
              Why Choose LearningPod?
            </h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <WifiOff className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">Fully Offline</h3>
                  <p className="text-muted-foreground">
                    Download courses and learn without internet connection
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">Track Progress</h3>
                  <p className="text-muted-foreground">
                    Mark lessons complete and see your learning journey
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">Easy to Use</h3>
                  <p className="text-muted-foreground">
                    Simple interface with large buttons and clear text
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Download className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">Export Data</h3>
                  <p className="text-muted-foreground">
                    Staff can export progress reports for analysis
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-accent/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
                How It Works
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Browse Available Courses",
                    description: "Explore our catalog of literacy and vocational training courses designed for learners at all levels."
                  },
                  {
                    step: "2",
                    title: "Download Courses to Use Offline",
                    description: "Save courses to your device so you can access them anytime, even without internet."
                  },
                  {
                    step: "3",
                    title: "Learn at Your Own Pace",
                    description: "Go through lessons one by one, mark them complete, and track your progress as you learn."
                  },
                  {
                    step: "4",
                    title: "Staff Can Export Progress Data",
                    description: "Center staff can download CSV reports to monitor learner progress and outcomes."
                  }
                ].map((item) => (
                  <Card key={item.step} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-card-foreground">{item.title}</h3>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-4xl font-bold">Ready to Start Learning?</h2>
                <p className="text-xl opacity-90">
                  Join thousands of learners improving their skills through LearningPod
                </p>
                <Link href="/catalog">
                  <Button size="lg" variant="secondary" className="text-lg px-8 h-14 gap-2">
                    <BookOpen className="w-5 h-5" />
                    Get Started Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
