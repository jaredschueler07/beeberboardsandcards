# Technical Architectures for Automated Content Synthesis and Data Exportation within the Tabletop Simulator Ecosystem

The virtualization of tabletop gaming environments necessitates a robust framework for asset management, state serialization, and external system integration. Within the Tabletop Simulator ecosystem, the pursuit of "click to export" functionality and "super simple" custom game creation requires an understanding of the underlying Unity-based engine, the JSON-formatted save structures, and the asynchronous communication protocols provided by the External Editor API. The ability to streamline the creation of complex game components, such as custom decks and 3D models, depends on a developer's capacity to navigate the sandbox limitations of the Lua scripting environment while leveraging external bridges for file system operations. The following analysis examines the technical requirements and community-driven methodologies for achieving these automation goals, with a specific focus on the architectural precedents established by educational frameworks and industrial modding tools.

## The Structural Foundation of Asset Importation and Management

The initial phase of any custom game creation process involves the ingestion of graphical and geometric assets into the simulation environment. Tabletop Simulator employs a pointer-based system for asset resolution, where the internal state of a game object refers to either a local file path or a remote URL. This distinction is critical for the transition from development to deployment; assets hosted on a local machine are only visible to the host, rendering them unusable in a multiplayer context. Consequently, the "super simple" creation of multiplayer-ready games mandates the use of centralized hosting, such as the Steam Cloud, which provides users with 100GB of storage tied to their Steam accounts.

The Cloud Manager serves as the primary administrative interface for these assets. It allows for the mass migration of local files to the cloud via the "Upload All" feature, which automatically generates unique URLs for each asset and updates the active game session's pointers. However, community reports indicate that the Steam Cloud is subject to a technical cap of approximately 10,000 files, a limitation that can lead to synchronization errors or persistent "upload wheel" lockups when attempting to process large volumes of small assets, such as individual tokens or cards.

| Hosting Method | Storage Limit | Accessibility | Protocol |
|---|---|---|---|
| Local File System | Disk Dependent | Host Only | file:/// |
| Steam Cloud | 100GB / 10k Files | Global (Session) | steamusercontent |
| Third-Party Hosting | External Dependent | Global (Session) | http:// or https:// |
| Mod Caching | Local Disk | User Only | In-engine persistence |

The process of custom game creation is further complicated by the requirements for specific object types. Custom decks are synthesized from card sheets, which are composite images containing a grid of individual card faces. These sheets are then "cut" by the engine according to user-defined horizontal and vertical dimensions. For developers seeking a "super simple" workflow, the built-in Deck Builder utility—located in the Modding/Deck Builder subdirectory of the game's installation folder—allows for the drag-and-drop arrangement of cards and the automatic exportation of the final sheet in PNG or JPG format.

## JSON Serialization and the Object State Schema

The capacity to implement a "click to export" feature or an automated creator tool is predicated on the capacity to manipulate the game's save data directly. Tabletop Simulator utilizes JSON (JavaScript Object Notation) for all save files and saved objects, specifically employing the JSON.NET library for Unity. This architectural choice enables external applications to parse and generate game states without requiring the simulation to be active.

A standard Tabletop Simulator save file is a serialized representation of the SaveState class, which aggregates global environment variables and a collection of ObjectState entries. Each ObjectState contains the exhaustive definition of a physical entity, including its transform, physics properties, and custom asset pointers.

| Field Name | Data Type | Functional Significance |
|---|---|---|
| Name | String | Internal ID for object type (e.g., "Custom_Deck") |
| Transform | Object | Defines Position, Rotation, and Scaling on three axes |
| Nickname | String | The user-visible name displayed in the UI |
| Description | String | Metadata or lore text displayed on hover |
| LuaScript | String | The script code attached to the specific object |
| Locked | Boolean | Determines if the object is frozen in 3D space |

For custom 3D models, the CustomMesh sub-object within the JSON schema defines the geometric source files. This includes fields for the MeshURL (geometry), DiffuseURL (texture), NormalURL (depth mapping), and ColliderURL (physics boundaries). Advanced automation tools can manipulate these strings to "swap" models dynamically or to generate complex scenes from external configuration files. Furthermore, the PhysicsMaterial section allows for the granular adjustment of DynamicFriction, StaticFriction, and Bounciness, properties that are essential for ensuring that custom components behave realistically within the physics-driven environment.

