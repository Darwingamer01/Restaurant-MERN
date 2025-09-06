
# Remove 'import React' from all .tsx in src recursively
Get-ChildItem -Path ./src -Filter *.tsx -Recurse | ForEach-Object {
    (Get-Content $_.FullName) -replace '^import React.*?;
?
', '' | Set-Content $_.FullName
}

# Fix null issue in apiClient.ts
(Get-Content ./src/utils/apiClient.ts) -replace 'localStorage\.getItem\("access_token"\)', 'localStorage.getItem("access_token") ?? undefined' | Set-Content ./src/utils/apiClient.ts

# Fix null issue in AuthContext.tsx
(Get-Content ./src/contexts/AuthContext.tsx) -replace 'localStorage\.getItem\("access_token"\)', 'localStorage.getItem("access_token") ?? undefined' | Set-Content ./src/contexts/AuthContext.tsx
