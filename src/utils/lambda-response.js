function lambdaResponse({
  json,
  binary,
  statusCode,
  allowCORS = false,
  headers = {},
}) {
  const response = {
    statusCode,
    body: (() => {
      if (json) return JSON.stringify(json);
      if (binary) return binary;
      return '';
    })(),
    headers,
  };

  if (allowCORS) {
    response.headers = {
      ...response.headers,
      'Access-Control-Allow-Origin': '*',
    };
  }

  return response;
}

export function errorResponse(json) {
  return lambdaResponse({
    json,
    statusCode: 500,
  });
}

export function corsErrorResponse(json) {
  return lambdaResponse({
    json,
    statusCode: 500,
    allowCORS: true,
  });
}

export function successResponse(json) {
  return lambdaResponse({
    json,
    statusCode: 200,
  });
}

export function successResponseBinary(binary, headers) {
  return lambdaResponse({
    binary,
    statusCode: 200,
    headers,
  });
}

export function corsSuccessResponse(json) {
  return lambdaResponse({
    json,
    statusCode: 200,
    allowCORS: true,
  });
}
