# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

지환의 개발자 포트폴리오 홈페이지. 빌드 도구 없는 순수 HTML/CSS/JS 정적 사이트로 GitHub Pages에서 호스팅됩니다.

- **라이브 주소**: https://jihwanqp1o.github.io
- **배포**: `git push` → GitHub Pages 자동 배포 (1~2분 소요)

## 배포

```powershell
cd "C:\Users\admin\Projects\portfolio"
git add .
git commit -m "커밋 메시지"
git push
```

## 파일 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 전체 페이지 구조 (섹션 순서: Hero → About → Projects → Skills → Footer) |
| `style.css` | CSS custom properties 기반 디자인 시스템 |
| `script.js` | 타이핑 애니메이션, 히어로 캔버스 도트 그리드, 스크롤 리빌 |

## 디자인 토큰 (style.css `:root`)

```css
--ground: #F7F8FA   /* 페이지 배경 */
--surface: #FFFFFF  /* 카드 배경 */
--text: #0D1117
--accent: #2563EB   /* 블루 강조색 */
--border: #E4E8EF
```

섹션 배경은 `section` (--ground) / `section-surface` (--surface) 교차 사용.

## 주요 내용

**프로젝트 카드** (`index.html` Projects 섹션)
- CONTAIN — Godot 탑뷰 로그라이크 공포 서바이벌. .exe 다운로드: GitHub Releases v0.1-prototype
- Avad — Next.js+Supabase 교회 악보/콘티 웹앱. 라이브: https://avadworship.vercel.app/
- Avad App — Capacitor 기반 Android 앱 (출시 예정)
- 대학 활동 & 대회

**연락처** — 푸터에 이메일(jihwanqp1o@gmail.com) + GitHub(@jihwanqp1o) 인라인 표시.

## 스크롤 리빌 대상

`script.js`의 `revealTargets` 배열에 selector 추가하면 새 섹션에도 페이드인 적용됨.

## 노션 연동 (프로젝트 카드)

- 프로젝트 카드 원본은 노션 DB "포트폴리오 프로젝트"(ID `cc84b497364143a99eabee9cc53a1fed`)입니다. `노출` 체크된 항목만 `정렬` 순으로 `index.html`의 `PROJECTS:START` ~ `PROJECTS:END` 사이에 생성됩니다.
- 생성 스크립트: `scripts/build-portfolio.mjs` (외부 의존성 없음, Node 20 이상).
- 워크플로: `.github/workflows/build-portfolio.yml` (수동 실행 `workflow_dispatch`). 필요한 시크릿은 `NOTION_TOKEN` 하나이며, 노션 인테그레이션을 해당 DB에 공유해야 합니다.
- `index.html`의 프로젝트 카드 부분은 직접 고치지 말고 노션에서 수정하십시오. 다음 빌드 때 덮어써집니다.