## The External Editor API: A Protocol for Egress and Ingress

The most sophisticated method for achieving "click to export" functionality is the External Editor API. This system establishes a bidirectional bridge between Tabletop Simulator and external software via localhost TCP connections. The architecture designates two specific ports for communication: port 39999, where the game listens for instructions, and port 39998, where the external application or editor listens for updates from the game.

When an external process (such as a custom Python script or a Node.js server) listens on port 39998, it can receive various message types triggered by in-game events. These messages are encapsulated in JSON and identified by specific messageID values.

| Message ID | Origin | Data Contained |
|---|---|---|
| 1 | Loading a New Game | Full Lua scripts and XML UI for all objects |
| 2 | print() or log() | Debug strings from the Lua environment |
| 4 | sendExternalMessage() | Custom Lua tables sent to the external tool |
| 5 | Return Value | The result of an externally executed Lua snippet |
| 6 | Game Saved | Notification that a save operation occurred |

The function `sendExternalMessage(data)` is the cornerstone of the "click to export" requirement. Within a Lua script, a developer can gather any table-based data—such as current game scores, player inventories, or card positions—and transmit it to the external editor. Since the Tabletop Simulator Lua environment is sandboxed and lacks access to the `io` library for direct file system writes, this API represents the only sanctioned pathway for exporting data to a local file.

For "super simple" game creation, the external tool can reverse this process by sending an "Execute Lua Code" message to port 39999. This allows an external generator to programmatically spawn objects, set their positions, and configure their properties in real-time within a running instance of the game. Tools like tts-editor for Node.js implement this API to facilitate the rapid deployment of scripted content, bypassing the need for manual interaction with the in-game scripting window.

## Programmatic Creation through the Lua API

The Lua scripting environment within Tabletop Simulator provides high-level functions for the automated instantiation of objects. For a developer seeking to create a "super simple" custom game creator, the `spawnObjectData` and `spawnObjectJSON` functions are indispensable. Unlike the standard `spawnObject` function, which creates a blank instance of a specific type, `spawnObjectData` accepts a Lua table that mimics the internal JSON structure of an object. This allows for the simultaneous configuration of name, transform, and custom asset URLs in a single function call.

```lua
-- Conceptual creation of a custom card via spawnObjectData
local cardTable = {
   data = {
       Name = "Card",
       Transform = {
           posX = 0, posY = 3, posZ = 0,
           rotX = 0, rotY = 180, rotZ = 0,
           scaleX = 1, scaleY = 1, scaleZ = 1
       },
       Nickname = "Automated Card",
       CustomDeck = {
            [1] = {
               FaceURL = "https://example.com/face.png",
               BackURL = "https://example.com/back.png",
               NumWidth = 1,
               NumHeight = 1,
               BackIsHidden = true
           }
       }
   }
}
spawnObjectData(cardTable)
```

The ability to fetch data from external sources further enhances this creation process. The `WebRequest.get(url, callback)` function allows a script to retrieve data from a web-hosted JSON or CSV file. By parsing this data into Lua tables, a single "Global" script can serve as a template that populates the game table based on a remote database. This is particularly effective for card games where card statistics and imagery are frequently updated; the game can "self-assemble" each time it is loaded by fetching the latest definitions from the web.

## The Sandbox Constraint and Environmental Limitations

Architecting an export or creation bridge requires a nuanced understanding of the MoonSharp Lua implementation. Tabletop Simulator includes a subset of Lua's standard libraries to provide a secure sandbox, which intentionally omits several features necessary for traditional software development.

| Standard Library | Availability | Reason for Restriction |
|---|---|---|
| Basic | Full | Essential methods like print, type, tostring |
| io | Absent | Prevents arbitrary file read/write on host system |
| os | Restricted | Prevents execution of shell commands and system calls |
| debug | Absent | Prevents introspection of the game engine's internals |
| package | Absent | Prevents the loading of external C-based libraries |

