import { Resolvers } from "../__generated__/resolvers-types";

export const User: Resolvers = {
  User: {
    __resolveReference: async ({ id, ...attributes }, { dataSources }) => {
      const user = await dataSources.db.getUserDetails(parseInt(id))
      return { ...attributes, ...user  }
    },
    isOnline: ({ isLoggedIn, lastActiveTime }) => {
      const now = Date.now();
      const lastActiveDate = new Date(lastActiveTime).getTime();
      const difference = now - lastActiveDate;

      if (isLoggedIn && difference < 300000) {
        return true;
      }

      return false;
    }
  }
}
