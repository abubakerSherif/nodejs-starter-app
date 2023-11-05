function logRequestBody(req, res, next) {
    if (req.body) {
        req.header('Platform') || req.header('platform') ? console.info('Request Platform: ', req.header('Platform') || req.header('platform')) : null
    }
    next();
}

module.exports = logRequestBody;