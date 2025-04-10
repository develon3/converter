import { Injectable } from '@nestjs/common';
import { hangulToLatexConverter, latexToHangulConverter } from './hangul-to-latex.converter';
import * as JSZip from 'jszip';

@Injectable()
export class HangulToLatexService {
    hangulToLatex(hangulEquation: string): string {
        return hangulToLatexConverter(hangulEquation);
    }

    latexToHangul(latexEquation: string): string {
        return latexToHangulConverter(latexEquation);
    }

    async parseHancomFile(fileName: string, buffer: Buffer): Promise<{ hangul: string; latex: string }[]> {
        if (fileName.endsWith('.hwpx')) {
            const zip = await JSZip.loadAsync(buffer);
            const xml = await zip.file('Contents/section0.xml')?.async('string');
            if (!xml) return [];
            return this.extractEquations(xml);
        }

        if (fileName.endsWith('.hml') || fileName.endsWith('.xml')) {
            const xml = buffer.toString('utf-8');
            return this.extractEquations(xml);
        }

        throw new Error('지원하지 않는 파일 형식입니다.');
    }

    private extractEquations(xml: string): { hangul: string; latex: string }[] {
        const equations: { hangul: string; latex: string }[] = [];
        const matches = xml.match(/rm\s+.*?=\s+.*?(?=<|$)/gs); // rm ... = ... 구조 수식만

        if (!matches) return [];

        for (const match of matches) {
            const hangul = match.trim();
            const latex = this.hangulToLatex(hangul);
            equations.push({ hangul, latex });
        }

        return equations;
    }
}