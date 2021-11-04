import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AmbientLight, Scene } from 'three'




//////////////////    Dat GUI    //////////////////////////////
const gui = new dat.GUI({width:window.innerWidth/3})

///////////////////////////    Canva        /////////////////////////////

const canvas = document.querySelector('canvas.webgl')

//////////////////////////      Scene      /////////////////////////////
const scene = new THREE.Scene()


/////////////////////////      Text Loader       ///////////////////////


///////////////////////   Variables de config    //////////////////////////

let distanceSectionsCentre = []
distanceSectionsCentre.gap = 10
let nbDeProjets = 8
let skyColor = []
skyColor.color = '#E0FFFF'





///////////////////////   Scène 1     //////////////////////////


let centreScene1 = {
    x:0.5*distanceSectionsCentre.gap,
    y:0.5,
    z:-0.886*distanceSectionsCentre.gap
}






///////////////////////   Scène 2     //////////////////////////

let centreScene2 = {
    x:0.5*distanceSectionsCentre.gap,
    y:-0.99,
    z:0.886*distanceSectionsCentre.gap
}




///////////////////////   Scène 3     //////////////////////////

let centreScene3 = {
    x:-1*distanceSectionsCentre.gap,
    y:0.5,
    z:0*distanceSectionsCentre.gap
}


const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.8,
        color:'#ff0000'
    })
)
sphere3.castShadow = true
sphere3.position.set(centreScene3.x,centreScene3.y,centreScene3.z)
scene.add(sphere3)
sphere3.name ='Sphere3'


///////////////////////   Sol     //////////////////////////

let groundColor = []
groundColor.color = '#FFDA1F'
let floorMaterial = new THREE.MeshStandardMaterial({
    color: groundColor.color,
    metalness: 0.4,
    roughness: 0.9
})


const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    floorMaterial
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)
floor.name='ground'






	





///////////////////////   Lumières     //////////////////////////



let ambLightParameters = []

ambLightParameters.color = '#ffffff'

const ambientLight = new THREE.AmbientLight(ambLightParameters.color, 2)
scene.add(ambientLight)
ambientLight.name='Ambient Light'

let dirLightParameters = []

dirLightParameters.color = '#ffffff'
dirLightParameters.size=30

const directionalLight = new THREE.DirectionalLight(dirLightParameters.color,2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024,1024)
directionalLight.shadow.camera.far = (distanceSectionsCentre.gap+10)*2
directionalLight.shadow.camera.left = - dirLightParameters.size
directionalLight.shadow.camera.top =  dirLightParameters.size
directionalLight.shadow.camera.right =  dirLightParameters.size
directionalLight.shadow.camera.bottom = -  dirLightParameters.size
directionalLight.position.set((distanceSectionsCentre.gap), 10, (distanceSectionsCentre.gap))
scene.add(directionalLight)

directionalLight.name = 'Directionnal Light'









///////////////////////  Responsive    //////////////////////////


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

///////////////////////  Variables pour la caméra   //////////////////////////


let projetActif = 1
let oldProjetActif = projetActif
let indicatorProjet = projetActif-oldProjetActif
let testorProjet = false

let sectionActive =1
let oldSectionActive = sectionActive
let indicatorSection = sectionActive - oldSectionActive
let testorSection = false

window.addEventListener('keyup',(keypressedup)=>{
    

    if(keypressedup.key === 'ArrowUp'&& sectionActive<3){
        oldSectionActive=sectionActive
        sectionActive+=1
        indicatorSection = sectionActive - oldSectionActive
        if(sectionActive===2){
            projetActif=1
            oldProjetActif=1
        }
        

    }else if(keypressedup.key === 'ArrowDown'&& sectionActive>1){
        oldSectionActive=sectionActive
        sectionActive-=1
        indicatorSection = sectionActive - oldSectionActive
        if(sectionActive===2){
            projetActif=1
            oldProjetActif=1
        }
    
    }else if(keypressedup.key === 'ArrowRight'&& projetActif<nbDeProjets && sectionActive===2){
        oldProjetActif = projetActif
        projetActif+=1
        indicatorProjet = projetActif-oldProjetActif
    
        

    }else if(keypressedup.key === 'ArrowLeft'&& projetActif>1 && sectionActive===2){
        oldProjetActif = projetActif
        projetActif -= 1
        indicatorProjet = projetActif-oldProjetActif
    }
    
})



///////////////////////  Caméra   //////////////////////////

const camera = new THREE.PerspectiveCamera(80, sizes.width / sizes.height, 0.1, (distanceSectionsCentre.gap+10)*2)

let cameraPosition = {}
cameraPosition.y=3


camera.lookAt(0,0,0)
camera.position.set(Math.cos(((oldSectionActive-1)*2.095)-1.05)*(distanceSectionsCentre.gap+5), cameraPosition.y, Math.sin(((oldSectionActive-1)*2.095)-1.05)*(distanceSectionsCentre.gap+5))
scene.add(camera)

camera.name = 'Camera'

const directionalLightCamera = new THREE.DirectionalLight( 0xffffff, 0.1 )
scene.add( directionalLightCamera )
directionalLightCamera.position.set(camera.position.x,camera.position.y,camera.position.z)


///////////////////////  Renderer  //////////////////////////

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(skyColor.color)









renderer.physicallyCorrectLights = true






const fog = new THREE.Fog(skyColor.color,(distanceSectionsCentre.gap+10)*2,distanceSectionsCentre.gap*5)
scene.fog=fog



////////////////////////   GUI    ///////////////////////////////////

