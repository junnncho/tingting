본 폴더는 인프라 구성을 자동화하고 소스코드 화하는 것을 목표로 합니다.

# 쿠버네티스 인프라

### NodePort 설정 규칙

쿠버네티스 NodePort영역은 30000-32767 대역임.
NodePort는 30000번대 포트를 사용하며, 1)운영환경, 2)시스템, 3)서비스, 4)레플리카 순서를 이용하여 포트를 구성합니다.

1. 운영환경: debug-0, develop-1, main-2
2. 시스템: backend-1, frontend-2, redis-3, mongo-4 (0번은 리저브)
3. 서비스: tingting-0, localjobs-1, seniorlove-2 ... (10이 넘어가면 레플리카 번호를 5 더함.)
4. 레플리카: 0번(일반적으로 마스터), 1번, 2번...

예시) localjobs프로젝트의 mongo시스템의 develop환경의 0번 노드의 포트는 31430

# 소스 코드 관리
