param(
  [Parameter(Mandatory = $true)][string]$FontFile,
  [string]$OutputFile = (Join-Path $PSScriptRoot 'wordmark-en.svg')
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$privateFonts = [System.Drawing.Text.PrivateFontCollection]::new()
$privateFonts.AddFontFile($FontFile)
$family = $privateFonts.Families[0]
$fontSize = [single]100
$font = [System.Drawing.Font]::new($family, $fontSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$bitmap = [System.Drawing.Bitmap]::new(1,1)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.PageUnit = [System.Drawing.GraphicsUnit]::Pixel
$format = [System.Drawing.StringFormat]::GenericTypographic.Clone()
$format.FormatFlags = $format.FormatFlags -bor [System.Drawing.StringFormatFlags]::NoClip -bor [System.Drawing.StringFormatFlags]::MeasureTrailingSpaces
$allPaths = [System.Drawing.Drawing2D.GraphicsPath]::new()
$lineData = @(@{word='GEUP';tracking=14.0;y=0.0}, @{word='DDONG';tracking=3.5;y=93.84})
foreach($line in $lineData) {
  $cursor = [single]0
  foreach($letter in $line.word.ToCharArray()) {
    $glyphPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $glyphPath.AddString([string]$letter, $family, 0, $fontSize, [System.Drawing.PointF]::new($cursor,[single]$line.y), $format)
    $allPaths.AddPath($glyphPath,$false)
    $advance = $graphics.MeasureString([string]$letter,$font,[System.Drawing.PointF]::new(0,0),$format).Width
    $cursor += [single]($advance + $line.tracking)
    $glyphPath.Dispose()
  }
}
$bounds = $allPaths.GetBounds()
$invariant = [System.Globalization.CultureInfo]::InvariantCulture
function N([double]$value) { $value.ToString('0.###',$invariant) }
$parts = [System.Collections.Generic.List[string]]::new()
$points=$allPaths.PathPoints
$types=$allPaths.PathTypes
for($i=0;$i -lt $points.Length;$i++) {
  $kind=$types[$i] -band 7
  if($kind -eq 0) {$parts.Add('M'+(N $points[$i].X)+' '+(N $points[$i].Y))}
  elseif($kind -eq 1) {$parts.Add('L'+(N $points[$i].X)+' '+(N $points[$i].Y))}
  elseif($kind -eq 3) {
    $parts.Add('C'+(N $points[$i].X)+' '+(N $points[$i].Y)+' '+(N $points[$i+1].X)+' '+(N $points[$i+1].Y)+' '+(N $points[$i+2].X)+' '+(N $points[$i+2].Y))
    $i+=2
  }
  if(($types[$i] -band 128) -ne 0) {$parts.Add('Z')}
}
$padding=2.5
$viewBox = (N ($bounds.X-$padding))+' '+(N ($bounds.Y-$padding))+' '+(N ($bounds.Width+2*$padding))+' '+(N ($bounds.Height+2*$padding))
$svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+$viewBox+'" fill="currentColor" color="#153B2B" role="img" aria-labelledby="en-title en-desc">'+[Environment]::NewLine+
'<title id="en-title">GEUP / DDONG</title>'+[Environment]::NewLine+
'<desc id="en-desc">Outlined from the existing Jua Regular font, retaining the two-line English wordmark and its different tracking. Optical stroke matches the current web treatment. No font installation is required to display this SVG.</desc>'+[Environment]::NewLine+
'<path fill-rule="evenodd" stroke="currentColor" stroke-width="2.232" stroke-linejoin="round" d="'+($parts -join '')+'"/>'+[Environment]::NewLine+'</svg>'
[System.IO.File]::WriteAllText($OutputFile,$svg,[System.Text.UTF8Encoding]::new($false))
Write-Output ('Exported Jua outlines: '+$OutputFile+'; viewBox='+$viewBox)
$allPaths.Dispose(); $format.Dispose(); $graphics.Dispose(); $bitmap.Dispose(); $font.Dispose(); $privateFonts.Dispose()
