import { comparePass, genToken } from "../utils/index.js";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
import User from "../models/user_model.js";
import ErrHandler from "../middlewares/err_handler.js";
import { resetPassMail } from "../utils/send_email.js";
import crypto from "crypto";

export const signupUser = async (req, res, next) => {
  try {
    const { name, email, password, profileImg } = req.body;

    let myCloud;
    if (profileImg) {
      myCloud = await cloudinary.v2.uploader.upload(profileImg, {
        folder: "cnectify/profile_imgs",
      });
    }

    const hashPass = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name,
      email: email,
      password: hashPass,
      profileImg: {
        imgId: profileImg ? myCloud.public_id : "",
        imgUrl: profileImg ? myCloud.secure_url : "",
      },
    });

    // generate token
    const tokenId = genToken({ id: user._id });

    res.status(200).json({ ...user._doc, tokenId });
  } catch (error) {
    return next(error);
  }
};

export const signinUser = async (req, res, next) => {
  try {
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;

    if (!inputEmail || !inputPassword) {
      return next(new ErrHandler(400, "Please fill all the fields!"));
    }

    const userExist = await User.findOne({ email: inputEmail });
    if (!userExist) {
      return next(new ErrHandler(401, "Invalid email or password!"));
    }
    const userPassword = await comparePass(inputPassword, userExist.password);

    if (!userPassword) {
      return next(new ErrHandler(401, "Invalid email or password!!"));
    }
    // generate token
    const tokenId = genToken({ id: userExist._id });

    //  prevent password to send in response
    const { password, ...user } = userExist._doc;
    res.status(200).json({ ...user, tokenId });
  } catch (error) {
    return next(error);
  }
};

export const signinWithGoogle = async (req, res, next) => {
  try {
    const { name, email, profileImg } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      const tokenId = genToken({ id: user._id });
      return res.status(200).json({ ...user._doc, tokenId });
    }

    let myCloud = null;
    if (profileImg?.imgUrl) {
      myCloud = await cloudinary.v2.uploader.upload(profileImg.imgUrl, {
        folder: "cnectify/profile_imgs",
      });
    }

    const newUser = await User.create({
      name,
      email,
      fromGoogle: true,
      profileImg: {
        imgId: myCloud ? myCloud.public_id : "",
        imgUrl: myCloud ? myCloud.secure_url : "",
      },
    });

    const tokenId = genToken({ id: newUser._id });

    res.status(200).json({ ...newUser._doc, tokenId });
  } catch (error) {
    return next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("tokenId");
    res.status(200).json("user logged out!");
  } catch (error) {
    return next(error);
  }
};

export const forgotPass = async (req, res, next) => {
  let user;

  try {
    user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrHandler(404, "user not found"));
    }

    // get reset password token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Update user object with the new reset token data
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // for deploying
    // const resetPassUrl = `${req.protocol}://${req.get(
    //   "host"
    // )}/reset-pass/${resetToken}`;

    // if you change your url then you have to some changes in mail-msg that can help code to run better
    // for testing
    const resetPassUrl = `${process.env.frontend_base_url}/pass/reset?token=${resetToken}`;

    const mailMsg = `<h1> Your reset password token is :- </h1> 
       <p> ${resetPassUrl} </p>
     <p> If you have not requested this email then please ignore it! </p>`;

    await resetPassMail({
      email: user.email,
      subject: `Password recovery mail from Social-Verse app`,
      html: mailMsg,
    });
    res.status(200).json(`Reset link sent to email - ${user.email}`);
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(error);
  }
};

export const resetPass = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrHandler(
          400,
          "reset password token is invalid or has been expired!"
        )
      );
    }
    if (password !== confirmPassword) {
      return next(new ErrHandler(400, "password does not match!"));
    }

    const hashPass = await bcrypt.hash(password, 12);

    user.password = hashPass;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();
    res.status(200).json("Password has been reset");
  } catch (error) {
    return next(error);
  }
};

export const changePass = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const isPassMatched = await comparePass(req.body.oldPass, user.password);

    if (!isPassMatched) {
      return next(new ErrHandler(400, "Old password is incorrect"));
    }

    if (req.body.newPass.length <= 3) {
      return next(
        new ErrHandler(400, "password must be at least 4 charactes!")
      );
    }
    if (req.body.newPass !== req.body.confirmPass) {
      return next(new ErrHandler(400, "password does not match"));
    }
    const hashPass = await bcrypt.hash(req.body.newPass, 12);

    user.password = hashPass;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};
