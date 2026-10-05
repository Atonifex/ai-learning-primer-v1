$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$productionRoot = Join-Path $projectRoot 'public/cinematics/prologue-v1'
$shots = (Get-Content -Raw (Join-Path $productionRoot 'shots.json') | ConvertFrom-Json).scenes
$concat = @()
foreach ($shot in $shots) {
  $source = Join-Path $productionRoot ('sources/' + $shot.id + '.mp4')
  $normalized = Join-Path $productionRoot ('sources/' + $shot.id + '-edit.mp4')
  if (!(Test-Path $source)) { throw ('Missing source: ' + $shot.id) }
  & ffmpeg -hide_banner -loglevel error -y -i $source -t 5 -vf 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=24' -c:v libx264 -crf 18 -preset medium -c:a aac -ar 48000 -ac 2 -b:a 192k $normalized
  if ($LASTEXITCODE) { throw ('Normalize failed: ' + $shot.id) }
  & ffmpeg -hide_banner -loglevel error -y -i $normalized -vn -c:a pcm_s16le (Join-Path $productionRoot ('audio/' + $shot.id + '.wav'))
  $concat += "file 'sources/$($shot.id)-edit.mp4'"
  & ffmpeg -hide_banner -loglevel error -y -i $normalized -vf 'fps=1,scale=640:-1,tile=5x1' -frames:v 1 (Join-Path $productionRoot ($shot.id + '-review.jpg'))
}
$concat | Set-Content (Join-Path $productionRoot 'edit-list.txt')
& ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i (Join-Path $productionRoot 'edit-list.txt') -c copy -movflags +faststart (Join-Path $productionRoot 'prologue.mp4')
if ($LASTEXITCODE) { throw 'Assembly failed' }
& ffmpeg -hide_banner -loglevel error -y -i (Join-Path $productionRoot 'prologue.mp4') -an -c:v copy -movflags +faststart (Join-Path $productionRoot 'prologue-picture.mp4')
& ffmpeg -hide_banner -loglevel error -y -i (Join-Path $productionRoot 'prologue.mp4') -vn -c:a pcm_s16le (Join-Path $productionRoot 'prologue-audio.wav')
& ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate -show_entries format=duration,size -of json (Join-Path $productionRoot 'prologue.mp4')
