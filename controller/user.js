const { findById } = require("../models/user");
const User = require("../models/user");
const getAllUsers = require("../views/USER_DATA.json")

const generateAccessAndRefreshToken = async(userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw console.error("Something went wrong generating Token");
  }
}

async function handleNewUsers(req, res) {
  const { fullName, email, password } = req.body.user;
  let result = await User.create({ fullName, email, password });
  return res.status(201).json(result);
}

async function loginUser(req, res) {
  const { fullName, email, password } = req.body.userdata;

  const user = await User.findOne({
    $or: [{ email }, { fullName }],
  });


  const isPassCorrect = await user.isPasswordCorrect(password);

  if (!isPassCorrect) {
    return res.status(401).json({success: false, message: "Enter Valid Password"});
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // for cookie
  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({success: true, loggedInUser, accessToken, refreshToken});
}

async function refreshToken(req, res){
  // changes for  refreshToken
}

async function getUsers(req, res){

  const { offset, limit} = req.query;
  
  
  const startIndex = (offset - 1) * limit;
  const endIndex = offset * limit;
  
  const paginatedProducts = getAllUsers.slice(startIndex, endIndex);
  // console.log(startIndex, endIndex);
    
    const totalPages = Math.ceil(getAllUsers.length / limit);
    
    return res.json({ users: paginatedProducts, totalPages });

  // return res.json(getAllUsers)
}

module.exports = {
  handleNewUsers,
  loginUser,
  refreshToken,
  getUsers
};
