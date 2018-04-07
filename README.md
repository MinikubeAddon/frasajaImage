Watchpod is a minikube addon that detects file changes, then automates the build and deployment of local k8 nodes

## Internal 

in the `main` folder...
  run `npm run build`

in the root directory...
  to get started, run in separate terminal window:    
     *`minikube mount /Users/.../frasajaImage/test:/mount-9p`  
  in another terminal window run `make create`

make create:  
  (1) builds frasaja's docker image  
  (2) builds test docker image  
  (3) create kubernetes deployment/service for watchpod  
  (4) create kubernetes deployment/service for test files

when finished run `make delete` to remove kubernetes deployments and services
