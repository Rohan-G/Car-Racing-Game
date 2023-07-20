import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import {createCube,rotateCube} from './cube';
import { createLight, moveLight } from './lighting';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

let x_speed = 0.0;
const acc = 0.05;
const friction = 0.017;
const z_rot = 0.125;
const mileagePL = 95;

let total_x = 0;

let player_box;
let mater_box;
let franc_box;
let guido_box;
let curr_angle = -1.57;

let franc_health = 100;
let guido_health = 100;
let mater_health = 100;

let fin_laps = 0;
let total_laps = 5;

let health = 100;
let fuel = 5;
let time = 0;
let fin_score = 0;

let fin_flag = 0;

let oof = false;
let ooh = false;

let started = false;
let animationFrameId = null;

let is_fw = false;
let is_bw = false;
let is_l = false;
let is_r = false;
let camToggle = false;

let startTime = 0;

let mater_rad = -1.5;
let franc_rad = 1.5;
let guido_rad = 3.5;

let mater_speed = 1.0;
let franc_speed = 2.0;
let guido_speed = 3.0;

let mater_index = 0;
let franc_index = 0;
let guido_index = 0;

let mater_laps = 0;
let franc_laps = 0;
let guido_laps = 0;

let finished = false;
let mater_flag = false;
let guido_flag = false;
let franc_flag = false;

let mater_finished = false;
let guido_finished = false;
let franc_finished = false;

let collide_guido = false;
let collide_franc = false;
let collide_mater = false;

let mater_score = 0;
let guido_score = 0;
let franc_score = 0;

let finished_arr = [];

function loadModel(url) {
	return new Promise(resolve => {
		new GLTFLoader().load(url, resolve);
	});
}

const geometry_bord1 = new THREE.BoxGeometry(0.25, 20, 41);
const bord1 = new THREE.MeshStandardMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.5
});

const bord1_cuboid = new THREE.Mesh(geometry_bord1, bord1);
bord1_cuboid.position.set(54.125, -10.37, -36.5);

const bord1_box = new THREE.Box3().setFromObject(bord1_cuboid);

const geometry_bord2 = new THREE.BoxGeometry(35, 20, 0.25);
const bord2 = new THREE.MeshStandardMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.5
});

const bord2_cuboid = new THREE.Mesh(geometry_bord2, bord2);
bord2_cuboid.position.set(36.5, -10.37, -16.125);

const bord2_box = new THREE.Box3().setFromObject(bord2_cuboid);

// 19, -20.37, 59
const geometry_bord3 = new THREE.BoxGeometry(0.25, 20, 75);
const bord3 = new THREE.MeshStandardMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.5
});

const bord3_cuboid = new THREE.Mesh(geometry_bord3, bord3);
bord3_cuboid.position.set(19.125, -10.37, 21.5);

const bord3_box = new THREE.Box3().setFromObject(bord3_cuboid);

// -47, -20.37, 59
const geometry_bord4 = new THREE.BoxGeometry(66, 20, 0.25);
const bord4 = new THREE.MeshStandardMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.5
});

const bord4_cuboid = new THREE.Mesh(geometry_bord4, bord4);
bord4_cuboid.position.set(-14, -10.37, 59.125);

const bord4_box = new THREE.Box3().setFromObject(bord4_cuboid);

// -47, -20.37, -57
const geometry_bord5 = new THREE.BoxGeometry(0.25, 20, 116);
const bord5 = new THREE.MeshStandardMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.5
});

const bord5_cuboid = new THREE.Mesh(geometry_bord5, bord5);
bord5_cuboid.position.set(-47.125, -10.37, 1);

const bord5_box = new THREE.Box3().setFromObject(bord5_cuboid);

// 54, -20.37, -57
const geometry_bord6 = new THREE.BoxGeometry(101, 20, 0.25);
const bord6 = new THREE.MeshStandardMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.5
});

const bord6_cuboid = new THREE.Mesh(geometry_bord6, bord6);
bord6_cuboid.position.set(3.5, -10.37, -57.125);

const bord6_box = new THREE.Box3().setFromObject(bord6_cuboid);

const geometry = new THREE.BoxGeometry(10, 5, 0.25);
const finish = new THREE.MeshStandardMaterial({
	color: 0x000000,
	transparent: true,
	opacity: 0.5
});

const fin_cuboid = new THREE.Mesh(geometry, finish);
fin_cuboid.position.set(9, -17.25, -7);

const fin_box = new THREE.Box3().setFromObject(fin_cuboid);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

const renderer2 = new THREE.WebGLRenderer({antialias: true});
renderer2.setSize(200, 200);
// document.body.appendChild(renderer2.domElement);
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = '10px';
renderer2.domElement.style.left = '10px';
renderer2.domElement.style.borderRadius = '50vw';
const camera_top = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera_top.position.x = 5;
camera_top.position.y = 0.4;
camera_top.position.z = 0;
// camera_top.rotation.z = curr_angle;
camera_top.lookAt(5, -20.4, 0)

camera.position.x = 5;
// camera.position.y = 3.125;
camera.position.y = -17.275;
camera.position.z = -5;
// camera.position.x = 5;
// camera.position.y = 30;
// camera.position.y = 1;
// camera.position.z = 1.5;
camera.lookAt(5, -20.375, 0);
// camera.lookAt(9,0,0);

// const controls = new OrbitControls(camera, renderer.domElement);

// const box = createCube(2);

scene.add(fin_cuboid);
scene.add(bord1_cuboid);
scene.add(bord2_cuboid);
scene.add(bord3_cuboid);
scene.add(bord4_cuboid);
scene.add(bord5_cuboid);
scene.add(bord6_cuboid);

// scene.add( box );
const light = createLight();
scene.add(light);
scene.background = new THREE.Color('#3d85c6')

scene.depthTest = false;

// function animate() {
// 	requestAnimationFrame( animate );

// 	rotateCube(box);
// 	moveLight(light);

// 	renderer.render( scene, camera );
// };

// animate();

let healthDisp = document.createElement("p");
healthDisp.innerText = "Health: " + health;
// healthDisp.style.color = "white";
healthDisp.style.fontSize = "1vw";
let fuelDisp = document.createElement("p");
fuelDisp.innerText = "Fuel: " + fuel + "L";
// fuelDisp.style.color = "white";
fuelDisp.style.fontSize = "1vw";
let lapsDisp = document.createElement("p");
lapsDisp.innerText = "Laps: " + fin_laps + "/" + total_laps;
// lapsDisp.style.color = "white";
lapsDisp.style.fontSize = "1vw";
let timeDisp = document.createElement("p");
timeDisp.innerText = "Time: " + time;
// timeDisp.style.color = "white";
timeDisp.style.fontSize = "1vw";
let scoreDisp = document.createElement("p");
scoreDisp.innerText = "Score: " + fin_score;
// scoreDisp.style.color = "white";
scoreDisp.style.fontSize = "1vw";

let myDiv = document.createElement("div");
myDiv.style.position = "absolute";
myDiv.style.top = 0;
myDiv.style.left = "90vw";
myDiv.style.color = "white";
myDiv.appendChild(healthDisp);
myDiv.appendChild(fuelDisp);
myDiv.appendChild(lapsDisp);
myDiv.appendChild(timeDisp);
myDiv.appendChild(scoreDisp);

const scene_fin = new THREE.Scene();
const camera_fin = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer_fin = new THREE.WebGLRenderer({antialias: true});
renderer_fin.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer_fin.domElement);
renderer_fin.domElement.style.position = "absolute";
renderer_fin.domElement.style.top = "0px";

// Create a plane geometry with the same aspect ratio as the screen
const planeGeometryfin = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

// Load the image as a texture
const textureLoaderfin = new THREE.TextureLoader();
const texturefin = textureLoaderfin.load('../go.jpg');

// Create a material with the texture
const materialfin = new THREE.MeshBasicMaterial({ map: texturefin });

