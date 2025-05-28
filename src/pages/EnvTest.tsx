import React from 'react';

const EnvTest: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="space-y-2">
        <div>
          <strong>VITE_SUPABASE_URL:</strong> {supabaseUrl || "Not loaded"}
        </div>
        <div>
          <strong>VITE_SUPABASE_ANON_KEY:</strong> {supabaseAnonKey ? "Present (hidden)" : "Not loaded"}
        </div>
        <div>
          <strong>All env vars:</strong>
          <pre className="bg-gray-100 p-2 mt-2 text-sm">
            {JSON.stringify(import.meta.env, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default EnvTest;
