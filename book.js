const mongoose = require("mongoose")
const DB = "mongodb+srv://sajithjayaram:mylibraryapp@cluster0.2pltx.mongodb.net/librarydb?retryWrites=true&w=majority"
mongoose.connect(DB,{ useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
 console.log("Database Connection Successful")
}).catch((err)=>{
 console.log(err)
})
const schema = mongoose.Schema

const BookSchema = new schema({
 author : String,
 bookname : String,
 imgUrl : String,
 synopsis : String
},{
 versionKey: false
})
const bookData = mongoose.model('books',BookSchema)
module.exports = bookData




