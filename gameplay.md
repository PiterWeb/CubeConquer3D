# Gameplay

This document describes the gameplay of the game.

-   Turn-based gameplay.
-   The game is played on a 3D grid of cubes.
-   The goal is to conquer all the bases on the grid.
-   The number and location of bases are randomly generated.
-   Base: can be conquered by a unit. When a base is conquered, the unit that conquered it will heal 100% hp (in 2 turns).
-   Objects: they are located on the map and can be collected by a unit (not shared with the team).
    -   Wall(Brick Cube): blocks the movement of units.
    -   Rope(small brown rectangle): allows the unit to move to a higher Y coord (Walls).
-   Unit: can move and attack (if support can heal). Each unit has a role (tank, dps, or support).
- All units have a range of 1 cube of distance (diagonal not included) to move and attack.
-   Roles: tank, dps, and support.
    -   Tank: will have more hp but less damage than the dps (Can deal more damage if it is located on a higher Y coord than the other unit).
    -   DPS: will have more damage but less hp than the tank (Can move on diagonal).
    -   Support: will have same hp as dps and lower damage than tank, but it can heal other units at 1 cube of distance (included diagonal), cannot heal himself.
- From the N(to determine) round, the terrain will start to shrink, and the units will start to lose hp each turn.