// Create a mesh with the plane geometry and material
const planefin = new THREE.Mesh(planeGeometryfin, materialfin);

// Set the position of the plane so it is behind all other objects
planefin.position.z = -600;

scene_fin.add(planefin);

const scene_oof = new THREE.Scene();
const camera_oof = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer_oof = new THREE.WebGLRenderer({antialias: true});
renderer_oof.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer_oof.domElement);
renderer_oof.domElement.style.position = "absolute";
renderer_oof.domElement.style.top = "0px";

// Create a plane geometry with the same aspect ratio as the screen
const planeGeometryOof = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

// Load the image as a texture
const textureLoaderOof = new THREE.TextureLoader();
const textureOof = textureLoaderOof.load('../go_bg.jpg');

// Create a material with the texture
const materialOof = new THREE.MeshBasicMaterial({ map: textureOof });

// Create a mesh with the plane geometry and material
const planeOof = new THREE.Mesh(planeGeometryOof, materialOof);

// Set the position of the plane so it is behind all other objects
planeOof.position.z = -600;

// Add the plane to the scene
// scene_oof.add(planeOof);


// Create a plane geometry with the same aspect ratio as the screen
const planeGeometryOoh = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

// Load the image as a texture
const textureLoaderOoh = new THREE.TextureLoader();
const textureOoh = textureLoaderOoh.load('../go_ooh.jpg');

// Create a material with the texture
const materialOoh = new THREE.MeshBasicMaterial({ map: textureOoh });

// Create a mesh with the plane geometry and material
const planeOoh = new THREE.Mesh(planeGeometryOoh, materialOoh);

// Set the position of the plane so it is behind all other objects
planeOoh.position.z = -600;

// Add the plane to the scene
// scene_oof.add(planeOof);


let track, player, mater, francesco, guido;

