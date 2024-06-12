import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import PrincipalView from "@/views/PrincipalView";
import ResultsView from "@/views/ResultsView";
import DetailView from "@/views/DetailView";
import OrderCompletedView from "@/views/OrderCompletedView";
import OrdersUserView from "@/views/OrdersUserView";
import DetailOrderView from "@/views/DetailOrderView";
import RegistrationDataView from "@/views/RegistrationDataView";
import ChangeUserPasswordView from "@/views/ChangeUserPasswordView";
import RegisterUserView from "@/views/RegisterUserView";
import LoginUserView from "@/views/LoginUserView";
import SeriesView from "@/views/SeriesView";
import CreateSerieView from "@/views/CreateSerieView";
import UpdateSerieView from "@/views/UpdateSerieView";
import ProductsView from "@/views/ProductsView";
import CreateProductView from "@/views/CreateProductView";
import UpdateProductView from "@/views/UpdateProductView";
import UsersView from "@/views/UsersView";
import OrdersView from "@/views/OrdersView";
import CartView from "@/views/CartView";
import CheckoutView from "@/views/CheckoutView";
import DetailUserView from "@/views/DetailUserView";

// import CartView from "@/views/CartView";
// import ChangePasswordView from "./views/ChangePasswordView";
// import CuentaView from "./views/CuentaView";
// import LoginView from "./views/LoginView";
// import RegisterView from "./views/RegisterView";
// import RecuperacionView from "./views/RecuperacionView";
// import RegistrationDataView from "./views/ReistrationDataView";
// import SeriesListView from "./views/SeriesListView";
// import AdminView from "./views/AdminView";
// import AgregarProductoView from "./views/AgregarProductoView";
// import LProductosView from "./views/LProductosView";
// import UserListView from "./views/UserListView";
// import OrderAdminView from "./views/OrderAdminView";
// import DetailUserView from "./views/DetailUserView";
// import OrderDetailView from "./views/OrderDetailView";
// import AddserieView from "./views/AddSerieView";
// import CheckoutView from "./views/CheckOutView";
// import CompletedOrderView from "./views/CompletedOrderView";
// import CreateSerieView from "./views/CreateSerieView";
// import SeriesView from "./views/SeriesView";
// import UpdateSerieView from "./views/UpdateSerieView";
// import ProductsView from "./views/ProductsView";
// import UpdateProductView from "./views/UpdateProductView";
// import UsersView from "./views/UsersView";
// import ResultView from "./views/ResultView";
// import DetaiProductView from "./views/DetaiProductView";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<PrincipalView />} />
          <Route path="/results" element={<ResultsView />} />
          <Route path="/detail" element={<DetailView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/order_completed" element={<OrderCompletedView />} />
          <Route path="/user/detail_order" element={<DetailOrderView />} />
          <Route path="/user/account" element={<OrdersUserView />} />
          <Route
            path="/user/registration_data"
            element={<RegistrationDataView />}
          />
          <Route
            path="/user/change_password"
            element={<ChangeUserPasswordView />}
          />
          <Route path="/auth/register" element={<RegisterUserView />} />
          <Route path="/auth/login" element={<LoginUserView />} />
          <Route path="/admin/series" element={<SeriesView />} />
          <Route path="/admin/create_serie" element={<CreateSerieView />} />
          <Route path="/admin/update_serie" element={<UpdateSerieView />} />
          <Route path="/admin/products" element={<ProductsView />} />
          <Route path="/admin/create_product" element={<CreateProductView />} />
          <Route path="/admin/update_product" element={<UpdateProductView />} />
          <Route path="/admin/users" element={<UsersView />} />
          <Route path="/admin/orders" element={<OrdersView />} />
          <Route path="/admin/detail_user" element={<DetailUserView />} />
          {/* <Route path="/cart" element={<CartView />} />
          <Route path="/changepassword" element={<ChangePasswordView />} />
          <Route path="/cuenta" element={<CuentaView />} />
          <Route path="/detail_product" element={<DetaiProductView />} />
          <Route path="/" element={<PrincipalView />} index />
          <Route path="/recuperacion" element={<RecuperacionView />} index />
          <Route path="/result" element={<ResultView />} />
          <Route path="/registrationdata" element={<RegistrationDataView />} />
          <Route path="/serieslist" element={<SeriesListView />} />
          <Route path="/admin" element={<AdminView />} />
          <Route path="/agregarproducto" element={<AgregarProductoView />} />
          <Route path="/lproductos" element={<LProductosView />} />
          <Route path="/userlist" element={<UserListView />} />
          <Route path="/orderadmin" element={<OrderAdminView />} />
          <Route path="/orderdetail" element={<OrderDetailView />} />
          <Route path="/addserie" element={<AddserieView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="/completedorder" element={<CompletedOrderView />} />
          <Route path="/admin/create_serie" element={<CreateSerieView />} />
          <Route path="/admin/series" element={<SeriesView />} />
          <Route path="/admin/update_serie" element={<UpdateSerieView />} />
          <Route path="/admin/create_product" element={<CreateProductView />} />
          <Route path="/admin/products" element={<ProductsView />} />
          <Route path="/admin/update_product" element={<UpdateProductView />} />
          <Route path="/admin/users" element={<UsersView />} />
          <Route path="/admin/detail_user" element={<DetailUserView />} />
          <Route path="/auth/register" element={<RegisterView />} />
          <Route path="/auth/login" element={<LoginView />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
