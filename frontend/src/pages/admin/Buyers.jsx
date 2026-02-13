import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  UserX, 
  UserCheck, 
  ShoppingBag, 
  Mail, 
  Search, 
  ChevronRight 
} from "lucide-react";
import adminApi from "../../api/adminApi";

const Buyers = () => {
  const [buyers, setBuyers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.get("/users").then((res) => setBuyers(res.data));
  }, []);

  const toggleBlock = async (id) => {
    try {
      await adminApi.put(`/user/block/${id}`);
      setBuyers((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isBlocked: !b.isBlocked } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-slate-500 text-sm">Manage your rental platform's buyers</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-80 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {buyers.map((buyer) => (
          <div 
            key={buyer._id} 
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top Status Accent */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${buyer.isBlocked ? 'bg-rose-500' : 'bg-indigo-500'}`} />
            
            <div className="flex flex-col items-center text-center">
              {/* Profile Avatar */}
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 ring-4 ring-slate-50 group-hover:ring-indigo-50 transition-all">
                <User size={40} className={buyer.isBlocked ? 'text-slate-300' : 'text-indigo-500'} />
              </div>
              
              <h2 className="font-bold text-lg text-slate-800 line-clamp-1">{buyer.name}</h2>
              
              <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                <Mail size={12} />
                <span className="truncate max-w-[180px]">{buyer.email}</span>
              </div>

              {/* Status Badge */}
              <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                buyer.isBlocked ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {buyer.isBlocked ? "Account Blocked" : "Active Customer"}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-2">
              <button
                onClick={() => navigate(`/admin/buyers/${buyer._id}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-indigo-600 transition-all shadow-sm"
              >
                <ShoppingBag size={16} />
                View Bookings
              </button>
              
              <button
                onClick={() => toggleBlock(buyer._id)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold border-2 transition-all ${
                  buyer.isBlocked 
                    ? "border-emerald-100 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200" 
                    : "border-rose-50 text-rose-500 hover:bg-rose-50 hover:border-rose-100"
                }`}
              >
                {buyer.isBlocked ? (
                  <><UserCheck size={16} /> Restore Access</>
                ) : (
                  <><UserX size={16} /> Restrict User</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {buyers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 p-4 rounded-full mb-4">
             <User size={48} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700">No buyers found</h3>
          <p className="text-slate-400">Wait for users to sign up to your platform.</p>
        </div>
      )}
    </div>
  );
};

export default Buyers;