let Positions = [[9.000796326710732, -20.37, 0.9999996829318346, -1.57], [9.001592653421465, -20.37, 1.9999993658636692, -1.57], [9.002388980132197, -20.37, 2.999999048795504, -1.57], [9.00318530684293, -20.37, 3.9999987317273384, -1.57], [9.003981633553662, -20.37, 4.999998414659173, -1.57], [9.004777960264395, -20.37, 5.999998097591008, -1.57], [9.005574286975127, -20.37, 6.999997780522842, -1.57], [9.00637061368586, -20.37, 7.999997463454677, -1.57], [9.007166940396592, -20.37, 8.999997146386512, -1.57], [9.007963267107325, -20.37, 9.999996829318347, -1.57], [9.008759593818057, -20.37, 10.999996512250181, -1.57], [9.00955592052879, -20.37, 11.999996195182016, -1.57], [9.010352247239522, -20.37, 12.99999587811385, -1.57], [9.011148573950255, -20.37, 13.999995561045685, -1.57], [9.011944900660987, -20.37, 14.99999524397752, -1.57], [9.01274122737172, -20.37, 15.999994926909354, -1.57], [9.013537554082452, -20.37, 16.99999460984119, -1.57], [9.014333880793185, -20.37, 17.999994292773025, -1.57], [9.015130207503917, -20.37, 18.99999397570486, -1.57], [9.01592653421465, -20.37, 19.999993658636697, -1.57], [9.016722860925382, -20.37, 20.999993341568533, -1.57], [9.017519187636115, -20.37, 21.99999302450037, -1.57], [9.018315514346847, -20.37, 22.999992707432206, -1.57], [9.01911184105758, -20.37, 23.999992390364042, -1.57], [9.019908167768312, -20.37, 24.99999207329588, -1.57], [9.020704494479045, -20.37, 25.999991756227715, -1.57], [9.021500821189777, -20.37, 26.99999143915955, -1.57], [9.02229714790051, -20.37, 27.999991122091387, -1.57], [9.023093474611242, -20.37, 28.999990805023224, -1.57], [9.023889801321975, -20.37, 29.99999048795506, -1.57], [9.024686128032707, -20.37, 30.999990170886896, -1.57], [9.02548245474344, -20.37, 31.999989853818732, -1.57], [9.026278781454172, -20.37, 32.99998953675057, -1.57], [9.027075108164905, -20.37, 33.999989219682405, -1.57], [9.027871434875637, -20.37, 34.99998890261424, -1.57], [8.900826718753692, -20.37, 35.991885893286906, 4.585], [8.65110875492596, -20.37, 36.96020450745361, 4.46], [8.40139079109823, -20.37, 37.928523121620316, 4.46], [8.151672827270499, -20.37, 38.89684173578702, 4.46], [7.901954863442768, -20.37, 39.865160349953726, 4.46], [7.652236899615037, -20.37, 40.83347896412043, 4.46], [7.283742453386718, -20.37, 41.76310891366965, 4.335], [6.802221757345044, -20.37, 42.63954363416145, 4.21], [6.215188780902981, -20.37, 43.449106654913734, 4.085], [5.531803977319645, -20.37, 44.179165015753036, 3.96], [4.7627313378909895, -20.37, 44.81832640013279, 3.835], [3.919971983932296, -20.37, 45.35661690842281, 3.71], [3.016676893293927, -20.37, 45.78563669727715, 3.585], [2.1133818026555584, -20.37, 46.21465648613149, 3.585], [1.163646593112062, -20.37, 46.52771084523446, 3.46], [0.18229156496120102, -20.37, 46.719914666016, 3.335], [-0.79906346318966, -20.37, 46.912118486797546, 3.335], [-1.7804184913405212, -20.37, 47.10432230757909, 3.335], [-2.778079621107139, -20.37, 47.17267631370014, 3.21], [-3.776478684235908, -20.37, 47.11611386375676, 3.085], [-4.760035997269914, -20.37, 46.93551759586253, 2.96], [-5.713403477298521, -20.37, 46.633705654375945, 2.835], [-6.621704143657891, -20.37, 46.21538771370029, 2.71], [-7.470764268238508, -20.37, 45.68709148538974, 2.585], [-8.2473345517718, -20.37, 45.05706085539385, 2.46], [-8.939296874713888, -20.37, 44.335127240974494, 2.335], [-9.535853396448047, -20.37, 43.532556174727745, 2.21], [-10.027695051976112, -20.37, 42.66187150971554, 2.085], [-10.407146816764266, -20.37, 41.73665998892737, 1.96], [-10.668287472933919, -20.37, 40.771359228700135, 1.835], [-10.807042007886297, -20.37, 39.78103242454398, 1.71], [-10.945796542838675, -20.37, 38.790705620387826, 1.71], [-11.084551077791053, -20.37, 37.80037881623167, 1.71], [-11.223305612743431, -20.37, 36.810052012075516, 1.71], [-11.237508808368256, -20.37, 35.81015288254592, 1.585], [-11.251712003993081, -20.37, 34.810253753016326, 1.585], [-11.265915199617906, -20.37, 33.81035462348673, 1.585], [-11.28011839524273, -20.37, 32.810455493957136, 1.585], [-11.294321590867556, -20.37, 31.81055636442754, 1.585], [-11.30852478649238, -20.37, 30.810657234897946, 1.585], [-11.322727982117206, -20.37, 29.81075810536835, 1.585], [-11.461482517069584, -20.37, 28.820431301212192, 1.71], [-11.722623173239237, -20.37, 27.855130540984955, 1.835], [-11.98376382940889, -20.37, 26.88982978075772, 1.835], [-12.363215594197044, -20.37, 25.96461825996955, 1.96], [-12.855057249725109, -20.37, 25.09393359495735, 2.085], [-13.346898905253173, -20.37, 24.223248929945147, 2.085], [-13.943455426987333, -20.37, 23.420677863698398, 2.21], [-14.63541774992942, -20.37, 22.698744249279045, 2.335], [-15.411988033462713, -20.37, 22.06871361928315, 2.46], [-16.26104815804333, -20.37, 21.540417390972607, 2.585], [-17.1693488244027, -20.37, 21.122099450296947, 2.71], [-18.07764949076207, -20.37, 20.703781509621287, 2.71], [-18.98595015712144, -20.37, 20.285463568945627, 2.71], [-19.939317637150047, -20.37, 19.98365162745904, 2.835], [-20.922874950184053, -20.37, 19.803055359564805, 2.96], [-21.906432263218058, -20.37, 19.62245909167057, 2.96], [-22.889989576252063, -20.37, 19.441862823776336, 2.96], [-23.873546889286068, -20.37, 19.261266555882102, 2.96], [-24.871945952414837, -20.37, 19.204704105938728, 3.085], [-25.870345015543606, -20.37, 19.148141655995353, 3.085], [-26.85390232857761, -20.37, 18.96754538810112, 2.96], [-27.807269808606218, -20.37, 18.66573344661453, 2.835], [-28.71557047496559, -20.37, 18.24741550593887, 2.71], [-29.564630599546206, -20.37, 17.719119277628327, 2.585], [-30.413690724126823, -20.37, 17.190823049317782, 2.585], [-31.190261007660116, -20.37, 16.56079241932189, 2.46], [-31.966831291193408, -20.37, 15.930761789325997, 2.46], [-32.743401574726704, -20.37, 15.300731159330105, 2.46], [-33.51997185826, -20.37, 14.670700529334214, 2.46], [-34.21193418120209, -20.37, 13.948766914914861, 2.335], [-34.80849070293625, -20.37, 13.146195848668114, 2.21], [-35.30033235846431, -20.37, 12.275511183655912, 2.085], [-35.67978412325247, -20.37, 11.350299662867743, 1.96], [-35.94092477942212, -20.37, 10.384998902640504, 1.835], [-36.20206543559177, -20.37, 9.419698142413267, 1.835], [-36.46320609176142, -20.37, 8.45439738218603, 1.835], [-36.72434674793107, -20.37, 7.489096621958793, 1.835], [-36.98548740410072, -20.37, 6.523795861731555, 1.835], [-37.1242419390531, -20.37, 5.533469057575397, 1.71], [-37.13844513467792, -20.37, 4.533569928045802, 1.585], [-37.152648330302746, -20.37, 3.5336707985162064, 1.585], [-37.16685152592757, -20.37, 2.5337716689866108, 1.585], [-37.18105472155239, -20.37, 1.5338725394570152, 1.585], [-37.195257917177216, -20.37, 0.5339734099274196, 1.585], [-37.20946111280204, -20.37, -0.465925719602176, 1.585], [-37.22366430842686, -20.37, -1.4658248491317716, 1.585], [-37.237867504051685, -20.37, -2.465723978661367, 1.585], [-37.25207069967651, -20.37, -3.4656231081909628, 1.585], [-37.26627389530133, -20.37, -4.465522237720558, 1.585], [-37.280477090926155, -20.37, -5.465421367250153, 1.585], [-37.29468028655098, -20.37, -6.465320496779748, 1.585], [-37.3088834821758, -20.37, -7.465219626309343, 1.585], [-37.323086677800624, -20.37, -8.465118755838938, 1.585], [-37.33728987342545, -20.37, -9.465017885368534, 1.585], [-37.35149306905027, -20.37, -10.464917014898129, 1.585], [-37.2409232892302, -20.37, -11.458785378309774, 1.46], [-37.130353509410135, -20.37, -12.452653741721418, 1.46], [-37.01978372959007, -20.37, -13.446522105133063, 1.46], [-36.90921394977, -20.37, -14.440390468544708, 1.46], [-36.79864416994993, -20.37, -15.434258831956353, 1.46], [-36.56502681911804, -20.37, -16.40658744584689, 1.335], [-36.21200741789871, -20.37, -17.342203447400273, 1.21], [-35.74509471597757, -20.37, -18.22650686183714, 1.085], [-35.27818201405643, -20.37, -19.11081027627401, 1.085], [-34.811269312135295, -20.37, -19.995113690710877, 1.085], [-34.344356610214156, -20.37, -20.879417105147745, 1.085], [-33.7708366241417, -20.37, -21.698608673448742, 0.96], [-33.099658941481856, -20.37, -22.439905185176244, 0.835], [-32.34129706549135, -20.37, -23.09173895619778, 0.71], [-31.50758497960431, -20.37, -23.643938338528006, 0.585], [-30.611532482078786, -20.37, -24.087886445493524, 0.45999999999999996], [-29.715479984553262, -20.37, -24.531834552459042, 0.45999999999999996], [-28.81942748702774, -20.37, -24.97578265942456, 0.45999999999999996], [-27.923374989502214, -20.37, -25.419730766390078, 0.45999999999999996], [-26.97896467986957, -20.37, -25.748499936263983, 0.33499999999999996], [-26.034554370236926, -20.37, -26.077269106137887, 0.33499999999999996], [-25.09014406060428, -20.37, -26.40603827601179, 0.33499999999999996], [-24.194091563078757, -20.37, -26.84998638297731, 0.45999999999999996], [-23.36037947719172, -20.37, -27.402185765307536, 0.585], [-22.60201760120121, -20.37, -28.054019536329072, 0.71], [-21.93083991854137, -20.37, -28.795316048056574, 0.835], [-21.259662235881528, -20.37, -29.536612559784075, 0.835], [-20.588484553221686, -20.37, -30.277909071511576, 0.835], [-19.917306870561845, -20.37, -31.019205583239078, 0.835], [-19.246129187902003, -20.37, -31.76050209496658, 0.835], [-18.672609201829545, -20.37, -32.57969366326758, 0.96], [-18.20569649990841, -20.37, -33.46399707770445, 1.085], [-17.852677098689078, -20.37, -34.39961307925783, 1.21], [-17.499657697469747, -20.37, -35.33522908081122, 1.21], [-17.146638296250416, -20.37, -36.2708450823646, 1.21], [-16.793618895031084, -20.37, -37.206461083917986, 1.21], [-16.440599493811753, -20.37, -38.14207708547137, 1.21], [-15.973686791890618, -20.37, -39.02638049990824, 1.085], [-15.400166805818161, -20.37, -39.84557206820924, 0.96], [-14.826646819745704, -20.37, -40.664763636510244, 0.96], [-14.253126833673248, -20.37, -41.483955204811245, 0.96], [-13.581949151013406, -20.37, -42.22525171653875, 0.835], [-12.823587275022899, -20.37, -42.87708548756029, 0.71], [-11.98987518913586, -20.37, -43.429284869890516, 0.585], [-11.093822691610335, -20.37, -43.87323297685604, 0.45999999999999996], [-10.149412381977692, -20.37, -44.20200214672994, 0.33499999999999996], [-9.20500207234505, -20.37, -44.53077131660384, 0.33499999999999996], [-8.260591762712407, -20.37, -44.85954048647774, 0.33499999999999996], [-7.316181453079764, -20.37, -45.18830965635164, 0.33499999999999996], [-6.371771143447122, -20.37, -45.51707882622554, 0.33499999999999996], [-5.427360833814479, -20.37, -45.845847996099444, 0.33499999999999996], [-4.449329919090331, -20.37, -46.05430789594554, 0.20999999999999996], [-3.4529402445880404, -20.37, -46.139205578747955, 0.08499999999999996], [-2.45655057008575, -20.37, -46.22410326155037, 0.08499999999999996], [-1.4601608955834597, -20.37, -46.30900094435278, 0.08499999999999996], [-0.4637712210811693, -20.37, -46.393898627155195, 0.08499999999999996], [0.5326184534211211, -20.37, -46.47879630995761, 0.08499999999999996], [1.5290081279234116, -20.37, -46.56369399276002, 0.08499999999999996], [2.5253978024257018, -20.37, -46.648591675562436, 0.08499999999999996], [3.521787476927992, -20.37, -46.73348935836485, 0.08499999999999996], [4.518177151430282, -20.37, -46.81838704116726, 0.08499999999999996], [5.514566825932572, -20.37, -46.903284723969676, 0.08499999999999996], [6.510956500434863, -20.37, -46.98818240677209, 0.08499999999999996], [7.507346174937153, -20.37, -47.0730800895745, 0.08499999999999996], [8.503735849439444, -20.37, -47.15797777237692, 0.08499999999999996], [9.500125523941735, -20.37, -47.24287545517933, 0.08499999999999996], [10.496515198444026, -20.37, -47.327773137981744, 0.08499999999999996], [11.492904872946317, -20.37, -47.41267082078416, 0.08499999999999996], [12.489294547448608, -20.37, -47.49756850358657, 0.08499999999999996], [13.4856842219509, -20.37, -47.582466186388984, 0.08499999999999996], [14.48207389645319, -20.37, -47.6673638691914, 0.08499999999999996], [15.478463570955482, -20.37, -47.75226155199381, 0.08499999999999996], [16.474853245457773, -20.37, -47.837159234796225, 0.08499999999999996], [17.471242919960062, -20.37, -47.92205691759864, 0.08499999999999996], [18.470310579494452, -20.37, -47.87888503238991, 6.24], [19.469378239028842, -20.37, -47.83571314718118, 6.24], [20.468445898563232, -20.37, -47.79254126197245, 6.24], [21.46751355809762, -20.37, -47.749369376763724, 6.24], [22.46658121763201, -20.37, -47.706197491554995, 6.24], [23.4656488771664, -20.37, -47.66302560634627, 6.24], [24.46471653670079, -20.37, -47.61985372113754, 6.24], [25.46378419623518, -20.37, -47.57668183592881, 6.24], [26.46285185576957, -20.37, -47.53350995072008, 6.24], [27.46191951530396, -20.37, -47.49033806551135, 6.24], [28.46098717483835, -20.37, -47.447166180302624, 6.24], [29.46005483437274, -20.37, -47.403994295093895, 6.24], [30.45912249390713, -20.37, -47.36082240988517, 6.24], [31.45819015344152, -20.37, -47.31765052467644, 6.24], [32.44408031135767, -20.37, -47.150256986796194, 6.115], [33.40140848148081, -20.37, -46.861253916416835, 5.99], [34.35873665160394, -20.37, -46.57225084603748, 5.99], [35.27256404802598, -20.37, -46.16614803941269, 5.865], [36.12863069986323, -20.37, -45.64928259501526, 5.74], [36.91357797333269, -20.37, -45.02972002523489, 5.615], [37.698525246802156, -20.37, -44.41015745545452, 5.615], [38.48347252027162, -20.37, -43.790594885674146, 5.615], [39.26841979374108, -20.37, -43.171032315893775, 5.615], [40.053367067210544, -20.37, -42.551469746113405, 5.615], [40.75494612264213, -20.37, -41.83887811763344, 5.49], [41.36220905352502, -20.37, -41.044377184483885, 5.365], [41.86567972492713, -20.37, -40.18036486799881, 5.24], [42.25750164541137, -20.37, -39.26032379140057, 5.115], [42.53156056495679, -20.37, -38.29861088797378, 4.99], [42.683579885785285, -20.37, -37.3102333659232, 4.865], [42.7111873972395, -20.37, -36.31061452590902, 4.74], [42.61395229333676, -20.37, -35.315353085598474, 4.615], [42.39339189535234, -20.37, -34.339979766893805, 4.49], [42.05294797452846, -20.37, -33.399714944211354, 4.365], [41.59793304438515, -20.37, -32.50923113562936, 4.24], [41.035447460723624, -20.37, -31.68242404315074, 4.115], [40.37426862294875, -20.37, -30.93219571492082, 3.99], [39.624714005687004, -20.37, -30.270253213081272, 3.865], [38.798480158045734, -20.37, -29.7069259289809, 3.74], [37.90846018287631, -20.37, -29.251004396478407, 3.615], [36.968542544216376, -20.37, -28.909603118601588, 3.49], [35.99339434245362, -20.37, -28.688049548107095, 3.365], [35.01824614069086, -20.37, -28.466495977612603, 3.365], [34.043097938928106, -20.37, -28.24494240711811, 3.365], [33.06794973716535, -20.37, -28.023388836623617, 3.365], [32.09280153540259, -20.37, -27.801835266129125, 3.365], [31.097639632078764, -20.37, -27.703586672384017, 3.24], [30.102477728754934, -20.37, -27.60533807863891, 3.24], [29.107315825431105, -20.37, -27.5070894848938, 3.24], [28.112153922107275, -20.37, -27.408840891148692, 3.24], [27.116992018783446, -20.37, -27.310592297403584, 3.24], [26.1173455825594, -20.37, -27.33718181685316, 3.115], [25.11769914633535, -20.37, -27.363771336302737, 3.115], [24.118052710111304, -20.37, -27.390360855752313, 3.115], [23.118406273887256, -20.37, -27.41695037520189, 3.115], [22.11875983766321, -20.37, -27.443539894651465, 3.115], [21.12359793433938, -20.37, -27.345291300906357, 3.24], [20.12843603101555, -20.37, -27.24704270716125, 3.24], [19.13327412769172, -20.37, -27.14879411341614, 3.24], [18.15812592592896, -20.37, -26.92724054292165, 3.365], [17.21820828726902, -20.37, -26.58583926504483, 3.49], [16.328188312099602, -20.37, -26.129917732542335, 3.615], [15.43816833693018, -20.37, -25.67399620003984, 3.615], [14.611934489288908, -20.37, -25.11066891593947, 3.74], [13.785700641647635, -20.37, -24.5473416318391, 3.74], [12.959466794006362, -20.37, -23.98401434773873, 3.74], [12.209912176744616, -20.37, -23.32207184589918, 3.865], [11.548733338969736, -20.37, -22.57184351766926, 3.99], [10.986247755308211, -20.37, -21.745036425190637, 4.115], [10.531232825164906, -20.37, -20.85455261660865, 4.24], [10.190788904341025, -20.37, -19.9142877939262, 4.365], [9.850344983517143, -20.37, -18.97402297124375, 4.365], [9.509901062693261, -20.37, -18.033758148561297, 4.365], [9.289340664708844, -20.37, -17.05838482985663, 4.49], [9.068780266724426, -20.37, -16.083011511151966, 4.49], [8.848219868740008, -20.37, -15.1076381924473, 4.49], [8.62765947075559, -20.37, -14.132264873742635, 4.49], [8.530424366852847, -20.37, -13.137003433432088, 4.615], [8.433189262950103, -20.37, -12.141741993121542, 4.615], [8.460796774404315, -20.37, -11.142123153107356, 4.74], [8.488404285858527, -20.37, -10.14250431309317, 4.74], [8.51601179731274, -20.37, -9.142885473078984, 4.74], [8.543619308766951, -20.37, -8.143266633064798, 4.74], [8.571226820221163, -20.37, -7.143647793050612, 4.74], [8.598834331675375, -20.37, -6.144028953036427, 4.74], [8.626441843129587, -20.37, -5.144410113022242, 4.74], [8.6540493545838, -20.37, -4.144791273008057, 4.74], [8.681656866038011, -20.37, -3.1451724329938715, 4.74], [8.709264377492223, -20.37, -2.1455535929796863, 4.74]]
// , [8.736871888946435, -20.37, -1.1459347529655008, 4.74], [8.764479400400647, -20.37, -0.1463159129513154, 4.74], [8.79208691185486, -20.37, 0.85330292706287, 4.74], [8.819694423309071, -20.37, 1.8529217670770555, 4.74], [8.847301934763284, -20.37, 2.8525406070912407, 4.74], [8.874909446217496, -20.37, 3.852159447105426, 4.74], [8.902516957671708, -20.37, 4.851778287119611, 4.74], [8.93012446912592, -20.37, 5.851397127133796, 4.74], [8.957731980580132, -20.37, 6.8510159671479816, 4.74], [8.985339492034344, -20.37, 7.850634807162167, 4.74]];
// , [9.012947003488556, -20.37, 8.850253647176352, 4.74], [9.040554514942768, -20.37, 9.849872487190538, 4.74], [9.06816202639698, -20.37, 10.849491327204724, 4.74], [9.095769537851192, -20.37, 11.84911016721891, 4.74], [9.123377049305404, -20.37, 12.848729007233096, 4.74], [9.150984560759616, -20.37, 13.848347847247283, 4.74], [9.178592072213828, -20.37, 14.847966687261469, 4.74], [9.20619958366804, -20.37, 15.847585527275655, 4.74], [9.233807095122252, -20.37, 16.84720436728984, 4.74], [9.261414606576464, -20.37, 17.846823207304027, 4.74], [9.289022118030676, -20.37, 18.846442047318213, 4.74], [9.316629629484888, -20.37, 19.8460608873324, 4.74]]

