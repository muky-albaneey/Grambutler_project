// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { S3 } from 'aws-sdk';
// import { v4 as uuid } from 'uuid';

// @Injectable()
// export class S3Service {
//   private s3: S3;
//   private bucketName = 'grambutlerteam';

//   constructor() {
//     this.s3 = new S3({
//       accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//       region: 'eu-north-1',
//       endpoint: 'https://grambutlerteam.s3.eu-north-1.amazonaws.com',
//     });
//   }

//   async uploadFile(file: Express.Multer.File): Promise<string> {
//     const key = `${Date.now()}-${uuid()}-${file.originalname}`; // Unique filename

//     const params = {
//       Bucket: this.bucketName,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//       ACL: 'public-read', // Public URL
//     };

//     try {
//       const uploadResult = await this.s3.upload(params).promise();
//       return uploadResult.Location; // Return file URL
//     } catch (error) {
//       console.error('Error uploading to S3:', error);
//       throw new InternalServerErrorException('File upload failed');
//     }
//   }
// }
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucketName = 'grambutlerteam';

  constructor() {
    this.s3 = new S3({
        accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'eu-north-1',
      endpoint: 'https://grambutlerteam.s3.eu-north-1.amazonaws.com',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${uuid()}-${file.originalname}`; // Unique filename

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Public URL
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      return uploadResult.Location; // Return file URL
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new InternalServerErrorException('File upload failed');
    }
  }
}
