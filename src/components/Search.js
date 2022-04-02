import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [term, setTerm] = useState('promise');
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [results, setResults] = useState([]);
  const wikiApiKey = 'https://en.wikipedia.org/w/api.php';

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (term) {
        setDebouncedTerm(term);
      } else {
        setDebouncedTerm('promise');
      }
    },1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [term]);

  useEffect(() => {
    const apiCall = () => {
      axios.get(wikiApiKey, {
        params: {
          action: 'query',
          list: 'search',
          origin: '*',
          format: 'json',
          srsearch: debouncedTerm
        }
      })
        .then((response) => {
          setResults(response.data.query.search);
        });
    };
    apiCall();
  }, [debouncedTerm]);

  const renderedResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className="right floated content">
          <a
            className="ui button"
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
            target="new"
          >
            Go
          </a>
        </div>
        <div className="content">
          <div className="header">
            {result.title}
          </div>
          <span dangerouslySetInnerHTML={{__html: result.snippet}}></span>
        </div>
      </div>
    )
  });

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Enter Search Term</label>
          <input
            className="input"
            onChange={e => setTerm(e.target.value)}
            type="text"
          />
        </div>
      </div>
      <div className="ui celled list">
        {renderedResults}
      </div>
    </div>
  );

};

export default Search;
