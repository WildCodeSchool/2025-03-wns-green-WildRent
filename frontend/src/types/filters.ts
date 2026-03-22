export type ActiveFilters = {
    genders: string[];
    brands: string[];
    sizes: string[];
    colors: string[];
};

export const emptyFilters: ActiveFilters = { genders: [], brands: [], sizes: [], colors: [] };
