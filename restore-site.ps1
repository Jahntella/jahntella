$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "Restoring the original Jahntella homepage..." -ForegroundColor Magenta
$oldIndex = 'https://raw.githubusercontent.com/Jahntella/jahntella/94a40c122ffee32e92091c881a29cb8dd254a5a8/index.html'
Invoke-WebRequest -Uri $oldIndex -OutFile (Join-Path $root 'index.html') -UseBasicParsing

# Remove only the accidental root-level magazine files from the JMAG upload.
foreach ($file in @('magazine.css','magazine.js')) {
  $path = Join-Path $root $file
  if (Test-Path $path) { Remove-Item $path -Force }
}

$rootImages = Join-Path $root 'images'
if ((Test-Path (Join-Path $rootImages 'cover.png')) -and (Test-Path (Join-Path $rootImages 'back-cover.png'))) {
  Write-Host "Removing the accidental root magazine image folder..." -ForegroundColor Yellow
  Remove-Item $rootImages -Recurse -Force
}

if (-not (Test-Path (Join-Path $root 'sweeties-magazine\index.html'))) {
  throw 'The sweeties-magazine folder is missing. Extract the whole ZIP again.'
}

Write-Host "" 
Write-Host "DONE!" -ForegroundColor Green
Write-Host "Homepage restored: https://jahntella.com/"
Write-Host "Magazine page:    https://jahntella.com/sweeties-magazine/"
Write-Host "Page 8 has been corrected, and Page 9 remains Page 9."
Write-Host "Now upload ALL contents of this repaired folder to the repository root and allow index.html to overwrite."
