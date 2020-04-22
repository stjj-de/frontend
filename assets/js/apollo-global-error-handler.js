function getErrorCodes(errors) {
  return errors.map(error => error.extensions.code);
}

const AUTHENTICATION_ERRORS = ["INVALID_AUTHENTICATION_TOKEN", "NOT_AUTHENTICATED"];

// This is not firing for every error, I think it's a bug
// eslint-disable-next-line import/no-default-export
export default function apolloGlobalErrorHandler({ networkError, graphQLErrors }, context) {
  const errors = graphQLErrors;
  if (networkError !== null) {
    errors.push(...networkError.result.errors);
  }

  const codes = getErrorCodes(errors);

  if (codes.some(code => AUTHENTICATION_ERRORS.includes(code))) {
    console.log("redirect");
    context.redirect("/login?logout=1&to=" + encodeURI(context.route.path));
  }
}
