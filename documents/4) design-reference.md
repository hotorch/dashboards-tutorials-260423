# 디자인 가이드라인: 엠바고 요청 관리 도구

## 1. 디자인 철학

다크 모드 기반의 미니멀 SaaS 대시보드입니다. 화려함을 배제하고 빠른 스캐닝과 가독성을 우선합니다. 글로우와 그라데이션은 핵심 액션 영역에만 제한적으로 사용합니다.

핵심 원칙:
- 대부분의 UI는 그레이스케일로 유지합니다
- 프라이머리 컬러(#6366F1)는 CTA, 포커스, 활성 상태에만 사용합니다
- 장식적 요소를 최소화하고 기능성을 우선합니다
- 호버/액티브 외 과한 애니메이션을 사용하지 않습니다

## 2. 컬러 시스템

### 2.1 베이스 컬러

| 토큰 | HEX | 용도 |
|---|---|---|
| `--bg-base` | `#0B0B0F` | 페이지 배경 |
| `--bg-surface` | `#12121A` | 카드, 사이드바, 모달 |
| `--bg-surface-hover` | `#1A1A24` | 호버 상태 |
| `--bg-elevated` | `#1E1E28` | 드롭다운, 팝오버 |

### 2.2 프라이머리 (Indigo)

| 토큰 | HEX | 용도 |
|---|---|---|
| `--primary-300` | `#A5A8F8` | 텍스트 강조 |
| `--primary-500` | `#6366F1` | 기본 CTA, 활성 |
| `--primary-600` | `#4F46E5` | CTA 호버 |
| `--primary-glow` | `rgba(99, 102, 241, 0.35)` | 글로우 효과 |

### 2.3 그레이 스케일

| 토큰 | HEX | 용도 |
|---|---|---|
| `--text-primary` | `#F4F4F5` | 본문 강조 |
| `--text-secondary` | `#A1A1AA` | 보조 텍스트 |
| `--text-tertiary` | `#71717A` | 메타 정보 |
| `--border-subtle` | `#27272F` | 기본 보더 |
| `--border-strong` | `#3F3F46` | 강조 보더 |

### 2.4 상태 배지 컬러

| 상태 | 배경 | 텍스트 | 보더 |
|---|---|---|---|
| `requested` (요청됨) | `rgba(161, 161, 170, 0.12)` | `#D4D4D8` | `rgba(161, 161, 170, 0.25)` |
| `in_progress` (진행중) | `rgba(99, 102, 241, 0.15)` | `#A5A8F8` | `rgba(99, 102, 241, 0.35)` |
| `completed` (완료) | `rgba(34, 197, 94, 0.12)` | `#86EFAC` | `rgba(34, 197, 94, 0.25)` |

배지는 채도를 낮춰 시각적 노이즈를 줄입니다.

### 2.5 그라데이션

```css
--gradient-cta: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
--gradient-hero-border: linear-gradient(135deg, rgba(99,102,241,0.4), rgba(99,102,241,0.05));
```

CTA 버튼과 히어로 입력창 보더에만 사용합니다.

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
--font-sans: 'Pretendard', 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'D2Coding', monospace;
```

### 3.2 사이즈 스케일

| 토큰 | 크기 | line-height | 용도 |
|---|---|---|---|
| `text-xs` | 12px | 16px | 메타, 캡션 |
| `text-sm` | 13px | 18px | 보조 본문, 배지 |
| `text-base` | 14px | 20px | 기본 본문 |
| `text-md` | 16px | 24px | 카드 제목 |
| `text-lg` | 20px | 28px | 섹션 제목 |
| `text-xl` | 24px | 32px | 페이지 제목 |
| `text-2xl` | 32px | 40px | 히어로 |

### 3.3 웨이트

- Regular: 400 (본문)
- Medium: 500 (강조 텍스트, 버튼)
- Semibold: 600 (제목, 카드 헤더)

## 4. 스페이싱

4px 기반 스케일입니다.

| 토큰 | 값 |
|---|---|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

## 5. 보더 및 라운드

```css
--radius-sm: 6px;   /* 배지, 인풋 */
--radius-md: 8px;   /* 버튼 */
--radius-lg: 12px;  /* 카드 */
--radius-xl: 16px;  /* 모달, 히어로 입력 */

--border-width: 1px;
```

## 6. 그림자 및 글로우

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
--shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.6);

--glow-primary: 0 0 24px rgba(99, 102, 241, 0.25);
--glow-primary-strong: 0 0 40px rgba(99, 102, 241, 0.4);
```

글로우는 다음 영역에만 적용합니다:
- 히어로 입력창 포커스 시
- CTA 버튼 호버 시
- 활성 사이드바 아이템

## 7. 레이아웃 구조

### 7.1 전체 레이아웃

```
┌──────────────────────────────────────────────┐
│ Sidebar │  Main Content Area                 │
│ 240px   │                                    │
│         │  ┌──────────────────────────────┐  │
│         │  │ Hero Input (신규 요청 입력)   │  │
│         │  └──────────────────────────────┘  │
│         │                                    │
│         │  ┌──── Summary Cards ────┐         │
│         │                                    │
│         │  ┌──── Filter Bar ────┐            │
│         │                                    │
│         │  ┌──── Embargo Cards ────┐         │
│         │                                    │
└──────────────────────────────────────────────┘
```

### 7.2 사이드바 (좌측 고정)

- 너비: 240px (데스크톱), 64px (태블릿 축소 모드)
- 배경: `--bg-surface`
- 우측 보더: `1px solid --border-subtle`
- 패딩: `space-4`

구성 요소:
- 상단: 로고 + 서비스명 "엠바고 관리"
- 메뉴: 대시보드 (단일 아이템, 활성 상태)
- 하단: 필터 프리셋 (오늘, 이번 주, 전체)

활성 메뉴 표시:
```css
background: rgba(99, 102, 241, 0.12);
color: var(--primary-300);
border-left: 2px solid var(--primary-500);
```

### 7.3 메인 콘텐츠 영역

- 좌측 마진: 240px (사이드바 너비)
- 최대 너비: 1280px
- 좌우 패딩: `space-8`
- 상단 패딩: `space-8`

## 8. 핵심 컴포넌트

### 8.1 히어로 입력창 (신규 요청)

상단에 배치되는 프로미넌트 인풋입니다.

```
┌─────────────────────────────────────────────────┐
│  ✏️  엠바고 요청 입력...              [+ 등록] │
└─────────────────────────────────────────────────┘
```

스타일:
- 배경: `--bg-surface`
- 보더: `1px solid --border-subtle`
- 라운드: `--radius-xl`
- 패딩: `space-5 space-6`
- 높이: 64px

포커스 상태:
```css
border-color: var(--primary-500);
box-shadow: var(--glow-primary);
background: linear-gradient(135deg, #12121A, #16161F);
```

클릭 시 모달이 열려 상세 정보(설명, 일시 등)를 입력합니다.

### 8.2 요약 카드

오늘 엠바고 현황을 표시합니다.

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ 오늘 5건  │ │ 요청 2   │ │ 진행 2   │ │ 완료 1   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

스타일:
- 배경: `--bg-surface`
- 보더: `1px solid --border-subtle`
- 라운드: `--radius-lg`
- 패딩: `space-5`
- 그리드: 4열 (데스크톱), 2열 (태블릿)

숫자 표시:
- 사이즈: `text-2xl`
- 웨이트: 600
- 컬러: `--text-primary`

라벨:
- 사이즈: `text-sm`
- 컬러: `--text-secondary`

### 8.3 엠바고 카드

개별 요청을 카드 형태로 표시합니다.

```
┌──────────────────────────────────────────────┐
│ [진행중]  2026-04-25 14:00                   │
│                                              │
│ 신제품 발표 보도자료                          │
│ 제작팀 검토 후 IT팀 전달 예정                 │
│                                              │
│ #보도자료    ☐ PDF 발송      [수정] [삭제]   │
└──────────────────────────────────────────────┘
```

스타일:
- 배경: `--bg-surface`
- 보더: `1px solid --border-subtle`
- 라운드: `--radius-lg`
- 패딩: `space-5 space-6`
- 마진: `space-3` (카드 간 간격)

호버 상태:
```css
background: var(--bg-surface-hover);
border-color: var(--border-strong);
transition: all 150ms ease;
```

내부 요소 정렬:
- 1행: 상태 배지 + 엠바고 일시 (좌측), 액션 (우측)
- 2행: 제목 (`text-md`, weight 600)
- 3행: 설명 (`text-base`, `--text-secondary`)
- 4행: 태그 + PDF 체크박스 + 액션 버튼

### 8.4 상태 배지

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid;
}
```

상태별 클래스는 `--badge-{status}-bg`, `--badge-{status}-text`, `--badge-{status}-border` 변수를 사용합니다.

### 8.5 버튼

#### Primary (CTA)
```css
background: var(--gradient-cta);
color: white;
padding: 8px 16px;
border-radius: var(--radius-md);
font-weight: 500;

