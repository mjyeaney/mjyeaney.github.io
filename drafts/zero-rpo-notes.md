Good evening all..

I wanted to take a few minutes to address some concerns around having a cross-region zero-time recovery-point-objective (RPO) within the BankMobile datastores (SQL and MongoDB). Since both RPO and RTO (recovery time objective) are utlimately business requirements, my goal is not to suggest this isn't achievable. Rather, I want to ensure we understand the implications of such `a design and plan accordingly.

First, some terminology to make sure we're on the same page:

- RTO (Recovery Time Objective): How long does it take to be up and running after a failure.
- RPO (Recovery Point Objective): How much data am I willing to lose after a failure.
- HA (High Availability): The ability of the applciation to keep running in a healthy state, without any noticable downtime (load-balancer failover, etc.).
- DR (Disaster Recovery): The ability to recover from major incidents (non-transient, wide-scale failures).

So what's interesting about a zero-time RPO? On the surface, the definition seems trivial - don't lose any data. Having a zero-time RPO also begins to describe properties of a high-availability (HA) solution. In fact, when coupled with a zero-time RTO, this exactly describes an HA solution. Only when RPO and RTO deviate from zero to get into the realm of disaster recovery (DR) - and that distinction is where things get messy.

On Azure, DR is enabled via Azure Site Recovery (ASR). ASR works by replicating data changes to a remote location, enabling orchestration of recovery infrastructure, and tracking state - all properties of a good DR plan. However, the best RPO you can achieve with ASR (depending on the workload and available network bandwidth) is somewhere between 30 seconds and 15 minutes. RTO still depends on the time it takes to deploy the new infra, so even a system with a very low RPO can still be unavailable for minutes (to hours) while the secondary region comes online (VM deployment, DNS changes, etc.).

So if DR isn't quite what we need, what about HA? High-availability within a single region is simply the clustering of resources (e.g., SQL cluster always-on, Mongo cluster with writeConcern equal to the number of replicas). However, between regions, we run into a problem: the only way to get zero RPO between regions is to have synchronous replication over the WAN link. This obviously means performance will suffer, as WAN latency is much higher than in-region. For example, the best case latency between the East and West coast of North America is about ~40ms (speed of light), but in reality can be anywhere from 75-200ms. This time would get added to *every* storage transaction (NOTE: different than application transations), potentially introducing significant latencies into the application. 

However, this isn't necessarily "bad" - it's a design decision. Azure DocumentDB (which could easily replace your MongoDB clusters with it's ability to natively speak the Mongo protocol) allows a configurable level of replication ranging from strongly consistent to eventually consistent. In the strongly consistent model, region replication is performed synchronously, sacrificing performance for enhanced data integrity. In other cases, this isn't required, and you could opt for less strict forms of replication. The point here is it's up to the business / application as to what is required.

So, if additional latency is unacceptable, we could just use asynchronous replication, right? Here's the rub: without synchronous replication, you cannot achieve an RPO of zero. Even Azure SQL DB (the PaaS offering) leveraging active geo-replication (which is asynchronous) has an RPO of ~5 seconds, with an estimated recovery time of ~30 seconds. If you're not using Active geo-replication and instead just doing restore from backups, the best you can do is RPO ~= 1 hour. For reference, on-prem solutions such as log shipping fall into the asynchronous category.

So how can we get to zero-time RPO on Azure? It is possible, but the tradeoff of course is in the cost to deploy the infrastructure to support it, the performance implications of such a topology, and a *reduced* overall availability. We would need (at a minimum):

- An identicaly sized, hot DB cluster in a second region for both SQL and MongoDB
- The ability for the application to tolerate additional latencies required for synchronous replication

However, one issue with this design is that we've effectively *reduced* your overall availability. We no longer have the ability to continue functioning in the primary region if the secondary has an outage. Why? If the primary were to continue functioning, the secondary would no longer match and we would be breaking our zero-time RPO. And of course, since we have a synchronous replication model, we wouldn't able to function anyway.

So in summary...the desire for cross-region zero RPO (i.e., synchronous replication) fundamentally goes against the desire to have the active DB be as performant as possible, and reduces the net availability of the application as a whole. It also doesn't enable having the secondary region DB server(s) be drastically smaller than production (in order to save costs). The reason for this is that in order for the secondary region to remain caught up and maintain such a tight RPO, it *must* be able to handle the same transactional workload as production (otherwise, it will fall behind and/or slow down the production server).
