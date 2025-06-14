
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Briefcase } from 'lucide-react';

const RecruiterPricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Basic",
      monthlyPrice: "1,500",
      successFee: "20%",
      currency: "RM",
      period: "month",
      description: "Perfect for small recruiting teams getting started with AI-powered hiring",
      buttonText: "Get Basic",
      buttonVariant: "outline" as const,
      isPopular: false,
      icon: Briefcase,
      savings: null,
      features: [
        "Basic AI candidate matching",
        "5 active job postings",
        "Standard candidate profiles",
        "Email support",
        "Basic analytics dashboard",
        "CRM for up to 2 seats",
        "Standard integrations (LinkedIn, job boards)",
        "Monthly AI credits: 500 searches",
        "Basic bias detection filters"
      ],
      limits: [
        "Limited to 10 hires per month",
        "Standard response time: 48 hours",
        "Basic reporting only"
      ]
    },
    {
      name: "Pro",
      monthlyPrice: "3,000",
      successFee: "18%",
      currency: "RM",
      period: "month",
      description: "Advanced AI tools and priority support for growing recruitment agencies",
      buttonText: "Get Pro",
      buttonVariant: "default" as const,
      isPopular: true,
      icon: Star,
      savings: "Save 25% vs Basic + individual success fees",
      features: [
        "Everything in Basic",
        "Advanced AI candidate matching & scoring",
        "15 active job postings",
        "Priority candidate recommendations",
        "Advanced search filters & Boolean queries",
        "Bulk candidate messaging",
        "Analytics and predictive hiring insights",
        "Priority support (24-hour response)",
        "CRM for up to 5 seats",
        "Advanced integrations (ATS, HRIS)",
        "Monthly AI credits: 1,500 searches",
        "Advanced bias detection & diversity analytics",
        "Custom recruitment workflows"
      ],
      limits: [
        "Up to 25 hires per month",
        "Advanced reporting & forecasting",
        "SLA: 99.5% uptime guarantee"
      ]
    },
    {
      name: "Premium",
      monthlyPrice: isAnnual ? "4,500" : "5,000",
      annualSavings: isAnnual ? "RM 6,000 saved annually" : null,
      successFee: isAnnual ? "14%" : "15%",
      currency: "RM",
      period: "month",
      description: "Enterprise-grade AI recruitment platform with white-label options",
      buttonText: isAnnual ? "Get Premium (Annual)" : "Get Premium",
      buttonVariant: "secondary" as const,
      isPopular: false,
      icon: Crown,
      savings: "Save 40% vs Pro + individual success fees",
      features: [
        "Everything in Pro",
        "Unlimited active job postings",
        "AI-powered interview scheduling",
        "Advanced candidate scoring algorithms",
        "Custom AI model training",
        "White-label recruitment portal",
        "Dedicated account manager",
        "24/7 premium support",
        "CRM for unlimited seats",
        "Custom integrations & API access",
        "Unlimited AI credits",
        "Advanced bias mitigation suite",
        "Custom recruitment workflows",
        "Advanced compliance tools",
        "Multi-language candidate matching"
      ],
      limits: [
        "Unlimited hires",
        "Real-time reporting & custom dashboards",
        "SLA: 99.9% uptime guarantee",
        "Dedicated infrastructure"
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
            Hybrid Pricing Plans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Stable monthly subscription + performance-aligned success fees. 
            Pay for platform access, succeed together on placements.
          </p>
          
          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isAnnual ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isAnnual ? 'font-semibold' : 'text-muted-foreground'}`}>
                Annual
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Save up to RM 6,000
              </Badge>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                plan.isPopular 
                  ? 'border-2 border-green-500 shadow-lg scale-105' 
                  : 'border border-slate-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-6 pt-8">
                <div className="flex items-center justify-center mb-4">
                  <plan.icon className="h-8 w-8 text-slate-700" />
                </div>
                
                <CardTitle className="text-2xl font-bold text-slate-900 mb-4">
                  {plan.name}
                </CardTitle>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-slate-900">
                      {plan.currency}{plan.monthlyPrice}
                    </span>
                    <span className="text-slate-600">
                      /month
                    </span>
                  </div>
                  {plan.annualSavings && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {plan.annualSavings}
                    </p>
                  )}
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{plan.successFee}</strong> success fee on successful hires
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {plan.description}
                </p>

                {plan.savings && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800 font-medium">
                      💡 {plan.savings}
                    </p>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  className={`w-full mb-6 h-12 text-base font-semibold ${
                    plan.isPopular 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : plan.name === 'Premium'
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </Button>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Features Included:</h4>
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-slate-900 mb-3">Plan Limits:</h4>
                    <div className="space-y-2">
                      {plan.limits.map((limit, limitIndex) => (
                        <div key={limitIndex} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 text-sm leading-relaxed">
                            {limit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h3 className="text-2xl font-bold text-center mb-6">Why Choose Our Hybrid Model?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Predictable Monthly Costs</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Fixed monthly subscription ensures you can budget for AI tools and platform access, 
                  regardless of hiring volume fluctuations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Performance-Aligned Success</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Success fees align our interests with yours - we only succeed when you make successful placements.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Transparent AI Costs</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Clear monthly AI credits with no hidden inference costs. Upgrade anytime as your usage grows.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Malaysia-Focused</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Pricing in RM with local payment methods, compliance with Malaysian employment laws, 
                  and Southeast Asian candidate matching algorithms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-4">
            Need a custom enterprise solution?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact our sales team
            </a>
          </p>
          <p className="text-sm text-slate-500">
            All plans include 14-day free trial. Success fees apply only after trial period.
          </p>
        </div>
      </main>
    </div>
  );
};

export default RecruiterPricing;
