const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

// Middleware xác thực quyền admin
const authMiddleWare = (req, res, next) => {
    // Lấy token từ headers của request
    const token = req.headers.token.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        //user có quyền admin thì tiếp tục
        if (user?.isAdmin) {
            next()// Chuyển sang middleware tiếp theo
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });

};

// Middleware xác thực quyền của người dùng cho phép admin hoặc không phải admin
const authUserMiddleWare = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    // Xác thực token và kiểm tra quyền admin hoặc chính người dùng
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        // Kiểm tra nếu user là admin hoặc chính user đó
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}


module.exports = { authMiddleWare, authUserMiddleWare };