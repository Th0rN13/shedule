Проанализировав архитектуру проекта, вот конкретные технические улучшения:

## 1. **Проблема: CanvasService.ts - монолитный сервис с нарушением单一责任原则**

**Текущее состояние:**

- [`CanvasService.ts`](src/lib/services/CanvasService.ts:1) содержит 280 строк с множеством методов
- Смешана логика позиционирования, конфигурации и рендеринга
- Методы `generate*Config` дублируют код

**Конкретные проблемы:**

- [`generateTitleConfig()`](src/lib/services/CanvasService.ts:55), [`generateFootNoteConfig()`](src/lib/services/CanvasService.ts:71), [`generatDayTextConfigs()`](src/lib/services/CanvasService.ts:109) - повторяющаяся логика создания TextConfig
- [`getDayTextPositions()`](src/lib/services/CanvasService.ts:86) и [`getSlotTextPositions()`](src/lib/services/CanvasService.ts:128) - почти идентичный код для расчета позиций
- Жестко заданные магические числа в позиционировании

**Решение:**

```typescript
// Создать TextConfigBuilder
export class TextConfigBuilder {
	private config: Partial<TextConfig> = {};

	setText(text: string): this {
		this.config.text = text;
		return this;
	}
	setPosition(x: number, y: number): this {
		this.config.x = x;
		this.config.y = y;
		return this;
	}
	// ... другие методы

	build(): TextConfig {
		return { ...defaultTextConfig, ...this.config };
	}
}

// Вынести расчет позиций в PositionCalculator
export class PositionCalculator {
	static calculateDayPosition(dayIndex: number, centerOffset: number): Position {
		// Общая логика для всех позиций
	}

	static calculateSlotPosition(slotIndex: number, centerOffset: number): Position {
		// Использовать общую логику с параметрами
	}
}
```

## 2. **Проблема: Нарушение инкапсуляции в хранилищах**

**Текущее состояние:**

- [`configStore.ts`](src/lib/stores/config.ts:1) смешивает состояние с логикой
- Прямые мутации localStorage в методах store
- Нет валидации данных

**Конкретные проблемы:**

- Методы [`toggleCanvas()`](src/lib/stores/config.ts:25), [`setColor()`](src/lib/stores/config.ts:32) напрямую вызывают LocalStorageService
- Нет проверки валидности цвета в [`setColor()`](src/lib/stores/config.ts:32)
- [`setcenterTextOffset()`](src/lib/stores/config.ts:36) - опечатка в названии метода

**Решение:**

```typescript
// Создать ConfigService для бизнес-логики
export class ConfigService {
	static updateTextColor(color: HexColor): void {
		if (!this.isValidColor(color)) throw new Error('Invalid color');
		LocalStorageService.update({ textColor: color });
	}

	private static isValidColor(color: string): boolean {
		return /^#[0-9A-F]{6}$/i.test(color);
	}
}

// Store становится чистым состоянием
export const configStore = writable<ConfigState>(initialState);
```

## 3. **Проблема: Дублирование кода в компонентах**

**Текущее состояние:**

- [`LargeCanvas.svelte`](src/lib/cmp/Preview/LargeCanvas.svelte:1) и [`SmallCanvas.svelte`](src/lib/cmp/Preview/SmallCanvas.svelte:1) дублируют загрузку изображения
- Одинаковые эффекты для иници stage

**Конкретные проблемы:**

- Идентичный код загрузки фона в обоих компонентах
- Повторяющаяся логика обновления stageStore

**Решение:**

```typescript
// Создать CanvasBaseService
export class CanvasBaseService {
	static loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve) => {
			const img = document.createElement('img');
			img.src = src;
			img.onload = () => resolve(img);
		});
	}

	static setupStageEffect(
		stage: Stage,
		store: Writable<StageStore>,
		updateFn: (stage: Stage) => void
	) {
		$effect(() => {
			if (stage) {
				updateFn(stage);
			}
		});
	}
}
```

