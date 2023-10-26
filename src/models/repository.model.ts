import { ProviderEnum } from '../shared/enums';
import { registerEnumType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Repository {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  size: number;

  @Field({ nullable: true })
  ownerName: string;

  @Field({ nullable: true })
  private: boolean;
}

@ObjectType()
export class DetailedRepository extends Repository {
  @Field({ nullable: true })
  ymlFileContent: string;

  @Field({ nullable: true })
  numberOfFiles: number;

  @Field({ nullable: true })
  activeWebhooks: number;
}

registerEnumType(ProviderEnum, { name: 'Provider' });
