---
name: keep-it-simple
description: Prefer simple, straightforward solutions over complex or over-engineered ones. Use when the user says "не усложняй", "keep it simple", "don't complicate", or when proposed solutions risk being unnecessarily complex.
---

# Не усложняй (Keep It Simple)

## Instructions

When this skill applies:

1. **Choose the minimal solution** that solves the problem. Avoid extra layers, abstractions, or patterns "на будущее" (for the future) unless clearly required.

2. **Prefer readability over cleverness.** Simple loops and conditionals over clever one-liners or advanced patterns when both work.

3. **Avoid over-engineering:**
   - No unnecessary abstractions (interfaces, factories, strategies) until there is real duplication or variation.
   - No extra dependencies if the standard library or existing stack is enough.
   - No "framework" or generic solution when a small, focused change is enough.

4. **Default to the obvious approach.** If two options are valid, pick the one that is easier to read and maintain. Document only when the choice is non-obvious.

5. **Resist scope creep.** Implement what was asked. Do not add "nice to have" features, validations, or edge-case handling unless the user asked or the task explicitly requires it.

## Heuristics

- **Fewer lines** (without sacrificing clarity) is usually better.
- **Fewer files/modules** is better unless the module is already large or has a clear boundary.
- **Standard library first**, then existing project dependencies; new dependency only when clearly justified.
- **Explicit over implicit** when it keeps code understandable.

## When to add complexity

Add abstraction or structure only when:
- The same logic is duplicated in more than one place.
- Requirements explicitly call for extensibility or pluggability.
- The simpler version is hard to test or reason about.
- The user explicitly asks for a more robust or scalable solution.

## Examples

**Плохо (лишняя абстракция):**
```typescript
// Не нужен интерфейс и фабрика для одного типа
interface IValidator { validate(x: unknown): boolean; }
class EmailValidatorFactory { create(): IValidator { ... } }
```

**Хорошо:**
```typescript
function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
```

---

**Плохо (лишняя зависимость):**
Подключение lodash только ради `_.debounce` при наличии простой реализации в 5 строк.

**Хорошо:**
Использовать то, что уже есть в проекте, или написать короткую функцию.

---

**Плохо (scope creep):**
Задача: «добавить кнопку "Сохранить"». Реализация: валидация формы, санитизация, оптимистичный UI, retry, аналитика.

**Хорошо:**
Кнопка, по клику вызывающая сохранение. Остальное — только по запросу.
