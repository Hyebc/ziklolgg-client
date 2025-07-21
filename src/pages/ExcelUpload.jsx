// src/pages/ExcelUpload.jsx
import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);

  const extractValidRows = (sheet) => {
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const startIndex = rows.findIndex(row => row.includes("대회명"));
    if (startIndex === -1) return [];

    const headers = rows[startIndex];
    const dataRows = rows.slice(startIndex + 1);

    return dataRows.map((row) => {
      const obj = {};
      headers.forEach((key, idx) => {
        obj[key] = row[idx];
      });

      return {
        대회명: obj['대회명'],
        챔피언: obj['챔피언'],
        결과: obj['결과'],
        K: Number(obj['K']).toFixed(2),
        D: Number(obj['D']).toFixed(2),
        A: Number(obj['A']).toFixed(2),
      };
    }).filter(row => row['챔피언']);
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const cleaned = extractValidRows(sheet);
      setPreviewData(cleaned);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert('파일을 먼저 선택해주세요.');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/matches/upload-excel', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
    alert('✅ 업로드 성공!');
    } else {
    const text = await res.text();
    try {
    const err = JSON.parse(text);
    alert(`❌ 업로드 실패: ${err.detail || '알 수 없는 오류'}`);
    } catch (e) {
    alert(`❌ 업로드 실패 (응답 파싱 오류): ${text}`);
    }
}

  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">📤 엑셀 전적 업로드</h2>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} />

      {previewData.length > 0 && (
        <>
          <p className="text-sm text-gray-600">미리보기 (최대 5개 행)</p>
          <table className="table-auto border w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key} className="border px-2 py-1">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((cell, j) => (
                    <td key={j} className="border px-2 py-1">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        onClick={handleUpload}
      >
        업로드
      </button>
    </div>
  );
}