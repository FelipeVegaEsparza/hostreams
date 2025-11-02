import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CurrencyProvider } from './context/CurrencyContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Plans from './pages/Plans';
import PaymentSelection from './pages/PaymentSelection';
import Register from './pages/Register';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import ManualPaymentForm from './pages/ManualPaymentForm';
import MonthlyPayment from './pages/MonthlyPayment'; // Importar MonthlyPayment
import AdminDashboard from './pages/AdminDashboard';
import PlanManagement from './pages/PlanManagement';
import TicketManagement from './pages/TicketManagement';
import TutorialManagement from './pages/TutorialManagement';
import UserManagement from './pages/UserManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';
import ManualPaymentManagement from './pages/ManualPaymentManagement'; // Importar ManualPaymentManagement
import AdminRoute from './components/AdminRoute';
import RadioOnline from './pages/RadioOnline';
import TvOnline from './pages/TvOnline';
import Contact from './pages/Contact';
import Soporte from './pages/Soporte';
import TicketDetail from './pages/TicketDetail';
import Tutoriales from './pages/Tutoriales';
import Privacy from './pages/Privacy';
import CustomDevelopment from './pages/CustomDevelopment';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import PaymentSuccess from './pages/PaymentSuccess'; // Importar la nueva página
import PaymentCancel from './pages/PaymentCancel'; // Importar la nueva página
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BlogManagement from './pages/BlogManagement';
import EmailLogManagement from './pages/EmailLogManagement'; // Importar la nueva página

function App() {
  return (
    <Router>
      <CurrencyProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/radio-online" element={<RadioOnline />} />
              <Route path="/tv-online" element={<TvOnline />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/desarrollo-personalizado" element={<CustomDevelopment />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/tutoriales" element={<Tutoriales />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/payment-selection" element={<PaymentSelection />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/monthly-payment" element={<MonthlyPayment />} /> {/* Nueva ruta para pagos mensuales */}
              <Route path="/manual-payment" element={<ManualPaymentForm />} />
              <Route path="/payment-success" element={<PaymentSuccess />} /> {/* Ruta para pago exitoso */}
              <Route path="/payment-cancel" element={<PaymentCancel />} /> {/* Ruta para pago cancelado */}
              <Route path="/soporte" element={<Soporte />} />
              <Route path="/soporte/:id" element={<TicketDetail />} />
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="plans" element={<PlanManagement />} />
                <Route path="tickets" element={<TicketManagement />} />
                <Route path="tutoriales" element={<TutorialManagement />} />
                <Route path="subscriptions" element={<SubscriptionManagement />} />
                <Route path="manual-payments" element={<ManualPaymentManagement />} />
                <Route path="blog" element={<BlogManagement />} />
                <Route path="email-logs" element={<EmailLogManagement />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </CurrencyProvider>
    </Router>
  );
}

export default App;