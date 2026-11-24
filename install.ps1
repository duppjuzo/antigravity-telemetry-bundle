param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$PassThruArgs
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

function Find-Python38 {
    $candidates = @()
    if ($env:ANTIGRAVITY_TELEMETRY_PYTHON) {
        $candidates += ,@($env:ANTIGRAVITY_TELEMETRY_PYTHON, @())
    }
    $candidates += ,@("python", @())
    $candidates += ,@("py", @("-3"))
    $candidates += ,@("python3", @())

    $roots = @(
        "C:\",
        (Join-Path $env:LOCALAPPDATA "Programs\Python"),
        $env:ProgramFiles
    )
    foreach ($root in $roots) {
        if ($root -and (Test-Path $root)) {
            Get-ChildItem -Path $root -Directory -Filter "Python3*" -ErrorAction SilentlyContinue |
                Sort-Object Name -Descending | ForEach-Object {
                    $exe = Join-Path $_.FullName "python.exe"
                    if (Test-Path $exe) {
                        $candidates += ,@($exe, @())
                    }
                }
        }
    }

    foreach ($cand in $candidates) {
        $exe = $cand[0]
        $prefix = $cand[1]
        try {
            $cmdObj = Get-Command $exe -ErrorAction SilentlyContinue
            if (-not $cmdObj -and -not (Test-Path $exe)) { continue }
            $resolved = if ($cmdObj) { $cmdObj.Source } else { $exe }
            & $resolved @prefix -c "import sys, sqlite3; assert sys.version_info >= (3, 8)" 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) {
                return ,@($resolved, $prefix)
            }
        } catch {}
    }
    return $null
}

$found = Find-Python38
if (-not $found) {
    Write-Error "Python 3.8+ (with sqlite3) was not found. Install Python 3 from https://www.python.org/downloads/ and retry."
    exit 1
}

$pyExe = $found[0]
$pyPrefix = $found[1]
& $pyExe @pyPrefix (Join-Path $ScriptDir "deploy.py") install @PassThruArgs
exit $LASTEXITCODE
