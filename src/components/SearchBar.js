'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/utils/context/authContext';
import getSearchData from '@/api/searchBarData';
import { useRouter } from 'next/navigation';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  const placeholderText = router.pathname === '/songs' ? 'Search for songs' : 'Search for songs and lists';

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchData = async () => {
      try {
        const { songs, lists } = await getSearchData(user.uid);
        const allData = [...songs, ...lists];

        // Convert the searchTerm to lowercase for case-insensitive matching
        const lowerSearchTerm = searchTerm.toLowerCase();

        // Filter results by checking multiple fields (title, hymnal, page number, congregation, date)
        const filteredResults = allData.filter((item) => {
          const fieldsToSearch = [
            item.title,
            item.hymnal,
            item.pageNumber?.toString(), // Ensure pageNumber is treated as a string
            item.date?.toString(), // Ensure date is treated as a string
          ];

          // Check if any field contains the search term
          return fieldsToSearch.some((field) => field && field.toLowerCase().includes(lowerSearchTerm));
        });

        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };

    fetchData();
  }, [searchTerm, user]);

  return (
    <div className="search-bar-container">
      <input type="text" placeholder={placeholderText} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control" />
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => (
            <Link
              key={result.firebaseKey}
              href={result.type === 'song' ? `/songs/${result.firebaseKey}` : `/lists/${result.firebaseKey}`}
              className="search-result-item" // Directly apply styles to the Link component
            >
              {result.title} ({result.type === 'song' ? 'Song' : 'List'})
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
