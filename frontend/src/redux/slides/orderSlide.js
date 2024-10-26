import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSlected: [],
    shippingAddress: {
    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
    isSucessOrder: false,
}

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        //hàm thêm sản phẩm vào giỏ
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product);

            if (itemOrder) { //nếu sản phẩm tồn tại trong giỏ hàng
                if (itemOrder.amount + orderItem.amount <= itemOrder.countInstock) {
                    itemOrder.amount += orderItem?.amount;
                    state.isSucessOrder = true;
                    state.isErrorOrder = false;
                }
            } else { //sản phẩm chưa tồn tại trong giỏ hàng
                state.orderItems.push(orderItem);
                state.isSucessOrder = true; // Đặt trạng thái thành công khi sản phẩm được thêm mới
                state.isErrorOrder = false;
            }
        },
        //đặt lại trạng thái đơn hàng
        resetOrder: (state) => {
            state.isSucessOrder = false;
            state.isErrorOrder = false;
        },
        //tăng số lượng sản phẩm trong giỏ hàng
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemsSlected?.find((item) => item?.product === idProduct)
            itemOrder.amount++;//tăng số lượng sản phẩm
            if (itemOrderSelected) {
                itemOrderSelected.amount++;
            }
        },
        //giảm số lượng trong giỏ hàng
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemsSlected?.find((item) => item?.product === idProduct)
            itemOrder.amount--; //tăng số lượng sản phẩm
            if (itemOrderSelected) {
                itemOrderSelected.amount--;
            }
        },
        //xóa sản phẩm hỏi giỏ hàng
        removeOrderProduct: (state, action) => {
            const { idProduct } = action.payload

            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
            const itemOrderSeleted = state?.orderItemsSlected?.filter((item) => item?.product !== idProduct)

            state.orderItems = itemOrder;
            state.orderItemsSlected = itemOrderSeleted;
        },

        //xóa tất cả sản phẩm trong giỏ hàng
        removeAllOrderProduct: (state, action) => {
            const { listChecked } = action.payload
            const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
            const itemOrdersSelected = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
            state.orderItems = itemOrders
            state.orderItemsSlected = itemOrdersSelected

        },
        //chọn sản phẩm để thanh toán
        selectedOrder: (state, action) => {
            const { listChecked } = action.payload
            const orderSelected = []
            state.orderItems.forEach((order) => {
                if (listChecked.includes(order.product)) {
                    orderSelected.push(order)
                };
            });
            state.orderItemsSlected = orderSelected
        }
    },
})


export const { addOrderProduct,
    increaseAmount,
    decreaseAmount,
    removeOrderProduct,
    removeAllOrderProduct,
    selectedOrder,
    resetOrder } = orderSlide.actions

export default orderSlide.reducer