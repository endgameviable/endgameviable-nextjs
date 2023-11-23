'use client';

import { useState } from 'react';
import FilterForm from '@/components/apiForm';
import EntryListLayout from '@/components/server/entryList';

export default function Page() {
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const handleFilter = (data: any) => {
    console.log(data);
    setFilteredData(data);
  };

  return (
    <div>
      <h1>Search If You Dare</h1>
      <FilterForm onSubmit={handleFilter} />
      <EntryListLayout title="Search Results" content="Your search results" list={filteredData} />
    </div>
  );
}
