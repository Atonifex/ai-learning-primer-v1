param([ValidateSet('submit','query','download','account')][string]$Action, [string[]]$Ids)
# Read PROJECT_MEMORY.md before production; retain costs/task IDs and update meaningful discoveries.
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$productionRoot = Join-Path $projectRoot 'public/cinematics/prologue-v3'
$paths = Get-Content -Raw (Join-Path $productionRoot 'tool-paths.json') | ConvertFrom-Json
$klingBin = 'C:/Program Files/nodejs/node.exe'
$klingEntry = 'C:/Users/iharj/AppData/Roaming/npm/node_modules/@klingai/cli-global/dist/cli.js'
if ($Action -eq 'account') {
  $response = & $klingBin $klingEntry account 2> (Join-Path $productionRoot 'account-query.log') | ConvertFrom-Json
  if (!$response.ok) { throw 'Kling account query failed; see private CLI diagnostics.' }
  $summary = @{membership=$response.body.membershipTypeDescription;remainingCredits=$response.body.availableRemainCredits;checkedAt=[DateTime]::UtcNow.ToString('o')}
  $summary | ConvertTo-Json | Set-Content (Join-Path $productionRoot 'account-latest.json')
  $summary | ConvertTo-Json
  exit
}
$manifest = Get-Content -Raw (Join-Path $productionRoot 'shots.json') | ConvertFrom-Json
foreach ($shot in $manifest.scenes | Where-Object { !$Ids -or $_.id -in $Ids }) {
  $recordPath = Join-Path $productionRoot ($shot.id + '-task.json')
  if ($Action -eq 'submit') {
    if (Test-Path $recordPath) { Write-Output ($shot.id + ': already submitted; skipped'); continue }
    $sourcePath = Join-Path $projectRoot $shot.ref
    if (!(Test-Path -LiteralPath $sourcePath)) { throw ('Missing reference: ' + $shot.id) }
    $argsForKling = @('image_to_video','--image',$sourcePath,'--model',$manifest.model,'--duration',[string]$shot.duration,'--resolution',$manifest.resolution,'--imageCount','1','--prefer_multi_shots','false','--enable_audio',([string]$shot.audio).ToLower(),'--poll','0')
    if ($shot.tail) { $argsForKling += @('--tailImage',(Join-Path $projectRoot $shot.tail)) }
    if ($shot.elements.Count -gt 0) { $argsForKling += @('--elements',(ConvertTo-Json -InputObject @($shot.elements) -Compress)) }
    $argsForKling += $shot.prompt
    $response = & $klingBin $klingEntry @argsForKling 2> (Join-Path $productionRoot ($shot.id + '-submit.log')) | ConvertFrom-Json
    if (!$response.ok) { throw ('Submission failed for ' + $shot.id + ': ' + ($response | ConvertTo-Json -Depth 10)) }
    $response.body | ConvertTo-Json -Depth 15 | Set-Content $recordPath
    Write-Output ($shot.id + ': ' + $response.body.status + ', charged ' + $response.body.creditsConsumed + ' credits')
  } else {
    if (!(Test-Path $recordPath)) { Write-Output ($shot.id + ': not submitted'); continue }
    $record = Get-Content -Raw $recordPath | ConvertFrom-Json
    $response = & $klingBin $klingEntry query_tasks $record.generationId 2> (Join-Path $productionRoot ($shot.id + '-query.log')) | ConvertFrom-Json
    if (!$response.ok) { throw ('Query failed for ' + $shot.id) }
    $response.body | ConvertTo-Json -Depth 15 | Set-Content (Join-Path $productionRoot ($shot.id + '-result.json'))
    Write-Output ($shot.id + ': ' + $response.body.status)
    if ($Action -eq 'download' -and $response.body.status -eq 'COMPLETED') {
      $work = $response.body.works[0]
      $resultUrl = if ($work.urlWithoutWatermark) { $work.urlWithoutWatermark } else { $work.url }
      $outputPath = Join-Path $productionRoot ('sources/' + $shot.id + '.mp4')
      if (!(Test-Path $outputPath)) { Invoke-WebRequest -Uri $resultUrl -OutFile $outputPath }
      Write-Output ($shot.id + ': saved source video')
    }
  }
}
