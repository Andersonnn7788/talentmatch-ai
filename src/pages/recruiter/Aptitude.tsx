
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, BookUser, Briefcase, Check, Plus, FileText } from 'lucide-react';
import Navbar from "@/components/Navbar";
import AptitudeTestCard from "@/components/AptitudeTestCard";

// Sample aptitude test data
const sampleTests = [
  {
    id: "1",
    title: "Software Development Skills",
    description: "Assess coding knowledge and problem-solving abilities",
    questions: 15,
    timeLimit: 45,
    category: "technical",
    created: "2 weeks ago",
    responses: 24
  },
  {
    id: "2",
    title: "Leadership Assessment",
    description: "Evaluate leadership potential and team management skills",
    questions: 10,
    timeLimit: 30,
    category: "soft",
    created: "1 month ago",
    responses: 18
  },
  {
    id: "3",
    title: "Marketing Strategy Test",
    description: "Test knowledge of marketing fundamentals and strategy",
    questions: 20,
    timeLimit: 60,
    category: "technical",
    created: "3 days ago",
    responses: 5
  },
  {
    id: "4",
    title: "Communication Skills",
    description: "Assess written and verbal communication abilities",
    questions: 12,
    timeLimit: 40,
    category: "soft",
    created: "1 week ago",
    responses: 32
  }
];

const Aptitude = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter tests based on active tab
  const filteredTests = activeTab === "all" 
    ? sampleTests 
    : sampleTests.filter(test => test.category === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aptitude Tests</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage assessments for evaluating candidate skills
            </p>
          </div>
          
          <Button className="mt-4 md:mt-0">
            <Plus size={18} className="mr-1" />
            Create New Test
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="flex items-center">
              <FileText size={16} className="mr-1" />
              All Tests
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center">
              <GraduationCap size={16} className="mr-1" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="soft" className="flex items-center">
              <BookUser size={16} className="mr-1" />
              Soft Skills
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <AptitudeTestCard key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <AptitudeTestCard key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="soft" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map(test => (
                <AptitudeTestCard key={test.id} test={test} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Aptitude;
