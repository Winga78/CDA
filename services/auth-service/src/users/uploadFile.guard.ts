import { Injectable } from '@nestjs/common';

@Injectable()
export class FileValidationMiddleware {
  static fileFilter(req, file, callback) {
    // Vérification des types MIME autorisés
    if (!file.mimetype.match(/^image\/(jpeg|png)$/)) {
      return callback(new Error('Only JPEG, or PNG files are allowed.'));
    }
    callback(null, true);
  }

  static multerOptions = {
    fileFilter: FileValidationMiddleware.fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille à 5MB
  };
}
