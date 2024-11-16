import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export default function App() {

    const models = [
        {
            loader: FBXLoader,
            modelPath: "models/interior_couch.fbx"
        }, {
            loader: FBXLoader,
            modelPath: "models/test_room.fbx"
        }
    ]
    const currModel = 1;

    return (
        <Canvas 
            style={{width: "80vw", height: "80vh"}}
            camera={{position: [0, 0, 5], near: 0.1, far: 50000}}
        >
            <ambientLight />
            <spotLight position={[0, 0, 10]} />
            <OrbitControls/>
            <Scene loader={models[currModel].loader} modelPath={models[currModel].modelPath} />
        </Canvas>
    )
}

interface SceneProps {
    loader: any;
    modelPath: string;
}

function Scene({ loader, modelPath }: SceneProps) {

    const model = useLoader(loader, modelPath);



    return (<primitive object={model}/>)
}