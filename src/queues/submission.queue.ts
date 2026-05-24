import { Queue } from "bullmq";
import { createNewRedisConnection } from "../config/redis.config";
import logger from "../config/logger.config";
import { SUBMISSION_QUEUE } from "../utils/constants";

export const submissionQueue = new Queue(SUBMISSION_QUEUE, {
    connection: createNewRedisConnection(),
    defaultJobOptions: {
        attempts: 3, // Retry failed jobs up to 3 times
        backoff: {
            type: 'exponential',
            delay: 3000, // Initial delay of 3 seconds before retrying
        },
    }
});

submissionQueue.on('error', (error) => {
    logger.error('Error occurred in submission queue:', error);
});

submissionQueue.on('waiting', (jobId) => {
    logger.info(`Job ${jobId} is waiting to be processed`);
});

// export const submissionEvent = new QueueEvents("submissionQueue", {
//     connection: createNewRedisConnection(),
// });

// submissionEvent.on('completed', ({ jobId }) => {
//     logger.info(`Job ${jobId} has been completed successfully`);
// });