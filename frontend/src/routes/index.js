import HomePage from "../pages/HomePage/HomePage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import OrderPage from "../pages/OrderPage/OrderPage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import ProductDetailPage from "../pages/ProductDetailPage/ProductDetailPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import AdminPage from "../pages/AdminPage/AdminPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import MyOrderPage from "../pages/MyOrder/MyOrderPage";
import AdminStatsPage from "../pages/AdminStatsPage/AdminStatsPage";


export const routes = [
    {
        path: '/',
        page: HomePage
    },
    {
        path: '/products',
        page: ProductsPage
    },
    {
        path: '/order',
        page: OrderPage
    },
    {
        path: '/my-order',
        page: MyOrderPage
    },
    {
        path: '/my-stas',
        page: AdminStatsPage
    },
    {
        path: '/payment',
        page: PaymentPage,
    },
    {
        path: '/orderSuccess',
        page: OrderSuccess,
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
    },
    {
        path: '/product-details/:id',
        page: ProductDetailPage,
    },
    {
        path: '/profile-user',
        page: ProfilePage
    },
    {
        path: '/system-admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivate: true

    },
    {
        path: '*',
        page: NotFoundPage
    }
]