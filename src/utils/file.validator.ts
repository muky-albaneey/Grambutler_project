import { HttpException, HttpStatus } from '@nestjs/common';

export const customFileFilter = (req, file, callback) => {
  let mimeTypes = [];
  switch (file.fieldname) {
    case 'pdf':
      mimeTypes = ['application/pdf'];
      break;
    case 'thumbnail':
      mimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      break;
    case 'image':
      mimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      break;
    default:
      callback(
        new HttpException(
          `Use a valid field name in your URL: '${file.fieldname}' is not valid`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
  }

  if (!mimeTypes.includes(file.mimetype)) {
    callback(
      new HttpException(
        `Upload not allowed. Upload only files of type: ${mimeTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      ),
    );
  }

  callback(null, true);
};

export const fileInterceptor = {
  // storage: diskStorage({
  //   destination: './uploads',
  //   filename: (req, file, callback) => {
  //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //     const fileExt = extname(file.originalname);
  //     callback(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
  //   },
  // }),
  fileFilter: customFileFilter, // Validate file type
  limits: { fileSize: 1024 * 1024 * 5 },
};
