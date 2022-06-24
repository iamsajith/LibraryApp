const mongoose = require('mongoose')
const DB = "mongodb+srv://sajithjayaram:mylibraryapp@cluster0.2pltx.mongodb.net/librarydb?retryWrites=true&w=majority"
mongoose.connect(DB,{ useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
 console.log("Database Connection Successful")
}).catch((err)=>{
 console.log(err)
})

const schema = mongoose.Schema

var CredentialSchema = new schema({
 username: String,
 email:String,
 regid : Number,
 password : String,
},{
 versionKey: false
})

var credentialData = mongoose.model('credentials',CredentialSchema)
module.exports = credentialData