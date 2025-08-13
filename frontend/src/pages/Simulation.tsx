import React, { useState, useEffect } from 'react';
import { PlayIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/outline';
import { simulationService } from '../services/simulationService';
import { SimulationParams, SimulationResult } from '../types';

const Simulation: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    availableDrivers: 5,
    routeStartTime: '09:00',
    maxHoursPerDriver: 8
  });
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [history, setHistory] = useState<SimulationResult[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await simulationService.getSimulationHistory(1, 5);
        setHistory(response.data.simulations || []);
      } catch (err) {
        console.error('Failed to fetch simulation history:', err);
      }
    };
    fetchHistory();
  }, [result]);

  const handleInputChange = (field: keyof SimulationParams, value: string | number) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setError('');

    try {
      const simulationResult = await simulationService.runSimulation(params);
      setResult(simulationResult);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Simulation failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Simulation</h1>
        <p className="mt-1 text-sm text-gray-500">
          Run delivery simulations to optimize routes and driver allocation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Simulation Parameters</h3>
          </div>
          <form onSubmit={handleRunSimulation} className="p-6 space-y-6">
            <div>
              <label htmlFor="availableDrivers" className="block text-sm font-medium text-gray-700">
                Available Drivers
              </label>
              <input
                type="number"
                id="availableDrivers"
                min="1"
                max="20"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={params.availableDrivers}
                onChange={(e) => handleInputChange('availableDrivers', parseInt(e.target.value))}
                required
              />
              <p className="mt-1 text-xs text-gray-500">Number of drivers available for delivery</p>
            </div>

            <div>
              <label htmlFor="routeStartTime" className="block text-sm font-medium text-gray-700">
                Route Start Time
              </label>
              <input
                type="time"
                id="routeStartTime"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={params.routeStartTime}
                onChange={(e) => handleInputChange('routeStartTime', e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-500">Time when delivery routes should start</p>
            </div>

            <div>
              <label htmlFor="maxHoursPerDriver" className="block text-sm font-medium text-gray-700">
                Max Hours per Driver
              </label>
              <input
                type="number"
                id="maxHoursPerDriver"
                min="1"
                max="12"
                step="0.5"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={params.maxHoursPerDriver}
                onChange={(e) => handleInputChange('maxHoursPerDriver', parseFloat(e.target.value))}
                required
              />
              <p className="mt-1 text-xs text-gray-500">Maximum working hours per driver per day</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isRunning}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running Simulation...
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4 mr-2" />
                  Run Simulation
                </>
              )}
            </button>
          </form>
        </div>

        {/* Simulation Results */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Simulation Results</h3>
          </div>
          <div className="p-6">
            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-medium">₹</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">Total Profit</p>
                        <p className="text-lg font-semibold text-green-900">
                          ₹{result.results.totalProfit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">%</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">Efficiency</p>
                        <p className="text-lg font-semibold text-blue-900">
                          {result.results.efficiencyScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">On-Time</p>
                    <p className="text-lg font-semibold text-green-600">
                      {result.results.onTimeDeliveries}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Late</p>
                    <p className="text-lg font-semibold text-red-600">
                      {result.results.lateDeliveries}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {result.results.totalDeliveries}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Fuel Cost Breakdown</h4>
                  <div className="space-y-2">
                    {result.results.fuelCostBreakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.trafficLevel} Traffic</span>
                        <div className="text-right">
                          <span className="text-sm font-medium">₹{item.cost.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500">
                    Simulation ID: {result.simulationId}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(result.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <PlayIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-sm">Run a simulation to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulation History */}
      {history.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Simulations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Simulation ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parameters
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((sim, index) => (
                  <tr key={sim._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {sim.simulationId.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <TruckIcon className="h-4 w-4" />
                        <span>{sim.parameters.availableDrivers}</span>
                        <ClockIcon className="h-4 w-4" />
                        <span>{sim.parameters.routeStartTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{sim.results.totalProfit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sim.results.efficiencyScore >= 80 
                          ? 'bg-green-100 text-green-800' 
                          : sim.results.efficiencyScore >= 60 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {sim.results.efficiencyScore}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sim.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulation;