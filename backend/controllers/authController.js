import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d",
    });
};

// @desc       Register new user
// @route      POST /api/v1/auth/register
// @access     Public
export const register = async (req, res) => {
    try {

    } catch (error) {
        next(error);
    }
};

// @desc       Login user
// @route      POST /api/v1/auth/login
// @access     Public
export const login = async (req, res) => {

};

// @desc       Get user profile
// @route      GET /api/v1/auth/profile
// @access     Private
export const getProfile = async (req, res) => {

};

// @desc       Update user profile
// @route      PUT /api/v1/auth/profile
// @access     Private
export const updateProfile = async (req, res) => {

};

// @desc       Change user password
// @route      PUT /api/v1/auth/password
// @access     Private
export const changePassword = async (req, res) => {

};

