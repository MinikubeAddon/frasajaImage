# before running 'make create'
# run 'minikube mount /path/to/frasajaImage/test:/mount-9p'
# run 'minikube mount /path/to/frasajaImage/test2:/mount-9p'
# in new tab in terminal shell

.PHONY: delete
delete:
	kubectl delete deployment watchpod
	kubectl delete deployment my-deployment
	kubectl delete deployment backend-deployment
	kubectl delete deployment frontend-deployment 
	kubectl delete service watchpod
	kubectl delete service my-service
	kubectl delete service my-service2

.PHONY: create
create:
	@eval $$(minikube docker-env) ;\
	docker build -t watchpod:v1 ./main
	kubectl create -f ./main/watchpod.yaml

.PHONY: build
build:
	docker build -t kubernetes-frasaja:v1 ./main
