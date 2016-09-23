# Design Milestone

#### Background

Long gone are the days where each developer had dedicated build and test systems on-prem and the never ending tussles to acquire them. Virtualization allows resources to be better utilized while the advent of cloud computing has opened up a near infinite pool of compute resources available at demand and we are seeing a lot of companies embracing this new paradigm for the entire lifecycle of the project starting from development all the way to deployment. 


## Problem Statement

While traditional on-prem hardware was managed by a dedicated IT staff, the cloud based model relies more on the developer to manage his own resources bringing us to the common pain point that is provisioning of VMs. The entire process of spinning up VMs, provisioning and configuring them involves major command line bullshitery and tends to be a monotonous and time wasting task, laden with scope for messing up. The process is made multiplicatively more tiring when having to spin up entire clusters for various Big-Data or distributed applications.

Although DevOps practices have made this a lot more manageable in recent times, our approach takes this a step further providing an appliance like service for cloud provisioning through a Slack-bot. Such a solution while isolating the user from all the above mentioned issues, would also help in offloading the trivial tasks of finding the lowest pricing for the required resource, tracking utilization, potentially sharing already allocated resources with peers, etc. Not only would this afford the user greater ease of use *(allowing him to procure resources from a smartphone, while driving to work)* but also help the company save a load of cash by means of resource tracking and enabling ubiquitous access *(think of that one user who forgot to shut down his cluster before a long vacation)*.


## Bot Description

We propose a system that liberates the user from remembering (and potentially losing or exposing publically) a bunch of API keys from various services and working the command line to execute the same set of procedures to bring a VM up or worse still a cluster of them. The tool would securely store the API tokens while authorizing users based on slack-handles, providing a natural language interface to getting the required resources (akin to talking to the IT department, only simpler) and also keeping track of said resources to prevent excessive billing and to provide timely notifications, liberating the user from his desk for the entire duration of the provisioning process, allowing valuable man hours to be better spent on more value generating work (or for a quick game of foosball). **<work in progress>**


### Design Sketches



## Architecture Design



### Additional Patterns

