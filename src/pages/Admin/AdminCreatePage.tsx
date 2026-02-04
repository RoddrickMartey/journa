import { getAllAdmins } from "@/api/adminAuthApi";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import CreateAdmin from "./components/CreateAdmin";
import { getCookie } from "@/lib/getCookie";
import { useAdminStore } from "@/store/adminStore";
import NotFound from "../NotFound";

type Admin = {
  number: string;
  email: string;
  name: string;
  id: string;
  adminId: string;
  avatarUrl: string;
  avatarPath: string;
};

function AdminCreatePage() {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);

  const { user } = useAdminStore();
  const supaAdminCookie = getCookie("supaAdmin");
  const isSuper = user?.id === supaAdminCookie;

  const fetchAllAdmins = async () => {
    try {
      setLoading(true);
      const result = await getAllAdmins();
      setAdmins(result.data);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdmins();
  }, []);

  if (!isSuper) {
    return <NotFound />;
  }

  return (
    <section className="min-h-screen w-full px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Administrators</h1>
          <p className="text-muted-foreground">
            Manage administrator accounts and permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CreateAdmin />
          <Button variant="outline" onClick={fetchAllAdmins} disabled={loading}>
            {loading ? "Refreshing…" : "Refetch"}
            {loading && <Spinner className="ml-2" />}
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-muted-foreground">Loading administrators…</div>
      )}

      {/* Empty state */}
      {!loading && admins.length === 0 && (
        <div className="text-muted-foreground">No administrators found.</div>
      )}

      {/* Grid */}
      {!loading && admins.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {admins.map((admin) => (
            <Card
              key={admin.id}
              className="hover:shadow-md transition flex flex-col items-center text-center p-4"
            >
              {/* Avatar on top */}
              <img
                src={admin.avatarUrl || "/default-avatar.png"}
                alt={admin.name}
                className="h-28 w-28 rounded-full object-cover mb-4"
              />

              {/* Name */}
              <CardTitle className="text-lg font-medium truncate">
                {admin.name}
              </CardTitle>

              {/* Details */}
              <CardContent className="space-y-1 text-sm mt-2">
                <div className="text-muted-foreground truncate">
                  {admin.email}
                </div>
                <div className="text-xs text-muted-foreground">
                  Admin ID: {admin.adminId}
                </div>
                <div className="text-xs text-muted-foreground">
                  Number : {admin.number}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminCreatePage;
