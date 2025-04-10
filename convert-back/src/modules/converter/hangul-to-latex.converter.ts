export function hangulToLatexConverter(hangul: string): string {
    let latex = hangul;

    latex = latex
        .replace(/rm\s+/g, '') // rm 제거

        // MATRIX [1 , 2 ; 3 , 4] → \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}
        .replace(/MATRIX\s*\[(.*?)\]/g, (match, content) => {
            const rows = content.split(';')
                .map((row: string) => row.trim().split(',').join(' & '))
                .join(' \\ ');
            return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
        })

        // INTEGRAL _{a} ^{b} → \int_{a}^{b}
        .replace(/INTEGRAL\s*_\{([^}]*)\}\s*\^\{([^}]*)\}/g, '\\int_{$1}^{$2}')
        .replace(/INTEGRAL/g, '\\int')

        // SUM _{i} ^{n} → \sum_{i}^{n}
        .replace(/SUM\s*_\{([^}]*)\}\s*\^\{([^}]*)\}/g, '\\sum_{$1}^{$2}')
        .replace(/SUM/g, '\\sum')

        // 루트, 괄호
        .replace(/√\{([^}]*)\}/g, '\\sqrt{$1}')
        .replace(/LEFT \(/g, '\\left(')
        .replace(/RIGHT \)/g, '\\right)')
        .replace(/LEFT \[/g, '\\left[')
        .replace(/RIGHT \]/g, '\\right]')

        // 연산자
        .replace(/TIMES/g, '\\times')
        .replace(/DIVIDE/g, '\\div')

        // 기호
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

        // 함수
        .replace(/log/g, '\\log')
        .replace(/ln/g, '\\ln')
        .replace(/sin/g, '\\sin')
        .replace(/cos/g, '\\cos')
        .replace(/tan/g, '\\tan')
        .replace(/lim/g, '\\lim')

        // 조합: _{n} C _{r} → \binom{n}{r}
        .replace(/_\{([^}]*)\}\s*C\s*_\{([^}]*)\}/g, '\\binom{$1}{$2}')

        // 지수/첨자 보정
        .replace(/\^\{([^}]*)\}/g, '^{$1}')
        .replace(/_\{([^}]*)\}/g, '_{$1}')
        .replace(/\^([a-zA-Z0-9])/g, '^{$1}')
        .replace(/_([a-zA-Z0-9])/g, '_{$1}')

        .replace(/ +/g, ' ')
        .trim();

    return latex;
}

export function latexToHangulConverter(latex: string): string {
    // \mathrm{} 또는 {\mathrm X} 형태 제거 (중복 방지)
    latex = latex
        .replace(/\\mathrm\s*{([^}]*)}/g, '$1')
        .replace(/{\\mathrm\s+([A-Za-z0-9]+)}/g, '$1');

    let hangul = replaceDfracRecursively(latex); // 중첩된 \dfrac 처리

    hangul = hangul
        // \dfrac 남은 것 제거
        .replace(/\\dfrac/g, '')

        // 행렬 변환
        .replace(/\\begin{bmatrix}(.*?)\\end{bmatrix}/gs, (match, content) => {
            const rows = content.trim().split(/\\\\/g);
            const converted = rows
                .map((row: string) => row.trim().split('&').map(cell => cell.trim()).join(' , '))
                .join(' ; ');
            return `MATRIX [${converted}]`;
        })

        // 합계 및 적분
        .replace(/\\sum_?\{?([^}]*)\}?\^\{?([^}]*)\}?/g, 'SUM _{$1} ^{$2}')
        .replace(/\\sum/g, 'SUM')
        .replace(/\\int_?\{?([^}]*)\}?\^\{?([^}]*)\}?/g, 'INTEGRAL _{$1} ^{$2}')
        .replace(/\\int/g, 'INTEGRAL')

        // 괄호, 연산자
        .replace(/\\sqrt\s*{([^}]*)}/g, '√{$1}')
        .replace(/\\left\s*\(/g, 'LEFT (')
        .replace(/\\right\s*\)/g, 'RIGHT )')
        .replace(/\\left\s*\[/g, 'LEFT [')
        .replace(/\\right\s*\]/g, 'RIGHT ]')
        .replace(/\\times/g, 'TIMES')
        .replace(/\\cdot/g, 'TIMES')
        .replace(/\\div/g, 'DIVIDE')

        // 기호
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

        // 함수
        .replace(/\\log/g, 'log')
        .replace(/\\ln/g, 'ln')
        .replace(/\\sin/g, 'sin')
        .replace(/\\cos/g, 'cos')
        .replace(/\\tan/g, 'tan')
        .replace(/\\lim/g, 'lim')

        // 조합
        .replace(/\\binom\s*{([^}]*)}\s*{([^}]*)}/g, '_{$1} C _{$2}')

        // 지수 첨자
        .replace(/\^\s*{([^}]*)}/g, '^{$1}')
        .replace(/_\s*{([^}]*)}/g, '_{$1}')
        .replace(/\^([a-zA-Z0-9])/g, '^{$1}')
        .replace(/_([a-zA-Z0-9])/g, '_{$1}')

        .replace(/ +/g, ' ')
        .trim();

    return 'rm ' + hangul;
}

function replaceDfracRecursively(expr: string): string {
    const regex = /\\dfrac\s*{([^{}]*)}\s*{([^{}]*)}/g;

    while (regex.test(expr)) {
        expr = expr.replace(regex, (_, numerator, denominator) => {
            const cleanedNumerator = numerator
                .replace(/\\mathrm\s*{([^}]*)}/g, '$1')
                .replace(/{\\mathrm\s+([A-Za-z0-9]+)}/g, '$1');
            const cleanedDenominator = denominator
                .replace(/\\mathrm\s*{([^}]*)}/g, '$1')
                .replace(/{\\mathrm\s+([A-Za-z0-9]+)}/g, '{$1}');

            return `{${replaceDfracRecursively(cleanedNumerator)}} over {${replaceDfracRecursively(cleanedDenominator)}}`;
        });
    }

    return expr;
}