import { useState, useEffect, useMemo } from "react";

const useSearch = (data, delay = 500) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce functionality
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, delay);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const fullNameMatch = item.fullname
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase());
      const phoneNumberMatch = item.phone
        ? item.phone.includes(debouncedSearchQuery)
        : false;
      return fullNameMatch || phoneNumberMatch;
    });
  }, [data, debouncedSearchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return {
    searchQuery,
    filteredData,
    handleSearchChange,
  };
};

export default useSearch;
