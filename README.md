# Argo Rollouts Canary demo

This repo consists of manifests and app for the Argo Rollouts Canary demo.

## Requirements

- minikube (or any other kubernetes cluster)
- kubectl
- Helm

## Steps

### Setup minikube

To start minikube cluster run 
```bash
minikube start --driver=docker
```

### Install Argo Rollouts

To install Argo Rollouts to clusterrun

```bash
helm repo add argo https://argoproj.github.io/argo-helm

helm install argo-rollouts argo/argo-rollouts --create-namespace -n argo-rollouts
```

This installs all necessary CRDs and Argo Rollouts controller to cluster, in the namespace `argo-rollouts`.

### Configuring Dashboard

Dashboard can be either as [kubectl](https://argoproj.github.io/argo-rollouts/installation/#kubectl-plugin-installation) plugin or deployed as a service.

To install kubectl plugin for Argo Rollouts visit [official documentations page](https://argoproj.github.io/argo-rollouts/installation/#kubectl-plugin-installation) or with Homebrew run

```bash
brew install argoproj/tap/kubectl-argo-rollouts 
```
and the access with

```bash
kubectl argo rollouts dashboard
```
Dashboard as a service can be installed by updating Helm

```bash
helm upgrade --set=dashboard.enabled=true argo-rollouts argo/argo-rollouts -n argo-rollouts
```
and then accessed 
```bash
kubectl port-forward -n argo-rollouts service/argo-rollouts-dashboard 3100
```

### Deploying

To deploy inital deployment, from root of this repository run 
```bash
kubectl apply -f k8s/
```

This will create service and rollout object in the cluster.
Deployed service can be accessed by running
```bash
minikube service canary
```

### How to do a rollout

Open Argo Rollouts dashboard and start monitoring. After that is set, run
```bash
kubectl argo rollouts set image canary canary=moreskovic/canary:red -n default
```
to change image to new version.
Argo Rollouts follow set steps and will set weight to 10%. This means 1 pod of new image version, and 9 of the old one.
Refreshing app (not dashboard) in browser should in most cases show "blue" and sometimes "red" (ratio 9:1).

By clicking on "Promote" button of the canary rollout on the dashboard, next step will be in use. Weight 50%.

At this moment, "red" version should be shown equally times as "blue" (1:1 ratio).

After two minutes on 50% step, Argo Rollouts will proceed to 100% and only available version will be "red"

## Cleanup

To remove everything added run
```bash
kubectl delete -f k8s/
helm uninstall argo-rollouts -n argo-rollouts
minikube stop
minikube delete
```
