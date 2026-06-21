# Meomun Backend API 명세서

프론트 구현용 요청/응답 JSON 중심 정리입니다.

## 공통 규칙

- 보호 API는 `Authorization: Bearer {accessToken}` 헤더를 사용합니다.
- 날짜/시간 문자열은 ISO 8601 형식입니다.
- 공통 에러 응답:

```json
{
  "message": "에러 메시지"
}
```

## Health

### GET /health

- 설명: 서버 상태 확인
- Auth: 불필요
- Status: `200 OK`

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "status": "ok"
}
```

Notes:
- 앱 시작 전 서버가 살아있는지 확인하는 용도.

## Auth

### POST /api/auth/kakao

- 설명: 카카오 로그인
- Auth: 불필요
- Status: `200 OK`

Request Body:

```json
{
  "kakaoAccessToken": "프론트가 카카오 SDK/OAuth로 받은 access token"
}
```

Response Body (200 OK):

```json
{
  "user": {
    "id": "user_01HY...",
    "nickname": "무문"
  },
  "accessToken": "meomun.jwt.access.token",
  "refreshToken": "meomun.jwt.refresh.token"
}
```

Notes:
- 이후 보호 API는 Authorization: Bearer {accessToken} 사용.

### POST /api/auth/apple

- 설명: 애플 로그인
- Auth: 불필요
- Status: `200 OK`

Request Body:

```json
{
  "identityToken": "apple.identity.token",
  "nonce": "random_nonce_used_by_frontend",
  "nickname": "무문"
}
```

Response Body (200 OK):

```json
{
  "user": {
    "id": "user_01HY...",
    "nickname": "무문"
  },
  "accessToken": "meomun.jwt.access.token",
  "refreshToken": "meomun.jwt.refresh.token"
}
```

Notes:
- nickname은 선택값.

### POST /api/auth/refresh

- 설명: 토큰 재발급
- Auth: 불필요
- Status: `200 OK`

Request Body:

```json
{
  "refreshToken": "meomun.jwt.refresh.token"
}
```

Response Body (200 OK):

```json
{
  "accessToken": "new.meomun.jwt.access.token",
  "refreshToken": "new.meomun.jwt.refresh.token"
}
```

Notes:
- accessToken 만료 시 호출.

### POST /api/auth/logout

- 설명: 로그아웃
- Auth: 불필요
- Status: `204 No Content`

Request Body:

```json
{
  "refreshToken": "meomun.jwt.refresh.token"
}
```

Response Body (204 No Content):

```json
응답 body 없음
```

Notes:
- 저장된 refreshToken을 무효화.

### DELETE /api/auth/delete_account

- 설명: 회원 탈퇴
- Auth: 불필요
- Status: `204 No Content`

Request Body:

```json
{
  "refreshToken": "meomun.jwt.refresh.token"
}
```

Response Body (204 No Content):

```json
응답 body 없음
```

Notes:
- 계정 삭제.

## Users

### GET /api/users/me

- 설명: 내 정보 조회
- Auth: 필수
- Status: `200 OK`

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "id": "user_01HY...",
  "nickname": "무문",
  "createdAt": "2026-06-17T12:00:00.000Z",
  "updatedAt": "2026-06-17T12:00:00.000Z"
}
```

Notes:
- Authorization 헤더 필요.

### PATCH /api/users/me

- 설명: 내 정보 수정
- Auth: 필수
- Status: `200 OK`

Request Body:

```json
{
  "nickname": "새닉네임"
}
```

Response Body (200 OK):

```json
{
  "id": "user_01HY...",
  "nickname": "새닉네임",
  "createdAt": "2026-06-17T12:00:00.000Z",
  "updatedAt": "2026-06-17T12:30:00.000Z"
}
```

Notes:
- nickname은 null 가능. 빈 문자열은 서비스에서 검증됨.

## Places

### GET /api/places/search

- 설명: 장소 검색
- Auth: 불필요
- Status: `200 OK`
- Query:

