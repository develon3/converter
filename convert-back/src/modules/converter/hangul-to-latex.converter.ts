// 헬퍼: 주어진 시작 인덱스에서 대응하는 닫는 중괄호의 인덱스를 찾음
function findMatchingBrace(s: string, start: number): number {
    let count = 0;
    for (let i = start; i < s.length; i++) {
        if (s[i] === '{') count++;
        else if (s[i] === '}') {
            count--;
            if (count === 0) return i;
        }
    }
    return -1;
}

// ──────────────────────────────────────────────
// Hangul → LaTeX 변환
// ──────────────────────────────────────────────

/**
 * 한글의 { … } over { … } 구조를 재귀적으로 LaTeX의 \dfrac{ … }{ … } 구조로 변환.
 * 예: {{1} over {3}} → \dfrac{1}{3}
 */
function convertHangulOverToDfrac(text: string): string {
    let result = "";
    let i = 0;
    while (i < text.length) {
        if (text[i] === '{') {
            const end = findMatchingBrace(text, i);
            if (end === -1) {
                result += text[i++];
                continue;
            }
            const inner = text.substring(i + 1, end);
            let j = end + 1;
            while (j < text.length && /\s/.test(text[j])) { j++; }
            if (text.substr(j, 4) === "over") {
                j += 4;
                while (j < text.length && /\s/.test(text[j])) { j++; }
                if (text[j] === '{') {
                    const denEnd = findMatchingBrace(text, j);
                    const numContent = convertHangulOverToDfrac(inner).trim();
                    const denContent = convertHangulOverToDfrac(text.substring(j + 1, denEnd)).trim();
                    result += `\\dfrac{${numContent}}{${denContent}}`;
                    i = denEnd + 1;
                    continue;
                }
            }
            result += "{" + convertHangulOverToDfrac(inner) + "}";
            i = end + 1;
        } else {
            result += text[i++];
        }
    }
    return result;
}

/**
 * 한글 수식을 LaTeX 수식으로 변환
 */
