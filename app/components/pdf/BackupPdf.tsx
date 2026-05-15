import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#334155", // slate-700
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6", // blue-500
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b", // slate-800
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3b82f6",
    marginTop: 15,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    paddingLeft: 8,
  },
  section: {
    marginBottom: 15,
  },
  infoBox: {
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gridItem: {
    width: "48%",
    marginBottom: 8,
  },
  label: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#475569",
    fontSize: 9,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    padding: 6,
    alignItems: "center",
  },
  cell: {
    flex: 1,
    fontSize: 8,
  },
  empty: {
    padding: 10,
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
  },
});

type Props = {
  user: {
    full_name: string;
    email: string;
    username: string;
    no_hp: string;
  };
  transaksi: any[];
  target: any[];
  category: any[];
  anggaran: any[];
  accounts: any[];
};

export const BackupPdf = ({
  user,
  transaksi,
  target,
  category,
  anggaran,
  accounts,
}: Props) => {
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>FinanceKu Backup</Text>
            <Text style={{ color: "#64748b", fontSize: 9 }}>
              Generated on {new Date().toLocaleString("id-ID")}
            </Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontWeight: "bold", color: "#3b82f6" }}>Personal Data Archive</Text>
            <Text style={{ fontSize: 8 }}>Secure Backup v1.0</Text>
          </View>
        </View>

        {/* User Profile */}
        <Text style={styles.subtitle}>Profil Pengguna</Text>
        <View style={styles.infoBox}>
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <Text style={styles.value}>{user.full_name}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>Username</Text>
              <Text style={styles.value}>{user.username}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.label}>No HP</Text>
              <Text style={styles.value}>{user.no_hp}</Text>
            </View>
          </View>
        </View>

        {/* Account Cards */}
        <Text style={styles.subtitle}>Daftar Akun / Aset</Text>
        {accounts.length > 0 ? (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>ID Aset</Text>
              <Text style={styles.headerCell}>Nama Aset</Text>
              <Text style={styles.headerCell}>Nama Akun</Text>
              <Text style={[styles.headerCell, { textAlign: "right" }]}>Saldo</Text>
            </View>
            {accounts.map((acc, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{acc.idAccount}</Text>
                <Text style={styles.cell}>{acc.nama_asset}</Text>
                <Text style={styles.cell}>{acc.nama_akun}</Text>
                <Text style={[styles.cell, { textAlign: "right", fontWeight: "bold" }]}>
                  {formatCurrency(acc.saldo_awal)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>Data akun masih kosong</Text>
        )}

        {/* Categories */}
        <Text style={styles.subtitle}>Kategori Transaksi</Text>
        {category.length > 0 ? (
          <View style={styles.infoBox}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
              {category.map((cat, i) => (
                <View key={i} style={{ backgroundColor: "#eff6ff", padding: "4 8", borderRadius: 4, marginBottom: 4, marginRight: 4 }}>
                  <Text style={{ color: "#3b82f6", fontSize: 8 }}>{cat.nama_kategori}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.empty}>Data kategori masih kosong</Text>
        )}

        {/* Targets */}
        <Text style={styles.subtitle}>Target Keuangan</Text>
        {target.length > 0 ? (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Nama Target</Text>
              <Text style={[styles.headerCell, { textAlign: "right" }]}>Goal</Text>
              <Text style={[styles.headerCell, { textAlign: "right" }]}>Terkumpul</Text>
            </View>
            {target.map((t, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{t.nama_target}</Text>
                <Text style={[styles.cell, { textAlign: "right" }]}>{formatCurrency(t.nominal_target)}</Text>
                <Text style={[styles.cell, { textAlign: "right", color: "#059669" }]}>{formatCurrency(t.target_now)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>Data target masih kosong</Text>
        )}

        {/* Anggaran */}
        <Text style={styles.subtitle}>Anggaran Bulanan</Text>
        {anggaran.length > 0 ? (
          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Kategori</Text>
              <Text style={[styles.headerCell, { textAlign: "right" }]}>Limit</Text>
            </View>
            {anggaran.map((a, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{a.nama_kategori || a.kategori_anggaran}</Text>
                <Text style={[styles.cell, { textAlign: "right" }]}>{formatCurrency(a.limit_anggaran)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>Data anggaran masih kosong</Text>
        )}

        {/* Transactions (Briefly) */}
        <Text style={styles.subtitle}>Ringkasan Transaksi Terakhir (Max 50 Transaksi Terakhir)</Text>
        {transaksi.length > 0 ? (
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 1.5 }]}>Tanggal</Text>
              <Text style={styles.headerCell}>Tipe</Text>
              <Text style={[styles.headerCell, { flex: 2 }]}>Kategori / Ket.</Text>
              <Text style={[styles.headerCell, { textAlign: "right" }]}>Nominal</Text>
            </View>
            {transaksi.slice(0, 50).map((t, i) => (
              <View key={i} style={styles.row}>
                <Text style={[styles.cell, { flex: 1.5 }]}>{t.tanggal_transaksi}</Text>
                <Text style={[styles.cell, { color: t.type_transaksi === "pengeluaran" ? "#dc2626" : "#059669" }]}>
                  {t.type_transaksi}
                </Text>
                <Text style={[styles.cell, { flex: 2 }]}>
                  {t.nama_kategori || t.kategori} {"\n"}
                  <Text style={{ fontSize: 6, color: "#94a3b8" }}>{t.description || "-"}</Text>
                </Text>
                <Text style={[styles.cell, { textAlign: "right", fontWeight: "bold" }]}>
                  {formatCurrency(t.nominal_transaksi)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>Data transaksi masih kosong</Text>
        )}

        <Text style={styles.footer}>
          MyFinanceKu - Kurasi Masa Depan Bersama MyFinanceKu • Dicetak otomatis sebagai salinan data pengguna.
        </Text>
      </Page>
    </Document>
  );
};