import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';


const app = express();
const port = process.env.PORT || 6007;

// call the mongodb connection function
connectDB();

const allowedOrigins = ['https://mern-authenticatin-oe2r-a6rr2srdd-easir-arafats-projects.vercel.app/',
'http://localhost:5174']

// middle ware for all api
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials:true
}))
// app.use(cors({
//     origin: (origin, callback) => {
//         console.log("CORS Origin:", origin);
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
// }));


// API Endpoints
app.get('/', (req, res)=>{
    res.send("API working fine")
})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


app.listen(port, ()=>{
    console.log(`server is running on port:${port}`);
})