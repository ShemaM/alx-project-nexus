'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

const OpportunitiesFilter = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    const newParams = new URLSearchParams(searchParams.toString())
    if (value) {
      newParams.set(name, value)
    } else {
      newParams.delete(name)
    }
    router.push(`?${newParams.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('search', searchTerm)
    router.push(`?${newParams.toString()}`)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Filter Opportunities</h3>
      <form onSubmit={handleSearch} className="flex gap-4 mb-4">
        <input
          type="text"
          name="search"
          placeholder="Search by title, keyword..."
          className="border p-2 rounded-lg w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="bg-[#2D8FDD] text-white p-2 rounded-lg">
          <Search size={20} />
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <select name="work_mode" onChange={handleFilterChange} defaultValue={searchParams.get('work_mode') || ''} className="border p-2 rounded-lg">
          <option value="">Work Mode (All)</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
        <select name="commitment" onChange={handleFilterChange} defaultValue={searchParams.get('commitment') || ''} className="border p-2 rounded-lg">
          <option value="">Commitment (All)</option>
          <option value="full_time">Full-time</option>
          <option value="part_time">Part-time</option>
          <option value="short_term">Short-term</option>
          <option value="long_term">Long-term</option>
        </select>
        <select name="funding_type" onChange={handleFilterChange} defaultValue={searchParams.get('funding_type') || ''} className="border p-2 rounded-lg">
          <option value="">Funding (All)</option>
          <option value="fully">Fully Funded</option>
          <option value="partially">Partially Funded</option>
          <option value="none">Not Funded</option>
        </select>
      </div>
    </div>
  )
}

export default OpportunitiesFilter
