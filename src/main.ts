import * as trpc from '@trpc/server';
import { z } from 'zod';
import { getUser } from './models';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import express from 'express';
import cors from 'cors';

let count = 0;

const apiRouter = trpc
  .router()
  .query('index', {
    async resolve(req) {
      return count;
    },
  })
  .query('getUser', {
    input: z.number(),
    async resolve(req) {
      req.input;
      console.log(req.input);
      return getUser(req.input, 'Returned while rendering on server.');
    },
  })
  .mutation('createUser', {
    input: z.object({ name: z.string().min(5) }),
    async resolve(req) {
      count += 1;
      console.log(`Count: ${count}`);
      return getUser(count, req.input.name);
    },
  });

const app = express();
app.use(express.json());
app.use(cors({}));
// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = trpc.inferAsyncReturnType<typeof createContext>;

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: apiRouter,
    createContext,
  })
);

app.listen(4000);

export type AppRouter = typeof apiRouter;

export default createHTTPHandler({
  router: apiRouter,
  createContext: () => null,
});
