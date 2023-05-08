## Run with native Node.js

1. Install packages
```
yarn install
```

2. Run API server
```
// Development mode
yarn run start:dev

// Production mode
yarn run start
```

3. Open API Document
```
localhost:3000/docs
```

## Run with docker

1. Build container image
```
docker build -t (name):(version) .
```

2. Execute container
```
// Development mode
docker run -d -p (Host machine port):3000 (name):(version)

// Production mode
docker run -d -p (Host machine port):3000 (name):(version) start
```

3. Open API Document
```
localhost:(Host machine port)/docs
```