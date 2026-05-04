/**
 * Retourne le pourcentage de réduction effectif.
 *
 * Règle métier :
 * - variant.discount = 0 → hérite de product.discount
 * - variant.discount > 0 → c'est lui qui s'applique (toujours >= product.discount)
 *
 * Un variant ne peut jamais avoir une réduction inférieure à celle du produit.
 * (validé dans product-variant.service)
 */
export function getEffectiveDiscount(productDiscount: number, variantDiscount: number): number {
    return variantDiscount > 0 ? variantDiscount : productDiscount;
}
