const jwt = require('jsonwebtoken'); 
const jwtSecretKey = process.env.JWT_SECRETE

exports.generateJWTToken = (payload, secretKey, options) => {
    return jwt.sign(payload, secretKey, options);
}

exports.verifyJWTToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) return res.status(401).json({ status: 401, message: 'Unauthorized' })
    const token = authHeader.split(' ')[1]
    jwt.verify(token,jwtSecretKey,(err,payload)=>{
        if(err) return res.status(401).json({ status: 401, message: 'Unauthorized' })
        req.tokenData = payload
        next()
    })

}