import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async() => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URL);

        console.log(colors.bgMagenta.white(`Connected to MongoDB: ${conn.connection.host}`));
    } catch (error) {
        // Log connection error
        console.error(colors.bgRed.white(`Error connecting to MongoDB: ${error.message}`));

        // Retry connection with exponential backoff
        console.log(colors.yellow('Retrying connection in 5 seconds...'));
        await new Promise(resolve => setTimeout(resolve, 5000));
        await connectDB();
    }
};

export default connectDB;