/**
 * Все страницы сайта в одном файле для простоты V1.
 * Импорт данных из data.ts (моки).
 */
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
  clinic,
} from './data'

// ——— Простой empty state компонент (без отдельного файла) ———
function EmptyState({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="p-6 bg-white border border-stone-200 rounded-lg">
      <p className="font-semibold text-stone-800">{title}</p>
      {desc ? <p className="text-sm text-stone-600 mt-1">{desc}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
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
  if (services.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Услуги</h1>
        <EmptyState title="Пока нет списка услуг" desc="Скоро добавим подробности по сопровождению и программам лечения." />
      </>
    )
  }
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

      {/* Оставляем одну проверенную клинику (без вкладки «Партнёры») */}
      <section className="mt-8 p-4 bg-white border border-stone-200 rounded-lg">
        <h2 className="text-lg font-semibold text-stone-800 mb-2">Клиника</h2>
        <p className="text-stone-600 mb-3">{clinic.note}</p>
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <p className="font-semibold text-stone-800">{clinic.name}</p>
          <p className="text-sm text-stone-600 mt-1">{clinic.spec}</p>
          <p className="text-sm text-stone-600 mt-1">Рейтинг: {clinic.rating}</p>
          <p className="text-xs text-stone-500 mt-1">{clinic.license}</p>
          <Link to="/kontakty#form" className="inline-block mt-3 text-sm font-medium text-amber-600 hover:underline">
            Запросить детали по клинике →
          </Link>
        </div>
      </section>
    </>
  )
}

// ——— Как это работает ———
export function ProcessPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Как это работает</h1>
      <ol className="space-y-4">
        {processSteps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-semibold flex items-center justify-center">
              {i + 1}
            </span>
            <span className="text-stone-700">{step}</span>
          </li>
        ))}
      </ol>
    </>
  )
}

// ——— Цены и пакеты ———
export function PricesPage() {
  // packages захардкожены как "as const", поэтому длина — литерал 3.
  // Оставляем этот блок как пример пустого состояния, но условие делаем управляемым.
  const mode = useMemo(() => {
    const qs = new URLSearchParams(window.location.search)
    return { empty: qs.get('empty') === '1' }
  }, [])
  const list = mode.empty ? [] : packages
  if (list.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Цены и пакеты</h1>
        <EmptyState
          title="Пакеты пока не опубликованы"
          desc="Оставьте заявку — подскажем подходящий вариант и ориентировочную стоимость."
          action={<Link to="/kontakty#form" className="text-amber-600 hover:underline">Оставить заявку →</Link>}
        />
      </>
    )
  }
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Цены и пакеты</h1>
      <p className="text-stone-600 mb-6">
        Точная стоимость зависит от дат, города вылета и программы. Нажмите «Узнать точную стоимость» и заполните форму — мы рассчитаем и свяжемся с вами.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {list.map((p) => (
          <div key={p.id} className="p-5 bg-white border border-stone-200 rounded-lg">
            <h2 className="text-lg font-semibold text-stone-800">{p.name}</h2>
            <p className="text-amber-600 font-medium my-2">{p.priceRange}</p>
            <ul className="text-sm text-stone-600 space-y-1 mb-4">
              {p.items.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
            <Link to="/kontakty#form" className="inline-block px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
              Узнать точную стоимость
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

// ——— Отзывы ———
export function ReviewsPage() {
  // Loading/Error/Empty состояния для «страницы списка» (отзывы)
  // Управление для демонстрации:
  // - добавьте ?error=1 чтобы увидеть error state
  // - добавьте ?empty=1 чтобы увидеть empty state
  const mode = useMemo(() => {
    const qs = new URLSearchParams(window.location.search)
    return {
      error: qs.get('error') === '1',
      empty: qs.get('empty') === '1',
    }
  }, [])
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')

  useEffect(() => {
    const t = window.setTimeout(() => {
      setStatus(mode.error ? 'error' : 'ready')
    }, 900)
    return () => window.clearTimeout(t)
  }, [mode.error])

  if (status === 'loading') {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Отзывы</h1>
        <div className="p-4 bg-white border border-stone-200 rounded-lg">
          <p className="text-stone-700 font-medium">Загрузка…</p>
          <p className="text-sm text-stone-500 mt-1">Симуляция задержки через setTimeout.</p>
        </div>
      </>
    )
  }

  if (status === 'error') {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Отзывы</h1>
        <EmptyState
          title="Не удалось загрузить отзывы"
          desc="Это демо error state. Уберите ?error=1 из адресной строки, чтобы увидеть список."
          action={<Link to="/otzyvy" className="text-amber-600 hover:underline">Попробовать снова →</Link>}
        />
      </>
    )
  }

  const list = mode.empty ? [] : reviews
  if (list.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Отзывы</h1>
        <EmptyState
          title="Пока нет отзывов"
          desc="Мы добавим отзывы и кейсы по мере готовности. А пока можете задать вопросы в форме заявки."
          action={<Link to="/kontakty#form" className="text-amber-600 hover:underline">Задать вопрос →</Link>}
        />
      </>
    )
  }
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Отзывы</h1>
      <div className="space-y-4">
        {list.map((r) => (
          <blockquote key={r.id} className="p-4 bg-white border border-stone-200 rounded-lg">
            <p className="text-stone-700">{r.text}</p>
            <footer className="mt-2 text-sm text-stone-500">
              — {r.name}, {r.date}
            </footer>
          </blockquote>
        ))}
      </div>
    </>
  )
}

