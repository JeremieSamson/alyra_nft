[![Coverage Status](https://coveralls.io/repos/github/JeremieSamson/alyra_nft/badge.svg?branch=main)](https://coveralls.io/github/JeremieSamson/alyra_nft?branch=main)

# NFT Markeplace

![](docs/images/marketplace.png)

## Environments

- Contract is deployed here: [CollectionMarket](https://ropsten.etherscan.io/address/0x880E23Ac9Ede165C4FE1eCECC2DDc326287b0331) and [CollectionFactory](https://ropsten.etherscan.io/address/0x66569C50ad60F11D5E08c4E87533198Bd318B795)
- App is deployed here: [https://alyranft.herokuapp.com](https://alyranft.herokuapp.com/)
- Demo is available here: [Loom](https://www.loom.com/share/990ba29316514d5cae3b736ea2989f7a)

## Development

### Prerequisite

## Install docker and docker-compose

This template use [Docker](https://www.docker.com/), a container tool to let people have a development environment quickly. There is only 3 dependencies:

- Docker
- docker-compose
- GNU make

### Docker

To install docker, please go to the official docker installation page :
https://docs.docker.com/engine/installation/.

When docker is installed, check it with `docker -v`, you should find something like following:

```
$ docker -v
Docker version 20.10.7, build 20.10.7
```

### Docker-compose

To install docker-compose, you can also find it under docker official documentation :
https://docs.docker.com/compose/install/.

When it's installed, check it with `docker-compose -v`, you should have something like this

```
$ docker-compose -v
docker-compose version 1.25.0
```

### Clone the project

```
git clone git@github.com:JeremieSamson/solidity_docker_bootstrap.git
```

Then you can use make commands

```
// This will build images, up them and install node_modules
make install

// This will launch migration
make truffle migrate

// This will launch tests
make truffle test
```

### React

To launch react, you just need to do as follow
```
make react-start
```

Then go to [http://localhost:3000](http://localhost:3000)

## Contributors

This project has been made by a group of three for the alyra NFT project. Work repartition has been done like this:
- @Jonacity: Back/Solidity
- @NaLe3: Back/Tests
- @JSamson76: Front/React