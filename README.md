# Docker Images
## SCORACLE.BB
- Zap Oracle that uses ESPN's api to query for the final boxscore of any basketball game passed in a query. 
- It responds with format ['awayTeam' 'awayScore' | 'homeScore' 'homeTeam'].
- It implements `https://github.com/zapproject/zap-oracle-template` using a custom Responder.ts file.
### Requirements: 
- Have Mnemonic for wallet, with ETH to fullfill queries.
### Build image locally
- `cd SCORACLE.BB
- `docker build . --no-cache -t zap-scoracle.bb
### Optional to push image to dockerhub
- `docker image push zap-scoracle.bb
### Run image
- Mount the local config file to the container with following command: 
    + `docker run --mount type=bind,source="$(pwd)"/path_to_local_file/Config.json,target=/zap/zap-oracle-template/Oracle/Config.json zap-scoracle.bb
### Result :
Container will:  
- Create Oralce and Endpoint if none exists in Zap Registry.
- Push information such as description and and query list to ipfs which will be displayed on zap admin site.
- Listen to query with format of ???.
    + Example: ???
- Respond with the final boxscore of a game.
