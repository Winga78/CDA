const isProd = process.env.NODE_ENV === 'production';

export const SERVICE_URLS = {
  user: isProd
    ? `${process.env.USER_SERVICE_BASE_URL}/users`
    : `${process.env.USER_SERVICE_BASE_URL}`,

  project: isProd
    ? `${process.env.PROJECT_SERVICE_BASE_URL}/projects`
    : `${process.env.PROJECT_SERVICE_BASE_URL}`,
};
