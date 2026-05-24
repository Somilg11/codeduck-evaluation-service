import Docker from "dockerode";
import { CPP_IMAGE, PYTHON_IMAGE } from "../constants";
import logger from "../../config/logger.config";

export async function pullImage(imageName: string): Promise<void> {
    const docker = new Docker();
    return new Promise((resolve, reject) => {
        docker.pull(imageName, (err: any, stream: any) => {
            if (err) {
                console.error(`Error pulling image ${imageName}:`, err);
                return reject(err);
            }
            docker.modem.followProgress(stream, onFinished, onProgress);

            function onFinished(err: any) {
                if (err) {
                    console.error(`Error pulling image ${imageName}:`, err);
                    return reject(err);
                }
                console.log(`Successfully pulled image ${imageName}`);
                resolve();
            }

            function onProgress(event: any) {
                if (event.status) {
                    console.log(`Pulling image ${imageName}: ${event.status}`);
                }
            }
        });
    });
}

export async function pullAllImages(): Promise<void> {
    const imageNames = [PYTHON_IMAGE, CPP_IMAGE]
    const promises: Promise<void>[] = imageNames.map((name) => pullImage(name));
    try {
        await Promise.all(promises);
        logger.info("All images pulled successfully");
    } catch (error) {
        logger.error("Error occurred while pulling images:", error);
    }
}