const mongoose =require( "mongoose");


const PromiseSchema = new mongoose.Schema({
email:{
    type:String,
    required:true
},
code:{
    type:String,
    required:true
},  password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be longer than 6 characters"],
        select: false,
    },
    name:{
    type:String,
        required:true
}
});
const Prom = mongoose.model("Prom", PromiseSchema);
module.exports = Prom;
  
