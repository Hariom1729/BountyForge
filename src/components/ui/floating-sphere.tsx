'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function FloatingSphere({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const size = containerRef.current.clientWidth || 400;
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create Geometry
    const geometry = new THREE.IcosahedronGeometry(1.6, 2);
    
    // Add custom size attribute
    const count = geometry.attributes.position.count;
    const randomSizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      randomSizes[i] = Math.random();
    }
    
    geometry.setAttribute('aSize', new THREE.BufferAttribute(randomSizes, 1));

    // Glow points material
    const material = new THREE.PointsMaterial({
      color: 0x8b5cf6, // Violet
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Inner wireframe sphere for depth
    const innerGeometry = new THREE.IcosahedronGeometry(1.58, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6, // Blue
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate points
      points.rotation.y = elapsedTime * 0.15 + targetX * 0.5;
      points.rotation.x = elapsedTime * 0.1 + targetY * 0.5;

      innerMesh.rotation.y = -elapsedTime * 0.05 + targetX * 0.2;
      innerMesh.rotation.x = -elapsedTime * 0.08 + targetY * 0.2;

      // Animate vertices (morphing wave effect)
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        // Apply a wave animation using sine waves based on original geometry coordinates
        const length = Math.sqrt(x*x + y*y + z*z);
        const wave = Math.sin(length * 5 - elapsedTime * 2) * 0.03;
        
        // Push vertices outwards slightly
        positions[i] = x * (1 + wave * 0.1);
        positions[i+1] = y * (1 + wave * 0.1);
        positions[i+2] = z * (1 + wave * 0.1);
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const size = containerRef.current.clientWidth || 400;
      renderer.setSize(size, size);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className} 
      style={{ aspectRatio: '1/1', width: '100%', maxWidth: '400px', margin: '0 auto' }} 
    />
  );
}
