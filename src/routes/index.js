const express = require("express");
const router = express.Router();
const Marked = require('../marked');
const fs = require('fs');
const path = require('path');
const logger = require('../logger');
const UploadMd = require('../service/UploadMd');

router.get("/", async (req, res, next) => {
  // const content = await fs.readFileSync(path.resolve('./src/demo/笔记.md'));
  // const html = await new Marked().parse(content.toString());
  // res.send(html);
  next();
});

router.post('/showmd/uploadProject', async (req, res) => {
  UploadMd.run(req);
  res.send('ok');
});

module.exports = router;