// console.log(Positions.length);

// for(let i=0;i<Positions.length;i+=5){
// 	const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
// 	const check = new THREE.MeshStandardMaterial({
// 		color: 0xffffff,
// 		transparent: true,
// 		opacity: 0.5
// 	});

// 	const check_cube = new THREE.Mesh(geo, check);
// 	check_cube.position.set(Positions[i][0], Positions[i][1], Positions[i][2]);

// 	scene.add(check_cube); 
// }

let last = 0;
let canisters = []
// Math.floor(Math.random() * 25)
for (let i = 94 + Math.floor(Math.random() * 6); i < Positions.length; i += 100) {
	last = i;
	console.log(i);
	const loader = new GLTFLoader();

	loader.load('../jerry_can.glb', function (gltf) {

		scene.add(gltf.scene);
		let dist = Math.random() * 4;
		let sign = Math.floor(Math.random() * 2);
		if (sign === 0) {
			sign = -1;
		}
		const angle = Positions[i][3] + 1.57
		gltf.scene.position.set(Positions[i][0] + sign * Math.cos(angle) * dist, Positions[i][1] + 1, Positions[i][2] - sign * Math.sin(angle) * dist);
		gltf.scene.scale.set(0.03, 0.03, 0.03);
		gltf.scene.rotation.y = angle;
		const box = new THREE.Box3().setFromObject(gltf.scene)
		canisters.push([gltf.scene, box]);

		// console.log(Positions[i]);

	}, undefined, function (error) {

		console.error(error);

	});
}

