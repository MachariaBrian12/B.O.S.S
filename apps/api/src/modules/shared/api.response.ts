export function success(data: any, message = 'OK') {
  return {
    success: true,
    message,
    data,
    error: null,
  };
}

export function fail(message = 'Error', data: any = null) {
  return {
    success: false,
    message,
    data,
    error: message,
  };
}