## 4. **Проблема: Жесткая связанность компонентов**

**Текущее состояние:**

- Компоненты напрямую импортируют и используют stores
- Нет абстракций для данных

**Конкретные проблемы:**

- [`ScheduleDay.svelte`](src/lib/cmp/Schedule/ScheduleDay.svelte:1) напрямую использует schedulesStore
- [`SheduleInput.svelte`](src/lib/cmp/Schedule/SheduleInput.svelte:1) вызывает методы store напрямую

**Решение:**

```typescript
// Создать ScheduleViewModel
export class ScheduleViewModel {
	constructor(private store: Writable<SchedulesState>) {}

	updateText(index: number, text: string): void {
		// Валидация и логика обновления
	}

	toggleSlot(index: number): void {
		// Логика переключения
	}
}

// Компоненты используют ViewModel вместо прямого доступа к store
```

## 5. **Проблема: Отсутствие валидации данных**

**Текущее состояние:**

- [`LocalStorageService.ts`](src/lib/services/LocalStorageService.ts:1) не проверяет структуру данных
- Нет защиты от поврежденных данных

**Конкретные проблемы:**

- Метод [`load()`](src/lib/services/LocalStorageService.ts:38) создает пустые данные без проверки их структуры
- Нет валидации длины массива slots

**Решение:**

```typescript
// Добавить валидацию данных
export class LocalStorageService {
	static load(): LocalStorageData {
		const data = localStorage.getItem('schedule');
		if (!data) return this.getDefaultData();

		try {
			const parsed = JSON.parse(data);
			return this.validateAndNormalize(parsed);
		} catch {
			return this.getDefaultData();
		}
	}

	private static validateAndNormalize(data: any): LocalStorageData {
		if (!Array.isArray(data?.slots) || data.slots.length !== TOTAL_SCHEDULE_ITEMS) {
			return this.getDefaultData();
		}

		return {
			slots: data.slots.map((slot, idx) => ({
				text: String(slot.text || ''),
				enabled: Boolean(slot.enabled)
			})),
			textColor: this.validateColor(data.textColor) || '#000000',
			centerTextOffset: Number(data.centerTextOffset) || 0
		};
	}
}
```

## 6. **Проблема: Неконсистентное именование**

**Конкретные проблемы:**

- [`setcenterTextOffset()`](src/lib/stores/config.ts:36) - должно быть `setCenterTextOffset`
- [`generatDayTextConfigs()`](src/lib/services/CanvasService.ts:109) - пропущена 'e' в "generate"
- [`SheduleInput.svelte`](src/lib/cmp/Schedule/SheduleInput.svelte:1) - опечатка в "Schedule"

## 7. **Проблема: Отсутствие error boundaries**

**Текущее состояние:**

- Нет обработки ошибок при рендере canvas
- Сбои в одном компоненте могут повредить весь интерфейс

**Решение:**

```typescript
// Создать ErrorBoundary компонент
export class CanvasErrorBoundary {
	private handleError(error: Error): void {
		console.error('Canvas rendering error:', error);
		// Показать пользователю сообщение об ошибке
		// Переключиться на безопасный режим
	}
}
```

## 8. **Проблема: Производительность при вычислениях**

**Текущее состояние:**

- [`calculateSmallLineHeight()`](src/lib/services/CanvasService.ts:219) пересчитывается при каждом изменении
- Нет мемоизации сложных вычислений

**Решение:**

```typescript
// Использовать мемоизацию
export const memoizedLineHeight = memoize(
	(schedules: SchedulesState) => {
		const count = schedules.filter((el) => el.enabled).length;
		return count < 3 ? 140 : Math.floor((TOTAL_SCHEDULE_ITEMS * 30) / count);
	},
	(schedules) => JSON.stringify(schedules)
);
```

Эти улучшения сделают код более поддерживаемым, уменьшат дублирование и улучшат производительность без изменения функциональности приложения.
