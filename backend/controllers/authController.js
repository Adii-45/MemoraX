import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc Register new user
// @route POST /api/auth/register
// @access Public
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error:
          userExists.email === email
            ? "Email already registered"
            : "Username already taken",
        statusCode: 400,
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio || "",
        createdAt: user.createdAt,
      },
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
// @access Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
        statusCode: 400,
      });
    }

    // check for user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    // check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      });
    }

    // generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio || "",
      },
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get public profile by user ID
// @route GET /api/auth/profile/:id
// @access Private
export const getUserPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username profileImage bio createdAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email, bio } = req.body;

    const user = await User.findById(req.user.id);

    // Validate name
    if (username !== undefined) {
      if (!username || username.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: "Name must be at least 2 characters",
          statusCode: 400,
        });
      }
      // Check if username is already taken by another user
      const existingUser = await User.findOne({ username: username.trim(), _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Username is already taken",
          statusCode: 400,
        });
      }
      user.username = username.trim();
    }

    // Validate email
    if (email !== undefined) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid email address",
          statusCode: 400,
        });
      }
      // Check if email is already taken by another user
      const existingEmail = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user.id } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: "Email is already registered to another account",
          statusCode: 400,
        });
      }
      user.email = email.toLowerCase();
    }

    // Validate bio
    if (bio !== undefined) {
      if (bio.length > 200) {
        return res.status(400).json({
          success: false,
          error: "Bio cannot exceed 200 characters",
          statusCode: 400,
        });
      }
      user.bio = bio;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Change user password
// @route PUT /api/auth/password
// @access Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Please provide current password and new password",
        statusCode: 400,
      });
    }

    const user = await User.findById(req.user.id).select("+password");

    // check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
        statusCode: 400,
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long",
        statusCode: 400,
      });
    }

    // update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile image
// @route PUT /api/auth/profile-image
// @access Private
export const updateProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image file",
        statusCode: 400,
      });
    }

    import("../config/cloudinary.js").then((cloudinaryModule) => {
      const cloudinary = cloudinaryModule.default;
      
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profile_pictures" },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ success: false, error: "Cloudinary upload failed" });
          }

          const user = await User.findById(req.user.id);
          user.profileImage = result.secure_url;
          await user.save();

          res.status(200).json({
            success: true,
            data: {
              id: user._id,
              username: user.username,
              email: user.email,
              profileImage: user.profileImage,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            },
          });
        }
      );

      stream.end(req.file.buffer);
    }).catch(err => {
      next(err);
    });
  } catch (error) {
    next(error);
  }
};
