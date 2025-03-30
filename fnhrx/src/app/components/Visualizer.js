import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Visualizer() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create Scene and Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    // Renderer Setup with Transparency
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent Background
    mountRef.current.appendChild(renderer.domElement);

    // Create Geometry and Material
    const geometry = new THREE.IcosahedronGeometry(4, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      wireframe: true,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xaaaaaa);
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(ambientLight, pointLight);

    // Set Camera Position
    camera.position.z = 10;

    // Animation Loop
    const animate = () => {
      if (!mountRef.current) return; // Ensure component exists
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup Function with Safe Check
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}
    />
  );
}

export default Visualizer;
