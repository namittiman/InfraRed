# Milestone: SERVICE

In the previous milestone in Bot.md, we described 5 use cases and had implemented interaction with our bot by using mock data and services. In this milestone, we have implemented the internal logic required to *actually* perform the services/tasks via the bot. We have not only covered all the use cases mentioned previously, but added a few more. In this file we describe a little bit about how the service was implemented.

###Provisioning Service Summary
1. Serves Bot's requests for initial keys setup for cloud service provider (AWS/DigitalOcean)
2. Accepts provisioning requests from the bot to provision VMs and Cluster.The pricing engines decides the cheapest Cloud provider based on user request and makes calls to the chosen cloud service provider APIs (AWS/DigitalOcean)
3. Accepts requests to show active reservations, tear down current reservation (VMs or Cluster).
4. Accepts requests to save a configuration request as a template and create future reservations using these saved templates
4. Maintains keys, reservation and template information per user in a database (MongoDB) and exposes APIs over it.


### Mapping Use Case to Service Endpoint
####Use Case : Configure Access Keys
**Endpoint :** POST /users/:UserId/keys

**Action :** Tests if Cloud provided credentials are valid and then saves with the unique UserId into a MongoDB collection called keys.

####Use Case : Set up VMs
**Endpoint :** POST /users/:UserId/reservations

**Action :** Queries for the keys saved in the database, using which, makes an appropriate call to AWS or Digital Ocean to actually provision the VM/s. Waits for the state of the VM/s to be "READY" before returning success along with the IP address/s. The reservation information is also saved in the database along with a unique reservation ID.

####Use Case : Set up a cluster
**Endpoint :** POST /users/:user_Id/reservations

**Action :** Queries for the keys saved in the database, using which, makes an appropriate call to AWS to actually provision the Cluster (AWS EMR Cluster). Waits for the state of the Cluster to be "READY" before returning success along with the master's DNS name of the cluster. The cluster reservation information is also saved in the database along with a unique cluster reservation ID in a MongoDB collection reservations.

####Use Case : Show Current Reservations
**Endpoint :** GET /users/:UserId/reservations

**Action :** Queries the database for current reservations for that user and returns all of them back to the caller.

####Use Case : User initiated tear down (Delete Reservation)
**Endpoint :** DELETE /users/:UserId/reservations/:ReservationId

**Action :** Deletes VM/s or cluster with the given ReservationId  from the database and makes calls to the cloud service to actually terminate the reservation and release resources.

#### Use Case : Save Templates
**Endpoint :** POST /users/:UserId/templates/:TemplateId

**Description :** The end user of the bot can save existing reservations as a template and use them to relaunch them.
The user may do this via the following conversation:

save reservation <reservation_id> as template sandbox_vm
save reservation <reservation_id> as template sandbox_cluster

**Action :** The specified earlier reservation request is saved as a template in a MongoDB collection called templates.

#### Use Case : Create Reservation Using templates
**Endpoint :** POST /users/:UserId/templates/:TemplateId/reservations

**Description :** The end user can relaunch the reservations using templates using the following conversation:

create reservation using my template sandbox_vm
create reservation using my template sandbox_cluster

**Action :** Calls the POST /users/:user_Id/reservations API to launch VM/s or Cluster using the template queried from the database.

#### Use Case : Show Templates
**Endpoint :** GET /users/:UserId/templates

**Action :** Queries the database and returns all existing templates


### Submission

TODO  - Add screencast link
