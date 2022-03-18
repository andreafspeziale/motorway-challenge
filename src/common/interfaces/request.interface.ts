import { Request as ExpressRequest } from 'express'; // eslint-disable-line import/no-extraneous-dependencies
import * as core from 'express-serve-static-core'; // eslint-disable-line import/no-extraneous-dependencies

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Request<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query,
  Locals extends Record<string, any> = Record<string, any>
> = ExpressRequest<P, ResBody, ReqBody, ReqQuery, Locals>;
