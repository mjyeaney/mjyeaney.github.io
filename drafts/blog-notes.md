AuditLog Monitoring with Azure Functions	

Introduction

A customer wants to trigger 3rd party incident management software from events that take place in Azure (specifically Failures, but others are also important).

There is no native integration today - we do have a SIEM integration thing, but that is for a different purpose.

Customer wanted event-driven alerts pushed to thirdparties as they happened without writing custom code in each system to look for events.

Proof of concept lab was created to show event-based integration to:
- Custom web view
- Twillio integration for failures

Basic flow diagram for the solution looks like this: (TODO)

This is an excellent opportunity to take advantage of Azure Functions. (+ intro)

Getting Started

- Create ASB namespace, create topic and a default subscription.
- Create Azure Function #1 (using PS1 script + CRON schedule to poll logs, deliver to ASB)
- Create Azure Function #2 (using node JS, call Twillio API when failures are detected).
- Create Azure Web App for custom viewing (Nodejs, listen to ASB and push events over websockets to client)

Results

End result is a set of low-friction, easy to deploy applications that give extremely powerfule integration possibilities.

The Azure platform makes this not only possibly, but also easily extendable to other technicques. For example, we can also use the SB topic to feed ASA and gain even deeper insight to the behaviors within a subscription. Pulling Mahcine Learning into this mix is trivial at this point, allowing predictive scenarios, etc.

Thanks!

Links:

https://github.com/projectkudu/kudu/wiki/Azure-Web-App-sandbox
https://blogs.msdn.microsoft.com/azuresecurity/2016/07/21/microsoft-azure-log-integration-preview/
http://azure.github.io/azure-storage-node/
http://azure.github.io/azure-sdk-for-node/azure-sb/latest/ServiceBusService.html#receiveSubscriptionMessage
https://azure.github.io/projects/sdks/
