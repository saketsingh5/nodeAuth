import User from '../models/user';
const jwt = require('jsonwebtoken')


export const VerifyJWT = async(req, res, next)=>{

   try {
        const token = req.cookies.accessToken || req.headers('Authorization').replace('Bearer ', '')
    
        if(!token){
          res.status(401).json({message:"Token not Found"})  
        }
    
        const decodedToken = jwt.verify(token,  process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken._id).select('-password -refreshToken');
    
        if(!user){
            return res.status(401).json({message: "Invalid User Access Token"})
        }
    
        req.user = user;
        next()
   } catch (error) {
        return res.status(401).json({message: "Invalid Access Token"})
   }
}