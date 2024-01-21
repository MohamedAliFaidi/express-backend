const mongoose =require( "mongoose");


const PromiseSchema = new mongoose.Schema({
email:{
    type:String,
    required:true
},
code:{
    type:String,
    required:true
}
});
const Prom = mongoose.model("Prom", PromiseSchema);
module.exports = Prom;
  
