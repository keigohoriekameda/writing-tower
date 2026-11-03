import type { SupabaseClient } from "@supabase/supabase-js"
import { PRODUCT_CODE } from "@/lib/productCode"

export type ProductAccessResult = "granted" | "denied" | "error"

/**
 * Mirrors skyline-j3-social-history's checkProductAccess(): a student may
 * use this app only if both the shared `products` row is active and they
 * have an active (non-expired) `user_product_access` grant for it.
 *
 * "error" (a failed lookup) is kept distinct from "denied" so server
 * callers can answer 503 instead of wrongly telling a legitimate student
 * they have no access.
 */
export async function getProductAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<ProductAccessResult> {
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
    console.error("[writing-tower] failed to check products row", productError.code)
  }
  if (accessError) {
    console.error("[writing-tower] failed to check user_product_access row", accessError.code)
  }
  if (productError || accessError) return "error"

  if (!product || !product.is_active) return "denied"
  if (!access || !access.is_active) return "denied"
  if (access.expires_at !== null && new Date(access.expires_at as string).getTime() <= Date.now()) {
    return "denied"
  }
  return "granted"
}

export async function checkProductAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  return (await getProductAccess(supabase, userId)) === "granted"
}
