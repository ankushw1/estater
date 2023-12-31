const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const authController = require('./controllers/authController');
const propertyController = require("./controllers/propertyController");
const uploadController = require("./controllers/uploadController");


const app = express();


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


mongoose.set('strictQuery',false)
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected successfully!!!"))
  .catch(error => console.log(error));



app.use('/auth',authController)
app.use('/property',propertyController)
app.use('/upload',uploadController)

const PORT = process.env.PORT

app.listen(PORT , () => {
  console.log(`server is connected successfully on ${PORT}!!!`);
});
