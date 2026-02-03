/**
 * Admin Opportunities Management Component
 *
 * Server-side component for managing opportunities with CRUD operations.
 * Provides a modern table view with filtering, sorting, and bulk actions.
 *
 * @module components/admin/OpportunitiesManager
 */
import React from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  ExternalLink,
  Briefcase,
} from 'lucide-react';
import { getOpportunities } from '@/lib/api';

interface Opportunity {
  id: number;
  title: string;
  category: string;
  organization_name: string;
  deadline: string | null;
  is_verified: boolean;
  is_featured: boolean;
  is_active: boolean;
}

const categoryColors: Record<string, string> = {
  job: 'bg-blue-100 text-blue-700',
  scholarship: 'bg-purple-100 text-purple-700',
  internship: 'bg-green-100 text-green-700',
  fellowship: 'bg-yellow-100 text-yellow-700',
  training: 'bg-orange-100 text-orange-700',
};

export async function OpportunitiesManager() {
  let opportunities: Opportunity[] = [];
  
  try {
    const response = await getOpportunities();
    opportunities = (response?.data || []).map((opp) => ({
      id: opp.id,
      title: opp.title,
      category: opp.category || 'job',
      organization_name: opp.organization_name,
      deadline: opp.deadline || null,
      is_verified: opp.is_verified,
      is_featured: false, // Not exposed in list serializer, default to false
      is_active: true, // Only active jobs are returned from API
    }));
  } catch (error) {
    console.error('Failed to fetch opportunities:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opportunities</h1>
          <p className="text-gray-500 mt-1">Manage all opportunities on the platform.</p>
        </div>
        <Link
          href="/admin/opportunities/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          Create Opportunity
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">All Categories</option>
          <option value="jobs">Jobs</option>
          <option value="scholarships">Scholarships</option>
          <option value="internships">Internships</option>
          <option value="fellowships">Fellowships</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table or Empty State */}
      {opportunities.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Opportunities Yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first opportunity listing.
          </p>
          <Link
            href="/admin/opportunities/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Create Opportunity
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
                <tr key={opp.id}>
                  <td className="p-4 font-medium text-gray-900">{opp.title}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        categoryColors[opp.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {opp.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{opp.organization_name}</td>
                  <td className="p-4 text-gray-600">{opp.deadline || 'No deadline'}</td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        title={opp.is_verified ? 'Verified' : 'Not Verified'}
                        className={opp.is_verified ? 'text-green-500' : 'text-gray-300'}
                      >
                        <CheckCircle size={18} />
                      </span>
                      <span
                        title={opp.is_featured ? 'Featured' : 'Not Featured'}
                        className={opp.is_featured ? 'text-yellow-500' : 'text-gray-300'}
                      >
                        <Star size={18} />
                      </span>
                      <span
                        title={opp.is_active ? 'Active' : 'Inactive'}
                        className={opp.is_active ? 'text-blue-500' : 'text-gray-300'}
                      >
                        {opp.is_active ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/opportunities/${opp.id}`} title="View">
                        <ExternalLink size={18} className="text-gray-400 hover:text-blue-500" />
                      </Link>
                      <Link href={`/admin/opportunities/${opp.id}/edit`} title="Edit">
                        <Edit2 size={18} className="text-gray-400 hover:text-green-500" />
                      </Link>
                      <button title="Delete">
                        <Trash2 size={18} className="text-gray-400 hover:text-red-500" />
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
  );
}

export default OpportunitiesManager;
