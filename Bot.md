## Design Summary

![](images/bot_architecture.png)	

Based on our design, there are two main components of this project. Their responsibilities are summarized below :
### Bot
1. Node.js application which handles complete interaction between the end user
2. Makes calls to the [API.AI](https://api.ai/) service to get user intent by leveraging their powerful natural language understanding platform
3. Maps intent to action and makes calls to the Provisioning Service.

Note: The Bot does not interact with a Database directly, everything via APIs of the Provisioning Service. Idea is to make the bot database agnostic.

###Provisioning Service
1. Serves Bot's requests for keys setup and provisioning.
2. Makes calls to cloud service provider APIs (AWS/DigitalOcean) to provision VMs and Cluster.
3. Maintains keys and reservation information per user in a database (Redis or MongoDB) and exposes APIs over it.


### Use Cases

####Use Case 1: Configure InfraRed bot with Cloud Service Provider Access Keys
```
1 Preconditions
    User must have an AWS/DigitalOcean account and have valid Access keys
2 Main Flow
	User will mention his/her access keys to the slack bot as a direct mention [S1]. 
	Bot validates the keys [S2]. 
	Bot saves the keys and sends the confirmation that the key has been saved [S3]
3 Subflows
    [S1] User asks bot to setup keys in natural language and provides the access keys
    [S2] Bot tests the access keys
    [S3] Bot makes the necessary API call to the Provisioning service to store keys in a database
4 Alternative Flows
    [E1] Bot could not authenticate the key
    [E2] Keys were not saved to the database
```

####Use Case 2: Set up VMs
```
1 Preconditions
    User must have configured his/her access keys
2 Main Flow
	User will describe his/her request for setting up a VM [S1]. 
	Bot will validate the configured keys [S2]
	Bot will make the request to our “provisioning service”. The provisioning service will save  reservation information in a database[S3]. 
	Bot will provide confirmation to the user once the request is fulfilled [S4]. 
	Bot asks the user if this config needs to be stored as a new template or update an existing template [S5].
	Based on user's reply, the bot will take appropriate action. [S6]

3 Subflows
    [S1] User provides a request stating his requirements (default or custom) containing parameters such as service name, OS, storage, vCPU, reservation time etc.
    [S2] Bot will validate the configured keys, by making a dry run request
    [S3] Bot checks the details for completeness and passes on the request to the “provisioning service”
    [S4] Bot provides confirmation and required details like IP address for the user to login
    [S5] Bot asks the user if this config needs to be stored as a new template or update an existing template
    [S6] Based on user's reply, the bot will prompt for a new template name if that template is not present in the datastore or the bot will prompt for an existing template name which needs to be updated with this config
4 Alternative Flows
    [E1] Missing information for certain fields in the user request in which case the bot requests for missing fields from the user.
    [E2] The service component may not provision the request due to some error in which case the bot notifies the user with the reason for failure.
    [E3] The bot is not able to save/update the template
```



####Use Case 3: Set up a cluster
```
1 Preconditions
    User must have configured his/her access keys
2 Main Flow
	User will describe his/her request for setting up a cluster [S1]. 
    Bot will authenticate the keys [S2] 
    Bot will provision the request and add the request information to a datastore [S3]. 
    Bot will provide confirmation to the user [S4]. 
    Bot asks the user if this config needs to be stored as a new template or update an existing template [S5]. 
    Based on user's reply, the bot will take appropriate action. [S6]
3 Subflows
    [S1] User provides a request stating his requirements (default or custom) with parameters like service name, OS, total memory, storage, number of nodes, reservation time etc.
    [S2] Bot authenticates the token by establishing a test connection
    [S3] Bot checks the details for completeness and passes on the request to provisioning service
    [S4] Bot provides confirmation and required details like IP address for the user to login
    [S5] Bot asks the user if this config needs to be stored as a new template or update an existing template
    [S6] Based on user's reply, the bot will prompt for a new template name if that template is not present in the datastore or the bot will prompt for an existing template name which needs to be updated with this config
4 Alternative Flows
    [E1] Missing information for certain fields in the user request in which case the bot requests for missing fields from the user.
    [E2] The service component may not provision the request due to some error in which case the bot notifies the user with the reason for failure.
    [E3] The bot is not able to save/update the template

```

####Use Case 4: Reservation extension
```
1 Preconditions
    A user must have an active reservation
2 Main Flow
    The bot will notify a user when a reservation comes close to an end [S1]. The user replies yes or no with parameters [S2] Bot will provision the request and update the request information against that reservation [S3]. Bot will provide confirmation to the user [S4].
3 Subflows
    [S1] Bot notifies a user whose reservation is coming close to an end (30 mins before the end time of the reservation).
    [S2] The user replies yes with parameters like number of hours for extension.
    [S3] Bot will provision the request and update the request information against that reservation
    [S4] Bot provides confirmation that the reservation has been extended.
4 Alternative Flows
    [E1] The user says no to extension of the reservation
    [E2] The service component is not able to extend the request
    [E3] The bot is not able to update the reservation information in the datastore
    [E4] The user does not reply anything to this notification in which case the bot tears down the reservation at the end of the reservation time.
```

####Use Case 5: User initiated tear down
```
1 Preconditions
    A user must have an active reservation
2 Main Flow
    The user informs the bot to tear down a reservation [S1]. The bot will issue the request to the service component [S2] Bot will provide confirmation [S3]
3 Subflows
    [S1] User notifies the bot to tear down a reservation of a VM or cluster
    [S2] The bot issues the request to the service component to end the request
    [S3] Bot deactivates the reservation from its datastore
    [S4] Bot provides confirmation that the reservation has been terminated.
4 Alternative Flows
    [E1] The service component is not able to terminate the reservation due to some error
    [E3] The bot is not able to deactivate the reservation information in the datastore
```

### Mocking Service Component


We have setup out Provisioning service as a Node.js server with the following endpoints.

![](images/api.png)	

The Bot makes calls to the Provisioning service which replies with the data from the following mock data file [mock.json](https://github.ncsu.edu/vramakr2/InfraRed/blob/master/provisioning_service/mock.json) 


### Bot Implementation

* **Bot Platform**: Our Bot is a Node.js application. We use Botkit to intercept and reply to messages between the User and the Node application. 
* **Bot Integration**: To have powerful natural language understanding, we have integrated our bot with API.AI which is a platform where we can train an AI to identify user intent. We have trained the AI as per our usecases mentioned above. API.AI provides a service to which we can send the intercepted messages and get an intent. The intents are then mapped to actions which are initiated by calling the provisioning service endpoints.

### Selenium Testing

To support testing of your bot, we will use Selenium to verify that the bot is returning the correct response based on a input message.

[See full example Selenium test for Slack](https://gist.github.com/chrisparnin/e3ee1a96c681f12ae11246cfe3225182)

```java
@Test
public void postMessage()
{
	driver.get("https://csc510-fall16.slack.com/");

   ...

	// Find email and password fields.
	WebElement email = driver.findElement(By.id("email"));
	WebElement pw = driver.findElement(By.id("password"));

   ...
```

Create a selenium test that demonstrates each use case. Demonstrate at least one "happy path" and one "alternative" path for each use case.

### Task Tracking

Building software is a complex process and you will have a big team of people. The only way you will make it through this process is by careful planning and delegation of work.

You will report the progress of each week (iteration). To track this, you will submit a completed iteration worksheet at the end of the iteration (include in WORKSHEET.md). This will describe the tasks completed for your use cases.

An example sheet follows:

##### Week 1

| Deliverable   | Item/Status   |  Issues/Tasks
| ------------- | ------------  |  ------------
| Use Case      | Get Meeting Availability          | &nbsp;
| Subflow      | 1             |  #33, #38, #78
| Subflow      | 2             |  [Pivotal Task](https://www.pivotaltracker.com/story/show/114636091)
| Subflow      | 3             |  [Trello Card](https://trello.com/c/diA1DaMw)
| Subflow      | &nbsp;        | &nbsp;
| Selenium Tests| Incomplete    | Get Meeting Availability, error1,...

* Github issues in a markdown referred to as `#33` will automatically turn into links when in same repo.
* You can link to trello cards by click on share inside a card to get a link.
* You can link to pivotal stories by clicking on the first button left of ID in detail view.
* You reuse the markdown of the above table for your worksheet.

#### Stories and Tasks

Advice: You should practice agile by breaking use cases down into smaller stories and tasks and plan how to test, implement, and deliver those changes each week. Because you need to deliver a use case almost every week, you might consider having tasks that separately handle different layers of system. You will find this is a common situation in an agile team. Some suggested breakdowns include:

* Design
* Reports, scrum master, planning
* Creating database tables
* Creating mocking data
* Scripting selenium
* Bot interaction
* Slack intergration
* Message conversation
* Service connections 

Finally, you may find the [SMART](https://www.mindtools.com/pages/article/smart-goals.htm) method a good way plan tasks.

### Screencast

Create a screencast of your bot performing your three use cases.
Demonstrate your selenium tests being executed.

## Deliverables

Add your code, and BOT.md document describing the following materials. [Submit here](https://goo.gl/forms/VCLtPTRzFJamFggx2).

* 3 Use Cases (10%)
* Mocking (20%)
* Bot Implementation (30%)
* Selenium testing of each use case (20%)
* Task Tracking -- WORKSHEET.md (15%)
* Screencast (5%)

BONUS: Integrate your selenium testing with travis ci + sauce labs (+15%) -- only attempt this if you've completed everything else.

Other considerations: Each team member must make contributions on a milestone (e.g., committing code, being assigned and completing tasks). Failure to perform any work will result in no credit for a team member.

DUE: THURSDAY, October 20, Midnight.
