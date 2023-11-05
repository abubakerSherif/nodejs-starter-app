const Response = require('../classes/response');
const englishMessageConstant = require('../languages/englishMessageConstant.language');
const malayMessageConstant = require('../languages/malayMessageConstant.language');
const chineseMessageConstant = require('../languages/chineseMessageConstant.language');
const traditionalChineseMessageConstant = require('../languages/traditionalChineseMessageConstant.language') 

class LanguageTextUtil {
    static getSuccessMessage(code, languageId = '1') {
        
        
        let message;
        let data;
        try {
            message = this.getLanguageSpecificSuccessMessage(code, languageId);
            
        } catch (e) {
            if (e instanceof LanguageException) {
                languageId = '1';
                // logger wrong language Id
            } else {
                // logger wrong Code passed
            }
        }

        if (!message) {
            message = ''
        }

        return message;
    }

    static getTerm(code, languageId = '1') {
        let message;
        let data;
        try {
            message = this.getLanguageSpecificSuccessMessage(code, languageId);
            
        } catch (e) {
            if (e instanceof LanguageException) {
                languageId = '1';
                console.log(e)
            } else {
                console.log(e)
            }
        }

        if (!message) {
            message = ''
        }

        return message;
    }

    static getLanguageSpecificSuccessMessage(code, languageId) {
        switch (languageId) {
            case '1':
                return englishMessageConstant[code];
            case '2':
                return malayMessageConstant[code];
            case '3':
                return chineseMessageConstant[code];
            case '4':
                return traditionalChineseMessageConstant[code];
            default:
                throw new LanguageException('language id is invalid');
        }
    }
}

class LanguageException extends Error {
    constructor(message) {
        super(message);
        this.name = 'language';
    }
}

module.exports = LanguageTextUtil;
