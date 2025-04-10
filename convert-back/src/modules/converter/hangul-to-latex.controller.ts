import { Controller, Post, Body, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { HangulToLatexService } from './hangul-to-latex.service';

interface FastifyFileRequest extends FastifyRequest {
    file: () => Promise<MultipartFile>;
}

@Controller('equation')
export class HangulToLatexController {
    constructor(private readonly service: HangulToLatexService) {}

    @Post('upload')
    async upload(@Req() req: FastifyRequest) {
        console.log('upload 요청 수신');
        const fastifyReq = req as FastifyFileRequest;
        const mp = await fastifyReq.file();
        const buffer = await mp.toBuffer();
        const result = await this.service.parseHancomFile(mp.filename, buffer);
        return { equations: result };
    }

    @Post('from-latex')
    async fromLatex(@Body('latexEquation') latex: string) {
        console.log('from-latex 요청 수신:', latex);
        const hangul = this.service.latexToHangul(latex);
        return { hangul };
    }
}