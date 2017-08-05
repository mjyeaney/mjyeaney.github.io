Digging around networking with Azure Vms
Goal: Uncover some insights into the networking environment within Azure.

Steps:

Deploy a single VM
- Get-NetAdapter -IncludeHidde
- Get-NetRoute
- Discuss platform services endpoint
- Discuss KMS service
- Get-NetNeighbor

Add a second VM in a peered VNET
- Get-NetRoute
- Get-NetNeighbor

Summary:

Hope I've helped you get a better understaning of the services used by your VM's that you deploy in Azure, as well as some of the considerations you need to have when using forced tunneling or firewall appliances.
