import { connect } from "mongoose";

const connectDB = async () => {
  Logger("env: ", process.env.MONGODB_URI);

  try {
    const conn = await connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add other options if needed (e.g., useFindAndModify: false)
    });
    Logger(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process on error
  }
};

export default connectDB;
