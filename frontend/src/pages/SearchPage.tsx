import { useParams } from 'react-router-dom';

const SearchPage = () => {
  const { city } = useParams();
  return <span>Search Page {city}</span>;
};

export default SearchPage;
