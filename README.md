# The Messages subgraph

Hello and welcome to the `messages` subgraph: this is the starter code for the Summit 2024 workshop, **Realtime data across your graph with federated subscriptions**. We're happy you're here!

## What's `messages` all about?

In this workshop, we'll bring realtime data capabilities into our `messages` subgraph server.

`messages` is one of three subgraphs we'll investigate as part of building our workshop project, Airlock. Airlock is an intergalactic travel booking app that lets you view listings, make bookings, and (coming up shortly!) chat with hosts and ask questions.

In our time together, we will:

- Set up federated subscriptions, using the router and HTTP callbacks
- Configure the `Subscription` type, and define its resolver
- Utilize the `PubSub` class to both _publish_ and _subscribe_ to particular events
- Tackle a whole lot of optimizations for subscribing to data _across_ our graph!

So, let's get going!

## Prerequisites

To run this repository, you'll need Node and a terminal. As part of the workshop prereqs, you should already have [Rover](https://www.apollographql.com/docs/rover/) downloaded, along with the Router binary. (You'll also have created a graph in Studio, and published this and the other subgraph schemas!)

## Get started

1. First, set up the project by installing dependencies with `npm install`.
1. Next, launch the project with `npm run dev`!

As we proceed through the workshop, we'll install additional dependencies and walk through how to publish our schema changes to Studio.

### Using Prisma

This repository contains a database built with Prisma.

Run the following command to generate a migration that updates and seeds the database.

```
npx prisma migrate dev
```

We can also use **Prisma Studio** to inspect our database on a local port.

```
npx prisma studio
```

Then open up [http://localhost:5555](http://localhost:5555). This will allow you to browse the records in your database.

This will start us with four entries in the `User` table, and one entry in the `Conversation` table. By default, no messages have yet been sent in the conversation.

There is also a seed command in `package.json` that you can run to set up the database.

```
npm run db:seed
```
