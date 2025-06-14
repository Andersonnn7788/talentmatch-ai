
import React from 'react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import JobSearchBar from '@/components/JobSearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart3, BriefcaseBusiness, Flame, GraduationCap, ListChecks, Users, TrendingUp, Clock, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome Section - Enhanced */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Online</span>
              </div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-slate-900 to-blue-600 bg-clip-text text-transparent">
                Welcome back, Anderson
              </h1>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl">
                Your personalized job search dashboard is ready. Discover opportunities tailored to your skills and career goals.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" className="gap-2 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all">
                <Link to="/employee/job-matches">
                  <TrendingUp size={16} />
                  View Matches
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
              <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                <Link to="/employee/profile">
                  <Star size={16} />
                  Update Profile
                  <ArrowUpRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Job Search Bar */}
        <section className="mb-12">
          <JobSearchBar onSearch={handleSearch} onAIMatch={handleAIMatch} />
        </section>

        {/* Enhanced Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Job Matches</CardTitle>
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">24</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 font-medium">+3 new</span> since yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
              <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                <ListChecks className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">12</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 font-medium">+2 sent</span> this week
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Interviews</CardTitle>
              <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">3</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-500" />
                <span className="text-purple-600 font-medium">1 upcoming</span> this week
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
              <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">128</div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 font-medium">+24%</span> this month
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Job Matches - Enhanced */}
          <section className="lg:col-span-2">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold">Recent Job Matches</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Personalized opportunities based on your profile
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/employee/job-matches" className="text-blue-600 hover:text-blue-700">
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Senior Front-End Developer",
                      company: "TechCorp Inc.",
                      match: 95,
                      location: "Remote",
                      salary: "$120K - $140K",
                      posted: "2 days ago",
                      urgent: true
                    },
                    {
                      title: "Full Stack Engineer",
                      company: "DataWorks Labs",
                      match: 88,
                      location: "San Francisco, CA (Hybrid)",
                      salary: "$130K - $150K",
                      posted: "5 days ago",
                      urgent: false
                    },
                    {
                      title: "UI/UX Developer",
                      company: "Creative Solutions",
                      match: 82,
                      location: "New York, NY (On-site)",
                      salary: "$110K - $130K",
                      posted: "1 week ago",
                      urgent: false
                    }
                  ].map((job, index) => (
                    <div key={index} className="group p-4 rounded-xl border border-slate-200 bg-white/50 hover:bg-white/80 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                            <BriefcaseBusiness size={20} className="text-blue-600" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900">{job.title}</h3>
                              {job.urgent && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                  Urgent
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                              <span>{job.company}</span>
                              <span>•</span>
                              <span>{job.location}</span>
                              <span>•</span>
                              <span className="font-medium text-green-600">{job.salary}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{job.posted}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-3">
                          <div className="flex items-center gap-1">
                            <Flame size={14} className="text-orange-500" />
                            <span className="font-semibold text-sm text-orange-600">{job.match}% Match</span>
                          </div>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 opacity-80 group-hover:opacity-100 transition-opacity">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6 bg-white/50 hover:bg-white/80" asChild>
                  <Link to="/employee/job-matches">View all job matches</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Enhanced Upcoming Tasks */}
          <section>
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Upcoming Tasks</CardTitle>
                <CardDescription>Your scheduled activities and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white/50 hover:bg-white/80 transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={18} className="text-green-600" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-slate-900">Complete Coding Assessment</h3>
                        <p className="text-sm text-muted-foreground">TechCorp Inc. • Due in 2 days</p>
                        <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700" asChild>
                          <Link to="/employee/aptitude-tests">Start Now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white/50 hover:bg-white/80 transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                        <Users size={18} className="text-purple-600" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-slate-900">Interview with DataWorks</h3>
                        <p className="text-sm text-muted-foreground">Thu, May 16 • 11:00 AM</p>
                        <Button size="sm" variant="outline" className="mt-2 bg-white/50 hover:bg-white/80" asChild>
                          <Link to="/employee/interviews">Prepare</Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white/50 hover:bg-white/80 transition-all duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                        <ListChecks size={18} className="text-blue-600" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-slate-900">Update Resume Skills</h3>
                        <p className="text-sm text-muted-foreground">Recommended by AI assistant</p>
                        <Button size="sm" variant="outline" className="mt-2 bg-white/50 hover:bg-white/80" asChild>
                          <Link to="/employee/profile">Update</Link>
                        </Button>
                      </div>
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
