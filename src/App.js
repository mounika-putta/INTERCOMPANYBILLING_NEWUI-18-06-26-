import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';   
import Login from './Pages/Login/Login';         
import ReceivingEntities from './Pages/ReceivingEntities/ReceivingEntities';
import Roles from './Pages/Roles/Roles';
import Quotation from './Pages/Quotation/Quotation';
import Registration from './Pages/UserRegistration/Registration'; 
import Activation from './Pages/UserActivation/Activation';
import Products from './Pages/InventoryItem/InventoryItem';
import ScreenMapping from './Pages/RoleWiseScreenMapping/ScreenMapping';
import LandingPage from './Pages/LandingPage';
import MasterData from './Pages/MasterData/MasterData';
import Quotationapproval from './Pages/QuotationApproval/Quotationapproval';
import QuotationTemplate from './Pages/QuotationApproval/QuotationTemplate';
import QuotationInvoiceapproval from './Pages/QuotationApproval/QuotationInvoiceList';
import Customers from './Pages/Customers/Customer';
import QuotationDashboard from './Pages/QuotationDashboard/QuotationDashboard';
import AuditLogs from './Pages/AuditLogs/AuditLogs';
import PrivateRoute from './components/PrivateRoutes';
import EditProfile from './Pages/UserRegistration/EditProfile';
import ChangePassword from './Pages/ChangePassword/ChangePassword';
import Reports from './Pages/Reports/Reports';
import UsersList from './Pages/UsersList/UsersList';
import InvoiceTemplate from './Pages/QuotationApproval/InvoiceTemplate';
import QuotationTemplateModern from './Pages/QuotationApproval/QuotationTemplateModern';
import ServiceRender from './Pages/ServiceRender/ServiceRender';
import CreditNoteTemplate from './Pages/QuotationApproval/CreditNoteTemplate';
import CreditNoteViewTemplate from './Pages/QuotationApproval/CreditNoteViewTemplate';
import ReportsDashboard from './Pages/ReportsDashboard/ReportsDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/activation" element={<Activation />} />
        <Route path="/quotationtemplate" element={<QuotationTemplate />} />
        <Route path="/Invoicetemplate" element={<InvoiceTemplate />} />
        <Route path="/QuotationTemplateModern" element={<QuotationTemplateModern />} />
        <Route path="/CreditNotetemplate/:id" element={<CreditNoteTemplate />} />
        <Route path="/CreditNoteViewtemplate" element={<CreditNoteViewTemplate />} />
        {/* Protected routes inside Layout */}
        <Route path="/" element={<Layout />}>
          
          
          <Route
            path="/receivingentities"
            element={
              <PrivateRoute>
                <ReceivingEntities />
              </PrivateRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <PrivateRoute>
                <Roles />
              </PrivateRoute>
            }
          />
          <Route
            path="/quotation"
            element={
              <PrivateRoute>
                <Quotation />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/department"
            element={
              <PrivateRoute>
                <Department />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/Products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/screenmapping"
            element={
              <PrivateRoute>
                <ScreenMapping />
              </PrivateRoute>
            }
          />
          <Route
            path="/landingpage"
            element={
              <PrivateRoute>
                <LandingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/masterdata"
            element={
              <PrivateRoute>
                <MasterData />
              </PrivateRoute>
            }
          />
          <Route
            path="/quotationapproval"
            element={
              <PrivateRoute>
                <Quotationapproval />
              </PrivateRoute>
            }
          />
          <Route
            path="/quotationinvoiceapproval"
            element={
              <PrivateRoute>
                <QuotationInvoiceapproval />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            }
          />
           <Route
            path="/quotationdashboard"
            element={
              <PrivateRoute>
                <QuotationDashboard />
              </PrivateRoute>
            }
          />

           <Route
            path="/Auditlog"
            element={
              <PrivateRoute>
                <AuditLogs/>
              </PrivateRoute>
            }
          />
           <Route

            path="/editprofile"
            element={
              <PrivateRoute>
                <EditProfile/>
              </PrivateRoute>
            }
          />
          <Route

            path="/Reports"
            element={
              <PrivateRoute>
                <Reports/>
              </PrivateRoute>
            }
          />
           <Route

            path="/ReportsDashboard"
            element={
              <PrivateRoute>
                <ReportsDashboard/>
              </PrivateRoute>
            }
          />
           <Route

            path="/ChangePassword"
            element={
              <PrivateRoute>
                <ChangePassword/>
              </PrivateRoute>
            }
          />
          <Route
            path="/userslist"
            element={
              <PrivateRoute>
                <UsersList/>
              </PrivateRoute>
          }
          />

          <Route
            path="/ServiceRender"
            element={
              <PrivateRoute>
                <ServiceRender/>
              </PrivateRoute>
            }
          />
          
         
        </Route>
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
