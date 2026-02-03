/**
 * Analytics Dashboard Component
 * 
 * Server-side component for displaying analytics data in the admin panel.
 * Shows key metrics and charts with data from Django API.
 * 
 * @module components/admin/AnalyticsDashboard
 */
import React from 'react';
import {
  TrendingUp,
  Users,
  Briefcase,
  Building2,
  BarChart3,
} from 'lucide-react';
import { getAnalyticsOverview, getOpportunities } from '@/lib/api';

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

interface AnalyticsData {
  total_jobs?: number;
  verified_jobs?: number;
  featured_jobs?: number;
  top_clicked?: Array<{
    id: number;
    title: string;
    organization: string;
    total_clicks: number;
  }>;
}

export async function AnalyticsDashboard() {
  let analyticsData: AnalyticsData = {};
  let opportunityCounts = {
    total: 0,
    jobs: 0,
    scholarships: 0,
    internships: 0,
    fellowships: 0,
  };
  
  try {
    // Fetch analytics overview from Django API
    const analytics = await getAnalyticsOverview();
    analyticsData = analytics as AnalyticsData;
    
    // Fetch opportunities to calculate counts
    const opportunitiesResponse = await getOpportunities();
    const opportunities = opportunitiesResponse?.data || [];
    
    opportunityCounts = {
      total: opportunities.length,
      jobs: opportunities.filter((o) => o.category === 'job').length,
      scholarships: opportunities.filter((o) => o.category === 'scholarship').length,
      internships: opportunities.filter((o) => o.category === 'internship').length,
      fellowships: opportunities.filter((o) => o.category === 'fellowship').length,
    };
  } catch (error) {
    console.error('Failed to fetch analytics data:', error);
  }

  const hasData = opportunityCounts.total > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">An overview of the platform&apos;s performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Opportunities"
          value={analyticsData.total_jobs ?? opportunityCounts.total}
          icon={Briefcase}
          color="text-blue-500"
        />
        <StatCard
          title="Verified Opportunities"
          value={analyticsData.verified_jobs ?? 0}
          icon={TrendingUp}
          color="text-green-500"
        />
        <StatCard
          title="Featured Opportunities"
          value={analyticsData.featured_jobs ?? 0}
          icon={Building2}
          color="text-purple-500"
        />
        <StatCard
          title="Total Partners"
          value={0}
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
          {hasData ? (
            <div className="space-y-4">
              {[
                { category: 'jobs', count: opportunityCounts.jobs, label: 'Jobs' },
                { category: 'scholarships', count: opportunityCounts.scholarships, label: 'Scholarships' },
                { category: 'internships', count: opportunityCounts.internships, label: 'Internships' },
                { category: 'fellowships', count: opportunityCounts.fellowships, label: 'Fellowships' },
              ].map(({ category, count, label }) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${opportunityCounts.total > 0 ? (count / opportunityCounts.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg">
              <BarChart3 className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">No opportunities yet.<br/>Add opportunities via Django Admin to see analytics.</p>
            </div>
          )}
        </div>

        {/* Top Clicked Opportunities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Clicked Opportunities
          </h3>
          {analyticsData.top_clicked && analyticsData.top_clicked.length > 0 ? (
            <div className="space-y-3">
              {analyticsData.top_clicked.slice(0, 5).map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.organization}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item.total_clicks} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg">
              <TrendingUp className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">No click data yet.<br/>Analytics will appear once users interact with opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