const environment = gui.addFolder('Environment')

environment.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
.onFinishChange(() =>
{
    renderer.toneMapping = Number(renderer.toneMapping)
})


const sky = environment.addFolder('Sky')
sky.addColor(skyColor,'color').onChange(()=>{
    renderer.setClearColor(skyColor.color)
    fog.color.set(skyColor.color)
})
const ground = environment.addFolder('Ground')
ground.addColor(groundColor,'color').onChange(()=>{
    floorMaterial.color.set(groundColor.color)
})

const AmbLight = environment.addFolder('Ambient Light')
AmbLight.add(ambientLight, 'intensity').min(0).max(4).step(0.01)
AmbLight.addColor(ambLightParameters,'color').onChange(()=>{
    ambientLight.color.set(ambLightParameters.color)
})

const DirLight = environment.addFolder('Directionnal Light')
DirLight.add(directionalLight,'intensity').min(0).max(4).step(0.01)
DirLight.add(directionalLight.position,'y').min(3).max(25).step(0.5).name('hauteur')
DirLight.addColor(dirLightParameters,'color').onChange(()=>{
    directionalLight.color.set(dirLightParameters.color)
})
DirLight.add(directionalLight,'castShadow')


const sceneGui=gui.addFolder('Scenes')

sceneGui.add(distanceSectionsCentre,'gap').min(5).max(24).step(0.5).name('Scene gap').onChange(()=>{
    centreScene1 = {
        x:0.5*distanceSectionsCentre.gap,
        y:0.5,
        z:-0.886*distanceSectionsCentre.gap
    }
    centreScene2 = {
        x:0.5*distanceSectionsCentre.gap,
        y:-0.99,
        z:0.886*distanceSectionsCentre.gap
    }
    centreScene3 = {
        x:-1*distanceSectionsCentre.gap,
        y:0.5,
        z:0*distanceSectionsCentre.gap
    }
    
    sphere2.position.set(centreScene2.x,centreScene2.y,centreScene2.z)
    sphere3.position.set(centreScene3.x,centreScene3.y,centreScene3.z)
    camera.far=(distanceSectionsCentre.gap+10)*2

    
    
})

sceneGui.add(cameraPosition,'y').min(1).max(10).step(0.2).name('Camera Y position')


//////////////////////////     Models Loaders      //////////////////////////
const gltfLoader = new GLTFLoader()

const scene1GUI = sceneGui.addFolder('Scene 1')
const scene2GUI = sceneGui.addFolder('Scene 2')


