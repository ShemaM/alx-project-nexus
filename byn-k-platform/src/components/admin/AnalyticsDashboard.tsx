/**
 * Analytics Dashboard Component
 * 
 * Client-side component for displaying analytics data in the admin panel.
 * Shows key metrics, charts, and recent activity.
 * 
 * @module components/admin/AnalyticsDashboard
 */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Building2, 
  GraduationCap,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  totalOpportunities: number
  activeOpportunities: number
  totalPartners: number
  totalUsers: number
  opportunitiesByCategory: {
    jobs: number
    scholarships: number
    internships: number
    fellowships: number
  }
  recentActivity: { date: string; count: number }[]
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ElementType
  trend?: number
  color: string
  bgColor: string
}

const StatCard = ({ title, value, icon: Icon, trend, color, bgColor }: StatCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{Math.abs(trend)}% from last week</span>
          </div>
        )}
      </div>
      <div className={`${bgColor} p-3 rounded-xl`}>
        <Icon size={24} className={color} />
      </div>
    </div>
  </div>
)

interface CategoryBarProps {
  label: string
  count: number
  total: number
  color: string
}

const CategoryBar = ({ label, count, total, color }: CategoryBarProps) => {
  const percentage = total > 0 ? (count / total) * 100 : 0
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface MiniChartProps {
  data: { date: string; count: number }[]
}

const MiniChart = ({ data }: MiniChartProps) => {
  const maxCount = Math.max(...data.map(d => d.count), 1)
  
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((item) => (
        <div 
          key={item.date}
          className="flex-1 flex flex-col items-center gap-1"
        >
          <div 
            className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
            style={{ 
              height: `${(item.count / maxCount) * 100}%`,
              minHeight: item.count > 0 ? '8px' : '2px',
            }}
          />
          <span className="text-[10px] text-gray-400">
            {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
          </span>
        </div>
      ))}
    </div>
  )
}

export const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/admin/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw size={32} className="animate-spin text-blue-500" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const totalByCategory = data.opportunitiesByCategory.jobs + 
    data.opportunitiesByCategory.scholarships + 
    data.opportunitiesByCategory.internships + 
    data.opportunitiesByCategory.fellowships

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of platform performance</p>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Opportunities"
          value={data.totalOpportunities}
          icon={Briefcase}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Active Opportunities"
          value={data.activeOpportunities}
          icon={TrendingUp}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard 
          title="Trusted Partners"
          value={data.totalPartners}
          icon={Building2}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard 
          title="Registered Users"
          value={data.totalUsers}
          icon={Users}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Opportunities by Category</h3>
          <div className="space-y-2">
            <CategoryBar 
              label="Jobs"
              count={data.opportunitiesByCategory.jobs}
              total={totalByCategory}
              color="bg-amber-500"
            />
            <CategoryBar 
              label="Scholarships"
              count={data.opportunitiesByCategory.scholarships}
              total={totalByCategory}
              color="bg-purple-500"
            />
            <CategoryBar 
              label="Internships"
              count={data.opportunitiesByCategory.internships}
              total={totalByCategory}
              color="bg-blue-500"
            />
            <CategoryBar 
              label="Fellowships"
              count={data.opportunitiesByCategory.fellowships}
              total={totalByCategory}
              color="bg-emerald-500"
            />
          </div>
          
          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-amber-500" />
                <span className="text-sm text-gray-600">Jobs: {data.opportunitiesByCategory.jobs}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap size={16} className="text-purple-500" />
                <span className="text-sm text-gray-600">Scholarships: {data.opportunitiesByCategory.scholarships}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" />
                <span className="text-sm text-gray-600">Internships: {data.opportunitiesByCategory.internships}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-emerald-500" />
                <span className="text-sm text-gray-600">Fellowships: {data.opportunitiesByCategory.fellowships}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>Last 7 days</span>
            </div>
          </div>
          
          <MiniChart data={data.recentActivity} />
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">New opportunities this week</span>
              <span className="text-lg font-bold text-blue-600">
                {data.recentActivity.reduce((sum, item) => sum + item.count, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/admin/collections/opportunities/create"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
          >
            <Briefcase size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">Add Opportunity</span>
          </Link>
          <Link 
            href="/admin/collections/partners/create"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
          >
            <Building2 size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">Add Partner</span>
          </Link>
          <Link 
            href="/admin/collections/opportunities"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
          >
            <TrendingUp size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">Manage All</span>
          </Link>
          <Link 
            href="/admin/collections/users"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-colors"
          >
            <Users size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">View Users</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
