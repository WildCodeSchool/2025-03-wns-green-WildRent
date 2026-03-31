export type ActiveFilters = {
    genders: string[];
    brands: string[];
    sizes: string[];
    colors: string[];
    priceMin: number | undefined;
    priceMax: number | undefined;
};

export const emptyFilters: ActiveFilters = { genders: [], brands: [], sizes: [], colors: [], priceMin: undefined, priceMax: undefined };