gltfLoader.load(
    '/models/Keycaps.gltf',
    (gltfKeycaps) =>
    {
        
        while(gltfKeycaps.scene.children.length){
            scene.add(gltfKeycaps.scene.children[0])
        }
        
        
        ///////////////////////////////////////////////////////////////////    UpperKey    //////////////////////////////////////////////////////////////////////////

        let Keys = scene1GUI.addFolder('Keys')
        

        let KeysParameters = {}
        KeysParameters.color='#ffff33'



        let UpperKey = scene.getObjectByName('Keycaps')
        UpperKey.name='UpperKey'
        let UpperKeyParameters= {
            x:1.8,
            y:-0.5,
            z:1.7,
            rx:0,
            ry:-Math.PI,
            rz:0,
            metalness:0.1,
            roughness:0.5
        }

        UpperKey.children[0].material.color.set(KeysParameters.color)
        Keys.addColor(KeysParameters,'color').onChange(()=>{
            UpperKey.children[0].material.color.set(KeysParameters.color)
        })

        UpperKey.children[0].material.roughness=UpperKeyParameters.roughness
        Keys.add(UpperKeyParameters,'roughness').min(0).max(1).step(0.01).onChange(()=>{
            UpperKey.children[0].material.roughness=UpperKeyParameters.roughness
        })

        UpperKey.children[0].material.metalness=UpperKeyParameters.metalness
        Keys.add(UpperKeyParameters,'metalness').min(0).max(1).step(0.01).onChange(()=>{
            UpperKey.children[0].material.metalness=UpperKeyParameters.metalness
        })

        

        let UpperKeyGUI = Keys.addFolder('Upper Key')

        UpperKey.position.set(centreScene1.x+UpperKeyParameters.x,centreScene1.y+UpperKeyParameters.y,centreScene1.z+UpperKeyParameters.z)
        UpperKey.rotation.set(UpperKeyParameters.rx,UpperKeyParameters.ry,UpperKeyParameters.rz)
        UpperKeyGUI.add(UpperKeyParameters,'x').min(-10).max(10).step(0.1).onChange(()=>{
            UpperKey.position.set(centreScene1.x+UpperKeyParameters.x,centreScene1.y+UpperKeyParameters.y,centreScene1.z+UpperKeyParameters.z)
        })
        UpperKeyGUI.add(UpperKeyParameters,'y').min(-3).max(3).step(0.1).onChange(()=>{
            UpperKey.position.set(centreScene1.x+UpperKeyParameters.x,centreScene1.y+UpperKeyParameters.y,centreScene1.z+UpperKeyParameters.z)
        })
        UpperKeyGUI.add(UpperKeyParameters,'z').min(-10).max(10).step(0.1).onChange(()=>{
            UpperKey.position.set(centreScene1.x+UpperKeyParameters.x,centreScene1.y+UpperKeyParameters.y,centreScene1.z+UpperKeyParameters.z)
        })

        UpperKeyGUI.add(UpperKeyParameters,'rx').min(-Math.PI).max(Math.PI).step(0.1).onChange(()=>{
            UpperKey.rotation.set(UpperKeyParameters.rx,UpperKeyParameters.ry,UpperKeyParameters.rz)
        })
        UpperKeyGUI.add(UpperKeyParameters,'ry').min(-Math.PI).max(Math.PI).step(0.1).onChange(()=>{
            UpperKey.rotation.set(UpperKeyParameters.rx,UpperKeyParameters.ry,UpperKeyParameters.rz)
        })
        UpperKeyGUI.add(UpperKeyParameters,'rz').min(-Math.PI).max(Math.PI).step(0.1).onChange(()=>{
            UpperKey.rotation.set(UpperKeyParameters.rx,UpperKeyParameters.ry,UpperKeyParameters.rz)
        })

        UpperKey.scale.set(0.05,0.05,0.05)
        UpperKeyGUI.add(UpperKey.scale,'x').min(0).max(0.05).step(0.0001).name('scale').onChange(()=>{
            UpperKey.scale.y=UpperKey.scale.x
            UpperKey.scale.z=UpperKey.scale.x
        })

        
        UpperKey.children[0].castShadow=true
        UpperKey.children[1].castShadow= UpperKey.children[0]
        UpperKeyGUI.add(UpperKey.children[0],'castShadow').onChange(()=>{
            UpperKey.children[1].castShadow= UpperKey.children[0]
        })
        UpperKeyGUI.add(UpperKey,'visible')


        ///////////////////////////////////////////////////////////////////    LowerKey    //////////////////////////////////////////////////////////////////////////
        
        const LowerKey = UpperKey.clone()
        LowerKey.name='LowerKey'
        scene.add(LowerKey)
        let LowerKeyGUI = Keys.addFolder('Lower Key')
        
        let LowerKeyParameters= {
            x:1.8,
            y:-0.5,
            z:0.2,
            rx:0,
            ry:0,
            rz:0
        }

        LowerKey.position.set(centreScene1.x+LowerKeyParameters.x,centreScene1.y+LowerKeyParameters.y,centreScene1.z+LowerKeyParameters.z)
        LowerKey.rotation.set(LowerKeyParameters.rx,LowerKeyParameters.ry,LowerKeyParameters.rz)
        LowerKeyGUI.add(LowerKeyParameters,'x').min(-10).max(10).step(0.1).onChange(()=>{
            LowerKey.position.set(centreScene1.x+LowerKeyParameters.x,centreScene1.y+LowerKeyParameters.y,centreScene1.z+LowerKeyParameters.z)
        })
        LowerKeyGUI.add(LowerKeyParameters,'y').min(-3).max(3).step(0.1).onChange(()=>{
            LowerKey.position.set(centreScene1.x+LowerKeyParameters.x,centreScene1.y+LowerKeyParameters.y,centreScene1.z+LowerKeyParameters.z)
        })
        LowerKeyGUI.add(LowerKeyParameters,'z').min(-10).max(10).step(0.1).onChange(()=>{
            LowerKey.position.set(centreScene1.x+LowerKeyParameters.x,centreScene1.y+LowerKeyParameters.y,centreScene1.z+LowerKeyParameters.z)
        })

        LowerKeyGUI.add(LowerKeyParameters,'rx').min(-Math.PI).max(Math.PI).step(0.1).onChange(()=>{
            LowerKey.rotation.set(LowerKeyParameters.rx,LowerKeyParameters.ry,LowerKeyParameters.rz)
        })
        LowerKeyGUI.add(LowerKeyParameters,'ry').min(-Math.PI).max(Math.PI).step(0.1).onChange(()=>{
            LowerKey.rotation.set(LowerKeyParameters.rx,LowerKeyParameters.ry,LowerKeyParameters.rz)
        })
        LowerKeyGUI.add(LowerKeyParameters,'rz').min(-Math.PI).max(Math.PI).step(0.1).onChange(()=>{
            LowerKey.rotation.set(LowerKeyParameters.rx,LowerKeyParameters.ry,LowerKeyParameters.rz)
        })

        LowerKey.scale.set(0.05,0.05,0.05)
        LowerKeyGUI.add(LowerKey.scale,'x').min(0).max(0.05).step(0.0001).name('scale').onChange(()=>{
            LowerKey.scale.y=LowerKey.scale.x
            LowerKey.scale.z=LowerKey.scale.x
        })


        
        
        LowerKey.children[0].castShadow=true
        LowerKey.children[1].castShadow= LowerKey.children[0]
        LowerKeyGUI.add(LowerKey.children[0],'castShadow').onChange(()=>{
            LowerKey.children[1].castShadow= LowerKey.children[0]
        })
        LowerKeyGUI.add(LowerKey,'visible')

    
    }
)

