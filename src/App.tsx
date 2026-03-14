import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import { Layout } from './Layout'
import {
  AdminPage,
  HomePage,
  ServicesPage,
  ProcessPage,
  PricesPage,
  ReviewsPage,
  FaqPage,
  BlogPage,
  BlogPostPage,
  ContactsPage,
  LegalPage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
} from './Pages'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/uslugi" element={<ServicesPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/otzyvy" element={<ReviewsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/kontakty" element={<ContactsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/offer" element={<LegalPage type="offer" />} />
            <Route path="/medical-disclaimer" element={<LegalPage type="medical" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
