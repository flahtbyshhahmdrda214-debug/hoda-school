export const successResponse = (reply, data, meta = null, statusCode = 200) => {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return reply.code(statusCode).send(body);
};

export const errorResponse = (reply, message, code = 'INTERNAL_ERROR', statusCode = 500) => {
  return reply.code(statusCode).send({
    success: false,
    error: {
      code,
      message
    }
  });
};
