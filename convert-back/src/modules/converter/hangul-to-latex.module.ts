import { Module } from '@nestjs/common';
import { HangulToLatexController } from './hangul-to-latex.controller';
import { HangulToLatexService } from './hangul-to-latex.service';

@Module({
    controllers: [HangulToLatexController],
    providers: [HangulToLatexService],
})
export class HangulToLatexModule {}