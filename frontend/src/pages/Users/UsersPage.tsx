import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../../api/user.api';
import ReusableTable from '../../components/ReusableTable';
import ReusableFilter from '../../components/ReusableFilter';
import { useUrlState } from '../../hooks/useUrlState';

const UsersPage = () => {
    useEffect(() => {
        document.title = "Users | Hotel Booking App";

        return () => { document.title = "Hotel Booking App"; };
    }, []);


    const { lazyParams, filterParams, updateUrl } = useUrlState('users');

    const sortParams = lazyParams.sortField ? {
        sort: `${lazyParams.sortOrder === 1 ? '' : '-'}${lazyParams.sortField}`
    } : {};

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['users', lazyParams.page, lazyParams.rows, sortParams, filterParams],
        queryFn: () => fetchUsers({
            page: lazyParams.page,
            limit: lazyParams.rows,
            ...sortParams,
            ...filterParams
        }),
        placeholderData: (previousData: any) => previousData
    });

    const columns = [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'email', header: 'Email', sortable: true },
        { field: 'phone', header: 'Phone', sortable: false },
        {
            field: 'createdAt',
            header: 'Created Date',
            sortable: true,
            body: (rowData: any) => new Date(rowData.createdAt).toLocaleDateString()
        }
    ];

    const filtersConfig = [
        { name: 'search', type: 'text', label: 'Search Name/Email/Phone' }
    ];

    return (
        <div>
            <h2>Users Hub</h2>
            <ReusableFilter
                filtersConfig={filtersConfig}
                initialValues={filterParams}
                onApply={(filters: any) => {
                    updateUrl({ ...lazyParams, first: 0, page: 1 }, filters);
                }}
                onClear={() => {
                    updateUrl({ ...lazyParams, first: 0, page: 1 }, {});
                }}
            />
            <ReusableTable
                columns={columns}
                data={(data as any)?.data || []}
                loading={isLoading || isFetching}
                totalRecords={(data as any)?.total || 0}
                lazyParams={lazyParams}
                setLazyParams={(newLazy: any) => updateUrl(newLazy, filterParams)}
            />
        </div>
    );
};

export default UsersPage;
