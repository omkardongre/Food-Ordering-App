import { useSearchRestaurants } from '@/api/RestaurantApi';
import SearchBar, { SearchForm } from '@/components/SearchBar';
import SearchResultCard from '@/components/SearchResultCard';
import SearchResultInfo from '@/components/SearchResultInfo';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export type SearchState = {
  searchQuery: string;
};

const SearchPage = () => {
  const { city } = useParams<{ city: string }>();
  const [searchState, setSearchState] = useState<SearchState>({
    searchQuery: '',
  });
  const { results, isLoading } = useSearchRestaurants(searchState, city);

  const setSearchQuery = (searchFormDate: SearchForm) => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: searchFormDate.searchQuery,
    }));
  };

  const resetSearch = () => {
    setSearchState((prevState) => ({
      ...prevState,
      searchQuery: '',
    }));
  };

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (!results?.data || !city) {
    return <span>No results found</span>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px-1fr] gap-5">
      <div id="cuisine-list">insert cuisine here :)</div>
      <div id="main-content" className="flex flex-col gap-5">
        <SearchBar
          searchQuery={searchState.searchQuery}
          onSubmit={setSearchQuery}
          placeHolder="Search by Cuisine or Restaurant name"
          onReset={resetSearch}
        />
        <SearchResultInfo city={city} total={results.pagination.total} />
        {results.data.map((restaurant) => (
          <SearchResultCard key={restaurant._id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
