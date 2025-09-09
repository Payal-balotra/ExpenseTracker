const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profileImgUrl:{
        type:String,
        default:"",
    }
},{timestamps:true});


// Hashing password before saving to DB
userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})


//comapring password before login
userSchema.methods.comparePassword =  async function(password){
    return await bcrypt.compare(password,this.password);
}


const User = mongoose.model("User",userSchema);

module.exports = User;
