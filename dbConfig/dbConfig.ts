import mongoose from "mongoose";

export default function dbConnect(){
    try {
        mongoose.connect(process.env.MONGODB_URI!);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB database connection established successfully");
        });

        connection.on('error', (err) => {
            console.log("MongoDB connection error ", err);
            process.exit();
        });
        
    } catch (error) {
        console.log("Error connecting to Database: ", error);
    }
}