// ——— FAQ ———
export function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null)
  if (faqItems.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Вопросы и ответы</h1>
        <EmptyState title="Пока нет FAQ" desc="Оставьте заявку — мы уточним детали и ответим на ваши вопросы." action={<Link to="/kontakty#form" className="text-amber-600 hover:underline">Оставить заявку →</Link>} />
      </>
    )
  }
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Вопросы и ответы</h1>
      <div className="space-y-2">
        {faqItems.map((item, i) => {
          const id = `faq-${i}`
          const isOpen = openId === id
          return (
            <div key={id} className="border border-stone-200 rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : id)}
                className="w-full px-4 py-3 text-left font-medium text-stone-800 hover:bg-stone-50 flex justify-between items-center"
              >
                {item.q}
                <span className="text-stone-400">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && <div className="px-4 py-3 border-t border-stone-100 text-stone-600 text-sm">{item.a}</div>}
            </div>
          )
        })}
      </div>
    </>
  )
}

// ——— Блог ———
export function BlogPage() {
  // Loading/Error/Empty состояния для «страницы списка» (блог)
  // Управление для демонстрации:
  // - добавьте ?error=1 чтобы увидеть error state
  // - добавьте ?empty=1 чтобы увидеть empty state
  const mode = useMemo(() => {
    const qs = new URLSearchParams(window.location.search)
    return {
      error: qs.get('error') === '1',
      empty: qs.get('empty') === '1',
    }
  }, [])
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading')

  useEffect(() => {
    const t = window.setTimeout(() => {
      setStatus(mode.error ? 'error' : 'ready')
    }, 900)
    return () => window.clearTimeout(t)
  }, [mode.error])

  if (status === 'loading') {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Блог</h1>
        <div className="p-4 bg-white border border-stone-200 rounded-lg">
          <p className="text-stone-700 font-medium">Загрузка…</p>
          <p className="text-sm text-stone-500 mt-1">Симуляция задержки через setTimeout.</p>
        </div>
      </>
    )
  }

  if (status === 'error') {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Блог</h1>
        <EmptyState
          title="Не удалось загрузить список статей"
          desc="Это демо error state. Уберите ?error=1 из адресной строки, чтобы увидеть список."
          action={<Link to="/blog" className="text-amber-600 hover:underline">Попробовать снова →</Link>}
        />
      </>
    )
  }

  const list = mode.empty ? [] : blogPosts
  if (list.length === 0) {
    return (
      <>
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Блог</h1>
        <EmptyState title="Статей пока нет" desc="Скоро добавим полезные материалы о подготовке к поездке и лечении." />
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Блог</h1>
      <ul className="space-y-4">
        {list.map((post) => (
          <li key={post.id}>
            <Link to={`/blog/${post.id}`} className="block p-4 bg-white border border-stone-200 rounded-lg hover:border-amber-300">
              <h2 className="font-semibold text-stone-800">{post.title}</h2>
              <p className="text-sm text-stone-500 mt-1">{post.date}</p>
              <p className="text-stone-600 mt-2 text-sm">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

// ——— Одна статья блога (мок) ———
export function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const post = blogPosts.find((p) => p.id === (id ?? ''))
  return (
    <>
      <Link to="/blog" className="text-sm text-amber-600 hover:underline mb-4 inline-block">← Назад к списку</Link>
      {!post ? (
        <div className="p-4 bg-white border border-stone-200 rounded-lg">
          <p className="font-medium text-stone-800">Статья не найдена</p>
          <p className="text-sm text-stone-600 mt-1">Проверьте ссылку или вернитесь в список статей.</p>
        </div>
      ) : (
        <article>
          <h1 className="text-2xl font-bold text-stone-800">{post.title}</h1>
          <p className="text-stone-500 mt-1">{post.date}</p>
          <p className="text-stone-700 mt-4">{post.excerpt}</p>
          <p className="text-stone-600 mt-4">
            Здесь будет полный текст статьи. Пока контент захардкожен.
          </p>
        </article>
      )}
    </>
  )
}

// ——— Форма заявки (общие поля по ТЗ) ———
function RequestForm() {
  const [sent, setSent] = useState(false)
  const [agree, setAgree] = useState(false)
  const [goal, setGoal] = useState('')
  const [procedureType, setProcedureType] = useState('')
  const [faceOpHistory, setFaceOpHistory] = useState<'yes' | 'no' | ''>('')
  const [faceOpDetails, setFaceOpDetails] = useState('')
  const [chronic, setChronic] = useState('')
  const [allergies, setAllergies] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const next: Record<string, string> = {}

    // Требования V1: телефон + согласие. Остальное — опционально, но валидируем если заполнено.
    if (phone.trim().length < 6) next.phone = 'Введите телефон (минимум 6 символов)'
    if (!agree) next.agree = 'Нужно согласие на обработку персональных данных'

    if (email.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      if (!ok) next.email = 'Похоже, email введён с ошибкой'
    }

    if (faceOpHistory === 'yes' && faceOpDetails.trim().length < 5) {
      next.faceOpDetails = 'Опишите операцию на лице (минимум 5 символов)'
    }

    return next
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setSent(true)
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

  const canSubmit = Object.keys(validate()).length === 0
  const fieldClass = (name: string) =>
    `w-full px-3 py-2 border rounded-lg ${errors[name] ? 'border-red-400 bg-red-50' : 'border-stone-300'}`

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Имя</label>
          <input type="text" className={fieldClass('firstName')} placeholder="Имя" onChange={() => errors.firstName && setErrors((e) => ({ ...e, firstName: '' }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Фамилия</label>
          <input type="text" className={fieldClass('lastName')} placeholder="Фамилия" onChange={() => errors.lastName && setErrors((e) => ({ ...e, lastName: '' }))} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Телефон *</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
          }}
          className={fieldClass('phone')}
          placeholder="+7 ..."
        />
        {errors.phone ? <p className="text-xs text-red-600 mt-1">{errors.phone}</p> : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
          }}
          className={fieldClass('email')}
          placeholder="email@example.com"
        />
        {errors.email ? <p className="text-xs text-red-600 mt-1">{errors.email}</p> : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Город вылета</label>
        <input type="text" className={fieldClass('city')} placeholder="Москва" onChange={() => errors.city && setErrors((e) => ({ ...e, city: '' }))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Предполагаемая дата поездки / гибкий график</label>
        <input type="text" className={fieldClass('date')} placeholder="Например: май 2025 или гибко" onChange={() => errors.date && setErrors((e) => ({ ...e, date: '' }))} />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Цель поездки</label>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className={fieldClass('goal')}
        >
          <option value="">Выберите</option>
          <option value="consult">Консультация</option>
          <option value="implant">Импланты</option>
          <option value="prosthetics">Протезирование</option>
          <option value="other">Другое</option>
        </select>
      </div>

      {/* Доп. сбор данных (по вашему запросу) */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Тип процедуры</label>
        <select
          value={procedureType}
          onChange={(e) => setProcedureType(e.target.value)}
          className={fieldClass('procedureType')}
        >
          <option value="">Выберите</option>
          <option value="blepharo">Блефаропластика</option>
          <option value="facelift">Подтяжка лица</option>
          <option value="injections">Инъекции</option>
          <option value="laser">Лазер</option>
        </select>
        <p className="text-xs text-stone-500 mt-1">Пока это просто сбор данных в форме (без отправки на сервер).</p>
      </div>

      <div className="p-4 bg-white border border-stone-200 rounded-lg">
        <p className="text-sm font-medium text-stone-800 mb-2">История операций на лице</p>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="radio"
              name="faceOpHistory"
              value="no"
              checked={faceOpHistory === 'no'}
              onChange={() => setFaceOpHistory('no')}
            />
            Нет
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="radio"
              name="faceOpHistory"
              value="yes"
              checked={faceOpHistory === 'yes'}
              onChange={() => setFaceOpHistory('yes')}
            />
            Да
          </label>
        </div>
        {faceOpHistory === 'yes' && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-stone-700 mb-1">Подробности</label>
            <textarea
              rows={2}
              value={faceOpDetails}
              onChange={(e) => setFaceOpDetails(e.target.value)}
              className={fieldClass('faceOpDetails')}
              placeholder="Какая операция, когда, были ли осложнения"
            />
            {errors.faceOpDetails ? <p className="text-xs text-red-600 mt-1">{errors.faceOpDetails}</p> : null}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Хронические болезни</label>
        <textarea
          rows={2}
          value={chronic}
          onChange={(e) => setChronic(e.target.value)}
          className={fieldClass('chronic')}
          placeholder="Если есть — перечислите"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Аллергии</label>
        <textarea
          rows={2}
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className={fieldClass('allergies')}
          placeholder="Если есть — укажите (лекарства, анестезия и т.д.)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Мед. документы (фото/файлы)</label>
        <input type="file" multiple accept="image/*,.pdf" className="w-full text-sm text-stone-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Комментарий</label>
        <textarea rows={3} className={fieldClass('comment')} placeholder="Дополнительная информация" onChange={() => errors.comment && setErrors((e) => ({ ...e, comment: '' }))} />
      </div>
      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => {
            setAgree(e.target.checked)
            if (errors.agree) setErrors((prev) => ({ ...prev, agree: '' }))
          }}
          className="mt-1"
        />
        <span className="text-sm text-stone-600">Согласен на обработку персональных данных *</span>
      </label>
      {errors.agree ? <p className="text-xs text-red-600 -mt-2">{errors.agree}</p> : null}
      <div className="flex flex-wrap gap-3">
        {/* Улучшение интерфейса: кнопка disabled, пока не заполнен телефон и нет согласия */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="px-5 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50"
        >
          Отправить заявку
        </button>
        <button type="button" className="px-5 py-2.5 border border-stone-300 rounded-lg font-medium hover:bg-stone-100">
          Заказать звонок
        </button>
      </div>
    </form>
  )
}

// ——— Контакты + форма ———
export function ContactsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Контакты / Забронировать поездку</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-semibold text-stone-800 mb-2">Связь</h2>
          <p><a href={`tel:${contacts.phone.replace(/\D/g, '')}`} className="text-amber-600 hover:underline">{contacts.phone}</a></p>
          <p><a href={`mailto:${contacts.email}`} className="text-amber-600 hover:underline">{contacts.email}</a></p>
          <p>
            <a href={contacts.whatsapp} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">WhatsApp</a>
            {' · '}
            <a href={contacts.telegram} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">Telegram</a>
          </p>
        </div>
        <div id="form">
          <h2 className="font-semibold text-stone-800 mb-4">Оставить заявку</h2>
          <RequestForm />
        </div>
      </div>
    </>
  )
}

// ——— Юридическая страница (политика, оферта, мед. отказ) ———
export function LegalPage({ type }: { type: 'privacy' | 'offer' | 'medical' }) {
  const page = legalPages[type === 'medical' ? 'medical' : type]
  return (
    <>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">{page.title}</h1>
      <div className="prose prose-stone max-w-none text-stone-700 whitespace-pre-wrap">{page.content}</div>
    </>
  )
}

// ——— 404 ———
export function NotFoundPage() {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Страница не найдена</h1>
      <p className="text-stone-600 mb-6">Запрашиваемая страница не существует.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="text-amber-600 hover:underline">Главная</Link>
        <Link to="/uslugi" className="text-amber-600 hover:underline">Услуги</Link>
        <Link to="/kontakty" className="text-amber-600 hover:underline">Контакты</Link>
      </div>
    </div>
  )
}