/* hover */
box-shadow: var(--glow-primary);
```

#### Secondary
```css
background: transparent;
color: var(--text-primary);
border: 1px solid var(--border-subtle);

/* hover */
background: var(--bg-surface-hover);
border-color: var(--border-strong);
```

#### Ghost (액션)
```css
background: transparent;
color: var(--text-secondary);

/* hover */
color: var(--text-primary);
background: var(--bg-surface-hover);
```

### 8.6 필터 바

```
┌─────────────────────────────────────────────┐
│ [오늘 ▾] [전체 상태 ▾] [태그 ▾]    🔍 검색  │
└─────────────────────────────────────────────┘
```

- 드롭다운 트리거는 Ghost 버튼 스타일
- 활성 필터는 `--primary-300` 컬러로 표시
- 활성 시 좌측에 작은 dot 인디케이터 추가

### 8.7 모달

```css
.modal {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-8);
  max-width: 480px;
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}
```

## 9. 인터랙션

### 9.1 트랜지션

```css
--transition-fast: 100ms ease;
--transition-base: 150ms ease;
--transition-slow: 250ms ease;
```

기본 호버는 `--transition-base`, 상태 변경은 `--transition-fast`를 사용합니다.

### 9.2 포커스

```css
:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

### 9.3 사용 금지

