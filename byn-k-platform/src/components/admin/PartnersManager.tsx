'use client';

import React, { useState, useEffect } from 'react';
import { Partner } from '@/types';
import { getPartners, createPartner, updatePartner, deletePartner } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useForm } from 'react-hook-form';

export function PartnersManager() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const { register, handleSubmit, reset } = useForm<Partner>();

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    try {
      const fetchedPartners = await getPartners();
      setPartners(fetchedPartners.data);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const openModalForCreate = () => {
    setEditingPartner(null);
    reset({ name: '', logo_url: '', website_url: '' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (partner: Partner) => {
    setEditingPartner(partner);
    reset(partner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPartner(null);
  };

  const onSubmit = async (data: Partner) => {
    try {
      if (editingPartner) {
        await updatePartner(editingPartner.id, data);
      } else {
        await createPartner(data);
      }
      fetchPartners();
      closeModal();
    } catch (error) {
      console.error('Failed to save partner:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await deletePartner(id);
        fetchPartners();
      } catch (error) {
        console.error('Failed to delete partner:', error);
      }
    }
  };
  
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
            <Button onClick={openModalForCreate}>Add Partner</Button>
        </div>
        
        {isLoading ? (
            <p>Loading partners...</p>
        ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {partners.map((partner) => (
                            <tr key={partner.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={partner.logo_url} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {partner.website_url ? (
                                        <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{partner.website_url}</a>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Button onClick={() => openModalForEdit(partner)}>Edit</Button>
                                    <Button onClick={() => handleDelete(partner.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className="text-2xl font-bold mb-4">{editingPartner ? 'Edit Partner' : 'Add Partner'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <Input label="Name" {...register('name', { required: true })} />
                    <Input label="Logo URL" {...register('logo_url', { required: true })} />
                    <Input label="Website URL" {...register('website_url')} />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button onClick={closeModal}>Cancel</Button>
                    <Button type="submit">{editingPartner ? 'Save Changes' : 'Add Partner'}</Button>
                </div>
            </form>
        </Modal>
    </div>
  );
}
