'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/v1/file/upload', controller.v1.files.upload);

  router.get('/v1/placeholder/:size', controller.v1.placeholder.index);
};
