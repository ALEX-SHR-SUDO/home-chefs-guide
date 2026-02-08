# OCR Automation Guide

## Обзор

Эта система автоматизации OCR предназначена для извлечения структурированных данных рецептов из фотографий. Система использует Tesseract.js для распознавания текста и опционально OpenAI GPT-4 для интеллектуального структурирования данных.

## Архитектура Системы

```
home-chefs-guide/
├── scripts/
│   ├── ocr-extract.ts          # Основной скрипт извлечения OCR
│   ├── ocr-batch-process.ts    # Пакетная обработка
│   └── ocr-validate-results.ts # Валидация результатов
├── data/
│   └── ocr-results/
│       ├── raw/                # Сырой OCR текст (.txt)
│       ├── processed/          # Структурированные JSON рецепты
│       └── logs/               # Логи обработки
├── public/images/recipes/      # Исходные изображения рецептов
└── .github/workflows/
    └── ocr-process.yml         # GitHub Actions workflow
```

## Установка и Настройка

### 1. Установка Зависимостей

```bash
# Установить Node.js зависимости
npm install

# Установить Tesseract OCR (для локальной разработки)
# macOS
brew install tesseract tesseract-lang

# Ubuntu/Debian
sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-rus

# Windows (через Chocolatey)
choco install tesseract
```

### 2. Конфигурация API Ключей

Скопируйте `.env.example` в `.env` и настройте необходимые ключи:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

```env
# Для AI-структурирования (опционально, но рекомендуется)
OPENAI_API_KEY=sk-your-api-key-here

# Настройки OCR
OCR_PROVIDER=tesseract
OCR_LANGUAGE=eng+rus
OCR_DPI=300
OCR_CONFIDENCE_THRESHOLD=60
```

**Примечание:** OpenAI API ключ опционален. Без него система будет использовать базовую структуру данных.

### 3. Создание Необходимых Директорий

Директории создаются автоматически при запуске скриптов, но вы можете создать их вручную:

```bash
mkdir -p data/ocr-results/raw
mkdir -p data/ocr-results/processed
mkdir -p data/ocr-results/logs
```

## Использование

### Локальное Использование

#### Обработка Одного Изображения

```bash
npm run ocr:extract -- naan.jpg
```

#### Пакетная Обработка Всех Изображений

```bash
# Обработать только новые изображения
npm run ocr:batch

# Принудительно обработать все изображения заново
npm run ocr:batch -- --force

# Ограничить количество обрабатываемых изображений
npm run ocr:batch -- --limit=10
```

#### Валидация Результатов

```bash
npm run ocr:validate
```

### Использование через GitHub Actions

#### Ручной Запуск

1. Перейдите в раздел **Actions** вашего репозитория
2. Выберите **OCR Recipe Extraction** workflow
3. Нажмите **Run workflow**
4. Опционально:
   - Укажите конкретные изображения через запятую: `naan.jpg,tiramisu.jpg`
   - Отметьте **force_reprocess** для повторной обработки

#### Автоматический Запуск

Workflow автоматически запускается когда:
- Добавляются новые изображения в `public/images/recipes/`
- По расписанию (каждое воскресенье в 2:00 UTC)

## Структура Данных

### Интерфейс Recipe

Извлеченные данные соответствуют интерфейсу из `lib/types.ts`:

```typescript
interface Recipe {
  id: string;              // Уникальный ID
  title: string;           // Название рецепта
  slug: string;            // URL-friendly slug
  category: string;        // Категория (e.g., "Desserts", "Main Course")
  categorySlug: string;    // Slug категории
  description: string;     // Краткое описание
  image: string;           // Путь к изображению
  prepTime: number;        // Время подготовки (минуты)
  cookTime: number;        // Время приготовления (минуты)
  totalTime: number;       // Общее время (минуты)
  servings: number;        // Количество порций
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;         // Кухня (e.g., "Italian", "Indian")
  dietaryTags: string[];   // Диетические теги
  ingredients: string[];   // Список ингредиентов
  instructions: string[];  // Пошаговые инструкции
  nutrition: {
    calories: number;
    protein: number;       // граммы
    carbs: number;         // граммы
    fat: number;           // граммы
  };
  tips: string[];          // Советы по приготовлению
  datePublished: string;   // ISO дата
  author: string;          // Автор рецепта
}
```

