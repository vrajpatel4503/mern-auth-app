import userModel from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../cloudinary/cloudinaryConfig.js";
import { uploadOnCloudinary } from "../cloudinary/cloudinary.js";

// --------- Generate refresh and access token ----------
const generateRefreshTokenAndAccessToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Token generation failed");
  }
};

// ------ Controller :- User Registration ------
export const userRegistrationController = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    // check if email pr phone number already exist
    const existingUser = await userModel
      .findOne({
        $or: [{ email }, { phoneNumber }],
      })
      .lean();

    if (existingUser) {
      let message = "";

      if (existingUser.email === email) {
        message = "Email is already exists";
      } else if (existingUser.phoneNumber === phoneNumber) {
        message = "Phone Number is already exists";
      }

      return res.status(409).json({
        success: false,
        message,
      });
    }

    // validate avatar.upload
    if (!req.files || !req.files.avatar || !req.files.avatar.length) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required. Please upload an image.",
      });
    }

    // upload avatar to cloudinary from buffer
    const avatarBuffer = req.files.avatar[0].buffer;

    let hashedPassword, avatarUpload;

    try {
      [hashedPassword, avatarUpload] = await Promise.all([
        bcryptjs.hash(password, 8),
        uploadOnCloudinary(avatarBuffer, "avatars"),
      ]);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to process your request. Please try again.",
      });
    }

    if (!avatarUpload?.secure_url || !avatarUpload?.public_id) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload avatar. Please try again.",
      });
    }

    // Create user
    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      avatar: {
        public_id: avatarUpload.public_id,
        url: avatarUpload.secure_url,
      },
      joinedAt: new Date(),
      lastLogin: null,
      isOnline: false,
    });

    try {
      await user.save();
    } catch (error) {
      await cloudinary.uploader.destroy(avatarUpload.public_id);
      return res.status(500).json({
        success: false,
        message: "User registration failed. Please try again.",
      });
    }

    // fetch created user without sensitive fields
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return res.status(200).json({
      success: true,
      message: "User registered successfully.",
      createdUser: userObj,
    });

    // try part end
  } catch (error) {
    console.log(`Error in userRegistrationController :- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server. Please try again later.",
    });
  }
};

// ------ Controller :- User Registration ------
export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Check for user with only required field
    const user = await userModel
      .findOne({ email })
      .select(
        "_id fullName email password role phoneNumber avatar joinedAt lastLogin isOnline createdAt updatedAt"
      )
      .lean();

    // check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // check password
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // generate tokens
    const { accessToken, refreshToken } =
      await generateRefreshTokenAndAccessToken(user._id);

    if (!accessToken || !refreshToken) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate tokens",
      });
    }

    // update login status
    await userModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          lastLogin: new Date(),
          isOnline: true,
        },
      },
      { new: true }
    );

    // remove password before sending
    delete user.password;

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json({
        success: true,
        message: `Welcome back ${user.fullName}`,
        user,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.log(`Error in userLoginController :- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server. Please try again later.",
    });
  }
};

// ------ Controller :- User Logout ------
export const userLogoutController = async (req, res) => {
  try {
    await userModel
      .findByIdAndUpdate(
        req.user._id,
        {
          $unset: { refreshToken: "" },
        },
        { new: true }
      )
      .lean();

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    return res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User logged out successfully",
      });

    // try part end
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to logout. Please try again",
    });
  }
};

// ------ Controller :- User Details ------
export const userDetailsController = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await userModel
      .findById(id)
      .select("-password -refreshToken")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

    // try part end
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server. Please try again later.",
    });
  }
};

// ------ Controller :- Update User Email ------
export const updateEmailController = async (req, res) => {
  try {
    const { id } = req.user;
    const { email } = req.body;

    // check is email provided by user
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }

    //  Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format. It must contain '@' and a domain",
      });
    }

    // Find the current user
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If email is different from current email, check for duplication
    if (email !== existingUser.email) {
      const emailExist = await userModel.findOne({ email });
      if (emailExist) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "New email is same as the current email",
      });
    }

    // update the email
    existingUser.email = email;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
      user: {
        email: existingUser.email,
      },
    });

    // try part end
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server. Please try again later.",
    });
  }
};

// ------ Controller :- Update User phoneNumber ------
export const updatePhoneNumberController = async (req, res) => {
  try {
    const { id } = req.user;
    const { phoneNumber } = req.body;

    // check if phone Number is provided
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide a phone number",
      });
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. It must be exactly 10 digits.",
      });
    }

    // check if user exist
    const existingUser = await userModel.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If email is different from current email, check for duplication
    if (phoneNumber !== existingUser.phoneNumber) {
      const existPhoneNumber = await userModel.findOne({ phoneNumber });
      if (existPhoneNumber) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "The new phone number is the same as the current one",
      });
    }

    // update the phone Number
    existingUser.phoneNumber = phoneNumber;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Phone number updated successfully",
    });

    // try part end
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server. Please try again later.",
    });
  }
};

// Controller : Delete User Account
export const deleteUserAccountController = async (req, res) => {
  try {
    const { id } = req.user;

    // find the user
    const user = await userModel.findById(id);

    // check user exist or not
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete avatar image from cloudinary
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // delete user from database
    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

    // try part end
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server. Please try again later.",
    });
  }
};

// controller :- update user avatar
export const updateAvatarController = async (req, res) => {
  try {
    const { id } = req.user;

    if (!req.files || !req.files.avatar || !req.files.avatar.length) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required. Please upload an image.",
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const avatarBuffer = req.files.avatar[0].buffer;

    const avatarUpload = await uploadOnCloudinary(avatarBuffer, "avatars");

    if (!avatarUpload?.secure_url || !avatarUpload?.public_id) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload avatar. Please try again.",
      });
    }

    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    user.avatar = {
      public_id: avatarUpload.public_id,
      url: avatarUpload.secure_url,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      avatar: user.avatar,
    });

    // try part end
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating avatar.",
    });
  }
};

// controller :- update user password
export const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide a new password",
      });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isSamePassword = await bcryptjs.compare(password, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    // hash new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating password",
    });
  }
};

// controller :- user last login
export const userLastLoginController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email }).select("lastLogin");

    return res.status(200).json({
      lastLogin: user?.lastLogin || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching last login",
    });
  }
};