```json
{
  "query": "성수 카페",
  "page": 1,
  "size": 15
}
```

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "meta": {
    "totalCount": 45,
    "pageableCount": 45,
    "isEnd": false
  },
  "places": [
    {
      "kakaoPlaceId": "123456789",
      "placeName": "성수동 카페거리",
      "categoryName": "음식점 > 카페",
      "addressName": "서울 성동구 성수동2가 ...",
      "roadAddressName": "서울 성동구 ...",
      "longitude": "127.056",
      "latitude": "37.544"
    }
  ]
}
```

Notes:
- 카카오 로컬 API 결과를 프론트 선택용 장소 데이터로 변환.

## Uploads

### POST /api/uploads/presigned-urls

- 설명: S3 업로드 URL 발급
- Auth: 필수
- Status: `201 Created`

Request Body:

```json
{
  "files": [
    {
      "fileName": "photo1.webp",
      "contentType": "image/webp"
    },
    {
      "fileName": "photo2.jpg",
      "contentType": "image/jpeg"
    }
  ]
}
```

Response Body (201 Created):

```json
{
  "uploads": [
    {
      "objectKey": "records/user_01HY/550e8400-e29b-41d4-a716-446655440000.webp",
      "uploadUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
    }
  ]
}
```

Notes:
- 프론트는 uploadUrl로 S3 PUT 업로드.
- 업로드 성공 후 records create/update에 objectKey 배열을 전달.
- 최대 3장.

## Records

### POST /api/records

- 설명: 기록 생성
- Auth: 필수
- Status: `201 Created`

Request Body:

```json
{
  "title": "카페 창가 자리에서",
  "emotion": "CALM",
  "content": "오랜만에 혼자 카페에 왔어.",
  "recordedAt": "2026-06-17T12:15:00.000Z",
  "visibility": "PRIVATE",
  "place": {
    "kakaoPlaceId": "123456789",
    "placeName": "성수동 카페거리",
    "categoryName": "음식점 > 카페",
    "addressName": "서울 성동구 성수동2가 ...",
    "roadAddressName": "서울 성동구 ...",
    "longitude": "127.056",
    "latitude": "37.544"
  },
  "imageObjectKeys": [
    "records/user_01HY/uuid.webp"
  ]
}
```

Response Body (201 Created):

```json
{
  "id": "record_01HY...",
  "title": "카페 창가 자리에서",
  "emotion": "CALM",
  "content": "오랜만에 혼자 카페에 왔어.",
  "visibility": "PRIVATE",
  "recordedAt": "2026-06-17T12:15:00.000Z",
  "createdAt": "2026-06-17T12:20:30.000Z",
  "updatedAt": "2026-06-17T12:20:30.000Z",
  "place": {
    "id": "place_01HY...",
    "kakaoPlaceId": "123456789",
    "placeName": "성수동 카페거리",
    "categoryName": "음식점 > 카페",
    "addressName": "서울 성동구 성수동2가 ...",
    "roadAddressName": "서울 성동구 ...",
    "longitude": "127.056",
    "latitude": "37.544"
  },
  "images": [
    {
      "id": "image_01HY...",
      "objectKey": "records/user_01HY/uuid.webp",
      "sortOrder": 0,
      "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
    }
  ]
}
```

Notes:
- emotion enum: ANGRY | ANXIOUS | CALM | FLUTTER | HAPPY | REFLECTIVE | SAD | TIRED
- visibility enum: PRIVATE | ANONYMOUS

### GET /api/records

- 설명: 기록 목록 조회
- Auth: 필수
- Status: `200 OK`
- Query:

```json
{
  "limit": 20,
  "sort": "latest"
}
```

Request Body:

```json
없음
```

Response Body (200 OK):

```json
[
  {
    "id": "record_01HY...",
    "title": "카페 창가 자리에서",
    "emotion": "CALM",
    "content": "오랜만에 혼자 카페에 왔어.",
    "visibility": "PRIVATE",
    "recordedAt": "2026-06-17T12:15:00.000Z",
    "createdAt": "2026-06-17T12:20:30.000Z",
    "updatedAt": "2026-06-17T12:20:30.000Z",
    "place": {
      "id": "place_01HY...",
      "kakaoPlaceId": "123456789",
      "placeName": "성수동 카페거리",
      "categoryName": "음식점 > 카페",
      "addressName": "서울 성동구 성수동2가 ...",
      "roadAddressName": "서울 성동구 ...",
      "longitude": "127.056",
      "latitude": "37.544"
    },
    "images": [
      {
        "id": "image_01HY...",
        "objectKey": "records/user_01HY/uuid.webp",
        "sortOrder": 0,
        "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
      }
    ]
  }
]
```

Notes:
- sort: latest | oldest
- 현재 records 목록은 cursor 없이 limit 정렬 목록.

### GET /api/records/{recordId}

- 설명: 기록 상세 조회
- Auth: 필수
- Status: `200 OK`

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "id": "record_01HY...",
  "title": "카페 창가 자리에서",
  "emotion": "CALM",
  "content": "오랜만에 혼자 카페에 왔어.",
  "visibility": "PRIVATE",
  "recordedAt": "2026-06-17T12:15:00.000Z",
  "createdAt": "2026-06-17T12:20:30.000Z",
  "updatedAt": "2026-06-17T12:20:30.000Z",
  "place": {
    "id": "place_01HY...",
    "kakaoPlaceId": "123456789",
    "placeName": "성수동 카페거리",
    "categoryName": "음식점 > 카페",
    "addressName": "서울 성동구 성수동2가 ...",
    "roadAddressName": "서울 성동구 ...",
    "longitude": "127.056",
    "latitude": "37.544"
  },
  "images": [
    {
      "id": "image_01HY...",
      "objectKey": "records/user_01HY/uuid.webp",
      "sortOrder": 0,
      "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
    }
  ]
}
```

