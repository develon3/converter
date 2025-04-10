# HWP 수식 변환기 백엔드 (NestJS + Fastify)

이 프로젝트는 `.hml` 한글 문서의 수학 수식을 LaTeX으로 변환하거나, LaTeX 수식을 한글 스타일로 역변환하는 API 서버입니다.

## 기술 스택

- NestJS + Fastify
- TypeScript
- `@fastify/multipart` (파일 업로드)

---

##  설치 및 실행

```bash
cd convert-back
npm install
npm run build
npm run start:dev
```

## 테스트 실행
```bash
cd convert-back
npm install
npm run test
```