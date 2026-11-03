import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  FolderPlus, 
  Check, 
  X,
  Layers
} from 'lucide-react';
import { Destination, DestinationCategory, CategoryType, ItineraryPlan } from '../types/tourism';
import { DESTINATION_CATEGORIES } from '../data/mockDestinations';

interface AdminDashboardProps {
  destinations: Destination[];
  onAddDestination: (dest: Destination) => void;
  onUpdateDestination: (dest: Destination) => void;
  onDeleteDestination: (id: number) => void;
  travelPlans: ItineraryPlan[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  destinations,
  onAddDestination,
  onUpdateDestination,
  onDeleteDestination,
  travelPlans
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'destinations' | 'categories' | 'plans'>('destinations');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  // Form states for Add / Edit Destination
  const [formData, setFormData] = useState<Partial<Destination>>({
    name: '',
    categoryId: 'historical',
    city: 'Jaipur',
    location: '',
    description: '',
    imageUrl: '/src/assets/images/dest_ancient_palace_1793691649923.jpg',
    entryFee: 10,
    visitDurationHours: 2.5,
    bestTime: 'Morning (09:00 - 12:00)',
    address: '',
    latitude: 26.9124,
    longitude: 75.7873,
    rating: 4.8,
    reviewsCount: 150,
    isPopular: true
  });

  const handleOpenAddModal = () => {
    setEditingDest(null);
    setFormData({
      name: '',
      categoryId: 'historical',
      city: 'Jaipur',
      location: '',
      description: '',
      imageUrl: '/src/assets/images/dest_ancient_palace_1793691649923.jpg',
      entryFee: 10,
      visitDurationHours: 2.5,
      bestTime: 'Morning (09:00 - 12:00)',
      address: '',
      latitude: 26.9124,
      longitude: 75.7873,
      rating: 4.8,
      reviewsCount: 150,
      isPopular: true
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (dest: Destination) => {
    setEditingDest(dest);
    setFormData({ ...dest });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.description?.trim()) return;

    const categoryObj = DESTINATION_CATEGORIES.find((c) => c.id === formData.categoryId);

    if (editingDest) {
      // Update
      const updated: Destination = {
        ...editingDest,
        ...(formData as Destination),
        categoryName: categoryObj?.name || 'Historical Places'
      };
      onUpdateDestination(updated);
    } else {
      // Add
      const newDest: Destination = {
        id: Date.now(),
        name: formData.name.trim(),
        categoryId: (formData.categoryId as CategoryType) || 'historical',
        categoryName: categoryObj?.name || 'Historical Places',
        city: formData.city || 'Jaipur',
        location: formData.location || 'Central District',
        description: formData.description.trim(),
        imageUrl: formData.imageUrl || '/src/assets/images/dest_ancient_palace_1793691649923.jpg',
        entryFee: Number(formData.entryFee) || 0,
        visitDurationHours: Number(formData.visitDurationHours) || 2.0,
        bestTime: formData.bestTime || 'Morning',
        address: formData.address || 'Central Heritage Zone',
        latitude: Number(formData.latitude) || 26.9,
        longitude: Number(formData.longitude) || 75.8,
        rating: 4.8,
        reviewsCount: 1,
        tags: ['Featured', 'Verified'],
        isPopular: formData.isPopular ?? true
      };
      onAddDestination(newDest);
    }

    setIsAddModalOpen(false);
    setEditingDest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5" />
            Administrative Control Center
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage tourist attractions, update category registries, and audit generated travel plans.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 block mb-1">Total Destinations</span>
          <span className="text-2xl font-bold font-mono text-slate-900">{destinations.length}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 block mb-1">Categories</span>
          <span className="text-2xl font-bold font-mono text-indigo-700">{DESTINATION_CATEGORIES.length}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 block mb-1">Generated Plans</span>
          <span className="text-2xl font-bold font-mono text-emerald-700">{travelPlans.length}</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-400 block mb-1">Database Status</span>
          <span className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            MySQL Ready
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveAdminTab('destinations')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
            activeAdminTab === 'destinations'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Destinations Management ({destinations.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('categories')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
            activeAdminTab === 'categories'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Categories ({DESTINATION_CATEGORIES.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('plans')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors ${
            activeAdminTab === 'plans'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          User Travel Plans ({travelPlans.length})
        </button>
      </div>

      {/* Content for Destinations */}
      {activeAdminTab === 'destinations' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Entry Fee</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{dest.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            ID: #{dest.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {dest.categoryName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {dest.entryFee === 0 ? 'Free' : `$${dest.entryFee.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {dest.visitDurationHours} hrs
                    </td>
                    <td className="py-3 px-4 text-slate-500 truncate max-w-[180px]">
                      {dest.location}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(dest)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Edit Destination"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDestination(dest.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Destination"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content for Categories */}
      {activeAdminTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DESTINATION_CATEGORIES.map((cat) => (
            <div key={cat.id} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                <span className="text-[11px] font-mono text-indigo-700 font-semibold uppercase">
                  {cat.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                {cat.description}
              </p>
              <div className="text-[11px] text-slate-400">
                {destinations.filter((d) => d.categoryId === cat.id).length} attractions assigned
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content for User Travel Plans */}
      {activeAdminTab === 'plans' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {travelPlans.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400">
              No tourist travel plans created yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {travelPlans.map((plan) => (
                <div key={plan.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{plan.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {plan.days} Days · {plan.travelers} Travelers · {plan.destinationCity} · Created {new Date(plan.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-emerald-700">
                      ${plan.totalEstimatedCost}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Destination Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingDest ? 'Update Tourist Destination' : 'Add New Tourist Destination'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal City Palace & Museum"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value as CategoryType })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    {DESTINATION_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location Area / Neighborhood</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. North Hill Ridge, Heritage District"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed background, architectural significance, highlights..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Entry Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Visit Duration (Hours)</label>
                  <input
                    type="number"
                    min="0.5"
                    max="12"
                    step="0.5"
                    value={formData.visitDurationHours}
                    onChange={(e) => setFormData({ ...formData, visitDurationHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street, District, Postal Code"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Best Time to Visit</label>
                <input
                  type="text"
                  value={formData.bestTime}
                  onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                  placeholder="e.g. Morning (08:30 - 11:30) for gentle sun"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  {editingDest ? 'Save Changes' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
