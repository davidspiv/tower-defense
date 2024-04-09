const debounceLeading = (func, timeout = 100) => {
    let timer;
    return (...args) => {
        if (!timer) {
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = undefined;
        }, timeout);
    };
};
const diff = (num1, num2) => {
    if (num1 > num2) {
        return num1 - num2;
    }
    else {
        return num2 - num1;
    }
};
export { debounceLeading, diff };
