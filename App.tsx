import React from 'react';
import {PixelRatio, StyleSheet, View, Platform} from 'react-native';
import {GLView} from 'expo-gl';
import ExpoTHREE, {loadTextureAsync, THREE} from 'expo-three';
import {ExpoWebGLRenderingContext} from "expo-gl/src/GLView.types";
// global.THREE = global.THREE || THREE;

export default function App() {
    async function contextCreateHandler(gl: ExpoWebGLRenderingContext) {

        // initThree
        const scale = PixelRatio.get();
        const width = gl.drawingBufferWidth / scale, height = gl.drawingBufferHeight / scale;
        const renderer = new ExpoTHREE.Renderer({gl, width, height, pixelRatio: scale});
        // const renderer = new ExpoTHREE.Renderer({gl, width:gl.drawingBufferWidth*10, height:gl.drawingBufferHeight*10, pixelRatio: 0.1});
        // const renderer = new ExpoTHREE.Renderer({gl,scale:1});

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
        camera.position.z = 3;
        // renderer.setSize(width, height);
        // document.body.appendChild( renderer.domElement );
        {
            const light = new THREE.AmbientLight(0x888888)
            scene.add(light)
        }
        {
            const light = new THREE.DirectionalLight(0xcccccc, 1);
            light.position.set(5, 3, 5)
            scene.add(light);
        }

        // const geometry = new THREE.SphereGeometry(0.5, 32, 32, undefined, 10, undefined, 10)
        const geometry = new THREE.SphereGeometry(0.5, 32, 32)
        const material = new THREE.MeshPhongMaterial({
            map: await loadTextureAsync({asset: require('./earthmap1k.png')}),
            // precision:'highp'
            // reflectivity: 1,
            // refractionRatio: 0.98,
            // wireframe:true,
            // wireframeLinewidth:1,
            bumpMap: await loadTextureAsync({asset: require('./earthbump1k.png')}),
            specularMap: await loadTextureAsync({asset: require('./earthspec1k.png')}),
            bumpScale: 0.02,
            specular: new THREE.Color('grey'),
            // normalScale: new THREE.Vector2(0.001, 0.001)
        });
        // material.map = await ExpoTHREE.loadAsync(require('./earthmap1k.jpg'));
        const earthMesh = new THREE.Mesh(geometry, material)
        ExpoTHREE.utils.computeMeshNormals(earthMesh);
        scene.add(earthMesh)
        function animate() {
            // console.warn('animate')
            if (Platform.OS === 'ios') {
                setTimeout(animate, 5000)
            } else {
                requestAnimationFrame(animate);
            }
            if (Platform.OS === 'ios') {
                // setTimeout(animate, 100)
                earthMesh.rotation.x += 1;
                earthMesh.rotation.y += 1;
            } else {
                earthMesh.rotation.x += 0.01;
                earthMesh.rotation.y += 0.01;
            }


            renderer.render(scene, camera);
            gl.endFrameEXP();
        }

        animate();
    }

    return (
        <View style={styles.container}>
            <GLView onContextCreate={contextCreateHandler}
                    style={{borderWidth: 1, flex: 1, width: '100%', backgroundColor: '#000'}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: 'red',
    },
});
