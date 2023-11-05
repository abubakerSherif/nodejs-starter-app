



const userProfileModule = require('../models/users/userProfile.model');
const { isset } = require('../helpers/utils.helper');

const {
    INPUT_OLD_PASSWORD,
    INPUT_NEW_PASSWORD,
    INPUT_EMAIL_OR_PHONE,
    WRONG_PASSWORD,
    OLD_PASSWORD_EQUALS_NEW,
    PASSWORD_NO_MATCH,
    NO_VERIFIED_OR_SUBSCRIBED,
    OTP_DUPLICATED,
    USER_NOT_FOUND,
    BARCODE_EXSIST,
    ERROR_IN_BODY
} = require('../errorDefinition/errors.map');
const amapGaodeApiKey = process.env.AMAP_GAODE_KEY
const geocodingMapApiKey = process.env.GEOCODING_MAP_API_KEY
const IOWT_CHINA = process.env.IOWT_CHINA
const utils = require('./utils.helper');
const WGOaccessCheck = require('./utils.helper').WGOaccessCheck;
const validate = require("validate.js");
const bcrypt = require('bcrypt-nodejs');
const isEmpty = require('lodash/isEmpty');
const compact = require('lodash/compact');
const uniq = require('lodash/uniq');
const ObjectId = require('mongoose').Types.ObjectId;
const MessageResponse = require("../helpers/languageTextUtil.helper");
class User {
    static async findByCountry(country) {
        return await userProfileModule.UserProfile.find({
            'location.coutry': country
        });
    }

    static async findByPostcode(postcode) {
        return await userProfileModule.UserProfile.find({
            'location.postcode': postcode
        });
    }


    static async findValidRecipients(recipients = []) {

        let query = {
            is_email_verified: true,
            is_email_subscribed: true
        };
        if (recipients.length) {
            query.email = { $in: recipients };
        }

        const emailArrayObj = await userProfileModule.UserProfile.find(
            query,
            ["email", "username"]
        );
        if (emailArrayObj.length < 1) {
            throw NO_VERIFIED_OR_SUBSCRIBED
        }
        return emailArrayObj;
      }

      static async findValidRecipientsForSms(recipients = []) {

        let query = {
            is_phone_verified: true
        };
        if (recipients.length) {
            query.email = { $in: recipients };
        }

        const users = await userProfileModule.UserProfile.find(
            query,
            ["phone", "uid"]
        );
        if (users.length < 1) {
            throw NO_VERIFIED_OR_SUBSCRIBED
        }
        return users;
      }

      static async findUsersWithPostCode(postcode) {

        let query = {
            is_email_verified: true,
            is_email_subscribed: true,
            'location.postcode': {
                $regex: postcode,
                $options: 'xi'
            }
        };

        const emailArrayObj = await userProfileModule.UserProfile.find(
            query,
            ["email", "username", "uid"]
        );

        if (emailArrayObj.length < 1) {
            throw NO_VERIFIED_OR_SUBSCRIBED
        }
        return emailArrayObj;
      }


