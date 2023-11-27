'use client';

import { useState } from 'react';
import FilterForm from '@/components/apiForm';
import ContentList from '@/components/server/contentList';

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
      <ContentList 
        title="Search Results" 
        content="Your search results" 
        list={filteredData} />
    </div>
  );
}
