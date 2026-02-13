import React from "react";
import { Mail, MessageCircle, ShieldCheck, CreditCard, ShoppingBag, Truck } from "lucide-react"; // Assuming lucide-react is installed, otherwise use emojis

const HelpCenter = () => {
  const categories = [
    {
      title: "How to Rent an Item?",
      icon: <ShoppingBag className="text-indigo-600" />,
      content: (
        <ol className="list-decimal ml-5 space-y-2 text-gray-600">
          <li>Browse and select your desired item</li>
          <li>Click the <span className="font-semibold text-gray-800">"Rent Now"</span> button</li>
          <li>Choose your payment method and complete the transaction</li>
          <li>The seller will verify your documents upon delivery</li>
          <li>Confirm delivery on your dashboard once you receive the item</li>
        </ol>
      ),
    },
    {
      title: "Document Verification",
      icon: <ShieldCheck className="text-green-600" />,
      content: (
        <p className="text-gray-600 leading-relaxed">
          Identity documents (Aadhaar Card, Driving License, etc.) are verified 
          <span className="font-semibold text-gray-800"> offline</span> at the time of delivery. 
          The seller will inspect the physical copy to ensure a secure transaction.
        </p>
      ),
    },
    {
      title: "Payment Methods",
      icon: <CreditCard className="text-blue-600" />,
      content: (
        <ul className="grid grid-cols-1 gap-2 text-gray-600">
          <li className="flex items-center gap-2">✅ Secure Online Payment</li>
          <li className="flex items-center gap-2">✅ Cash on Delivery (COD)</li>
          <li className="flex items-center gap-2">✅ Advance + Balance Payment</li>
        </ul>
      ),
    },
    {
      title: "Seller Payouts",
      icon: <Truck className="text-purple-600" />,
      content: (
        <p className="text-gray-600 leading-relaxed">
          Sellers are paid automatically once the buyer clicks 
          <span className="font-semibold text-gray-800"> "Confirm Delivery"</span>. 
          Note that a small platform fee is deducted to keep Rentify running smoothly.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Help Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about renting, selling, and staying safe on Rentify.
          </p>
        </div>

        {/* FAQ GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">{cat.icon}</div>
                <h2 className="text-xl font-bold text-gray-800">{cat.title}</h2>
              </div>
              <div className="text-sm">
                {cat.content}
              </div>
            </div>
          ))}
        </div>

        {/* SUPPORT SECTION */}
        <div className="mt-16 bg-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-indigo-100">
          <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
          <p className="text-indigo-100 mb-8">Our support team is available 24/7 to assist you.</p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8">
            <a 
              href="mailto:ranamayank987@gmail.com" 
              className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
            >
              <Mail size={20} />
              Email Us
            </a>
            <a 
              href="https://wa.me/917302017626" 
              className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={20} />
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* FOOTER NOTE */}
        <p className="text-center text-gray-400 mt-12 text-sm">
          Rentify &copy; {new Date().getFullYear()} Support Team
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;