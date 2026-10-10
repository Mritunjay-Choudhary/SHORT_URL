import express from "express";
import "dotenv/config";
import { router } from "./routes/url.route.js";
import { connectToMongoDB } from "./connect.js";

const app = express();

connectToMongoDB()
.then(()=>{
    app.listen(process.env.PORT || 4000, () => console.log(`Server is Listening on port:${process.env.PORT}`));
})
.catch((error) =>{
    console.log("MongoDB connection failed:",error)

})

app.use(express.json())
app.use("/url", router)
 
