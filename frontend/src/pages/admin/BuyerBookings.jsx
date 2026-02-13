import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Tag, Calendar, ChevronRight, PackageOpen } from "lucide-react";
import adminApi from "../../api/adminApi";

const BuyerBookings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    adminApi.get(`/user/${id}/bookings`).then(res => setBookings(res.data));
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <ArrowLeft size={18} /> Back to Buyers
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Booking History</h1>
        <p className="text-slate-500">Review all rental transactions for this customer</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <PackageOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">No bookings yet</h3>
          <p className="text-slate-400">This user hasn't made any rentals on the platform.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map(b => (
            <div key={b._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Tag size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{b.listing?.title || "Unknown Listing"}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Calendar size={14} /> {new Date(b.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:flex items-center gap-4 md:gap-8">
                  <div className="text-right md:text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Amount</p>
                    <p className="font-bold text-slate-900">₹{b.totalAmount}</p>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Payment</p>
                    <span className="text-sm font-medium text-slate-700">{b.paymentStatus}</span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold block text-center ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1"><CreditCard size={14}/> {b.paymentMode}</span>
                <span className="flex items-center gap-1 font-medium text-indigo-600">Seller: {b.seller?.email}</span>
                <span className="ml-auto flex items-center gap-1 text-slate-400 italic">Type: {b.transactionType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerBookings;