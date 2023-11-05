const token = require('./token.helper');
const {
    BARCODE_EXSIST,
    EMAIL_PHONE_EXSIST,
    WECHAT_API_CALL_ERROR,
    USER_NOT_FOUND,
    WGO_USER_ACCOUNT_EXPIRED,
    APPROVAL_WAIT,
    THIS_WECHAT_ACCOUNT_ALREADY_REGISTERED,
} = require('../errorDefinition/errors.map');
const http = require('axios').default;

// Helpers
const userHelper = require('./user.helper');
const validator = require('validator');
const isEmpty = require('lodash/isEmpty');
const crypto = require('crypto');



class Auth {
    static async signup({ user, clientKey, platform, app_version }) {

        user.email ? user.email = user.email.trim().toLowerCase() : null;
        user.phone = user.phone.trim();

        if (user.email) {
            user.hasOwnProperty('is_email_subscribed') ? user.is_email_subscribed = user.is_email_subscribed : null
        }
        // check if user already exists
        let userExixst = await userHelper.userExists(
            user.email,
            user.phone
        );

        if (userExixst) {
            throw EMAIL_PHONE_EXSIST
        }

        let password = await userHelper.hashPassword(user.password.trim());

        user.client = clientKey;


        let registeredUser = await userHelper.create(user, password);
        // registeredUser.email ? Auth.checkForEmailVerification(registeredUser.email): null;

        registeredUser.platform = platform;
        registeredUser.app_version = app_version;
        let { generatedToken, refreshToken } = await token.generate(
            registeredUser
        );
        let data = {
            uid: registeredUser.uid,
            email: registeredUser.email,
            username: registeredUser.username,
            country_code: registeredUser.country_code,
            phone: registeredUser.phone,
            user_type: registeredUser.user_type,
            token: generatedToken.token,
            refresh_token: refreshToken,
            white_label_id: registeredUser.white_label_id,
        };

        return data;
    }

    static async logUserIn(user) {

        try {
            let { generatedToken, refreshToken } = await token.generate(user);
            let data = {}

            data = {
                uid: user.uid,
                email: user.email,
                username: user.username,
                country_code: user.country_code,
                phone: user.phone,
                user_type: user.user_type,
                token: generatedToken.token,
                refresh_token: refreshToken,
                access_codes: user.access_codes,
            };

            return data;
        } catch (error) {
            console.log('auth helper error:',error);
            
            throw error
        }
        
    }





}

module.exports = Auth;
