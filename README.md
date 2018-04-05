# Watchpod &middot; ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

Watchpod is a minikube addon that detects file changes, then automates the build and deployment of local k8 nodes

[Minikube]: https://github.com/kubernetes/minikube
[Minikube clone]: https://github.com/MinikubeAddon/minikube
[build guide]: https://github.com/kubernetes/minikube/blob/master/docs/contributors/build_guide.md

## Demo



## Process 
Steps. 
1. Run minikube start in a terminal tab
2. Open a seperate terminal window. Mount on working directory where files are watched by running `minikube mount /"path to files":mount-9p`
`ex: minikube mount /Users/Frasaja/Github/:mount-9p`
- leave the tab used to mount open. Move back to the tab where minikube is running.
3. With minikube started, run `minikube enable frasaja`
4. Run `minikube open frasaja` 
5. The addon will now rebuild your application when a file in the mounted directory is changed

## Install on Minikube

Watchpod is currently not available on [Minikube]. We are in the process of tightening up the code for submission.
You can fork our [Minikube clone], then follow the instructions on [build guide] to run the addon from Minikube locally:

```
 ./out/minikube addons enable freshpod
```









## Internal 

in the `main` folder...
  run `npm run build`

in the root directory...
  to get started, run in separate terminal window `minikube mount /Users/.../frasajaImage/test:/mount-9p`
  <!-- minikube mount /Users/jaredweiss/frasajaImage/test:/mount-9p -->
  <!-- minikube mount /Users/jaredweiss/frasajaImage/test2:/mount-9p -->
  in another terminal window run `make create`

make create:
  (1) builds frasaja's docker image
  (2) builds test docker image
  (3) create kubernetes deployment/service for frasaja
  (4) create kubernetes deployment/service for test files


when finished run `make delete` to remove kubernetes deployments and services
