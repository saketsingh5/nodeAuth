const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    }
})

UserSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
            fullName: this.fullName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = async function(){
    // return jwt.sign(
    //     {
    //         sub: this._id,
    //         expiresIn:  process.env.REFRESH_TOKEN_EXPIRY
    //     },
    //     process.env.REFRESH_TOKEN_SECRET,
    // )
   return jwt.sign(
       {
           _id: this._id,
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:  process.env.REFRESH_TOKEN_EXPIRY
       }
   )
}

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('user', UserSchema);



module.exports = User;