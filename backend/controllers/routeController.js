const { validationResult } = require('express-validator');
const Route = require('../models/Route');

const getAllRoutes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, trafficLevel } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { routeId: { $regex: search, $options: 'i' } },
        { startLocation: { $regex: search, $options: 'i' } },
        { endLocation: { $regex: search, $options: 'i' } }
      ];
    }

    if (trafficLevel) {
      query.trafficLevel = trafficLevel;
    }

    const routes = await Route.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Route.countDocuments(query);

    res.json({
      success: true,
      data: {
        routes,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching routes'
    });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: { route }
    });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching route'
    });
  }
};

const createRoute = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const existingRoute = await Route.findOne({ 
      routeId: req.body.routeId 
    });

    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: 'Route with this route ID already exists'
      });
    }

    const route = new Route(req.body);
    await route.save();

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating route'
    });
  }
};

const updateRoute = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: { route }
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating route'
    });
  }
};

const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting route'
    });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute
};