import { api } from '@/apis/axiosApi';

/**
 * 특정 사용자의 공개 프로필 정보 조회
 * @param {string} account - 조회할 사용자의 계정명
 * @returns {Promise} api Promise
 */
function getProfileInfo(account) {
  return api.get(`/profiles/info/${account}`);
}

/**
 * 현재 로그인한 사용자의 프로필 상세 정보 조회 (인증 필요)
 * GET: /profiles/detail/me
 * @returns {Promise} api Promise
 */
function getMyProfileDetail() {
  // api 인터셉터를 통해 JWT 토큰이 자동으로 헤더에 포함되어야 함
  return api.get("/profiles/detail/me");
}

/**
 * 특정 account를 가진 사용자의 프로필 상세 정보 조회
 * GET: /profiles/detail/{account}
 * @param {string} account - 조회할 사용자의 프로필 ID
 * @returns {Promise} api Promise
 */
function getAnotherProfileDetail(account) {
  return api.get(`/profiles/detail/${account}`);
}

/**
 * 프로필 텍스트 정보 업데이트 (인증 필요)
 * PUT: /profiles/update
 * @param {object} profileData - 업데이트할 프로필 데이터. 예: { nickname: "새 닉네임", intro: "..." }
 * @returns {Promise} api Promise
 */
function profileUpdate(profileData) {
  // 백엔드가 @PutMapping과 @RequestBody를 사용하므로 PUT 메소드로 JSON 데이터를 전송
  return api.put("/profiles/update", profileData);
}

/**
 * 프로필 이미지 업데이트 (인증 필요)
 * PUT: /profiles/update/image
 * @param {File} imageFile - 사용자가 업로드한 이미지 파일 객체
 * @returns {Promise} api Promise
 */
function profileUpdateImage(imageFile) {
  // 파일 업로드를 위해 FormData 객체 사용
  const formData = new FormData();
  // 백엔드의 @RequestParam("file")과 key 이름을 'file'로 일치시켜야 함
  formData.append('file', imageFile);

  // 백엔드가 @PutMapping을 사용하므로 PUT 메소드로 FormData를 전송
  return api.put("/profiles/update/image", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 최종적으로 사용할 API 함수들을 객체로 묶어 내보냅니다.
const profileApi = {
  getProfileInfo,
  getMyProfileDetail,
  getAnotherProfileDetail,
  profileUpdate,
  profileUpdateImage
};

export default profileApi;