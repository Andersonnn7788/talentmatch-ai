
import React from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';

const RecruiterPricing = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      currency: "RM",
      period: "month",
      description: "Explore how AI can help you with everyday tasks",
      buttonText: "Your current plan",
      buttonVariant: "outline" as const,
      isPopular: false,
      features: [
        "Access to basic candidate search",
        "Standard candidate profiles",
        "Limited job postings per month",
        "Basic AI matching algorithms",
        "Email support"
      ]
    },
    {
      name: "Plus",
      price: "3000",
      currency: "RM",
      period: "month",
      description: "Level up productivity and creativity with expanded access",
      buttonText: "Get Plus",
      buttonVariant: "default" as const,
      isPopular: true,
      features: [
        "Everything in Free",
        "Advanced AI candidate matching",
        "Unlimited job postings",
        "Priority candidate recommendations",
        "Advanced search filters",
        "Bulk candidate messaging",
        "Analytics and reporting dashboard",
        "Priority support"
      ]
    },
    {
      name: "Pro",
      price: "5000",
      currency: "RM",
      period: "month",
      description: "Get the best of AI recruitment with the highest level of access",
      buttonText: "Get Pro",
      buttonVariant: "secondary" as const,
      isPopular: false,
      features: [
        "Everything in Plus",
        "AI-powered interview scheduling",
        "Advanced candidate scoring algorithms",
        "Custom recruitment workflows",
        "API access for integrations",
        "White-label recruitment portal",
        "Dedicated account manager",
        "24/7 premium support",
        "Custom AI model training"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar userType="recruiter" />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock the power of AI-driven recruitment with our flexible pricing plans
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                plan.isPopular 
                  ? 'border-2 border-green-500 shadow-lg' 
                  : 'border border-slate-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    POPULAR
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-4">
                  {plan.name}
                </CardTitle>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-900">
                    {plan.currency}{plan.price}
                  </span>
                  <span className="text-slate-600 ml-2">
                    {plan.currency === "RM" ? "MYR" : "USD"}/ {plan.period}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  className={`w-full mb-8 h-12 text-base font-semibold ${
                    plan.isPopular 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : plan.name === 'Free'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                  variant={plan.buttonVariant}
                  disabled={plan.name === 'Free'}
                >
                  {plan.buttonText}
                </Button>
                
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-4">
            Have an existing plan? See{" "}
            <a href="#" className="text-blue-600 hover:underline">
              billing help
            </a>
          </p>
          <p className="text-sm text-slate-500">
            Limits apply
          </p>
        </div>
      </main>
    </div>
  );
};

export default RecruiterPricing;
