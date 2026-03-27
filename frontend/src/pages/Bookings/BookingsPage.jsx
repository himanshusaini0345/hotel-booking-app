import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookings, fetchBookedUsers } from '../../api/booking.api';
import { fetchUsers } from '../../api/user.api';
import { fetchHotels } from '../../api/hotel.api';
import ReusableTable from '../../components/ReusableTable';
import ReusableFilter from '../../components/ReusableFilter';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import * as XLSX from 'xlsx';

const BookingsPage = () => {
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

    const { data: bookingsData, isLoading: bookingsLoading, isFetching: bookingsFetching } = useQuery({
        queryKey: ['bookings', lazyParams.page, lazyParams.rows, sortParams, filterParams],
        queryFn: () => fetchBookings({
            page: lazyParams.page,
            limit: lazyParams.rows,
            ...sortParams,
            ...filterParams
        }),
        keepPreviousData: true
    });

    const { data: usersData } = useQuery({
        queryKey: ['bookedUsers'],
        queryFn: fetchBookedUsers 
    });

    const { data: hotelsData } = useQuery({
        queryKey: ['allHotels'],
        queryFn: () => fetchHotels({ download: 'true' })
    });

    const getStatusSeverity = (status) => {
        switch (status) {
            case 0: return 'info'; // Confirmed
            case 1: return 'danger'; // Cancelled
            case 2: return 'success'; // Completed
            default: return null;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 0: return 'Confirmed';
            case 1: return 'Cancelled';
            case 2: return 'Completed';
            default: return 'Unknown';
        }
    };

    const columns = [
        { 
            field: 'userId.name', 
            header: 'Guest Name', 
            sortable: false,
            body: (rowData) => rowData.userId?.name || 'N/A'
        },
        { 
            field: 'hotelId.name', 
            header: 'Hotel Name', 
            sortable: false,
            body: (rowData) => rowData.hotelId?.name || 'N/A'
        },
        { 
            field: 'checkInDate', 
            header: 'Check-in Date', 
            sortable: true,
            body: (rowData) => new Date(rowData.checkInDate).toLocaleDateString()
        },
        { 
            field: 'status', 
            header: 'Status', 
            sortable: true,
            body: (rowData) => <Tag severity={getStatusSeverity(rowData.status)} value={getStatusLabel(rowData.status)} />
        },
    ];

    const formatOptions = (arr, labelKey = 'name') => arr && arr.data ? arr.data.map(item => ({ label: item[labelKey], value: item._id })) : [];

    // Assuming we extract available users from the loaded users.
    const filtersConfig = [
        { name: 'userId', type: 'dropdown', label: 'User', options: formatOptions(usersData) },
        { name: 'hotelId', type: 'dropdown', label: 'Hotel', options: formatOptions(hotelsData) },
        { name: 'status', type: 'dropdown', label: 'Status', options: [{label: 'Confirmed', value: 0}, {label: 'Cancelled', value: 1}, {label: 'Completed', value: 2}] },
        { name: 'checkInDate', type: 'calendar-range', label: 'Check-in Date Range' }
    ];

    const exportExcel = async () => {
        // Fetch all filtered data
        let exportFilters = { ...filterParams, download: 'true' };
        if (sortParams.sort) exportFilters.sort = sortParams.sort;
        
        try {
            const response = await fetchBookings(exportFilters);
            const exportData = response.data.map(booking => ({
                'Guest Name': booking.userId?.name || 'N/A',
                'Guest Email': booking.userId?.email || 'N/A',
                'Hotel Name': booking.hotelId?.name || 'N/A',
                'Check-in Date': new Date(booking.checkInDate).toLocaleDateString(),
                'Status': getStatusLabel(booking.status),
                'Booked On': new Date(booking.bookingDate).toLocaleDateString()
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            XLSX.writeFile(workbook, 'bookings_report.xlsx');
        } catch (error) {
            console.error('Failed to export', error);
        }
    };

    return (
        <div>
            <div className="flex justify-content-between align-items-center mb-4">
                <h2 className="m-0">Bookings Control</h2>
                <Button label="Export Excel" icon="pi pi-file-excel" className="p-button-success" onClick={exportExcel} />
            </div>
            
            <ReusableFilter 
                filtersConfig={filtersConfig} 
                onApply={(filters) => {
                    // map calendar-range to startDate, endDate
                    const processed = {...filters};
                    if (filters.checkInDate && filters.checkInDate.length === 2) {
                        processed.startDate = filters.checkInDate[0]?.toISOString();
                        processed.endDate = filters.checkInDate[1]?.toISOString();
                        delete processed.checkInDate;
                    }
                    setFilterParams(processed);
                    setLazyParams(prev => ({ ...prev, first: 0, page: 1 }));
                }} 
                onClear={() => {
                    setFilterParams({});
                    setLazyParams(prev => ({ ...prev, first: 0, page: 1 }));
                }}
            />
            
            <ReusableTable 
                columns={columns}
                data={bookingsData?.data || []}
                loading={bookingsLoading || bookingsFetching}
                totalRecords={bookingsData?.total || 0}
                lazyParams={lazyParams}
                setLazyParams={setLazyParams}
            />
        </div>
    );
};

export default BookingsPage;
