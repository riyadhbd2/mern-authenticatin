import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';

const app = express();
const port = process.env.PORT || 6007;

// call the mongodb connection function
connectDB();

// middle ware for all api
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true
}))

// get api
app.get('/', (req, res)=>{
    res.send("API working fine")
})

app.listen(port, ()=>{
    console.log(`server is running on port:${port}`);
})