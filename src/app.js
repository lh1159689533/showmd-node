const path = require('path');
const express = require('express');
const router = require('./routes');
const bodyParser = require('body-parser');
const Response = require('./utils/Response');

const app = express();

app.use(express.static(path.resolve('public')));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '20mb' }));
app.use(function (req, res, next) {
  res.set('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.use('/showmd', router);

// error handler
// eslint-disable-next-line
app.use(function (err, req, res, next) {
  console.log('showmd err:', err.name ?? err.message);
  if (err.message === 'UnauthorizedError') {
    res.send(new Response(401, '用户未登录').toString());
  } else {
    // set locals, only providing error in development
    if (res.locals) {
      res.locals.message = err?.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    }

    // render the error page
    res.status?.(err.status || 500);
    res.end?.('404');
  }
});

module.exports = app;
