$ErrorActionPreference='Stop'
$projectRoot=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$productionRoot=Join-Path $projectRoot 'public/cinematics/prologue-v3'
$paths=Get-Content -Raw (Join-Path $productionRoot 'tool-paths.json') | ConvertFrom-Json
Push-Location $productionRoot
try {
  foreach ($name in @('briefing','offer15','offer20','continuation','preview10','preview15','preview20')) {
    & $paths.ffmpeg -hide_banner -loglevel error -y -i ($name+'.en.vtt') ($name+'.en.srt')
    if ($LASTEXITCODE) { throw ('SRT failed: '+$name) }
  }
  & $paths.ffmpeg -hide_banner -loglevel error -y -i preview20.mp4 -i preview20.en.vtt -map 0 -map 1 -c copy -c:s mov_text -metadata:s:s:0 language=eng -disposition:s:0 default -movflags +faststart preview20-softcaptions.mp4
  & $paths.ffmpeg -hide_banner -loglevel error -y -i preview20.mp4 -vf "subtitles=preview20.en.vtt:force_style='FontName=Arial,FontSize=18,BorderStyle=3,BackColour=&H80000000,Outline=1,Shadow=0,MarginV=18'" -c:v libx264 -crf 19 -preset fast -c:a copy -movflags +faststart preview20-captioned.mp4
  if ($LASTEXITCODE) { throw 'Caption preview failed' }
  & $paths.ffmpeg -hide_banner -loglevel error -y -i waiting-loop.mp4 -vf 'select=eq(n\,0)+eq(n\,143),scale=640:-1,tile=2x1' -frames:v 1 waiting-loop-seam.jpg
  & $paths.ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate -show_entries format=duration,size -of json preview20.mp4
} finally { Pop-Location }
