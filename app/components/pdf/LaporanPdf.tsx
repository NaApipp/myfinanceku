import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#334155", // slate-700
  },
  header: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6", // blue-500
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b", // slate-800
  },
  periodText: {
    fontSize: 9,
    color: "#64748b", // slate-500
    marginTop: 4,
  },
  summary: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f8fafc", // slate-50
    borderRadius: 8,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    color: "#64748b",
  },
  summaryValue: {
    fontWeight: "bold",
    color: "#0f172a",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9", // slate-100
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#475569", // slate-600
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    padding: 8,
    alignItems: "center",
  },
  cell: {
    flex: 1,
  },
  right: {
    textAlign: "right",
  },
  logo: {
    width: 32,
    height: 32,
  },
});

type Props = {
  transaksi: any[];
  formattedIncome: string;
  formattedExpense: string;
  formattedBalance: string;
  formattedPeriod: string;
  logoUrl?: string;
};

export const LaporanPDF = ({
  transaksi,
  formattedIncome,
  formattedExpense,
  formattedBalance,
  formattedPeriod,
  logoUrl,
}: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {logoUrl && (
              <Image src={logoUrl} style={[styles.logo, { marginRight: 12 }]} />
            )}
            <View>
              <Text style={styles.title}>MyFinanceKu</Text>
              <Text style={styles.periodText}>{formattedPeriod}</Text>
            </View>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontWeight: "bold" }}>Laporan Transaksi</Text>
            <Text style={{ fontSize: 8, color: "#64748b" }}>Export PDF</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Pemasukan</Text>
            <Text style={[styles.summaryValue, { color: "#059669" }]}>
              {formattedIncome}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Pengeluaran</Text>
            <Text style={[styles.summaryValue, { color: "#dc2626" }]}>
              {formattedExpense}
            </Text>
          </View>
          <View
            style={[
              styles.summaryItem,
              { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#e2e8f0" },
            ]}
          >
            <Text style={[styles.summaryLabel, { fontWeight: "bold", color: "#0f172a" }]}>
              Saldo Akhir
            </Text>
            <Text style={[styles.summaryValue, { fontSize: 12 }]}>
              {formattedBalance}
            </Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Tanggal</Text>
          <Text style={styles.headerCell}>Tipe</Text>
          <Text style={styles.headerCell}>Kategori</Text>
          <Text style={styles.headerCell}>Keterangan</Text>
          <Text style={[styles.headerCell, styles.right]}>Nominal</Text>
        </View>

        {/* Table Body */}
        {transaksi.map((t, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cell}>{t.tanggal_transaksi}</Text>
            <Text style={[styles.cell, { color: t.type_transaksi === "pengeluaran" ? "#dc2626" : "#059669" }]}>
              {t.type_transaksi.charAt(0).toUpperCase() + t.type_transaksi.slice(1)}
            </Text>
            <Text style={styles.cell}>{t.nama_kategori}</Text>
            <Text style={[styles.cell, { fontSize: 8, color: "#64748b" }]}>
              {t.description || "-"}
            </Text>
            <Text style={[styles.cell, styles.right, { fontWeight: "bold" }]}>
              {t.nominal_transaksi}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 8, textAlign: "center" }}>
            Dicetak pada {new Date().toLocaleString("id-ID")} • FinanceKu App
          </Text>
        </View>
      </Page>
    </Document>
  );
};