import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );

    // 1. multipart (파일 업로드)
    await app.register(multipart, {
        limits: {
            fileSize: 50 * 1024 * 1024, // 최대 50MB까지 허용
        },
    });

    // 2. CORS 등록: 이걸 반드시 먼저 실행
    await app.register(cors, {
        origin: true,
        credentials: true,
    });

    await app.listen(3000, '0.0.0.0');
    console.log(`🚀 Server is running on http://localhost:3000`);
}
bootstrap();