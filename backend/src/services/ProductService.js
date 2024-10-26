const Product = require("../models/ProductModel")


// Tạo sản phẩm mới
const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, image, type, price, countInStock, description, discount } = newProduct;

            // Kiểm tra product có tồn tại hay không
            const checkProduct = await Product.findOne({
                name: name
            });
            if (checkProduct !== null) {
                return resolve({
                    status: 'OK',
                    message: 'The name of product is already taken'
                });
            }

            // Tạo sản phẩm mới
            const createProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock: Number(countInStock),
                description,
                discount: Number(discount)
            });

            if (createProduct) {
                return resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createProduct //trả về sản phẩm mới vừa tạo
                });
            }

        } catch (e) {
            reject(e);
        }
    });
};

// Cập nhật thông tin sản phẩm dựa vào id
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Kiểm tra id product có tồn tại hay không dựa vào id
            const checkProduct = await Product.findOne({
                _id: id
            })
            console.log('checkProduct', checkProduct)

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The Product is not defined'
                })
            }

            // Cập nhật sản phẩm với dữ liệu mới
            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            console.log('updatedProduct', updatedProduct)

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

// Xóa sản phẩm dựa vào id
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Kiểm tra sản phẩm có tồn tại hay không
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'DELETE PRODUCT SUCCESS',
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Không phân trang: Bỏ qua các tham số limit, page, và skip
            const query = {};
            if (filter) {
                const name = filter[0];
                query[name] = { '$regex': filter[1] };
            }
            
            const sortOption = sort ? { [sort[1]]: sort[0] } : {}; // Điều kiện sắp xếp nếu có
            const allProducts = await Product.find(query).sort(sortOption);
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allProducts
            });
        } catch (e) {
            reject(e);
        }
    });
};

// const getAllProduct = (limit, page, sort, filter) => {

//     return new Promise(async (resolve, reject) => {
//         try {
//             //Tổng số lượng sản phẩm
//             const totalProduct = await Product.countDocuments()
//             if (filter) {
//                 const name = filter[0];
//                 const allProductFilter = await Product.find({ [name]: { '$regex': filter[1] } })
//                     .limit(limit)
//                     .skip(page * limit);
//                 resolve({
//                     status: 'OK',
//                     message: 'SUCCESS',
//                     data: allProductFilter,
//                     total: totalProduct,
//                     pageCurrent: Number(page + 1),
//                     totalPage: Math.ceil(totalProduct / limit),
//                 });
//             }
//             else if (sort) {  // Sửa thành else if thay vì if để tránh lặp lại query
//                 const objectSort = {};
//                 objectSort[sort[1]] = sort[0];
//                 const allProductSort = await Product.find()
//                     .limit(limit)
//                     .skip(page * limit)
//                     .sort(objectSort);
//                 resolve({
//                     status: 'OK',
//                     message: 'SUCCESS',
//                     data: allProductSort,
//                     total: totalProduct,
//                     pageCurrent: Number(page + 1),
//                     totalPage: Math.ceil(totalProduct / limit),
//                 });
//             } else {
//                 const allProduct = await Product.find()
//                     .limit(limit)
//                     .skip(page * limit);
//                 resolve({
//                     status: 'OK',
//                     message: 'SUCCESS',
//                     data: allProduct,
//                     total: totalProduct,
//                     pageCurrent: Number(page + 1),
//                     totalPage: Math.ceil(totalProduct / limit),
//                 });
//             }

//         }
//         catch (e) {
//             reject(e)
//         }
//     })
// }



// Lấy thông tin chi tiết sản phẩm dựa vào id
const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })

            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

// Lấy danh sách tất cả các loại sản phẩm
const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,// trả về danh sách loại sản phẩm
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    getAllType
}