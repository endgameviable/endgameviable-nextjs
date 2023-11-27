import React, { useState } from 'react';

interface FilterFormProps {
    onSubmit: (filterValue: string) => void;
}

export default function EntryFilterForm({ onSubmit }: FilterFormProps) {
    const [filterValue, setFilterValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Call the onSubmit callback with the filter value
        onSubmit(filterValue);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Filter data..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
            />
            <button type="submit">Apply Filter</button>
        </form>
    );
}
