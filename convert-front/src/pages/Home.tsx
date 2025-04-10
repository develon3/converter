import React, { useState } from 'react';
import { uploadHwpFile, convertLatexToHangul } from '../api';

export const Home = () => {
    const [equations, setEquations] = useState<{ hangul: string; latex: string }[]>([]);
    const [latexInput, setLatexInput] = useState('');
    const [convertedHangul, setConvertedHangul] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files);
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await uploadHwpFile(file);
        setEquations(result);
    };

    const handleLatexConvert = async () => {
        const result = await convertLatexToHangul(latexInput);
        setConvertedHangul(result);
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-start items-center pt-24 px-4 bg-gray-100 text-black">
            <h1 className="text-3xl font-bold mb-8 text-center">📄 HWP 수식 → LaTeX 변환기</h1>

            <input
                type="file"
                accept=".hml,.xml"
                onChange={handleFileChange}
                className="mb-10 block w-fit mx-auto bg-white text-black file:mr-4 file:py-2 file:px-6 file:rounded file:border-0 file:text-base file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />

            {equations.length > 0 && (
                <div className="w-full max-w-4xl mb-16 space-y-4">
                    <h2 className="text-xl font-semibold mb-2 text-center">📘 변환된 수식 목록</h2>
                    {equations.map((eq, idx) => (
                        <div key={idx} className="bg-white rounded shadow p-4">
                            <div className="mb-2">
                                <span className="text-sm text-gray-500">📌 한글 수식</span>
                                <pre className="whitespace-pre-wrap break-all">{eq.hangul}</pre>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">🧮 LaTeX 수식</span>
                                <pre className="whitespace-pre-wrap break-all text-blue-800">{eq.latex}</pre>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="w-full max-w-2xl bg-gray-50 p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4 text-center">🔁 LaTeX → 한글 수식 변환</h2>

                <textarea
                    placeholder="여기에 LaTeX 수식 입력"
                    value={latexInput}
                    onChange={(e) => setLatexInput(e.target.value)}
                    className="w-full h-32 p-4 mb-4 rounded border border-gray-300 bg-white"
                />

                <div className="flex justify-end">
                    <button
                        onClick={handleLatexConvert}
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        변환하기
                    </button>
                </div>

                {convertedHangul && (
                    <div className="mt-6 bg-white rounded p-4 shadow whitespace-pre-wrap break-all">
                        <div className="text-sm text-gray-500 mb-2">📝 한글 수식 결과</div>
                        <pre>{convertedHangul}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};