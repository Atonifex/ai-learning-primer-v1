# Read PROJECT_MEMORY.md before edits; preserve V1 and original source mixes.
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$productionRoot = Join-Path $projectRoot 'public/cinematics/prologue-v3'
$paths = Get-Content -Raw (Join-Path $productionRoot 'tool-paths.json') | ConvertFrom-Json
$shots = (Get-Content -Raw (Join-Path $productionRoot 'shots.json') | ConvertFrom-Json).scenes
foreach ($shot in $shots) {
  $source = Join-Path $productionRoot ('sources/' + $shot.id + '.mp4')
  if (!(Test-Path $source)) { throw ('Missing video: '+$shot.id) }
  $edit = Join-Path $productionRoot ('sources/' + $shot.id + '-edit.mp4')
  $videoFilter = 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24'
  if ($shot.audio) {
    & $paths.ffmpeg -hide_banner -loglevel error -y -i $source -t $shot.duration -vf $videoFilter -af 'loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,afade=t=in:d=0.02' -c:v libx264 -crf 19 -preset fast -c:a aac -ar 48000 -ac 2 -b:a 192k $edit
    & $paths.ffmpeg -hide_banner -loglevel error -y -i $source -vn -ar 48000 -ac 1 -c:a pcm_s16le (Join-Path $productionRoot ('audio/'+$shot.id+'.wav'))
  } else {
    & $paths.ffmpeg -hide_banner -loglevel error -y -i $source -f lavfi -i 'anullsrc=r=48000:cl=stereo' -t $shot.duration -vf $videoFilter -map 0:v:0 -map 1:a:0 -c:v libx264 -crf 19 -preset fast -c:a aac -ar 48000 -ac 2 -b:a 192k $edit
  }
  if ($LASTEXITCODE) { throw ('Normalization failed: '+$shot.id) }
  & $paths.ffmpeg -hide_banner -loglevel error -y -i $edit -vf 'fps=1,scale=480:-1,tile=5x1' -frames:v 1 (Join-Path $productionRoot ($shot.id+'-review.jpg'))
}
# Guarantee matching endpoints by playing the subtle silent motion forward then backward.
& $paths.ffmpeg -hide_banner -loglevel error -y -i (Join-Path $productionRoot 'sources/wait-edit.mp4') -filter_complex '[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0[v]' -map '[v]' -an -c:v libx264 -crf 19 -preset fast -movflags +faststart (Join-Path $productionRoot 'waiting-loop.mp4')
if ($LASTEXITCODE) { throw 'Loop assembly failed' }
$manifest = Get-Content -Raw (Join-Path $productionRoot 'shots.json') | ConvertFrom-Json
foreach ($editSpec in $manifest.edits.PSObject.Properties) {
  $concat = @($editSpec.Value | ForEach-Object { "file 'sources/$_-edit.mp4'" })
  $listPath = Join-Path $productionRoot ($editSpec.Name+'-edit-list.txt')
  $concat | Set-Content $listPath
  & $paths.ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i $listPath -c copy -movflags +faststart (Join-Path $productionRoot ($editSpec.Name+'.mp4'))
  if ($LASTEXITCODE) { throw ('Assembly failed: '+$editSpec.Name) }
}
& $paths.ffmpeg -hide_banner -loglevel error -y -i (Join-Path $productionRoot 'preview20.mp4') -an -c:v copy -movflags +faststart (Join-Path $productionRoot 'preview20-picture.mp4')
& $paths.ffmpeg -hide_banner -loglevel error -y -i (Join-Path $productionRoot 'preview20.mp4') -vn -c:a pcm_s16le (Join-Path $productionRoot 'preview20-audio.wav')
Write-Output 'Assembled briefing, both offers, continuation, silent loop and all three review paths.'
