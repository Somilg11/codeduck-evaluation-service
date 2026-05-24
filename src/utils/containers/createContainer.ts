import logger from "../../config/logger.config";
import Docker from "dockerode";


export interface CreateContainerOptions {
    imageName: string;
    cmdExecutable: string[];
    memoryLimit: number; // in bytes
}

export async function createNewDockerContainer(options: CreateContainerOptions): Promise<Docker.Container | null> {
    try {
        const docker = new Docker();
        const container = await docker.createContainer({
            Image: options.imageName,
            Cmd: options.cmdExecutable,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: false,
            OpenStdin: true, // Keep stdin open to allow interaction with the container
            HostConfig: {
                Memory: options.memoryLimit,
                PidsLimit: 10, // Limit the number of processes in the container
                CpuQuota: 50000, // Limit CPU usage to 50% of a single CPU core
                CpuPeriod: 100000, // Set the CPU period to 100ms
                SecurityOpt: ["no-new-privileges"], // Prevent privilege escalation
                NetworkMode: "none", // Disable networking for the container
                AutoRemove: true, // Automatically remove container after it exits
            },
        });
        logger.info(`Docker container created with ID: ${container.id}`);
        return container;
    } catch (error) {
        logger.error("Error creating Docker container:", error);
        return null;
    }
}