// console.log(last);

let p1 = loadModel('../track_with_audience.glb').then(result => {
	// console.log(result);
	track = result.scene;
});

let p2 = loadModel('../lighting_mcqueen/scene.gltf').then(result => {
	player = result.scene;
});

let p3 = loadModel('../mater.glb').then(result => {
	mater = result.scene;
});

let p4 = loadModel('../francesco.glb').then(result => {
	francesco = result.scene;
});

let p5 = loadModel('../guido.glb').then(result => {
	guido = result.scene;
})

// Promise.all([p1, p2]).then(()=>{
Promise.all([p1, p2, p3, p4]).then(() => {
	// console.clear();

	track.position.set(0, 0, 0);
	player.position.set(5, -20.37, 0);
	// player.position.set(9,0,0);
	player.scale.set(0.3, 0.3, 0.3);
	player_box = new THREE.Box3().setFromObject(player);
	// player_box = new THREE.Box3Helper(player,0xffffff);
	// scene.add(player_box);

	mater.position.set(7.5, -20.37, 0);
	mater.scale.set(0.3, 0.3, 0.3);
	mater_box = new THREE.Box3().setFromObject(mater);
	// mater_box = new THREE.Box3Helper(mater,0xffffff);
	// scene.add(mater_box);

	francesco.position.set(10, -20.37, 0);
	francesco.scale.set(0.007, 0.007, 0.007);
	franc_box = new THREE.Box3().setFromObject(francesco);
	// franc_box = new THREE.Box3Helper(francesco,0xfffff);
	// scene.add(franc_box);

	guido.position.set(12.5, -20.37, 0);
	guido.scale.set(0.007, 0.007, 0.007);
	guido_box = new THREE.Box3().setFromObject(guido);
	// guido_box = new THREE.Box3Helper(guido, 0xffffff);
	// scene.add(guido_box);

	p1.depthTest = false;
	p2.depthTest = false;
	p3.depthTest = false;

	track.renderOrder = 0;
	player.renderOrder = 1;

	scene.add(track);
	scene.add(player);
	scene.add(mater);
	scene.add(francesco);
	scene.add(guido);

	// console.log(player.position);
})

function accfw() {
	if (x_speed >= 0) {
		x_speed += acc;
	}
	else {
		x_speed += 5 * acc;
	}
}
function accbw() {
	if (x_speed > 0) {
		x_speed -= 5 * acc;
	}
	else {
		x_speed -= acc;
	}
}

function fw(speed) {
	total_x += Math.abs(speed);
	// console.log(total_x);
	if (total_x > mileagePL) {
		fuel -= Math.floor(total_x / mileagePL);
		fuelDisp.textContent = "Fuel: " + fuel + "L";
		total_x = total_x % mileagePL;

		if (fuel <= 0) {
			oof = true;
			scene_oof.add(planeOof);
			cancelAnimationFrame(animationFrameId);
			document.body.removeChild(renderer.domElement);
			document.body.removeChild(renderer2.domElement);
			document.body.removeChild(myDiv);
			document.body.appendChild(renderer_oof.domElement);
			// myDiv.style.color = "blue";
			myDiv.style.top = "70vh";
			myDiv.style.left = "50vw";
			document.body.appendChild(myDiv);
			animate();
		}
	}
	if(time>0){
		fin_score += Math.abs(x_speed)*health/(100*time);
		scoreDisp.textContent = "Score: " + fin_score;
	}
	// console.log(speed);
	if (x_speed > 0) {
		speed -= friction;
		// console.log(speed);
		if (speed < 0) {
			speed = 0;
		}
	}
	else if (speed < 0) {
		speed += friction;
		if (speed > 0) {
			speed = 0;
		}
	}
	player.position.x += speed * Math.cos(curr_angle);
	// mater.position.x += speed * Math.cos(curr_angle);
	camera_top.position.x = player.position.x;
	player.position.z -= speed * Math.sin(curr_angle);
	// mater.position.z -= speed * Math.sin(curr_angle);
	camera_top.position.z = player.position.z;
	camera.position.x += speed * Math.cos(curr_angle);
	camera_top.lookAt(player.position);
	camera.position.z -= speed * Math.sin(curr_angle);
	// console.log(player.position.x, player.position.y, player.position.z);
	// console.log(curr_angle);
	return speed;
}

// function bw() {
// 	player.position.x -= x_speed * Math.cos(curr_angle);
// 	player.position.z += x_speed * Math.sin(curr_angle);
// 	camera.position.x -= x_speed * Math.cos(curr_angle);
// 	camera.position.z += x_speed * Math.sin(curr_angle);
// }

function moveLeft() {
	player.rotation.y += z_rot;
	curr_angle += z_rot;
	if (curr_angle > 6.28) {
		curr_angle -= 6.28;
	}
	if (!camToggle) {
		camera.position.x = player.position.x - 5 + 10 * Math.sin(curr_angle / 2) * Math.sin(curr_angle / 2);
		camera.position.z = player.position.z + 10 * Math.sin(curr_angle / 2) * Math.cos(curr_angle / 2);
		camera.lookAt(player.position);
	}
	else {
		camera.position.x = player.position.x + 1.5 * Math.cos(curr_angle);
		camera.position.z = player.position.z - 1.5 * Math.sin(curr_angle);
		// camera.lookAt(camera.position.x + 5.5*Math.cos(curr_angle), 0, camera.position.z - 5.5*Math.sin(curr_angle));
		// camera.lookAt(player.position);
		camera.lookAt(player.position.x + 7 * Math.cos(curr_angle), player.position.y, player.position.z - 7 * Math.sin(curr_angle));
	}
	// camera_top.rotation.z = curr_angle;
	// camera.rotateY(z_rot);
}

