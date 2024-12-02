# 🐥🧺 우리 아이 안전한 심부름 도우미 [초키] (chore+kids)

![image.png](./image.png)

## Index

#### &emsp; [➤ 프로젝트 소개](##-프로젝트-소개)<br>

#### &emsp; [➤ 개발 환경](##-개발-환경)<br>

#### &emsp; [➤ 기능 소개](##-기능-소개)<br>

#### &emsp; [➤ 산출물](##-산출물)<br>

#### &emsp; [➤ 팀 소개](##-팀-소개)<br>

## 프로젝트 소개

**아이들 심부름 도우미 서비스입니다.**

[심부름]

- 장보기 경로를 부모님이 자유롭게 등록할 수 있습니다.
- 등록한 경로뿐만 아니라 안전경로와 최단경로도 안내합니다.
- 아이의 실시간 위치를 확인하고 경로 이탈 시 보호자에게 알림이 갑니다.
- 상품 바코드 스캔 시 보호자가 설정한 장바구니 내 상품과 비교할 수 있습니다.
- 부모님은 아이가 실시간으로 담고 있는 장바구니를 바로 확인하고, 메시지를 통해 힌트를 줄 수 있습니다.
- 아이가 재활용 쓰레기를 촬영하면 AI를 통해 학습한 결과로 분류방법을 안내합니다.

[게이미피케이션]

- 아이는 미션을 수행하며 경험치를 얻고, 레벨업을 통해 동물 캐릭터를 뽑을 수 있습니다.
- 대표 캐릭터와 3가지의 모션을 통해 상호작용 할 수 있습니다.
- 뽑은 캐릭터는 도감에 기록되며 본인의 농장에서 뛰어 노는 모습을 볼 수 있습니다.결과로 분류방법을 안내합니다.

### 프로젝트 기간

**2024.10.14 ~ 2024.11.19 (총 5주)**

## 개발 환경

- BE : Java17, Spring boot 3,
- FE : React18, Typescript, Next.js
- AI: Python 3.10 Gunicorn 23.0.0, Flask 3.10, Pytorch 2.5.0
- DB: Postgre, Mongo DB, Redis, Elastic Search
- Infra: Ubuntu, Docker, Jenkins, Nginx
- Client: Unity 2021.3.24f1
- Script Language : C#

## 기능 소개

### 부모 홈

- **홈 화면**: 연동된 자녀의 목록을 확인할 수 있고, 장보기를 위한 경로를 생성하러 이동할 수 있습니다.
- **초대 코드 확인**: 자녀를 연동하기 위한 초대코드를 확인할 수 있습니다.

