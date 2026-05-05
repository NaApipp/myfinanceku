import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  summary: {
    marginBottom: 20,
  },
  table: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    padding: 4,
  },
  cell: {
    flex: 1,
  },
  right: {
    textAlign: "right",
  },
});

type Props = {
  transaksi: any[];
  formattedIncome: string;
  formattedExpense: string;
  formattedBalance: string;
  formattedPeriod: string;
};

export const LaporanPDF = ({
  transaksi,
  formattedIncome,
  formattedExpense,
  formattedBalance,
  formattedPeriod,
}: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MyFinanceKu</Text>
          <View>
            <Text>Laporan Transaksi</Text>
            <Text>{formattedPeriod}</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text>Total Pemasukan: {formattedIncome}</Text>
          <Text>Total Pengeluaran: {formattedExpense}</Text>
          <Text>Saldo: {formattedBalance}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.row}>
          <Text style={styles.cell}>Tanggal</Text>
          <Text style={styles.cell}>Tipe</Text>
          <Text style={styles.cell}>Kategori</Text>
          <Text style={styles.cell}>Keterangan</Text>
          <Text style={[styles.cell, styles.right]}>Nominal</Text>
        </View>

        {/* Table Body */}
        {transaksi.map((t, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cell}>{t.tanggal_transaksi}</Text>
            <Text style={styles.cell}>{t.type_transaksi}</Text>
            <Text style={styles.cell}>{t.kategori}</Text>
            <Text style={styles.cell}>{t.description || "-"}</Text>
            <Text style={[styles.cell, styles.right]}>
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