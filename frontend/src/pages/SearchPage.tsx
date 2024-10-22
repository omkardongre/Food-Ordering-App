import { useSearchRestaurants } from '@/api/RestaurantApi';
import CuisineFilter from '@/components/CuisineFilter';
import PaginationSelector from '@/components/PaginationSelector';
import SearchBar, { SearchForm } from '@/components/SearchBar';
import SearchResultCard from '@/components/SearchResultCard';
import SearchResultInfo from '@/components/SearchResultInfo';
import SortOptionDropDown from '@/components/SortOptionDropDown';

import { useState } from 'react';
import { useParams } from 'react-router-dom';

export type SearchState = {
  searchQuery: string;
  page: number;
  selectedCuisines: string[];
  sortOption: string;
};

const SearchPage = () => {
  const { city = '' } = useParams<{ city: string }>();
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: '',
    page: 1,
    selectedCuisines: [],
    sortOption: 'bestMatch',
  });

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { results, isLoading } = useSearchRestaurants(searchState, city);

  const setSelectedCuisines = (cuisines: string[]) => {
    setSearchState((prevState) => ({
      ...prevState,
      selectedCuisines: cuisines,
      page: 1,
    }));
  };

  const setPage = (page: number) => {
    setSearchState((prevState) => ({
      ...prevState,
      page,
      selectedCuisines: [],
    }));
  };

  const setSearchQuery = (searchFormDate: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormDate.searchQuery,
      page: 1,
    }));
  };

  const setSortOption = (sortOption: string) => {
    setSearchState((prevState) => ({
      ...prevState,
      sortOption,
      page: 1,
    }));
  };

  const resetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: '',
      page: 1,
    }));
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!results?.data || !city) {
    return <span>No results found</span>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div id="cuisines-list">
        <CuisineFilter
          onChange={setSelectedCuisines}
          selectedCuisines={searchState.selectedCuisines}
          isExpanded={isExpanded}
          onExpandClick={() => setIsExpanded((prevState) => !prevState)}
        />
      </div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchBar
          searchQuery={searchState.searchQuery}
          onSubmit={setSearchQuery}
          placeHolder="Search by Cuisine or Restaurant Name"
          onReset={resetSearch}
        />
        <div className="flex justify-between flex-col gap-3 lg:flex-row">
          <SearchResultInfo city={city} total={results.pagination.total} />
          <SortOptionDropDown
            onChange={setSortOption}
            sortOption={searchState.sortOption}
          />
        </div>

        {results.data.map((restaurant) => (
          <SearchResultCard key={restaurant._id} restaurant={restaurant} />
        ))}
        <PaginationSelector
          page={results.pagination.page}
          pages={results.pagination.pages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default SearchPage;
