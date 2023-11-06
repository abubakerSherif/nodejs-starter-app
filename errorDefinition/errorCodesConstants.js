const ERRORS = {
    BAD_REQUEST : {
        ERROR_CODE: "0100",
        ERROR_MESSAGE: "Unexpected Error",
        ERROR_CONSTANT: "BAD_REQUEST"
    },
    NOT_AUTHORIZED: {
        ERROR_CODE: "0118",
        ERROR_MESSAGE: "You are not authorized to use the API(s).",
        ERROR_CONSTANT: "NOT_AUTHORIZED"
    },
    DATE_FORMAT_IS_NOT_VALID: {
        ERROR_CODE: "0124",
        ERROR_MESSAGE: "The date fields must be valid and provided in the following format'YYYY-MM-DD'.",
        ERROR_CONSTANT: "DATE_FORMAT_IS_NOT_VALID"
    },

}

module.exports = {
    ERRORS
};