### Пример Извлеченного JSON

```json
{
  "id": "recipe-1707408468123-naan",
  "title": "Naan",
  "slug": "naan",
  "category": "Breads",
  "categorySlug": "breads",
  "description": "Soft and fluffy Indian flatbread perfect for any curry",
  "image": "/images/recipes/naan.jpg",
  "prepTime": 15,
  "cookTime": 10,
  "totalTime": 25,
  "servings": 8,
  "difficulty": "Easy",
  "cuisine": "Indian",
  "dietaryTags": ["Vegetarian"],
  "ingredients": [
    "2 cups all-purpose flour",
    "1 tsp instant yeast",
    "1 tsp sugar",
    "3/4 cup warm water",
    "2 tbsp yogurt",
    "2 tbsp melted butter"
  ],
  "instructions": [
    "Mix flour, yeast, and sugar in a bowl",
    "Add water and yogurt, knead until smooth",
    "Let dough rise for 1 hour",
    "Divide into 8 portions and roll out",
    "Cook on hot skillet until bubbles form",
    "Brush with melted butter and serve"
  ],
  "nutrition": {
    "calories": 180,
    "protein": 5,
    "carbs": 30,
    "fat": 4
  },
  "tips": [
    "Keep the skillet very hot for best results",
    "Brush with garlic butter for extra flavor"
  ],
  "datePublished": "2024-02-08T17:00:00.000Z",
  "author": "OCR System"
}
```

## Workflow Процесса

### 1. Предобработка Изображений

Система автоматически улучшает качество изображений для лучшего распознавания:
- Преобразование в оттенки серого
- Нормализация контраста
- Повышение резкости
- Бинаризация (пороговая обработка)

### 2. OCR Извлечение

Tesseract.js извлекает текст с изображения:
- Поддержка английского и русского языков
- Настраиваемый порог уверенности
- Логирование прогресса

### 3. AI-Структурирование

OpenAI GPT-4 анализирует OCR текст и создает структурированный JSON:
- Интеллектуальное парсинг секций рецепта
- Автоматическая категоризация
- Оценка отсутствующих данных
- Извлечение питательной ценности

### 4. Сохранение Результатов

Данные сохраняются в трех местах:
- **Raw**: Сырой OCR текст для проверки
- **Processed**: Структурированный JSON
- **Logs**: Логи обработки и валидации

## Валидация Результатов

Скрипт валидации проверяет:

✅ **Обязательные поля** - все необходимые поля присутствуют
✅ **Типы данных** - правильные типы для каждого поля
✅ **Форматы** - валидные форматы (difficulty, даты, числа)
✅ **Массивы** - минимальная длина для ингредиентов и инструкций
✅ **Nutrition** - валидная структура питательной ценности
⚠️ **Warnings** - предупреждения для подозрительных значений

### Интерпретация Результатов Валидации

```bash
✅ naan.json: VALID
   ⚠️  Warnings: 1
      - prepTime is 0 - may need manual review

❌ tiramisu.json: INVALID
   Errors: 2
      - Missing required field: instructions
      - Invalid difficulty: Moderate. Must be one of: Easy, Medium, Hard
```

## Troubleshooting

### Проблема: Низкое качество OCR

**Симптомы:**
- Много орфографических ошибок в тексте
- Пропущенные слова или секции
- Низкая уверенность (<60%)

**Решения:**
1. Проверьте качество исходного изображения (рекомендуется 300+ DPI)
2. Убедитесь, что текст на изображении четкий и читаемый
3. Попробуйте альтернативный OCR провайдер (Google Cloud Vision)
4. Увеличьте настройки предобработки в коде

