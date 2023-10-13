import { Exclude, Expose, Transform, classToPlain } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class BaseDBObject {
  // this will expose the _id field as a string
  // and will change the attribute name to `id`
  @Expose({ name: 'id' })
  @Transform(value => value.obj._id && value.obj._id.toString())
  @IsOptional()
  // tslint:disable-next-line: variable-name
  _id: any;

  @Exclude()
  @IsOptional()
  // tslint:disable-next-line: variable-name
  _v: any;

  toJSON() {
    return classToPlain(this);
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}