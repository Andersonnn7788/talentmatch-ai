
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Star, 
  StarHalf, 
  Sparkles, 
  Calendar, 
  Download, 
  MoreVertical, 
  Mail, 
  Phone 
} from 'lucide-react';

const Candidates = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  const candidates = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "AJ",
      role: "Senior Front-End Developer",
      skills: ["React", "TypeScript", "Node.js"],
      experience: "8 years",
      education: "M.S. Computer Science",
      match: 96,
      status: "Interview scheduled",
      location: "San Francisco, CA",
      appliedDate: "May 10, 2023",
      starred: true
    },
    {
      id: 2,
      name: "Morgan Smith",
      avatar: "MS",
      role: "Full Stack Engineer",
      skills: ["JavaScript", "React", "Python", "Django"],
      experience: "6 years",
      education: "B.S. Software Engineering",
      match: 92,
      status: "Assessment completed",
      location: "Remote",
      appliedDate: "May 8, 2023",
      starred: true
    },
    {
      id: 3,
      name: "Jamie Wilson",
      avatar: "JW",
      role: "UI/UX Developer",
      skills: ["UI/UX", "Figma", "React", "SCSS"],
      experience: "5 years",
      education: "B.A. Design",
      match: 88,
      status: "Application received",
      location: "Austin, TX",
      appliedDate: "May 5, 2023",
      starred: false
    },
    {
      id: 4,
      name: "Taylor Reed",
      avatar: "TR",
      role: "Backend Developer",
      skills: ["Java", "Spring", "Microservices"],
      experience: "7 years",
      education: "B.S. Computer Engineering",
      match: 85,
      status: "Application received",
      location: "Chicago, IL",
      appliedDate: "May 3, 2023",
      starred: false
    },
    {
      id: 5,
      name: "Jordan Patel",
      avatar: "JP",
      role: "DevOps Engineer",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      experience: "4 years",
      education: "B.S. Information Technology",
      match: 82,
      status: "Application received",
      location: "Seattle, WA",
      appliedDate: "May 1, 2023",
      starred: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Candidates</h1>
            <p className="text-muted-foreground">Browse and manage candidates for your open positions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Download size={16} /> Export
            </Button>
            <Button size="sm" className="gap-1">
              <Mail size={16} /> Email All
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search candidates..." 
                className="pl-10"
              />
            </div>
            <Select defaultValue="position">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="position">All Positions</SelectItem>
                <SelectItem value="frontend">Front-End Developer</SelectItem>
                <SelectItem value="fullstack">Full Stack Engineer</SelectItem>
                <SelectItem value="backend">Backend Developer</SelectItem>
                <SelectItem value="devops">DevOps Engineer</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant={filterOpen ? "default" : "outline"} 
              onClick={() => setFilterOpen(!filterOpen)}
              className="gap-1"
            >
              <Filter size={16} /> Filter
            </Button>
          </div>

          {filterOpen && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Experience</label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue placeholder="Experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Experience</SelectItem>
                        <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (6+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Location</label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Location</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="sf">San Francisco, CA</SelectItem>
                        <SelectItem value="nyc">New York, NY</SelectItem>
                        <SelectItem value="austin">Austin, TX</SelectItem>
                        <SelectItem value="seattle">Seattle, WA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Application Status</label>
                    <Select defaultValue="any">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Status</SelectItem>
                        <SelectItem value="new">New Applications</SelectItem>
                        <SelectItem value="assessment">Assessment Completed</SelectItem>
                        <SelectItem value="interview">Interview Scheduled</SelectItem>
                        <SelectItem value="offer">Offer Extended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" size="sm">Reset</Button>
                  <Button size="sm">Apply Filters</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Candidate Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Candidates (142)</TabsTrigger>
            <TabsTrigger value="starred">Starred (12)</TabsTrigger>
            <TabsTrigger value="new">New (28)</TabsTrigger>
            <TabsTrigger value="interview">Interview (8)</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Candidate List */}
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-4 md:p-6">
                  {/* Candidate Info */}
                  <div className="flex-1 flex items-start gap-4 mb-4 md:mb-0">
                    <Avatar className="h-12 w-12 text-lg font-semibold bg-primary/10 text-primary">
                      {candidate.avatar}
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-lg">{candidate.name}</h3>
                        {candidate.starred && <Star size={16} className="text-amber-500 fill-amber-500" />}
                      </div>
                      <p className="text-muted-foreground">{candidate.role}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {candidate.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match and Status */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:pl-4">
                    <div className="flex flex-col items-center px-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={16} className="text-amber-500" />
                        <span className="font-semibold">{candidate.match}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Match</span>
                    </div>

                    <div className="flex flex-col px-2">
                      <div className="mb-1 font-medium">{candidate.experience}</div>
                      <span className="text-xs text-muted-foreground">Experience</span>
                    </div>

                    <div className="flex flex-col px-2">
                      <div className="mb-1 font-medium">{candidate.location}</div>
                      <span className="text-xs text-muted-foreground">Location</span>
                    </div>

                    <div className="flex flex-col px-2">
                      <div className="mb-1 font-medium text-primary">{candidate.status}</div>
                      <span className="text-xs text-muted-foreground">Status</span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                        <Mail size={16} />
                      </Button>
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                        <Phone size={16} />
                      </Button>
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                        <Calendar size={16} />
                      </Button>
                      <Button size="sm" variant="outline" className="h-9 w-9 p-0">
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      
      {/* Add the AI Assistant */}
      <AIAssistant userType="recruiter" userName="Rebecca" />
    </div>
  );
};

export default Candidates;
