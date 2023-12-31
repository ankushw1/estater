const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    if(req.headers.authorization){
        return res.status(403).json({msg:'Not authorized, no token'})
    }

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        const token = req.header.authorization.split(' ')[1] //['bearer','avbfdhkfjdfd']

        jwt.verify(token,process.env.JWT_TOKEN,(err,data) => {
            if(err){
                return res.status(403).json({msg:'Expired or wrong token'})
            }else{
                return res.user=data // data=user._id
                next()
            }
        })

    }
}

module.exports = verifyToken