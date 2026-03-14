/**
 * Страницы сайта. Форма заявки на Контактах — отправка на бэкенд.
 */
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { getApiBase, apiFetch } from './auth'
import {
  hero,
  benefits,
  processShort,
  packages,
  services,
  processSteps,
  reviews,
  faqItems,
  blogPosts,
  contacts,
  legalPages,
  clinic as clinicStatic,
} from './data'

const API_BASE = getApiBase()

function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="p-6 bg-white border border-stone-200 rounded-lg">
      <p className="font-semibold text-stone-800">{title}</p>
      {desc && <p className="text-sm text-stone-600 mt-1">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
}

// ——— Главная ———
export function HomePage() {
  return (
    <>
      <section className="mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-3">{hero.title}</h1>
        <p className="text-stone-600 mb-6 max-w-2xl mx-auto">{hero.subtitle}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/kontakty#form" className="px-5 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600">
            {hero.ctaPrimary}
          </Link>
          <Link to="/prices" className="px-5 py-2.5 border border-stone-300 rounded-lg font-medium hover:bg-stone-100">
            {hero.ctaSecondary}
          </Link>
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Преимущества</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
              <h3 className="font-medium text-stone-800 mb-1">{b.title}</h3>
              <p className="text-sm text-stone-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Процесс в 3 шага</h2>
        <ol className="list-decimal list-inside space-y-2 text-stone-700">
          {processShort.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Пакеты услуг</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {packages.map((p) => (
            <div key={p.id} className="p-4 bg-white border border-stone-200 rounded-lg">
              <h3 className="font-semibold text-stone-800">{p.name}</h3>
              <p className="text-amber-600 font-medium my-2">{p.priceRange}</p>
              <ul className="text-sm text-stone-600 space-y-1 mb-4">
                {p.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
              <Link to="/kontakty#form" className="text-sm font-medium text-amber-600 hover:underline">
                Узнать точную стоимость →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

// ——— Услуги ———
export function ServicesPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Услуги</h1>
      <div className="space-y-6">
        {services.map((s) => (
          <section key={s.id} id={s.id} className="p-4 bg-white border border-stone-200 rounded-lg">
            <h2 className="text-lg font-semibold text-stone-800 mb-2">{s.title}</h2>
            <p className="text-stone-600">{s.desc}</p>
          </section>
        ))}
      </div>
      <section className="mt-8 p-4 bg-white border border-stone-200 rounded-lg">
        <h2 className="text-lg font-semibold text-stone-800 mb-2">Клиника</h2>
        <p className="text-stone-600 mb-3">{clinicStatic.note}</p>
        <p className="font-semibold text-stone-800">{clinicStatic.name}</p>
        <p className="text-sm text-stone-600 mt-1">{clinicStatic.spec}</p>
        <p className="text-sm text-stone-600 mt-1">Рейтинг: {clinicStatic.rating}</p>
        <Link to="/kontakty#form" className="inline-block mt-3 text-sm font-medium text-amber-600 hover:underline">
          Запросить детали →
        </Link>
      </section>
    </>
  )
}

// ——— Процесс ———
export function ProcessPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Как это работает</h1>
      <ol className="list-decimal list-inside space-y-3 text-stone-700">
        {processSteps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      <Link to="/kontakty#form" className="inline-block mt-6 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600">
        Оставить заявку
      </Link>
    </>
  )
}

// ——— Цены ———
export function PricesPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Цены и пакеты</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {packages.map((p) => (
          <div key={p.id} className="p-4 bg-white border border-stone-200 rounded-lg">
            <h3 className="font-semibold text-stone-800">{p.name}</h3>
            <p className="text-amber-600 font-medium my-2">{p.priceRange}</p>
            <ul className="text-sm text-stone-600 space-y-1">
              {p.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
            <Link to="/kontakty#form" className="inline-block mt-3 text-sm font-medium text-amber-600 hover:underline">
              Узнать точную стоимость →
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

// ——— Отзывы ———
export function ReviewsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Отзывы</h1>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 bg-white border border-stone-200 rounded-lg">
            <p className="font-medium text-stone-800">{r.name}</p>
            <p className="text-sm text-stone-500">{r.date}</p>
            <p className="text-stone-700 mt-2">{r.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}

// ——— FAQ ———
export function FaqPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Вопросы и ответы</h1>
      <div className="space-y-4">
        {faqItems.map((item, i) => (
          <div key={i} className="p-4 bg-white border border-stone-200 rounded-lg">
            <p className="font-medium text-stone-800">{item.q}</p>
            <p className="text-stone-600 mt-1">{item.a}</p>
          </div>
        ))}
      </div>
      <Link to="/kontakty#form" className="inline-block mt-6 text-amber-600 hover:underline">Оставить заявку →</Link>
    </>
  )
}

// ——— Блог ———
export function BlogPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Блог</h1>
      <ul className="space-y-4">
        {blogPosts.map((p) => (
          <li key={p.id}>
            <Link to={`/blog/${p.id}`} className="block p-4 bg-white border border-stone-200 rounded-lg hover:bg-stone-50">
              <h2 className="font-semibold text-stone-800">{p.title}</h2>
              <p className="text-sm text-stone-500">{p.date}</p>
              <p className="text-stone-600 mt-1">{p.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export function BlogPostPage() {
  const { id } = useParams()
  const post = useMemo(() => blogPosts.find((p) => p.id === id), [id])
  return (
    <>
      {post ? (
        <article className="prose prose-stone max-w-none">
          <h1 className="text-2xl font-bold text-stone-800">{post.title}</h1>
          <p className="text-sm text-stone-500">{post.date}</p>
          <p className="text-stone-700 mt-4">{post.excerpt}</p>
          <p className="text-stone-600 mt-4">Здесь будет полный текст статьи.</p>
        </article>
      ) : (
        <p className="text-stone-600">Статья не найдена.</p>
      )}
    </>
  )
}

// ——— Форма заявки: кнопка всегда активна, при отправке — disabled по isSubmitting ———
function RequestForm() {
  const [sent, setSent] = useState(false)
  const [agree, setAgree] = useState(false)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {}
    if (phone.trim().length < 6) next.phone = 'Введите телефон (минимум 6 символов)'
    if (!agree) next.agree = 'Нужно согласие на обработку персональных данных'
    if (email.trim() && !isValidEmail(email)) next.email = 'Некорректный email'
    return next
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError(null)
    const body = {
      phone: phone.trim(),
      email: email.trim() || undefined,
      first_name: undefined,
      last_name: undefined,
      city: undefined,
      preferred_dates: undefined,
      goal: undefined,
      procedure_type: undefined,
      has_face_operations: undefined,
      face_operation_details: undefined,
      chronic_diseases: undefined,
      allergies: undefined,
      has_medical_files: false,
      comment: undefined,
    }

    fetch(`${API_BASE}/applications/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (!res.ok) {
          let msg = `Ошибка: ${res.status}`
          try {
            const data = await res.json()
            if (data?.detail) msg = typeof data.detail === 'string' ? data.detail : msg
          } catch {
            // ignore
          }
          setSubmitError(msg)
          return
        }
        setSent(true)
      })
      .catch(() => {
        const base = getApiBase()
        setSubmitError(`Не удалось отправить заявку. Запустите бэкенд: в папке backend выполните «uvicorn app.main:app --host 127.0.0.1 --port 8002». API: ${base}`)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  if (sent) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
        <p className="font-medium text-amber-900">Спасибо! Заявка отправлена.</p>
        <p className="text-sm text-amber-800 mt-1">Мы свяжемся с вами в ближайшее время.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-4 text-sm text-amber-700 hover:underline">
          Отправить ещё одну заявку
        </button>
      </div>
    )
  }

  const fieldClass = (name: string) =>
    `w-full px-3 py-2 border rounded-lg ${errors[name] ? 'border-red-400 bg-red-50' : 'border-stone-300'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl" id="form">
      <h2 className="text-xl font-semibold text-stone-800">Оставить заявку</h2>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Телефон *</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={fieldClass('phone')}
          placeholder="+7 (999) 123-45-67"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass('email')}
          placeholder="example@mail.ru"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="agree"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1 rounded border-stone-300"
        />
        <label htmlFor="agree" className="text-sm text-stone-700">
          Я даю согласие на обработку персональных данных *
        </label>
      </div>
      {errors.agree && <p className="text-sm text-red-600">{errors.agree}</p>}
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Отправка…' : 'Отправить заявку'}
      </button>
    </form>
  )
}

// ——— Контакты ———
export function ContactsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Контакты</h1>
      <p className="text-stone-600 mb-6">
        Телефон: <a href={`tel:${contacts.phone.replace(/\D/g, '')}`} className="text-amber-600 hover:underline">{contacts.phone}</a>
        <br />
        Email: <a href={`mailto:${contacts.email}`} className="text-amber-600 hover:underline">{contacts.email}</a>
      </p>
      <RequestForm />
    </>
  )
}

// ——— Юридическая страница ———
export function LegalPage({ type }: { type: 'privacy' | 'offer' | 'medical' }) {
  const page = legalPages[type === 'medical' ? 'medical' : type]
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{page.title}</h1>
      <div className="prose prose-stone max-w-none text-stone-700 whitespace-pre-wrap">{page.content}</div>
    </>
  )
}

// ——— Вход ———
export function LoginPage() {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!email.trim()) next.email = 'Введите email'
    else if (!isValidEmail(email)) next.email = 'Некорректный email'
    if (!password) next.password = 'Введите пароль'
    else if (password.length < 8) next.password = 'Не менее 8 символов'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setLoading(true)
    setSubmitError(null)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(typeof data.detail === 'string' ? data.detail : 'Неверный email или пароль')
        return
      }
      if (data.access_token) {
        setToken(data.access_token)
        navigate('/', { replace: true })
      } else setSubmitError('Ошибка ответа сервера')
    } catch {
      setSubmitError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  const fc = (n: string) => `w-full px-3 py-2 border rounded-lg ${errors[n] ? 'border-red-400 bg-red-50' : 'border-stone-300'}`
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-4">Вход</h1>
      <form onSubmit={handleSubmit} className="p-6 bg-white border border-stone-200 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fc('email')} required />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Пароль *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={fc('password')} minLength={8} required />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        <button type="submit" disabled={loading} className="w-full py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50">
          {loading ? 'Вход…' : 'Войти'}
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-600">
        Нет аккаунта? <Link to="/register" className="text-amber-600 hover:underline">Зарегистрироваться</Link>
      </p>
    </div>
  )
}

// ——— Регистрация ———
export function RegisterPage() {
  const navigate = useNavigate()
  const { setToken } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!email.trim()) next.email = 'Введите email'
    else if (!isValidEmail(email)) next.email = 'Некорректный email'
    if (!password) next.password = 'Введите пароль'
    else if (password.length < 8) next.password = 'Не менее 8 символов'
    if (password !== confirmPassword) next.confirmPassword = 'Пароли не совпадают'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setLoading(true)
    setSubmitError(null)
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(typeof data.detail === 'string' ? data.detail : 'Ошибка регистрации')
        return
      }
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const loginData = await loginRes.json().catch(() => ({}))
      if (loginData.access_token) {
        setToken(loginData.access_token)
        navigate('/', { replace: true })
      } else navigate('/login', { replace: true })
    } catch {
      setSubmitError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  const fc = (n: string) => `w-full px-3 py-2 border rounded-lg ${errors[n] ? 'border-red-400 bg-red-50' : 'border-stone-300'}`
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-4">Регистрация</h1>
      <form onSubmit={handleSubmit} className="p-6 bg-white border border-stone-200 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fc('email')} required />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Пароль *</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={fc('password')} minLength={8} required />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Повторите пароль *</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={fc('confirmPassword')} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>
        {submitError && <p className="text-sm text-red-600">{submitError}</p>}
        <button type="submit" disabled={loading} className="w-full py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50">
          {loading ? 'Регистрация…' : 'Зарегистрироваться'}
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-600">
        Уже есть аккаунт? <Link to="/login" className="text-amber-600 hover:underline">Войти</Link>
      </p>
    </div>
  )
}

// ——— Админка (список заявок по токену) ———
type AppFromApi = { id: string; status: string; created_at: string; phone?: string; email?: string; goal?: string; procedure_type?: string; comment?: string }

export function AdminPage() {
  const { token } = useAuth()
  const [applications, setApplications] = useState<AppFromApi[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    if (!token) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setForbidden(false)
    apiFetch('/applications')
      .then((res) => {
        if (res.status === 403) {
          if (!cancelled) setForbidden(true)
          return
        }
        if (!res.ok) return res.json().then(() => { if (!cancelled) setError('Ошибка загрузки'); return [] })
        return res.json()
      })
      .then((data: AppFromApi[]) => {
        if (!cancelled) setApplications(Array.isArray(data) ? data : [])
      })
      .catch(() => { if (!cancelled) setError('Ошибка соединения') })
      .finally(() => { if (!cancelled) setLoading(false) })
  }, [token])

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white border border-stone-200 rounded-lg">
        <p className="text-stone-700 mb-4">Войдите, чтобы видеть заявки.</p>
        <Link to="/login" className="inline-block px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600">Войти</Link>
      </div>
    )
  }
  if (forbidden) return <div className="p-6 bg-red-50 border border-red-200 rounded-lg"><p className="font-medium text-red-800">Нет прав</p></div>
  if (error) return <p className="text-red-600">{error}</p>
  if (loading) return <p className="text-stone-600">Загрузка…</p>
  if (applications.length === 0) return <p className="p-6 bg-white border border-stone-200 rounded-lg text-stone-600">Заявок пока нет.</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Заявки</h1>
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-stone-200 rounded-lg">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="text-left p-3 text-sm font-medium text-stone-700">Дата</th>
              <th className="text-left p-3 text-sm font-medium text-stone-700">Телефон</th>
              <th className="text-left p-3 text-sm font-medium text-stone-700">Email</th>
              <th className="text-left p-3 text-sm font-medium text-stone-700">Статус</th>
              <th className="text-left p-3 text-sm font-medium text-stone-700">Комментарий</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="p-3 text-sm">{new Date(app.created_at).toLocaleString('ru')}</td>
                <td className="p-3 text-sm">{app.phone ?? '—'}</td>
                <td className="p-3 text-sm">{app.email ?? '—'}</td>
                <td className="p-3 text-sm">{app.status ?? '—'}</td>
                <td className="p-3 text-sm max-w-xs truncate" title={app.comment ?? ''}>{app.comment ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ——— 404 ———
export function NotFoundPage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Страница не найдена</h1>
      <p className="text-stone-600 mb-6">Запрашиваемая страница не существует.</p>
      <Link to="/" className="text-amber-600 hover:underline">На главную</Link>
    </div>
  )
}
