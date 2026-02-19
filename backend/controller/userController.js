import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto"; 

// ================= REGISTER =================
export const registerUser = handleAsyncError(async (req, res, next) => {

  const { name, email, password, avatar } = req.body;

  const myCloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});


// ================= LOGIN =================
export const loginUser = handleAsyncError(async (req, res, next) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HandleError("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new HandleError("Invalid email or password", 401));
  }

  const isPasswordValid = await user.verifyPassword(password);

  if (!isPasswordValid) {
    return next(new HandleError("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});


// ================= LOGOUT =================
export const logout = handleAsyncError(async (req, res, next) => {

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


// ================= FORGOT PASSWORD =================
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new HandleError("User not found", 400));
  }

  let resetToken;

  try {
    resetToken = user.generatePasswordResetToken();

    await user.save({ validateBeforeSave: false });

  } catch (error) {
    return next(
      new HandleError("Could not save reset token, try again later", 500)
    );
  }

  const resetPasswordURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

  const message = `Use this link to reset your password:\n\n${resetPasswordURL}\n\nExpires in 2 minutes.\n\nIf you did not request this, ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });

  } catch (error) {

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new HandleError("Could not send email, try again later", 500)
    );
  }
});


// ================= RESET PASSWORD =================
export const resetPassword = handleAsyncError(async (req, res, next) => {

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new HandleError("Token is invalid or expired", 400));
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new HandleError("Password does not match", 400));
  }

  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});


// ================= USER DETAILS =================
export const getUserDetails = handleAsyncError(async (req, res, next) => {

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});


// ================= UPDATE PASSWORD =================
export const updatePassword = handleAsyncError(async (req, res, next) => {

  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new HandleError("User not found", 400)); // ✅ FIX
  }

  const isMatch = await user.verifyPassword(oldPassword);

  if (!isMatch) {
    return next(new HandleError("Old password is incorrect", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new HandleError("New password does not match", 400));
  }

  user.password = newPassword;

  await user.save();

  sendToken(user, 200, res);
});


// ================= UPDATE PROFILE =================
export const updateProfile = handleAsyncError(async (req, res, next) => {

  const { name, email, avatar } = req.body;

  const updateUserDetails = {
    name,
    email,
  };

  // ✅ FIX: Safe avatar check
  if (avatar && avatar !== "") {

    const user = await User.findById(req.user.id);

    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const myCloud = await cloudinary.uploader.upload(avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    updateUserDetails.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateUserDetails,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});


// ================= ADMIN: ALL USERS =================
export const getUsersList = handleAsyncError(async (req, res, next) => {

  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});


// ================= ADMIN: SINGLE USER =================
export const getSingleUser = handleAsyncError(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new HandleError(`User not found ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});


// ================= ADMIN: UPDATE ROLE =================
export const updateUserRole = handleAsyncError(async (req, res, next) => {

  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new HandleError("User does not exist", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});


// ================= ADMIN: DELETE USER =================
export const deleteUser = handleAsyncError(async (req, res, next) => {

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new HandleError("User does not exist", 400));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
