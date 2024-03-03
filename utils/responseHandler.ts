export const handleResponse = (response: any, bodyKey?: string) => {
  const body = JSON.parse(response.body);
  switch (response.status) {
    case 200:
      // If bodyKey is provided, return the corresponding value from the body
      // If not, return the whole body
      return bodyKey ? body[bodyKey] : body;
    case 400:
      throw new Error(`Bad request: ${body.error}`);
    case 401:
      throw new Error(`Unauthorized: ${body.error}`);
    case 404:
      throw new Error(`Not found: ${body.error}`);
    case 429:
      throw new Error(`Too many requests: ${body.error}`);
    case 500:
    case 503:
    case 504:
      throw new Error(`Server error: ${body.error}`);
    default:
      throw new Error(`Unknown error: ${body.error}`);
  }
};