Notes:
- images[].imageUrl은 private S3 객체를 여는 presigned GET URL.

### PUT /api/records/{recordId}

- 설명: 기록 수정
- Auth: 필수
- Status: `200 OK`

Request Body:

```json
{
  "title": "수정된 제목",
  "emotion": "HAPPY",
  "content": "수정된 내용",
  "recordedAt": "2026-06-17T13:15:00.000Z",
  "visibility": "PRIVATE",
  "place": {
    "kakaoPlaceId": "123456789",
    "placeName": "성수동 카페거리",
    "categoryName": "음식점 > 카페",
    "addressName": "서울 성동구 성수동2가 ...",
    "roadAddressName": "서울 성동구 ...",
    "longitude": "127.056",
    "latitude": "37.544"
  },
  "imageObjectKeys": [
    "records/user_01HY/uuid.webp"
  ]
}
```

Response Body (200 OK):

```json
{
  "id": "record_01HY...",
  "title": "수정된 제목",
  "emotion": "HAPPY",
  "content": "오랜만에 혼자 카페에 왔어.",
  "visibility": "PRIVATE",
  "recordedAt": "2026-06-17T12:15:00.000Z",
  "createdAt": "2026-06-17T12:20:30.000Z",
  "updatedAt": "2026-06-17T12:20:30.000Z",
  "place": {
    "id": "place_01HY...",
    "kakaoPlaceId": "123456789",
    "placeName": "성수동 카페거리",
    "categoryName": "음식점 > 카페",
    "addressName": "서울 성동구 성수동2가 ...",
    "roadAddressName": "서울 성동구 ...",
    "longitude": "127.056",
    "latitude": "37.544"
  },
  "images": [
    {
      "id": "image_01HY...",
      "objectKey": "records/user_01HY/uuid.webp",
      "sortOrder": 0,
      "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
    }
  ]
}
```

Notes:
- PUT이므로 현재 타입 기준 주요 필드를 모두 보내는 방식.

### DELETE /api/records/{recordId}

- 설명: 기록 삭제
- Auth: 필수
- Status: `204 No Content`

Request Body:

```json
없음
```

Response Body (204 No Content):

```json
응답 body 없음
```

Notes:
- DB 기록 삭제. S3 객체 삭제는 별도 구현 여부 확인 필요.

## Archives

### GET /api/archives/all

- 설명: 전체 보관함
- Auth: 필수
- Status: `200 OK`
- Query:

```json
{
  "keyword": "카페",
  "sort": "latest",
  "limit": 20,
  "cursor": "record_01HY..."
}
```

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "stats": {
    "totalRecordCount": 92,
    "totalPlaceCount": 18,
    "mostRecordedEmotion": "CALM",
    "firstRecordedAt": "2024-03-12T09:00:00.000Z",
    "latestRecordedAt": "2026-06-17T12:15:00.000Z"
  },
  "records": [
    {
      "id": "record_01HY...",
      "title": "카페 창가 자리에서",
      "content": "오랜만에 혼자 카페에 왔어.",
      "emotion": "CALM",
      "placeName": "성수동 카페거리",
      "recordedAt": "2026-06-17T12:15:00.000Z",
      "thumbnailImage": {
        "objectKey": "records/user_01HY/uuid.webp",
        "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
      }
    }
  ],
  "nextCursor": "record_01HZ..."
}
```

Notes:
- 무한스크롤: 다음 요청에 nextCursor를 cursor로 전달.
- sort: latest | oldest

### GET /api/archives/monthly

- 설명: 월별 보관함
- Auth: 필수
- Status: `200 OK`
- Query:

```json
{
  "yearMonth": "2026-06",
  "keyword": "카페",
  "sort": "latest",
  "limit": 20,
  "cursor": "record_01HY..."
}
```

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "yearMonth": "2026-06",
  "emotionCounts": [
    {
      "emotion": "CALM",
      "recordCount": 10
    },
    {
      "emotion": "HAPPY",
      "recordCount": 4
    }
  ],
  "records": [
    {
      "id": "record_01HY...",
      "title": "카페 창가 자리에서",
      "emotion": "CALM",
      "placeName": "성수동 카페거리",
      "recordedAt": "2026-06-17T12:15:00.000Z",
      "thumbnailImage": {
        "objectKey": "records/user_01HY/uuid.webp",
        "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
      }
    }
  ],
  "nextCursor": "record_01HZ..."
}
```

Notes:
- yearMonth 필수, 형식 YYYY-MM.

### GET /api/archives/place-categories

