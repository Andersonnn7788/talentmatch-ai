
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const PricingPlans = () => {
  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Explore how AI can help you with job matching",
      current: true,
      features: [
        "Basic AI job matching",
        "Standard resume analysis", 
        "View up to 5 job matches per day",
        "Basic profile creation",
        "Limited interview scheduling",
        "Community support"
      ]
    },
    {
      name: "Plus",
      price: 20,
      description: "Level up your job search with expanded AI features",
      popular: true,
      features: [
        "Everything in Free",
        "Advanced AI job matching with 95%+ accuracy",
        "Unlimited job matches and applications",
        "Enhanced resume analysis with improvement suggestions",
        "Priority interview scheduling",
        "AI-powered interview preparation",
        "Salary negotiation insights",
        "Career path recommendations",
        "Email support"
      ]
    },
    {
      name: "Pro",
      price: 200,
      description: "Get the best job matching experience with premium features",
      features: [
        "Everything in Plus",
        "Premium AI matching with real-time job alerts",
        "Unlimited access to all premium job listings",
        "Personal career coach AI assistant",
        "Advanced analytics and career insights",
        "Direct recruiter connections",
        "Executive-level job opportunities",
        "Custom interview coaching sessions",
        "Priority customer support",
        "Professional resume writing service"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Upgrade Your Job Search
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the plan that best fits your career goals and unlock the full potential of AI-powered job matching
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular 
                  ? 'border-2 border-green-500 transform scale-105' 
                  : plan.current 
                    ? 'border-2 border-gray-300' 
                    : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    POPULAR
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-slate-900">
                    ${plan.price}
                  </span>
                  <span className="text-slate-500 ml-2">
                    USD/month
                  </span>
                </div>
                <CardDescription className="mt-4 text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-8">
                  {plan.current ? (
                    <Button 
                      variant="outline" 
                      className="w-full h-12 text-base bg-gray-100 text-gray-600 cursor-not-allowed"
                      disabled
                    >
                      Your current plan
                    </Button>
                  ) : (
                    <Button 
                      className={`w-full h-12 text-base font-medium ${
                        plan.popular 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-black hover:bg-gray-800 text-white'
                      }`}
                    >
                      Get {plan.name}
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-slate-700 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.name === "Free" && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Have questions about upgrading?{" "}
                      <button className="text-blue-600 hover:underline">
                        Contact support
                      </button>
                    </p>
                  </div>
                )}

                {plan.name === "Plus" && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Limits apply based on usage patterns
                    </p>
                  </div>
                )}

                {plan.name === "Pro" && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Unlimited features subject to fair usage policy.{" "}
                      <button className="text-blue-600 hover:underline">
                        Learn more
                      </button>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