gltfLoader.load(
    '/models/Logo.gltf',
    (gltfLogo)=>{
        
        let logoGUI=scene1GUI.addFolder('Logo')
        while(gltfLogo.scene.children.length){
            scene.add(gltfLogo.scene.children[0])
        }
        

        const logoTop=scene.getObjectByName('LogoTop')
        const logoBottom=scene.getObjectByName('LogoBottom')

        
        const logo = new THREE.Group()
        logo.add(logoTop)
        logo.add(logoBottom)
        logo.name = 'Logo'

        
        
        scene.add(logo)
        logoTop.castShadow=true
        logoBottom.castShadow=logoTop.castShadow
        let logoParameters = {
            x:-5.4,
            y:-0.4,
            z:-2.1,
            rx:0,
            ry:-1.6,
            rz:0
        }

        logo.position.set(centreScene1.x+logoParameters.x,centreScene1.y+logoParameters.y,centreScene1.z+logoParameters.z)
        logo.rotation.set(logoParameters.rx,logoParameters.ry,logoParameters.rz)
        logoGUI.add(logoParameters,'x').min(-10).max(10).step(0.1).onChange(()=>{
            logo.position.set(centreScene1.x+logoParameters.x,centreScene1.y+logoParameters.y,centreScene1.z+logoParameters.z)
        })
        logoGUI.add(logoParameters,'y').min(-3).max(3).step(0.1).onChange(()=>{
            logo.position.set(centreScene1.x+logoParameters.x,centreScene1.y+logoParameters.y,centreScene1.z+logoParameters.z)
        })
        logoGUI.add(logoParameters,'z').min(-10).max(10).step(0.1).onChange(()=>{
            logo.position.set(centreScene1.x+logoParameters.x,centreScene1.y+logoParameters.y,centreScene1.z+logoParameters.z)
        })

        logoGUI.add(logoParameters,'rx').min(-Math.PI).max(Math.PI).step(0.1).name('rotation x').onChange(()=>{
            logo.rotation.set(logoParameters.rx,logoParameters.ry,logoParameters.rz)
        })
        logoGUI.add(logoParameters,'ry').min(-Math.PI).max(Math.PI).step(0.1).name('rotation y').onChange(()=>{
            logo.rotation.set(logoParameters.rx,logoParameters.ry,logoParameters.rz)
        })
        logoGUI.add(logoParameters,'rz').min(-Math.PI).max(Math.PI).step(0.1).name('rotation z').onChange(()=>{
            logo.rotation.set(logoParameters.rx,logoParameters.ry,logoParameters.rz)
        })

        logo.scale.set(0.2,0.2,0.2)
        logoGUI.add(logo.scale,'x').min(0).max(0.2).step(0.0001).name('scale').onChange(()=>{
            logo.scale.y=logo.scale.x
            logo.scale.z=logo.scale.x
        })

        logoGUI.add(logoTop,'castShadow').onChange(()=>{
            logoBottom.castShadow=logoTop.castShadow
        })

        logoGUI.add(logo,'visible')
})




