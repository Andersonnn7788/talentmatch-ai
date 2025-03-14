import React from 'react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';

const RecruiterHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Content specific to the recruiter home page */}
      </main>
      
      {/* Add the AI Assistant */}
      <AIAssistant userType="recruiter" userName="Rebecca" />
    </div>
  );
};

export default RecruiterHome;