Due to these constraints, any "click to export" tool must utilize either `WebRequest` to send data to a remote server or the External Editor API to send data to a local TCP listener. Furthermore, the lack of `io.popen` or `ffi` (Foreign Function Interface) in the standard environment means that the simulation cannot directly interact with the system clipboard or local hardware without an external mediator.

## Community Automation Tools and CLI Solutions

Beyond the official documentation, the community has developed several tools that bridge the gap between external data and in-game assets. These tools often target the `Saves/Saved Objects` directory as the primary interface for content injection.

| Tool Name | Core Functionality | Primary Use Case |
|---|---|---|
| WSMTools (wstools) | CLI for parsing card databases and exporting to TTS | TCG Deck Building (Weiss Schwarz) |
| TTS-Deck-Editor | GUI for assembling card sheets and JSON states | Manual Deck Assembly |
| TTS Deck Importer | Open-source parser for .dec and .ydk files | Magic: The Gathering / Yu-Gi-Oh |
| Cloud Manager CLI | Third-party mass upload tool for Steam Cloud | Asset Hosting Management |

A standout example is the wstools CLI, which allows users to parse deck links from external websites (like Encore Decks) and generate both the composite image sheet and the corresponding `.json` saved object file. This tool illustrates a functional "super simple" creation path: the user executes a command-line instruction, and the resulting files are placed in the Saved Objects folder, where they appear in the in-game chest with a generated thumbnail.

## Integrating Custom XML UI for One-Click Interaction

To make the creation or export process truly "super simple" for the end-user, it must be integrated into the game's HUD (Heads-Up Display) via the Custom XML UI system. This system allows for the creation of buttons, input fields, and text labels that live on the screen or on the surface of objects.

The XML UI is defined in a separate tab within the scripting window and communicates with the Lua environment through event handlers like `onClick` and `onEndEdit`.

| Element | Relevant Attributes | Event Trigger |
|---|---|---|
| `<Button>` | onClick, icon, interactable | Function call in Lua |
| `<InputField>` | onEndEdit, characterValidation, text | Data transmission to Lua |
| `<Toggle>` | onValueChanged, isOn, toggleWidth | State change boolean |
| `<Dropdown>` | onValueChanged, itemHeight | Selection from option list |

An automated creator tool would ideally use the `<InputField>` element to accept a URL for a JSON/CSV configuration. When the user completes the input, the `onEndEdit` event triggers a Lua function that performs a `WebRequest.get` to fetch the configuration, followed by a loop that calls `spawnObjectData` for each entry. Similarly, an export button would trigger a function that compiles the table's state into a single table and transmits it via `sendExternalMessage`.

The `setCustomAssets(assets)` function is another vital component for UI-based automation. It allows the UI to reference external images for use as icons or backgrounds, which can be dynamically updated to reflect the current state of the export/creation process.

## Theoretical Framework for a "Click to Export" Pipeline

Developing a "click to export" system requires the orchestration of multiple subsystems. The following technical workflow represents the current best-practice approach for implementing this feature within the Tabletop Simulator environment.

1. **Listener Initialization**: The developer launches a local background application (e.g., written in Node.js or Python) that opens a TCP server on port 39998. This application is responsible for receiving game data and writing it to the local file system.

2. **In-Game HUD Synthesis**: Within the Tabletop Simulator Global script, an XML UI is created containing an "Export Session" button.

3. **Data Harvesting**: When the button is clicked, a Lua function iterates through all relevant objects on the table using `getObjects()` or `getObjectsWithTag()`. For each object, the script gathers specific data points such as `getName()`, `getPosition()`, `getRotation()`, and `getCustomObject()` details.

4. **Payload Preparation**: The harvested data is organized into a nested Lua table. The `JSON.encode()` function can be used locally for validation, though `sendExternalMessage()` will automatically handle the serialization for the TCP transmission.

5. **Transmission (Egress)**: The script executes `sendExternalMessage(payloadTable)`. Tabletop Simulator then constructs a JSON message with `messageID: 4` and sends it to `localhost:39998`.

