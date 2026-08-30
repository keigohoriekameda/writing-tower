import type { SupabaseClient } from "@supabase/supabase-js"
import { PRODUCT_CODE } from "@/lib/productCode"

/**
 * Mirrors skyline-j3-social-history's checkProductAccess(): a student may
 * use this app only if both the shared `products` row is active and they
 * have an active (non-expired) `user_product_access` grant for it.
 */
export async function checkProductAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const [{ data: product, error: productError }, { data: access, error: accessError }] =
    await Promise.all([
      supabase
        .from("products")
        .select("product_code, is_active")
        .eq("product_code", PRODUCT_CODE)
        .maybeSingle(),
      supabase
        .from("user_product_access")
        .select("is_active, expires_at")
        .eq("user_id", userId)
        .eq("product_id", PRODUCT_CODE)
        .maybeSingle(),
    ])

  if (productError) {
    console.error("[writing-tower] failed to check products row", productError)
  }
  if (accessError) {
    console.error("[writing-tower] failed to check user_product_access row", accessError)
  }

  if (!product || !product.is_active) return false
  if (!access || !access.is_active) return false
  if (access.expires_at !== null && new Date(access.expires_at as string).getTime() <= Date.now()) {
    return false
  }
  return true
}
