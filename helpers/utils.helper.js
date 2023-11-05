
class Utils {
    // TODO: check for embty objects and embry arrays.
    static isset(value) {
        return value !== '' && value !== undefined && value !== null && typeof value !== 'undefined';
    } 
}

module.exports = Utils;