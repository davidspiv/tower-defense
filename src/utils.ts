const debounceLeading = (func, timeout: number = 100) => {
  let timer: number | undefined;
  return (...args: []) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
};

const diff = (num1: number, num2: number) => {
  if (num1 > num2) {
    return num1 - num2;
  } else {
    return num2 - num1;
  }
};

export { debounceLeading, diff };
