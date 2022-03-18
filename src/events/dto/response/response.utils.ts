import { Event } from '../../entities';
import { CreateEventResponse } from './create-event.response';

export const toCreateEventResponse = (event: Event): CreateEventResponse => ({
  id: event.id,
  type: event.type,
  device: {
    id: event.device.id,
  },
  node: {
    id: event.node.id,
  },
});