- 설명: 장소 카테고리 보관함
- Auth: 필수
- Status: `200 OK`

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "stats": [
    {
      "category": "CAFE",
      "recordCount": 21
    },
    {
      "category": "HOME",
      "recordCount": 6
    }
  ],
  "categories": [
    {
      "category": "CAFE",
      "recordCount": 21,
      "mostRecordedEmotion": "CALM",
      "thumbnailImage": {
        "objectKey": "records/user_01HY/uuid.webp",
        "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
      }
    }
  ]
}
```

Notes:
- category enum: HOME | CAFE | FOOD | NATURE | CULTURE | SCHOOL | WORK | SHOPPING | STREET | OTHER
- 카카오 categoryName/placeName을 서버에서 앱 카테고리로 매핑.

### GET /api/archives/place-categories/{category}/records

- 설명: 장소 카테고리 상세 기록
- Auth: 필수
- Status: `200 OK`
- Query:

```json
{
  "keyword": "카페",
  "sort": "latest",
  "limit": 20,
  "cursor": "record_01HY..."
}
```

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "category": "CAFE",
  "records": [
    {
      "id": "record_01HY...",
      "title": "카페 창가 자리에서",
      "content": "오랜만에 혼자 카페에 왔어.",
      "emotion": "CALM",
      "placeName": "성수동 카페거리",
      "recordedAt": "2026-06-17T12:15:00.000Z",
      "thumbnailImage": {
        "objectKey": "records/user_01HY/uuid.webp",
        "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
      }
    }
  ],
  "nextCursor": "record_01HZ..."
}
```

Notes:
- category enum: HOME | CAFE | FOOD | NATURE | CULTURE | SCHOOL | WORK | SHOPPING | STREET | OTHER

### GET /api/archives/emotions

- 설명: 감정별 보관함
- Auth: 필수
- Status: `200 OK`

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "totalRecordCount": 92,
  "emotions": [
    {
      "emotion": "CALM",
      "recordCount": 30,
      "percentage": 32,
      "isMostRecorded": true
    },
    {
      "emotion": "HAPPY",
      "recordCount": 13,
      "percentage": 14,
      "isMostRecorded": false
    }
  ]
}
```

Notes:
- 도넛 그래프와 막대 그래프는 emotions 배열 기반으로 그림.

### GET /api/archives/emotions/{emotion}/records

- 설명: 감정별 상세 기록
- Auth: 필수
- Status: `200 OK`
- Query:

```json
{
  "keyword": "카페",
  "sort": "latest",
  "limit": 20,
  "cursor": "record_01HY..."
}
```

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "emotion": "CALM",
  "records": [
    {
      "id": "record_01HY...",
      "title": "카페 창가 자리에서",
      "content": "오랜만에 혼자 카페에 왔어.",
      "emotion": "CALM",
      "placeName": "성수동 카페거리",
      "recordedAt": "2026-06-17T12:15:00.000Z",
      "thumbnailImage": {
        "objectKey": "records/user_01HY/uuid.webp",
        "imageUrl": "https://meomun-record-images.s3.ap-northeast-2.amazonaws.com/..."
      }
    }
  ],
  "nextCursor": "record_01HZ..."
}
```

Notes:
- emotion enum: ANGRY | ANXIOUS | CALM | FLUTTER | HAPPY | REFLECTIVE | SAD | TIRED

## Stats

### GET /api/stats/monthly

- 설명: 월별 감정 통계
- Auth: 필수
- Status: `200 OK`
- Query:

```json
{
  "yearMonth": "2026-06"
}
```

Request Body:

```json
없음
```

Response Body (200 OK):

```json
{
  "yearMonth": "2026-06",
  "totalRecordCount": 92,
  "recordedDayCount": 21,
  "topEmotion": {
    "emotion": "CALM",
    "recordCount": 30,
    "percentage": 32
  },
  "emotionDistribution": [
    {
      "emotion": "CALM",
      "recordCount": 30,
      "percentage": 32
    },
    {
      "emotion": "HAPPY",
      "recordCount": 13,
      "percentage": 14
    }
  ],
  "calendar": [
    {
      "date": "2026-06-17",
      "emotions": [
        {
          "emotion": "CALM",
          "recordCount": 2,
          "percentage": 67
        }
      ],
      "dominantEmotion": "CALM",
      "recordCount": 3
    }
  ],
  "hourlyDistribution": [
    {
      "hour": 0,
      "recordCount": 1,
      "percentage": 1
    },
    {
      "hour": 23,
      "recordCount": 26,
      "percentage": 28
    }
  ],
  "peakHour": {
    "hour": 23,
    "recordCount": 26,
    "percentage": 28
  }
}
```

Notes:
- yearMonth 필수, 형식 YYYY-MM.
- calendar.date와 hourlyDistribution.hour는 KST 기준.
