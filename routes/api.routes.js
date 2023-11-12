// Packages
const express = require("express");
const { check, checkSchema } = require("express-validator");

// Internal files
const requestBodyValidator = require("../middlewares/requestBodyValidator.middleware");

// Initialize the main router
const router = express.Router();
//#region
// Autharization middleware
const clientKey = require("./../middlewares/clientKey.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const authValidatorSchema = require("./validators/auth.validator");

// Authintication
// #region
const authController = require("../controllers/auth/auth.controller");
const newsController = require("../controllers/news/news.controller");
const ordersController = require("../controllers/orders/orders.controller");

const apiVersion = process.env.API_VERSION;
const routingPoint = "/api/" + apiVersion;

router.post(
  "/user/signin",
  // clientKey.clientKey,
  [
    check("password").exists().withMessage("`password` is required"),
    check("email_phone").exists().withMessage("`email_phone` is required"),
  ],
  requestBodyValidator.check,
  authController.signin
);

router.patch(
  "/user/:id",
  // clientKey.clientKey,
  requestBodyValidator.check,
  authController.update
);

router.post(
  "/user/signup",
  // clientKey.clientKey,
  [
    check("phone").exists().withMessage("`phone` is required"),
    check("password")
      .isLength({
        min: 6,
      })
      .withMessage("`password` should be more than 8 characters"),
    check("password").exists().withMessage("`password` is required"),
    check("user_type").exists().withMessage("`user_type` is required"),
    check("username").exists().withMessage("`username` is required"),
    check("country_code").exists().withMessage("`country_code is required"),
  ],
  requestBodyValidator.check,
  authController.signup
);

router.get(
  "/user",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  authController.index
);

router.get(
  "/user/:id",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  authController.show
);

router.post(
  "/news",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  newsController.create
);

router.patch(
  "/news/:id",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  newsController.update
);

router.get(
  "/news",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  newsController.index
);

router.delete(
  "/news/:id",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  newsController.delete
);

router.post(
  "/orders",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  ordersController.create
);

router.patch(
  "/orders/:id",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  ordersController.update
);

router.delete(
  "/orders/:id",
  // clientKey.clientKey,
  // authMiddleware.authorize,
  ordersController.delete
);

router.get(
  "/orders",
  // clientKey.clientKey,
  ordersController.index
);


module.exports = router;
