import { Module, Global } from '@nestjs/common';

// import { MinioService } from '@services/minio/minio.service';
import { TYPES } from './types';

// const storageProvider = {
//   provide: TYPES.IStorageService,
//   useClass: MinioService
// }
@Global()
// @Module({
  // providers: [storageProvider],
  // exports: [storageProvider]
// })
export class CommonModule { }
