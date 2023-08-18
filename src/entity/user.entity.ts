import { Exclude, Expose, Transform } from 'class-transformer';
import { BaseDBObject } from './base.entity'

@Exclude()
export class UserEntity extends BaseDBObject {
  @Expose()
  public _id: string;

  @Expose()
  public username: string;

  @Expose()
  public about: string;

  @Expose()
  public avatar: string;
  
  @Expose()
  public banner?: string;

  constructor(partial: Partial<UserEntity>) {
    super()
    Object.assign(this, partial);
  }
}

@Exclude()
export class UserProfileEntity extends BaseDBObject {
  @Expose()
  public _id: string;

  @Expose()
  public username: string;

  @Expose()
  public email: string

  @Expose()
  public about: string

  @Expose()
  public age: number

  @Expose()
  public gender: string

  @Expose()
  public avatar: string;
  
  @Expose()
  public banner?: string;

  constructor(partial: Partial<UserEntity>) {
    super()
    Object.assign(this, partial);
  }
}