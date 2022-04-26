import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        required:true,
        type:String,
        default:'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
    },
    admin:{
        type:Boolean,
        default:false,
        required:true,
    }
},{timestamps:true});

userSchema.pre('save', async function(next){
    
        if(!this.isModified('password')){
            next();
        }else{
             const hash = await bcrypt.genSalt(27);
             this.password = await bcrypt.hash(this.password, hash);
        }
})

userSchema.methods.comparePassword = async function(candidatePassword){
  return await bcrypt.compare(candidatePassword, this.password);
};
export const userModel = mongoose.model("users", userSchema);