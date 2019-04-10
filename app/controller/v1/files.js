'use strict';

const Controller = require('egg').Controller;
const fs = require('mz/fs');
const path = require('path');
const process = require('child_process');

const uuidV1 = require('uuid/v1');
const moment = require('moment');
const mkdirp = require('mkdirp');

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
    const newFileName = uid + extname;
    
    const newPath = app.config.uploadFilePath + moment().format("YYYY/MM/DD/");
    const baseUrl = app.config.baseUrl + moment().format("YYYY/MM/DD/");

    const filePath = newPath + newFileName;

    let result = {};
    try {
      // 处理文件
      ctx.logger.info("文件存储路径: %s", newPath);
      try{
        fs.accessSync(newPath, fs.F_OK);
      } catch(e){
        ctx.logger.info("创建文件夹");
        mkdirp.sync(newPath);
      }

      await fs.createReadStream(file.filepath).pipe(fs.createWriteStream(filePath));

      // 执行 shell 命令
      var command = `cd ${newPath} && cwebp -q 80 ${uid}.png -o ${uid}.webp`
      await process.exec(command, function(error, stdout, stderr){
        if (error !== null) {
          ctx.logger.info('exec error: ' + error);
        } else {
          ctx.logger.info("stdout: " + stdout);
        }
      })

      ctx.logger.info("shell 执行完毕");

      result.code = 20;
      result.msg = "上传文件成功";
      let data = {
        fileName: fileName,
        url: baseUrl + newFileName,
        // path: filePath,
        tag: tag,
        createTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      // TODO: 存储数据库
      result.data = data;
    } catch(e) {
      result.code = 50;
      result.msg = "文件保存异常" + e;
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