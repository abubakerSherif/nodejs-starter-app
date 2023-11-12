// Helpers
const userHelper = require('../../helpers/user.helper');
const response = require('../../helpers/response.helper');
const pointSummaryHelper = require('../../helpers/pointSummary.helper');
const Co2eEmissionsManagementHelper = require('../../helpers/co2eEmissionsManagement.helper');
const BarcodeHelper = require('../../helpers/barcode.helper');
const pick = require('lodash/pick');
const token = require('../../helpers/token.helper');
const crypto = require('crypto');
const isEmpty = require('lodash/isEmpty');
const WGOaccessCheck = require('../../helpers/utils.helper').WGOaccessCheck;
const Email = require('../../helpers/email.helper');
const BinMember = require("../../models/groups/bin.member.model");
const { BinInformation } = require("../../models/bin/binInformation");

// Other internal files
const {
    EMAIL_TAKEN,
    PHONE_TAKEN,
    USER_NOT_FOUND,
    UNAUTHORIZED
} = require('../../errorDefinition/errors.map');

class UserController {
    /**
     * @api {get} /user/profile  Get user profile information.
     */
    static async profile(req, res) {
        try {
            const user = await userHelper.findById(req.user._id);
            const barcodes = await userHelper.findBarcodes(req.user._id);
            let balanced_rp = 0;
            let accumulatedCO2 = 0;
            let co2e = "0";
            let busCo2Saved = 0;
            const givenClientKey = req.header('Client-key');

            if (req.user.uid) {
                balanced_rp = await pointSummaryHelper.getBalancedRP(
                    req.user.uid
                );
                
                // @TODO: merge this call with balanced rp at the same query.
                accumulatedCO2 = await pointSummaryHelper.getCO2(req.user.uid);
            }



            const barcodesResult = barcodes ? barcodes : [];

            const stringOfBarcodes = barcodesResult.map(barcode => {
                return barcode.barcode;
            });
            const bin = await BinInformation.findOne({ bin_code: "CHS14NUP" });
            let isUserExistsInGroup
            if (bin) {
                isUserExistsInGroup = await BinMember.findOne({
                    gid: bin.gid,
                    uid: user.uid,
                    bin_id: bin.bin_id,
                  });

            }
            

            if (user) {
                let profile = {
                    uid: user.uid,
                    email: user.email,
                    username: user.username,
                    country_code: user.country_code,
                    phone: user.phone,
                    gender: user.gender,
                isRewarded: isUserExistsInGroup? isUserExistsInGroup.uid ? true : false : false,
                    is_email_verified: user.is_email_verified,
                    is_email_subscribed: user.is_email_subscribed,
                    ic_number: user.ic_number,
                    user_type: user.user_type,
                    avatar: user.avatar,
                    referral: user.referral ? user.referral : '',
                    last_update: user.last_update,
                    barcodes: barcodesResult ? stringOfBarcodes : [],
                    balanced_rp: balanced_rp.toString(), // fixme: change to number
                    primary_address: {
                        address: user.location.address,
                        street: '', // deprecated
                        city: '', // deprecated
                        state: user.location.state,
                        postal_code: user.location.postcode
                    },
                    accumulated_CO2: (accumulatedCO2).toString(),
                    bird_count: user.birds.length
                };


                return res
                    .status(200)
                    .json(new response('0000', 'SUCCESSFUL', profile));
            }

            return res
                .status(204)
                .json(new response('0017', 'USER_NOT_FOUND', null));
        } catch (e) {
            console.log(e);
            return res
                .status(500)
                .json(new response('-1', 'UNEXPECTED_ERROR', null));
        }
    }


    static async show(req, res) {
        try {
            let uid = req.params.id;
            const user = await userHelper.findByUid(uid);

            if (!user) {
                throw USER_NOT_FOUND;
            }

            let balanced_rp = await pointSummaryHelper.getBalancedRP(
                uid
            );
            
            // @TODO: merge this call with balanced rp at the same query.
            let accumulatedCO2 = await pointSummaryHelper.getCO2(uid);
            user.balanced_rp = balanced_rp;
            user.accumulatedCO2 = accumulatedCO2;
            return res.sendSuccess(user);
        } catch (error) {
            console.log(error);
            return res.sendError(error, req.header('languageId'));
        }
    }






}

module.exports = UserController;
