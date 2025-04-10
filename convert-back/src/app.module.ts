import { Module } from '@nestjs/common';
import  {HangulToLatexModule} from './modules/converter/hangul-to-latex.module';

@Module({
    imports: [HangulToLatexModule],
})
export class AppModule {}