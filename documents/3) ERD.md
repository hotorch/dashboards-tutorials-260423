# ERD 문서: 엠바고 요청 관리 시스템

## 1. 개요

단일 테이블 구조입니다. 엠바고 요청 하나를 한 행으로 관리합니다. 데이터 볼륨이 낮고 사용자가 단일이므로 별도 분리 테이블 없이 3NF를 유지하면서 최소 구성합니다.

## 2. 엔티티 목록

| 엔티티 | 역할 |
|---|---|
| `embargo_requests` | 엠바고 요청 건 저장 |

관계형 엔티티는 없습니다.

## 3. ERD 다이어그램

```
┌──────────────────────────────────┐
│       embargo_requests           │
├──────────────────────────────────┤
│ PK  id            uuid           │
│     title         text           │
│     description   text           │
│     embargo_at    timestamptz    │
│     status        text           │
│     pdf_sent      boolean        │
│     tag           text           │
│     created_at    timestamptz    │
│     updated_at    timestamptz    │
└──────────────────────────────────┘
```

## 4. 테이블 상세

### 4.1 `embargo_requests`

| 컬럼 | 타입 | NULL | 기본값 | 설명 |
|---|---|---|---|---|
| `id` | uuid | NO | `gen_random_uuid()` | PK |
| `title` | text | NO | - | 요청 제목 |
| `description` | text | YES | null | 상세 설명 |
| `embargo_at` | timestamptz | NO | - | 엠바고 일시 |
| `status` | text | NO | `'requested'` | 상태값 |
| `pdf_sent` | boolean | NO | `false` | PDF 발송 여부 |
| `tag` | text | YES | null | 태그/카테고리 (자유 입력) |
| `created_at` | timestamptz | NO | `now()` | 생성 시각 |
| `updated_at` | timestamptz | NO | `now()` | 수정 시각 |

### 4.2 제약 조건

- `status` 는 다음 세 값만 허용: `requested`, `in_progress`, `completed`
- `title` 은 빈 문자열 금지

## 5. DDL (Supabase / PostgreSQL)

```sql
create table embargo_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) > 0),
  description text,
  embargo_at timestamptz not null,
  status text not null default 'requested'
    check (status in ('requested', 'in_progress', 'completed')),
  pdf_sent boolean not null default false,
  tag text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_embargo_embargo_at on embargo_requests (embargo_at);
create index idx_embargo_status on embargo_requests (status);
```

## 6. 인덱스 전략

| 인덱스 | 대상 컬럼 | 목적 |
|---|---|---|
| `idx_embargo_embargo_at` | `embargo_at` | 날짜 필터 및 정렬 가속 |
| `idx_embargo_status` | `status` | 상태 필터 조회 가속 |

데이터 볼륨이 낮으므로 추가 인덱스는 불필요합니다.

## 7. 트리거 (updated_at 자동 갱신)

```sql
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_embargo_updated_at
before update on embargo_requests
for each row execute function set_updated_at();
```

## 8. 상태값 정의

| 값 | 표시명 | 의미 |
|---|---|---|
| `requested` | 요청됨 | 편집팀 요청 등록 완료 |
| `in_progress` | 진행중 | 제작팀/IT팀 처리 중 |
| `completed` | 완료 | PDF 발송 및 일정 확정 완료 |

## 9. 정규화 검토 (3NF)

- 1NF: 모든 컬럼이 원자값입니다.
- 2NF: 단일 PK(`id`) 기준, 부분 종속 없음.
- 3NF: 모든 비키 컬럼이 PK에 직접 종속, 이행 종속 없음.

`tag` 를 별도 테이블로 분리할 수 있으나 MVP 수준과 데이터 볼륨을 고려해 단일 문자열 컬럼으로 유지합니다.

## 10. 주요 쿼리 예시

### 10.1 오늘 엠바고 조회
```sql
select *
from embargo_requests
where embargo_at::date = current_date
order by embargo_at asc;
```

### 10.2 상태별 카운트
```sql
select status, count(*)
from embargo_requests
where embargo_at::date = current_date
group by status;
```

### 10.3 날짜 범위 필터
```sql
select *
from embargo_requests
where embargo_at between $1 and $2
order by embargo_at asc;
```

### 10.4 상태 변경
```sql
update embargo_requests
set status = $1
where id = $2;
```

## 11. 보안 설정 (Supabase RLS)

내부 단일 사용자 도구이며 민감 데이터가 없습니다. RLS는 비활성화합니다.

```sql
alter table embargo_requests disable row level security;
```

운영 환경에서 외부 노출이 필요할 경우 `anon` 키 공개를 막고 서버 환경변수로만 접근하도록 처리합니다.

## 12. 범위 외 항목

- 사용자 테이블
- 권한/역할 테이블
- 히스토리/감사 로그 테이블
- 첨부파일 스토리지 테이블

MVP 범위에서 제외합니다.