Alerting options

Driving Factors:

Need to react to events that happen in Azure subscription and/or forward to SIEM systems, etc.

Options:

Insights
- Add-AzureRmLogAlertRule
- Add-AzureRmMetricAlert

Policy Audit Actions
- Only on "PUT" activities (no DELETE)
- Only on resources that have Tag, Name, Location, etc.

Functions (link to 2nd post)
- Monitor audit log periodically (timer)
- Forward events onto Service Bus topic
- Create other functions to listen/react
-- Exmaple: Twillio for SMS

References:

[1]: https://blogs.msdn.microsoft.com/cloud_solution_architect/2016/02/26/retrieving-resource-metrics-and-creating-alert-rules-via-azure-powershell/
[2]: https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-policy#logical-operators