gltfLoader.load(
    '/models/ProjectsTower.gltf',
    (gltfTower)=>{
        
        let towerGUI=scene2GUI.addFolder('Tower')
        while(gltfTower.scene.children.length){
            scene.add(gltfTower.scene.children[0])
        }

        const towerStairCase = scene.getObjectByName('TowerStairCase')
        const towerPilar = scene.getObjectByName('TowerPilar')
        const logoBottomTower = scene.getObjectByName('LogoBottomTower')
        const LogoTopTower = scene.getObjectByName('LogoTopTower')
        const empty = scene.getObjectByName('Empty')
        const keyStand = scene.getObjectByName('KeysStand')
        const leftKey = scene.getObjectByName('LeftKey')
        const rightKey = scene.getObjectByName('RightKey')
        const txtMyProjects = scene.getObjectByName('TxtMyProjects')
        const n1=scene.getObjectByName('n1')
        const n2=scene.getObjectByName('n2')
        const n3=scene.getObjectByName('n3')
        const n4=scene.getObjectByName('n4')
        const n5=scene.getObjectByName('n5')
        const n6=scene.getObjectByName('n6')
        const n7=scene.getObjectByName('n7')
        const lcv1 = scene.getObjectByName('lcv1')
        const logolcv1 = scene.getObjectByName('logolcv1')
        const couteauxpro = scene.getObjectByName('couteauxpro')
        const logocouteaux = scene.getObjectByName('logocouteaux')
        const desktop = scene.getObjectByName('desktop')
        const switchdesktop = scene.getObjectByName('switch')

        const projectTower = new THREE.Group()
        projectTower.add(towerPilar)
        projectTower.add(towerStairCase)
        projectTower.add(logoBottomTower)
        projectTower.add(LogoTopTower)
        projectTower.add(empty)
        projectTower.add(keyStand)
        projectTower.add(leftKey)
        projectTower.add(rightKey)
        projectTower.add(txtMyProjects)
        projectTower.add(n1)
        projectTower.add(n2)
        projectTower.add(n3)
        projectTower.add(n4)
        projectTower.add(n5)
        projectTower.add(n6)
        projectTower.add(n7)
        projectTower.add(lcv1)
        projectTower.add(logolcv1)
        projectTower.add(couteauxpro)
        projectTower.add(logocouteaux)
        projectTower.add(desktop)
        projectTower.add(switchdesktop)
        scene.add(projectTower)

        projectTower.name = 'ProjectsTower'

        

        let towerParameters = {
            x:2,
            y:-1+(oldProjetActif-1)*0.6,
            z:2.7,
            rx:0,
            ry:2.19-Math.PI*(oldProjetActif-1)*0.5,
            rz:0
        }

       
        projectTower.position.set(centreScene2.x+towerParameters.x,centreScene2.y+towerParameters.y,centreScene2.z+towerParameters.z)
        projectTower.rotation.set(towerParameters.rx,towerParameters.ry,towerParameters.rz)

        projectTower.scale.set(1,1,1)

        towerGUI.add(projectTower.scale,'x').min(0).max(2).step(0.0001).name('scale').onChange(()=>{
            projectTower.scale.y=projectTower.scale.x
            projectTower.scale.z=projectTower.scale.x
        })

        let stairsGUI = towerGUI.addFolder('Stairs')
        let pilarGUI = towerGUI.addFolder('Pilar')

        

        let stairCaseParameters = {
            color:'#ffff77',
            roughness:0.5,
            metalness:0.1
        }
        

        let pilarParameters = {
            color:'#ff7700',
            roughness:0.5,
            metalness:0.1
        }
        

        towerStairCase.material.color.set(stairCaseParameters.color)
        towerPilar.material.color.set(pilarParameters.color)

        stairsGUI.addColor(stairCaseParameters,'color').name('StairCase color').onChange(()=>{
            towerStairCase.material.color.set(stairCaseParameters.color)
        })

        towerStairCase.material.roughness=stairCaseParameters.roughness
        stairsGUI.add(stairCaseParameters,'roughness').min(0).max(1).step(0.01).onChange(()=>{
            towerStairCase.material.roughness=stairCaseParameters.roughness
        })

        towerStairCase.material.metalness=stairCaseParameters.metalness
        stairsGUI.add(stairCaseParameters,'metalness').min(0).max(1).step(0.01).onChange(()=>{
            towerStairCase.material.metalness=stairCaseParameters.metalness
        })

        pilarGUI.addColor(pilarParameters,'color').name('Pilar color').onChange(()=>{
            towerPilar.material.color.set(pilarParameters.color)
        })

        towerPilar.material.roughness=pilarParameters.roughness
        pilarGUI.add(pilarParameters,'roughness').min(0).max(1).step(0.01).onChange(()=>{
            towerPilar.material.roughness=pilarParameters.roughness
        })
        towerPilar.material.metalness=pilarParameters.metalness
        pilarGUI.add(pilarParameters,'metalness').min(0).max(1).step(0.01).onChange(()=>{
            towerPilar.material.metalness=pilarParameters.metalness
        })

        

        towerStairCase.castShadow=true
        towerPilar.castShadow=true
        logoBottomTower.castShadow=true
        LogoTopTower.castShadow=true

    

        towerGUI.add(towerStairCase,'castShadow').onChange(()=>{
            towerPilar.castShadow=towerStairCase.castShadow
            logoBottomTower.castShadow=towerStairCase.castShadow
            LogoTopTower.castShadow=towerStairCase.castShadow
        })

        towerGUI.add(towerStairCase,'receiveShadow').onChange(()=>{
            towerPilar.receiveShadow=towerStairCase.receiveShadow
            logoBottomTower.receiveShadow=towerStairCase.receiveShadow
            LogoTopTower.receiveShadow=towerStairCase.receiveShadow
        })


        let project1GUI = towerGUI.addFolder('Project 1')
        let keyStandGUI = project1GUI.addFolder('KeyStand')
        let KeysProject1GUI = project1GUI.addFolder('Keys')
        let txtMyProjectsGUI = project1GUI.addFolder('My Projects')

       
        const keyStandParameters = {
            color:'#ff7700',
            metalness:0.1,
            roughness:0.5
        }

        keyStand.material.color.set(keyStandParameters.color)
        keyStandGUI.addColor(keyStandParameters,'color').onChange(()=>{
            keyStand.material.color.set(keyStandParameters.color)
        })

        keyStand.material.roughness=keyStandParameters.roughness
        keyStandGUI.add(keyStandParameters,'roughness').min(0).max(1).step(0.01).onChange(()=>{
            keyStand.material.roughness=keyStandParameters.roughness
        })

        keyStand.material.metalness=keyStandParameters.metalness
        keyStandGUI.add(keyStandParameters,'metalness').min(0).max(1).step(0.01).onChange(()=>{
            keyStand.material.metalness=keyStandParameters.metalness
        })

        keyStandGUI.add(keyStand,'castShadow')
        keyStandGUI.add(keyStand,'receiveShadow')

        let KeysProject1Parameters = {
            metalness:0.1,
            color:'#77ff00'
        }

        

        leftKey.children[0].material.metalness = KeysProject1Parameters.metalness
        rightKey.children[0].material.metalness = KeysProject1Parameters.metalness
        KeysProject1GUI.add(KeysProject1Parameters,'metalness').min(0).max(1).step(0.01).onChange(()=>{
            leftKey.children[0].material.metalness = KeysProject1Parameters.metalness
            rightKey.children[0].material.metalness = KeysProject1Parameters.metalness
        })

        leftKey.children[0].material.color.set(KeysProject1Parameters.color)
        rightKey.children[0].material.color.set(KeysProject1Parameters.color)
        KeysProject1GUI.addColor(KeysProject1Parameters,'color').onChange(()=>{
            leftKey.children[0].material.color.set(KeysProject1Parameters.color)
        rightKey.children[0].material.color.set(KeysProject1Parameters.color)
        })

        leftKey.castShadow=true
        KeysProject1GUI.add(leftKey,'castShadow').onChange(()=>{
            rightKey.castShadow=leftKey.castShadow
        })


        txtMyProjectsGUI.add(txtMyProjects,'castShadow')
        txtMyProjectsGUI.add(txtMyProjects,'receiveShadow')
        

        let project2GUI = towerGUI.addFolder('Project 2')
        let logolcv1GUI = project2GUI.addFolder('Logo')
        let lcv1GUI = project2GUI.addFolder('Louis Cuenot V1')
        

        let logolcv1Parameters = {
            xinit:logolcv1.position.x,
            yinit:logolcv1.position.y,
            zinit:logolcv1.position.z,
            rxinit:logolcv1.rotation.x,
            ryinit:logolcv1.rotation.y,
            rzinit:logolcv1.rotation.z,
            x:0,
            z:0,
            ry:0,
            scale:0.01
        }

        

        logolcv1GUI.add(logolcv1Parameters,'x').min(-2).max(2).step(0.001).onChange(()=>{
            logolcv1.position.set(logolcv1Parameters.xinit+logolcv1Parameters.x,logolcv1Parameters.yinit,logolcv1Parameters.zinit+logolcv1Parameters.z)
        })
        logolcv1GUI.add(logolcv1Parameters,'z').min(-2).max(2).step(0.001).onChange(()=>{
            logolcv1.position.set(logolcv1Parameters.xinit+logolcv1Parameters.x,logolcv1Parameters.yinit,logolcv1Parameters.zinit+logolcv1Parameters.z)
        })
        logolcv1GUI.add(logolcv1Parameters,'ry').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation').onChange(()=>{
            logolcv1.rotation.set(logolcv1Parameters.rxinit,logolcv1Parameters.ryinit+logolcv1Parameters.ry,logolcv1Parameters.rzinit)
        })
        logolcv1GUI.add(logolcv1Parameters,'scale').min(0.005).max(0.02).step(0.001).onChange(()=>{
            logolcv1.scale.set(logolcv1Parameters.scale,logolcv1Parameters.scale,logolcv1Parameters.scale)
        })

        let lcv1Parameters = {
            xinit:lcv1.position.x,
            yinit:lcv1.position.y,
            zinit:lcv1.position.z,
            rxinit:lcv1.rotation.x,
            ryinit:lcv1.rotation.y,
            rzinit:lcv1.rotation.z,
            x:0,
            z:0,
            rz:0,
            scale:0.06
        }
        
        lcv1GUI.add(lcv1Parameters,'x').min(-2).max(2).step(0.001).onChange(()=>{
            lcv1.position.set(lcv1Parameters.xinit+lcv1Parameters.x,lcv1Parameters.yinit,lcv1Parameters.zinit+lcv1Parameters.z)
        })
        lcv1GUI.add(lcv1Parameters,'z').min(-2).max(2).step(0.001).onChange(()=>{
            lcv1.position.set(lcv1Parameters.xinit+lcv1Parameters.x,lcv1Parameters.yinit,lcv1Parameters.zinit+lcv1Parameters.z)
        })
        lcv1GUI.add(lcv1Parameters,'rz').min(-Math.PI).max(Math.PI).step(0.001).name('Rotation').onChange(()=>{
            lcv1.rotation.set(lcv1Parameters.rxinit,lcv1Parameters.ryinit,lcv1Parameters.rzinit+lcv1Parameters.rz)
        })
        lcv1GUI.add(lcv1Parameters,'scale').min(0.03).max(0.1).step(0.001).onChange(()=>{
            lcv1.scale.set(lcv1Parameters.scale,lcv1Parameters.scale,lcv1Parameters.scale)
        })

        

        

        

        let project3GUI = towerGUI.addFolder('Project 3')
        let logocouteauxGUI = project3GUI.addFolder('Logo')
        let couteauxproGUI = project3GUI.addFolder('Louis Cuenot V1')
        

        let logocouteauxParameters = {
            xinit:logocouteaux.position.x,
            yinit:logocouteaux.position.y,
            zinit:logocouteaux.position.z,
            rxinit:logocouteaux.rotation.x,
            ryinit:logocouteaux.rotation.y,
            rzinit:logocouteaux.rotation.z,
            x:0,
            z:0,
            ry:0,
            scale:0.003
        }

        logocouteauxGUI.add(logocouteauxParameters,'x').min(-2).max(2).step(0.001).onChange(()=>{
            logocouteaux.position.set(logocouteauxParameters.xinit+logocouteauxParameters.x,logocouteauxParameters.yinit,logocouteauxParameters.zinit+logocouteauxParameters.z)
        })
        logocouteauxGUI.add(logocouteauxParameters,'z').min(-2).max(2).step(0.001).onChange(()=>{
            logocouteaux.position.set(logocouteauxParameters.xinit+logocouteauxParameters.x,logocouteauxParameters.yinit,logocouteauxParameters.zinit+logocouteauxParameters.z)
        })
        logocouteauxGUI.add(logocouteauxParameters,'ry').min(-Math.PI).max(Math.PI).step(0.001).name('Rotation').onChange(()=>{
            logocouteaux.rotation.set(logocouteauxParameters.rxinit,logocouteauxParameters.ryinit+logocouteauxParameters.ry,logocouteauxParameters.rzinit)
        })
        logocouteauxGUI.add(logocouteauxParameters,'scale').min(0.0015).max(0.005).step(0.0001).onChange(()=>{
            logocouteaux.scale.set(logocouteauxParameters.scale,logocouteauxParameters.scale,logocouteauxParameters.scale)
        })

        let couteauxParameters = {
            xinit:couteauxpro.position.x,
            yinit:couteauxpro.position.y,
            zinit:couteauxpro.position.z,
            rxinit:couteauxpro.rotation.x,
            ryinit:couteauxpro.rotation.y,
            rzinit:couteauxpro.rotation.z,
            x:0,
            z:0,
            rz:0,
            scale:0.06
        }

        couteauxproGUI.add(couteauxParameters,'x').min(-2).max(2).step(0.001).onChange(()=>{
            couteauxpro.position.set(couteauxParameters.xinit+couteauxParameters.x,couteauxParameters.yinit,couteauxParameters.zinit+couteauxParameters.z)
        })
        couteauxproGUI.add(couteauxParameters,'z').min(-2).max(2).step(0.001).onChange(()=>{
            couteauxpro.position.set(couteauxParameters.xinit+couteauxParameters.x,couteauxParameters.yinit,couteauxParameters.zinit+couteauxParameters.z)
        })
        couteauxproGUI.add(couteauxParameters,'rz').min(-Math.PI).max(Math.PI).step(0.001).name('Rotation').onChange(()=>{
            couteauxpro.rotation.set(couteauxParameters.rxinit,couteauxParameters.ryinit,couteauxParameters.rzinit+couteauxParameters.rz)
        })
        couteauxproGUI.add(couteauxParameters,'scale').min(0.03).max(0.1).step(0.001).onChange(()=>{
            couteauxpro.scale.set(couteauxParameters.scale,couteauxParameters.scale,couteauxParameters.scale)
        })











        let titlesGUI = towerGUI.addFolder('Titles')
        
        let txtMyProjectsParameters = {
            metalness:0.1,
            roughness:0.5,
            color:'#ff7700'
        }
        

        txtMyProjects.material.metalness=txtMyProjectsParameters.metalness
        titlesGUI.add(txtMyProjectsParameters,'metalness').min(0).max(1).step(0.01).onChange(()=>{
            txtMyProjects.material.metalness=txtMyProjectsParameters.metalness
        })
        
        txtMyProjects.material.roughness=txtMyProjectsParameters.roughness
        titlesGUI.add(txtMyProjectsParameters,'roughness').min(0).max(1).step(0.01).onChange(()=>{
            txtMyProjects.material.roughness=txtMyProjectsParameters.roughness
        })
        

        txtMyProjects.material.color.set(txtMyProjectsParameters.color)
        titlesGUI.addColor(txtMyProjectsParameters,'color').onChange(()=>{
            txtMyProjects.material.color.set(txtMyProjectsParameters.color)
        })

        let numbersGUI = towerGUI.addFolder('Numbers')

        let numberParameters = {
            metalness:0.1,
            roughness:0.5,
            color:'#ffff00'
        }

        numbersGUI.add(numberParameters,'metalness').min(0).max(1).step(0.01).onChange(()=>{
            n1.material.metalness=numberParameters.metalness
        })

        numbersGUI.add(numberParameters,'roughness').min(0).max(1).step(0.01).onChange(()=>{
            n1.material.roughness=numberParameters.roughness
        })

        numbersGUI.addColor(numberParameters,'color').onChange(()=>{
            n1.material.color.set(numberParameters.color)
        })
})


