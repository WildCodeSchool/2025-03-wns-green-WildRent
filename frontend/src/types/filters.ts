export type ActiveFilters = {
    genders: string[];
    brands: string[];
    sizes: string[];
    colors: string[];
    priceMin: number | undefined;
    priceMax: number | undefined;
};

export const emptyFilters: ActiveFilters = { genders: [], brands: [], sizes: [], colors: [], priceMin: undefined, priceMax: undefined };

export type FilterCounts = {
    genders: Record<string, number>;
    brands: Record<string, number>;
    sizes: Record<string, number>;
    colors: Record<string, number>;
};
