import { Request, Response, NextFunction } from "express";
import { httpBody } from "../utils";
import redis from "../helpers/redis";
import { verifyPath } from "./pathConfig";

// 校验路由和redis里面的token
async function verify(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { token } = req.headers;
  const { path, method } = req;
  const filter = verifyPath.filter((router) => router.toUpperCase() === `${method}:${path}`.toUpperCase());

  if (filter.length || path.indexOf('/api') === -1) {
    await next();
    return;
  }

  const redisTokenKey = `token:${token}`;
  let tokenInfo = (await redis.select(1).get(redisTokenKey)) || null;

  if (tokenInfo) {
    // 当前为前端用户登陆
    try {
      tokenInfo = JSON.parse(tokenInfo);
    } catch (e) {
      redis.select(1).del(redisTokenKey);
      res.status(401).json(httpBody(-1, 'token失效'));
      return;
    }
  } else {
    res.status(401).json(httpBody(-1, '请登陆'));
    return;
  }

  // 在加一层是否访问的后端接口
  if (path.indexOf('/api/admin') !== -1 && tokenInfo?.role !== 'administrator') {
    res.status(403).json(httpBody(-1, '拒绝访问'));
    return;
  }

  req.user_id = tokenInfo?.id;
  next();
}

export default verify;
