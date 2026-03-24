"use client";

import { useState } from "react";

interface ApiResult {
  type: "success" | "error";
  data?: string;
  message?: string;
  errorCode?: string;
  requestId?: string;
}

export default function Home() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function callApi(endpoint: string) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/test/${endpoint}`);
      const json = await res.json();
      if (res.ok) {
        setResult({ type: "success", data: json.data });
      } else {
        setResult({
          type: "error",
          message: json.message,
          errorCode: json.errorCode,
          requestId: json.requestId,
        });
      }
    } catch (err) {
      setResult({
        type: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>API Tester</h1>
      <div className="buttons">
        <button className="btn-success" disabled={loading} onClick={() => callApi("success")}>
          Success
        </button>
        <button className="btn-error" disabled={loading} onClick={() => callApi("error")}>
          Error
        </button>
        <button className="btn-forbidden" disabled={loading} onClick={() => callApi("protected")}>
          Forbidden
        </button>
      </div>
      <div className={`result ${result?.type ?? ""}`}>
        {loading && "Loading..."}
        {!loading && !result && "Click a button to test an endpoint"}
        {!loading && result?.type === "success" && `Data: ${result.data}`}
        {!loading && result?.type === "error" && (
          <>
            {result.errorCode && `Error: ${result.errorCode}\n`}
            {`Message: ${result.message}`}
            {result.requestId && `\nRequest ID: ${result.requestId}`}
          </>
        )}
      </div>
    </div>
  );
}
