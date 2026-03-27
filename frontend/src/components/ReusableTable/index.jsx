import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';

const ReusableTable = ({ 
    columns, 
    data, 
    loading, 
    totalRecords, 
    lazyParams, 
    setLazyParams, 
    emptyMessage = "No records found" 
}) => {

    const onPage = (event) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            rows: event.rows,
            page: event.page + 1
        });
    };

    const onSort = (event) => {
        setLazyParams({
            ...lazyParams,
            sortField: event.sortField,
            sortOrder: event.sortOrder
        });
    };

    return (
        <div className="card">
            <DataTable
                value={data}
                lazy
                paginator
                first={lazyParams.first}
                rows={lazyParams.rows}
                totalRecords={totalRecords}
                onPage={onPage}
                onSort={onSort}
                sortField={lazyParams.sortField}
                sortOrder={lazyParams.sortOrder}
                loading={loading}
                loadingIcon={<ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />}
                emptyMessage={emptyMessage}
                responsiveLayout="scroll"
                rowsPerPageOptions={[5, 10, 20]}
            >
                {columns.map((col, index) => (
                    <Column
                        key={index}
                        field={col.field}
                        header={col.header}
                        sortable={col.sortable}
                        body={col.body}
                        style={col.style}
                    />
                ))}
            </DataTable>
        </div>
    );
};

export default ReusableTable;
