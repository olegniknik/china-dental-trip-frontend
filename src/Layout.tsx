/**
 * Общий макет: шапка + контент + подвал.
 * Навигация ведёт на все основные страницы.
 */
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks } from './data'
import { contacts } from './data'

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isActive = (to: string) => location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Шапка */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <Link to="/" className="text-lg font-semibold text-stone-800 hover:text-stone-600">
            Лечение зубов в Китае
          </Link>
          {/* Мобилка: делаем меню горизонтально прокручиваемым, чтобы ничего не «разъезжалось» */}
          <nav className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-1 sm:gap-2 whitespace-nowrap pb-1">
              {navLinks.map(({ to, label }: { to: string; label: string }) => (
              <Link
                key={to}
                to={to}
                className={`px-2 py-1 rounded text-sm ${isActive(to) ? 'bg-amber-100 text-amber-900 font-medium' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'}`}
              >
                {label}
              </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>

      {/* Подвал */}
      <footer className="bg-stone-800 text-stone-300 text-sm py-6">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap gap-6 justify-between">
          <div>
            <p className="font-medium text-stone-100 mb-1">Контакты</p>
            <a href={`tel:${contacts.phone.replace(/\D/g, '')}`} className="hover:text-amber-400">{contacts.phone}</a>
            <span className="mx-2">|</span>
            <a href={`mailto:${contacts.email}`} className="hover:text-amber-400">{contacts.email}</a>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-amber-400">Политика конфиденциальности</Link>
            <Link to="/offer" className="hover:text-amber-400">Договор-оферта</Link>
            <Link to="/medical-disclaimer" className="hover:text-amber-400">Мед. отказ</Link>
          </div>
        </div>
        <p className="max-w-5xl mx-auto px-4 mt-4 text-stone-500">© 2025. Все права защищены.</p>
      </footer>
    </div>
  )
}
