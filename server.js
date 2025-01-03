import express from 'express';
import colors from 'colors';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js';
import ProductRoute from './routes/ProductRoute.js';
//configure env
dotenv.config();

//databse config

connectDB();

//rest object

const app = express();
//3
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', ProductRoute);
//rest api
app.get('/', (req, res) => { // Added => here
    res.send('<h1>Welcome to ecommerce website</h1>');
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(colors.bgCyan.white(`server is running is on ${process.env.DEV_MODE} ${PORT} `));

})