const fontLoader = new THREE.FontLoader()

fontLoader.load( '/fonts/Acme_Regular.json', function ( font ) {

	const textGeometry1 = new THREE.TextGeometry(
        'PRESS             TO SWAP SCENE',
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        }
    )
    const text1Material = new THREE.MeshStandardMaterial()
    
    const textScene1 = new THREE.Mesh(textGeometry1, text1Material)
    scene.add(textScene1)
    textScene1.name='TS1'

    const txtS1 = scene.getObjectByName('TS1')
    txtS1.material.color={r:1,g:0.5,b:0}
    const txtS1Param = {
        x:4.9,
        y:-0.5,
        z:1.7,
        rx:0,
        ry:Math.PI,
        rz:0
    }

    const txtS1GUI = scene1GUI.addFolder('Texte 1')
    txtS1.position.set(centreScene1.x+txtS1Param.x,centreScene1.y+txtS1Param.y,centreScene1.z+txtS1Param.z)
    txtS1.rotation.set(txtS1Param.rx,txtS1Param.ry,txtS1Param.rz)
    txtS1.scale.set(1.23,1.23,1.23)

    txtS1GUI.add(txtS1Param,'x').min(-10).max(10).step(0.1).onChange(()=>{
        txtS1.position.set(centreScene1.x+txtS1Param.x,centreScene1.y+txtS1Param.y,centreScene1.z+txtS1Param.z)
    })
    txtS1GUI.add(txtS1Param,'y').min(-3).max(3).step(0.1).onChange(()=>{
        txtS1.position.set(centreScene1.x+txtS1Param.x,centreScene1.y+txtS1Param.y,centreScene1.z+txtS1Param.z)
    })
    txtS1GUI.add(txtS1Param,'z').min(-10).max(10).step(0.1).onChange(()=>{
        txtS1.position.set(centreScene1.x+txtS1Param.x,centreScene1.y+txtS1Param.y,centreScene1.z+txtS1Param.z)
    })
    txtS1GUI.add(txtS1Param,'rx').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation X').onChange(()=>{
        txtS1.rotation.set(txtS1Param.rx,txtS1Param.ry,txtS1Param.rz)
    })
    txtS1GUI.add(txtS1Param,'ry').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation Y').onChange(()=>{
        txtS1.rotation.set(txtS1Param.rx,txtS1Param.ry,txtS1Param.rz)
    })

    txtS1GUI.add(txtS1Param,'rz').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation Z').onChange(()=>{
        txtS1.rotation.set(txtS1Param.rx,txtS1Param.ry,txtS1Param.rz)
    })

    txtS1GUI.add(txtS1.scale,'x').min(0.5).max(2).step(0.01).name('Scale').onChange(()=>{
        txtS1.scale.y=txtS1.scale.x
        txtS1.scale.z=txtS1.scale.x
    })

    txtS1.castShadow=true
    txtS1GUI.add(txtS1,'castShadow')
    txtS1GUI.add(txtS1,'visible')

    
    const textGeometry2 = new THREE.TextGeometry(
        'Louis Cuenot',
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        }
    )
    const text2Material = new THREE.MeshStandardMaterial()
    
    const textScene2 = new THREE.Mesh(textGeometry2, text2Material)
    scene.add(textScene2)
    textScene2.name='TS2'

    const txtS2 = scene.getObjectByName('TS2')
    txtS2.material.color={r:1,g:1,b:0.5}
    const txtS2Param = {
        x:-3.4,
        y:-0.5,
        z:-0.7,
        rx:0,
        ry:1.53,
        rz:0
    }

    const txtS2GUI = scene1GUI.addFolder('Texte 2')
    txtS2.position.set(centreScene1.x+txtS2Param.x,centreScene1.y+txtS2Param.y,centreScene1.z+txtS2Param.z)
    txtS2.rotation.set(txtS2Param.rx,txtS2Param.ry,txtS2Param.rz)
    txtS2.scale.set(0.8,0.8,0.8)

    txtS2GUI.add(txtS2Param,'x').min(-10).max(10).step(0.1).onChange(()=>{
        txtS2.position.set(centreScene1.x+txtS2Param.x,centreScene1.y+txtS2Param.y,centreScene1.z+txtS2Param.z)
    })
    txtS2GUI.add(txtS2Param,'y').min(-3).max(3).step(0.1).onChange(()=>{
        txtS2.position.set(centreScene1.x+txtS2Param.x,centreScene1.y+txtS2Param.y,centreScene1.z+txtS2Param.z)
    })
    txtS2GUI.add(txtS2Param,'z').min(-10).max(10).step(0.1).onChange(()=>{
        txtS2.position.set(centreScene1.x+txtS2Param.x,centreScene1.y+txtS2Param.y,centreScene1.z+txtS2Param.z)
    })
    txtS2GUI.add(txtS2Param,'rx').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation X').onChange(()=>{
        txtS2.rotation.set(txtS2Param.rx,txtS2Param.ry,txtS2Param.rz)
    })
    txtS2GUI.add(txtS2Param,'ry').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation Y').onChange(()=>{
        txtS2.rotation.set(txtS2Param.rx,txtS2Param.ry,txtS2Param.rz)
    })

    txtS2GUI.add(txtS2Param,'rz').min(-Math.PI).max(Math.PI).step(0.01).name('Rotation Z').onChange(()=>{
        txtS2.rotation.set(txtS2Param.rx,txtS2Param.ry,txtS2Param.rz)
    })

    txtS2GUI.add(txtS2.scale,'x').min(0.5).max(2).step(0.01).name('Scale').onChange(()=>{
        txtS2.scale.y=txtS2.scale.x
        txtS2.scale.z=txtS2.scale.x
    })

    txtS2.castShadow=true
    txtS2GUI.add(txtS2,'castShadow')
    txtS2GUI.add(txtS2,'visible')
    
}
)









