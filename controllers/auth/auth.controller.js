// Packages
const token = require("../../helpers/token.helper");
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const randomstring = require("randomstring");
const moment = require("moment");
const { validationResult } = require("express-validator");
const validator = require("validator");
const userProfileModule = require('../../models/users/userProfile.model');

const {
  BARCODE_EXSIST,
  EMAIL_PHONE_EXSIST,
  USER_NOT_FOUND,
  USERNAME_LENGTH_SMALL,
  OTP_NOT_FOUND,
  PASSWORD_NO_MATCH,
  UNABLE_TO_VERIFY_EMAIL,
  NO_EMAIL,
  INVALID_TOKEN,
  USER_ALREADY_VERIFIED,
} = require("../../errorDefinition/errors.map");

// Helpers
const userHelper = require("../../helpers/user.helper");
// const SmsHelper = require("../../helpers/sms.helper");
const response = require("../../helpers/response.helper");
// const barcodesHelper = require("../../helpers/barcode.helper");
// const Email = require("../../helpers/email.helper");
const isEmpty = require("lodash/isEmpty");
// const TokenHelper = require("../../helpers/token.helper");
const AuthHelper = require("../../helpers/auth.helper");
// const MessageResponse = require("../../helpers/languageTextUtil.helper");

class Auth {
  /**
   * @api {post} /user/signin Create a new user
   * @apiName signin
   * @apiGroup user
   *
   * @apiParam {String} email_phone  user email or user phone number.
   * @apiParam {String} user password.
   */
  static async signin(req, res) {
    let result = null;
    try {
      if (validator.isEmail(req.body.email_phone.trim())) {
        result = await userHelper.findByEmail(
          req.body.email_phone.trim().toLowerCase(),
          req.body.password.trim()
        );
      } else if (validator.isMobilePhone(req.body.email_phone.trim(), "any")) {
        result = await userHelper.findByPhone(
          req.body.email_phone.trim(),
          req.body.password.trim()
        );
      } else {
        return res
          .status(401)
          .json(new response("0015", "Email/Phone is not valid", null));
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json(new response("-1", "UNEXPECTED_ERROR", null));
    }

    if (!result) {
      return res
        .status(203)
        .json(new response("0017", "wrong email/phone or password", null));
    }

    try {
      // append platform and version to user obj
      result.platform = req.header("Platform");
      result.app_version = req.header("App-Version");
      const data = await AuthHelper.logUserIn(result);

      // res.sendSuccess(data);
      res.status(200).json(new response("0000", "SUCCESSFUL", data));
    } catch (e) {
      console.error(e);
      return res.status(500).json(new response("-1", "UNEXPECTED_ERROR", null));
    }
  }

  static async index(req, res) {
    try {
        const options = {
            sort: req.query.sort,
            order: req.query.order,
            filter: req.query.filter,
            statusFlag: req.query.statusFlag,
            pageSize: req.query.pageSize,
            page: req.query.page
        }

        const users = await userHelper.getUsers(options);
        return res.sendSuccess(users);
    } catch (error) {
        console.log(error);
        res.sendError(error, req.header('languageId'), '', error);
    }
}

  static async signinByToken(req, res) {
    try {
      const user = await userHelper.getUserByToken(req.headers["x-auth"]);
      if (!user) {
        throw USER_NOT_FOUND;
      }
      const result = {
        uid: user.uid,
        email: user.email,
        username: user.username,
        country_code: user.country_code,
        phone: user.phone,
        user_type: user.user_type,
        token: user.tokens[0]["token"],
        access_codes: user.access_codes,
      };
      res.sendSuccess(result);
    } catch (error) {
      console.log(error);
      res.sendError(error, req.header("languageId"));
    }
  }

  /**
   * @api {post} /user/signup Create a new user
   * @apiName signup
   * @apiGroup user
   *
   * @apiParam {String} username  full name of user
   * @apiParam {String} email  email address
   * @apiParam {String} country_code  country code, example "MY".
   * @apiParam {String} password  user chosen password more than 6 charecters "MY".
   * @apiParam {Number} account_type  0 if individual or 1 if expert.
   */
  static async signup(req, res) {
    try {
      const options = {
        user: req.body,
        clientKey: req.client.key,
        platform: req.header("Platform"),
        app_version: req.header("App-Version"),
      };
      const result = await AuthHelper.signup(options);
      res.sendSuccess(result);
    } catch (error) {
      console.log(error);
      return res.sendError(error, req.header("languageId"), "", error);
    }
  }

  static async update(req, res) {
    try {
        const user_id = req.params.id;
        let user = await userProfileModule.UserProfile.findOne({ _id:user_id });
        user = await userProfileModule.UserProfile.findOneAndUpdate(
            { _id:user_id },
            req.body,
            { new: true }
        );

        res.sendSuccess(user);
    } catch (error) {
        console.log(error);
        res.sendError(error, req.header('languageId'));
    }
}

}

module.exports = Auth;
