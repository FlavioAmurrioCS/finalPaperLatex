// function trainNeuralNetwork(jsonData) {
//     const neuralNetwork = ml5.neuralNetwork({
//         inputs: 34,
//         outputs: 4,
//         task: "classification",
//         debug: true,
//     });

//     const onTrainingFinished = () => {
//         // Once neural network has finished training.
//         console.log("model trained");
//         neuralNetwork.save();
//     }

//     const onDataLoaded = () => {
//         // Once the data has loaded.
//         neuralNetwork.normalizeData();
//         neuralNetwork.train({ epochs: 50 }, onTrainingFinished);
//     }

//     neuralNetwork.loadData(jsonData, onDataLoaded);
// }

function thread_sleep(time_ms) {
  return new Promise((resolve, reject) => {
    if (isNaN(time_ms)) {
      reject(new Error('Not a valid time.'));
    } else {
      setTimeout(resolve, time_ms);
    }
  });
}

function getPoseNet(videoSource) {
  return new Promise((resolve, reject) => {
    const poseNet = ml5.poseNet(videoSource, () => resolve(poseNet));
  });
}

class NeuralNetworkDataCollection {
  constructor(videoSource) {
    this.pose = null;
    this.skeleton = null;
    this.isCollecting = false;
    this.finishedTraining = false;
    this.targetLabel = ''
    this.poseNet = ml5.poseNet(video, () => console.log("PoseNet Loaded."));
    this.poseNet.on('pose', this.onPoseDetectedDataCollection);

    let options = {
      inputs: 34,
      outputs: 4,
      task: "classification",
      debug: true,
    }
    this.nnCollector = ml5.neuralNetwork(options);
  }

  onPoseDetectedDataCollection(poses) {
    console.log(poses);
    if (poses.length > 0) {
      this.pose = poses[0].pose;
      this.skeleton = poses[0].skeleton;
      if (this.isCollecting) {
        let inputs = [];
        for (let i = 0; i < this.pose.keypoints.length; i++) {
          let x = this.pose.keypoints[i].position.x;
          let y = this.pose.keypoints[i].position.y;
          inputs.push(x);
          inputs.push(y);
        }
        let target = [this.targetLabel];
        this.nnCollector.addData(inputs, target);
      }
    }
  }

  onPoseDetectedClassify(poses) {
    console.log(poses);
    if (poses.length > 0) {
      this.pose = poses[0].pose;
      this.skeleton = poses[0].skeleton;

    }
  }

  train() {
    console.log('Normalizing Data');
    this.nnCollector.normalizeData();
    console.log('Begin training...')
    this.nnCollector.train({
      epochs: 50
    }, () => {
      console.log('Finished Training');
      this.finishedTraining = true;
      this.nnCollector.save();
    });
  }

  async keyPressHandler(key) {
    if (!this.finishedTraining) {
      if (key == 's') {
        this.nnCollector.saveData();
      } else if (key == 'f') {
        console.log('Collection has been terminated!');
        this.isCollecting = false;
        this.nnCollector.saveData();
        this.train();
      } else {
        targetLabel = key;
        console.log(targetLabel);

        await thread_sleep(10000);
        console.log('Collecting for ' + targetLabel);
        this.isCollecting = true;

        await thread_sleep(10000);
        console.log('Not Collection');
        this.isCollecting = false;
      }
    }
  }
}

let video;
let poseNet;
let pose;
let skeleton;

let brain;

let state = 'waiting';
let targeLabel;


let dataCollector

function keyPressed() {
  dataCollector.keyPressHandler(key);
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.hide();

  dataCollector = new DataCollection(video)

  brain = ml5.neuralNetwork(options);
}

function collectDataWithPoseNet(videoSource) {
  let video;
  let poseNet;
  let pose;
  let skeleton;

  let brain;

  let state = 'waiting';
  let targeLabel;

  const poseNet = ml5.poseNet(video, () => console.log("PoseNet Loaded."));

  const onPoseDetected = (poses) => {
    console.log(poses);
    if (poses.length > 0) {
      pose = poses[0].pose;
      skeleton = poses[0].skeleton;
      if (state == 'collecting') {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
          let x = pose.keypoints[i].position.x;
          let y = pose.keypoints[i].position.y;
          inputs.push(x);
          inputs.push(y);
        }
        let target = [targetLabel];
        brain.addData(inputs, target);
      }
    }
  }
  poseNet.on('pose', onPoseDetected);
}


function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
}



