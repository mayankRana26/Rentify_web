import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import adminApi from "../../api/adminApi";

const RevenueChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    adminApi.get("/revenue/monthly")
      .then((res) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formatted = res.data.map((item) => ({
          name: months[item._id - 1],
          revenue: item.revenue,
        }));
        setData(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Revenue Performance</h2>
          <p className="text-sm text-slate-500">Earnings from rentals over the last year</p>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-lg">
          <button className="px-4 py-1.5 text-xs font-bold bg-white text-blue-600 rounded-md shadow-sm">Monthly</button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-400">Yearly</button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12}}
              tickFormatter={(val) => `₹${val/1000}k`}
            />
            <Tooltip 
              cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563eb" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;