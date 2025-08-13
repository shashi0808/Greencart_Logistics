import React, { useState, useEffect } from 'react';
import { PlusIcon, MapPinIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { routeService } from '../services/routeService';
import { Route } from '../types';

const Routes: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [formData, setFormData] = useState({
    routeId: '',
    name: '',
    distanceKm: 0,
    trafficLevel: 'Low' as 'Low' | 'Medium' | 'High',
    baseTimeMinutes: 0,
    startLocation: '',
    endLocation: '',
    baseFuelCost: 0,
    isActive: true
  });

  const fetchRoutes = async () => {
    try {
      setIsLoading(true);
      const response = await routeService.getAllRoutes(1, 50);
      setRoutes(response.data.routes || []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch routes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const resetForm = () => {
    setFormData({
      routeId: '',
      name: '',
      distanceKm: 0,
      trafficLevel: 'Low',
      baseTimeMinutes: 0,
      startLocation: '',
      endLocation: '',
      baseFuelCost: 0,
      isActive: true
    });
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setFormData({
      routeId: route.routeId,
      name: route.name,
      distanceKm: route.distanceKm,
      trafficLevel: route.trafficLevel,
      baseTimeMinutes: route.baseTimeMinutes,
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      baseFuelCost: route.baseFuelCost,
      isActive: route.isActive
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (showEditModal && selectedRoute) {
        await routeService.updateRoute(selectedRoute._id, formData);
      } else {
        await routeService.createRoute(formData);
      }
      await fetchRoutes();
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedRoute(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save route');
    }
  };

  const handleDelete = async (route: Route) => {
    if (window.confirm(`Are you sure you want to delete route "${route.name}"?`)) {
      try {
        await routeService.deleteRoute(route._id);
        await fetchRoutes();
      } catch (err: any) {
        setError(err.message || 'Failed to delete route');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Routes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage delivery routes and their details
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Route
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <div key={route._id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{route.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  route.trafficLevel === 'Low' 
                    ? 'bg-green-100 text-green-800' 
                    : route.trafficLevel === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {route.trafficLevel} Traffic
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">ID: {route.routeId}</p>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-center mb-3">
                <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {route.startLocation} → {route.endLocation}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Distance</p>
                  <p className="font-medium">{route.distanceKm} km</p>
                </div>
                <div>
                  <p className="text-gray-500">Base Time</p>
                  <p className="font-medium">{route.baseTimeMinutes} min</p>
                </div>
                <div>
                  <p className="text-gray-500">Fuel Cost</p>
                  <p className="font-medium">₹{route.baseFuelCost}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className={`font-medium ${route.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {route.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(route)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(route)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-screen overflow-y-auto">
            <h2 className="text-lg font-medium mb-4">
              {showEditModal ? 'Edit Route' : 'Add Route'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.routeId}
                    onChange={(e) => setFormData({...formData, routeId: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startLocation}
                    onChange={(e) => setFormData({...formData, startLocation: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.endLocation}
                    onChange={(e) => setFormData({...formData, endLocation: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    required
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({...formData, distanceKm: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Time (min) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.baseTimeMinutes}
                    onChange={(e) => setFormData({...formData, baseTimeMinutes: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fuel Cost (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.baseFuelCost}
                    onChange={(e) => setFormData({...formData, baseFuelCost: Number(e.target.value)})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Traffic Level *
                  </label>
                  <select
                    required
                    value={formData.trafficLevel}
                    onChange={(e) => setFormData({...formData, trafficLevel: e.target.value as 'Low' | 'Medium' | 'High'})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {showEditModal ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedRoute(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;