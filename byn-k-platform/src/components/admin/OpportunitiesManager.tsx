/**
 * Admin Opportunities Management Component
 * 
 * Client-side component for managing opportunities with CRUD operations.
 * Provides a modern table view with filtering, sorting, and bulk actions.
 * 
 * @module components/admin/OpportunitiesManager
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  Star,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Building2,
  ExternalLink
} from 'lucide-react'

interface Opportunity {
  id: number
  title: string
  category: string
  organization: { name: string } | number
  deadline: string
  isVerified: boolean
  isFeatured: boolean
  isActive: boolean
  viewCount: number
  createdAt: string
}

interface PaginatedResponse {
  docs: Opportunity[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const categoryColors: Record<string, string> = {
  jobs: 'bg-amber-100 text-amber-700',
  scholarships: 'bg-purple-100 text-purple-700',
  internships: 'bg-blue-100 text-blue-700',
  fellowships: 'bg-emerald-100 text-emerald-700',
}

const categoryLabels: Record<string, string> = {
  jobs: 'Job',
  scholarships: 'Scholarship',
  internships: 'Internship',
  fellowships: 'Fellowship',
}

export const OpportunitiesManager = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDocs, setTotalDocs] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })
      
      if (searchQuery) params.set('search', searchQuery)
      if (categoryFilter) params.set('category', categoryFilter)
      if (statusFilter === 'active') params.set('isActive', 'true')
      if (statusFilter === 'inactive') params.set('isActive', 'false')
      if (statusFilter === 'verified') params.set('isVerified', 'true')
      if (statusFilter === 'featured') params.set('isFeatured', 'true')
      
      const response = await fetch(`/api/admin/opportunities?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch opportunities')
      }
      
      const data: PaginatedResponse = await response.json()
      setOpportunities(data.docs)
      setTotalPages(data.totalPages)
      setTotalDocs(data.totalDocs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, categoryFilter, statusFilter])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchOpportunities()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return
    
    try {
      const response = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        fetchOpportunities()
      } else {
        alert('Failed to delete opportunity')
      }
    } catch {
      alert('An error occurred while deleting')
    }
  }

  const handleToggleStatus = async (id: number, field: 'isVerified' | 'isFeatured' | 'isActive', currentValue: boolean) => {
    try {
      const response = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !currentValue }),
      })
      
      if (response.ok) {
        fetchOpportunities()
      } else {
        alert('Failed to update opportunity')
      }
    } catch {
      alert('An error occurred while updating')
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === opportunities.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(opportunities.map(o => o.id))
    }
  }

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const getOrganizationName = (org: Opportunity['organization']): string => {
    if (typeof org === 'object' && org !== null) {
      return org.name
    }
    return 'Unknown'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Opportunities Manager</h1>
          <p className="text-gray-500">Manage jobs, scholarships, internships and fellowships</p>
        </div>
        <Link
          href="/admin/collections/opportunities/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add New Opportunity
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </form>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            <option value="jobs">Jobs</option>
            <option value="scholarships">Scholarships</option>
            <option value="internships">Internships</option>
            <option value="fellowships">Fellowships</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="verified">Verified</option>
            <option value="featured">Featured</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchOpportunities}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Showing {opportunities.length} of {totalDocs} opportunities</span>
        {selectedIds.length > 0 && (
          <span className="text-blue-600 font-medium">{selectedIds.length} selected</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchOpportunities}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="p-8 flex items-center justify-center">
            <RefreshCw size={32} className="animate-spin text-blue-500" />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No opportunities found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === opportunities.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Category</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Organization</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600">Deadline</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-600">Status</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(opp.id)}
                        onChange={() => toggleSelect(opp.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{opp.title}</p>
                          <p className="text-xs text-gray-500">{opp.viewCount} views</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[opp.category] || 'bg-gray-100 text-gray-700'}`}>
                        {categoryLabels[opp.category] || opp.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{getOrganizationName(opp.organization)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 text-sm ${isDeadlinePassed(opp.deadline) ? 'text-red-600' : 'text-gray-600'}`}>
                        <Calendar size={14} />
                        {formatDate(opp.deadline)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(opp.id, 'isVerified', opp.isVerified)}
                          title={opp.isVerified ? 'Verified' : 'Not Verified'}
                          className={`p-1 rounded ${opp.isVerified ? 'text-emerald-600' : 'text-gray-300 hover:text-emerald-600'} transition-colors`}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(opp.id, 'isFeatured', opp.isFeatured)}
                          title={opp.isFeatured ? 'Featured' : 'Not Featured'}
                          className={`p-1 rounded ${opp.isFeatured ? 'text-amber-500' : 'text-gray-300 hover:text-amber-500'} transition-colors`}
                        >
                          <Star size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(opp.id, 'isActive', opp.isActive)}
                          title={opp.isActive ? 'Active' : 'Inactive'}
                          className={`p-1 rounded ${opp.isActive ? 'text-blue-600' : 'text-gray-300 hover:text-blue-600'} transition-colors`}
                        >
                          {opp.isActive ? <Eye size={18} /> : <XCircle size={18} />}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="relative flex items-center justify-end gap-2">
                        <Link
                          href={`/opportunities/${opp.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link
                          href={`/admin/collections/opportunities/${opp.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(opp.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OpportunitiesManager
