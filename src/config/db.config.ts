import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from ".";

export const connectDB = async () => {
    try {
        const dbUrl = serverConfig.DB_URL;
        await mongoose.connect(dbUrl);
        logger.info(`Connected to MongoDB: ${dbUrl}`);

        mongoose.connection.on("error", (error) => {
            logger.error(`Error connecting to MongoDB: ${error}`);
            throw error;
        });

        mongoose.connection.on("connected", () => {
            logger.info(`Connected to MongoDB: ${dbUrl}`);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn(`Disconnected from MongoDB: ${dbUrl}`);
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info(`Disconnected from MongoDB: ${dbUrl}`);
            process.exit(0);
        });
    } catch (error) {
       logger.error(`Error connecting to MongoDB: ${error}`);
       throw error;
    }
};