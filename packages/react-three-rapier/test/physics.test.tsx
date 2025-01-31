import { it, describe, expect } from "vitest";
import {
  Physics,
  RapierContext,
  RapierRigidBody,
  RigidBody,
  useRapier,
  vec3
} from "../src";
import React, { useEffect } from "react";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import { Box } from "@react-three/drei";

describe("physics", () => {
  const TestComponent = ({
    ready
  }: {
    ready: (context: RapierContext) => void;
  }) => {
    const rapierContext = useRapier();

    useEffect(() => {
      ready(rapierContext);
    }, []);

    return null;
  };

  it("exposes a manual step function", async () => {
    const rigidBody = React.createRef<RapierRigidBody>();
    const rapierContext = await new Promise<RapierContext>(
      async (resolve, reject) => {
        try {
          await ReactThreeTestRenderer.create(
            <Physics paused>
              <TestComponent ready={resolve} />

              <RigidBody
                colliders="cuboid"
                restitution={2}
                ref={rigidBody}
                linearVelocity={[20, 20, 20]}
              >
                <Box />
              </RigidBody>
            </Physics>
          );
        } catch (e) {
          reject(e);
        }
      }
    );

    expect(vec3(rigidBody.current?.translation()).toArray()).to.deep.eq([
      0, 0, 0
    ]);

    rapierContext.step(1 / 60);

    expect(vec3(rigidBody.current?.translation()).toArray()).to.deep.eq([
      0.3333333432674408, 0.3333333432674408, 0.3333333432674408
    ]);

    rapierContext.step(1 / 60);

    expect(vec3(rigidBody.current?.translation()).toArray()).to.deep.eq([
      0.6666666865348816, 0.6666666865348816, 0.6666666865348816
    ]);

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });

    // expect nothing to have changed
    expect(vec3(rigidBody.current?.translation()).toArray()).to.deep.eq([
      0.6666666865348816, 0.6666666865348816, 0.6666666865348816
    ]);
  });
});