- 페이지 진입 애니메이션
- 카드 등장 stagger 애니메이션
- 마우스 따라다니는 효과
- 과도한 그라데이션 애니메이션

## 10. 반응형 브레이크포인트

```scss
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);
```

| 브레이크포인트 | 사이드바 | 요약 카드 | 엠바고 카드 |
|---|---|---|---|
| `wide` (≥1440px) | 240px | 4열 | 풀 너비 |
| `desktop` (≥1024px) | 240px | 4열 | 풀 너비 |
| `tablet` (≥768px) | 64px (아이콘만) | 2열 | 풀 너비 |
| `mobile` (≥320px) | 하단 탭바 전환 | 1열 | 풀 너비 |

내부 도구이므로 데스크톱 환경 최적화를 우선하고, 모바일은 최소 대응합니다.

## 11. 아이콘

- 라이브러리: Lucide Icons
- 기본 사이즈: 16px (인라인), 20px (버튼), 24px (헤더)
- 컬러: `--text-secondary` (기본), `--text-primary` (활성)
- 스트로크: 1.5px

## 12. 가독성 가이드

### 12.1 본문 대비
모든 본문 텍스트는 WCAG AA 기준 4.5:1 이상 대비를 유지합니다.

### 12.2 카드 스캐닝 최적화
- 제목은 항상 동일한 위치(좌측 상단)
- 상태 배지는 카드 좌측 최상단 고정
- 엠바고 일시는 우측 상단 고정
- 액션은 우측 하단 고정

### 12.3 정보 위계

```
1순위: 제목 (text-md, weight 600, primary)
2순위: 엠바고 일시 (text-sm, weight 500, primary)
3순위: 상태 배지 (text-xs, weight 500, status color)
4순위: 설명 (text-base, secondary)
5순위: 메타 (text-xs, tertiary)
```

## 13. CSS 변수 전체 정의

```css
:root {
  /* Background */
  --bg-base: #0B0B0F;
  --bg-surface: #12121A;
  --bg-surface-hover: #1A1A24;
  --bg-elevated: #1E1E28;

  /* Primary */
  --primary-300: #A5A8F8;
  --primary-500: #6366F1;
  --primary-600: #4F46E5;
  --primary-glow: rgba(99, 102, 241, 0.35);

  /* Text */
  --text-primary: #F4F4F5;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;

  /* Border */
  --border-subtle: #27272F;
  --border-strong: #3F3F46;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.6);
  --glow-primary: 0 0 24px rgba(99, 102, 241, 0.25);

  /* Transition */
  --transition-fast: 100ms ease;
  --transition-base: 150ms ease;
}
```

## 14. 범위 외 항목

- 라이트 모드
- 다국어 RTL 대응
- 커스텀 테마 시스템
- 일러스트레이션, 캐릭터

MVP 범위에서 제외합니다.