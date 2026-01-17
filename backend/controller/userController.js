import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const registerUser = handleAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "temproary"
        }
    })
    sendToken(user, 201, res);
})

// Login
export const loginUser = handleAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new HandleError("Please enter email and password", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new HandleError("Invalid email or password", 401))
    }

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
        return next(new HandleError("Invalid email or password", 401))
    }

    sendToken(user, 200, res);

})

// Logout
export const logout = handleAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })

})

// Forgot Password
export const requestPasswordReset = handleAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new HandleError("User not found", 400))
    }
    let resetToken;
    try {
        resetToken = user.generatePasswordResetToken()
        await user.save({ validateBeforeSave: false })

    } catch (error) {
        return next(new HandleError("couldvnot save reset token, Please try again Later", 500))
    }

    const resetPasswordURL = `http://localhost/api/v1/reset/${resetToken}`;
    const message = `Use this link to reset your password ${resetPasswordURL}. \n\n expires in 2 minutes. \n\n If you have not requested this email then, please ignore it.`;

    try {
        // Send Email
        await sendEmail({
            email: user.email,
            subject: "Password Reset",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new HandleError("could not send email, Please try again Later", 500))
    }
})

// Reset Password
export const resetPassword = handleAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new HandleError("Token is invalid or has expired", 400))
    }
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return next(new HandleError("Password does not match", 400))
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
})

// get user details
export const getUserDetails = handleAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

// updating the password
export const updatePassword = handleAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const checkPasswordMatch = await user.verifyPassword(oldPassword);

    if (!checkPasswordMatch) {
        return next(new HandleError("Old password is incorrect", 400))
    }
    if (newPassword !== confirmPassword) {
        return next(new HandleError("New password does not match", 400))
    }
    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);

    if (!user) {
        return next(new HandleError("User not found", 400))
    }
})

//updating user profile
export const updateProfile = handleAsyncError(async (req, res, next) => {
    const { name, email } = req.body;
   const updateUserDetails = {
        name,
        email
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateUserDetails, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({
        success: true,
        message:"profile updated successfully",
        user
    })

})