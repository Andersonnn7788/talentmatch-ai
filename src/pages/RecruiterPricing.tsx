
import React from 'react';
import Navbar from '@/components/Navbar';
import RecruiterPricingPlans from '@/components/RecruiterPricingPlans';

const RecruiterPricing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userType="recruiter" />
      <div className="pt-16">
        <RecruiterPricingPlans />
      </div>
    </div>
  );
};

export default RecruiterPricing;
