import React from "react";
import { FileText, Users, Clock, CreditCard, ShieldAlert, XCircle } from "lucide-react";

const TermsOfService = () => {
  const sections = [
    {
      id: "usage",
      title: "1. Platform Usage",
      icon: <FileText className="text-indigo-600" size={24} />,
      content: "Rentify is an online marketplace that allows users to rent or sell items. We act as a facilitator; Rentify does not own, inspect, or guarantee the quality of the products listed by third-party sellers.",
    },
    {
      id: "responsibility",
      title: "2. User Responsibility",
      icon: <Users className="text-blue-600" size={24} />,
      content: "You are responsible for maintaining the confidentiality of your account. Users must provide accurate identity details, valid contact information, and honest product descriptions.",
    },
    {
      id: "rental",
      title: "3. Rental Rules",
      icon: <Clock className="text-purple-600" size={24} />,
      content: "Renters are required to provide valid physical identity documents during the exchange. All items must be returned in the same condition as received, barring normal wear and tear.",
    },
    {
      id: "payments",
      title: "4. Payments & Fees",
      icon: <CreditCard className="text-green-600" size={24} />,
      content: "Transactions are processed through secure encrypted gateways. By using the platform, you agree to our service fee structure, which is deducted from the final payout to the seller.",
    },
    {
      id: "cancellations",
      title: "5. Cancellations",
      icon: <XCircle className="text-orange-600" size={24} />,
      content: "Rentify reserves the right to cancel any transaction found to be suspicious. Refund eligibility for cancellations is determined based on the timing of the request and the seller's policy.",
    },
    {
      id: "suspension",
      title: "6. Account Suspension",
      icon: <ShieldAlert className="text-red-600" size={24} />,
      content: "Fraudulent activity, harassment, or providing false documentation will lead to immediate and permanent account suspension without prior notice.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-8 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
            Legal Documentation
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-500 leading-relaxed max-w-2xl">
            Please read these terms carefully before using our platform. By accessing or using Rentify, you agree to be bound by these terms and all terms incorporated by reference.
          </p>
          <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400 font-medium">
            <Clock size={16} />
            Last Updated: January 2026
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className="group bg-white rounded-2xl p-6 md:p-8 border border-slate-200 hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start gap-5">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY NOTE */}
        <div className="mt-12 p-8 bg-slate-800 rounded-3xl text-white">
          <h3 className="text-lg font-bold mb-2">Questions about our terms?</h3>
          <p className="text-slate-400 text-sm mb-6">
            If you have any questions regarding these terms, please contact our legal team at ranamayank987@gmail.com.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-sm font-bold transition-colors">
            Contact Support
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Rentify Technologies Inc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;