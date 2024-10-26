import { createSlice } from '@reduxjs/toolkit'


//khởi tạo trạng thái ban đầu
const initialState = {
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: '',
    refreshToken: '',
    id: '',
    isAdmin: false,
    city: ''


}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { name = '', email = '', access_token = '', address = '', phone = '', avatar = '', _id = '', refreshToken = '', isAdmin, city } = action.payload
            // Cập nhật từng trường thông tin của user từ action payload
            state.name = name;
            state.email = email;
            state.phone = phone;
            state.address = address;
            state.avatar = avatar;
            state.id = _id;
            state.isAdmin = isAdmin;
            state.access_token = access_token;
            state.refreshToken = refreshToken
            state.city = city
        },
        // Hàm reducer để reset trạng thái của user về giá trị mặc định 
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.address = '';
            state.phone = '';
            state.avatar = '';
            state.id = '';
            state.access_token = '';
            state.isAdmin = false;
            state.city = '';
            state.refreshToken = ''
            state.city = ''
        },
    }
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer