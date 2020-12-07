/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
const { APP_ROLE='admin' } = process.env;
const proxyMap = {
  admin:'http://192.168.0.104:9101',
  funder:'http://192.168.0.104:9102',
  organ:'http://192.168.0.104:9103',
}
export default {
  dev: {
    '/api/': {
      // target: 'http://192.168.0.99:7002',  // dev
      // target: 'http://192.168.0.104:7002', // test
      target: proxyMap[APP_ROLE], // test
      // target: 'http://192.168.0.110:7002',     // pre
      // target: 'https://drapi.hrfax.cn',     // pro
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
