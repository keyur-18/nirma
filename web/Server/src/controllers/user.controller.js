import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import ApiError from "../utils/error.utility.js";
import bcrypt from "bcryptjs";


// REGISTER USER
export const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = new Error("All fields are required");
        error.status = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });


    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
        success: true,
        data: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });

});

// LOGIN USER
export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.status = 400;
        throw error;
    }

    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.status = 401;
        throw error;
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
        success: true,
        message: "Login successful",
        data: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });

});

// LOGOUT USER
export const logoutUser = asyncHandler(async (req, res) => {

    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    });

    res.json({
        success: true,
        message: "Logged out successfully"
    });

});

// GET CURRENT USER
export const getCurrentUser = asyncHandler(async (req, res) => {

    res.json({
        success: true,
        data: req.user
    });

});

// GET ALL USERS
export const getUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select("-password");

    res.json({
        success: true,
        data: users
    });

});

// GET USER BY ID
export const getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    res.json({
        success: true,
        data: user
    });

});

// DELETE USER
export const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    res.json({
        success: true,
        message: "User deleted"
    });

});