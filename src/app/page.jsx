"use client";
import React, { useState, useEffect } from "react";
import * as OBC from "@thatopen/components";

export default function Home() {
  const [container, setContainer] = useState();

  useEffect(() => {
    const loadIfc = async (components, world) => {
      const file = await fetch(
        "https://thatopen.github.io/engine_components/resources/small.ifc"
      );
      const data = await file.arrayBuffer();
      const buffer = new Uint8Array(data);
      const fragmentIfcLoader = components.get(OBC.IfcLoader);
      await fragmentIfcLoader.setup();
      fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
      const model = await fragmentIfcLoader.load(buffer);
      model.name = "example";
      model.position.set(0, 1, 0);
      world.scene.three.add(model);
    };

    if (container) {
      const components = new OBC.Components();
      const worlds = components.get(OBC.Worlds);
      const world = worlds.create();
      world.scene = new OBC.SimpleScene(components);

      world.renderer = new OBC.SimpleRenderer(components, container);
      world.camera = new OBC.SimpleCamera(components);
      components.init();
      world.scene.three.background = null;

      world.scene.setup();
      world.camera.controls.setLookAt(5, 5, 5, 0, 0, 0);

      const grids = components.get(OBC.Grids);

      grids.create(world);

      loadIfc(components, world);
    }
  }, [container]);

  return (
    <main
      style={{ position: "fixed", height: "100%", width: "100%" }}
      ref={(ref) => setContainer(ref)}
    />
  );
}
