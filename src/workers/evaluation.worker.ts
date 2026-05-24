import { Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async (job) => {
        logger.info(`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`);
    }, {
        connection: createNewRedisConnection(),
    });
    worker.on('error', (error) => {
        logger.error('Error occurred in evaluation worker:', error);
    });
    worker.on('completed', (job) => {
        logger.info(`Job ${job.id} has been completed successfully`);
    });
    worker.on('failed', (job, err) => {
        logger.error(`Job ${job?.id} has failed with error: ${err.message}`);
    });
}

export async function startworkers() {
    await setupEvaluationWorker();
}