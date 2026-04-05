#!/bin/bash

# Usage: ./test-auth.sh <valid-jwt-token>
# Get your JWT from the browser DevTools Network tab (Authorization header)

TOKEN="${1:?Usage: ./test-auth.sh <valid-jwt-token>}"

echo "=== Test 1: Valid JWT ==="
curl -s http://localhost:3001/test/success \
  -H "Authorization: Bearer $TOKEN" | jq .

echo ""
echo "=== Test 2: Invalid JWT ==="
curl -s http://localhost:3001/test/success \
  -H "Authorization: Bearer invalid-token-here" | jq .
