/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: Berk Gedik (https://sketchfab.com/berkgedik)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/concrete-block-low-poly-cb7145cb2e084db4bafe11ac392fc954
Title: Concrete Block (Low Poly)
*/

import * as THREE from 'three';
import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import * as React from "react";
import ConcreteBlockModel from "./concrete_block.glb";

type GLTFResult = GLTF & {
  nodes: {
    defaultMaterial: THREE.Mesh
    defaultMaterial_1: THREE.Mesh
  }
  materials: {
    Material_001: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
  }
}

export function ConcreteBlock(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF(ConcreteBlockModel) as GLTFResult
    return (
        <group {...props} dispose={null}>
            <mesh geometry={nodes.defaultMaterial.geometry} material={materials.Material_001} />
            <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.Material} />
        </group>
    )
}

useGLTF.preload(ConcreteBlockModel)

