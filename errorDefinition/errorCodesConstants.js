const ERRORS = {
    BAD_REQUEST : {
        ERROR_CODE: "0100",
        ERROR_MESSAGE: "Unexpected Error",
        ERROR_CONSTANT: "BAD_REQUEST"
    },
    RAW_IS_EMPTY: {
        ERROR_CODE: "0101",
        ERROR_MESSAGE: "The RAW is empty.",
        ERROR_CONSTANT: "RAW_IS_EMPTY"
    },
    BIN_ID_IS_EMPTY: {
        ERROR_CODE: "0102",
        ERROR_MESSAGE: "The bin_id is not provided.",
        ERROR_CONSTANT: "BIN_ID_IS_EMPTY"
    },
    BIN_IS_NOT_FOUND: {
        ERROR_CODE: "0103",
        ERROR_MESSAGE: "Thanks for recycling with us, we shall contact you soon!",
        ERROR_CONSTANT: "BIN_IS_NOT_FOUND"
    },
    GPS_IS_EMPTY: {
        ERROR_CODE: "0104",
        ERROR_MESSAGE: "The GPS coordinate is not provided.",
        ERROR_CONSTANT: "GPS_IS_EMPTY"
    },
    FAR_FROM_BIN: {
        ERROR_CODE: "0105",
        ERROR_MESSAGE: "Thanks for recycling with us, we shall contact you soon!",
        ERROR_CONSTANT: "FAR_FROM_BIN"
    },
    UID_IS_EMPTY: {
        ERROR_CODE: "0106",
        ERROR_MESSAGE: "The token is not provided.",
        ERROR_CONSTANT: "UID_IS_EMPTY"
    },
    UID_IS_NOT_FOUND: {
        ERROR_CODE: "0107",
        ERROR_MESSAGE: "The user is not found, please contact to the support center.",
        ERROR_CONSTANT: "UID_IS_NOT_FOUND"
    },
    GPS_IS_NOT_VALID: {
        ERROR_CODE: "0108",
        ERROR_MESSAGE: "GPS data is not valid.",
        ERROR_CONSTANT: "GPS_IS_NOT_VALID"
    },
    NO_DRIVER_AVAILABLE: {
        ERROR_CODE: "0109",
        ERROR_MESSAGE: "There is not driver available in your area.",
        ERROR_CONSTANT: "NO_DRIVER_AVAILABLE"
    },
    REQUEST_ID_EMPTY: {
        ERROR_CODE: "0110",
        ERROR_MESSAGE: "The request id is required.",
        ERROR_CONSTANT: "REQUEST_ID_EMPTY"
    },
    REQUEST_ID_IS_NOT_FOUND: {
        ERROR_CODE: "0111",
        ERROR_MESSAGE: "The following request is not exist any more.",
        ERROR_CONSTANT: "REQUEST_ID_EMPTY"
    },
    REQUEST_IS_TAKEN: {
        ERROR_CODE: "0112",
        ERROR_MESSAGE: "The following request is already taken.",
        ERROR_CONSTANT: "REQUEST_IS_TAKEN"
    },
    REQUEST_IS_CANCELLED: {
        ERROR_CODE: "0113",
        ERROR_MESSAGE: "The following request is already cancelled.",
        ERROR_CONSTANT: "REQUEST_IS_CANCELLED"
    },
    JOB_IS_STARTED: {
        ERROR_CODE: "0114",
        ERROR_MESSAGE: "The following job is already started.",
        ERROR_CONSTANT: "JOB_IS_STARTED"
    },
    JOB_IS_NOT_STARTED: {
        ERROR_CODE: "0115",
        ERROR_MESSAGE: "The following job is not started yet.",
        ERROR_CONSTANT: "JOB_IS_NOT_STARTED"
    },
    JOB_IS_COMPLETED: {
        ERROR_CODE: "0116",
        ERROR_MESSAGE: "The following job is already completeded.",
        ERROR_CONSTANT: "JOB_IS_COMPLETED"
    },
    NO_BIN_AVAILABLE: {
        ERROR_CODE: "0117",
        ERROR_MESSAGE: "There is not bin available in your area.",
        ERROR_CONSTANT: "NO_BIN_AVAILABLE"
    },
    NOT_AUTHORIZED: {
        ERROR_CODE: "0118",
        ERROR_MESSAGE: "You are not authorized to use the API(s).",
        ERROR_CONSTANT: "NOT_AUTHORIZED"
    },
    ACTIVITY_IS_NOT_ALLOWED: {
        ERROR_CODE: "0119",
        ERROR_MESSAGE: "The following activity is not allowed for the bin.",
        ERROR_CONSTANT: "ACTIVITY_IS_NOT_ALLOWED"
    },
    BIN_RADIUS_IS_NOT_DEFINED: {
        ERROR_CODE: "0120",
        ERROR_MESSAGE: "The bin radius is not defined, please contact to iCycle support centre.",
        ERROR_CONSTANT: "BIN_RADIUS_IS_NOT_DEFINED"
    },
    ITEMS_NOT_FOUND: {
        ERROR_CODE: "0121",
        ERROR_MESSAGE: "The system are not able to retrieve the items.",
        ERROR_CONSTANT: "ITEMS_NOT_FOUND"
    },
    START_DATE_IS_NOT_PROVIDED: {
        ERROR_CODE: "0122",
        ERROR_MESSAGE: "The 'start_date' is needed for accessing the information.",
        ERROR_CONSTANT: "START_DATE_IS_NOT_PROVIDED"
    },
    END_DATE_IS_NOT_PROVIDED: {
        ERROR_CODE: "0123",
        ERROR_MESSAGE: "The 'end_date' is needed for accessing the information.",
        ERROR_CONSTANT: "END_DATE_IS_NOT_PROVIDED"
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