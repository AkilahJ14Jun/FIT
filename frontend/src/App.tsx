import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import {
  Dashboard,
  Customers,
  CustomerForm,
  Inventory,
  Deliveries,
  DeliveryForm,
  Reports,
  Billing,
  NotFound,
} from './pages'

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/new" element={<CustomerForm />} />
          <Route path="/customers/:id/edit" element={<CustomerForm />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/deliveries/new" element={<DeliveryForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App
