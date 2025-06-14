
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PricingPlans = () => {
  const plans = [
    {
      name: "Basic",
      monthlyPrice: 1500,
      successFee: 20,
      currency: "RM",
      description: "Perfect for small recruitment agencies getting started with AI",
      icon: Zap,
      features: [
        "AI-powered candidate matching",
        "Up to 50 job postings/month",
        "Basic predictive analytics",
        "2 CRM seats included",
        "Email support",
        "Standard SLA (48h response)",
        "Monthly AI usage: 1,000 credits",
        "Basic reporting dashboard"
      ],
      limitations: [
        "Limited integration options",
        "No advanced bias filters",
        "No custom branding"
      ]
    },
    {
      name: "Pro",
      monthlyPrice: 4500,
      successFee: 18,
      currency: "RM",
      description: "Most popular choice for growing recruitment teams",
      popular: true,
      icon: Star,
      savings: "Save 25% vs Basic + individual success fees",
      features: [
        "Everything in Basic",
        "Advanced AI candidate matching",
        "Up to 200 job postings/month",
        "Predictive hiring analytics",
        "5 CRM seats included",
        "Priority email + phone support",
        "Enhanced SLA (24h response)",
        "Monthly AI usage: 5,000 credits",
        "Advanced reporting & insights",
        "API integrations available",
        "Bias detection filters",
        "Custom workflow automation"
      ]
    },
    {
      name: "Premium",
      monthlyPrice: 9000,
      annualPrice: 8000,
      successFee: 15,
      annualSuccessFee: 14,
      currency: "RM",
      description: "Enterprise solution for large recruitment operations",
      icon: Crown,
      enterprise: true,
      features: [
        "Everything in Pro",
        "Unlimited job postings",
        "AI-powered talent pipeline",
        "Advanced predictive analytics",
        "Unlimited CRM seats",
        "Dedicated account manager",
        "Premium SLA (12h response)",
        "Monthly AI usage: Unlimited*",
        "White-label reporting",
        "Full API access + webhooks",
        "Advanced bias prevention",
        "Custom AI model training",
        "Multi-office management",
        "Advanced compliance tools"
      ],
      enterpriseNote: "*Fair usage policy applies"
    }
  ];

  const comparisonFeatures = [
    { feature: "Monthly Subscription", basic: "RM 1,500", pro: "RM 4,500", premium: "RM 9,000" },
    { feature: "Annual Option", basic: "—", pro: "—", premium: "RM 8,000/month" },
    { feature: "Success Fee", basic: "20%", pro: "18%", premium: "15% (14% annual)" },
    { feature: "Job Postings/Month", basic: "50", pro: "200", premium: "Unlimited" },
    { feature: "CRM Seats", basic: "2", pro: "5", premium: "Unlimited" },
    { feature: "AI Credits/Month", basic: "1,000", pro: "5,000", premium: "Unlimited*" },
    { feature: "API Integrations", basic: "❌", pro: "✅", premium: "✅ Full Access" },
    { feature: "Bias Detection", basic: "❌", pro: "✅", premium: "✅ Advanced" },
    { feature: "Custom Branding", basic: "❌", pro: "❌", premium: "✅" },
    { feature: "Dedicated Support", basic: "❌", pro: "❌", premium: "✅" },
    { feature: "SLA Response", basic: "48h", pro: "24h", premium: "12h" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Recruiter Subscription Plans
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Hybrid pricing model combining stable monthly subscriptions with performance-aligned success fees. 
            Choose the plan that scales with your recruitment business in Malaysia.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name} 
                className={`relative shadow-lg hover:shadow-xl transition-all duration-300 ${
                  plan.popular 
                    ? 'border-2 border-green-500 transform scale-105' 
                    : plan.enterprise
                      ? 'border-2 border-purple-500'
                      : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                {plan.enterprise && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      ENTERPRISE
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-green-100' : plan.enterprise ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      <IconComponent className={`h-8 w-8 ${
                        plan.popular ? 'text-green-600' : plan.enterprise ? 'text-purple-600' : 'text-blue-600'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-slate-900">
                        {plan.currency}{plan.monthlyPrice.toLocaleString()}
                      </span>
                      <span className="text-slate-500 ml-2">/month</span>
                    </div>
                    {plan.annualPrice && (
                      <div className="mt-2 text-sm text-green-600 font-medium">
                        Annual: {plan.currency}{plan.annualPrice.toLocaleString()}/month
                      </div>
                    )}
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-sm font-semibold text-amber-800">
                      Success Fee: {plan.successFee}%
                      {plan.annualSuccessFee && (
                        <span className="text-green-600"> ({plan.annualSuccessFee}% annual)</span>
                      )}
                    </div>
                    <div className="text-xs text-amber-700 mt-1">
                      of candidate's first-year salary
                    </div>
                  </div>
                  <CardDescription className="mt-4 text-base">
                    {plan.description}
                  </CardDescription>
                  {plan.savings && (
                    <div className="mt-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                      💡 {plan.savings}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <Button 
                    className={`w-full h-12 text-base font-medium mb-8 ${
                      plan.popular 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : plan.enterprise
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Start {plan.name} Plan
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                        <span className="text-slate-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Not included:</p>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-red-400 text-xs mt-1">✗</span>
                            <span className="text-gray-500 text-xs">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.enterpriseNote && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">{plan.enterpriseNote}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Comparison Table */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-slate-900">Detailed Feature Comparison</h3>
              <p className="text-sm text-slate-600 mt-1">Compare all features across subscription tiers</p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Feature</TableHead>
                    <TableHead className="text-center font-semibold">Basic</TableHead>
                    <TableHead className="text-center font-semibold bg-green-50">Pro</TableHead>
                    <TableHead className="text-center font-semibold bg-purple-50">Premium</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonFeatures.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.feature}</TableCell>
                      <TableCell className="text-center">{row.basic}</TableCell>
                      <TableCell className="text-center bg-green-50">{row.pro}</TableCell>
                      <TableCell className="text-center bg-purple-50">{row.premium}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Why Choose Our Hybrid Pricing Model?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-200">💰</div>
              <h4 className="font-semibold mt-2">Predictable Revenue</h4>
              <p className="text-sm text-blue-100 mt-1">Stable monthly subscriptions provide consistent cash flow</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-200">🎯</div>
              <h4 className="font-semibold mt-2">Performance Aligned</h4>
              <p className="text-sm text-blue-100 mt-1">Success fees align our interests with your hiring success</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-200">🔍</div>
              <h4 className="font-semibold mt-2">AI Cost Transparency</h4>
              <p className="text-sm text-blue-100 mt-1">Clear credit system for AI usage with fair usage policies</p>
            </div>
          </div>
          <Button size="lg" className="mt-6 bg-white text-blue-600 hover:bg-blue-50">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
