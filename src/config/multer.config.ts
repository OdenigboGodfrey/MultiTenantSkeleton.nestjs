import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';

// Multer configuration
export const multerConfig = {
  dest: (() => process.env.UPLOAD_LOCATION)(),
  getMaxSize: () => {
    return process.env.MAX_FILE_SIZE;
  },
};

// Multer upload options
export const multerOptions = {
  // Enable file size limits
  //   limits: {
  //     fileSize: +multerConfig.getMaxSize(),
  //   },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    // if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    if (!['xlsx', 'csv', 'xls'].includes(extname(file.originalname))) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      const uploadPath = multerConfig.dest || process.env.UPLOAD_LOCATION;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(
        null,
        `${file.originalname}${randomUUID()}${extname(file.originalname)}`,
      );
    },
  }),
};
