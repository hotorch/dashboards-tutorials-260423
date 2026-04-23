# PRD: 엠바고 요청 관리 도구 (MVP)

## 1. 제품 개요

사내 엠바고 요청과 일정을 관리하는 단일 페이지 웹 도구입니다. 편집팀, 제작팀, IT팀 사이의 전화/카카오톡 소통을 구조화된 워크플로우로 대체합니다.

## 2. 문제 정의

- 수동 소통으로 요청 추적이 어렵습니다.
- 엠바고 상태를 한곳에서 확인할 수 없습니다.
- 오늘 처리해야 할 엠바고를 한눈에 보기 어렵습니다.

## 3. 목표 및 성공 지표

| 목표 | 지표 |
|---|---|
| 빠른 요청 입력 | 요청 등록 30초 이내 |
| 명확한 상태 가시성 | 상태별 필터 1클릭 |
| 일일 현황 파악 | 오늘 엠바고 대시보드 상단 노출 |

## 4. 사용자 페르소나

단일 내부 사용자. 인증 불필요. 비개발자 운영 담당자가 엠바고 워크플로우를 관리합니다.

## 5. 핵심 기능 (Must)

### 5.1 엠바고 요청 생성
- 필수 입력: 제목, 설명, 엠바고 일시(date + time)
- 생성 시 기본 상태는 `요청됨`

### 5.2 상태 관리
- 상태값: `요청됨` → `진행중` → `완료`
- 리스트에서 드롭다운 또는 버튼으로 변경

### 5.3 리스트 뷰 + 날짜 필터
- 전체 목록 테이블 형태
- 날짜 필터: 오늘, 이번 주, 전체, 커스텀 범위
- 상태 필터 동시 적용

## 6. 추가 기능 (Nice to Have)

- PDF 발송 여부 체크박스 (`pdf_sent: boolean`)
- 태그/카테고리 필드 (자유 입력 문자열 또는 select)

## 7. 기술 스택

- Frontend: React (Vite) + Tailwind CSS
- Backend: Supabase (Postgres + Auto-generated REST API)
- 배포: Vercel 또는 Netlify

## 8. 데이터 모델 (Supabase)

### Table: `embargo_requests`

| 컬럼 | 타입 | 비고 |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| title | text | not null |
| description | text | nullable |
| embargo_at | timestamptz | not null |
| status | text | `requested` \| `in_progress` \| `completed`, default `requested` |
| pdf_sent | boolean | default false |
| tag | text | nullable |
| created_at | timestamptz | default `now()` |
| updated_at | timestamptz | default `now()` |

RLS는 비활성화 (내부 도구, 인증 없음).

## 9. 화면 구성

단일 페이지(SPA) 구조:

1. 상단 헤더: 제목 + 신규 요청 버튼
2. 오늘 엠바고 요약 카드: 오늘 건수, 상태별 카운트
3. 필터 바: 날짜 범위, 상태
4. 리스트 테이블: 제목, 엠바고 일시, 상태, PDF 여부, 태그, 액션
5. 생성/수정 모달: 간단한 폼

## 10. 제약 사항

- 인증 없음
- 단일 사용자 가정
- MVP 수준 스펙, 기능 확장 금지
- 최단 구현 우선

## 11. 구현 우선순위

1. Supabase 프로젝트 세팅 + `embargo_requests` 테이블 생성
2. React 프로젝트 세팅 + Supabase 클라이언트 연결
3. 리스트 뷰 + 조회 기능
4. 생성 폼
5. 상태 변경
6. 날짜/상태 필터
7. 오늘 요약 카드
8. (선택) PDF 체크박스, 태그

## 12. 완료 기준

- 요청 생성, 조회, 상태 변경, 날짜 필터가 동작합니다.
- 오늘 엠바고 건수가 대시보드 상단에 표시됩니다.
- 배포된 URL로 접근해 CRUD가 가능합니다.