6. **File System Persistence**: The external listener receives the JSON, parses the `customMessage` field, and uses a standard library (like Node's `fs` or Python's `json`) to save the data to a file, such as `export_session_123.json` or a CSV formatted list of components.

This pipeline effectively bypasses the Lua sandbox's file I/O restrictions by using the External Editor API as a secure gateway to the host machine's system resources.

## Conclusion and Strategic Outlook

The architectural analysis of Tabletop Simulator's documentation and community tooling indicates that while the software does not provide a "native" one-click export button for external file formats, it provides a highly extensible framework that makes such a feature entirely feasible for advanced developers. The "super simple" custom game creation process is best achieved through a combination of external JSON/CSV generators and in-game programmatic spawning using `spawnObjectData`.

Moving forward, the continued evolution of the External Editor API and the expansion of the XML UI system will likely further reduce the friction between the simulated tabletop and the broader digital development landscape, ultimately realizing the vision of a seamless creation-to-export pipeline.

---

*Works cited:*
1. Asset Importing - Tabletop Simulator Knowledge Base, https://kb.tabletopsimulator.com/custom-content/asset-importing/
2. Making a custom deck of cards - Steam Community, https://steamcommunity.com/app/286160/discussions/0/1319961868333041924/
3. Cloud Manager - Tabletop Simulator Knowledge Base, https://kb.tabletopsimulator.com/custom-content/cloud-manager/
4. Quick question regarding the cloud upload tool - Reddit, https://www.reddit.com/r/tabletopsimulator/comments/g1ppod/quick_question_regarding_the_cloud_upload_tool/
5. File limit? Failed to Write File to Steam Cloud - Reddit, https://www.reddit.com/r/tabletopsimulator/comments/tf7n3s/file_limit_failed_to_write_file_to_steam_cloud/
6. Upload local files to TTS for multiplayer access - Reddit, https://www.reddit.com/r/tabletopsimulator/comments/1bf3yet/upload_local_files_to_tts_for_multiplayer_access/
7. Custom Deck - Tabletop Simulator Knowledge Base, https://kb.tabletopsimulator.com/custom-content/custom-deck/
8. Tabletop Simulator Setup - r/WeissSchwarz Guide, https://www.reddit.com/r/WeissSchwarz/wiki/tts-setup/
9. Deck Builder - Steam Community Discussions, https://steamcommunity.com/workshop/discussions/-1/540742485483851013/?appid=286160
10. Save File Format - Official Tabletop Simulator Wiki, https://tabletopsimulator.fandom.com/wiki/Save_File_Format
11. Save File Format - Tabletop Simulator Knowledge Base, https://kb.tabletopsimulator.com/custom-content/save-file-format/
12. Tabletop-Simulator-API/docs/object.md - GitHub, https://github.com/Berserk-Games/Tabletop-Simulator-API/blob/master/docs/object.md
13. External Editor API - Tabletop Simulator API, https://api.tabletopsimulator.com/externaleditorapi/
14. Base - Tabletop Simulator API, https://api.tabletopsimulator.com/base/
15. lua-users wiki: Sand Boxes, http://lua-users.org/wiki/SandBoxes
16. tts-editor - GitHub, https://github.com/matanlurey/tts-editor
17. Web Request Manager - Tabletop Simulator API, https://api.tabletopsimulator.com/webrequest/manager/
18. UI - Tabletop Simulator API, https://api.tabletopsimulator.com/ui/
19. Lua in Tabletop Simulator, https://api.tabletopsimulator.com/lua-in-tabletop-simulator/
20. WSMTools (Weiss Schwarz Montage Tools) - GitHub, https://github.com/ronelm2000/wsmtools
21. tts-cloud-manager - GitHub, https://github.com/leberechtreinhold/tts-cloud-manager
22. Introduction - Tabletop Simulator UI API, https://api.tabletopsimulator.com/ui/introUI/
23. Input Elements - Tabletop Simulator API, https://api.tabletopsimulator.com/ui/inputelements/
24. Object - Tabletop Simulator API, https://api.tabletopsimulator.com/object/
25. JSON - Tabletop Simulator API, https://api.tabletopsimulator.com/json/
