const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const { generalAccessToken, generalRefreshToken } = require("./JwtService")

// Hàm tạo người dùng mới
const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        //lấy thông tin người dùng mới
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            //ktra email đã tồn tại chưa
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The email is already'
                })
            }
            //mã hóa trước khi lưu
            const hash = bcrypt.hashSync(password, 10)
            //tạo người dùng mới
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

// Hàm đăng nhập người dùng
const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin //lấy thông tin đăng nhập bằng request
        try {
            //Kiểm tra email có tồn tại hay không
            const checkUser = await User.findOne({
                email: email
            })
            if (!checkUser) {
                return resolve({
                    status: 'ERR',
                    message: 'The email is not defined'
                });
            }

            //Kiểm tra password có trùng với trong database hay không
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user is incorrect'
                });
            }

            //access token
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            //refresh token
            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

// Hàm cập nhật thông tin người dùng
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Kiểm tra email có tồn tại hay không
            const checkUser = await User.findOne({
                _id: id
            })
            console.log('checkUser', checkUser)

            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }

            // Cập nhật thông tin người dùng
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
            console.log('updatedUser', updatedUser)

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

// Hàm xóa người dùng
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            //kiểm tra người dùng có tồn tại hay không
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

// Hàm lấy tất cả người dùng
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allUser
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

// Hàm lấy thông tin chi tiết người dùng theo id
const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });//tìm người dùng theo id

            if (user === null) {
                return resolve({
                    status: 'NOT_FOUND',
                    message: 'User not found'
                });
            }

            // Trả về kết quả nếu người dùng tồn tại
            return resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            });
        } catch (e) {
            // Bắt lỗi và reject với thông tin lỗi
            return reject({
                status: 'ERROR',
                message: e.message
            });
        }
    });
};



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,

}