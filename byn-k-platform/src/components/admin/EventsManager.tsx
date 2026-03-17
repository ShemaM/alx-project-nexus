'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarDays, ExternalLink } from 'lucide-react';
import { Event, EventCategory } from '@/types';
import { getEvents, createEvent } from '@/lib/api';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface EventFormValues {
  title: string;
  partner?: string;
  category: EventCategory;
  description?: string;
  requirements?: string;
  location?: string;
  directions?: string;
  start_time: string;
  end_time?: string;
  is_virtual?: boolean;
  stream_url?: string;
  is_active?: boolean;
}

const categoryLabels: Record<EventCategory, string> = {
  tech: 'Tech & Innovation',
  policy: 'Policy & Governance',
  community: 'Community Action',
  climate: 'Climate & Sustainability',
};

const formatDate = (value?: string) => {
  if (!value) return 'TBA';
  return new Date(value).toLocaleString('en-KE', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

function toISOString(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}

// Client-side interface for reviewing upcoming events and creating new ones.
export function EventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset } = useForm<EventFormValues>({
    defaultValues: {
      category: 'community',
      is_virtual: false,
      is_active: true,
    },
  });

  // Refresh the list by calling the events API with a modest limit.
  const fetchEvents = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getEvents(20);
      setEvents(response.results);
    } catch (err) {
      console.error('Failed to load events:', err);
      setError('Unable to load events right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = () => {
    reset({
      title: '',
      partner: '',
      category: 'community',
      description: '',
      requirements: '',
      location: '',
      directions: '',
      start_time: '',
      end_time: '',
      is_virtual: false,
      stream_url: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Validate and send the new event payload to the Django backend.
  const onSubmit = async (values: EventFormValues) => {
    if (!values.title || !values.start_time) {
      setError('Title and start time are required.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await createEvent({
        title: values.title,
        partner: values.partner || null,
        category: values.category,
        description: values.description || null,
        requirements: values.requirements || null,
        location: values.location || null,
        directions: values.directions || null,
        start_time: toISOString(values.start_time) ?? values.start_time,
        end_time: toISOString(values.end_time) ?? null,
        is_virtual: Boolean(values.is_virtual),
        stream_url: values.stream_url || null,
        is_active: values.is_active ?? true,
      });
      await fetchEvents();
      closeModal();
    } catch (err) {
      console.error('Failed to create event:', err);
      setError('Something went wrong while saving the event.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-sm text-gray-500">
            Publish partner webinars, conferences, and on-the-ground meetups. These events feed the
            homepage Recent Updates section.
          </p>
        </div>
        <Button onClick={openModal}>Create event</Button>
      </div>
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        {isLoading ? (
          <div className="p-6 text-sm text-gray-500">Loading upcoming events…</div>
        ) : events.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No upcoming events. Create one to keep the homepage current.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Start
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{event.partner || 'Community'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {categoryLabels[event.category ?? 'community']}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(event.start_time)}</td>
                    <td className="px-6 py-4 text-center text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          event.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {event.is_active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">
                      <Link href="/events" className="inline-flex items-center gap-1">
                        <ExternalLink size={14} />
                        View listing
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <CalendarDays className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Create a new event</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-600">
                Title
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('title', { required: true })}
                  required
                />
              </label>
              <label className="text-sm text-gray-600">
                Partner
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('partner')}
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-600">
                Category
                <select
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('category')}
                >
                  {(Object.keys(categoryLabels) as EventCategory[]).map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels[category]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-gray-600 flex items-center gap-2">
                <input type="checkbox" {...register('is_virtual')} />
                Virtual event
              </label>
            </div>
            <label className="text-sm text-gray-600">
              Description
              <textarea
                rows={3}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                {...register('description')}
              />
            </label>
            <label className="text-sm text-gray-600">
              Requirements
              <textarea
                rows={3}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                {...register('requirements')}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-600">
                Location
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('location')}
                />
              </label>
              <label className="text-sm text-gray-600">
                Directions
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('directions')}
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-gray-600">
                Start time
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('start_time', { required: true })}
                  required
                />
              </label>
              <label className="text-sm text-gray-600">
                End time
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  {...register('end_time')}
                />
              </label>
            </div>
            <label className="text-sm text-gray-600">
              Livestream URL
              <input
                type="url"
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                {...register('stream_url')}
              />
            </label>
            <label className="text-sm text-gray-600 flex items-center gap-2">
              <input type="checkbox" defaultChecked {...register('is_active')} />
              Active (show on homepage)
            </label>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={closeModal} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save event'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default EventsManager;
