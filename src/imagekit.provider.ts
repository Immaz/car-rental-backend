// src/imagekit.provider.ts
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

export const ImageKitProvider = {
  provide: 'IMAGEKIT',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new ImageKit({
      publicKey: configService.get('IMAGEKIT_PUBLIC_KEY') as any,
      privateKey: configService.get('IMAGEKIT_PRIVATE_KEY') as any,
      urlEndpoint: configService.get('IMAGEKIT_URL_ENDPOINT') as any,
    });
  },
};
