import UserDetailPage from "./ClientView"

export default async function page({ params }: { params: Promise<{ idUser: string }> }) {
  const { idUser } = await params;
  return (
    <UserDetailPage idUser={idUser} />
  )
}