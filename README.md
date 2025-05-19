![메이플2](https://github.com/user-attachments/assets/4014d3bd-906f-4489-beef-95385bade8ee)


# 메이플스토리 이벤트 보상 시스템

마이크로서비스 아키텍처 기반의 백엔드 애플리케이션으로, 이벤트 관리와 보상 지급 기능을 제공합니다. <br/>
NestJS, MongoDB, Docker를 사용해 구축되었으며, Swagger를 통한 API 문서화가 포함되어 있습니다. <br/>
<br/>

## 🔧 기술 스택

- **언어:** TypeScript  
- **런타임:** Node.js v18  
- **프레임워크:** NestJS (최신)  
- **데이터베이스:** MongoDB (Mongoose)  
- **인증:** JWT (JSON Web Token)  
- **배포 및 실행:** Docker & docker-compose  <br/><br/>

## ⚙ 시스템 구성

| 서비스   | 역할                                                         |
| -------- | ------------------------------------------------------------ |
| Gateway  | 모든 요청 진입점, JWT 검증, 권한 검사, 각 마이크로서비스로 라우팅 |
| Auth     | 사용자 등록·로그인·역할 관리, JWT 발급 및 검증               |
| Event    | 이벤트 생성·조회·수정, 보상 정의, 사용자 보상 요청 처리 및 상태 저장 |

각 서비스는 독립적으로 컨테이너에서 실행됩니다.<br/><br/>

## 🗂️ MongoDB 컬렉션 구조

### users

- `_id` (ObjectId)  
- `loginId` (string, unique)  
- `password` (string, 해시 저장)  
- `nickname` (string)  
- `role` (enum: `USER`, `OPERATOR`, `AUDITOR`, `ADMIN`)  
- `userCode` (string, unique)  

### events

- `_id` (ObjectId)  
- `title` (string)  
- `description` (string)  
- `conditions` (string[])  
- `startDate` (Date)  
- `endDate` (Date)  
- `status` (enum: `ACTIVE`, `INACTIVE`, `ENDED`)  
- `eventCode` (string, unique)  

### reward_definitions

- `_id` (ObjectId)  
- `eventId` (ObjectId, events 참조)  
- `rewards` (배열 of `{ type, value, amount }`)  

### reward_requests

- `_id` (ObjectId)  
- `userId` (ObjectId, users 참조)  
- `eventId` (ObjectId, events 참조)  
- `status` (enum: `PENDING`, `REWARDED`, `FAILED`, `DUPLICATE`, `REJECTED`, `ABSENT`)  
- `requestedAt` (Date)  
- `rewardedAt` (Date)  

### counters

- 고유 코드 생성용 컬렉션  

### enhancements

- 사용자별 이벤트 상호작용 통계 (성공 횟수 등)  <br/><br/>

## 🚀 빠른 시작

1. 저장소 클론  
   ```bash
   git clone <repository-url>
   cd <project-folder>

2. wsl ubuntu 설치 후 실행
   ```bash
   wsl --install
   wsl -d ubuntu
3. docker 설치
   ```bash
   https://www.docker.com/
4. 서비스 실행
   ```bash
   docker compose up -d --build
5. 서비스 중지
   ```bash
   docker compose stop
6. 서비스 DB 초기화
   ```bash
   docker compose down -v

## 🎈 기본 이벤트 
- 10%의 확률로 무기 강화를 성공하는 기본 이벤트를 구성했습니다. <br/>
이벤트 기간 내에 3번 성공할 시 보상을 받을 수 있으며, 이벤트에 참여하지 않은 유저의 상태는 `ABSENT`<br/>
3번 이상 성공 후 요청한 유저의 상태는 `PENDING`, 3번 이상 성공 하지 못 하고 요청한 유저의 상태는 `FAILED`<br/>
요청을 2번 이상 중복 요청을 하는 경우 `DUPLICATE` 입니다.<br/>
이벤트 기간이 지나고, `PENDING`, `DUPLICATE` 상태의 유저들은 다시 한 번 조건 확인을 통해 `REWARDED`, `FAILED`로 변경합니다.<br/>
또한, 부정행위등을 통해 이벤트 관리자의 권한으로 `REJECTED`로 변경할 수 있습니다.<br/><br/>



## 📖 API 문서

- Notion에 작성된 상세 API 명세:  
  https://www.notion.so/1f4c5d88dec280db8cc0dd0d602db7b3?pvs=4  <br/>
- Swagger (OpenAPI) 문서:  
  `http://localhost:3000/api-docs` <br/><br/>

## ⚠️ 시간대 안내

모든 날짜(Date) 필드는 **UTC** 기준으로 저장 및 제공됩니다. <br/>
한국(Asia/Seoul) 시간보다 9시간 뒤처져 있으므로, 날짜를 입력하거나 조회시 유의해주시기 바랍니다.
