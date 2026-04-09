$ReactProjectPath = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$ApiProjectPath   = (Resolve-Path (Join-Path $PSScriptRoot "..\testAPI")).Path

$ReactPort = "5173"
$ApiPort   = "8000"

if (-not (Test-Path $ReactProjectPath)) {
    Write-Error "React project path not found: $ReactProjectPath"
    exit 1
}

if (-not (Test-Path $ApiProjectPath)) {
    Write-Error "API project path not found: $ApiProjectPath"
    exit 1
}

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "`$env:HOST='0.0.0.0'; `$env:PORT='$ReactPort'; Set-Location '$ReactProjectPath'; npm run dev"
) -WorkingDirectory $ReactProjectPath

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$ApiProjectPath'; uvicorn test_api:app --reload --host 0.0.0.0 --port $ApiPort"
) -WorkingDirectory $ApiProjectPath