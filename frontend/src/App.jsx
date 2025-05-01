import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Home from "./Pages/Home/Home";
import Navbar from "./Components/navbar/navbar";
import Footer from "./Components/footer/footer";
import Register from "./Pages/Registration/Register";
import Booknow from "./Pages/Booknow/Booknow";
import Mybooking from "./Pages/Mybooking/Mybooking";
import Vaccination from "./Pages/VaccinationCal/Vaccination"; 
import Feedback from "./Pages/Feedback/Feedback";
import UserProfile from "./Pages/Userprofile/userprofile";
import LostPet from "./Pages/Lostpet/LostPet";
import { StoreProvider } from "./context/StoreContext";
import DebugLogger from "./components/DebugLogger";
import UserAdmin from "./Pages/UserAdmin/useradmin";
import Login from "./Pages/Login/login";
import PetDietPlans from "./Pages/PetDietPlans/PetDietPlans";
import NutrientCalculator from "./Pages/NutrientCalculator/NutrientCalculator";
import RecipeSuggestions from "./Pages/RecipeSuggestions/RecipeSuggestions";
import NutritionManagement from "./Pages/NutritionManagement/NutritionManagement";
import Services from "./Pages/Services/Services";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Team from "./Pages/Team/Team";
import NutrientPlans from "./Pages/NutrientPlans/NutrientPlans";
import { PetModel } from "./Pages/PetModel/PetModel";
import PetAccessories from "./Pages/PetAccessories/PetAccessories";
import CartPage from "./Pages/CartPage/CartPage";
import { CartProvider } from "./Pages/CartPage/CartContext";
import PaymentPortal from "./Pages/PaymentPortal/PaymentPortal";
import PetImageTo3D from "./Pages/PetImageConverter/PetImageTo3D ";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import AdminPanel from "./Pages/Dashboard/AdminDashboard";

// Create a Layout component to conditionally render Navbar and Footer
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin"); // Check for admin routes

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <div className="content">{children}</div>
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <StoreProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Wrap non-admin routes in MainLayout */}
              <Route
                path="/*"
                element={
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/booknow" element={<Booknow />} />
                      <Route path="/mybookings" element={<Mybooking />} />
                      <Route path="/services/vaccinationcal" element={<Vaccination />} />
                      <Route path="/feedback" element={<Feedback />} />
                      <Route path="/userprofile" element={<UserProfile />} />
                      <Route path="/services/lostpet" element={<LostPet />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/Services" element={<Services/>} />
                      <Route path="/AboutUs" element={<AboutUs/>} />
                      <Route path="/Team" element={<Team/>} />
                      <Route path="/PetDietPlans" element={<PetDietPlans/>} />
                      <Route path="/NutrientCalculator" element={<NutrientCalculator/>} />
                      <Route path="/RecipeSuggestions" element={<RecipeSuggestions/>} />
                      <Route path="/NutritionManagement" element={<NutritionManagement/>} />
                      <Route path="/nutrientplans" element={<NutrientPlans/>} />
                      <Route path="/PetModel" element={<PetModel pet="dog" />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/paymentPortal" element={<PaymentPortal />} />
                      <Route path="/petimage3D" element={<PetImageTo3D />} />
                      <Route path="/shop/accessories" element={<PetAccessories />} />
                    </Routes>
                  </MainLayout>
                }
              />
              
              {/* Admin routes without MainLayout */}
              <Route path="/admin" element={<UserAdmin />} />
              <Route path="/adminPanel" element={<AdminPanel />} />
              <Route path="/AdminDashboard" element={<AdminDashboard />} />
            </Routes>
          </Router>
        </CartProvider>
      </StoreProvider>
    </DndProvider>
  );
}

export default App;