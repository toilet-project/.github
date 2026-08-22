# 🚽 위치 기반 공중화장실 정보 공유 서비스 (Toilet Project)

> **공공데이터를 기반으로 사용자의 현재 위치 주변 공중화장실 정보를 빠르게 제공하고, 사용자 참여형 정보 공유 환경을 구축하는 서비스입니다.**

---

## 📦 레포지토리 구성 (Repositories)

| 구분 | Repository | Description | 바로가기 |
| :--- | :--- | :--- | :--- |
| **문서/기획** | **`docs`** | API 명세서, WBS, 프로젝트 요구사항 및 문서 | [📌 바로가기](https://github.com/toilet-project/docs) |
| **백엔드 API** | **`toilet-api`** | 메인 서비스 REST API 백엔드 서버 | [📌 바로가기](https://github.com/toilet-project/toilet-api) |
| **어드민 API** | **`toilet-admin-api`** | 관리자 전용 백엔드 API 서버 | [📌 바로가기](https://github.com/toilet-project/toilet-admin-api) |
| **배치** | **`toilet-batch`** | 공공데이터 수집 및 DB 동기화 Batch 서버 | [📌 바로가기](https://github.com/toilet-project/toilet-batch) |
| **프론트엔드** | **`toilet-web`** | 사용자/지도 기반 Web 프론트엔드 (React) | [📌 바로가기](https://github.com/toilet-project/toilet-web) |
| **조직 설정** | **`.github`** | Organization 프로필 및 공통 설정 | [📌 바로가기](https://github.com/toilet-project/.github) |

---

## 📌 1. 프로젝트 개요 (Overview)

* **프로젝트명**: 위치 기반 공중화장실 정보 공유 서비스
* **목표**:
  * 공공데이터를 활용한 정확한 위치 기반 공중화장실 데이터 제공
  * 최소 기능 제품(MVP) 구축 후, 사용자 편의 기능(Nice-To-Have) 단계별 확장
* **활용 공공데이터**: 행정안전부 `공중화장실정보 조회서비스` (승인 완료)

---

## 🎯 2. 주요 기능 (Features)

### 🚀 MVP (필수 구현 기능)
* **공공데이터 연동 & DB 구축**: 행정안전부 OpenAPI 연동 (위도/경도, 운영시간, 개방시간, 남녀공용 여부 등 수집)
* **위치 기반 화장실 검색 & 조회**:
  * 사용자 현재 위치(GPS) 기준 주변 화장실 목록 및 지도 핀 표시
  * 화장실 선택 시 상세 정보 제공 (주소, 운영시간, 기저귀 교환대 유무 등)

### ✨ Nice-To-Have (추후 확장 기능)
* **회원 관리**: Kakao / Google 소셜 로그인 지원
* **사용자 참여형 데이터 등록**: 민간 개방 화장실 직접 등록 요청 기능
* **커뮤니티 & 리뷰**: 화장실 청결도 평점 부여 및 사진 첨부 한 줄 리뷰 작성
* **기타 인프라/도메인**: 서비스 전용 커스텀 도메인 구입 및 HTTPS 적용

---

## 🛠️ 3. 기술 스택 & 개발 환경 (Tech Stack)

| 구분 | 기술 스택 |
| :--- | :--- |
| **Language** | Java 21 LTS (Eclipse Temurin) |
| **Framework** | Spring Boot 3.3.5, Spring Framework 6.1.13 |
| **ORM / Data** | JPA, QueryDSL, MySQL 8.0 |
| **Build & Tool** | Gradle, IntelliJ IDEA Ultimate |
| **Testing** | JUnit5, AssertJ, Mockito |
| **Infra & DevOps** | Docker, Nginx, Amazon S3, EC2, GitHub Actions, Jenkins |
| **Modeling & Tools**| ERDCloud, GitHub Projects |

---

## 🏛️ 4. 시스템 아키텍처 (Architecture v1.0)
![시스템 아키텍처](https://github.com/toilet-project/docs/blob/main/architecture.png?raw=true)


```text
[ Client ] ──► [ AWS EC2 (Nginx + React) ] ──► [ On-premises Server ]
  │                                               ├── [ Back1 (Spring Boot / Maven) ]
  └──► [ Amazon S3 ]                              ├── [ Batch (Spring Boot / Maven) ]
                                                  ├── [ Admin (Spring Boot / Maven) ]
                                                  └── [ DB (MySQL / H2) ]
