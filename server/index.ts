import express from "express"
import { Application, Request, Response } from "express"
import cors from "cors"
import routers from "./routers"
import db from "./models/db"
import config from "./config"
import verify from "./middlewares/verify"
import { globalScheduleJobs } from "./helpers/schedule"
import catchError from "./middlewares/catch_error"

const app: Application = express()

app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

// 校验Token
app.use(verify);

// 链接mysql
db();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 初始化路由
routers(app);

// 系统级别的定时任务
globalScheduleJobs();

app.all("/api/*", (req: Request, res: Response) => {
  res.status(404).json({ code: -1, data: [], message: "The current access API address does not exist" });
});

// 渲染页面
// app.get("*", (req, res) => {
//   res.sendFile(path_1.default.join(__dirname, "../dist", "index.html"))
// })

// 错误处理
app.use(catchError);

// 启动服务器
app.listen(config.getConfig("port"), () => {
  console.log(`Server is running on port ${config.getConfig("port")}`);
});