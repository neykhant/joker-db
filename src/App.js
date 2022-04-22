import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Admin from "./layouts/Admin";
import "./App.css";
import Login from "./pages/Login";
import CreateSales from "./pages/sales/CreateSales";
import EditSales from "./pages/sales/EditSales";
import AuthRoute from "./routers/AuthRoute";
import PrivateRoute from "./routers/PrivateRoute";
import PrintSale from "./pages/sales/PrintSale";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AuthRoute>
              <Admin />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/create-sales"
          element={
            <AuthRoute>
              <CreateSales />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/print-sale/:id"
          element={
            <AuthRoute>
              <PrintSale />
            </AuthRoute>
          }
        />
        <Route
          path="/admin/edit-sales/:id"
          element={
            <AuthRoute>
              <EditSales />
            </AuthRoute>
          }
        />

        <Route
          path="/auth/login"
          element={
            <PrivateRoute>
              <Login />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
