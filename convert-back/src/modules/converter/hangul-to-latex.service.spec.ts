import { Test, TestingModule } from '@nestjs/testing';
import { HangulToLatexService } from './hangul-to-latex.service';

describe('HangulToLatexService', () => {
    let service: HangulToLatexService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HangulToLatexService],
        }).compile();

        service = module.get<HangulToLatexService>(HangulToLatexService);
    });

    it('should convert hangul to latex', () => {
        const input = 'rm {{1} over {3} TIMES {1} over {3}}';
        const result = service.hangulToLatex(input);
        expect(result).toBe('\\mathrm{\\dfrac{1}{3} \\times \\dfrac{1}{3}}');
    });

    it('should convert latex to hangul', () => {
        const input = '\\mathrm{\\dfrac{1}{3} \\times \\dfrac{1}{3}}';
        const result = service.latexToHangul(input);
        expect(result).toBe('rm {{1} over {3} TIMES {1} over {3}}');
    });
});