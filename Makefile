.PHONY: build

ifndef DOCKER_TAG
DOCKER_TAG := "3.7.0"
endif

all: docker

docker:
	docker build -t jmatiastw/unleash:$(DOCKER_TAG) .

docker-push: docker
	docker push jmatiastw/unleash:$(DOCKER_TAG)

push: docker-push

chart:
	-helm push ./deploy/unleash chartmuseum
	helm push ./deploy/stolon chartmuseum
