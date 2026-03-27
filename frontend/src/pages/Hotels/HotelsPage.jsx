import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchHotels } from '../../api/hotel.api';
import { fetchStates, fetchCities } from '../../api/location.api';
import ReusableTable from '../../components/ReusableTable';
import ReusableFilter from '../../components/ReusableFilter';
import { Tag } from 'primereact/tag';

const HotelsPage = () => {
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
    });
    
    const [filterParams, setFilterParams] = useState({});

    const sortParams = lazyParams.sortField ? { 
        sort: `${lazyParams.sortOrder === 1 ? '' : '-'}${lazyParams.sortField}` 
    } : {};

    const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
        queryKey: ['hotels', lazyParams.page, lazyParams.rows, sortParams, filterParams],
        queryFn: () => fetchHotels({
            page: lazyParams.page,
            limit: lazyParams.rows,
            ...sortParams,
            ...filterParams
        }),
        keepPreviousData: true
    });

    const { data: statesRes } = useQuery({
        queryKey: ['states'],
        queryFn: fetchStates
    });

    // Dynamic cities based on filterParams.stateId - handled natively by React Query
    const { data: citiesRes } = useQuery({
        queryKey: ['cities', filterParams.stateId],
        queryFn: () => fetchCities(filterParams.stateId),
        enabled: true, // Fetch all cities if no stateId
    });

    const columns = [
        { field: 'name', header: 'Hotel Name', sortable: true },
        { field: 'location', header: 'Location', sortable: false },
        { 
            field: 'cityId.name', 
            header: 'City', 
            sortable: false,
            body: (rowData) => rowData.cityId?.name || 'N/A'
        },
        { field: 'rating', header: 'Rating', sortable: true },
        { 
            field: 'isActive', 
            header: 'Status', 
            sortable: true,
            body: (rowData) => <Tag severity={rowData.isActive ? 'success' : 'danger'} value={rowData.isActive ? 'Active' : 'Inactive'} />
        }
    ];

    const formatFilterOptions = (arr) => arr ? arr.map(item => ({ label: item.name, value: item._id })) : [];

    const filtersConfig = [
        { name: 'search', type: 'text', label: 'Search Hotel' },
        { name: 'stateId', type: 'dropdown', label: 'State', options: formatFilterOptions(statesRes?.data) },
        { name: 'cityId', type: 'dropdown', label: 'City', options: formatFilterOptions(citiesRes?.data) },
        { name: 'rating', type: 'dropdown', label: 'Rating', options: [1,2,3,4,5].map(v => ({label: `${v} Star${v>1?'s':''}`, value: v})) },
        { name: 'isActive', type: 'dropdown', label: 'Status', options: [{label: 'Active', value: true}, {label: 'Inactive', value: false}] }
    ];

    return (
        <div>
            <h2>Hotels Portfolio</h2>
            <ReusableFilter 
                filtersConfig={filtersConfig} 
                onApply={(filters) => {
                    setFilterParams(filters);
                    setLazyParams(prev => ({ ...prev, first: 0, page: 1 }));
                }} 
                onClear={() => {
                    setFilterParams({});
                    setLazyParams(prev => ({ ...prev, first: 0, page: 1 }));
                }}
            />
            <ReusableTable 
                columns={columns}
                data={hotelsData?.data || []}
                loading={hotelsLoading}
                totalRecords={hotelsData?.total || 0}
                lazyParams={lazyParams}
                setLazyParams={setLazyParams}
            />
        </div>
    );
};

export default HotelsPage;
