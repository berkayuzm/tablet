function initRviz(ros) {

  function addACubeToScene() {
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
   cube.position.set(2, 2, 0);
    viewer.scene.add(cube);
  }

  function handleFailedConnection() {
    console.error(
      "Failed to connect to ROS or connection closed unexpectedly."
    );
    //addACubeToScene();
  }

  ros.on("connection", function () {
    console.log("Connected to ROS.");
  });

  ros.on("error", function (error) {
    console.error("Error connecting to ROS: ", error);
    handleFailedConnection();
  });

  ros.on("close", function () {
    console.log("Connection to ROS closed.");
    handleFailedConnection();
  });
  var myMap= $("#map");
  var widthOfMap= myMap.width();
   viewer = new ROS3D.Viewer({
    divID: "map",
    width: widthOfMap,
    height: 945,
    background: "#FFFFFF",
    fixedFrame: "map",
    autoResize: true,
    antialias: true,
  });
  var controls = new ROS3D.OrbitControls({
    scene: viewer.scene,
    camera: viewer.camera,
    renderer: viewer.renderer,
    minDistance: 0.1,
    maxDistance: 1000,
    noZoom: false,
    noPan: false,
});
viewer.camera.position.set(20,20, 200);

function animate() {
  requestAnimationFrame(animate);
  viewer.renderer.render(viewer.scene, viewer.camera);
 }
 animate();
var i =0;
function createBox(color, position) {
  var height=4
  var length=4;
  var depth=4;
if(i<2){
position.x=1000;
position.y=1000;
position.z=1000;
}
  var geometry = new THREE.BoxGeometry(height,length,depth);
  var material = new THREE.MeshBasicMaterial({ color: color });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(position.x, position.y, position.z);
  viewer.scene.add(cube);
  i++
  return cube;
}
console.log("deneme")
var cubee1 = createBox(0xff0000, { x: 0, y: 0, z: 0 });
var cubee1 = createBox(0xff0000, { x: 1, y: 0, z: 0 });
var cube2 = createBox(0xffff00, { x: 500, y: 0, z: 0 });

// const ambientLight = new THREE.AmbientLight(0x404040, 2); // Genel ışık
// viewer.scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x989898, 1); // Yönlü ışık
directionalLight.position.set(10, -10, 1000).normalize();
viewer.scene.add(directionalLight);
const directionalLight2 = new THREE.DirectionalLight(0xFC7808, 1); // Yönlü ışık
directionalLight2.position.set(0, 10000, 0).normalize();
viewer.scene.add(directionalLight2);

  var grid = new ROS3D.Grid({
    color: "#cccccc",
    cellSize: 1,
    num_cells: 400,
  });

  viewer.addObject(grid);
  var d=0.1;
  // const stlLoader = new THREE.STLLoader();
  // stlLoader.load('../images/ImageToStl.com_mf7-cs_assembly.stl', function (geometry) {
  //     // Malzeme tanımlıyoruz
  //     const material = new THREE.MeshStandardMaterial({
  //       metalness: 0.5,  // Metalik görünüm (0-1 arası)
  //       roughness:1,  // Pürüzlülük (0-1 arası)
  //       flatShading:true
  //   });

  //     const mesh = new THREE.Mesh(geometry,material);
  
  //     // Modeli ölçeklendirmek gerekebilir
  //     mesh.scale.set(0.01, 0.01, 0.01); // İhtiyaca göre ölçek değiştirilebilir
  //     mesh.position.set(0, 0, 7); // Modelin konumunu ayarlayın
  //     mesh.rotation.x = Math.PI / 2; // X ekseninde 90 derece döndürme
  //     mesh.rotation.y = 0;           // Y ekseninde döndürme yok
  //     mesh.rotation.z = 0;
  //     setInterval(() => {
  //       d+=0.005;
  //       mesh.rotation.y=d;
  //     }, 1);
  //     // Modeli ROS3D Viewer sahnesine ekliyoruz
  //     viewer.scene.add(mesh);
  
  //     console.log("STL modeli başarıyla eklendi!");
  // });


  
//    const dracoLoader = new THREE.DRACOLoader();
//   console.log("dracooo==>",dracoLoader)
//   dracoLoader.setDecoderConfig({ type: 'js' });
// dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/libs/draco/'); // Eğer CDN kullanıyorsanız

// const gltfLoader = new THREE.GLTFLoader();
// gltfLoader.setDRACOLoader(dracoLoader);
// dracoLoader.preload();
// gltfLoader.load(
//   '../images/MF7_CS_Without_symphony.draco.glb',
//   (gltf) => {
//     const model = gltf.scene;

//     Modelin pozisyonunu ayarlama
//     model.position.set(0, 0, 0); // (x, y, z)

//     Modelin döndürmesini ayarlama (radyan cinsinden)
//     model.rotation.set(0, Math.PI / 2, 0); // (x, y, z)

//     Modelin ölçeğini ayarlama
//     model.scale.set(1, 1, 1); // (x, y, z)

//     Modeli sahneye ekle
//     scene.add(model);
//   },
//   (xhr) => {
//     console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
//   },
//   (error) => {
//     console.error('An error happened', error);
//   }
// );


  // OBJ Loader oluştur
// const objLoader = new THREE.OBJLoader();

// // OBJ dosyasını yükle
// objLoader.load('../img/ImageToStl.com_mf7-cs_assembly_color.obj', function (object) {
//     // Modeli ölçeklendirme (gerekirse)
//     object.scale.set(0.1, 0.1, 0.1);

//     // Modeli döndürme (gerekirse)
//     object.rotation.x = Math.PI / 2; // X ekseninde 90 derece döndür

//     // Modeli sahneye ekle
//     viewer.scene.add(object);

//     console.log("OBJ modeli başarıyla yüklendi!");
// });

  var mapClient = new ROS3D.OccupancyGridClient({
    ros: ros,
    rootObject: viewer.scene,
    topic: "/hdl_global_localization/bbs/gridmap",
  });
  
  var tfClient = new ROSLIB.TFClient({
    ros: ros,
    angularThres: 0.01,
    transThres: 0.01,
    rate: 20.0,
    fixedFrame: "map",
  });

  var targetObjectPosition = new THREE.Vector3();
  var targetCameraPosition = new THREE.Vector3();
  var targetCameraRotation = new THREE.Euler();
  var desiredDistanceX = 15; // Set to your preferred distance
  var desiredDistanceY = 15; // Set to your preferred distance
  var desiredDistanceZ = 15; // Set to your preferred distance
  var lookAtDirection = new THREE.Vector3(
    -desiredDistanceX,
    -desiredDistanceY,
    -desiredDistanceZ
  );
    viewer.cameraControls.center = new THREE.Vector3(2,0,0)
 
  // var textureLoader = new THREE.TextureLoader();
  // textureLoader.load("../img/cropped_map.png", function (texture) {
  //   var geometry = new THREE.PlaneGeometry(400, 700);
  //   var material = new THREE.MeshBasicMaterial({ map: texture });
  //   var plane = new THREE.Mesh(geometry, material);
  //   console.log(plane.position)
  //   plane.position.set(-110,50,3);
  //   console.log(plane.position)
  //   plane.rotation.z = Math.PI/2;
  //   viewer.scene.add(plane);
  // });


  tfClient.subscribe("base_link", function (tf) {
    targetObjectPosition.set(
      tf.translation.x,
      tf.translation.y,
      tf.translation.z
    );

    cube2.position.set(tf.translation.x, tf.translation.y, 5);
    viewer.cameraControls.center = new THREE.Vector3(
    tf.translation.x,
      tf.translation.y,
      2
    );

    viewer.camera.position.set(tf.translation.x + 60, tf.translation.y - 30, 320);
  });

  
}



  
  
  // viewer.renderer.domElement.addEventListener("mousedown", function(event) {
  //   const mouse = new THREE.Vector2();
  //   mouse.x = (event.clientX / viewer.renderer.domElement.clientWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / viewer.renderer.domElement.clientHeight) * 2 + 1;
  //   const raycaster = new THREE.Raycaster();
  //   raycaster.setFromCamera(mouse, viewer.camera);
  
  //   const intersects = raycaster.intersectObjects(viewer.scene.children, true);
  
  //   if (intersects.length > 0) {
  //     const point = intersects[0].point;
  //     console.log("Tıklama koordinatları:", point);
  //   } else {
  //     console.log("Alan dışı!!");
  //   }
  // });




