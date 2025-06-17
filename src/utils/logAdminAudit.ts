
/**
 * Logs admin access attempts to Supabase via edge function.
 */
export async function logAdminAudit({
  event_type,
  event_result,
  admin_email,
  event_description,
}: {
  event_type: string;
  event_result: string;
  admin_email?: string;
  event_description?: string;
}): Promise<void> {
  // You might want to debounce or suppress in local/dev!
  try {
    await fetch("https://idnsjpmpuifvbidxfytl.functions.supabase.co/log-admin-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type,
        event_result,
        admin_email,
        event_description,
      }),
    });
  } catch (err) {
    // Don't interrupt login flow on logging failure
    // Optionally, show a toast in dev mode
    if (import.meta.env && import.meta.env.MODE === "development")
      console.error("Admin audit log failed", err);
  }
}
