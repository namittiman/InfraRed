# Milestone: Deployment

*Build docker images using compose:*
	
	docker-compose build
	
	
*Run MongoDB container:*

	docker run -p 27017:27017 mongo

*Run Bot Container:*

	docker run -it infrared_bot /bin/bash
	
*Run Provisioning Service:*

	docker run -p 3001:3001 -it infrared_prov /bin/bash
