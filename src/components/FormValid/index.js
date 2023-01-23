const CheckSpacing = (str) => {
  if (str[0] === " " || str[str.length - 1] === " ") {
    return false;
  }
  for (let index = 1; index < str.length - 2; index++) {
    if (str[index] === " ") {
      return false;
    }
  }
  return true;
};

export { CheckSpacing };