export function hangulToLatexConverter(hangul: string): string {
    // 전처리: "rm " 제거 및 "{}{digit" 패턴 교정
    let str = hangul.replace(/^rm\s+/, '').replace(/\{\}\s*\{([0-9])/g, '_{$1');
    let latex = convertHangulOverToDfrac(str);
    latex = latex
        .replace(/TIMES/g, '\\times')
        .replace(/DIVIDE/g, '\\div')
        .replace(/LEFT \(/g, '\\left(')
        .replace(/RIGHT \)/g, '\\right)')
        .replace(/LEFT \[/g, '\\left[')
        .replace(/RIGHT \]/g, '\\right]')
        .replace(/INTEGRAL\s*_\{([^}]*)\}\s*\^\{([^}]*)\}/g, '\\int_{$1}^{$2}')
        .replace(/INTEGRAL/g, '\\int')
        .replace(/SUM\s*_\{([^}]*)\}\s*\^\{([^}]*)\}/g, '\\sum_{$1}^{$2}')
        .replace(/SUM/g, '\\sum')
        .replace(/√\{([^}]*)\}/g, '\\sqrt{$1}')
        .replace(/±/g, '\\pm')
        .replace(/∓/g, '\\mp')
        .replace(/<=/g, '\\leq')
        .replace(/>=/g, '\\geq')
        .replace(/≠/g, '\\neq')
        .replace(/≈/g, '\\approx')
        .replace(/→/g, '\\to')
        .replace(/∞/g, '\\infty')
        .replace(/∵/g, '\\because')
        .replace(/∴/g, '\\therefore')
        .replace(/log/g, '\\log')
        .replace(/ln/g, '\\ln')
        .replace(/sin/g, '\\sin')
        .replace(/cos/g, '\\cos')
        .replace(/tan/g, '\\tan')
        .replace(/lim/g, '\\lim');
    latex = latex.replace(/ +/g, ' ').trim();
    // 후처리: extra 빈 그룹 교정 (예: "{{3}" → "_{3}")
    latex = latex.replace(/\{\{\s*([0-9]+)\s*\}/g, '_{$1}');
    latex = latex.replace(/\{\{\}\s*/g, '{');

    return latex;
}

// ──────────────────────────────────────────────
// LaTeX → Hangul 변환
// ──────────────────────────────────────────────

/**
 * LaTeX의 \dfrac{ … }{ … } 구조를 재귀적으로 한글의 { … } over { … } 구조로 변환.
 * isNumerator: 분자이면 true, 분모이면 false (기본 false)
 * 예: \dfrac{1}{3} → {1} over {3}
 */
function convertDfracToHangul(text: string, isNumerator: boolean = false): string {
    let result = "";
    let i = 0;
    while (i < text.length) {
        if (text.substr(i, 6) === "\\dfrac") {
            i += 6;
            while (i < text.length && /\s/.test(text[i])) { i++; }
            if (text[i] === '{') {
                const numEnd = findMatchingBrace(text, i);
                let numContent = convertDfracToHangul(text.substring(i + 1, numEnd).trim(), true);
                // 분자의 경우: 결과가 언더스코어로 시작하면 extra 중괄호로 감싸서 두 겹으로 만듦
                if (isNumerator && numContent.charAt(0) === '_' && !numContent.startsWith('{{')) {
                    numContent = '{' + numContent + '}';
                }
                i = numEnd + 1;
                while (i < text.length && /\s/.test(text[i])) { i++; }
                if (text[i] === '{') {
                    const denEnd = findMatchingBrace(text, i);
                    let denContent = convertDfracToHangul(text.substring(i + 1, denEnd).trim(), false);
                    result += `{${numContent}} over {${denContent}}`;
                    i = denEnd + 1;
                    continue;
                } else {
                    result += `\\dfrac{${numContent}}`;
                    continue;
                }
            }
        } else if (text[i] === '{') {
            const end = findMatchingBrace(text, i);
            result += "{" + convertDfracToHangul(text.substring(i + 1, end).trim(), isNumerator) + "}";
            i = end + 1;
        } else {
            result += text[i++];
        }
    }
    return result;
}

/**
 * LaTeX 수식을 한글 수식으로 변환
 */
export function latexToHangulConverter(latex: string): string {
    // 전처리: LaTeX 입력에서 "{}{digit" 패턴을 "_{digit}"로 교정
    let pre = latex.replace(/\{\}\s*\{([0-9])/g, '_{$1');
    latex = pre
        .replace(/\\mathrm\s*{([^}]*)}/g, '$1')
        .replace(/{\\mathrm\s+([A-Za-z0-9]+)}/g, '$1');
    let hangul = convertDfracToHangul(latex, false);
    // 기호 및 함수 치환
    hangul = hangul
        .replace(/\\times/g, 'TIMES')
        .replace(/\\div/g, 'DIVIDE')
        .replace(/\\left\s*\(/g, 'LEFT (')
        .replace(/\\right\s*\)/g, 'RIGHT )')
        .replace(/\\left\s*\[/g, 'LEFT [')
        .replace(/\\right\s*\]/g, 'RIGHT ]')
        .replace(/\\int_?\{?([^}]*)\}?\^\{?([^}]*)\}?/g, 'INTEGRAL _{$1} ^{$2}')
        .replace(/\\int/g, 'INTEGRAL')
        .replace(/\\sum_?\{?([^}]*)\}?\^\{?([^}]*)\}?/g, 'SUM _{$1} ^{$2}')
        .replace(/\\sum/g, 'SUM')
        .replace(/\\sqrt\s*{([^}]*)}/g, '√{$1}')
        .replace(/\\pm/g, '±')
        .replace(/\\mp/g, '∓')
        .replace(/\\leq/g, '<=')
        .replace(/\\geq/g, '>=')
        .replace(/\\neq/g, '≠')
        .replace(/\\approx/g, '≈')
        .replace(/\\to/g, '→')
        .replace(/\\infty/g, '∞')
        .replace(/\\because/g, '∵')
        .replace(/\\therefore/g, '∴')
        .replace(/\\log/g, 'log')
        .replace(/\\ln/g, 'ln')
        .replace(/\\sin/g, 'sin')
        .replace(/\\cos/g, 'cos')
        .replace(/\\tan/g, 'tan')
        .replace(/\\lim/g, 'lim');

    console.log('hangul', hangul);
    hangul = hangul
        .replace(
            /TIMES\s+{?(_\{\d+\}\s*C\s*_\{\d+\}\s*TIMES\s*_\{\d+\}\s*C\s*\{\d+\})}?/g,
            (_, group) => `TIMES {{}${group}}`
        );
    hangul = hangul
        .replace(/over\s*{\s*_\{(\d+)\}\s*C\s*_\{(\d+)\}\s*}/g, 'over {{}{$1} C _{$2}}');

    return 'rm ' + hangul;
}
