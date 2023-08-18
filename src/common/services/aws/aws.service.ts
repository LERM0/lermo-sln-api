// import {
//   Injectable,
//   NotFoundException,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { fromBuffer } from 'file-type';

// import {
//   IStorageService,
//   UploadKey,
//   ResUploadFile,
// } from 'src/common/interfaces/storage.interface';

// @Injectable()
// export class AwsService {
//   public bucket: string;
//   public region: string;
//   public bucketURL: string;
//   public S3: any;
//   public ses: any;

//   constructor(
//     private readonly configService: ConfigService
//   ) {
//     this.S3 = new S3({
//       credentials: {
//         accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
//         secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
//       }
//     });
//     this.bucket = this.configService.get('S3_BUCKET_DOMAIN');
//     this.region = this.configService.get('AWS_REGION');
//     this.bucketURL = `https://${this.bucket}.s3.${this.region}.amazonaws.com`;
//     this.ses = new SES({
//       credentials: {
//         accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
//         secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
//       },
//       region: this.configService.get('AWS_REGION')
//     });
//   }

//   getUrl(URI: string): string {
//     return `${this.bucketURL}/${URI}`;
//   }

//   async uploadFile(
//     bufferFile: Buffer,
//     targetURI: string,
//     acl = 'private',
//   ): Promise<ResUploadFile> {
//     const srcType = await fromBuffer(bufferFile);
//     const { mime } = srcType;
//     const params = {
//       Body: bufferFile,
//       Bucket: this.bucket,
//       Key: targetURI,
//       ContentType: mime,
//       ACL: acl,
//     };

//     return this.S3.upload(params)
//       .promise()
//       .then(res => {
//         const { Key, Location } = res;
//         return { Key, Location };
//       })
//       .catch((err: any) => {
//         console.error(err);
//         const message = 'The image upload failed on the S3 bucket';
//         throw new InternalServerErrorException(message, err);
//       });
//   }

  // getLocationPath(key: string): string {
  //   let URI: string;

  //   switch (key) {
  //     case UploadKey.AVATAR:
  //       URI = `user-avatar`;
  //       break;
  //     case UploadKey.BANNER:
  //       URI = `user-banner`;
  //       break;
  //     case UploadKey.VIDEO_THUMBNAIL:
  //       URI = `video/thumbnail`;
  //       break;
  //     case UploadKey.VIDEO_SOURCE:
  //       URI = `video/source`;
  //     case UploadKey.POST_IMAGE:
  //       URI = `post/images`
  //       break;
  //     default:
  //       throw new NotFoundException('UploadKey unmatch.');
  //   }
  //   return URI;
  // }

//   async sendEmail(params: SendEmailRequest): Promise<SendEmailResponse> {
//     this.ses.sendEmail(params, (err: AWSError, data: SendEmailResponse) => {
//       if (err) {
//         console.log(err, err.stack);
//       }
//     });
//     return
//   }
// }
