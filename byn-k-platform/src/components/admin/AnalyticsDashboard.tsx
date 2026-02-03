/**
 * Analytics Dashboard Component
 * 
 * Server-side component for displaying analytics data in the admin panel.
 * Shows key metrics and charts.
 * 
 * @module components/admin/AnalyticsDashboard
 */
import React from 'react';
import {
  TrendingUp,
  Users,
  Briefcase,
  Building2,
  GraduationCap,
  Award,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
    <div className={`p-3 rounded-full bg-opacity-20 ${color}`}>
      <Icon className="h-6 w-6" />
    </div>
  </div>
);

export async function AnalyticsDashboard() {
  // Placeholder data - to be replaced with real data from the database
  const data = {
    totalOpportunities: 125,
    activeOpportunities: 80,
    totalPartners: 25,
    totalUsers: 1250,
    opportunitiesByCategory: {
      jobs: 45,
      scholarships: 30,
      internships: 20,
      fellowships: 30,
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">An overview of the platform's performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Opportunities"
          value={data.totalOpportunities}
          icon={Briefcase}
          color="text-blue-500"
        />
        <StatCard
          title="Active Opportunities"
          value={data.activeOpportunities}
          icon={TrendingUp}
          color="text-green-500"
        />
        <StatCard
          title="Total Partners"
          value={data.totalPartners}
          icon={Building2}
          color="text-purple-500"
        />
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          icon={Users}
          color="text-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Opportunities by Category
          </h3>
          <div className="space-y-4">
            {Object.entries(data.opportunitiesByCategory).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                  <span className="text-sm text-gray-500">{count}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(count / data.totalOpportunities) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
