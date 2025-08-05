// 공백 제거
export const removeWhitespace = (text: string) => {
  return text?.replace(/\s/g, '');
};

// 아이디 유효성 검사
export const validateAccountId = (id: string): string => {
  const trimmedId = removeWhitespace(id);
  if (!trimmedId) return '아이디를 입력해주세요.';
  if (trimmedId.length < 4) return '아이디는 4자 이상이어야 합니다.';
  if (!/^[a-zA-Z0-9]+$/.test(trimmedId)) return '아이디는 영문과 숫자만 입력 가능합니다.';
  return '';
};

// 비밀번호 유효성 검사
export const validatePassword = (password: string) => {
  const trimmedPassword = removeWhitespace(password);
  if (!trimmedPassword) return '비밀번호를 입력해주세요.';
  if (!/^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/.test(trimmedPassword)) {
    return '비밀번호는 8자 이상, 특수문자 1개 이상 포함해야 합니다.';
  }
  return '';
};

// 비밀번호 확인 검사
export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (password !== confirmPassword) return '비밀번호가 일치하지 않습니다.';
  return '';
};

// 닉네임 유효성 검사
export const validateNickname = (value: string): string => {
  const trimmedValue = removeWhitespace(value);
  const nicknameRegex = /^[가-힣a-zA-Z0-9]{4,12}$/;
  if (!trimmedValue) return '닉네임을 입력해주세요.';
  if (!nicknameRegex.test(trimmedValue)) return '한글/영문/숫자 조합 4자 이상 12자 이내로 입력해주세요.';
  return '';
};
