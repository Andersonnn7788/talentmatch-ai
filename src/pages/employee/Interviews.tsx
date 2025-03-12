
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import InterviewMessage, { InterviewMessage as IInterviewMessage } from '@/components/InterviewMessage';
import InterviewChat from '@/components/InterviewChat';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Video } from 'lucide-react';

// Sample interview data for demo
const interviewMessages: IInterviewMessage[] = [
  {
    id: '1',
    name: 'Jenny',
    message: 'Hi, Anderson. I would like to schedule an interview with you this Thursday 2pm.',
    date: 'Apr 7',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: true,
  },
  {
    id: '2',
    name: 'Andrew',
    message: 'Hi, there. I am Andrew from XX company. I would like to schedule an interview with you.',
    date: 'May 6',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: true,
  },
  {
    id: '3',
    name: 'Jason',
    message: 'Hi, my name is Jason. You\'re shortlisted to be one of the candidates sitting for our position.',
    date: 'Jan 1',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: true,
  },
  {
    id: '4',
    name: 'Johnson',
    message: 'Hello, I am Johnson, HR from YY company. Are you free 15 mins from now to have an interview?',
    date: 'Apr 7',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    unread: false,
  },
];

// Current active interview
const activeInterview = {
  id: '1',
  name: 'Mr Kevin',
  message: 'Hi, Anderson Ling! You have an interview with Mr Kevin now:',
  profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

const Interviews = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 animate-fade-in">Interviews</h1>
              <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                Manage your upcoming and past interview sessions
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left sidebar with interview list */}
            <div className="space-y-4">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming" className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Upcoming</span>
                  </TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4 mt-4">
                  {interviewMessages.map((interview) => (
                    <InterviewMessage key={interview.id} message={interview} />
                  ))}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4 mt-4">
                  <p className="text-center text-muted-foreground py-8">No past interviews.</p>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right side with interview chat */}
            <div className="md:col-span-2 glass rounded-lg shadow-sm h-[600px] overflow-hidden">
              <InterviewChat interviewee={activeInterview} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interviews;
