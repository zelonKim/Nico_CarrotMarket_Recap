export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MIN_LENGTH_ERROR = "비밀번호는 최소 6자리 이상이어야 합니다.";

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*\d)(?=.*?[~!@#$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "비밀번호는 반드시 영문자, 숫자, 특수기호를 포함해야 합니다.";
