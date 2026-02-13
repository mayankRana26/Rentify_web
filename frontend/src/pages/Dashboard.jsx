import { useEffect, useState } from "react";
import adminApi from "../api/adminApi";
import RevenueChart from "./admin/RevenueChart";
import { DollarSign, Calendar, Package, Users, Plus } from "lucide-react";
import CountUp from "react-countup";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminApi
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );

 const cards = [
  {
    title: "Total Revenue",
    value: stats.totalRevenue,
    icon: <DollarSign size={20} />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    isCurrency: true,
  },
  {
    title: "Total Deals",
    value: stats.totalBookings,
    icon: <Calendar size={20} />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Active Listings",
    value: stats.activeListings,
    icon: <Package size={20} />,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    title: "Total Sellers",
    value: stats.totalSellers,
    icon: <Users size={20} />,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "Total Buyers",
    value: stats.totalUsers,
    icon: <Users size={20} />,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];


  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Rental Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time performance insights of your platform.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200">
          <Plus size={18} />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div
                className={`p-3 rounded-2xl ${card.bg} ${card.color}`}
              >
                {card.icon}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-1">
                {card.isCurrency ? "₹" : ""}
                <CountUp
                  end={card.value}
                  duration={1.5}
                  separator=","
                />
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <RevenueChart />
      </div>

    </div>
  );
};

export default Dashboard;
