import { Heart, Github, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-card-foreground">About LearningPod</h3>
            <p className="text-sm text-muted-foreground">
              An offline-first learning platform designed for homeless and community shelters in Lagos, Nigeria. 
              Empowering learners with literacy and vocational training.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-card-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">Home</a>
              </li>
              <li>
                <a href="/catalog" className="hover:text-primary transition-colors">Browse Courses</a>
              </li>
              <li>
                <a href="/admin" className="hover:text-primary transition-colors">Admin Panel</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-card-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Works completely offline</li>
              <li>✓ Track your progress</li>
              <li>✓ Download courses for later</li>
              <li>✓ Export learning data</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for community education
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} LearningPod. Empowering learners everywhere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
