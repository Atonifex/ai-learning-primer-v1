param([ValidateSet('submit','query','download')][string]$Action, [string[]]$Ids)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$productionRoot = Join-Path $projectRoot 'public/cinematics/prologue-v1'
$manifest = Get-Content -Raw (Join-Path $productionRoot 'shots.json') | ConvertFrom-Json
foreach ($shot in $manifest.scenes | Where-Object { $_.id -in $Ids }) {
  $recordPath = Join-Path $productionRoot ($shot.id + '-task.json')
  if ($Action -eq 'submit') {
    if (Test-Path $recordPath) { Write-Output ($shot.id + ': already submitted; skipped'); continue }
    $sourcePath = Join-Path $projectRoot ('public/cinematics/' + $shot.ref)
    if (!(Test-Path -LiteralPath $sourcePath)) { throw ('Missing reference: ' + $shot.id) }
    $response = & kling image_to_video --image $sourcePath --model $manifest.model --duration $shot.duration --resolution $manifest.resolution --imageCount 1 --prefer_multi_shots false --enable_audio true --poll 0 $shot.prompt 2> (Join-Path $productionRoot ($shot.id + '-submit.log')) | ConvertFrom-Json
    if (!$response.ok) { throw ($response | ConvertTo-Json -Depth 12) }
    $response.body | ConvertTo-Json -Depth 12 | Set-Content $recordPath
    Write-Output ($shot.id + ': ' + $response.body.status + ', charged ' + $response.body.creditsConsumed + ' credits')
  } else {
    $record = Get-Content -Raw $recordPath | ConvertFrom-Json
    $response = & kling query_tasks $record.generationId 2> (Join-Path $productionRoot ($shot.id + '-query.log')) | ConvertFrom-Json
    if (!$response.ok) { throw ($response | ConvertTo-Json -Depth 12) }
    $response.body | ConvertTo-Json -Depth 12 | Set-Content (Join-Path $productionRoot ($shot.id + '-result.json'))
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
