# Design Milestone

#### Background

Long gone are the days where each developer had dedicated build and test systems on-prem and the never ending tussles to acquire them. Virtualization allows resources to be better utilized while the advent of cloud computing has opened up a near infinite pool of compute resources available at demand and we are seeing a lot of companies embracing this new paradigm for the entire lifecycle of the project starting from development all the way to deployment. 


## Problem Statement

While traditional on-prem hardware was managed by a dedicated IT staff, the cloud based model relies more on the developer to manage his own resources bringing us to the common pain point that is provisioning of VMs. The entire process of spinning up VMs, provisioning and configuring them involves major command line bullshitery and tends to be a monotonous and time wasting task, laden with scope for messing up. The process is made multiplicatively more tiring when having to spin up entire clusters for various Big-Data or distributed applications.

Although DevOps practices have made this a lot more manageable in recent times, our approach takes this a step further providing an appliance like service for cloud provisioning through a Slack-bot. Such a solution while isolating the user from all the above mentioned issues, would also help in offloading the trivial tasks of finding the lowest pricing for the required resource, tracking utilization, potentially sharing already allocated resources with peers, etc. Not only would this afford the user greater ease of use *(allowing him to procure resources from a smartphone, while driving to work)* but also help the company save a load of cash by means of resource tracking and enabling ubiquitous access *(think of that one user who forgot to shut down his cluster before a long vacation)*.


## Bot Description

The Slack-Bot we propose for the problem at hand (**"InfraRed"**) would provide a natural language based interface into procuring VMs on the cloud *(akin to talking to the IT department, only simpler)* and keeping track of said resources to prevent excessive billing and to also provide timely notifications, liberating the user from his desk for the entire duration of the provisioning process, allowing valuable man hours to be better spent on more value generating work *(or for a quick game of foosball)*. 


* **API Key Management & Ubiquitous Access**

	Procuring cloud-resources often involves carefully hand-crafting REST API calls with unique access tokens. The first problem that our bot solves is of securely storing the users authorization tokens, thereby liberating him from the fear of keeping track of and even worse, exposing them publically. Since the bot is only accessible through Slack, their slack username would be enough to authenticate and run tasks on their behalf.

* **Provisioning**
	
	The core of the problem that the bot solves is that of automating the tiring process of spinning up VMs through a sequence of long-running API calls. Once spun-up, the VMs are automatically configured based on the users preferences *(setting up a certain dev/test environment or even settin up Hadoop/Spark on a cluster of such VMs)*. 
	
	We wish to further extend the functionality associated with Big-Data applications (Spark & Hadoop) by having the bot not only configure the cluster but also setup a public facing iPython Notebook or Apache Zeppelin interface, cutting down the need to SSH, making this use case accessible to even the not so technologically inclined userbase such as analysts.
	
* **Tracking**
	
	Once up and running, the bot takes up the responsibilites of tracking these resources and informing the user of various events such as a reservation-timeouts *(if the user informs the bot for how long he would need them)* or if the resources are sitting idle for extended periods of time, in an effort to prevent users from loosing track of existing resources.
	





### Design Sketches



## Architecture Design



### Additional Patterns

