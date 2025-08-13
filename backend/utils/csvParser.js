const fs = require('fs');
const path = require('path');

const parseDriversCSV = () => {
  const csvContent = fs.readFileSync(path.join(__dirname, '../data/drivers.csv'), 'utf-8');
  const lines = csvContent.trim().split('\n').slice(1); // Skip header
  
  return lines.filter(line => line.trim()).map((line, index) => {
    const [name, shift_hours, past_week_hours] = line.split(',');
    const weekHours = past_week_hours.split('|').map(h => parseInt(h));
    const totalWeekHours = weekHours.reduce((sum, h) => sum + h, 0);
    
    return {
      name: name.trim(),
      employeeId: `DRV${(index + 1).toString().padStart(3, '0')}`,
      currentShiftHours: parseInt(shift_hours),
      past7DayWorkHours: totalWeekHours,
      licenseNumber: `DL${Math.random().toString().substring(2, 11)}`,
      phone: `+91 ${9000000000 + index}`,
      isAvailable: Math.random() > 0.2, // 80% available
      fatigueLevel: Math.min(100, Math.max(0, totalWeekHours > 50 ? 80 + Math.floor(Math.random() * 20) : Math.floor(Math.random() * 60))),
      totalDeliveries: Math.floor(Math.random() * 100) + 50,
      onTimeDeliveries: Math.floor(Math.random() * 80) + 40,
      efficiencyScore: Math.floor(Math.random() * 30) + 70
    };
  });
};

const parseRoutesCSV = () => {
  const csvContent = fs.readFileSync(path.join(__dirname, '../data/routes.csv'), 'utf-8');
  const lines = csvContent.trim().split('\n').slice(1); // Skip header
  
  const locations = [
    { start: "Delhi Hub", end: "Gurgaon Center" },
    { start: "Mumbai Central", end: "Pune Station" },
    { start: "Bangalore Tech Park", end: "Mysore Palace" },
    { start: "Chennai Marina", end: "Pondicherry Beach" },
    { start: "Hyderabad HITEC", end: "Warangal Fort" },
    { start: "Kolkata Park Street", end: "Durgapur Mall" },
    { start: "Ahmedabad SG Highway", end: "Vadodara Station" },
    { start: "Jaipur Pink City", end: "Jodhpur Blue City" },
    { start: "Noida Sector 18", end: "Faridabad NIT" },
    { start: "Lucknow Hazratganj", end: "Kanpur Mall Road" }
  ];
  
  return lines.filter(line => line.trim()).map((line, index) => {
    const [route_id, distance_km, traffic_level, base_time_min] = line.split(',');
    const location = locations[index % locations.length];
    
    return {
      routeId: `RT${route_id.padStart(3, '0')}`,
      name: `${location.start} to ${location.end}`,
      distanceKm: parseInt(distance_km),
      trafficLevel: traffic_level.trim(),
      baseTimeMinutes: parseInt(base_time_min),
      startLocation: location.start,
      endLocation: location.end,
      baseFuelCost: Math.round((parseInt(distance_km) * 8.5) + (traffic_level.trim() === 'High' ? 50 : traffic_level.trim() === 'Medium' ? 25 : 0)),
      isActive: true
    };
  });
};

module.exports = {
  parseDriversCSV,
  parseRoutesCSV
};