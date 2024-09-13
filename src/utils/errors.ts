import { GraphQLError } from "graphql";

export const AuthenticationError = () => {
  const authErrorMessage = "*** you must be logged in ***";
  return new GraphQLError(authErrorMessage, {
    extensions: {
      code: "UNAUTHENTICATED"
    }
  })
}

export const NotFoundError = () => {
  const notFoundMessage = "One or more requested records could not be found";
  return new GraphQLError(notFoundMessage, {
    extensions: {
      code: "NOT FOUND"
    }
  })
}