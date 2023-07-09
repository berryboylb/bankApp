export const generateAccountNumber = () =>
  new Date().getTime().toString().substring(0, 10);

export * from "./error";
export * from "./response"