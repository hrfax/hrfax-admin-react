# 短融管理平台

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```
### 部署地址
http://192.168.0.39:8080/jenkins/job/%E7%9F%AD%E8%9E%8D-%E4%B8%9A%E5%8A%A1%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0-%E5%89%8D%E7%AB%AF102/

## 开发访问地址
http://192.168.0.102:3099
## 测试访问地址
http://192.168.0.102:3104
## 预发访问地址
http://192.168.0.102:3110

### 简单约束
## 列表返回格式
```bash
{
  data:[{any}], // 数据源
  current: 1, // 当前页码
  pageSize: 20, // 一页显示多少条
  total:100, // 总条数
}
```

## 列表前端参数
```bash
{
  current:1, 
  pageSize:20,
  ...
}
```
## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
