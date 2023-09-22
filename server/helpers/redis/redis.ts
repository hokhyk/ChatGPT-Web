import Redis, { Redis as IORedis } from "ioredis"
import config from "../../config"

const ioredis = new Redis({
  ...config.getConfig("redis_config"),
});

class RedisService {
  private ioredis: IORedis;

  constructor(ioredis: IORedis) {
    this.ioredis = ioredis;
    this.select(0);
  }

  public select(index: number = 0): this {
    this.ioredis.select(index);
    return this;
  }

  public expire(key: string, time: number = 0): this {
    if (time) {
      this.ioredis.expire(key, time);
    }
    return this;
  }

  public pexpire(key: string, time: number = 0): this {
    if (time) {
      this.ioredis.pexpire(key, time);
    }
    return this;
  }

  public async get(key: string): Promise<string | null> {
    const results = await this.ioredis.get(key);
    return results;
  }

  public set(key: string, value: string): this {
    this.ioredis.set(key, value);
    return this;
  }

  public setex(key: string, value: string, time: number): this {
    this.ioredis.setex(key, time, value);
    return this;
  }

  public sadd(key: string, value: string, time: number): this {
    this.ioredis.sadd(key, value);
    if (time) {
      this.ioredis.expire(key, time);
    }
    return this;
  }

  public srem(key: string, value: string): Promise<number> {
    return this.ioredis.srem(key, value);
  }

  public sismember(key: string, value: string): Promise<number> {
    return this.ioredis.sismember(key, value);
  }

  public smembers(key: string): Promise<string[]> {
    return this.ioredis.smembers(key);
  }

  public async del(...args: string[]): Promise<number> {
    const results = await this.ioredis.del(...args);
    return results;
  }
}

export default new RedisService(ioredis);
