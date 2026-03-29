import { useSearchParams, useLocation } from 'react-router-dom';
import { useNavigationStore } from '../store/navigationStore';
import { useEffect, useMemo } from 'react';

export const useUrlState = (section: string) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const setLastUrl = useNavigationStore((state) => state.setLastUrl);

    // Sync current URL with navigation store
    useEffect(() => {
        setLastUrl(section, location.pathname + location.search);
    }, [location.pathname, location.search, section, setLastUrl]);

    const lazyParams = useMemo(() => {
        const rows = Number(searchParams.get('rows')) || 10;
        const page = Number(searchParams.get('page')) || 1;
        const first = (page - 1) * rows;
        
        return {
            first,
            rows,
            page,
            sortField: searchParams.get('sortField') || null,
            sortOrder: searchParams.get('sortOrder') ? Number(searchParams.get('sortOrder')) : null,
        };
    }, [searchParams]);

    const filterParams = useMemo(() => {
        const filters: Record<string, any> = {};
        searchParams.forEach((value, key) => {
            if (!['first', 'rows', 'page', 'sortField', 'sortOrder'].includes(key)) {
                // Try to parse booleans and numbers
                if (value === 'true') {
                    filters[key] = true;
                } else if (value === 'false') {
                    filters[key] = false;
                } else if (!isNaN(Number(value)) && value.trim() !== '') {
                    filters[key] = Number(value);
                } else {
                    filters[key] = value;
                }
            }
        });
        return filters;
    }, [searchParams]);

    const updateUrl = (newLazy: any, newFilters: any) => {
        const params = new URLSearchParams();
        
        // Add lazy params
        if (newLazy.rows !== 10) params.set('rows', String(newLazy.rows));
        if (newLazy.page !== 1) params.set('page', String(newLazy.page));
        if (newLazy.sortField) params.set('sortField', newLazy.sortField);
        if (newLazy.sortOrder) params.set('sortOrder', String(newLazy.sortOrder));

        // Add filter params
        Object.keys(newFilters).forEach(key => {
            const val = newFilters[key];
            if (val !== undefined && val !== null && val !== '') {
                if (val instanceof Date) {
                    params.set(key, val.toISOString());
                } else {
                    params.set(key, String(val));
                }
            }
        });

        setSearchParams(params, { replace: true });
    };

    return { lazyParams, filterParams, updateUrl };
};
