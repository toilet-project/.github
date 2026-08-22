# 🚽 위치 기반 공중화장실 정보 공유 서비스 (Toilet Project)

> **공공데이터 기반의 빠르고 정확한 사용자 위치 맞춤형 공중화장실 공유 플랫폼**

<br/>

## 📦 레포지토리 구성 (Repositories)

| 구분 | Repository | Description | 바로가기 |
| :---: | :--- | :--- | :---: |
| **기획/문서** | **`docs`** | API 명세서, WBS, 프로젝트 요구사항 정의서 | [📌 바로가기](https://github.com/toilet-project/docs) |
| **메인 API** | **`toilet-api`** | 위치 기반 조회 및 커뮤니티 REST API 서버 | [📌 바로가기](https://github.com/toilet-project/toilet-api) |
| **어드민 API** | **`toilet-admin-api`** | 화장실 데이터 관리 및 사용자 요청 승인 서버 | [📌 바로가기](https://github.com/toilet-project/toilet-admin-api) |
| **배치** | **`toilet-batch`** | 공공데이터 매일 02시 자동 동기화(Upsert) 서버 | [📌 바로가기](https://github.com/toilet-project/toilet-batch) |
| **프론트엔드** | **`toilet-web`** | React + 카카오맵 SDK 기반 웹 클라이언트 | [📌 바로가기](https://github.com/toilet-project/toilet-web) |
| **조직 설정** | **`.github`** | Organization 프로필 및 공통 설정 문서 | [📌 바로가기](https://github.com/toilet-project/.github) |

<br/>

## 🛠️ Tech Stack

### Backend & Database
![Java](https://img.shields.io/badge/Java_21-007396?style=for-the-badge&logo=java&logoColor=white)
![SpringBoot](https://img.shields.io/badge/Spring_Boot_3.3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![SpringCloud](https://img.shields.io/badge/Spring_Cloud-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![JPA](https://img.shields.io/badge/JPA_/_QueryDSL-59666C?style=for-the-badge&logo=hibernate&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL_8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

### Frontend & Infra
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS_(EC2/S3)-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

<br/>

## 🚀 Key Features

* **공공데이터 연동 (행정안전부)**: 전국 공중화장실 OpenAPI 연동 및 매일 새벽 2시 자동 증분 업데이트
* **위치 기반 실시간 조회**: GPS 기반 현재 위치 주변 화장실 핀 표시 및 상세 정보(운영시간, 기저귀 교환대 등) 제공
* **확장 예정 (Nice-To-Have)**:
  * Kakao / Google 소셜 로그인
  * 사용자 제보 기반 민간 개방화장실 직접 등록 요청
  * 화장실 청결도 평점 및 사진 한 줄 리뷰

<br/>

## 🏛️ Architecture v1.0

![시스템 아키텍처](https://github.com/toilet-project/docs/blob/main/architecture.png?raw=true)


```text
[ Client ] ──► [ AWS EC2 (Nginx + React) ] ──► [ On-premises Server ]
  │                                               ├── [ Back1 (Spring Boot / Maven) ]
  └──► [ Amazon S3 ]                              ├── [ Batch (Spring Boot / Maven) ]
                                                  ├── [ Admin (Spring Boot / Maven) ]
                                                  └── [ DB (MySQL / H2) ]
