"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { useAuth, LogoutButton } from "@/auth";

interface ApiResult {
  type: "success" | "error";
  data?: string;
  message?: string;
  errorCode?: string;
  requestId?: string;
}

export default function Home() {
  const { isAuthenticated, user, getToken } = useAuth();
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function callApi(endpoint: string) {
    setLoading(true);
    setResult(null);
    try {
      const token = await getToken();
      const res = await fetch(`/api/test/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  if (!isAuthenticated) {
    return (
      <div className="container">
        <h1>SaaS Starter</h1>
        <SignIn routing="hash" />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>API Tester</h1>
      <div style={{ marginBottom: "1rem" }}>
        Signed in as: <strong>{user?.email}</strong>
        <span style={{ marginLeft: "1rem" }}>
          <LogoutButton />
        </span>
      </div>
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
            {result.errorCode && <div>Error: {result.errorCode}</div>}
            <div>Message: {result.message}</div>
            {result.requestId && <div>Request ID: {result.requestId}</div>}
          </>
        )}
      </div>
    </div>
  );
}
