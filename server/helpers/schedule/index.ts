import { scheduleJob, rescheduleJob, cancelJob, gracefulShutdown } from "node-schedule";
import scheduleCarmi from "./scheduleCarmi";
import scheduleToken from "./scheduleToken";

// 每分钟的第30秒触发： '30 * * * * *'
// 每小时的1分30秒触发 ：'30 1 * * * *'
// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
// 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'
// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'

export const globalScheduleJobs = (): void => {
  scheduleJob({ second: 1, minute: 0, hour: 0 }, (date) => {
    // 这里执行相关逻辑
    scheduleCarmi();
  });
  scheduleJob({ second: 0, minute: 0, hour: 1 }, (date) => {
    // 这里执行相关逻辑
    scheduleToken();
  });
};

export default {
  // 发布任务
  schedule(executionTime: string | Date, callback: (date: Date) => void): any {
    return scheduleJob(executionTime, (date) => {
      if (typeof callback === 'function') {
        callback(date);
      }
    });
  },
  // 重新安排任务
  reschedule(job: any, spec: string | Date): any {
    return rescheduleJob(job, spec);
  },
  // 取消任务
  cancel(job: any): boolean {
    return cancelJob(job);
  },
  // 取消所有任务
  cancelAll(): void {
    gracefulShutdown();
  },
};
