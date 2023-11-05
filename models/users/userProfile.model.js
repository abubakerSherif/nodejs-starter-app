const mongoose = require('mongoose');
const db = require('../../databases/development.database');
const validator = require('validator');

const UserProfileSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
            minlength: 1,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not valid email.'
            }
        },
        referral: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        uid: {
            type: String,
            required: true,
            index: true
        },
        access_group: mongoose.Schema.Types.ObjectId,
        username: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            unique: false,
            trim: true,
            required: true
        },
        phone_numbers: [
            {
                type: String,
                trim: true
            }
        ],
        birds: [
            {
                bird_id: String,
                bin_id: String,
                level_obtained: String,
                date_obtained: String
            }
        ],
        ic_number: {
            type: String,
            trim: true
        },
        gender: {
            type: String,
            trim: true
        },
        country_code: {
            type: String,
            unique: false,
            trim: true,
            required: false
        },

        user_type: {
            required: true,
            trim: true,
            type: Number,
            default: 0
        },
        avatar: {
            type: String,
            required: false
        },
        last_update: {
            type: Date,
            required: true,
            default: ''
        },
        wechat_id: String,
        chit_chat_id: String,
        joining_date: {
            type: Date,
            default: new Date()
        },

        is_email_verified: {
            type: Boolean,
            required: true,
            default: false
        },

        is_email_auto_generated: {
            type: Boolean,
            default: false
        },

        is_email_subscribed: {
            type: Boolean,
            required: true,
            default: false
        },

        is_phone_verified: {
            type: Boolean,
            required: true,
            default: false
        },
        is_active: {
            type: Boolean,
            required: true,
            default: true
        },
        location: {
            address: String,
            state: String,
            country: String,
            postcode: String,
            city: String,
        },
        tokens: [
            {
                access: {
                    type: String,
                    required: true
                },
                platform: String,
                app_version: String,
                expiry_date: {
                    type: String,
                    required: true
                },
                vehicles: [],
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        birds: [
            {
                bird_id: String,
                bin_id: String,
                level_obtained: Number,
                date_obtained: String,
            }
        ],
        treehugger_items: [String],
        level: String,
        refresh_token: String,
        notification_tokens: [{ token: String, device_id: String }],
        client: String,
        extra_access_codes: [String],
        reset_password_token: String,
        reset_password_token_expire_at: Date,
        update_address_token: String,
        update_address_token_expire_at: Date,
        email_validation_token: String,
        is_client_pic: Boolean,
        pdpa: {
            acknowledge: {
                type: Boolean,
                default: false
            },
            allowUse: {
                type: Boolean,
                default: false
            }
        },
        white_label_id: String,
        organisation: String,
        contact_person: String,
        remark: String,
        otps: [{ otp: String, otp_expiry: Date }],
        wechat: {
            openid: String,
            session_key: String,
        }
    },
    {
        collection: 'user_information',
        versionKey: false,
        toJSON: { virtuals: true },
    }
);

UserProfileSchema.pre('save', function(next) {
    this.joining_date = new Date();
    next();
});

UserProfileSchema.virtual('wgo_client', {
    ref: 'wgo_clients', // The model to use
    localField: 'uid', // Find people where `localField`
    foreignField: 'uid', // is equal to `foreignField`
    justOne: true,
    // options: { sort: { name: -1 }, limit: 5 } // Query options, see http://bit.ly/mongoose-query-options
});

const UserProfile = db.model('user_information', UserProfileSchema);

module.exports = {
    UserProfile
};
