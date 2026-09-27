# 급똥 · Hangul Point 원본 v1
작성일: 2026-09-27

선택한 초기 C / HANGUL POINT를 벡터로 재구성한 로고 원본 패키지입니다.
두 개의 둥근 ㄷ, 중앙 아래 원점, 오른쪽 아래 위치 포인트를 유지했습니다.
사용자가 확정한 공통 로고 원본입니다. 제품은 이 버전의 자산을 포함해서 배포하며, 실행 중 GitHub raw 주소에 의존하지 않습니다. 실제 적용 여부는 제품별 배포 기록을 따릅니다.

## 바로 볼 파일

- [전체 구성 미리보기](preview/brand-board.png)
- [밝은/어두운 배경 비교](preview/index.html)
- [작은 크기 확인](preview/small-size-check.png)

## 사용할 원본

| 파일 | 용도 |
|---|---|
| [symbol-green.svg](svg/symbol-green.svg) | 밝은 배경의 기본 심볼 |
| [symbol-white.svg](svg/symbol-white.svg) | 초록/어두운 배경 위 흰색 심볼 |
| [symbol-black.svg](svg/symbol-black.svg) | 단색 인쇄·흑백 |
| [symbol-currentcolor.svg](svg/symbol-currentcolor.svg) | 코드에서 inline SVG로 사용할 때 부모 색 적용 |
| [symbol-micro.svg](svg/symbol-micro.svg) | 16–32px 심볼용 간격 보정본 |
| [lockup-ko.svg](svg/lockup-ko.svg) | 심볼 + 한국어 급똥 |
| [lockup-en.svg](svg/lockup-en.svg) | 심볼 + 기존 GEUP / DDONG 영문 |
| [lockup-ko-white.svg](svg/lockup-ko-white.svg) / [lockup-en-white.svg](svg/lockup-en-white.svg) | 어두운 배경의 흰색 조합 |
| [app-icon-square.svg](svg/app-icon-square.svg) | 앱 아이콘용 배경 포함 정사각 벡터 |
| [app-icon-1024.png](png/app-icon-1024.png) | 배경 포함 1024×1024 불투명 RGB 앱 아이콘 원본 |
| [avatar-1080.png](png/avatar-1080.png) | 원형 잘림을 고려한 1080×1080 프로필 원본 |
| [favicon-micro.svg](svg/favicon-micro.svg) | 파비콘용 확대 배치·간격 보정 |
| png/favicon-16/24/32/48/64.png | 같은 파비콘 배치 규칙으로 생성한 크기별 PNG |

png/ 폴더에는 기본·흰색·검정 심볼과 한글/영문 조합의 실제 투명 PNG도 있습니다.
심볼 PNG는 1024×896으로 원본의 가로세로 비율을 유지합니다. 정사각형이 필요한 곳에는 앱/프로필 파일을 씁니다.

## 형태와 색

- 기본 심볼: #17683A
- 한글·영문 워드마크: #153B2B
- 반전: #FFFFFF / 단색: #000000
- 기본 심볼 viewBox: 0 0 256 224
- 두 상단 모듈은 폭과 윗선을 맞추고, 오른쪽에만 위치 포인트를 둡니다.
- 원점은 상단 두 모듈 사이의 중앙 아래에 있습니다.
- 원안 대비 중앙 간격과 곡선을 소폭 정돈한 벡터 재구성본입니다.
- 기본형과 소형형을 임의로 섞어 사용하지 않습니다.

## 언어 조합

한국어는 심볼 + 한글 급똥을 사용합니다.
영어·일본어·중국어 화면은 심볼 + 기존 영문 GEUP / DDONG을 사용합니다.
영문은 기존 앱/웹에서 사용하는 Jua Regular를 윤곽선으로 변환했습니다. 두 줄 좌측 정렬과 위/아래 자간을 유지했으며, 기존 웹의 약한 외곽선 효과를 반영했습니다.

한글 워드마크는 선택한 참고 이미지의 형태를 기준으로 직접 만든 벡터입니다.
배포용 SVG에는 실제 글자(text), 외부 폰트, 삽입 비트맵이 없어 폰트 설치 없이 형태가 유지됩니다.

