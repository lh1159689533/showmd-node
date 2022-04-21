const path = require('path');
const express = require('express');
// const cors = require('cors');
const router = require("./routes");

const app = express();

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(function (req, res, next) {
//   res.set("Content-Type", "text/html;charset=utf-8");
//   next();
// });

app.use('/', router);

app.use(express.static(path.resolve("public")));

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end('404');
});

module.exports = app;
