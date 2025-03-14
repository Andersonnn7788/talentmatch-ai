import React from 'react';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';

const EmployeeHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="employee" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Content specific to the employee home page */}
      </main>
      
      {/* Add the AI Assistant */}
      <AIAssistant userType="employee" userName="Anderson" />
    </div>
  );
};

export default EmployeeHome;
