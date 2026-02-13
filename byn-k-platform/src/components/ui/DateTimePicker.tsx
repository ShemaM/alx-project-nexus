'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Calendar, Clock, ChevronDown } from 'lucide-react'

interface DateTimePickerProps {
  value?: string // ISO datetime string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  minDate?: string
  maxDate?: string
  error?: string
}

/**
 * DateTimePicker Component
 * 
 * A stylish date and time picker with 12-hour clock format support.
 * Combines date input with time selection in AM/PM format.
 */
export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date and time',
  required = false,
  disabled = false,
  className = '',
  minDate,
  maxDate,
  error,
}: DateTimePickerProps) {
  // Parse the initial value
  const parseValue = useCallback((val: string | undefined) => {
    if (!val) return { date: '', hours: '12', minutes: '00', period: 'AM' as const }
    
    const dateObj = new Date(val)
    if (isNaN(dateObj.getTime())) return { date: '', hours: '12', minutes: '00', period: 'AM' as const }
    
    const date = dateObj.toISOString().split('T')[0]
    let hours = dateObj.getHours()
    const minutes = dateObj.getMinutes().toString().padStart(2, '0')
    const period = hours >= 12 ? 'PM' as const : 'AM' as const
    
    // Convert to 12-hour format
    if (hours === 0) hours = 12
    else if (hours > 12) hours = hours - 12
    
    return { date, hours: hours.toString(), minutes, period }
  }, [])

  const [dateValue, setDateValue] = useState(() => parseValue(value).date)
  const [hours, setHours] = useState(() => parseValue(value).hours)
  const [minutes, setMinutes] = useState(() => parseValue(value).minutes)
  const [period, setPeriod] = useState<'AM' | 'PM'>(() => parseValue(value).period)

  // Update internal state when value changes externally
  useEffect(() => {
    const parsed = parseValue(value)
    setDateValue(parsed.date)
    setHours(parsed.hours)
    setMinutes(parsed.minutes)
    setPeriod(parsed.period)
  }, [value, parseValue])

  // Combine date and time into ISO string
  const combineDateTime = useCallback(
    (date: string, hrs: string, mins: string, prd: 'AM' | 'PM') => {
      if (!date) return ''
      
      let hour24 = parseInt(hrs, 10)
      if (prd === 'AM' && hour24 === 12) hour24 = 0
      else if (prd === 'PM' && hour24 !== 12) hour24 += 12
      
      const datetime = new Date(`${date}T${hour24.toString().padStart(2, '0')}:${mins}:00`)
      return datetime.toISOString()
    },
    []
  )

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setDateValue(newDate)
    if (newDate) {
      onChange(combineDateTime(newDate, hours, minutes, period))
    }
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHours = e.target.value
    setHours(newHours)
    if (dateValue) {
      onChange(combineDateTime(dateValue, newHours, minutes, period))
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = e.target.value
    setMinutes(newMinutes)
    if (dateValue) {
      onChange(combineDateTime(dateValue, hours, newMinutes, period))
    }
  }

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setPeriod(newPeriod)
    if (dateValue) {
      onChange(combineDateTime(dateValue, hours, minutes, newPeriod))
    }
  }

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1)
  
  // Generate minute options (00, 05, 10, ... 55)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Date Input */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Calendar size={18} />
          </div>
          <input
            type="date"
            value={dateValue}
            onChange={handleDateChange}
            min={minDate}
            max={maxDate}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200
              ${error 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-slate-200 focus:ring-2 focus:ring-[#2D8FDD] focus:border-[#2D8FDD]'
              }
              ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'bg-white hover:border-slate-300'}
              outline-none
            `}
          />
        </div>

        {/* Time Input Group */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Clock size={18} />
            </div>
            <select
              value={hours}
              onChange={handleHoursChange}
              disabled={disabled}
              aria-label="Hour"
              className={`appearance-none pl-10 pr-8 py-3 border rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${error 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200 focus:ring-2 focus:ring-[#2D8FDD] focus:border-[#2D8FDD]'
                }
                ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'bg-white hover:border-slate-300'}
                outline-none
              `}
            >
              {hourOptions.map((h) => (
                <option key={h} value={h.toString()}>
                  {h}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <span className="text-slate-400 font-bold">:</span>

          <div className="relative">
            <select
              value={minutes}
              onChange={handleMinutesChange}
              disabled={disabled}
              aria-label="Minutes"
              className={`appearance-none px-4 py-3 border rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                ${error 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200 focus:ring-2 focus:ring-[#2D8FDD] focus:border-[#2D8FDD]'
                }
                ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'bg-white hover:border-slate-300'}
                outline-none pr-8
              `}
            >
              {minuteOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* AM/PM Toggle */}
          <div className="flex rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => handlePeriodChange('AM')}
              disabled={disabled}
              className={`px-3 py-3 text-sm font-semibold transition-all duration-200
                ${period === 'AM'
                  ? 'bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8] text-white shadow-inner'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                }
                ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              `}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange('PM')}
              disabled={disabled}
              className={`px-3 py-3 text-sm font-semibold transition-all duration-200
                ${period === 'PM'
                  ? 'bg-gradient-to-r from-[#2D8FDD] to-[#1E6BB8] text-white shadow-inner'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
                }
                ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
              `}
            >
              PM
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}

/**
 * Format a date/datetime to 12-hour time string
 */
export function formatTime12Hour(date: string | Date | null | undefined): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return ''
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Format a date/datetime to a full readable string with 12-hour time
 */
export function formatDateTime12Hour(date: string | Date | null | undefined): string {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return ''
  
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export default DateTimePicker
