import Bull from "bull";
import { getConfig } from "../../config";

function createQueue(queueName: string): Bull.Queue {
  return new Bull(queueName, {
    redis: {
      ...getConfig("redis_config"),
      db: 11,
    },
    defaultJobOptions: {
      removeOnComplete: false,
      removeOnFail: false,
    },
  });
}

export default createQueue;