function moveRight() {
	player.rotation.y -= z_rot;
	curr_angle -= z_rot;
	if (curr_angle < 0) {
		curr_angle += 6.28
	}
	if (!camToggle) {
		camera.position.x = player.position.x - 5 + 10 * Math.sin(curr_angle / 2) * Math.sin(curr_angle / 2);
		camera.position.z = player.position.z + 10 * Math.sin(curr_angle / 2) * Math.cos(curr_angle / 2);
		camera.lookAt(player.position);
	}
	else {
		camera.position.x = player.position.x + 1.5 * Math.cos(curr_angle);
		camera.position.z = player.position.z - 1.5 * Math.sin(curr_angle);
		// camera.lookAt(camera.position.x + 5.5*Math.cos(curr_angle), 0, camera.position.z - 5.5*Math.sin(curr_angle));
		// camera.lookAt(player.position);
		camera.lookAt(player.position.x + 7 * Math.cos(curr_angle), player.position.y, player.position.z - 7 * Math.sin(curr_angle));
	}
	// camera_top.rotation.z = curr_angle;
	// camera.rotateY(-1*z_rot);
	// camera.rotation.z -= z_rot;
}

function resetGame() {
	player.position.set(5, player.position.y, 0);
	player.rotation.y = 0;
	x_speed = 0.0;
	camera.position.x = 5;
	camera.position.y = player.position.y + 3.125;
	camera.position.z = -5
	camera.lookAt(player.position);
	curr_angle = -1.57;
	camToggle = false;
	// console.clear();
}

document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
	var keyCode = event.which;
	if (keyCode == 87 || keyCode == 38) {
		is_fw = false;
	} else if (keyCode == 83 || keyCode == 40) {
		is_bw = false;
	} else if (keyCode == 65 || keyCode == 37) {
		is_l = false;
	} else if (keyCode == 68 || keyCode == 39) {
		is_r = false;
	}
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
	var keyCode = event.which;
	if (keyCode == 87 || keyCode == 38) {
		is_fw = true;
	} else if (keyCode == 83 || keyCode == 40) {
		is_bw = true;
	} else if (keyCode == 65 || keyCode == 37) {
		is_l = true;
	} else if (keyCode == 68 || keyCode == 39) {
		is_r = true;
	} else if (keyCode == 82) {
		resetGame();
	}
	else if (keyCode == 84) {
		camToggle = !camToggle;
		if (!camToggle) {
			camera.position.x = player.position.x - 5 + 10 * Math.sin(curr_angle / 2) * Math.sin(curr_angle / 2);
			camera.position.z = player.position.z + 10 * Math.sin(curr_angle / 2) * Math.cos(curr_angle / 2);
			camera.position.y = player.position.y + 3.125;
			camera.lookAt(player.position);
		}
		else {
			camera.position.x = player.position.x + 1.5 * Math.cos(curr_angle);
			camera.position.z = player.position.z - 1.5 * Math.sin(curr_angle);
			camera.position.y = player.position.y + 1;
			// camera.lookAt(camera.position.x + 5.5*Math.cos(curr_angle), 0, camera.position.z - 5.5*Math.sin(curr_angle));
			// camera.lookAt(player.position);
			camera.lookAt(player.position.x + 7 * Math.cos(curr_angle), player.position.y, player.position.z - 7 * Math.sin(curr_angle));
		}
	}

	if (keyCode == 74) {
		console.log(player_box);
		console.log(canisters[0][1]);
	}

	// console.log(player.position);
	// animate();
};


const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer1 = new THREE.WebGLRenderer({antialias: true});
renderer1.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer1.domElement);
renderer1.domElement.style.position = "absolute";
renderer1.domElement.style.top = "0px";

// Create a CSS2DRenderer to display HTML content
const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = 0;
document.body.appendChild(cssRenderer.domElement);

// Create a plane geometry with the same aspect ratio as the screen
const planeGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

// Load the image as a texture
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../backg.jpg');

// Create a material with the texture
const material = new THREE.MeshBasicMaterial({ map: texture });

// Create a mesh with the plane geometry and material
const plane = new THREE.Mesh(planeGeometry, material);

// Set the position of the plane so it is behind all other objects
plane.position.z = -600;

// Add the plane to the scene
scene1.add(plane);

let myObject;

// Create a div element with some text in it
const button = document.createElement('button');
button.id = 'myDiv';
// myDiv.style.color = 'white';
// myDiv.style.width = '30px';
// myDiv.style.height = '30px';
button.style.position = 'absolute';
button.style.left = '25vw';
button.style.top = '7vh'
button.style.top = window.innerHeight / 2;
button.style.height = '10vh';
button.style.width = '15vw';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.fontSize = '1.5vw';
button.style.cursor = 'pointer';
button.textContent = 'Click to Start';
button.onclick = () => {
	started = true;
	// myObject.position.set(0, 0, -10000);
	// plane.position.z = -10000;
	cancelAnimationFrame(animationFrameId);
	document.body.removeChild(cssRenderer.domElement);
	document.body.removeChild(renderer1.domElement);
	document.body.appendChild(renderer.domElement);
	document.body.appendChild(renderer2.domElement);
	document.body.appendChild(myDiv);
	animate();
}

// Create a CSS2DObject from the div element, and position it in the scene
myObject = new CSS2DObject(button);
myObject.position.set(0, 0, -100);
scene1.add(myObject);
// scene1.add(button);

button.onmouseover = function () {
	button.style.color = 'white';
	button.style.background = '#063970';
}
button.onmouseout = function () {
	button.style.background = 'white';
	button.style.color = '#063970';
}

