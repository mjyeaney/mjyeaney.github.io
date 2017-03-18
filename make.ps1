<# 

Recursive cleanup is easier out here. For exmaple, the node code would be something like:
    
    fs.readdirSync('.').filter(function(d){ return d.match("\\d{4}"); }).every(function(d){ fs.rmdirSync(d); });

Except that Node won't let us (easily) remove a folder tree that isn't empty.

#>

ls | where { $_ -match "\d{4}" } | rm -Force -Recurse
node .\generate.js