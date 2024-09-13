import { GraphQLError } from "graphql";

export const AuthenticationError = () => {
  const authErrorMessage = "*** you must be logged in ***";
  return new GraphQLError(authErrorMessage, {
    extensions: {
      code: "UNAUTHENTICATED"
    }
  })
}