import * as XLSX from "xlsx";

export type ExportFormat = "xlsx" | "csv";

/**
 * Converts array of objects to XLSX or CSV buffer
 */
export function generateExport(
  data: Record<string, unknown>[],
  format: ExportFormat
): Buffer {
  // Flatten nested objects (misal: address.city → address_city)
  const flatData = data.map((row) => flattenObject(row));

  const worksheet = XLSX.utils.json_to_sheet(flatData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    return Buffer.from(csv, "utf-8");
  }

  // XLSX
  const xlsxBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });
  return xlsxBuffer;
}

/**
 * Flattens nested object: { a: { b: 1 } } → { a_b: 1 }
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        Object.assign(acc, flattenObject(value as Record<string, unknown>, newKey));
      } else if (Array.isArray(value)) {
        acc[newKey] = value.join(", ");
      } else {
        acc[newKey] = value;
      }

      return acc;
    },
    {} as Record<string, unknown>
  );
}