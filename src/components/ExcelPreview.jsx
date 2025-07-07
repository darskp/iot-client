// ExcelPreview.js
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Table } from 'react-bootstrap';

const ExcelPreview = ({ fileId }) => {
  const [sheetData, setSheetData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExcel = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/file/${fileId}`);
        const blob = await res.blob();

        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          setSheetData(jsonData.slice(0, 5)); // Limit to 5 rows
        };
        reader.readAsArrayBuffer(blob);
      } catch (err) {
        console.error('Excel preview error:', err);
        setError('Unable to load Excel preview.');
      }
    };

    fetchExcel();
  }, [fileId]);

  if (error) return <div>{error}</div>;

  return (
    <div style={{ overflowX: 'auto', height: 260 }}>
      <Table bordered size="sm">
        <tbody>
          {sheetData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, i) => (
                <td key={i}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ExcelPreview;
