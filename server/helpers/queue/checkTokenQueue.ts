import { getKeyUsage } from "../../utils";
import { tokenModel } from "../../models";
import createQueue from "./function";

const CheckTokenQueue = createQueue('CheckTokenQueue');

async function addTask(data: any, options?: any): Promise<any> {
  const res = await CheckTokenQueue.add(data, options);
  return res;
}

CheckTokenQueue.process(async (job) => {
  const { id, key, host } = job.data;
  const check = await getKeyUsage(host, key);
  let status = 1;
  let limit = Number(check.hard_limit_usd);
  const usage = Number(check.total_usage);
  console.log('getUsage', limit, usage);

  if (check.status && limit === 0) {
    limit = 1;
  } else if (check.status || limit <= usage) {
    status = 0;
  }

  await tokenModel.editToken1({
    id,
    limit,
    usage,
    status,
  });
});

export default {
  addTask,
};
