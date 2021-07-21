# fly-client
Fly，旅游项目（node服务）

## 目标

- 完成用户模块的接口开发

- 使用JWT技术验证用户

- 提取公共逻辑，优化系统

## 技术要点

- 核心技术：Sequelize、JWT、Redis

- 框架扩展
扩展Egg.js、优化egg-auth、userExist中间件

## 学习收获

- 学习如何开发登录、注册接口以及注意事项

- 学习到如何使用JWT技术进行用户验证

- 如何根据项目需求进行优化（框架扩展、中间件、公共类）

## docker 部署 egg.js
- Dockerfile

```bash
# 提前删除 node_mudules等忽略文件 再上传
scp -r ./** root@112.74.201.142:/home/fly/server/
cd /home/fly
# 创建镜像
docker build -t egg-fly:v1.0 ./server   
# 创建启动容器
docker run -d -p 7001:7001 --name fly-client xxxx(镜像id)
# 7001(前面) 外网映射端口
# 7001(后面) 容器内部端口
```
