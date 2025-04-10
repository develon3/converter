
export const EquationCard = ({ hangul, latex }: { hangul: string; latex: string }) => {
    return (
        <div className="border rounded p-4 mb-4 bg-white shadow">
            <div className="text-sm text-gray-600 mb-1">한글 수식</div>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap break-all">{hangul}</pre>

            <div className="text-sm text-gray-600 mt-3 mb-1">LaTeX</div>
            <pre className="bg-gray-100 p-2 rounded text-blue-700 whitespace-pre-wrap break-all">{latex}</pre>
        </div>
    );
};