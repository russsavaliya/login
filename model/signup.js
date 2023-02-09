var mongoose=require('mongoose')
var schema=mongoose.Schema

let validetion =new schema({
    name:String,
    profile:[String],
    cover:[String],
    email:{type:String,
           unique:[true,"plz enter second email"],
           required:[true,'enter email'] 
    },
    password:String
})
 let database=mongoose.model('user',validetion)
 module.exports=database