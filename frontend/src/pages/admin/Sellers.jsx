import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, ShieldAlert, ShieldCheck, ExternalLink, Mail, MapPin } from "lucide-react";
import adminApi from "../../api/adminApi";

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.get("/sellers").then(res => setSellers(res.data));
  }, []);

  const toggleBlock = async (id) => {
    try {
      await adminApi.put(`/seller/block/${id}`);
      setSellers(prev =>
        prev.map(s => (s._id === id ? { ...s, isBlocked: !s.isBlocked } : s))
      );
    } catch (err) { console.error(err); }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 text-center md:text-left">Sellers Portfolio</h1>
        <p className="text-slate-500 text-sm text-center md:text-left">Manage rental provider accounts and their shop status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sellers.map(seller => (
          <div key={seller._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {/* Status Indicator Bar */}
            <div className={`absolute top-0 left-0 w-full h-1 ${seller.isBlocked ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform">
                <Store size={32} />
              </div>
              
              <h2 className="font-bold text-lg text-slate-800 line-clamp-1">{seller.name}</h2>
              
              <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
                <Mail size={12} />
                <span className="truncate max-w-[180px]">{seller.email}</span>
              </div>

              <div className="mt-6 w-full flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/admin/seller/${seller._id}`)}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <ExternalLink size={16} />
                  View Profile
                </button>
                
                <button
                  onClick={() => toggleBlock(seller._id)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold border transition-all ${
                    seller.isBlocked 
                      ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50" 
                      : "border-rose-200 text-rose-600 hover:bg-rose-50"
                  }`}
                >
                  {seller.isBlocked ? (
                    <><ShieldCheck size={16} /> Unblock Seller</>
                  ) : (
                    <><ShieldAlert size={16} /> Block Seller</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sellers;