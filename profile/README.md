<div align="center">

<img src="images/geupddong-avatar.png" alt="급똥 아이콘" width="108" />

# 급똥

### 급할 때, 내 주변 공중화장실을 가장 빠르게 찾는 지도 서비스

[![서비스 열기](https://img.shields.io/badge/서비스%20열기-geupddong.com-17683A?style=for-the-badge)](https://geupddong.com)
[![API 상태](https://img.shields.io/badge/API%20Health-정상%20확인-2E7D4F?style=for-the-badge)](https://api.geupddong.com/api/health)
[![프로젝트 문서](https://img.shields.io/badge/프로젝트%20문서-Docs-4F6F5D?style=for-the-badge)](https://github.com/toilet-project/docs)

공공데이터와 카카오맵을 연결해 위치 탐색부터 사용자 제보, 관리자 검토, 데이터 품질 개선까지 운영하는 서비스입니다.

</div>

## 서비스 소개

급똥은 현재 위치나 검색한 장소를 기준으로 가까운 공중화장실을 빠르게 찾도록 돕습니다. 지도 위에서 거리와 운영 정보를 확인하는 사용자 경험뿐 아니라, 공공데이터의 좌표 오류와 중복 위치를 제보·검토·이력 관리로 개선하는 운영 흐름까지 함께 구축했습니다.

| 서비스 | 주소 | 공개 범위 |
| --- | --- | --- |
| 사용자 웹 | [geupddong.com](https://geupddong.com) | 공개 HTTPS |
| Public API | [api.geupddong.com](https://api.geupddong.com/api/health) | 공개 조회·OAuth·사용자 API |
| 관리자 웹 | `admin.geupddong.com` | Cloudflare Access 승인 운영자 전용 |
| 개발 현황 | [Organization WBS](https://github.com/orgs/toilet-project/projects/2/views/1) | 작업 계획·체크리스트·완료 기록 |

## 주요 기능

### 사용자 경험

| 기능 | 설명 |
| --- | --- |
| 현재 위치·장소 검색 | GPS 또는 카카오 장소 검색을 기준점으로 가까운 화장실을 거리순으로 조회합니다. |
| 반응형 지도 탐색 | 모바일 카드·목록과 데스크탑 고정 목록을 제공하고, 축척에 따라 마커와 클러스터를 전환합니다. |
| 화장실 상세 정보 | 주소, 개방시간, 변기 수, 설치연월, 관리기관, 비상벨·CCTV·기저귀 교환대 정보를 제공합니다. |
| Google·Kakao 로그인 | OAuth 로그인 후 위치·개방시간 제보와 내 제보 이력 조회를 사용할 수 있습니다. |
| 사용자 제보·알림 | 지도에서 수정 위치와 도로명 주소를 확인해 제보하고, 승인·반려 결과를 사이트 알림으로 확인합니다. |

### 관리자와 데이터 운영

| 기능 | 설명 |
| --- | --- |
| 제보 검토 | 기존 위치와 제보 위치를 지도에서 비교하고, 승인 좌표를 보정해 승인하거나 반려합니다. |
| 배치 모니터링 | 매일 02:00 KST 증분 동기화의 수신·신규·수정·실패 건수와 이력을 조회합니다. |
| 데이터 품질 관리 | 동일 좌표로 묶인 화장실을 그룹별로 검토하고, 근거 없이 좌표를 추정하지 않고 직접 보정합니다. |
| 역할·감사 로그 | 관리자 권한 부여·회수와 제보 승인·반려·좌표 변경 행위를 검색 가능한 감사 기록으로 남깁니다. |
| 좌표 이력 보호 | 관리자 확정 좌표와 변경 전후 주소·좌표를 보존하며, 이후 자동 배치가 확정 좌표를 덮어쓰지 않습니다. |

## 해결한 핵심 문제

1. **넓은 지도 영역의 과도한 마커**

   지도 레벨에 따라 개별 마커와 서버 클러스터를 전환하고, 지나치게 넓은 영역에서는 상세 목록 대신 확대 안내를 제공해 렌더링 부담을 줄였습니다.

2. **공공데이터 좌표의 불완전성**

   최근 3일 갱신분만 수집하고 주소 변경·좌표 누락·지오코딩 실패 건을 선별 처리합니다. 동일 좌표 데이터는 사용자에게 묶어서 보여주고 관리자 검토 대상으로 관리합니다.

3. **자동 갱신과 수동 보정의 충돌**

   좌표 출처와 변경 이력을 분리해 `ADMIN_CONFIRMED` 좌표를 보호합니다. 사용자 제보 승인과 관리자 직접 보정은 모두 감사 가능한 이력으로 연결됩니다.

4. **공개 서비스와 관리자 기능의 보안 경계**

   사용자 API는 Spring Security와 역할 인가를 적용하고, 관리자 영역은 Cloudflare Access와 애플리케이션 `ADMIN` 역할을 함께 확인합니다. Refresh token 원문은 저장하지 않고 Redis에 해시와 TTL만 보관합니다.

## 저장소 구성

| 구분 | 저장소 | 책임 |
| --- | --- | --- |
| Web | [toilet-web](https://github.com/toilet-project/toilet-web) | React·TypeScript·Vite 기반 지도 웹, OAuth 진입, 제보·알림 UI |
| Public API | [toilet-api](https://github.com/toilet-project/toilet-api) | 지도·상세 조회, OAuth/JWT, 사용자 제보, 관리자 인가·감사 API |
| Admin API | [toilet-admin-api](https://github.com/toilet-project/toilet-admin-api) | 운영 대시보드, 배치 이력·집계 조회, 관리자 화면 지원 API |
| Batch | [toilet-batch](https://github.com/toilet-project/toilet-batch) | 공공데이터 증분 수집, 카카오 지오코딩, upsert·실행 이력 |
| Docs | [docs](https://github.com/toilet-project/docs) | 요구사항, API·DB 명세, 아키텍처, 보안·배포 운영 가이드 |

## 운영 아키텍처 v3.0

![급똥 운영 아키텍처 v3](https://raw.githubusercontent.com/toilet-project/docs/main/architecture/assets/architecture-v3.svg)

- 사용자 웹은 Cloudflare Pages에서 제공하고, API와 관리자 요청은 Cloudflare와 Mini PC의 Nginx를 거칩니다.
- Mini PC의 Docker 내부망에서 API·Admin·Batch·MySQL·Redis를 운영하며 MySQL·Redis·Batch는 외부에 노출하지 않습니다.
- Google·Kakao OAuth 로그인은 API가 처리하고, access JWT와 refresh session은 HttpOnly·Secure 쿠키와 Redis를 사용합니다.
- GitHub Actions가 빌드·정적 분석·Docker 이미지 배포를 수행하고, 배포 후 API·관리자 health와 배치 이력을 확인합니다.

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | React, TypeScript, Vite, Kakao Maps JavaScript SDK |
| Backend | Java 21, Spring Boot, Spring Security, OAuth2 Client/Resource Server, JPA, Flyway |
| Data | MySQL, Redis 7, 공공데이터포털 API, Kakao Local API |
| Infra | Cloudflare Pages·DNS·Access, Nginx, Docker Compose, Mini PC Ubuntu |
| Delivery | GitHub Actions, CodeQL, Docker Hub, SSH 기반 자동 배포 |

## 운영·보안 원칙

- 공개 웹·API는 HTTPS만 사용하며 관리자 웹은 Cloudflare Access와 `ADMIN` 역할로 이중 보호합니다.
- MySQL·Redis와 배치 서버는 Docker 내부 네트워크에서만 통신합니다.
- OAuth token, JWT·refresh token 원문, DB 비밀번호와 외부 API 키는 문서와 소스에 기록하지 않습니다.
- 애플리케이션 업무 시각과 배치는 `Asia/Seoul`을 기준으로 저장·표시합니다.
- 스키마 변경은 Flyway migration으로 적용하고, 주요 운영 행위는 감사 로그와 변경 이력으로 추적합니다.

## 문서 바로가기

| 문서 | 내용 |
| --- | --- |
| [운영 아키텍처 v3.0](https://github.com/toilet-project/docs/blob/main/architecture/architecture-v3.md) | 구성 요소, 데이터 흐름, 외부 공개·보안 경계 |
| [운영 데이터 모델 v1.6](https://github.com/toilet-project/docs/blob/main/database/database-schema-v1.6.md) | 인증·제보·좌표·알림·품질 검토·배치 테이블 관계 |
| [REST API 명세](https://github.com/toilet-project/docs/blob/main/api/toilet-api.md) | Public·User·Admin API 계약 |
| [인증·권한 정책](https://github.com/toilet-project/docs/blob/main/planning/authentication-authorization-design.md) | OAuth, JWT, Redis refresh session, USER/ADMIN 인가 |
| [중복 좌표 품질 관리](https://github.com/toilet-project/docs/blob/main/database/duplicate-coordinate-quality.md) | 동일 좌표 그룹 검토와 관리자 직접 보정 정책 |
| [배포·운영 가이드](https://github.com/toilet-project/docs/blob/main/operations/deployment.md) | HTTPS, CI/CD, 비밀정보, 정기 점검 기준 |
| [문서 변경 이력](https://github.com/toilet-project/docs/blob/main/changelog/CHANGELOG.md) | 아키텍처·스키마·운영 정책 버전 기록 |

---

<div align="center">

**위치를 찾는 기능에서 끝나지 않고, 사용자 제보와 운영 검토를 통해 데이터가 계속 좋아지는 서비스를 지향합니다.**

</div>
