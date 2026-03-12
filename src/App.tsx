/**
 * Точка входа: роутер и общий Layout.
 * Все маршруты ведут к компонентам из Pages.tsx.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './Layout'
import {
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
  NotFoundPage,
} from './Pages'

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/offer" element={<LegalPage type="offer" />} />
          <Route path="/medical-disclaimer" element={<LegalPage type="medical" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
