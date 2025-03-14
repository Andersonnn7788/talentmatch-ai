
import React from 'react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import JobSearchBar from '@/components/JobSearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, Flame, GraduationCap, ListChecks, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const EmployeeHome = () => {
  const handleSearch = (searchParams: {
    query: string;
    jobType: string;
    industry: string;
    location: string;
  }) => {
    console.log('Search params:', searchParams);
    toast.success('Searching for jobs...');
    // In a real app, we would fetch jobs based on these params
  };

  const handleAIMatch = () => {
    console.log('AI Match clicked');
    toast.success('AI is matching your profile with available jobs...');
    // In a real app, we would trigger the AI matching process
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, Anderson</h1>
              <p className="text-muted-foreground text-lg">Here's what's happening with your job search</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" className="gap-1">
                <Link to="/employee/job-matches">
                  View jobs <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button asChild className="gap-1">
                <Link to="/employee/profile">
                  Update profile <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Job Search Bar */}
        <section className="mb-10">
          <JobSearchBar onSearch={handleSearch} onAIMatch={handleAIMatch} />
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Job Matches</CardTitle>
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 3 new</span> since yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
              <ListChecks className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 2 sent</span> this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 1 new</span> upcoming
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-emerald-500 font-medium">↑ 24%</span> this month
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Recent Jobs and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Job Matches */}
          <section className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Matches</CardTitle>
                <CardDescription>Jobs that match your skills and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Senior Front-End Developer",
                      company: "TechCorp Inc.",
                      match: 95,
                      location: "Remote",
                      salary: "$120K - $140K"
                    },
                    {
                      title: "Full Stack Engineer",
                      company: "DataWorks Labs",
                      match: 88,
                      location: "San Francisco, CA (Hybrid)",
                      salary: "$130K - $150K"
                    },
                    {
                      title: "UI/UX Developer",
                      company: "Creative Solutions",
                      match: 82,
                      location: "New York, NY (On-site)",
                      salary: "$110K - $130K"
                    }
                  ].map((job, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg border">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                        <BriefcaseBusiness size={20} />
                      </div>
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{job.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <span className="text-muted-foreground">{job.company}</span>
                          <span className="text-muted-foreground">{job.location}</span>
                          <span className="text-muted-foreground">{job.salary}</span>
                        </div>
                      </div>
                      <div className="ml-auto pl-4 flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Flame size={14} className="text-orange-500" />
                          <span className="font-medium text-sm">{job.match}% Match</span>
                        </div>
                        <Button size="sm" variant="ghost" className="mt-2 h-8">View Job</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/employee/job-matches">View all job matches</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Tasks */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your scheduled activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start p-3 rounded-lg border">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Complete Coding Assessment</h3>
                      <p className="text-sm text-muted-foreground">TechCorp Inc. • Due in 2 days</p>
                      <Button size="sm" variant="outline" className="mt-2 h-8" asChild>
                        <Link to="/employee/aptitude-tests">Start Now</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start p-3 rounded-lg border">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Interview with DataWorks</h3>
                      <p className="text-sm text-muted-foreground">Thu, May 16 • 11:00 AM</p>
                      <Button size="sm" variant="outline" className="mt-2 h-8" asChild>
                        <Link to="/employee/interviews">Prepare</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start p-3 rounded-lg border">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4 shrink-0">
                      <ListChecks size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Update Resume Skills</h3>
                      <p className="text-sm text-muted-foreground">Recommended by AI assistant</p>
                      <Button size="sm" variant="outline" className="mt-2 h-8" asChild>
                        <Link to="/employee/profile">Update</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      
      {/* Add the AI Assistant */}
      <AIAssistant userType="employee" userName="Anderson" />
    </div>
  );
};

export default EmployeeHome;
