import { Injectable } from '@nestjs/common';
import { hangulToLatexConverter, latexToHangulConverter } from './hangul-to-latex.converter';
import * as JSZip from 'jszip';

@Injectable()
export class HangulToLatexService {
    hangulToLatex(hangulEquation: string): string {
        try {
            return hangulToLatexConverter(hangulEquation);
        } catch (error) {
            // 변환 중 문제가 발생하면 원본을 반환하거나 예외 처리를 할 수 있음
            console.error('Hangul→LaTeX 변환 오류:', error);
            return hangulEquation;
        }
    }

    latexToHangul(latexEquation: string): string {
        try {
            return latexToHangulConverter(latexEquation);
        } catch (error) {
            console.error('LaTeX→Hangul 변환 오류:', error);
            return latexEquation;
        }
    }

    async parseHancomFile(fileName: string, buffer: Buffer): Promise<{ hangul: string; latex: string }[]> {
        try {
            let xml: string | undefined;
            if (fileName.endsWith('.hwpx')) {
                const zip = await JSZip.loadAsync(buffer);
                xml = await zip.file('Contents/section0.xml')?.async('string');
            } else if (fileName.endsWith('.hml') || fileName.endsWith('.xml')) {
                xml = buffer.toString('utf-8');
            } else {
                throw new Error('지원하지 않는 파일 형식입니다.');
            }
            if (!xml) return [];
            return this.extractEquations(xml);
        } catch (error) {
            console.error('파일 파싱 오류:', error);
            throw error;
        }
    }

    private extractEquations(xml: string): { hangul: string; latex: string }[] {
        const equations: { hangul: string; latex: string }[] = [];
        // "rm "로 시작하고 "="가 포함된 문장을 추출 (한글 수식)
        const matches = xml.match(/rm\s+.*?=\s+.*?(?=<|$)/gs);
        if (!matches) return [];

        for (const match of matches) {
            const hangul = match.trim();
            const latex = this.hangulToLatex(hangul);
            equations.push({ hangul, latex });
        }

        return equations;
    }
}