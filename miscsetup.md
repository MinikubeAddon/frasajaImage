## Pushing to Google Cloud and Pulling from Image 

[GCR Registry Guide]: https://cloud.google.com/container-registry/docs/pushing-and-pulling?hl=en_US&_ga=2.220539224.-1560723890.1520280582  
[GCR Advanced Authentication]: https://cloud.google.com/container-registry/docs/advanced-authentication
[Build Guide]: https://github.com/kubernetes/minikube/blob/master/docs/contributors/build_guide.md#fedora


[GCR Registry Guide]  
1.) Make a Google cloud platform account  
2.) Make a docker image. Tag it  
3.) Push into your cloud location   
4.) If 3.) does not work, try running gcloud docker -- push (same as normal push). May have to download gcloud  
5.) If above does not work, see [GCR Advanced Authentication] 


## Setting up Minikube from Source files and running watchpod 

Steps:  
1.) Brew Install Go  
2.) mkdir Go  
3.) cd Go && mkdir bin pkg src (should be auto made later but doing it manually just in case)  
4.) vi ~./zshrc. Press i  

add in export GOPATH="$HOME/Go"  
export PATH=$PATH:$GOPATH/bin

go to minikube folder and follow [Build Guide]

If permission denied, make sure running "go env GOPATH" leads to the correct Go directory.

run make out/minikube to create new binary (must be done before every change)
run ./out/minikube addons enable watchpod. Then ./out/minikube addons open watchpod




