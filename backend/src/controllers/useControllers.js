const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')


// Hàm tạo người dùng mới
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body

        //Định dạng email
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        //Kiểm tra có tồn tại giá trị hay không
        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm đăng nhập người dùng
const loginUser = async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body
        //check email
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        //Kiểm tra các trường có giá trị hay không
        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            });
        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response

        // Lưu refresh token vào cookie
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        })
        return res.status(200).json(newResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm cập nhật thông tin người dùng
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body

        // Kiểm tra nếu userId không tồn tại
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userID is require'
            })
        }

        const userResponse = await UserService.updateUser(userId, data)
        return res.status(200).json(userResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm xóa người dùng
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm lấy tất cả người dùng
const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm lấy thông tin chi tiết người dùng
const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(403).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm làm mới token
const refreshToken = async (req, res) => {
    console.log('req.cookie', req.cookies)
    try {
        const token = req.cookies.refresh_token
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    logoutUser,
    refreshToken
}