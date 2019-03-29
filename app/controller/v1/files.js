'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');

const uuidV1 = require('uuid/v1');
const moment = require('moment');

module.exports = class extends Controller {

  async upload() {

    const { ctx, app } = this;

    const body = ctx.request.body;
    // 校验参数
    const tag = body.tag;

    const file = ctx.request.files[0];
    const fileName = file.filename;
    const uid = uuidV1().replace(/\-/g,'');
    const extname = path.extname(fileName);
    // 存储文件的文件名为 UUID + 文件后缀
    const filePath = app.config.uploadFilePath + uid + extname;
    let result = {};
    
    try {
      // 处理文件
      fs.writeFile(filePath, file);
      result.code = 20;
      result.msg = "上传文件成功";
      let data = {
        fileName: fileName,
        url: app.config.baseUrl + uid + extname,
        path: filePath,
        tag: tag,
        createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      // TODO: 存储数据库
      result.data = data;
    } catch(e) {
      result.code = 50;
      result.msg = "文件保存异常";
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath);
    }

    ctx.body = result;
  }

  // 文件查询
  async index() {

  }
};