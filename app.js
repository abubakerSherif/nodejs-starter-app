// Packages
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Init Env
if (process.env.ENV != "production" && process.env.ENV != "dev_online") {
  require("dotenv").config();
}


const logRequestBody = require("./middlewares/logRequestBody.middleware");
const apiRouter = require("./routes/api.routes");
const Response = require("./classes/response");
const ErrorHelper = require("./helpers/error.helper");

// Internal files
const apiVersion = process.env.API_VERSION;

// Initalizeing the app 
const app = express();
console.log('[+] Express Application framework initialized')

app.use(express.static("public"));


// Parsing the json body
// app.use(express.json());
//request size limit
app.use(
  bodyParser.urlencoded({
    limit: "5mb",
    extended: false,
  })
);
app.use(
  bodyParser.json({
    limit: "5mb",
  })
);

app.use(logRequestBody);

// allow cors
app.use(cors());
console.log('[+] CORS allowed')


// overwrite res object
app.use(function (req, res, next) {
  res.sendSuccess = (data, total_count) => {
    return res.json(
      new Response({
        code: "0000",
        data,
        total_count,
      })
    );
  };

  res.sendError = (code, languageId, action, devError) => {
    languageId = "1";
    return res.json(ErrorHelper.getError(code, languageId, action, devError));
  };
  next();
});

// Identifiy the router object
const routingPoint = "/api/" + apiVersion;
app.use(routingPoint, apiRouter);
console.log('[+] Routing points setup')


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use(function (err, req, res, next) {
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  console.log(err.message);
  res.sendStatus(err.status || 500);
});

const PORT = process.env.PORT || 5000;
console.log('[+] Port setup')

// Export the express app
app.listen(PORT, () =>
  console.log(`[+] Server is now running on ${process.env.ENV}. \n[+] Listening on ${PORT}`)
);

module.exports = app;
