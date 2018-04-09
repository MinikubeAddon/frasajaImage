const path = require('path');
// const config = require(path.join(__dirname, '../../test2/watchpod.json'));
const directory = require("./directory.js");
const config = require(path.join(directory, '/watchpod.json'));
// ../watchpod.json --> gets mounted in main/test (a new directory spec'd in yaml & Dockerfile)
const YAML = require('yamljs');
const fs = require('fs');

// NOTE: we need to make sure our config edge cases are handled in this file
// point of this file is to adjust the user's config file to get necessary info
// as well as create the commands we will be using for each docker image

// not anymore --> TODO: parse docker-compose.yaml file to make config object

// TODO: possible todo would be somehow add a key that shows to only
// rebuild this particular docker container when this directory changes
// may be done by parsing Dockerfiles

// =================PARSE COMMAND IN WATCHPOD.JSON=================
// gives the directory in a command an absolute path
const fixPath = (str) => {
  let prev = '';
  let dir = '';
  let img = '';

  const terms = str.trim().split(' ').map((word, i) => {
    if((word.includes('.') || word.includes('/')) && !word.includes('http')){
      // dir = path.join(__dirname, '../../test2', word);
      dir = path.join(directory, word);
      return dir;
    }
    if(word.includes(':')){
      img = word;
      return img;
    }
    if(prev === '-t' || prev === '--tag'){
      img = word + ':latest';
      return img;
    }

    prev = word;
    return word;
  })

  return {
    command: terms.join(' '),
    dir: dir,
    img: img
  };
}


// ====================ADD DOCKER COMMANDS================================
// add docker commands to the already existing kubernetes commands object
// created by addKube()
// create a separate object (paths) that looks at the docker commands and Dockerfiles
// in order to determine paths that could be impacted
const addDocker = (build) => {
  return config.docker.reduce((obj, script) => {
    const fixed = fixPath(script);

    if(build[fixed.img]){
      const split = fixed.command.split(fixed.img);
      obj[fixed.img] = Object.assign({}, build[fixed.img], {
        dockerStart: split[0].trim(),
        dockerEnd: split[1].trim(),
        watchPath: fixed.dir.replace('/Dockerfile', '')
      });
    }
    return obj;
  }, {});
}


// ======================ADD KUBECTL COMMANDS===============================================
// parse yaml helps us create the necessary `kubectl set` statements for later
// parse yaml also saves the names of all of our original docker images

// search for `container` key
const search = (obj) => {
  return Object.keys(obj).reduce((cumm, key) => {
    if(key === "containers"){
      return cumm.concat(obj[key]);
    }
    if(typeof obj[key] === "object"){
      return cumm.concat(search(obj[key]));
    }
    return cumm;
  }, []);
}

// finds all the names of the docker containers we will be using
// get all yaml files and correlate docker image names with kubectl statements
const addKube = () => {
  const kubeObj = config.kubernetes.reduce((obj, kub) => {
    const fixed = fixPath(kub);
    const dir = fixed.dir;

    obj.kubernetesCreate.push(fixed.command);

    // read file and split by '---'
    const jsonArr = fs.readFileSync(dir, {
      encoding: 'utf-8'
    }).split('---').map((yamlString) => {
      return (dir.includes('.json')) ? JSON.parse(yamlString): YAML.parse(yamlString);
    });

    // go through keys until we find 'containers' key
    jsonArr.forEach((json, i) => {
      const kind = json.kind.toLowerCase();
      const kubeName = json.metadata.name;
      const containers = search(json);

      containers.forEach((container) => {
        const name = (container.image.includes(':')) ? container.image: container.image + ":latest";
        obj["docker"][name] = {
          // kubeCreate: fixed.command,
          kubeSet: `kubectl set image ${kind}/${kubeName} ${container.name}=`,
          dockerStart: '',
          dockerEnd: '',
          watchPath: '',
          newName: '',
          newImageID: '',
          oldImageIDs: {}
        };
      })

      obj.kubernetesDelete.push(`kubectl delete ${kind} ${kubeName}`);
      // obj["kubernetes"][kubeName] = (i === jsonArr.length - 1) ? {
      //   createKube: fixed.command,
      //   deleteKube: `kubectl delete ${kind} ${kubeName}`
      // } : {
      //   createKube: fixed.command,
      //   deleteKube: `kubectl delete ${kind} ${kubeName}`
      // }
    });
    return obj;
  }, {
    docker: {},
    kubernetesCreate: [],
    kubernetesDelete: []
  });

  const docker = addDocker(kubeObj.docker);
  kubeObj.docker = docker;

  return kubeObj;
}

module.exports = addKube();
