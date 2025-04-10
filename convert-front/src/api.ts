export async function uploadHwpFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    console.log('[REQ] file:', file);

    const res = await fetch('http://localhost:3000/equation/upload', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('[ERR]', errText);
        throw new Error('파일 업로드 실패');
    }

    // console.log('[RES] file:', res);
    const data = await res.json();
    console.log('[RES] parsed json:', data);
    return data.equations as { hangul: string; latex: string }[];
}

export async function convertLatexToHangul(latex: string): Promise<string> {
    console.log('[REQ] latexEquation:', latex);
    const res = await fetch('http://localhost:3000/equation/from-latex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latexEquation: latex }),
    });

    const data = await res.json();
    console.log('[RES] hangul:', data);
    return data.hangul as string;
}