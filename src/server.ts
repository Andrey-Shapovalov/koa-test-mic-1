import Router from 'koa-router';
import Koa from 'koa';
import koaBody from 'koa-body';
require('dotenv').config();

import {
  UsersServiceClient,
  UsersServiceDefinition,
} from 'protorepo-users-typescript';
import {createChannel, createClient} from 'nice-grpc';

const router = new Router();
const app = new Koa();

app.use(koaBody());

const channel = createChannel(process.env.GRPC_USERS_SERVER as string);

const client: UsersServiceClient = createClient(
  UsersServiceDefinition,
  channel,
);

router.get("/", async (ctx, next) => {
  const response = await client.getAllUsers({limit: '1', offset: '1'});
  console.log(response);  

  ctx.body = response;
  await next();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3003, () => {
  console.log("Koa started 3003");
});