## 크기·여백 규칙

- 일반 심볼: 48px 이상을 기본으로 합니다.
- 16–32px 독립 심볼: micro 버전을 사용합니다. 중앙 틈과 원점 위 간격을 넓혀 세 요소를 구분합니다.
- 33–47px: 실제 표시 환경에서 두 버전을 비교합니다.
- 파비콘 세트는 16–64px 모두 동일한 micro 배치입니다. 크기가 커졌을 때 심볼이 작아지는 급격한 여백 전환을 없앴습니다.
- 앱 아이콘은 파비콘보다 여백이 넓은 별도 원본을 사용합니다. 앱 원본과 파비콘 원본을 서로 바꿔 넣지 않습니다.
- 외부 콘텐츠와의 권장 여백은 최소 원점 지름의 절반입니다.
- 가로세로 비율을 늘리거나, 점을 이동하거나, 오른쪽 포인트만 따로 회전하지 않습니다.
- 앱 원본은 모서리를 미리 자르지 않은 정사각형입니다. 미리보기의 둥근 사각형/원형은 표시용 마스크입니다.
- Android adaptive foreground/background/monochrome, iOS 전용 생성물, touch/PWA 및 스토어 요구 형식 연결은 다음 앱/웹 적용 단계에서 처리합니다.

## 원본·재생성

실제 수정 기준은 source/ 안의 다음 4개 SVG입니다.

1. hangul-point-symbol.svg
2. hangul-point-micro.svg
3. wordmark-ko.svg
4. wordmark-en.svg

색상·조합·배치·PNG 생성 규칙은 source/build-brand.cjs에 있습니다.
Node.js와 sharp가 준비된 환경에서 패키지 폴더를 기준으로 다음을 실행합니다.

```text
node source/build-brand.cjs
node source/verify-brand.cjs
```

이 폴더에서 pnpm install --frozen-lockfile로 고정된 sharp 의존성을 설치한 뒤 pnpm build와 pnpm verify로 재생성·검증합니다.
영문 SVG를 폰트에서 다시 추출해야 할 때만 Windows System.Drawing과 source/outline-english.ps1을 사용합니다. -FontFile과 -OutputFile로 경로를 지정할 수 있습니다. 일반 자산 재생성에는 폰트 파일이 필요 없습니다.

## 검수 결과

- 기본 심볼과 파비콘 16/24/32/48/64px에서 두 모듈과 원점이 3개 요소로 분리되는지 래스터 임계값으로 확인했습니다.
- 심볼·조합 PNG의 투명 픽셀과 불투명 픽셀이 실제로 존재하는지 확인했습니다.
- 앱/프로필 PNG는 불투명 정사각 RGB로 확인했습니다.
- 배포용 SVG에 외부 폰트·이미지·네트워크 의존성이 없는지 확인했습니다.
- 사각형·원형 마스크, 한국어/영문 조합, 작은 크기를 시각 검토했습니다.
- 독립 검토에서 발견한 파비콘 32→48px 여백 불연속을 수정했습니다.
- 상세 결과: [qa-report.json](qa-report.json)
- 파일 크기·규격·SHA256: [brand-manifest.json](brand-manifest.json)

검수는 원본 파일과 렌더링 기준입니다. 운영 브라우저, 접근성 전체 흐름, 네이티브 앱 빌드·실기기 표시는 적용 단계에서 별도로 확인해야 합니다.

## 출처

- 디자인 기준: 사용자가 선택한 C / HANGUL POINT 참고 이미지. [보관본](reference/selected-design.png)
- 심볼·한글 워드마크: 참고 형태를 기준으로 새로 작성한 벡터.
- 영문 글리프: 기존 프로젝트의 Jua-Regular.ttf. Copyright 2018 The Jua Project Authors.
- [Jua OFL](licenses/Jua-OFL.txt)
- 영문 원본 폰트 SHA256: 769677AEF240BFC3B9965F2B50748075BFF885E6C6992FC591A3FB268279F898

참고 이미지 자체는 비교용이며, 배경 체크무늬·판넬 설명·Canva 표시는 배포용 로고에 포함되지 않습니다.