|                  홈 화면                  |                초대 코드 확인                 |
| :---------------------------------------: | :-------------------------------------------: |
| ![Home](https://i.imgur.com/nmvNJ1Z.jpeg) | ![Calendar](https://i.imgur.com/wnTSHCV.jpeg) |

### 아이 별 정보 화면

- **아이 정보 화면**: 아이의 상세 정보를 확인할 수 있고 부여한 심부름 목록을 확인할 수 있습니다.
- **알림 화면**: 아이가 심부름을 시작하거나 완료했을 때 알림을 확인할 수 있습니다.
- **심부름 기록 하기**: 아이가 완료한 심부름에 코멘트를 달고 앨범에 기록할 수 있습니다.
- **앨범 확인 하기**: 앨범에서 아이가 완료한 심부름 목록을 확인할 수 있습니다.

|               아이 정보 화면                |                  알림 화면                  |              심부름 부여 화면               |             앨범 확인하기             |
| :-----------------------------------------: | :-----------------------------------------: | :-----------------------------------------: | :-----------------------------------: |
| ![crew_1](https://i.imgur.com/wlgzwI5.jpeg) | ![crew_2](https://i.imgur.com/asqgNFf.jpeg) | ![crew_3](https://i.imgur.com/es0WLRf.jpeg) | ![](https://i.imgur.com/JOqdfXT.jpeg) |

### 장보기 부여 화면

- **경로 설정**: 아이가 가야할 목적지를 설정합니다.
- **물품 검색** : 장바구니에 담을 물품을 검색합니다.
- **장바구니 생성**: 아이가 사올 물품의 목록을 만들고 등록합니다.

|                   경로 설정                   |                 장바구니 생성                 |                 앨범 확인하기                 |
| :-------------------------------------------: | :-------------------------------------------: | :-------------------------------------------: |
| ![battle_1](https://i.imgur.com/oO98tyG.jpeg) | ![battle_3](https://i.imgur.com/MllRQby.jpeg) | ![battle_3](https://i.imgur.com/8TIKO51.jpeg) |

### 아이 메인 화면

- **대표 캐릭터 화면** : 대표 캐릭터의 모습과 상호작용이 가능합니다.
- **주변 아이들 확인** : 내 주변 아이들의 캐릭터를 확인할 수 있습니다.
- **내 농장 모습 보기** : 내가 획득한 캐릭터들이 돌아다니는 농장을 확인할 수 있습니다.

|                대표 캐릭터 화면                |                주변 아이들 확인                |               내 농장 모습 보기                |
| :--------------------------------------------: | :--------------------------------------------: | :--------------------------------------------: |
| ![profile_1](https://i.imgur.com/sCPB4Lg.jpeg) | ![profile_2](https://i.imgur.com/tlHdWsp.jpeg) | ![profile_3](https://i.imgur.com/eLyyk6E.jpeg) |

### 장보기 실행 화면

- **내 위치 확인**: 현재 위치를 바탕으로 지도위의 이동해야 할 경로, 방향, 예상 시간 등의 정보를 확인할 수 있습니다.
- **부모의 아이 위치 확인** : 부모가 아이가 현재 어디에 위치해 있는지 확인할 수 있습니다.
- **장보기 종료 화면**: 인증 사진을 촬영하고 장보기를 종료했음을 알릴 수 있습니다.

|                  내 위치 확인                  |             부모의 아이 위치 확인              |                장보기 종료 화면                |
| :--------------------------------------------: | :--------------------------------------------: | :--------------------------------------------: |
| ![profile_1](https://i.imgur.com/14RffGa.jpeg) | ![profile_2](https://i.imgur.com/5DWrD2k.jpeg) | ![profile_3](https://i.imgur.com/yQK27UK.jpeg) |

### 장바구니 담기 화면

- **장바구니 화면**: 장바구니에 어떤 물건이 담겨있는지 확인할 수 있습니다.
- **장바구니 물품 추가**: 장바구니에 담을 물품의 바코드를 인식시킬 수 있습니다.
- **장바구니 물품 추가 확인** : 물품 추가가 정확한지 재확인 하는 화면입니다.

|                 장바구니 화면                  |               장바구니 물품 추가               |            장바구니 물품 추가 확인            |
| :--------------------------------------------: | :--------------------------------------------: | :-------------------------------------------: |
| ![predict_1](https://i.imgur.com/MPExYBp.jpeg) | ![predict_2](https://i.imgur.com/cMtTqN5.jpeg) | ![IMG_7353](https://github.com/user-attachments/assets/6dc7501a-3700-4328-af93-3a28c1735c32) |

### 재활용

- **재활용 촬영** : 쓰레기를 촬영해 재활용 분류를 확인할 수 있습니다.
- **촬영 결과 화면** : 촬영한 결과를 보여주고 분류 결과를 확인할 수 있습니다.
- **재활용 종료 화면** : 인증 사진을 촬영하고 재활용을 종료했음을 알릴 수 있습니다.

|                   재활용 촬영                   |                 촬영 결과 화면                  |                재활용 종료 화면                 |
| :---------------------------------------------: | :---------------------------------------------: | :---------------------------------------------: |
| ![exercise_1](https://i.imgur.com/7WU9tAL.jpeg) | ![exercise_2](https://i.imgur.com/DL516qm.jpeg) | ![exercise_3](https://i.imgur.com/KPBr5PT.jpeg) |

## 산출물

### **[Notion](https://www.notion.so/11fde50b9fe481d39f91ced5f94ade24)**

### ERD

![ERD](https://github.com/user-attachments/assets/8fb9e036-8dd0-4878-8d8d-21bfd090dd5b)

### MongoDB Document Structure

### Architecture 구조도

![Architecture](https://i.imgur.com/eAnuFN5.png)

## 팀 소개

<table>
<thead>
<tr>
<th style="text-align: center;"><strong>김여준</strong></th>
<th style="text-align: center;"><strong>김민주</strong></th>
<th style="text-align: center;"><strong>김영빈</strong></th>
<th style="text-align: center;"><strong>박지응</strong></th>
<th style="text-align: center;"><strong>인호현</strong></th>
<th style="text-align: center;"><strong>최승필</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><a href="https://github.com/junjunclub"><img src="https://avatars.githubusercontent.com/u/151982401?v=4" height="150" width="150" style="max-width: 100%;"> <br> @junjunclub</a></td>
<td align="center"><a href="https://github.com/MINJOO-KIM"><img src="https://avatars.githubusercontent.com/u/64532143?v=4" height="150" width="150" style="max-width: 100%;"> <br> @MINJOO-KIM</a></td>
<td align="center"><a href="https://github.com/ybk1"><img src="https://avatars.githubusercontent.com/u/97382736?v=4" height="150" width="150" style="max-width: 100%;"> <br> @ybk1</a></td>
<td align="center"><a href="https://github.com/JiEung2"><img src="https://avatars.githubusercontent.com/u/127590064?v=4" height="150" width="150" style="max-width: 100%;"> <br> @JiEung2</a></td>
<td align="center"><a href="https://github.com/inhohyun"><img src="https://avatars.githubusercontent.com/u/96523102?v=4" height="150" width="150" style="max-width: 100%;"> <br> @inhohyun</a></td>
<td align="center"><a href="https://github.com/piilll"><img src="https://avatars.githubusercontent.com/u/156265354?v=4" height="150" width="150" style="max-width: 100%;"> <br> @piilll</a></td>
</tr>
<tr>
<td align="center"><b>팀장 | BE | UNITY</td>
<td align="center"><b>FE | DESIGN</td>
<td align="center"><b>BE | AI</td>
<td align="center"><b>BE | INFRA</td>
<td align="center"><b>FE | UNITY | QA</td>
<td align="center"><b>FE | DESIGN </td>
</tr>
</tbody>
</table>
