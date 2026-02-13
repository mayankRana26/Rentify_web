import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Shield, BarChart3, List, ReceiptText, ArrowLeft, IndianRupee } from "lucide-react";
import adminApi from "../../api/adminApi";

const SellerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    adminApi.get(`/seller/${id}/details`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!data) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
        <p className="text-slate-400 font-medium">Fetching Seller Profile...</p>
      </div>
    </div>
  );

  const { seller, listings, transactions, totalListings, totalTransactions, completedRevenue } = data;

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft size={18} /> Back to Sellers
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SELLER PROFILE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="h-24 w-24 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-100 mb-4">
              {seller.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{seller.name}</h2>
            <div className="flex items-center justify-center gap-2 text-slate-500 mt-1">
              <Mail size={16} /> <span className="text-sm">{seller.email}</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Shield size={12}/> {seller.role}
              </span>
            </div>
          </div>

          {/* 🔥 KYC & BANK DETAILS SECTION */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Shield size={18} className="text-indigo-500" />
              KYC & Bank Details
            </h3>

            <div className="space-y-3 text-sm">
              <DetailRow label="KYC Status" value={seller.kycStatus || "Not Submitted"} />
              <DetailRow label="PAN" value={seller.kycDetails?.pan || "—"} />
              <DetailRow label="Account Number" value={seller.kycDetails?.accountNumber || "—"} />
              <DetailRow label="IFSC" value={seller.kycDetails?.ifsc || "—"} />
              <DetailRow label="Bank Name" value={seller.kycDetails?.bankName || "—"} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4">
            <StatSmall label="Total Revenue" value={`₹${completedRevenue}`} icon={<IndianRupee size={18}/>} color="text-emerald-600" bg="bg-emerald-50" />
            <StatSmall label="Live Listings" value={totalListings} icon={<List size={18}/>} color="text-blue-600" bg="bg-blue-50" />
            <StatSmall label="Successful Deals" value={totalTransactions} icon={<BarChart3 size={18}/>} color="text-purple-600" bg="bg-purple-50" />
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Listings Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <List className="text-indigo-500" /> Active Listings
              </h2>
              <span className="text-sm text-slate-400">{listings.length} items</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map(l => (
                <div key={l._id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center group hover:border-indigo-200 transition-colors">
                  <div>
                    <p className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{l.title}</p>
                    <p className="text-xs text-slate-400">{new Date(l.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-slate-900">₹{l.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Transactions Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ReceiptText className="text-indigo-500" /> Recent Transactions
              </h2>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-slate-500 font-bold uppercase text-[10px]">Amount</th>
                    <th className="p-4 text-slate-500 font-bold uppercase text-[10px]">Status</th>
                    <th className="p-4 text-slate-500 font-bold uppercase text-[10px]">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map(t => (
                    <tr key={t._id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800">₹{t.totalAmount}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${t.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{t.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

const StatSmall = ({ label, value, icon, color, bg }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${bg} ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-slate-100 pb-2">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-800 text-right break-all">
      {value}
    </span>
  </div>
);

export default SellerDetails;
