const ProductService = require('../services/ProductService')

// Hàm tạo sản phẩm mới
const createProduct = async (req, res) => {
    try {
        // console.log(req.body)
        const { name, image, type, price, countInStock, description, discount } = req.body

        //Kiểm tra các trường có giá trị hay không
        if (!name || !image || !type || !price || !countInStock || !discount) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            });
        }

         // Gọi service để tạo sản phẩm mới
        const productResponse = await ProductService.createProduct(req.body)
        return res.status(200).json(productResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id //lấy productID từ url
        const data = req.body

        //kiểm tra xem productID có được cung cấp không
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productID is require'
            })
        }

        // Gọi service để cập nhật sản phẩm
        const productResponse = await ProductService.updateProduct(productId, data)
        return res.status(200).json(productResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm lấy thông tin chi tiết sản phẩm
const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productID is require'
            })
        }
        const productResponse = await ProductService.getDetailProduct(productId)
        return res.status(200).json(productResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Hàm xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is require'
            })
        }
        const productResponse = await ProductService.deleteProduct(productId)
        return res.status(200).json(productResponse)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}


// Hàm lấy tất cả các sản phẩm
const getAllProduct = async (req, res) => {
    try {
        const { sort, filter } = req.query; 
        const productResponse = await ProductService.getAllProduct(sort, filter);
        return res.status(200).json(productResponse);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};


// Hàm lấy tất cả các loại sản phẩm
const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    getAllType
}