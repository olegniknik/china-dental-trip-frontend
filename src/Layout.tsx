import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { navLinks } from './data'
import { contacts } from './data'

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const { token, logout } = useAuth()
  const isActive = (to: string) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <Link to="/" className="text-lg font-semibold text-stone-800 hover:text-stone-600">
            Лечение зубов в Китае
          </Link>
          <nav className="flex items-center gap-2 flex-wrap">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-2 py-1 rounded text-sm ${isActive(to) ? 'bg-amber-100 text-amber-900 font-medium' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                {label}
              </Link>
            ))}
            {token ? (
              <>
                <Link to="/admin" className="px-2 py-1 rounded text-sm text-stone-600 hover:bg-stone-100">Кабинет</Link>
                <button type="button" onClick={logout} className="px-2 py-1 rounded text-sm text-stone-600 hover:bg-stone-100">Выйти</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-2 py-1 rounded text-sm text-stone-600 hover:bg-stone-100">Войти</Link>
                <Link to="/register" className="px-2 py-1 rounded text-sm bg-amber-500 text-white hover:bg-amber-600">Регистрация</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>
      <footer className="bg-stone-800 text-stone-300 text-sm py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap gap-6 justify-between">
          <div>
            <p className="font-medium text-stone-100 mb-1">Контакты</p>
            <a href={`tel:${contacts.phone.replace(/\D/g, '')}`} className="hover:text-amber-400">{contacts.phone}</a>
            <span className="mx-2">|</span>
            <a href={`mailto:${contacts.email}`} className="hover:text-amber-400">{contacts.email}</a>
          </div>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-amber-400">Политика</Link>
            <Link to="/offer" className="hover:text-amber-400">Оферта</Link>
          </div>
        </div>
        <p className="max-w-5xl mx-auto px-4 mt-4 text-stone-500">© 2025</p>
      </footer>
    </div>
  )
}
