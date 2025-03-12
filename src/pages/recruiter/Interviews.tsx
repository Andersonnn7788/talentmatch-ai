
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import InterviewMessage, { InterviewMessage as IInterviewMessage } from '@/components/InterviewMessage';
import InterviewChat from '@/components/InterviewChat';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Search, Video, X } from 'lucide-react';

// Sample interview data for demo
const interviewMessages: IInterviewMessage[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    message: 'I confirm that I can attend the interview on Thursday at 2pm.',
    date: 'Today',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: true,
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    message: 'Thank you for the opportunity. I am available for the interview on Friday at 10am.',
    date: 'Yesterday',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: false,
  },
  {
    id: '3',
    name: 'Emily Johnson',
    message: 'I have some questions about the technical assessment before our interview. Could you clarify?',
    date: 'May 10',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: false,
  },
  {
    id: '4',
    name: 'James Wilson',
    message: 'Looking forward to discussing the role in more detail during our scheduled interview.',
    date: 'May 8',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: false,
  },
];

// Current active interview
const activeCandidate = {
  id: '1',
  name: 'Sarah Chen',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const Interviews = () => {
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredInterviews = searchQuery
    ? interviewMessages.filter(interview => 
        interview.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : interviewMessages;
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">Interviews</h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                Schedule and manage candidate interviews
              </p>
            </div>
            
            <Button className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <Plus size={16} className="mr-2" /> Schedule Interview
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left sidebar with interview list */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidates"
                  className="pl-10"
                />
                {searchQuery && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery('')}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="scheduled" className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Scheduled</span>
                  </TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="scheduled" className="space-y-4 mt-4">
                  {filteredInterviews.length > 0 ? (
                    filteredInterviews.map((interview) => (
                      <InterviewMessage key={interview.id} message={interview} />
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {searchQuery ? 'No matching candidates found.' : 'No scheduled interviews.'}
                    </p>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4 mt-4">
                  <p className="text-center text-muted-foreground py-8">No completed interviews.</p>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right side with interview chat */}
            <div className="md:col-span-2 glass rounded-lg shadow-sm h-[600px] overflow-hidden">
              <InterviewChat interviewee={activeCandidate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interviews;
