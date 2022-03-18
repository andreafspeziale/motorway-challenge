import { Response as ExpressResponse } from 'express'; // eslint-disable-line import/no-extraneous-dependencies

/* eslint-disable  @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-interface */
export interface Response<ResBody = any, Locals extends Record<string, any> = Record<string, any>>
  extends ExpressResponse<ResBody, Locals> {}
