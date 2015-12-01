This library grabs open source lat long data and inserts it into a database.

Currently supported databases:
Mongodb

You need to alter the config.json file for you purposes. 
The data/test/config/configLoadSuccess.success.json file is 
the starting point. Configure it with your own information where 
appropriate.


config.secure.json needs to hold the user/pwd information 

an example is:

"mongodb": {
		"url": "mongodb://user:ped@ds0host:port/acct",
		"user": "user",
		"pwd": "pwd"
	}
	
While the tests use this file, you can add this information into the 
json config programmatically instead of creating the file.