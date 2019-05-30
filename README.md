# Albus

> 개인 앨범을 만들고 디스플레이를 앨범 액자처럼 사용할 수 있는 시스템

# postgresql Table 생성

```$xslt
ts-node createTablePg.ts createUserTable

// 제거
ts-node createTablePg.ts dropTables {table_name}
```

# 요구 사항

- OAuth 구글 로그인
- 메인 페이지에 큰 이미지 슬라이드쇼 → 앨범 안의 이미지
- 계정마다 앨범을 만들 수 있음(사진 10장 이내)
- 그룹으로 사진을 올릴 수 있음 → 날짜, tag를 설정할 수 있음.
- ssr

# Stack

## 백엔드

- AWS Lambda
- Typescript
- Nodejs
- express
- Postgresql
- serverless

## 프런트

- react
- sass
- jest