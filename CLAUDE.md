# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

지환의 개발자 포트폴리오 홈페이지. 빌드 도구 없는 순수 HTML/CSS/JS 정적 사이트로 GitHub Pages에서 호스팅됩니다.

- **라이브 주소**: https://jihwanqp1o.github.io
- **배포**: `git push` → GitHub Pages 자동 배포 (1~2분 소요)

## 배포

```powershell
$git = "C:\Program Files\Git\cmd\git.exe"
cd "c:\Users\eldorado\OneDrive\Documents\my_homepage"
& $git add .
& $git commit -m "커밋 메시지"
& $git push
```

> `git`이 PowerShell PATH에 없으므로 반드시 전체 경로 사용.

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
- SLS_core — Next.js+Supabase 교회 악보/콘티 웹앱. 라이브: https://sls-core.vercel.app/
- SLS_core App — Capacitor 기반 Android 앱 (출시 예정)
- 대학 활동 & 대회

**연락처** — 푸터에 이메일(jihwanqp1o@gmail.com) + GitHub(@jihwanqp1o) 인라인 표시.

## 스크롤 리빌 대상

`script.js`의 `revealTargets` 배열에 selector 추가하면 새 섹션에도 페이드인 적용됨.
