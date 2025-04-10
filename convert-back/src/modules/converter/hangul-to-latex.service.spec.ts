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

    it('should convert hangul to latex (complex example)', () => {
        const input = 'rm {{1} over {3} TIMES {1} over {3}} over {{1} over {3} TIMES {1} over {3} + LEFT ( {2} over {3} TIMES {{}_{2} C _{1} TIMES _{1} C {1}} over {{}{3} C _{2}} RIGHT )} = {1} over {5}';
        const result = service.hangulToLatex(input);
        expect(result).toBe(
            '\\dfrac{\\dfrac{1}{3} \\times \\dfrac{1}{3}}{\\dfrac{1}{3} \\times \\dfrac{1}{3} + \\left( \\dfrac{2}{3} \\times \\dfrac{_{2} C _{1} \\times _{1} C {1}}{_{3} C _{2}} \\right)} = \\dfrac{1}{5}'
        );
    });

    it('should convert latex to hangul (complex example)', () => {
        const input = '\\dfrac{\\dfrac{ 1 }{ 3 } \\times \\dfrac{ 1 }{ 3 }}{\\dfrac{ 1 }{ 3 } \\times \\dfrac{ 1 }{ 3 } + \\left( \\dfrac{ 2 }{ 3 } \\times \\dfrac{ _{ 2 } C _{ 1 } \\times _{ 1 } C { 1 } }{ _{ 3 } C _{ 2 } } \\right )} = \\dfrac{ 1 }{ 5 }';
        const result = service.latexToHangul(input);
        expect(result).toBe(
            'rm {{1} over {3} TIMES {1} over {3}} over {{1} over {3} TIMES {1} over {3} + LEFT ( {2} over {3} TIMES {{}_{2} C _{1} TIMES _{1} C {1}} over {{}{3} C _{2}} RIGHT )} = {1} over {5}'
        );
    });
});