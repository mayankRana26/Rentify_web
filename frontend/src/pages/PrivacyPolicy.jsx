import React from "react";
import { ShieldCheck, Database, Lock, EyeOff, UserCheck, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const policies = [
    {
      title: "1. Data Collection",
      icon: <Database className="text-cyan-600" size={24} />,
      content: "We collect essential information such as your name, phone number, email address, and delivery location. This data is used exclusively to facilitate rentals and ensure smooth communication between buyers and sellers.",
    },
    {
      title: "2. Document Safety",
      icon: <ShieldCheck className="text-emerald-600" size={24} />,
      content: "Your privacy is our priority. Sensitive identity documents (Aadhaar, DL) are never stored on our servers. Verification happens offline and in-person during the item handover to prevent digital data leaks.",
    },
    {
      title: "3. Payment Security",
      icon: <Lock className="text-amber-600" size={24} />,
      content: "Financial transactions are handled by industry-leading, PCI-compliant payment gateways. Rentify does not store your credit card or bank account details directly on our platform.",
    },
    {
      title: "4. Data Sharing",
      icon: <EyeOff className="text-rose-600" size={24} />,
      content: "We have a strict 'No-Sell' policy. Your personal data is never sold or shared with third-party advertisers. Information is only shared with your transaction partner (buyer/seller) to complete a rental.",
    },
    {
      title: "5. User Rights",
      icon: <UserCheck className="text-indigo-600" size={24} />,
      content: "You own your data. At any time, you can request a copy of your stored information or ask for permanent account deletion via our support channels.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <ShieldCheck size={48} className="text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            At Rentify, we are committed to protecting your personal information and your right to privacy.
          </p>
        </div>

        {/* POLICY CARDS */}
        <div className="grid gap-6">
          {policies.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-gray-50 rounded-xl">
                {item.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CONTACT BOX */}
        <div className="mt-12 bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <Mail size={20} className="text-indigo-600" />
            Privacy Questions?
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            If you have questions about how we handle your data, reach out to our privacy officer.
          </p>
          <a 
            href="mailto:ranamayank987@gmail.com" 
            className="text-indigo-600 font-bold hover:underline"
          >
            ranamayank987@gmail.com
          </a>
        </div>

        <div className="mt-10 text-center text-gray-400 text-xs">
          <p>Last Modified: January 17, 2026</p>
          <p className="mt-1">Rentify Security Team</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;