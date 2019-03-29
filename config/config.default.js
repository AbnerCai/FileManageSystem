/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1553847606366_9552';

  // add your middleware config here
  config.middleware = [];

  config.view = {
    root: [
      path.join(appInfo.baseDir, 'app/view'),
    ].join(','),
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  config.multipart = {
    mode: 'file',
  };

  // add your user config here
  const userConfig = {
    uploadFilePath: path.join(appInfo.baseDir, 'app/upload/'),
    baseUrl: "http://file.abner.top/",
  };

  return {
    ...config,
    ...userConfig,
  };
};
