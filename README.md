# Docker Images
## ESPN-BOXSCORES
- Zap Oracle that uses ESPN's api to query for the final boxscore of any basketball game passed in a query. 
- It responds with format ['awayTeam' 'awayScore' | 'homeScore' 'homeTeam'].
- It implements `https://github.com/zapproject/zap-oracle-template` using a custom Responder.ts file.
### Requirements: 
- Have Mnemonic for wallet, with ETH to fullfill queries.
- Determine information about your ESPN-Boxscores Oracle, such as... 
    + Title
    + Public key
    + Endpoint's name
    + Endpoint's curve
    + Description for md
    + Query list for endpoint
### Build image locally
- `cd ESPN-Boxscores`
- `docker build . --no-cache -t zap-espn-boxscores`
### Optional to push image to dockerhub
- `docker image push zap-espn-boxscores`
### Run image
- To run the container, create a local `Config.json` with the following format and information about the Oracle.
```

Need to replace this with our Config.json file.

```
- Mount the local config file to the container with following command: 
    + `docker run --mount type=bind,source="$(pwd)"/path_to_local_file/Config.json,target=/zap/zap-oracle-template/Oracle/Config.json zap-espn-boxscores`
### Result :
Container will:  
- Create Oralce and Endpoint if none exists in Zap Registry.
- Push information such as description and and query list to ipfs which will be displayed on zap admin site.
- Listen to query with format of ???.
    + Example: ???
- Respond with the final boxscore of a game.
