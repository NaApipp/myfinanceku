import { Metadata } from "next";
import AdminClientLayout from "./AdminClientLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard | FinanceKu",
  description: "Panel administrasi FinanceKu untuk pengelolaan pengguna dan transaksi.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
