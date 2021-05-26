export const createResponse = (fn) => {
  return async (event, context) => {
    let body, statusCode;

    try {
      body = {
        data: await fn(event, context),
      };
      statusCode = 200;
    } catch (e) {
      body = { error: e.message };
      statusCode = 500;
    }

    return {
      statusCode,
      body: JSON.stringify(body),
    };
  };
};