///////////////////////  Fonction on tick //////////////////////////


const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    /////////////////////// Travellings de la caméra   //////////////////////////

    directionalLightCamera.position.set(camera.position.x,camera.position.y,camera.position.z)

    if(oldProjetActif<projetActif && indicatorProjet ===1){
        testorProjet=true
    }else if(oldProjetActif>=projetActif && indicatorProjet===1){
        
        oldProjetActif=Math.round(oldProjetActif)
        testorProjet=false
        
    }else if(oldProjetActif>projetActif && indicatorProjet ===-1){
        testorProjet=true
    }else if(oldProjetActif<=projetActif && indicatorProjet===-1){
        
        oldProjetActif=Math.round(oldProjetActif)
        testorProjet=false
    }

    if(testorProjet===true){
        
        
        oldProjetActif+=0.01*indicatorProjet
        
        
    }

    if(oldSectionActive<sectionActive && indicatorSection ===1){
        testorSection=true
    }else if(oldSectionActive>=sectionActive && indicatorSection===1){
        
        oldSectionActive=Math.round(oldSectionActive)
        testorSection=false
        
    }else if(oldSectionActive>sectionActive && indicatorSection ===-1){
        testorSection=true
    }else if(oldSectionActive<=sectionActive && indicatorSection===-1){
        
        oldSectionActive=Math.round(oldSectionActive)
        testorSection=false
    }

    if(testorSection===true){
        
        
        oldSectionActive+=0.02*indicatorSection
        
    }
    
    camera.position.set(Math.cos(((oldSectionActive-1)*2.095)-1.05)*(distanceSectionsCentre.gap+5), cameraPosition.y, Math.sin(((oldSectionActive-1)*2.095)-1.05)*(distanceSectionsCentre.gap+5))
    camera.lookAt(0,0,0)

    
        
        
        
    if(sectionActive!=2){
        if(oldProjetActif>1){
            oldProjetActif-=0.05
            
        }else if(oldProjetActif<=1){
            projetActif=1
            oldProjetActif=1
        }
    }

    let towerParameters = {
        x:2,
        y:-1+(oldProjetActif-1)*0.6,
        z:2.7,
        rx:0,
        ry:2.19-Math.PI*(oldProjetActif-1)*0.5,
        rz:0
    }

    var projectTower=scene.getObjectByName('ProjectsTower')
    if(projectTower){
        projectTower.position.set(centreScene2.x+towerParameters.x,centreScene2.y+(-1+(oldProjetActif-1)*0.6),centreScene2.z+towerParameters.z)
        projectTower.rotation.set(towerParameters.rx,2.19-Math.PI*(oldProjetActif-1)*0.5,towerParameters.rz)
    }
       

    ///////////////////////  Renderer + rappel de la fonction   //////////////////////////
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()