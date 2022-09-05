export const truncate = (input: string, length = 35) => input.length > length ? `${input.substring(0, length - 3)}...` : input;
