import { PrismaDbClient } from "../datasources/prisma/client"
import { PubSub } from "graphql-subscriptions";

// This interface is used with graphql-codegen to generate types for resolvers context
export interface DataSourceContext {
  userId: string;
  pubsub: PubSub;
  dataSources: {
    db: PrismaDbClient;
  }
}
