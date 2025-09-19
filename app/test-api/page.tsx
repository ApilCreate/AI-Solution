'use client';

import { useEffect, useState } from 'react';

export default function APITest() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testAPI() {
      try {
        console.log('🧪 Testing API from client...');
        const response = await fetch('/api/inquiries/list');
        console.log('📊 Response status:', response.status);
        
        if (response.ok) {
          const result = await response.json();
          console.log('📦 API Response:', result);
          setData(result);
        } else {
          const errorText = await response.text();
          console.error('❌ API Error:', errorText);
          setError(errorText);
        }
      } catch (err: any) {
        console.error('❌ Fetch Error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    testAPI();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      {loading && <div>Loading...</div>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div>
          <h2 className="text-xl font-semibold mb-2">API Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
          
          {data.inquiries && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Inquiries Count: {data.inquiries.length}</h3>
              <h3 className="text-lg font-medium">Total: {data.total}</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}