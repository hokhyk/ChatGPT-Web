interface MysqlConfig {
  dialect: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  timezone: string;
  dialectOptions: {
    dateStrings: boolean;
    typeCast: boolean;
  };
}

interface RedisConfig {
  type: string;
  host: string;
  port: number;
  password: string;
}

interface EmailConfig {
  host: string;
  port: number;
  ignoreTLS: boolean;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface Config {
  port: number;
  mysql_config: MysqlConfig;
  redis_config: RedisConfig;
  email: string;
  email_config: EmailConfig;
}

// 获取配置信息的函数
export function getConfig(key?: keyof Config): any {
  const config: Config = {
    port: 3200,
    mysql_config: {
      dialect: "mysql",
      host: "xxxx",
      port: 3306,
      username: "chatgptv2",
      password: "chatgptv2",
      database: "chatgptv2",
      timezone: "+08:00",
      dialectOptions: {
        dateStrings: true,
        typeCast: true,
      },
    },
    redis_config: {
      type: "redis",
      host: "xxxx",
      port: 6379,
      password: "xxxx",
    },
    email: "xxxx",
    email_config: {
      host: "smtp.qq.com",
      port: 465,
      ignoreTLS: false,
      secure: true,
      auth: {
        user: "xxxx",
        pass: "xxxx",
      },
    },
  };
  if (key) {
    return config[key];
  }
  return config;
}

export default {
  getConfig
};
