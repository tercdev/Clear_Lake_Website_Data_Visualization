import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Fetch data given API endpoint  
 * https://dev.to/techcheck/custom-react-hook-usefetch-eid
 * @param {String} url API endpoint
 * @returns {*} data, loading, error
 */
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
      setLoading(true);
      setData(null);
      setError(null);
      const source = axios.CancelToken.source();
      axios.get(url, { cancelToken: source.token })
      .then(res => {
          setLoading(false);
          //checking for multiple responses for more flexibility 
          //with the url we send in.
          res.data.content && setData(res.data.content);
          res.content && setData(res.content);
      })
      .catch(err => {
          setLoading(false)
          setError('An error occurred. Awkward..')
      })
      return () => {
          source.cancel();
      }
  }, [url])

  return { data, loading, error }
}
export default useFetch;