// import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// interface StatCardProps {
//   title: string;
//   value: string;
//   change: string;
//   trend: 'up' | 'down';
//   icon: LucideIcon;
//   color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
//   description: string;
// }

export default function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  description
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-2">{description}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}