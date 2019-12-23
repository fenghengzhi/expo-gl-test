import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GLView} from 'expo-gl';
import ExpoTHREE, {loadTextureAsync, THREE} from 'expo-three';
// global.THREE = global.THREE || THREE;

export default function App() {
    async function contextCreateHandler(gl: WebGLRenderingContext) {

        // initThree
        const width = 100, height = 100;
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );

        const renderer = new ExpoTHREE.Renderer({gl});
        renderer.setSize( width, height );
        // document.body.appendChild( renderer.domElement );

        var geometry = new THREE.BoxGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;

        var animate = function () {
            requestAnimationFrame( animate );

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render( scene, camera );
        };

        animate();
    }

    return (
        <View style={styles.container}>
            <GLView onContextCreate={contextCreateHandler} style={{borderWidth:1,width: 100, height: 100}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
    },
});
