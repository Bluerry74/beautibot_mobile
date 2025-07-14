import color from "@/assets/Color";
import * as React from 'react';
import { DataTable } from 'react-native-paper';

type Column<T> = {
  colName: string;
  render: (record: T) => React.ReactNode;
  cellStyle?: import('react-native').ViewStyle;
  textStyle?: import('react-native').TextStyle;
};

type CustomTableProps<T> = {
  columns: Column<T>[];
  records: T[];
  onRowClick?: (record: T) => void;
};

export default function CustomTable<T>({
  columns,
  records,
  onRowClick,
}: CustomTableProps<T>) {
  return (
    <DataTable>
      {/* Header */}
      <DataTable.Header style={{ backgroundColor: color.primary }}>
        {columns.map((col, idx) => (
          <DataTable.Title
            key={idx}
            style={{ borderBottomWidth: 2, borderBottomColor: color.primary, ...(col.cellStyle || {}) }}
            textStyle={{ color: '#fff', fontWeight: 'bold', ...(col.textStyle || {}) }}
          >
            {col.colName}
          </DataTable.Title>
        ))}
      </DataTable.Header>

      {/* Body */}
      {records && records.length > 0 ? (
        records.map((record, rowIdx) => (
          <DataTable.Row
            key={rowIdx}
            onPress={() => onRowClick?.(record)}
            style={{ backgroundColor: rowIdx % 2 === 0 ? '#fff' : color.teritary, borderBottomWidth: 1, borderBottomColor: '#c2185b' }}
          >
            {columns.map((col, colIdx) => (
              <DataTable.Cell
                key={colIdx}
                style={col.cellStyle} // Thêm dòng này để nhận style từ column
              >
                {col.render(record)}
              </DataTable.Cell>
            ))}
          </DataTable.Row>
        ))
      ) : (
        <DataTable.Row>
          <DataTable.Cell style={{ justifyContent: 'center', flex: 1 }}>
            Không có dữ liệu
          </DataTable.Cell>
        </DataTable.Row>
      )}
    </DataTable>
  );
}