    static async findByEmail(email, password) {
        let result;
        try {
            result = await userProfileModule.UserProfile.aggregate()
                .match({ email })
                .lookup({
                    from: 'user_types',
                    localField: 'user_type',
                    foreignField: 'user_type',
                    as: 'access_codes'
                })
                .unwind('access_codes')
                .project({
                    uid: 1,
                    email: 1,
                    username: 1,
                    is_email_verified: 1,
                    country_code: 1,
                    phone: 1,
                    user_type: 1,
                    tokens: 1,
                    password: 1,
                    white_label_id: 1,
                    access_codes: {
                        $concatArrays: [
                            '$access_codes.access_codes',
                            {
                                $ifNull: ['$extra_access_codes', []]
                            }
                        ]
                    },
                    wechat: 1,
                });

            result = result[0];

            if (result) {
                if (bcrypt.compareSync(password, result.password)) {
                    return result;
                }
                return null;
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    static async findByPhone(phone, password) {
        let result;

        phone = phone.replace(/\D/g, '');

        if (phone.length < 8) {
            return null;
        }

        const queryIndicator = phone.substr(phone.length - 8);

        try {
            const regexFactor = '' + queryIndicator + '$';
            result = await userProfileModule.UserProfile.aggregate()
                .match({
                    phone: {
                        $regex: regexFactor
                    }
                })
                .lookup({
                    from: 'user_types',
                    localField: 'user_type',
                    foreignField: 'user_type',
                    as: 'access_codes'
                })
                .unwind('access_codes')
                .project({
                    uid: 1,
                    email: 1,
                    username: 1,
                    is_email_verified: 1,
                    country_code: 1,
                    phone: 1,
                    user_type: 1,
                    tokens: 1,
                    password: 1,
                    white_label_id: 1,
                    access_codes: {
                        $concatArrays: [
                            '$access_codes.access_codes',
                            {
                                $ifNull: ['$extra_access_codes', []]
                            }
                        ]
                    },
                    wechat: 1,
                });

            if (result) {
                for (const user_itt of result) {
                    if (bcrypt.compareSync(password, user_itt.password)) {
                        return user_itt;
                    }
                }

                return null;
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    static async getUserInfos(userInfo) {
        try {
            let result = await userProfileModule.UserProfile.find({
                _id: { $in: userInfo }
            },['phone','email','country_code']).limit(25);

            return result
        } catch (error) {
            throw error;
        }
    }

    static async update(uid, user) {
        try {
            if (user.length < 1) {
                return;
            }

            const objToUpdate = {};
            const objToAddToSet = {};

            user.email
                ? (objToUpdate.email = user.email.trim().toLowerCase())
                : null;
            user.phone ? (objToUpdate.phone = user.phone) : null;
            user.country_code
                ? (objToUpdate.country_code = user.country_code)
                : null;
            user.organisation ? (objToUpdate.organisation = user.organisation) : null;
            user.contact_person ? (objToUpdate.contact_person = user.contact_person) : null;
            user.remark ? (objToUpdate.remark = user.remark) : null;
            user.username ? (objToUpdate.username = user.username) : null;
            user.referral ? (objToUpdate.referral = user.referral) : null;
            user.ic_number ? (objToUpdate.ic_number = user.ic_number) : null;
            user.gender ? (objToUpdate.gender = user.gender) : null;
            user.avatar ? (objToUpdate.avatar = user.avatar) : null;
            user.password ? (objToUpdate.password = user.password) : null;
            user.user_type ? (objToUpdate.user_type = user.user_type) : null;
            user.is_client_pic
                ? (objToUpdate.is_client_pic = user.is_client_pic)
                : null;
            user.reset_password_token
                ? (objToUpdate.reset_password_token = user.reset_password_token)
                : null;
            user.reset_password_token_expire_at
                ? (objToUpdate.reset_password_token_expire_at =
                      user.reset_password_token_expire_at)
                : null;
            user.update_address_token
                ? (objToUpdate.update_address_token = user.update_address_token)
                : null;
            user.update_address_token_expire_at
                ? (objToUpdate.update_address_token_expire_at =
                      user.update_address_token_expire_at)
                : null;
            user.wechat ? objToUpdate.wechat = user.wechat : null;
            user.hasOwnProperty('is_email_subscribed') ? objToUpdate.is_email_subscribed = user.is_email_subscribed : null;
            user.hasOwnProperty('is_email_verified') ? objToUpdate.is_email_verified = user.is_email_verified : null;
            user.email_validation_token ? objToUpdate.email_validation_token = user.email_validation_token : null;

            if (user.new_password || user.old_password) {
                if (!user.old_password) {
                    throw INPUT_OLD_PASSWORD;
                }
                if (!user.new_password) {
                    throw INPUT_NEW_PASSWORD;
                }
                if (user.new_password !== user.confirm_password) {
                    throw PASSWORD_NO_MATCH;
                }
                if (!user.email && !user.phone) {
                    throw INPUT_EMAIL_OR_PHONE;
                }
                let correctPassword = '';
                if (user.email) {
                    correctPassword = await this.findByEmail(user.email.trim(),user.old_password.trim())
                }else if (user.phone) {
                    correctPassword = await this.findByPhone(user.phone.trim(),user.old_password.trim())
                }

                if (!correctPassword) {
                    throw WRONG_PASSWORD
                }

                if (user.new_password === user.old_password) {
                    throw OLD_PASSWORD_EQUALS_NEW
                }

                objToUpdate.password = await this.hashPassword(user.new_password)
            }



            // if (await WGOaccessCheck(currentUser, 3) || await WGOaccessCheck(currentUser, 2)) {

            //     user.password ? (objToUpdate.password = user.password) : null;

            //     objToUpdate.password = await this.hashPassword(user.password)

            // }


            if (user.extra_access_codes) {
                objToAddToSet.extra_access_codes = user.extra_access_codes;
            }

            if (user.location) {
                objToUpdate.location = user.location;
                //TODO: consider barcode email request everytime user updates their address
                // await BarcodeHelper.requestBarcode(uid, user.location);
            }

            if (objToUpdate.email) {
                objToUpdate.is_email_verified = false;
            }

            if (user.otps) {
                objToAddToSet.otps = user.otps;
            }

            const result = await userProfileModule.UserProfile.findOneAndUpdate(
                {
                    uid:uid
                },
                { $set: objToUpdate, $addToSet: objToAddToSet },
                {
                    new: true
                }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async hashPassword(password) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync(password, salt);
            if (!hashPass) {
                throw new Error('Salt is not generated!');
            }

            return hashPass;
        } catch (e) {
            // @Todo log the error
            throw e;
        }
    }

    static async userExists(email, phone) {
        try {
            phone = phone.replace(/\D/g, '');

            if (phone.length < 8) {
                return true;
            }

            const queryIndicator = phone.substr(phone.length - 8);

            const regexFactor = '' + queryIndicator + '$';

            // check if user already exists
            let userExist = await userProfileModule.UserProfile.find({
                $or: [
                    {
                        email: email
                    },
                    {
                        phone: {
                            $regex: regexFactor
                        }
                    }
                ]
            });

            return userExist.length > 0;
        } catch (e) {
            // @TODO log the error
            console.log(e);
            throw e;
        }
    }

    static async getUserIfExist({ email = '', phone = '' }) {
        try {
            email = email.trim().toLowerCase();

            phone = phone.replace(/\D/g, '');

            const queryIndicator = phone.substr(phone.length - 8);

            const regexFactor = '' + queryIndicator + '$';

            let user;

            if (email) {
                user = await userProfileModule.UserProfile.findOne({ email });
            } else {
                user = await userProfileModule.UserProfile.findOne({
                    phone: {
                        $regex: regexFactor
                    }
                });
            }

            if (!user) {
                return false;
            }

            return user;
        } catch (e) {
            // @TODO log the error
            console.log(e);
            throw e;
        }
    }

    static async getUserByPhone(phone) {
        try {
            if (!phone) {
                return false
            }

            let user = await userProfileModule.UserProfile.findOne({
                    phone: phone
                });


            if (!user) {
                return false;
            }

            return user;
        } catch (e) {
            // @TODO log the error
            console.log(e);
            throw e;
        }
    }

    static async create(request, password) {
        try {

            let user = {
                _id: new ObjectId(),
                phone: request.phone.trim(),
                username: request.username.trim(),
                country_code: request.country_code.trim(),
                password: password,
                user_type: request.user_type,
                client: request.client,
                extra_access_codes: request.extra_access_codes? request.extra_access_codes: [],
            };

            if (!utils.isset(request.email)) {
                user.email = `${user._id.toString()}@delivery.com`;
                user.is_email_auto_generated = true;
            } else {
                user.email = request.email;
            }

            user.last_update = String(Date.now());
            user.uid = user._id.toString();
            user.pdpa = (request.pdpa) ? request.pdpa : {acknowledge:false, allowUse:false};
            user.old_uid = '';
            const result = await userProfileModule.UserProfile.create(user);

            return result;
        } catch (e) {
            throw e;
        }
    }

    static async findById(_id) {
        let result;
        try {
            result = await userProfileModule.UserProfile.findOne({
                _id: _id
            });

            if (result) {
                return result;
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    static async findUserForLeaderboard(uid) {
        let result;
        try {
            result = await userProfileModule.UserProfile.findOne({
                uid
            });

            if (result) {
                return result;
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    static async authorizeById(_id,password) {
        let result;
        try {
            result = await userProfileModule.UserProfile.findOne({
                _id: _id
            },'password');

            if (result) {
                if (bcrypt.compareSync(password, result.password)) {
                    return result;
                }
                return null;
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    static async findByUid(uid) {
        try {
            const result = await userProfileModule.UserProfile.aggregate()
                .match({ uid })
                .lookup({
                    from: 'user_types',
                    localField: 'user_type',
                    foreignField: 'user_type',
                    as: 'access_codes'
                })
                .lookup({
                    from: 'barcodes',
                    localField: 'uid',
                    foreignField: 'uid',
                    as: 'barcodes'
                })
                .unwind('access_codes')
                .project({
                    uid: 1,
                    email: 1,
                    username: 1,
                    country_code: 1,
                    phone: 1,
                    gender: 1,
                    avatar: 1,
                    ic_number: 1,
                    user_type: 1,
                    location: 1,
                    is_email_verified: 1,
                    is_email_subscribed: 1,
                    barcodes: '$barcodes.barcode',
                    access_codes: {
                        $concatArrays: [
                            '$access_codes.access_codes',
                            {
                                $ifNull: ['$extra_access_codes', []]
                            }
                        ]
                    }
                });

            return result[0];
        } catch (e) {
            throw e;
        }
    }

    static async removeAccessCode(uid, access_code) {
        try {
            const result = await userProfileModule.UserProfile.updateOne(
                { uid },
                {
                    $pull: {
                        extra_access_codes: access_code
                    }
                }
            );

            return result;
        } catch (error) {
            throw error;
        }
    }

    static async findUIDById(_id) {
        let result;
        try {
            result = await userProfileModule.UserProfile.findOne({
                _id: _id
            });

            if (result) {
                return result.uid;
            }
            return null;
        } catch (e) {
            throw e;
        }
    }

    static async findMembersById(members) {
        try {
            let validMembers = await userProfileModule.UserProfile.find({
                uid: {
                    $in: members
                }
            });

            return validMembers;
        } catch (e) {
            throw e;
        }
    }

    static async getByEmail(email) {
        try {
            const user = await userProfileModule.UserProfile.findOne({
                email
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getByPhone(phone) {
        phone = phone.replace(/\D/g, '');

        if (phone.length < 8) {
            return null;
        }

        const queryIndicator = phone.substr(phone.length - 8);
        const regexFactor = '' + queryIndicator + '$';

        const result = await userProfileModule.UserProfile.findOne({ phone: RegExp(regexFactor)});

        return result;
    }

    static async getEmailActivationToken (email_validation_token) {
        try {
            const user = await userProfileModule.UserProfile.findOne({
                email_validation_token
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getByResetPasswordToken(reset_password_token) {
        try {
            const user = await userProfileModule.UserProfile.findOne({
                reset_password_token,
                reset_password_token_expire_at: {
                    $gt: new Date()
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getByUpdateAddressToken(update_address_token) {
        try {
            const user = await userProfileModule.UserProfile.findOne({
                update_address_token,
                update_address_token_expire_at: {
                    $gt: new Date()
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getByActivationEmailToken(email_validation_token) {
        try {
            const user = await userProfileModule.UserProfile.findOne({
                email_validation_token
                // reset_password_token_expire_at: {
                //     $gt: new Date()
                // }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }

    // static async getUsers(options) {
    //     try {
    //         if (options.isAdmin) {
    //             return this.getAllUsers(options);
    //         }

    //         return this.getUsersByBins(options);
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    static async getUsers({
        sort,
        order,
        filter,
        statusFlag,
        pageSize,
        page,
    }) {
        try {
            sort = sort || 'created_at';
            order = order || 'desc';
            filter = filter || '';
            statusFlag = statusFlag || '';
            pageSize = parseInt(pageSize) || 100
            page = page || 1;
            const startIndex = (page - 1) * pageSize;            

            

            let aggregateQuery = {  }

            let query = userProfileModule.UserProfile.aggregate()
            

            .match(aggregateQuery);


            if (statusFlag) {
                query.match({
                    email : statusFlag
                });
            }


            // //filter        
            if (filter) {
                query.match({
                    $or: [{
                        phone: {
                            $regex: `${filter}`,
                            $options: 'xi'
                        }
                    },
                    {
                        username: {
                            $regex: filter,
                            $options: 'xi'
                        }
                    }
                    ]
                });
            }

            query.project({
                uid: 1,
                email: 1,
                username: 1,
                country_code: 1,
                phone: 1,
                user_type: 1,
            }).limit(parseInt(pageSize));
            // sort
            query.sort({
                    [sort]: order
                })

            let result = await query;

            if (result.length < 1) {
                return result;
            }
            return result;
            
        } catch (error) {
            throw error;
        }
    }

    static async getUsersbyCountry(code) {
        try {
            const query = await userProfileModule.UserProfile.aggregate()
            .match({country_code : code})
            .project({
                country_code: 1,
                phone: 1,
                is_phone_verified: 1,
                uid: 1,
            });
            return query;
        } catch (error) {
            throw error;
        }
    }

    static async getAllUsers({
        sort,
        order,
        page,
        pageSize,
        filter,
        fromDate,
        toDate
    }) {
        try {
            sort = sort || 'email';
            order = order || 'asc';
            page = page || 1;
            const recordPerPage = parseInt(pageSize) || 10;
            const startIndex = (parseInt(page) - 1) * recordPerPage;
            filter = filter || '';

            const query = userProfileModule.UserProfile.aggregate()
                .lookup({
                    from: 'barcodes',
                    localField: 'uid',
                    foreignField: 'uid',
                    as: 'barcodes'
                });

             // filter
            if (fromDate && toDate) {
                fromDate = new Date(fromDate);
                fromDate.setUTCHours(0, 0, 0, 0);
                toDate = new Date(toDate);
                toDate.setUTCHours(23, 59, 59, 59);
                query.match({
                    joining_date: {
                        $lte: toDate,
                        $gte: fromDate
                    }
                });
            }
            if (filter) {
                query.match({
                    $or: [
                        {
                            username: {
                                $regex: `${filter}`,
                                $options: 'xi'
                            }
                        },
                        {
                            email: {
                                $regex: filter,
                                $options: 'xi'
                            }
                        },
                        {
                            phone: {
                                $regex: filter,
                                $options: 'xi'
                            }
                        },
                        {
                            'barocodes.barcode': {
                                $regex: filter,
                                $options: 'xi'
                            }
                        },
                        {
                            uid: {
                                $regex: filter,
                                $options: 'xi'
                            }
                        }
                    ]
                });
            }

            query.project({
                email: 1,
                phone: 1,
                location: 1,
                joining_date: 1,
                barcodes: 1,
                username: 1,
                uid: 1,
            });

            // sort
            query
                .sort({
                    [sort]: order
                })

                .group({
                    _id: null,
                    total_count: {
                        $sum: 1
                    },
                    data: {
                        $push: '$$ROOT'
                    }
                })

                .project({
                    _id: false,
                    total_count: true,
                    data: {
                        $slice: ['$data', startIndex, recordPerPage]
                    }
                });

            const uesrs = await query;
            return uesrs[0] || [];
        } catch (error) {
            throw error;
        }
    }

    static async getAllUsersFilter(query) {
        try {
            let result = await userProfileModule.UserProfile.find({
                $or: [
                    {
                        username: {
                            $regex: query
                        }
                    },
                    {
                        uid: {
                            $regex: query
                        }
                    }
                ]
            }).limit(50);

            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getUserAccessCodes(uid) {
        try {
            const result = await userProfileModule.UserProfile.aggregate()
                .match({ uid })
                .lookup({
                    from: 'user_types',
                    localField: 'user_type',
                    foreignField: 'user_type',
                    as: 'user_type'
                })
                .unwind('user_type')
                .project({
                    _id: 0,
                    access_codes: {
                        $concatArrays: [
                            '$user_type.access_codes',
                            {
                                $ifNull: ['$extra_access_codes', []]
                            }
                        ]
                    }
                })
                .lookup({
                    from: 'access_codes',
                    localField: 'access_codes',
                    foreignField: 'code',
                    as: 'access_codes'
                });

            return result[0].access_codes;
        } catch (error) {
            throw error;
        }
    }

    static async getUserType(uid) {
        try {
            const user = await userProfileModule.UserProfile.findOne({
                uid
            });
            return user.user_type;
        } catch (error) {
            throw error;
        }
    }

    static async getUserCountry(uid) {
        try {
            const user = await userProfileModule.UserProfile.findOne({
                uid
            });
            return user.country_code || null;
        } catch (error) {
            throw error;
        }
    }

    static async getUserByToken(token) {
        const user = await userProfileModule.UserProfile.aggregate()
            .match({ 'tokens.token': token })
            .lookup({
                from: 'user_types',
                localField: 'user_type',
                foreignField: 'user_type',
                as: 'access_codes'
            })
            .unwind('access_codes')
            .project({
                uid: 1,
                email: 1,
                username: 1,
                country_code: 1,
                phone: 1,
                user_type: 1,
                tokens: 1,
                password: 1,
                access_codes: {
                    $concatArrays: [
                        '$access_codes.access_codes',
                        {
                            $ifNull: ['$extra_access_codes', []]
                        }
                    ]
                }
            });

        return user[0];
    }

    /**
     *
     * @param {Array<String>} uids
     */
    static async filterUidsIfExist(uids = []) {
        try {
            const existUids = [];

            for (const uid of uids) {
                if (await User.findByUid(uid)) {
                    existUids.push(uid);
                }
            }

            return existUids;
        } catch (error) {
            throw error;
        }
    }

    static async findByOTP(otp) {
        const users = await userProfileModule.UserProfile.find({ 'otps.otp': otp });

        if (users.length > 1) {
            this.deleteUserOTP(otp);
            throw OTP_DUPLICATED;
        }
        return users[0];
    }

    static async deleteUserOTP(otp) {
        if (!otp) {
            return;
        }
        const result = await userProfileModule.UserProfile.updateMany(
            {
                'otps.otp': otp,
            },
            { $pull: { otps: { otp: otp } } },
        );

        return result;
    }

    static async deleteAllUserOTP(uid) {
        if (!uid) {
            return;
        }

        const result = await userProfileModule.UserProfile.updateOne({ uid }, {
            $unset: { otps: [] }
        });

        return result;
    }


    static censorEmailName(str) {
        return str[0] + str[1] + "*".repeat(str.length - 2);
    }
    static censorDomain(str) {
        var arr = str.split(".");
        var arr2 = arr[arr.length - 1];
        return "*".repeat(str.length - 1 - arr2.length) + '.' + arr2;
    }
    static censorEmail(email) {
        var arr = email.split("@");
        return this.censorEmailName(arr[0]) + "@" + this.censorDomain(arr[1]);
    }
    static censorPhone(phone) {
        return phone[0] + phone[1] + phone[2] + "*".repeat(phone.length - 5) + phone.slice(-2);
    }

}

module.exports = User;

