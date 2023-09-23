import express, { Request, Response, NextFunction } from 'express';
import redis from '../helpers/redis';
import { configModel, notificationModel } from '../models';
import mailer from '../helpers/mailer';
import { generateCode, httpBody } from '../utils';
import { Readable } from 'stream';
import fetch from 'node-fetch';
import { sendToQueue } from '../helpers/queue';
import alipay from '../helpers/alipay';
import yipay from '../helpers/yipay';

const router = express.Router();

router.get('/config', async (req: Request, res: Response, next: NextFunction) => {
  const shop_introduce = (await configModel.getKeyConfig('shop_introduce')).value;
  const user_introduce = (await configModel.getKeyConfig('user_introduce')).value;
  const invite_introduce = (await configModel.getKeyConfig('invite_introduce')).value;
  const notification = await notificationModel.getNotification({ page: 0, page_size: 1000 }, { status: 1 });
  const notifications = notification.rows.sort((a, b) => {
    return a.sort - b.sort;
  });
  res.json(httpBody(0, {
    shop_introduce,
    user_introduce,
    invite_introduce,
    notifications
  }));
});

// 发送验证码
router.get('/send_sms', async (req: Request, res: Response) => {
  const source = Array.isArray(req.query.source)
    ? String(req.query.source[0])
    : String(req.query.source);
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const phoneRegex = /^1[3456789]\d{9}$/;

  if (!emailRegex.test(source) && !phoneRegex.test(source)) {
    res.json(httpBody(-1, '请输入正确邮箱或手机号'));
    return;
  }

  // 使用 `generateCode` 函数异步生成一个代码，然后将结果存储在 `code` 变量中
  const code = await generateCode();

  // 连接到 Redis，并选择数据库 0
  // 使用 `setex` 命令将生成的代码 `code` 存储在键 `code:${source}` 中，键名中的 `${source}` 是一个变量
  // 并设置该键的过期时间为 600 秒
  await redis.select(0).setex(`code:${source}`, code, 600);

  if (emailRegex.test(source)) {
    const mailContent = `
      <div style="font-family: Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; padding: 40px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #111; font-weight: 400;">验证您的邮箱</h2>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
          <div style="text-align: center; margin-bottom: 30px;">
              <span style="display: inline-block; font-size: 42px; font-weight: 700; padding: 10px 20px; background-color: #f5f5f5; border-radius: 10px;">${code}</span>
          </div>
          <p style="font-size: 16px; color: #111; text-align: center; line-height: 1.5;">此验证码将在 10 分钟后失效，非本人操作请忽略。</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;">
          <p style="font-size: 14px; color: #999; text-align: center;">点击访问：<a href="https://chat.nonezero.top" style="color: #007AFF; text-decoration: none;">AI 助手</a></p>
      </div>
    `;

    if (emailRegex.test(source)) {
      await mailer.send(source, mailContent, `验证码：${code}`, 'code');
    }
  }

  res.json(httpBody(0, '发送成功'));
});









export default router;