### Проблема: OpenAI API Ошибки

**Симптомы:**
- "OpenAI API not configured"
- API rate limit errors
- Неполные ответы

**Решения:**
1. Проверьте правильность API ключа в `.env`
2. Убедитесь, что у вас есть кредиты на аккаунте OpenAI
3. Увеличьте задержки между запросами (rate limiting)
4. Система автоматически создаст fallback структуру без AI

### Проблема: GitHub Actions Fails

**Симптомы:**
- Workflow fails на шаге "Install dependencies"
- "Permission denied" ошибки
- Tesseract не найден

**Решения:**
1. Проверьте права доступа workflow (нужны `contents: write`)
2. Убедитесь, что Tesseract устанавливается правильно
3. Проверьте наличие `OPENAI_API_KEY` в secrets (если используется)
4. Проверьте логи workflow для деталей

### Проблема: Validation Failures

**Симптомы:**
- Многие рецепты не проходят валидацию
- Missing required fields
- Invalid data types

**Решения:**
1. Просмотрите сырой OCR текст в `data/ocr-results/raw/`
2. Проверьте quality исходных изображений
3. Улучшите промпт для OpenAI в `ocr-extract.ts`
4. Вручную исправьте проблемные JSON файлы

## Best Practices

### Качество Изображений

1. **Высокое разрешение**: Минимум 300 DPI
2. **Хорошее освещение**: Избегайте теней и бликов
3. **Четкий текст**: Избегайте размытых изображений
4. **Прямой угол**: Текст должен быть параллелен краям изображения
5. **Контраст**: Черный текст на белом фоне работает лучше всего

### Оптимизация Стоимости API

1. **Используйте Tesseract по умолчанию**: Бесплатно и достаточно для большинства случаев
2. **OpenAI для сложных случаев**: Используйте только когда нужна интеллектуальная обработка
3. **Batch processing**: Обрабатывайте несколько изображений за раз
4. **Кэширование**: Не переобрабатывайте уже обработанные изображения

### Ручная Проверка

После автоматической обработки рекомендуется:

1. Проверить извлеченные данные на точность
2. Исправить опечатки в ингредиентах и инструкциях
3. Дополнить отсутствующую питательную ценность
4. Добавить полезные советы по приготовлению
5. Уточнить время приготовления

## Advanced Usage

### Кастомизация Промптов

Отредактируйте промпт в `scripts/ocr-extract.ts` для улучшения качества:

```typescript
const prompt = `Analyze this OCR text from a recipe image...
Your custom instructions here...`;
```

### Добавление Новых OCR Провайдеров

Вы можете добавить поддержку других OCR сервисов:

1. Google Cloud Vision API
2. AWS Textract
3. Azure Computer Vision

Пример интеграции доступен в комментариях кода.

### Расширение Валидации

Добавьте custom валидацию в `scripts/ocr-validate-results.ts`:

```typescript
private validateCustom(recipe: Recipe): string | null {
  // Your custom validation logic
  return null;
}
```

## Maintenance

### Регулярные Задачи

- **Еженедельно**: Проверка качества автоматически обработанных рецептов
- **Ежемесячно**: Обновление зависимостей (`npm update`)
- **Квартально**: Обзор и оптимизация промптов AI

### Мониторинг

Отслеживайте:
- Success rate в validation reports
- Average confidence scores в OCR logs
- API usage и стоимость (если используется OpenAI)

## Поддержка

При возникновении проблем:

1. Проверьте логи в `data/ocr-results/logs/`
2. Просмотрите validation report
3. Изучите сырой OCR текст
4. Обратитесь к этому руководству
5. Создайте issue в GitHub репозитории

## Дополнительные Ресурсы

- [Tesseract.js Documentation](https://tesseract.projectnaptha.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Sharp Image Processing](https://sharp.pixelplumbing.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Последнее обновление**: 2024-02-08
