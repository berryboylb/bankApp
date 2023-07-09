import AppError from "./error";
export const response = (
  status: "success" | "error" | string,
  title: string,
  message: string,
  code?: number,
  data?: any,
  meta?: any
) => {
  return {
    status,
    title,
    message,
    code,
    data,
    meta,
  };
};

export const success = (
  data: any,
  title: string,
  message: string,
  code: number,
  meta?: any
) => {
  return response("success", title, message, code, data, meta);
};

export const error = (title: string, message: string, code = 400) => {
  const res = response("error", title, message, code, null);
  throw new AppError(code, message, res);
};
