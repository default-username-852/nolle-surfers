/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: bilgehan.korkmaz (https://sketchfab.com/bilgehan.korkmaz)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/road-block-9ad6bc278e224ff8b652a7a2be644019
Title: Road Block
Used with modification
*/

import * as THREE from 'three'
import { useRef } from 'react'
import * as React from "react"
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import Model from "./road_block.glb";

type GLTFResult = GLTF & {
  nodes: {
    defaultMaterial: THREE.Mesh
  }
  materials: {
    DefaultMaterial: THREE.MeshStandardMaterial
  }
}

export function RoadBlock(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(Model) as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.defaultMaterial.geometry} material={materials.DefaultMaterial} />
    </group>
  )
}

useGLTF.preload(Model)


