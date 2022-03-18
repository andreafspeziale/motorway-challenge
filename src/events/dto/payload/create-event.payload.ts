import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { EventType } from '../../events.interfaces';

class EntityReference {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateEventPayload {
  @IsEnum(EventType, {
    message: `type must be a valid enum value: [${EventType.Entrance}, ${EventType.Exit}]`,
  })
  @IsNotEmpty()
  type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EntityReference)
  device: EntityReference;

  @IsObject()
  @ValidateNested()
  @Type(() => EntityReference)
  node: EntityReference;
}
