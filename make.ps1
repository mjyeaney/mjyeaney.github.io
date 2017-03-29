<# 

Recursive cleanup is easier out here. For exmaple, the node code would be something like:
    
    fs.readdirSync('.').filter(function(d){ return d.match("\\d{4}"); }).every(function(d){ fs.rmdirSync(d); });

Except that Node won't let us (easily) remove a folder tree that isn't empty.

#>

ls | where { $_.Name -match "\d{4}" } | rm -Force -Recurse
Write-Host "Waiting for deletion to wrap-up..."
sleep 3
Write-Host "Generating site structure..."
node .\generate.js