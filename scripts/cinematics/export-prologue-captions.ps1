$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$productionRoot = Join-Path $projectRoot 'public/cinematics/prologue-v1'
Push-Location $productionRoot
try {
  & ffmpeg -hide_banner -loglevel error -y -i prologue.en.vtt prologue.en.srt
  if ($LASTEXITCODE) { throw 'SRT export failed' }
  & ffmpeg -hide_banner -loglevel error -y -i prologue.mp4 -i prologue.en.vtt -map 0 -map 1 -c copy -c:s mov_text -metadata:s:s:0 language=eng -disposition:s:0 default prologue-softcaptions.mp4
  if ($LASTEXITCODE) { throw 'Selectable subtitle export failed' }
  & ffmpeg -hide_banner -loglevel error -y -i prologue.mp4 -vf "subtitles=prologue.en.vtt:force_style='FontName=Arial,FontSize=18,BorderStyle=3,BackColour=&H80000000,Outline=1,Shadow=0,MarginV=18'" -c:v libx264 -crf 18 -preset medium -c:a copy -movflags +faststart prologue-captioned-preview.mp4
  if ($LASTEXITCODE) { throw 'Caption preview export failed' }
} finally { Pop-Location }