// Animate the scene
function animate() {
	if (!started) {
		animationFrameId = requestAnimationFrame(animate);
		renderer1.render(scene1, camera1);
		cssRenderer.render(scene1, camera1);
	}
	else {
		if (oof || ooh) {
			animationFrameId = requestAnimationFrame(animate);
			renderer_oof.render(scene_oof, camera_oof);
		}
		else if (finished) {
			console.log("ended");
			animationFrameId = requestAnimationFrame(animate);
			renderer_fin.render(scene_fin,camera_fin);
		}
		else {
			if (startTime == 0) {
				startTime = Date.now();
			}
			animationFrameId = requestAnimationFrame(animate);

			if (is_bw) {
				accbw();
				// fw(-1 * x_speed);
			}
			if (is_fw) {
				accfw();
				// fw(x_speed);
			}
			if (is_l) {
				moveLeft();
			}
			if (is_r) {
				moveRight();
			}

			x_speed = fw(x_speed);

			let k = Math.floor(Math.random()*3) - 1;
			mater_speed += k;
			if(mater_speed < 1){
				mater_speed = 1;
			}
			mater_speed %= 3;
			if(time>0){
				mater_score += mater_health*Math.abs(mater_speed)/(100*time);
			}

			k = Math.floor(Math.random()*3) - 1;
			franc_speed += k;
			if(franc_speed < 1){
				franc_speed = 1;
			}
			franc_speed %= 3;
			if(time>0){
				franc_score += franc_health*Math.abs(franc_speed)/(100*time);
			}

			k = Math.floor(Math.random()*3) - 1;
			guido_speed += k;
			if(guido_speed < 1){
				guido_speed = 1;
			}
			guido_speed %= 3;
			if(time>0){
				guido_score += guido_health*Math.abs(guido_speed)/(100*time);
			}

			mater_index = (mater_index + mater_speed)%Positions.length;
			franc_index = (franc_speed + franc_index)%Positions.length;
			guido_index = (guido_speed + guido_index)%Positions.length;

			let curr = Positions[mater_index];
			let angle = curr[3] + 1.57;
			mater.position.x = curr[0] + Math.cos(angle) * mater_rad;
			mater.position.z = curr[2] - Math.sin(angle) * mater_rad;
			mater.rotation.y = angle;
			mater_box = new THREE.Box3().setFromObject(mater);

			curr = Positions[franc_index];
			angle = curr[3] + 1.57;
			francesco.position.x = curr[0] + Math.cos(angle) * franc_rad;
			francesco.position.z = curr[2] - Math.sin(angle) * franc_rad;
			francesco.rotation.y = angle;
			franc_box = new THREE.Box3().setFromObject(francesco);

			curr = Positions[guido_index];
			angle = curr[3] + 1.57;
			guido.position.x = curr[0] + Math.cos(angle) * guido_rad;
			guido.position.z = curr[2] - Math.sin(angle) * guido_rad;
			guido.rotation.y = angle;
			guido_box = new THREE.Box3().setFromObject(guido);


			for (let i = 0; i < canisters.length; i++) {
				// console.log("Checking",i);
				// console.log(player_box);
				// console.log(canisters[i][1]);
				if (player_box.intersectsBox(canisters[i][1])) {
					// console.log(i);
					fuel = fuel + 1;
					fuelDisp.textContent = "Fuel: " + fuel + "L";
					for (let j = 0; j <= i; j++) {
						last = (last + 100) % Positions.length;
						// console.log(last);
						const curr = Positions[last];
						let canister = canisters.shift();
						// console.log(canister);
						scene.remove(canister[0]);
						const loader = new GLTFLoader();

						loader.load('../jerry_can.glb', function (gltf) {

							scene.add(gltf.scene);
							let dist = Math.random() * 4;
							let sign = Math.floor(Math.random() * 2);
							if (sign === 0) {
								sign = -1;
							}
							const angle = curr[3] + 1.57
							gltf.scene.position.set(curr[0] + sign * Math.cos(angle) * dist, curr[1] + 1, curr[2] - sign * Math.sin(angle) * dist);
							gltf.scene.scale.set(0.03, 0.03, 0.03);
							gltf.scene.rotation.y = angle;

							const canister_box = new THREE.Box3().setFromObject(gltf.scene)
							canisters.push([gltf.scene, canister_box]);

							// console.log(Positions[i]);

						}, undefined, function (error) {

							console.error(error);

						});
					}
				}
			}

			if (player_box.intersectsBox(bord1_box)) {
				health -= 1;
				if (x_speed > 0) {
					x_speed = 0;
				}
				// curr_angle = 
				healthDisp.textContent = "Health: " + health;
			}
			else if (player_box.intersectsBox(bord2_box)) {
				health -= 1;
				if (x_speed > 0) {
					x_speed = 0;
				}
				healthDisp.textContent = "Health: " + health;
			}
			else if (player_box.intersectsBox(bord3_box)) {
				health -= 1;
				if (x_speed > 0) {
					x_speed = 0;
				}
				healthDisp.textContent = "Health: " + health;
			}
			else if (player_box.intersectsBox(bord4_box)) {
				health -= 1;
				if (x_speed > 0) {
					x_speed = 0;
				}
				healthDisp.textContent = "Health: " + health;
			}
			else if (player_box.intersectsBox(bord5_box)) {
				health -= 1;
				if (x_speed > 0) {
					x_speed = 0;
				}
				healthDisp.textContent = "Health: " + health;
			}
			else if (player_box.intersectsBox(bord6_box)) {
				health -= 1;
				if (x_speed > 0) {
					x_speed = 0;
				}
				healthDisp.textContent = "Health: " + health;
			}

			if (player_box.intersectsBox(fin_box)) {
				if (fin_flag === 0) {
					fin_flag = 1;
					fin_laps++;
					lapsDisp.textContent = "Laps: " + fin_laps + "/" + total_laps;
					if(fin_laps==total_laps){
						finished_arr.push(['Player',health,fuel,time,fin_score]);
						scene.remove(player);
						finished = true;
						cancelAnimationFrame(animationFrameId);
						document.body.removeChild(renderer.domElement);
						document.body.removeChild(renderer2.domElement);
						document.body.removeChild(myDiv);
						removeEventListener("keydown", onDocumentKeyDown, false);
						removeEventListener("keyup", onDocumentKeyUp, false)
						document.body.appendChild(renderer_fin.domElement);
						let LeaderBoard = document.createElement("div");
						LeaderBoard.style.position = "absolute";
						LeaderBoard.style.top = "70vh";
						LeaderBoard.style.textAlign = "center";
						LeaderBoard.style.left = "20vw";
						// LeaderBoard.style.left = "90vw";
						LeaderBoard.style.color = "white";
						for(let i=0; i<finished_arr.length;i++){
							let current = finished_arr[i];
							let newDiv = document.createElement("div");
							newDiv.style.color = "white";
							let nameDisp1 = document.createElement("p");
							nameDisp1.innerText = "Name: " + current[0];
							nameDisp1.style.fontSize = "1vw";
							let healthDisp1 = document.createElement("p");
							healthDisp1.innerText = "Health: " + current[1];
							// healthDisp.style.color = "white";
							healthDisp1.style.fontSize = "1vw";
							let fuelDisp1 = document.createElement("p");
							fuelDisp1.innerText = "Fuel: " + current[2] + "L";
							// fuelDisp.style.color = "white";
							fuelDisp1.style.fontSize = "1vw";
							let lapsDisp1 = document.createElement("p");
							if(current[4]==-1){
								lapsDisp1.innerText = "Position: DNF";
							}
							else{
								lapsDisp1.innerText = "Position: " + (i+1);
							}
							// lapsDisp.style.color = "white";
							lapsDisp1.style.fontSize = "1vw";
							let timeDisp1 = document.createElement("p");
							timeDisp1.innerText = "Time: " + current[3];
							// timeDisp.style.color = "white";
							timeDisp1.style.fontSize = "1vw";
							let scoreDisp1 = document.createElement("p");
							scoreDisp1.innerText = "Score: " + current[4];
							// scoreDisp.style.color = "white";
							scoreDisp1.style.fontSize = "1vw";
							newDiv.appendChild(nameDisp1);
							newDiv.appendChild(healthDisp1);
							newDiv.appendChild(fuelDisp1);
							newDiv.appendChild(lapsDisp1);
							newDiv.appendChild(timeDisp1);
							newDiv.appendChild(scoreDisp1);
							newDiv.style.display = "inline-block";
							LeaderBoard.appendChild(newDiv);
						}
						if(finished_arr.length<4){
							if(!mater_finished){
								let current = ['Mater', mater_health, 5, time, mater_score]
								let newDiv = document.createElement("div");
								newDiv.style.color = "white";
								let nameDisp1 = document.createElement("p");
								nameDisp1.innerText = "Name: " + current[0];
								nameDisp1.style.fontSize = "1vw";
								let healthDisp1 = document.createElement("p");
								healthDisp1.innerText = "Health: " + current[1];
								// healthDisp.style.color = "white";
								healthDisp1.style.fontSize = "1vw";
								let fuelDisp1 = document.createElement("p");
								fuelDisp1.innerText = "Fuel: " + current[2] + "L";
								// fuelDisp.style.color = "white";
								fuelDisp1.style.fontSize = "1vw";
								let lapsDisp1 = document.createElement("p");
								lapsDisp1.innerText = "Position: DNF";
								// lapsDisp.style.color = "white";
								lapsDisp1.style.fontSize = "1vw";
								let timeDisp1 = document.createElement("p");
								timeDisp1.innerText = "Time: " + current[3];
								// timeDisp.style.color = "white";
								timeDisp1.style.fontSize = "1vw";
								let scoreDisp1 = document.createElement("p");
								scoreDisp1.innerText = "Score: " + current[4];
								// scoreDisp.style.color = "white";
								scoreDisp1.style.fontSize = "1vw";
								newDiv.appendChild(nameDisp1);
								newDiv.appendChild(healthDisp1);
								newDiv.appendChild(fuelDisp1);
								newDiv.appendChild(lapsDisp1);
								newDiv.appendChild(timeDisp1);
								newDiv.appendChild(scoreDisp1);
								newDiv.style.display = "inline-block";
								LeaderBoard.appendChild(newDiv);
							}
							if(!guido_finished){
								let current = ['Guido', guido_health, 5, time, guido_score]
								let newDiv = document.createElement("div");
								newDiv.style.color = "white";
								let nameDisp1 = document.createElement("p");
								nameDisp1.innerText = "Name: " + current[0];
								nameDisp1.style.fontSize = "1vw";
								let healthDisp1 = document.createElement("p");
								healthDisp1.innerText = "Health: " + current[1];
								// healthDisp.style.color = "white";
								healthDisp1.style.fontSize = "1vw";
								let fuelDisp1 = document.createElement("p");
								fuelDisp1.innerText = "Fuel: " + current[2] + "L";
								// fuelDisp.style.color = "white";
								fuelDisp1.style.fontSize = "1vw";
								let lapsDisp1 = document.createElement("p");
								lapsDisp1.innerText = "Position: DNF";
								// lapsDisp.style.color = "white";
								lapsDisp1.style.fontSize = "1vw";
								let timeDisp1 = document.createElement("p");
								timeDisp1.innerText = "Time: " + current[3];
								// timeDisp.style.color = "white";
								timeDisp1.style.fontSize = "1vw";
								let scoreDisp1 = document.createElement("p");
								scoreDisp1.innerText = "Score: " + current[4];
								// scoreDisp.style.color = "white";
								scoreDisp1.style.fontSize = "1vw";
								newDiv.appendChild(nameDisp1);
								newDiv.appendChild(healthDisp1);
								newDiv.appendChild(fuelDisp1);
								newDiv.appendChild(lapsDisp1);
								newDiv.appendChild(timeDisp1);
								newDiv.appendChild(scoreDisp1);
								newDiv.style.display = "inline-block";
								LeaderBoard.appendChild(newDiv);
							}
							if(!franc_finished){
								let current = ['Francesco', franc_health, 5, time, franc_score]
								let newDiv = document.createElement("div");
								newDiv.style.color = "white";
								let nameDisp1 = document.createElement("p");
								nameDisp1.innerText = "Name: " + current[0];
								nameDisp1.style.fontSize = "1vw";
								let healthDisp1 = document.createElement("p");
								healthDisp1.innerText = "Health: " + current[1];
								// healthDisp.style.color = "white";
								healthDisp1.style.fontSize = "1vw";
								let fuelDisp1 = document.createElement("p");
								fuelDisp1.innerText = "Fuel: " + current[2] + "L";
								// fuelDisp.style.color = "white";
								fuelDisp1.style.fontSize = "1vw";
								let lapsDisp1 = document.createElement("p");
								lapsDisp1.innerText = "Position: DNF";
								// lapsDisp.style.color = "white";
								lapsDisp1.style.fontSize = "1vw";
								let timeDisp1 = document.createElement("p");
								timeDisp1.innerText = "Time: " + current[3];
								// timeDisp.style.color = "white";
								timeDisp1.style.fontSize = "1vw";
								let scoreDisp1 = document.createElement("p");
								scoreDisp1.innerText = "Score: " + current[4];
								// scoreDisp.style.color = "white";
								scoreDisp1.style.fontSize = "1vw";
								newDiv.appendChild(nameDisp1);
								newDiv.appendChild(healthDisp1);
								newDiv.appendChild(fuelDisp1);
								newDiv.appendChild(lapsDisp1);
								newDiv.appendChild(timeDisp1);
								newDiv.appendChild(scoreDisp1);
								newDiv.style.display = "inline-block";
								LeaderBoard.appendChild(newDiv);
							}
						}
						document.body.appendChild(LeaderBoard);
						animate();
					}
				}
			}
			else {
				fin_flag = 0;
			}

			if (mater_box.intersectsBox(fin_box)) {
				console.log("here1");
				if (!mater_flag){
					mater_flag = true;
					mater_laps++;
					console.log(mater_laps);
					// lapsDisp.textContent = "Laps: " + fin_laps + "/" + total_laps;
					if(mater_laps==total_laps){
						finished_arr.push(['Mater',mater_health,5,time,mater_score]);
						mater_finished = true;
						scene.remove(mater);
					}
				}
			}
			else {
				mater_flag = false;
				console.log(mater_flag);
			}

			if (franc_box.intersectsBox(fin_box)) {
				if (!franc_flag){
					franc_flag = true;
					franc_laps++;
					console.log(franc_laps);
					// lapsDisp.textContent = "Laps: " + fin_laps + "/" + total_laps;
					if(franc_laps==total_laps){
						finished_arr.push(['Francesco',health,5,time,franc_score]);
						franc_finished = true;
						scene.remove(francesco);
					}
				}
			}
			else {
				franc_flag = false;
			}

			if (guido_box.intersectsBox(fin_box)) {
				if (!guido_flag){
					guido_flag = true;
					guido_laps++;
					console.log(guido_laps);
					// lapsDisp.textContent = "Laps: " + fin_laps + "/" + total_laps;
					if(guido_laps==total_laps){
						finished_arr.push(['Guido',health,5,time,guido_score]);
						guido_finished = true;
						scene.remove(guido);
					}
				}
			}
			else {
				guido_flag = false;
			}

			
			if(!guido_finished){
				if(player_box.intersectsBox(guido_box)){
					if(!collide_guido){
						collide_guido = true;
						health-=10;
						guido_health -= 10;
						if(guido_health<=0){
							finished_arr.push(['Guido',0,5,time,-1]);
							guido_finished = true;
							scene.remove(guido);
						}
						if(health<0){
							health = 0;
						}
						healthDisp.textContent = "Health: " + health;
						x_speed = 0;
						guido_speed = 0;
					}
				}
				else{
					collide_guido = false;
				}
			}

			if(!mater_finished){
				if(player_box.intersectsBox(mater_box)){
					if(!collide_mater){
						collide_mater = true;
						mater_health-=10;
						if(mater_health<=0){
							mater_finished = true;
							finished_arr.push(['Mater',0,5,time,-1]);
							scene.remove(mater);
						}
						health-=10;
						if(health<0){
							health = 0;
						}
						healthDisp.textContent = "Health: " + health;
						x_speed = 0;
						mater_speed = 0;
					}
				}
				else{
					collide_mater = false;
				}
			}

			if(!franc_finished){
				if(player_box.intersectsBox(franc_box)){
					if(!collide_franc){
						collide_franc = true;
						health-=10;
						franc_health-=10;
						if(franc_health<=0){
							finished_arr.push(['Francesco',0,5,time,-1]);
							franc_finished = true;
							scene.remove(francesco);
						}
						if(health<0){
							health = 0;
						}
						healthDisp.textContent = "Health: " + health;
						x_speed = 0;
						franc_speed = 0;
					}
				}
				else{
					collide_franc = false;
				}
			}


			if(health <= 0){
				ooh = true;
				scene_oof.add(planeOoh);
				cancelAnimationFrame(animationFrameId);
				document.body.removeChild(renderer.domElement);
				document.body.removeChild(renderer2.domElement);
				document.body.removeChild(myDiv);
				removeEventListener("keydown", onDocumentKeyDown, false);
				removeEventListener("keyup", onDocumentKeyUp, false)
				document.body.appendChild(renderer_oof.domElement);
				// myDiv.style.color = "blue";
				myDiv.style.top = "70vh";
				myDiv.style.left = "50vw";
				document.body.appendChild(myDiv);
				animate();
			}

			player_box = new THREE.Box3().setFromObject(player);

			time = Math.floor((Date.now() - startTime) / 1000);

			timeDisp.textContent = "Time: " + time;

			renderer.render(scene, camera);
			renderer2.render(scene, camera_top);
		}
	}
	// console.log(started);
}
animate();