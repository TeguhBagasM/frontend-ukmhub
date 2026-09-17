import { useAuthStore } from '../../stores/auth.store'
import { EditProfileForm } from '../../components/dashboard/EditProfileForm'
import { ProfileCard } from '../../components/dashboard/ProfileCard'
import { PageHeader } from '../../components/ui/PageHeader'

export function AdminProfilePage() {
  const user = useAuthStore((state) => state.user)
  if (!user) return null
  return <div className="flex flex-col gap-8"><PageHeader eyebrow="Profil admin" title="Akun kamu" description="Perbarui nama dan email yang digunakan untuk mengelola organisasi." /><div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"><ProfileCard user={user} /><EditProfileForm user={user} /></div></div>
}
