export const createResponse = (lambda) => {
  return async (event, context) => {
    let body, statusCode;

    try {
      body = {
        data: await lambda(event, context),
      };
      statusCode = 200;
    } catch (e) {
      body = { error: e.message };
      statusCode = 500;
    }

    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
};
