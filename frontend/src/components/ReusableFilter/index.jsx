import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const ReusableFilter = ({ filtersConfig, onApply, onClear }) => {
    const [filterValues, setFilterValues] = useState({});

    const handleApply = () => {
        onApply(filterValues);
    };

    const handleClear = () => {
        setFilterValues({});
        onClear();
    };

    const renderFilter = (config) => {
        const { type, name, label, options } = config;

        switch (type) {
            case 'text':
                return (
                    <div className="field col-12 md:col-6 lg:col-3" key={name}>
                        <span className="p-float-label">
                            <InputText 
                                id={name} 
                                value={filterValues[name] || ''} 
                                onChange={(e) => setFilterValues({ ...filterValues, [name]: e.target.value })} 
                                style={{ width: '100%' }}
                            />
                            <label htmlFor={name}>{label}</label>
                        </span>
                    </div>
                );
            case 'dropdown':
                return (
                    <div className="field col-12 md:col-6 lg:col-3" key={name}>
                        <span className="p-float-label">
                            <Dropdown 
                                id={name} 
                                value={filterValues[name]} 
                                options={options} 
                                onChange={(e) => setFilterValues({ ...filterValues, [name]: e.value })} 
                                optionLabel="label" 
                                style={{ width: '100%' }}
                                showClear
                            />
                            <label htmlFor={name}>{label}</label>
                        </span>
                    </div>
                );
            case 'calendar-range':
                return (
                    <div className="field col-12 md:col-12 lg:col-3" key={name}>
                        <span className="p-float-label">
                            <Calendar 
                                id={name} 
                                value={filterValues[name] || null} 
                                onChange={(e) => setFilterValues({ ...filterValues, [name]: e.value })} 
                                selectionMode="range" 
                                readOnlyInput 
                                hideOnRangeSelection
                                style={{ width: '100%' }}
                            />
                            <label htmlFor={name}>{label}</label>
                        </span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="card mb-4">
            <div className="p-fluid formgrid grid align-items-end">
                {filtersConfig.map(renderFilter)}
                <div className="field col-12 md:col-12 lg:col-3 flex gap-2">
                    <Button label="Apply" icon="pi pi-filter" onClick={handleApply} className="p-button-primary" />
                    <Button label="Clear" icon="pi pi-times" onClick={handleClear} className="p-button-outlined p-button-secondary" />
                </div>
            </div>
        </div>
    );
};

export default ReusableFilter;
