# 급똥 🚽

<img src="images/geupddong-avatar.png" alt="급똥 아이콘" width="96" />

> 공공데이터 기반으로 **내 주변 공중화장실을 빠르게 찾는 지도 서비스**입니다.

🌐 **서비스**: [geupddong.com](https://geupddong.com)  
🔌 **Public API**: [api.geupddong.com](https://api.geupddong.com/api/health)

## 주요 기능

- 카카오맵 기반 지도 탐색과 장소 검색
- 현재 위치 기반 공중화장실 조회 및 거리 표시
- 지도 레벨에 따른 서버 클러스터링
- 화장실 상세 정보: 개방시간, 주소, 편의·안전시설, 관리기관

## 아키텍처 v2.0

![급똥 아키텍처 v2](https://raw.githubusercontent.com/toilet-project/docs/main/architecture-v2.svg)

- 외부 웹·API는 Cloudflare를 통해 HTTPS로 공개합니다.
- Mini PC(Ubuntu)에서 Docker로 API, Batch, Admin, MySQL을 운영하고 Nginx가 API를 프록시합니다.
- GitHub Actions → Docker Hub → SSH/Docker Compose로 서버 배포를 자동화합니다.

자세한 내용은 [아키텍처 v2 문서](https://github.com/toilet-project/docs/blob/main/architecture-v2.md)를 참고하세요.

## 저장소

| 역할 | 저장소 | 설명 |
| --- | --- | --- |
| 문서 | [docs](https://github.com/toilet-project/docs) | 요구사항, API/DB 명세, 아키텍처·운영 가이드 |
| 웹 | [toilet-web](https://github.com/toilet-project/toilet-web) | React + TypeScript + Kakao Maps 클라이언트 |
| Public API | [toilet-api](https://github.com/toilet-project/toilet-api) | Spring Boot REST API, 지도 조회·상세 조회 |
| Batch | [toilet-batch](https://github.com/toilet-project/toilet-batch) | 공공데이터 동기화 및 DB upsert |
| Admin API | [toilet-admin-api](https://github.com/toilet-project/toilet-admin-api) | 운영 데이터 관리 API |

## 기술 스택

`React` · `TypeScript` · `Kakao Maps` · `Java 21` · `Spring Boot` · `JPA` · `MySQL` · `Docker` · `Nginx` · `Cloudflare` · `GitHub Actions`
