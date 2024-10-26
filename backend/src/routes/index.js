const userRouter = require('./UserRoute')
const productRouter = require('./ProductRouter')
const orderRouter = require('./OrderRouter')
const paymentRouter = require('./PaymentRouter')
const supplierRouter = require('./SupplierRouter')

const routes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/order', orderRouter)
    app.use('/api/payment', paymentRouter)
    app.use('/api/supplier', supplierRouter)
}

module.exports = routes