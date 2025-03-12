
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sparkles, User, BriefcaseBusiness } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight text-primary">
            TalentMatch<span className="text-primary/90">.AI</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-6 text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary">
                <Sparkles className="mr-1 h-3 w-3 animate-float" />
                <span>Powered by AI</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Find the perfect match with <span className="text-primary">TalentMatch.AI</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                Intelligent job matching platform that connects the right talent with the right opportunities, powered by advanced AI algorithms.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/employee/home">
                  <Button size="lg" className="w-full sm:w-auto">
                    <User className="mr-2 h-5 w-5" />
                    Job Seeker
                  </Button>
                </Link>
                
                <Link to="/recruiter/home">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <BriefcaseBusiness className="mr-2 h-5 w-5" />
                    Recruiter
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-background backdrop-blur rounded-2xl flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid-white/10"></div>
                  <div className="relative z-10 p-8">
                    <div className="w-full max-w-md mx-auto glass rounded-xl p-6 shadow-lg transform hover:scale-[1.01] transition-transform duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <BriefcaseBusiness className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-3">
                            <div className="font-semibold">Senior Developer</div>
                            <div className="text-xs text-muted-foreground">TechCorp Inc.</div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-primary">95% Match</div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full rounded bg-primary/20"></div>
                        <div className="h-2 w-3/4 rounded bg-primary/15"></div>
                        <div className="h-2 w-1/2 rounded bg-primary/10"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} TalentMatch.AI. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
