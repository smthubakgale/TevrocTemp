// mermaid.js
const { usersData, jsonDataArray, user_inherits, getInheritedUsers, user_management, server_management, project_management, mvc_Frameworks } = require('../data/database');
const ExcelJS = require("exceljs");
const { dialog } = require("electron");
const fs = require("fs");


const { app } = require("electron"); 
 
const path = require('path');
const JSZip = require('jszip'); 

class Mermaid {
    constructor() {
        this.user_inherits = user_inherits;
        this.user_management = user_management;
    }

    getRequirements(mLogs) {
        function getResPath(...subpaths) {
            let basePath = app.getAppPath();
            return path.join(basePath, "public", "res", ...subpaths);
        }
        // Loop through frameworks
        mvc_Frameworks.forEach((framework, k) => {
            const baseFolder = framework.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
            mLogs({ Y: `${(k + 1)}. ${framework.title}` });
            let tb = "";

            if (framework.reqs == true) {
                // Use helper to resolve proper res path
                const diskPath = getResPath(baseFolder, "requirements.md");
                //console.log(diskPath);
                 
                let fileContent = "";
                try {
                    if (fs.existsSync(diskPath)) {
                        fileContent = fs.readFileSync(diskPath, "utf-8");
                    }
                } catch (err) {
                    mLogs({ R: `Could not read ${diskPath}:` });
                }

                if (fileContent == "") {   
                    mLogs({ R: "file empty" });
                }

                mLogs({ MK: fileContent });
            }

        });

        mLogs({Y:" General Requirements"})
        mLogs({
            MR: `
requirementDiagram

    %% -------------------------
    %% Server-related requirements
    %% -------------------------
    requirement req1 {
    id: 1
    text: The server must have electricity and network connectivity 24/7
    risk: high
    verifymethod: inspection
    }

    physicalRequirement req2 {
    id: 1.1
    text: The server must have redundant power supply
    risk: high
    verifymethod: test
    }

    physicalRequirement req3 {
    id: 1.2
    text: The server must have cooling systems installed
    risk: medium
    verifymethod: inspection
    }

    designConstraint req4 {
    id: 1.3
    text: The server rack must fit in the data center space
    risk: medium
    verifymethod: analysis
    }

    functionalRequirement req5 {
    id: 1.4
    text: The server must be able to host the API and database
    risk: high
    verifymethod: demonstration
    }

    performanceRequirement req6 {
    id: 1.5
    text: The server should handle up to 1000 concurrent API requests
    risk: medium
    verifymethod: test
    }

    interfaceRequirement req7 {
    id: 1.6
    text: The server should provide secure remote management interfaces
    risk: high
    verifymethod: inspection
    }

    %% -------------------------
    %% API requirements
    %% -------------------------
    functionalRequirement req8 {
    id: 2.1
    text: The API is powered and running when the ecommerce app is running
    risk: high
    verifymethod: demonstration
    }

    functionalRequirement req9 {
    id: 2.2
    text: The API handles product catalog requests
    risk: high
    verifymethod: test
    }

    functionalRequirement req10 {
    id: 2.3
    text: The API handles order creation requests
    risk: high
    verifymethod: test
    }

    performanceRequirement req11 {
    id: 2.4
    text: The API responds to requests within 500ms
    risk: high
    verifymethod: test
    }

    performanceRequirement req12 {
    id: 2.5
    text: The API logs errors and warnings
    risk: medium
    verifymethod: inspection
    }

    interfaceRequirement req13 {
    id: 2.6
    text: The API has secure authentication mechanisms
    risk: high
    verifymethod: analysis
    }

    interfaceRequirement req14 {
    id: 2.7
    text: The API has data encryption
    risk: high
    verifymethod: analysis
    }

    functionalRequirement req15 {
    id: 2.8
    text: The API provides user account management
    risk: high
    verifymethod: test
    }

    performanceRequirement req16 {
    id: 2.9
    text: The API provides analytics and reporting
    risk: low
    verifymethod: demonstration
    }

    %% -------------------------
    %% App requirements
    %% -------------------------
    functionalRequirement req17 {
    id: 3.1
    text: Product search and filtering
    risk: medium
    verifymethod: test
    }

    functionalRequirement req19 {
    id: 3.3
    text: Multi language and currency
    risk: medium
    verifymethod: demonstration
    }

    interfaceRequirement req20 {
    id: 3.4
    text: Responsive UI (desktop & mobile)
    risk: medium
    verifymethod: inspection
    }

    performanceRequirement req21 {
    id: 3.5
    text: Maintain 99.9% uptime
    risk: high
    verifymethod: analysis
    }

    designConstraint req22 {
    id: 3.6
    text: Comply with GDPR/data privacy
    risk: high
    verifymethod: analysis
    }

    designConstraint req23 {
    id: 3.7
    text: Follow coding standards & CI/CD
    risk: medium
    verifymethod: inspection
    }

    performanceRequirement req24 {
    id: 3.8
    text: System auto scales at peak load
    risk: high
    verifymethod: test
    }

    %% -------------------------
    %% Elements
    %% -------------------------
    element Server {
    type: hardware
    }

    element API {
    type: software
    }

    element App {
    type: software
    }

    %% -------------------------
    %% Relationships
    %% -------------------------
    %% Server satisfies
    Server - satisfies -> req1
    Server - satisfies -> req2
    Server - satisfies -> req3
    Server - satisfies -> req4
    Server - satisfies -> req5
    Server - satisfies -> req6
    Server - satisfies -> req7

    %% API satisfies
    API - satisfies -> req8
    API - satisfies -> req9
    API - satisfies -> req10
    API - satisfies -> req11
    API - satisfies -> req12
    API - satisfies -> req13
    API - satisfies -> req14
    API - satisfies -> req15
    API - satisfies -> req16

    %% App satisfies
    App - satisfies -> req17
    App - satisfies -> req19
    App - satisfies -> req20
    App - satisfies -> req21
    App - satisfies -> req22
    App - satisfies -> req23
    App - satisfies -> req24

    %% Requirement hierarchy
    req1 - contains -> req2
    req1 - contains -> req3
    req2 - refines -> req4
    req5 - derives -> req6

    req8 - traces -> req9
    req9 - contains -> req10
    req10 - derives -> req11
    req11 - refines -> req12
    req13 - refines -> req14
    req15 - derives -> req16

    req17 - traces -> req8
    req19 - traces -> req9
    req20 - traces -> req13
    req21 - derives -> req11
    req24 - derives -> req6




`})
    }

    generateComponent(mLogs) {

        mvc_Frameworks.forEach((fm , k) => {

            mLogs({ Y: `${(k + 1)}. ${fm.title}` });
            if (fm.components) {
                (Object.keys(fm.components || [])).forEach((cm, i) => {
                    let nm = [];

                    cm.split("_").forEach((c) => {
                        let n = c.substring(0, 1).toUpperCase() + c.slice(1);
                        nm.push(n);
                    });

                    nm = nm.join(" ");

                    mLogs({ Y: `${(k + 1)}.${(i + 1)}. ${nm}` })
                    mLogs({ MR: fm.components[cm] })
                });
            }
        });

    }

    generateDeployment(mLogs) {

        mvc_Frameworks.forEach((fm, k) => {
            mLogs({ Y: `${k + 1}. ${fm.title}` });

            let dp = `%% Deployment Diagram for ${fm.title} Project
graph TB
    subgraph ${fm.title}
`;

            let fileCounter = 1; // Global counter for F1, F2, ...

            const processFiles = (files, level = 1) => {
                const indent = '  '.repeat(level);

                Object.keys(files || {}).forEach((key) => {
                    const value = files[key];

                    const isHelpers = key.toLowerCase() === 'helpers';

                    // Only create subgraph if not helpers
                    if (!isHelpers) {
                        dp += `${indent}subgraph ${key}\n`;
                        dp += `${indent}  direction LR\n`; // Force vertical layout
                    }

                    if (Array.isArray(value)) {
                        value.forEach((item) => {
                            if (typeof item === 'object' && item.uri) {
                                // File node at current indent
                                dp += `${indent}  F${fileCounter++}[${item.uri}]\n`;
                            } else if (Array.isArray(item)) {
                                item.forEach((subItem) => {
                                    dp += `${indent}  F${fileCounter++}[${subItem.uri || subItem}]\n`;
                                });
                            } else if (typeof item === 'object') {
                                // Recurse for nested object, same level for helpers
                                processFiles(item, level + (isHelpers ? 0 : 1));
                            }
                        });
                    } else if (typeof value === 'object') {
                        processFiles(value, level + (isHelpers ? 0 : 1));
                    }

                    // Close subgraph if not helpers
                    if (!isHelpers) {
                        dp += `${indent}end\n`;
                    }
                });
            };

            processFiles(fm.files);

            dp += `end\n`;

            mLogs({ MR: dp });
        });

    }

    generateInteractionSequenceDiagram(mLogs) {
        mLogs({ G: "Interaction Sequence Diagram" });

        let k = 0;
        user_management.concat(server_management).forEach((page) => {
            k++;
            mLogs({ Y: `${k} ${page.page} page` });
            let i = 0;

            if (page.services) {
                Object.keys(page.services || {}).forEach((service) => {
                    
                    page.services[service].forEach((req) => {

                        if (req.desc) {
                            i++;
                            mLogs({ B: `${ k }.${ i } ${req.desc.replace("\\n","")} ` });
                        }
                        if (req.interaction) {
                            mLogs({ MR: req.interaction });
                        }
                    });

                });
            }
        })
    }
    generateClassDiagram() {
        let diagram = "classDiagram \n\n direction LR \n\n";

        let rels = '';

        jsonDataArray.forEach((table) =>
        {
            diagram += `class ${table.tableName} { \n`;

            table.columns.forEach((column) =>
            {
                diagram += `    ${column.name} : ${column.type} [${column.nullable ? 'NULL':'NOT NULL'}`;

                (table.constraints||[]).forEach((constraint) =>
                {

                    if ((constraint.columns || [constraint.column]).indexOf(column.name) != -1 )
                    {
                        if (constraint.type == "check")
                        { 
                            diagram += ` , CHECK="${(constraint.options||[]).join(",")}" `;
                        }
                        if (constraint.type == "foreignKey")
                        {
                            (constraint.columns || [constraint.column]).forEach((col) =>
                            {
                                if (col == column.name)
                                {
                                    constraint.referencedColumns.forEach((refcol) =>
                                    {
                                        diagram += ` , FK->${constraint.referencedTable}.${refcol} `;
                                        let rel = `${constraint.referencedTable} <|-- ${table.tableName}`;

                                        if (rels.indexOf(rel) == -1) {
                                            rels += `${rel} \n`;
                                        }
                                    })
                                }
                            });
                            
                        }
                       
                    }
                });

                diagram += ` ] , \n`;

            });

            diagram += `} \n\n`; 
        })

        diagram += `\n ${rels} \n`;

        return diagram;
    } 
    generateUseCaseDiagram(mLogs) {
        let diagrams = [];

        // Pages
        user_management.filter(p => !(p.static == true)).forEach((page,index) => {

            let diagram = "graph TB\n\n";

            let users = [];
            (page.users || []).forEach((user) => {
                let h = (typeof (page.inherit) != 'undefined' ? page.inherit : true);
                if (users.filter(u => u.user == user && u.inherit == h).length == 0) {
                    users.push({ user: user, inherit: h });
                }
            });

            Object.keys(page.services || {}).forEach((service) => { 
                page.services[service].forEach((req) => {
                     
                    req.users.forEach((user) => {
                        let h = (typeof (req.inherit) != 'undefined' ? req.inherit : true);

                        if (users.filter(u => u.user == user && u.inherit == h).length == 0) {
                            users.push({ user: user, inherit: h });
                        }
                    })
                })
            });
             
            (page.algorithms || []).forEach((algorithm) => {
                (algorithm.users || []).forEach((user) => {
                    let h = (typeof (algorithm.inherit) != 'undefined' ? algorithm.inherit : true);
                    if (users.filter(u => u.user == user && u.inherit == h).length == 0) {
                        users.push({ user: user, inherit: h });
                    }
                });
            });


            Object.keys(page.actions || {}).forEach(action => {
                page.actions[action].forEach((table) => {
                    if (typeof (table) == "object") {
                        (table.users || []).forEach((user) =>
                        {
                            let h = (typeof (table.inherit) != 'undefined' ? table.inherit : true);
                            if (users.filter(u => u.user == user && u.inherit == h).length == 0) {
                                users.push({ user: user, inherit: h });
                            }
                        })
                    }
                })
            });
            // Actors

            //console.log(page.page, users);

            let arr = []; 
            users.forEach(us => {
                let u = us.user;

                diagram += `    ${u}["\u{1F468}<br> ${u.replaceAll("_"," ")}"]\n`;

                if (us.inherit == false) { }
                else {
                    getParent(u);
                }
                function getParent(user) {
                     
                    user_inherits.forEach(p => {

                        if ( p.inherits.indexOf(user) != -1 && arr.filter(r => r.p == p.user && r.u == user).length == 0 && p.user != user) {
                            arr.push({ p: p.user, u: user });
                            diagram += `    ${p.user}["\u{1F468}<br> ${p.user}"]\n`;
                            diagram += `    ${p.user} -.->|inherits| ${user}\n`;
                            getParent(p.user)
                        }
                    });
                    
                } 
            }); 
            // System 
            diagram += `\n    system[(Server)]\n\n`;
            // 
            const pageId = page.page.replace(/[\s-]/g, "_");
            diagram += `    subgraph ${pageId}["${page.page} Page"]\n`;

            // 
            let acts = '';
            let ucs = '';
            let deps = '';

            //  Actions 
            Object.keys(page.actions || {}).forEach(action => { 
                page.actions[action].forEach((table) => {

                    if (typeof (table) == "string") {
                        const actionId = action.replace(/[\s-]/g, "_");

                        const tableId = table.replace(/[\s-]/g, "_");

                        const ucId = `${pageId}_${actionId}_${tableId}`;
                        const ucLabel = `${action} ${table}`;

                        diagram += `        ${ucId}((${ucLabel}))\n`;


                        // User to Use Case
                        page.users.forEach((user) => {
                            acts += `    ${user} --> ${ucId}\n`;
                        });

                        ucs += `    ${ucId} --> system \n`;

                        if (action != "read" && action != "create" && page.actions["read"] && page.actions["read"].indexOf(table) != -1) {
                            let ucId2 = `${pageId}_${("read").replace(/[\s-]/g, "_")}_${tableId}`;

                            deps += `${ucId} -.->|include| ${ucId2} \n `;
                        }

                    }
                    else if (table["table"] && table["users"] && Array.isArray(table["users"]) && (table["users"] || []).length > 0) {
                        const actionId = action.replace(/[\s-]/g, "_");

                        const tableId = table.table.replace(/[\s-]/g, "_");

                        const ucId = `${pageId}_${actionId}_${tableId}`;
                        const ucLabel = `${action} ${table.table}`;

                        diagram += `        ${ucId}((${ucLabel}))\n`;


                        // User to Use Case
                        (table.users || []).forEach((user) => {
                            acts += `    ${user} --> ${ucId}\n`;
                        });

                        ucs += `    ${ucId} --> system \n`;

                        if (action != "read" && action != "create" && page.actions["read"] && page.actions["read"].indexOf(table) != -1) {
                            let ucId2 = `${pageId}_${("read").replace(/[\s-]/g, "_")}_${tableId}`;

                            deps += `${ucId} -.->|include| ${ucId2} \n `;
                        }
                    }
                });  
            });
            //  Files  
            Object.keys(page.files || {}).forEach(file => { 
                page.files[file].forEach((table) => { 
                    const fileId = file.replace(/[\s-]/g, "_");

                    const tableId = table.replace(/[\s-]/g, "_");

                    const ucId = `file_${pageId}_${fileId}_${tableId}`; 
                    const ucLabel = `${file} file for ${table}`;

                    diagram += `        ${ucId}((${ucLabel}))\n`;

                   
                    // User to Use Case
                    page.users.forEach((user) => {
                        acts += `    ${user} --> ${ucId}\n`;
                    });

                    ucs += `    ${ucId} --> system \n`;

                    if (file != "read" && file != "create" && page.files["read"] && page.files["read"].indexOf(table) != -1) {
                        let ucId2 = `file${pageId}${("read").replace(/[\s-]/g, "_")}_${tableId}`; 

                        deps += `${ucId} -.->|include| ${ucId2} \n `; 
                    } 
                    if (file == "read" && page.files["read"] && page.files["read"].indexOf(table) != -1) {
                        let ucId3 = `file_${pageId}_${fileId}_${tableId}`;
                        let ucId2 = `${pageId}_${fileId}_${tableId}`; 

                        deps += `${ucId3} -.->|include| ${ucId2} \n `; 
                    } 
                });  
            });
            // Services  
            Object.keys(page.services || {}).forEach((service) => {
                const serviceId = service.replace(/[\s-]/g, "_");
                // Requests
                page.services[service].forEach((req) => {

                    const reqId = req.uri.replace(/[\s-]/g, "_");

                    const ucId = `${pageId}_${serviceId}_${reqId}`;
                    const ucLabel = `<b>${service.toUpperCase()}</b> : ${req.uri} <br/><br/> ${req.desc} `;

                    diagram += `        ${ucId}((${ucLabel}))\n`;
                    // User to Use Case
                    (req.users || []).forEach((user) => {
                        acts += `    ${user} --> ${ucId}\n`;
                    });

                    ucs += `    ${ucId} --> system \n`;

                });
            });
            
            // Algorithms   
            (page.algorithms || []).forEach((algorithm) => {
                const algorithmId = algorithm.title.replace(/[\s-]/g, "_");

                const ucId = `${pageId}_${algorithmId}`;
                const ucLabel = `${algorithm.desc} `;

                diagram += `        ${ucId}((${ucLabel}))\n`;
                // User to Use Case
                (algorithm.users||[]).forEach((user) => {
                    acts += `    ${user} --> ${ucId}\n`;
                });

                ucs += `    ${ucId} --> system \n`;
            });
            //

            diagram += `    end\n\n`;
            diagram += ` ${acts} \n\n`;
            diagram += ` ${ucs} \n\n`;

            diagram += ` ${deps} \n\n`;

            let nms = [];

            (pageId.indexOf("_") == -1 ? [pageId] : pageId.split("_")).forEach((n) => {
                nms.push(n.substring(0, 1).toUpperCase() + n.slice(1));
            });
             
            diagrams.push({ Y: `${index + 1}. ${nms.join(" ")} page` });
            diagrams.push({ MR: diagram });
        }); 
         
        mLogs({ G: "Use Case Diagram" });
        mLogs({ G: "--: Pages" });
        diagrams.forEach((us) => { mLogs(us); });

        // Apps 
        diagrams = [];
        let index2 = 0;

        jsonDataArray.forEach((tb) => {
            let allCrudUsers = [];
            if (tb.crud) {
                const users = Object.values(tb.crud)
                    .flat()
                    .filter(u => typeof u === "string" && u.trim() !== "" && u !== "*");
                allCrudUsers.push(...users);
            }
            allCrudUsers = [...new Set(allCrudUsers)];

            (tb.apps || []).forEach((page) => {
                let diagram = "graph TB\n\n";

                // ===== ACTORS =====
                allCrudUsers.forEach(u => {
                    diagram += `    ${u}["\u{1F468}<br> ${u.replaceAll("_", " ")}"]\n`;

                    let arr = [];
                    if (page.inherit !== false) {
                        getParent(u);
                    }

                    function getParent(user) {
                        user_inherits.forEach(p => {
                            if (
                                p.inherits.indexOf(user) !== -1 &&
                                arr.filter(r => r.p === p.user && r.u === user).length === 0 &&
                                p.user !== user
                            ) {
                                arr.push({ p: p.user, u: user });
                                diagram += `    ${p.user}["\u{1F468}<br> ${p.user}"]\n`;
                                diagram += `    ${p.user} -.->|inherits| ${user}\n`;
                                getParent(p.user);
                            }
                        });
                    }
                });

                // ===== SYSTEM =====
                diagram += `\n    system[(Server)]\n\n`;

                const pageId = page.name.replace(/[\s-]/g, "_");
                diagram += `    subgraph ${pageId}["${page.name} Page"]\n`;

                let acts = '';
                let ucs = '';
                let deps = '';

                // ===== ACTIONS =====
                Object.keys(page.actions || {}).forEach(action => {
                    page.actions[action].forEach((table) => {
                        const actionId = action.replace(/[\s-]/g, "_");

                        // ? Handle object format {table: "Products", users: []}
                        if (typeof table === "object" && table.table) {
                            const tableId = table.table.replace(/[\s-]/g, "_");
                            const ucId = `${pageId}_${actionId}_${tableId}`;
                            const ucLabel = `${action} ${table.table}`;

                            diagram += `        ${ucId}((${ucLabel}))\n`;

                            // Connect only specified users
                            (table.users || []).forEach((user) => {
                                acts += `    ${user} --> ${ucId}\n`;
                            });

                            ucs += `    ${ucId} --> system \n`;

                            // Dependency handling
                            if (
                                action !== "read" &&
                                action !== "create" &&
                                page.actions["read"] &&
                                page.actions["read"].some(t => t.table === table.table || t === table.table)
                            ) {
                                const ucId2 = `${pageId}_read_${tableId}`;
                                deps += `${ucId} -.->|include| ${ucId2}\n`;
                            }
                        }
                        // ? Handle string format "Products"
                        else if (typeof table === "string") {
                            const tableId = table.replace(/[\s-]/g, "_");
                            const ucId = `${pageId}_${actionId}_${tableId}`;
                            const ucLabel = `${action} ${table}`;

                            diagram += `        ${ucId}((${ucLabel}))\n`;

                            // Connect all users
                            allCrudUsers.forEach((user) => {
                                acts += `    ${user} --> ${ucId}\n`;
                            });

                            ucs += `    ${ucId} --> system \n`;

                            if (
                                action !== "read" &&
                                action !== "create" &&
                                page.actions["read"] &&
                                page.actions["read"].indexOf(table) !== -1
                            ) {
                                const ucId2 = `${pageId}_read_${tableId}`;
                                deps += `${ucId} -.->|include| ${ucId2}\n`;
                            }
                        }
                    });
                });

                // ===== FILES =====
                Object.keys(page.files || {}).forEach(file => {
                    page.files[file].forEach((table) => {
                        const fileId = file.replace(/[\s-]/g, "_");
                        const tableId = table.replace(/[\s-]/g, "_");
                        const ucId = `file_${pageId}_${fileId}_${tableId}`;
                        const ucLabel = `${file} file for ${table}`;

                        diagram += `        ${ucId}((${ucLabel}))\n`;

                        allCrudUsers.forEach((user) => {
                            acts += `    ${user} --> ${ucId}\n`;
                        });

                        ucs += `    ${ucId} --> system \n`;

                        if (file !== "read" && file !== "create" && page.files["read"] && page.files["read"].indexOf(table) !== -1) {
                            const ucId2 = `file${pageId}read_${tableId}`;
                            deps += `${ucId} -.->|include| ${ucId2}\n`;
                        }
                        if (file === "read" && page.files["read"] && page.files["read"].indexOf(table) !== -1) {
                            const ucId3 = `file_${pageId}_${fileId}_${tableId}`;
                            const ucId2 = `${pageId}_${fileId}_${tableId}`;
                            deps += `${ucId3} -.->|include| ${ucId2}\n`;
                        }
                    });
                });

                // ===== SERVICES =====
                Object.keys(page.services || {}).forEach((service) => {
                    const serviceId = service.replace(/[\s-]/g, "_");
                    page.services[service].forEach((req) => {
                        const reqId = req.uri.replace(/[\s-]/g, "_");
                        const ucId = `${pageId}_${serviceId}_${reqId}`;
                        const ucLabel = `<b>${service.toUpperCase()}</b> : ${req.uri} <br/><br/> ${req.desc}`;
                        diagram += `        ${ucId}((${ucLabel}))\n`;

                        (req.users || allCrudUsers).forEach((user) => {
                            acts += `    ${user} --> ${ucId}\n`;
                        });

                        ucs += `    ${ucId} --> system \n`;
                    });
                });

                // ===== ALGORITHMS =====
                (page.algorithms || []).forEach((algorithm) => {
                    const algorithmId = algorithm.title.replace(/[\s-]/g, "_");
                    const ucId = `${pageId}_${algorithmId}`;
                    const ucLabel = `${algorithm.desc}`;
                    diagram += `        ${ucId}((${ucLabel}))\n`;

                    (algorithm.users || allCrudUsers).forEach((user) => {
                        acts += `    ${user} --> ${ucId}\n`;
                    });

                    ucs += `    ${ucId} --> system \n`;
                });

                diagram += `    end\n\n`;
                diagram += ` ${acts}\n\n`;
                diagram += ` ${ucs}\n\n`;
                diagram += ` ${deps}\n\n`;

                let nms = [];
                (pageId.indexOf("_") === -1 ? [pageId] : pageId.split("_")).forEach((n) => {
                    nms.push(n.substring(0, 1).toUpperCase() + n.slice(1));
                });

                diagrams.push({ Y: `${index2 + 1}. ${nms.join(" ")} app` });
                diagrams.push({ MR: diagram });

                index2 += 1;
            });
        });


        mLogs({ G: "--: Apps" });
        diagrams.forEach((us) => { mLogs(us); });
        // Reports  
        diagrams = [];
        index2 = 0;

        jsonDataArray.forEach((tb) => {

            let allCrudUsers = [];
            if (tb.crud) {
                const users = Object.values(tb.crud)
                    .flat()
                    .filter(u => typeof u === "string" && u.trim() !== "" && u !== "*"); // safe filter
                allCrudUsers.push(...users);
            }
            allCrudUsers = [...new Set(allCrudUsers)];

            (tb.reports || []).forEach((page) => {

                let diagram = "graph TB\n\n";

                // ===== ACTORS =====
                allCrudUsers.forEach(u => {
                    diagram += `    ${u}["\u{1F468}<br> ${u.replaceAll("_", " ")}"]\n`;

                    let arr = [];
                    if (page.inherit !== false) {
                        getParent(u);
                    }

                    function getParent(user) {
                        user_inherits.forEach(p => {
                            if (
                                p.inherits.indexOf(user) !== -1 &&
                                arr.filter(r => r.p === p.user && r.u === user).length === 0 &&
                                p.user !== user
                            ) {
                                arr.push({ p: p.user, u: user });
                                diagram += `    ${p.user}["\u{1F468}<br> ${p.user}"]\n`;
                                diagram += `    ${p.user} -.->|inherits| ${user}\n`;
                                getParent(p.user);
                            }
                        });
                    }
                });

                // ===== SYSTEM =====
                diagram += `\n    system[(Server)]\n\n`;
                const pageId = page.name.replace(/[\s-]/g, "_");
                diagram += `    subgraph ${pageId}["${page.name} Page"]\n`;

                let acts = '';
                let ucs = '';
                let deps = '';

                // ===== ACTIONS =====
                Object.keys(page.actions || {}).forEach(action => {
                    page.actions[action].forEach((table) => {
                        const actionId = action.replace(/[\s-]/g, "_");

                        // Handle object format {table: "Products", users: []}
                        if (typeof table === "object" && table.table) {
                            const tableId = table.table.replace(/[\s-]/g, "_");
                            const ucId = `${pageId}_${actionId}_${tableId}`;
                            const ucLabel = `${action} ${table.table}`;

                            diagram += `        ${ucId}((${ucLabel}))\n`;

                            // Connect only specified users
                            (table.users || []).forEach((user) => {
                                acts += `    ${user} --> ${ucId}\n`;
                            });

                            ucs += `    ${ucId} --> system \n`;

                            // Dependency handling
                            if (
                                action !== "read" &&
                                action !== "create" &&
                                page.actions["read"] &&
                                page.actions["read"].some(t => t.table === table.table || t === table.table)
                            ) {
                                const ucId2 = `${pageId}_read_${tableId}`;
                                deps += `${ucId} -.->|include| ${ucId2}\n`;
                            }
                        }
                        // Handle string format "Products"
                        else if (typeof table === "string") {
                            const tableId = table.replace(/[\s-]/g, "_");
                            const ucId = `${pageId}_${actionId}_${tableId}`;
                            const ucLabel = `${action} ${table}`;

                            diagram += `        ${ucId}((${ucLabel}))\n`;

                            // Connect all users
                            allCrudUsers.forEach((user) => {
                                acts += `    ${user} --> ${ucId}\n`;
                            });

                            ucs += `    ${ucId} --> system \n`;

                            if (
                                action !== "read" &&
                                action !== "create" &&
                                page.actions["read"] &&
                                page.actions["read"].indexOf(table) !== -1
                            ) {
                                const ucId2 = `${pageId}_read_${tableId}`;
                                deps += `${ucId} -.->|include| ${ucId2}\n`;
                            }
                        }
                    });
                });

                // ===== FILES =====
                Object.keys(page.files || {}).forEach(file => {
                    page.files[file].forEach((table) => {
                        const fileId = file.replace(/[\s-]/g, "_");
                        const tableId = table.replace(/[\s-]/g, "_");
                        const ucId = `file_${pageId}_${fileId}_${tableId}`;
                        const ucLabel = `${file} file for ${table}`;

                        diagram += `        ${ucId}((${ucLabel}))\n`;

                        allCrudUsers.forEach((user) => {
                            acts += `    ${user} --> ${ucId}\n`;
                        });

                        ucs += `    ${ucId} --> system \n`;

                        if (file !== "read" && file !== "create" && page.files["read"] && page.files["read"].indexOf(table) !== -1) {
                            const ucId2 = `file${pageId}read_${tableId}`;
                            deps += `${ucId} -.->|include| ${ucId2}\n`;
                        }
                        if (file === "read" && page.files["read"] && page.files["read"].indexOf(table) !== -1) {
                            const ucId3 = `file_${pageId}_${fileId}_${tableId}`;
                            const ucId2 = `${pageId}_${fileId}_${tableId}`;
                            deps += `${ucId3} -.->|include| ${ucId2}\n`;
                        }
                    });
                });

                // ===== SERVICES =====
                Object.keys(page.services || {}).forEach((service) => {
                    const serviceId = service.replace(/[\s-]/g, "_");
                    page.services[service].forEach((req) => {
                        const reqId = req.uri.replace(/[\s-]/g, "_");
                        const ucId = `${pageId}_${serviceId}_${reqId}`;
                        const ucLabel = `<b>${service.toUpperCase()}</b> : ${req.uri} <br/><br/> ${req.desc}`;
                        diagram += `        ${ucId}((${ucLabel}))\n`;

                        (req.users || allCrudUsers).forEach((user) => {
                            acts += `    ${user} --> ${ucId}\n`;
                        });

                        ucs += `    ${ucId} --> system \n`;
                    });
                });

                // ===== ALGORITHMS =====
                (page.algorithms || []).forEach((algorithm) => {
                    const algorithmId = algorithm.title.replace(/[\s-]/g, "_");
                    const ucId = `${pageId}_${algorithmId}`;
                    const ucLabel = `${algorithm.desc}`;
                    diagram += `        ${ucId}((${ucLabel}))\n`;

                    (algorithm.users || allCrudUsers).forEach((user) => {
                        acts += `    ${user} --> ${ucId}\n`;
                    });

                    ucs += `    ${ucId} --> system \n`;
                });

                diagram += `    end\n\n`;
                diagram += ` ${acts}\n\n`;
                diagram += ` ${ucs}\n\n`;
                diagram += ` ${deps}\n\n`;

                let nms = [];
                (pageId.indexOf("_") === -1 ? [pageId] : pageId.split("_")).forEach((n) => {
                    nms.push(n.substring(0, 1).toUpperCase() + n.slice(1));
                });

                diagrams.push({ Y: `${index2 + 1}. ${nms.join(" ")} report` });
                diagrams.push({ MR: diagram });

                index2 += 1;
            });
        });

        mLogs({ G: "--: Reports" });
        diagrams.forEach((us) => { mLogs(us); });
        // 
    }
    projetPlan(mLogs) {
        let tb = `
         <div style="width:100%; overflow-x:scroll; margin-bottom:50px" >
            <div style="margin-top:10px; margin-bottom:4px; color:#46B8DA; font-weight:600;"> UI Pagex </div>
            <table style="width:100%; border: 1px solid white; border-collapse: collapse;" >
`;
        // Heading 
        let cols = [
            { h: "Phase", r: 2, c: 1 },
            { h: "Page", r: 2, c: 1 },
            { h: "Actions", r: 1, c: 4 },
            { h: "Files", r: 1, c: 4 },
            { h: "Services", r: 1, c: 2 },
            { h: "Algorithms", r: 2, c: 1 },
            { h: "Project", r: 1, c: 2 }, 
        ];

        tb += `<tr style="text-align:center;">`;
        cols.forEach((col) => {
            tb += `<th rowspan="${col.r}" colspan="${col.c}" style="border: 1px solid white; padding:4px;"> ${col.h} </th>`;
        });
        tb += `</tr>`;
        // Sub heading 
        cols = [
            "Create", "Read", "Update", "Delete",  
            "Create", "Read", "Update", "Delete",
            "Protocol","Parameters" ,
            "Developer" , "Status"
        ];

        tb += `<tr style="text-align:center;">`;
        cols.forEach((col) => {
            tb += `<th style="border: 1px solid white; padding:4px;" > ${col} </th>`;
        });
        tb += `</tr>`;
        // Data 
        (() =>
        {
            let pages = user_management.map((p) =>
            { 
                let pt = project_management.filter(pm => pm.phase == p.phase); 

                if (pt.length > 0) {
                    p.phase = pt[0].title || "Other";
                }
                else {
                    p.phase = "Other";
                }

                return p;
            });

            let phase_all = pages.map(ph => { return { page: ph.page, phase: ph.phase } });

            let phase_set = [...new Set(phase_all.map(ph => ph.phase))];
            phase_set = phase_set.filter(p => p !== "Other").concat("Other");

            let phases = phase_set.map((ps) => {

                return {
                    name: ps,
                    count: phase_all.filter(v => v.phase == ps).length,
                    pages: phase_all.filter(v => v.phase == ps).map(v => v.page)
                }
            });

            pages = user_management.map((p) => {
                let cn = 0;

                if (p.actions) {
                    if (p.actions.create) { cn += p.actions.create.length; }
                    if (p.actions.read) { cn += p.actions.read.length; }
                    if (p.actions.update) { cn += p.actions.update.length; }
                    if (p.actions.delete) { cn += p.actions.delete.length; }
                }

                if (p.modals) { cn += p .modals.length; }
                if (p.sections) { cn += p.sections.length; }

                if (p.files) {
                    if (p.files.create) { cn += p.files.create.length; }
                    if (p.files.read) { cn += p.files.read.length; }
                    if (p.files.update) { cn += p.files.update.length; }
                    if (p.files.delete) { cn += p.files.delete.length; }
                }

                if (p.services) {
                    Object.keys(p.services || []).forEach((s) => {
                        cn += p.services[s].length;
                    })
                }

                if (p.algorithms) {
                    cn += p.algorithms.length;
                }

                if (p.static == true) { 
                    cn += 1; 
                }

                let ret = {
                    name: p.page,
                    count: cn
                };

                return ret;
            });

            let space = `<td style="border: 1px solid white; padding:4px; text-align:center;"> - </td>`;
            let blank = `<td style="border: 1px solid white; padding:4px; background:black; min-width:120px;"></td>`

            phases.forEach((ph) => {
                let ph_cn = 0;
                ph.pages.forEach((p) => {
                    let pg = pages.filter(v => v.name == p);
                    if (pg.length > 0) {
                        pg.forEach((v) => {
                            ph_cn += v.name == "index" ? 3 * v.count : v.count;
                        });
                    }
                    else {
                        ph_cn += 1;
                    }

                });

                let added_phase = false;
                function addPhase() {
                    if (!added_phase) {
                        added_phase = true;

                        tb += `<td rowspan="${ph_cn}" style="border: 1px solid white; padding:4px; min-width:120px;"> ${ph.name} </td>`;
                    }

                }

                ph.pages.forEach((p) => {

                    pages.filter(v => v.name == p).forEach((pi) => {
                         
                        let last_page;
                        function addPage(page) {
                            if (last_page != page) {
                                last_page = page;

                                tb += `<td rowspan="${pi.count}" style="border: 1px solid white; padding:4px; min-width:120px;"> ${page} </td>`;
                            }

                        }

                        user_management.filter(v => v.page == pi.name).forEach((pn) => {

                            if (pn.page == "index") {
                                let pd = pn;
                                pd.page = "web-layout";
                                nex(pn);
                                pd.page = "mobile-layout";
                                nex(pn);
                                pd.page = "desktop-layout";
                                nex(pn);
                            }
                            else {
                                nex(pn);
                            }

                            function nex(pd) {


                                if (pd.modals) {

                                    pd.modals.forEach((m) => {
                                        tb += `<tr>`;
                                        addPhase();
                                        addPage(pd.page);

                                        for (var k = 0; k < 8; k++) { tb += space; }
                                        tb += `<td style="border: 1px solid white; padding:4px; text-align:center;"> <span style="color:#00AAFF" > Modal </span> </td>`;
                                        tb += `<td style="border: 1px solid white; padding:4px;"> ${m} </td>`;
                                        for (var k = 0; k < 1; k++) { tb += space; }
                                        for (var k = 0; k < 2; k++) { tb += blank; }

                                        tb += `</tr>`;
                                    });
                                }

                                if (pd.sections) {

                                    pd.sections.forEach((s) => {
                                        tb += `<tr>`;
                                        addPhase();
                                        addPage(pd.page);

                                        for (var k = 0; k < 8; k++) { tb += space; }
                                        tb += `<td style="border: 1px solid white; padding:4px;  text-align:center;"> <span style="color:#00AAFF" > Section </span> </td>`;
                                        tb += `<td style="border: 1px solid white; padding:4px;"> ${s} </td>`;
                                        for (var k = 0; k < 1; k++) { tb += space; }
                                        for (var k = 0; k < 2; k++) { tb += blank; }

                                        tb += `</tr>`;
                                    });
                                }

                                if (pd.actions) {
                                    if (pd.actions.create) {
                                        pd.actions.create.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            for (var k = 0; k < 0; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 7; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /database/query/exec </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> - session : string <br/> - server : string <br/> - query : string <br/> - own : string </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.actions.read) {
                                        pd.actions.read.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            for (var k = 0; k < 1; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 6; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /database/query/exec </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> - session : string <br/> - server : string <br/> - query : string <br/> - own : string </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.actions.update) {
                                        pd.actions.update.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            for (var k = 0; k < 2; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 5; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /list-files </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> - session : string <br/> - server : string <br/> - query : string <br/> - own : string </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.actions.delete) {
                                        pd.actions.delete.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            for (var k = 0; k < 3; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 4; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /database/query/exec </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> - session : string <br/> - server : string <br/> - query : string <br/> - own : string </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                }

                                if (pd.files) {
                                    if (pd.files.create) {
                                        pd.files.create.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            for (var k = 0; k < 4; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 3; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /receivePacket </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> 
                                                 - session : string <br/> - server : string <br/> - clientId : string <br/> - packetId : string <br/>
                                                 - packetId : string <br/>  - packetData : string <br/> - isLastPacket : string <br/>
                                                 - tableName : string <br/> - tableIdx : string <br/> - tableGallery : string <br/>
                                                 - fileName : string <br/> - fileSize : string 
                                               </td>`;

                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.files.read) {
                                        pd.files.read.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            for (var k = 0; k < 5; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 2; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> 
                                                  GET: <span style="color:#00AAFF" > /list-files </span>
                                                  <hr style="border:none; border-bottom:solid white 1.2px;"/>
                                                  GET: <span style="color:#00AAFF" > /get-file </span>
                                               </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> 
                                                  - session : string <br/> - server : string <br/> - tableName : string <br/> - tableIdx : string <br/>
                                                   <hr style="border:none; border-bottom:solid white 1.2px;"/>
                                                  - session : string <br/> - server : string <br/> - tableName : string <br/> - idx : string <br/>
                                               </td>`;

                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.files.update) {
                                        pd.files.update.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            for (var k = 0; k < 6; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /delete-file </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> 
                                                  - session : string <br/> - server : string <br/> - tableName : string <br/> - tableIdx : string <br/> - idx : string 
                                               </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }


                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.files.delete) {
                                        pd.files.delete.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            for (var k = 0; k < 7; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 3; k++) { tb += space; }
                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                }
                                if (pd.services) {
                                    Object.keys(pd.services || []).forEach((s) => {
                                        pd.services[s].forEach((sv) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.page);

                                            let pr = '';

                                            if (sv.params) {
                                                sv.params.forEach((p) => {
                                                    pr += `${p.name} : ${p.type}`;
                                                })
                                            }

                                            for (var k = 0; k < 8; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${s.toUpperCase()}: <span style="color:#00AAFF" > ${sv.uri} </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${pr} </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }
                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    });
                                }
                                if (pd.algorithms) {
                                    pd.algorithms.forEach((ac) => {
                                        tb += `<tr>`;
                                        addPhase();
                                        addPage(pd.page);

                                        for (var k = 0; k < 10; k++) { tb += space; }
                                        tb += `<td style="border: 1px solid white; padding:4px; min-width:150px;"> ${ac.title} </td>`;
                                        for (var k = 0; k < 0; k++) { tb += space; }
                                        for (var k = 0; k < 2; k++) { tb += blank; }

                                        tb += `</tr>`;
                                    });
                                }
                                if (pd.static == true) {
                                    tb += `<tr>`;
                                    addPhase();
                                    addPage(pd.page);
                                     
                                    for (var k = 0; k < 11; k++) { tb += space; }  
                                    for (var k = 0; k < 2; k++) { tb += blank; }

                                    tb += `</tr>`;
                                }
                            }
                        })

                    })
                });

            })
        }
        )(); 
        //-----:] 
        tb += `</table/>`;
       //--------------- Reports 
        tb += `
           <div style="margin-top:15px; margin-bottom:10px; color:#46B8DA; font-weight:600;"> Reports </div>
           <table style="width:100%; border: 1px solid white; border-collapse: collapse;" >
`;
        // Heading 
        cols = [
            { h: "Entity", r: 2, c: 1 },
            { h: "App/Report", r: 2, c: 1 },
            { h: "Route", r: 2, c: 1 },
            { h: "Actions", r: 1, c: 4 },
            { h: "Files", r: 1, c: 4 },
            { h: "Services", r: 1, c: 2 },
            { h: "Algorithms", r: 2, c: 1 },
            { h: "Project", r: 1, c: 2 },
        ];

        tb += `<tr style="text-align:center;">`;
        cols.forEach((col) => {
            tb += `<th rowspan="${col.r}" colspan="${col.c}" style="border: 1px solid white; padding:4px;"> ${col.h} </th>`;
        });
        tb += `</tr>`;
        // Sub heading 
        cols = [
            "Create", "Read", "Update", "Delete",
            "Create", "Read", "Update", "Delete",
            "Protocol", "Parameters",
            "Developer", "Status"
        ];

        tb += `<tr style="text-align:center;">`;
        cols.forEach((col) => {
            tb += `<th style="border: 1px solid white; padding:4px;" > ${col} </th>`;
        });
        tb += `</tr>`;
        //----:: DATA 
        (() =>
        {
            let pages = jsonDataArray.map((t) => {
                var arr = [];

                (t.reports || []).forEach((r) => {
                    if(r.title) //console.log(r);
                    arr.push({ phase: t.tableName, page: r.name , route:r.type });
                });

                (t.apps || []).forEach((a) => {
                    if(a.title) //console.log(a);
                    arr.push({ phase: t.tableName, page: a.name, route: a.type });
                });

                return arr;

            }).flat();

            let phase_all = pages.map(ph => { return { page: ph.page, phase: ph.phase , route: ph.route } });

            let phase_set = [...new Set(phase_all.map(ph => ph.phase))];
            phase_set = phase_set.filter(p => p !== "Other").concat("Other");

            let phases = phase_set.map((ps) => {

                return {
                    name: ps,
                    count: phase_all.filter(v => v.phase == ps).length,
                    pages: phase_all.filter(v => v.phase == ps).map(v => v.page)
                }
            });
             
            pages = jsonDataArray.map((t) => {
                var arr = [];

                (t.reports || []).forEach((r) => { 
                    arr.push(r);
                });

                (t.apps || []).forEach((a) => { 
                    arr.push(a);
                });

                return arr;

            }).flat().map((p) => {
                let cn = 0;

                if (p.actions) {
                    if (p.actions.create) { cn += p.actions.create.length; }
                    if (p.actions.read) { cn += p.actions.read.length; }
                    if (p.actions.update) { cn += p.actions.update.length; }
                    if (p.actions.delete) { cn += p.actions.delete.length; }
                }

                if (p.files) {
                    if (p.files.create) { cn += p.files.create.length; }
                    if (p.files.read) { cn += p.files.read.length; }
                    if (p.files.update) { cn += p.files.update.length; }
                    if (p.files.delete) { cn += p.files.delete.length; }
                }

                if (p.services) {
                    Object.keys(p.services || []).forEach((s) => {
                        cn += p.services[s].length;
                    })
                }

                if (p.algorithms) {
                    cn += p.algorithms.length;
                }

                let ret = {
                    name: p.name,
                    count: cn
                };

                return ret;
            });

            let space = `<td style="border: 1px solid white; padding:4px; text-align:center;"> - </td>`;
            let blank = `<td style="border: 1px solid white; padding:4px; background:black; min-width:120px;"></td>`

            phases.forEach((ph) => {
                let ph_cn = 0;
                ph.pages.forEach((p) => {
                    let pg = pages.filter(v => v.name == p);
                    if (pg.length > 0) {
                        pg.forEach((v) => {
                            ph_cn += v.count;
                        });
                    }
                    else {
                        ph_cn += 1;
                    }

                });

                let added_phase = false;
                function addPhase() {
                    if (!added_phase) {
                        added_phase = true;

                        tb += `<td rowspan="${ph_cn == 0 ? 1 : ph_cn}" style="border: 1px solid white; padding:4px; min-width:120px;"> ${ph.name} </td>`;
                    }

                }

                ph.pages.forEach((p) => {

                    pages.filter(v => v.name == p).forEach((pi) => {

                        let last_page;
                        function addPage(page , route) {
                            if (last_page != page) {
                                last_page = page;

                                tb += `<td rowspan="${pi.count == 0 ? 1 : pi.count}" style="border: 1px solid white; padding:4px; min-width:120px;"> ${page} </td>`;
                                tb += `<td rowspan="${pi.count == 0 ? 1 : pi.count}" style="border: 1px solid white; padding:4px; min-width:120px;"> ${route} </td>`;
                            }

                        }

                        jsonDataArray.map((t) => {
                            var arr = [];

                            (t.reports || []).forEach((r) => {
                                arr.push(r);
                            });

                            (t.apps || []).forEach((a) => {
                                arr.push(a);
                            });

                            return arr;

                        }).flat().filter(v => v.name == pi.name).forEach((pn) => {

                            nex(pn);

                            function nex(pd) {
                                if (pd.actions) {
                                    if (pd.actions.create) {
                                        pd.actions.create.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            for (var k = 0; k < 0; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 7; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /database/query/exec </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> - session : string <br/> - server : string <br/> - query : string <br/> - own : string </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.actions.read) {
                                        pd.actions.read.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            for (var k = 0; k < 1; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 6; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /database/query/exec </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> - session : string <br/> - server : string <br/> - query : string <br/> - own : string </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.actions.update) {
                                        pd.actions.update.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            for (var k = 0; k < 2; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 5; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /list-files </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> - session : string <br/> - server : string <br/> - query : string <br/> - own : string </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.actions.delete) {
                                        pd.actions.delete.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            for (var k = 0; k < 3; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 4; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /database/query/exec </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> - session : string <br/> - server : string <br/> - query : string <br/> - own : string </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                }
                                if (pd.files) {
                                    if (pd.files.create) {
                                        pd.files.create.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            for (var k = 0; k < 4; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 3; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /receivePacket </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> 
                                                 - session : string <br/> - server : string <br/> - clientId : string <br/> - packetId : string <br/>
                                                 - packetId : string <br/>  - packetData : string <br/> - isLastPacket : string <br/>
                                                 - tableName : string <br/> - tableIdx : string <br/> - tableGallery : string <br/>
                                                 - fileName : string <br/> - fileSize : string 
                                               </td>`;

                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.files.read) {
                                        pd.files.read.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            for (var k = 0; k < 5; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 2; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> 
                                                  GET: <span style="color:#00AAFF" > /list-files </span>
                                                  <hr style="border:none; border-bottom:solid white 1.2px;"/>
                                                  GET: <span style="color:#00AAFF" > /get-file </span>
                                               </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> 
                                                  - session : string <br/> - server : string <br/> - tableName : string <br/> - tableIdx : string <br/>
                                                   <hr style="border:none; border-bottom:solid white 1.2px;"/>
                                                  - session : string <br/> - server : string <br/> - tableName : string <br/> - idx : string <br/>
                                               </td>`;

                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.files.update) {
                                        pd.files.update.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            for (var k = 0; k < 6; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }

                                            tb += `<td style="border: 1px solid white; padding:4px;"> GET: <span style="color:#00AAFF" > /delete-file </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px; min-width:180px"> 
                                                  - session : string <br/> - server : string <br/> - tableName : string <br/> - tableIdx : string <br/> - idx : string 
                                               </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }


                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                    if (pd.files.delete) {
                                        pd.files.delete.forEach((ac) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            for (var k = 0; k < 7; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${ac} </td>`;
                                            for (var k = 0; k < 3; k++) { tb += space; }
                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    }
                                }
                                if (pd.services) {
                                    Object.keys(pd.services || []).forEach((s) => {
                                        pd.services[s].forEach((sv) => {
                                            tb += `<tr>`;
                                            addPhase();
                                            addPage(pd.name , pd.type);

                                            let pr = '';

                                            if (sv.params) {
                                                sv.params.forEach((p) => {
                                                    pr += `${p.name} : ${p.type}`;
                                                })
                                            }

                                            for (var k = 0; k < 8; k++) { tb += space; }
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${s.toUpperCase()}: <span style="color:#00AAFF" > ${sv.uri} </span> </td>`;
                                            tb += `<td style="border: 1px solid white; padding:4px;"> ${pr} </td>`;
                                            for (var k = 0; k < 1; k++) { tb += space; }
                                            for (var k = 0; k < 2; k++) { tb += blank; }

                                            tb += `</tr>`;
                                        });
                                    });
                                }
                                if (pd.algorithms) {
                                    pd.algorithms.forEach((ac) => {
                                        tb += `<tr>`;
                                        addPhase();
                                        addPage(pd.name , pd.type);

                                        for (var k = 0; k < 10; k++) { tb += space; }
                                        tb += `<td style="border: 1px solid white; padding:4px; min-width:150px;"> ${ac.title} </td>`;
                                        for (var k = 0; k < 0; k++) { tb += space; }
                                        for (var k = 0; k < 2; k++) { tb += blank; }

                                        tb += `</tr>`;
                                    });
                                }
                            }
                        })

                    })
                });

            })
        }
        )();

        //------:]
        tb += `</table/>`; 

        tb += `
          </div>
`;

        mLogs({ TB: tb });
    } 
    async projetPlanExcel(mLogs) { 

        const workbook = new ExcelJS.Workbook();
        //----------: Pages
        (() =>
        {
            const sheet = workbook.addWorksheet("UI Project Plan", {
                views: [{ state: "frozen", ySplit: 2 }]
            });

            // ---------- Styles ----------
            const headerStyle = {
                alignment: { vertical: "middle", horizontal: "center", wrapText: true },
                font: { bold: true, color: { argb: "FFFFFFFF" } },
                fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF333333" } },
                border: {
                    top: { style: "thin", color: { argb: "FFFFFFFF" } },
                    left: { style: "thin", color: { argb: "FFFFFFFF" } },
                    bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
                    right: { style: "thin", color: { argb: "FFFFFFFF" } }
                }
            };

            const cellStyle = {
                alignment: { vertical: "middle", horizontal: "center", wrapText: true },
                border: {
                    top: { style: "thin", color: { argb: "FFCCCCCC" } },
                    left: { style: "thin", color: { argb: "FFCCCCCC" } },
                    bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
                    right: { style: "thin", color: { argb: "FFCCCCCC" } }
                }
            };

            // ---------- Column Widths ----------
            sheet.columns = [
                { width: 20 }, // Phase
                { width: 20 }, // Page
                { width: 15 }, // Actions: Create
                { width: 15 }, // Actions: Read
                { width: 15 }, // Actions: Update
                { width: 15 }, // Actions: Delete
                { width: 15 }, // Files: Create
                { width: 15 }, // Files: Read
                { width: 15 }, // Files: Update
                { width: 15 }, // Files: Delete
                { width: 30 }, // Services / Protocol
                { width: 30 }, // Services / Parameters
                { width: 25 }, // Algorithms / Developer
                { width: 25 }, // Project / Status
                { width: 25 }, // Project / Status
            ];

            // ---------- Helpers ----------
            function styledCell(row, col, val) {
                const c = sheet.getRow(row).getCell(col);
                c.value = val;
                Object.assign(c, { style: cellStyle });
                return c;
            }

            function addBlank(row, col) {
                const c = sheet.getRow(row).getCell(col);
                c.value = "";
                Object.assign(c, { style: cellStyle });
            }

            function addSpace(row, col) {
                const c = sheet.getRow(row).getCell(col);
                c.value = " - ";
                Object.assign(c, { style: cellStyle });
            }

            // ---------- HEADERS ----------
            let headers = [
                { h: "Phase", r: 2, c: 1 },
                { h: "Page", r: 2, c: 1 },
                { h: "Actions", r: 1, c: 4 },
                { h: "Files", r: 1, c: 4 },
                { h: "Services", r: 1, c: 2 },
                { h: "", r: 2, c: 1 },
                { h: "Project", r: 1, c: 2 }
            ];

            let row1 = sheet.getRow(1);
            let colIndex = 1;
            headers.forEach((col) => {
                if (col.c > 1 || col.r > 1) {
                    sheet.mergeCells(1, colIndex, col.r, colIndex + col.c - 1);
                }
                let cell = sheet.getCell(1, colIndex);
                cell.value = col.h;
                Object.assign(cell, { style: headerStyle });
                colIndex += col.c;
            });

            let subHeaders = [
                "Create", "Read", "Update", "Delete",
                "Create", "Read", "Update", "Delete",
                "Protocol", "Parameters",
                "Algorithms", "Developer", "Status"
            ];

            let row2 = sheet.getRow(2);
            subHeaders.forEach((h, i) => {
                let cell = row2.getCell(i + 3);
                cell.value = h;
                Object.assign(cell, { style: headerStyle });
            });

            // ---------- DATA PREP ----------
            let pagesWithPhase = user_management.map((p) => {
                let pt = project_management.filter(pm => pm.phase == p.phase);
                 
                p.phase = pt.length > 0 ? pt[0].title || "Other" : "Other";
                return p;
            });

            let phase_all = pagesWithPhase.map(ph => ({ page: ph.page, phase: ph.phase }));
            let phase_set = [...new Set(phase_all.map(ph => ph.phase))];
            phase_set = phase_set.filter(p => p !== "Other").concat("Other");

            let phases = phase_set.map((ps) => ({
                name: ps,
                pages: phase_all.filter(v => v.phase == ps).map(v => v.page)
            }));

            const pageCounts = user_management.map((p) => {
                let cn = 0;
                ["actions", "files"].forEach(type => {
                    if (p[type]) {
                        Object.values(p[type]).forEach(arr => { cn += arr.length; });
                    }
                });
                if (p.services) Object.values(p.services).forEach(arr => cn += arr.length);
                if (p.modals) { cn += (p.modals || []).length; }
                if (p.sections) {cn += (p.sections || []).length; }
                if (p.algorithms) { cn += (p.algorithms || []).length;}
                if (p.static == true) { cn += 1; }
                return { name: p.page, count: cn };
            });

            // Expand 'index' pages
            phases.forEach(ph => {
                ph.pages = ph.pages.flatMap(p => p === "index" ? ["web-layout", "mobile-layout", "desktop-layout"] : [p]);
            });

            let currentRow = 3;

            // ---------- DATA LOOP ----------
            phases.forEach((ph) => {
                const phaseRowStart = currentRow;

                ph.pages.forEach((p) => {
                    const originalPageKey = ["web-layout", "mobile-layout", "desktop-layout"].includes(p) ? "index" : p;
                    const pageEntries = user_management.filter(v => v.page === originalPageKey);
                    const pageRowStart = currentRow;

                    pageEntries.forEach((pn) => {

                        function writeFor() {
                            function process(list, colOffset, api = "", params = "") {
                                list.forEach(ac => {
                                    const row = sheet.getRow(currentRow++);
                                    for (let k = 0; k < colOffset; k++) addSpace(row.number, 3 + k);
                                    styledCell(row.number, 3 + colOffset, ac);
                                    for (let k = colOffset + 1; k < 11; k++) addSpace(row.number, 3 + k);
                                    styledCell(row.number, 11, api);
                                    styledCell(row.number, 12, params);
                                    addSpace(row.number, 13);
                                    addBlank(row.number, 14);
                                });
                            }
                            // Modals
                            if (pn.modals) {
                                pn.modals.forEach((m) =>
                                {
                                    const row = sheet.getRow(currentRow++);
                                    for (let k = 0; k < 8; k++) addSpace(row.number, 3 + k);
                                    styledCell(row.number, 11, `Modal`);
                                    styledCell(row.number, 12, m);
                                    addSpace(row.number, 13);
                                    addBlank(row.number, 14); 
                                });
                            }

                            // Sections
                            if (pn.sections) {
                                pn.sections.forEach((s) =>
                                {
                                    const row = sheet.getRow(currentRow++);
                                    for (let k = 0; k < 8; k++) addSpace(row.number, 3 + k);
                                    styledCell(row.number, 11, `Section`);
                                    styledCell(row.number, 12, s);
                                    addSpace(row.number, 13);
                                    addBlank(row.number, 14); 
                                });
                            }
                            // Actions
                            if (pn.actions) {
                                if (pn.actions.create) process(pn.actions.create, 0, "GET: /database/query/exec", "- session : string\n- server : string\n- query : string\n- own : string");
                                if (pn.actions.read) process(pn.actions.read, 1, "GET: /database/query/exec", "- session : string\n- server : string\n- query : string\n- own : string");
                                if (pn.actions.update) process(pn.actions.update, 2, "GET: /list-files", "- session : string\n- server : string\n- query : string\n- own : string");
                                if (pn.actions.delete) process(pn.actions.delete, 3, "GET: /database/query/exec", "- session : string\n- server : string\n- query : string\n- own : string");
                            }

                            // Files
                            if (pn.files) {
                                if (pn.files.create) process(pn.files.create, 4, "GET: /receivePacket",
                                    `- session : string\n- server : string\n- clientId : string\n- packetId : string\n- packetData : string\n- isLastPacket : string\n- tableName : string\n- tableIdx : string\n- tableGallery : string\n- fileName : string\n- fileSize : string`);
                                if (pn.files.read) process(pn.files.read, 5, "GET: /list-files\nGET: /get-file",
                                    `- session : string\n- server : string\n- tableName : string\n- tableIdx : string\n- idx : string`);
                                if (pn.files.update) process(pn.files.update, 6, "GET: /delete-file",
                                    `- session : string\n- server : string\n- tableName : string\n- tableIdx : string\n- idx : string`);
                                if (pn.files.delete) process(pn.files.delete, 7, "", "");
                            }

                            // Services
                            if (pn.services) {
                                Object.keys(pn.services).forEach((s) => {
                                    pn.services[s].forEach((sv) => {
                                        const row = sheet.getRow(currentRow++);
                                        for (let k = 0; k < 8; k++) addSpace(row.number, 3 + k);
                                        styledCell(row.number, 11, `${s.toUpperCase()}: ${sv.uri}`);
                                        styledCell(row.number, 12, (sv.params || []).map(p => `${p.name}: ${p.type}`).join("\n"));
                                        addSpace(row.number, 13);
                                        addBlank(row.number, 14);
                                    });
                                });
                            }

                            // Algorithms
                            if (pn.algorithms) {
                                pn.algorithms.forEach((ac) => {
                                    const row = sheet.getRow(currentRow++);
                                    for (let k = 0; k < 10; k++) addSpace(row.number, 3 + k);
                                    styledCell(row.number, 13, ac.title);
                                    addBlank(row.number, 14);
                                });
                            }

                            if (pn.static == true) {
                                //for (let k = 0; k < 11; k++) addSpace(row.number, 3 + k); 
                                //addBlank(row.number, 14)
                            }
                        }

                        if (pn.page === "index") {
                            writeFor(); // web-layout
                            writeFor(); // mobile-layout
                            writeFor(); // desktop-layout
                        } else {
                            writeFor();
                        }
                    });

                    if (currentRow > pageRowStart) {
                        sheet.mergeCells(pageRowStart, 2, currentRow - 1, 2);
                        styledCell(pageRowStart, 2, p);
                    }
                });

                if (currentRow > phaseRowStart) {
                    sheet.mergeCells(phaseRowStart, 1, currentRow - 1, 1);
                    styledCell(phaseRowStart, 1, ph.name);
                }
            });



        })();
        //----------: Reports
        (() =>
        {
            const sheet = workbook.addWorksheet("Reports Project Plan", {
                views: [{ state: "frozen", ySplit: 2 }]
            });

            // ---------- Styles ----------
            const headerStyle = {
                alignment: { vertical: "middle", horizontal: "center", wrapText: true },
                font: { bold: true, color: { argb: "FFFFFFFF" } },
                fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF333333" } },
                border: {
                    top: { style: "thin", color: { argb: "FFFFFFFF" } },
                    left: { style: "thin", color: { argb: "FFFFFFFF" } },
                    bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
                    right: { style: "thin", color: { argb: "FFFFFFFF" } }
                }
            };

            const cellStyle = {
                alignment: { vertical: "middle", horizontal: "center", wrapText: true },
                border: {
                    top: { style: "thin", color: { argb: "FFCCCCCC" } },
                    left: { style: "thin", color: { argb: "FFCCCCCC" } },
                    bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
                    right: { style: "thin", color: { argb: "FFCCCCCC" } }
                }
            };

            // ---------- Column Widths ----------
            sheet.columns = [
                { width: 20 }, // Entity
                { width: 20 }, // Report
                { width: 15 }, // Actions: Create
                { width: 15 }, // Actions: Read
                { width: 15 }, // Actions: Update
                { width: 15 }, // Actions: Delete
                { width: 15 }, // Files: Create
                { width: 15 }, // Files: Read
                { width: 15 }, // Files: Update
                { width: 15 }, // Files: Delete
                { width: 30 }, // Services / Protocol
                { width: 30 }, // Services / Parameters
                { width: 25 }, // Algorithms / Developer
                { width: 25 }, // Project / Status
                { width: 25 }, // Project / Status
            ];

            // ---------- Helpers ----------
            function styledCell(row, col, val) {
                const c = sheet.getRow(row).getCell(col);
                c.value = val;
                Object.assign(c, { style: cellStyle });
                return c;
            }

            function addBlank(row, col) {
                const c = sheet.getRow(row).getCell(col);
                c.value = "";
                Object.assign(c, { style: cellStyle });
            }

            function addSpace(row, col) {
                const c = sheet.getRow(row).getCell(col);
                c.value = " - ";
                Object.assign(c, { style: cellStyle });
            }

            // ---------- HEADERS ----------
            let headers = [
                { h: "Entity", r: 2, c: 1 },
                { h: "Report", r: 2, c: 1 },
                { h: "Actions", r: 1, c: 4 },
                { h: "Files", r: 1, c: 4 },
                { h: "Services", r: 1, c: 2 },
                { h: "", r: 2, c: 1 },
                { h: "Project", r: 1, c: 2 }
            ];

            let row1 = sheet.getRow(1);
            let colIndex = 1;
            headers.forEach((col) => {
                if (col.c > 1 || col.r > 1) {
                    sheet.mergeCells(1, colIndex, col.r, colIndex + col.c - 1);
                }
                let cell = sheet.getCell(1, colIndex);
                cell.value = col.h;
                Object.assign(cell, { style: headerStyle });
                colIndex += col.c;
            });

            let subHeaders = [
                "Create", "Read", "Update", "Delete",
                "Create", "Read", "Update", "Delete",
                "Protocol", "Parameters",
                "Algorithms", "Developer", "Status"
            ];

            let row2 = sheet.getRow(2);
            subHeaders.forEach((h, i) => {
                let cell = row2.getCell(i + 3);
                cell.value = h;
                Object.assign(cell, { style: headerStyle });
            });

            // ---------- DATA PREP ----------
            let pagesWithPhase = jsonDataArray.map((t) => {
                var arr = [];

                (t.reports || []).forEach((r) => {
                    if (r.title) //console.log(r);
                    arr.push({ phase: t.tableName, page: r.name });
                });

                (t.apps || []).forEach((a) => {
                    if (a.title) //console.log(a);
                    arr.push({ phase: t.tableName, page: a.name });
                });

                return arr;

            }).flat();

            let phase_all = pagesWithPhase.map(ph => ({ page: ph.page, phase: ph.phase }));
            let phase_set = [...new Set(phase_all.map(ph => ph.phase))];
            phase_set = phase_set.filter(p => p !== "Other").concat("Other");

            let phases = phase_set.map((ps) => ({
                name: ps,
                pages: phase_all.filter(v => v.phase == ps).map(v => v.page)
            }));

            const pageCounts = jsonDataArray.map((t) => {
                var arr = [];

                (t.reports || []).forEach((r) => {
                    if (r.title) //console.log(r);
                    arr.push(r);
                });

                (t.apps || []).forEach((a) => {
                    if (a.title) //console.log(a);
                    arr.push(a);
                });

                return arr;

            }).flat().map((p) => {
                let cn = 0;
                ["actions", "files"].forEach(type => {
                    if (p[type]) {
                        Object.values(p[type]).forEach(arr => { cn += arr.length; });
                    }
                });
                if (p.services) Object.values(p.services).forEach(arr => cn += arr.length);
                if (p.algorithms) cn += (p.algorithms || []).length;
                if (p.static == true) { cn += 1; }
                return { name: p.page, count: cn };
            });

            function getCountFor(name) {
                const found = pageCounts.find(x => x.name === name);
                return found ? found.count : 0;
            }

            // Expand 'index' pages
            phases.forEach(ph => {
                ph.pages = ph.pages.flatMap(p => [p]);
            });

            let currentRow = 3;

            // ---------- DATA LOOP ----------
            phases.forEach((ph) => {
                const phaseRowStart = currentRow;

                ph.pages.forEach((p) => {
                    const originalPageKey = p;
                    const pageEntries = jsonDataArray.map((t) => {
                        var arr = [];

                        (t.reports || []).forEach((r) => { 
                            arr.push(r);
                        });

                        (t.apps || []).forEach((a) => { 
                            arr.push(a);
                        });

                        return arr;

                    }).flat().filter(v => v.name === originalPageKey);
                    const pageRowStart = currentRow;

                    pageEntries.forEach((pn) => {

                        function writeFor() {
                            function process(list, colOffset, api = "", params = "") {
                                list.forEach(ac => {
                                    const row = sheet.getRow(currentRow++);
                                    for (let k = 0; k < colOffset; k++) addSpace(row.number, 3 + k);
                                    styledCell(row.number, 3 + colOffset, ac);
                                    for (let k = colOffset + 1; k < 11; k++) addSpace(row.number, 3 + k);
                                    styledCell(row.number, 11, api);
                                    styledCell(row.number, 12, params);
                                    addSpace(row.number, 13);
                                    addBlank(row.number, 14);
                                });
                            }

                            // Actions
                            if (pn.actions) {
                                if (pn.actions.create) process(pn.actions.create, 0, "GET: /database/query/exec", "- session : string\n- server : string\n- query : string\n- own : string");
                                if (pn.actions.read) process(pn.actions.read, 1, "GET: /database/query/exec", "- session : string\n- server : string\n- query : string\n- own : string");
                                if (pn.actions.update) process(pn.actions.update, 2, "GET: /list-files", "- session : string\n- server : string\n- query : string\n- own : string");
                                if (pn.actions.delete) process(pn.actions.delete, 3, "GET: /database/query/exec", "- session : string\n- server : string\n- query : string\n- own : string");
                            }

                            // Files
                            if (pn.files) {
                                if (pn.files.create) process(pn.files.create, 4, "GET: /receivePacket",
                                    `- session : string\n- server : string\n- clientId : string\n- packetId : string\n- packetData : string\n- isLastPacket : string\n- tableName : string\n- tableIdx : string\n- tableGallery : string\n- fileName : string\n- fileSize : string`);
                                if (pn.files.read) process(pn.files.read, 5, "GET: /list-files\nGET: /get-file",
                                    `- session : string\n- server : string\n- tableName : string\n- tableIdx : string\n- idx : string`);
                                if (pn.files.update) process(pn.files.update, 6, "GET: /delete-file",
                                    `- session : string\n- server : string\n- tableName : string\n- tableIdx : string\n- idx : string`);
                                if (pn.files.delete) process(pn.files.delete, 7, "", "");
                            }

                            // Services
                            if (pn.services) {
                                Object.keys(pn.services).forEach((s) => {
                                    pn.services[s].forEach((sv) => {
                                        const row = sheet.getRow(currentRow++);
                                        for (let k = 0; k < 8; k++) addSpace(row.number, 3 + k);
                                        styledCell(row.number, 11, `${s.toUpperCase()}: ${sv.uri}`);
                                        styledCell(row.number, 12, (sv.params || []).map(p => `${p.name}: ${p.type}`).join("\n"));
                                        addSpace(row.number, 13);
                                        addBlank(row.number, 14);
                                    });
                                });
                            }

                            // Algorithms
                            if (pn.algorithms) {
                                pn.algorithms.forEach((ac) => {
                                    const row = sheet.getRow(currentRow++);
                                    for (let k = 0; k < 10; k++) addSpace(row.number, 3 + k);
                                    styledCell(row.number, 13, ac.title);
                                    addBlank(row.number, 14);
                                });
                            }

                            if (pn.static == true) {
                                for (let k = 0; k < 11; k++) addSpace(row.number, 3 + k); 
                                addBlank(row.number, 14)
                            }
                        }

                        writeFor();
                    });

                    if (currentRow > pageRowStart) {
                        sheet.mergeCells(pageRowStart, 2, currentRow - 1, 2);
                        styledCell(pageRowStart, 2, p);
                    }
                });

                if (currentRow > phaseRowStart) {
                    sheet.mergeCells(phaseRowStart, 1, currentRow - 1, 1);
                    styledCell(phaseRowStart, 1, ph.name);
                }
            });



        })();
        //----------]]

        // ---------- EXPORT ----------
        const { filePath } = await dialog.showSaveDialog({
            title: "Save Project Plan",
            defaultPath: "project_plan.xlsx",
            filters: [{ name: "Excel Workbook", extensions: ["xlsx"] }]
        });

        if (filePath) {
            await workbook.xlsx.writeFile(filePath);
            mLogs({ G: "project_plan.xlsx created" });
        } else {
            mLogs({ R: "Save cancelled" });
        }
    } 
    async startupCode(mLogs) {
         
        function getResPath(...subpaths) {
            let basePath = app.getAppPath();
            return path.join(basePath, "public", "res", ...subpaths);
        }


        // Ask user for save location
        const { filePath } = await dialog.showSaveDialog({
            title: "Save MVC Framework ZIP",
            defaultPath: "mvc_frameworks.zip",
            buttonLabel: "Save ZIP",
            filters: [{ name: "ZIP Files", extensions: ["zip"] }]
        });

        if (!filePath) return; // user cancelled

        const zip = new JSZip();
         

        // Recursive helper to add only uris, ignoring intermediate object keys 
        function addFilesToZip(files, currentFolder) {
            if (Array.isArray(files)) {
                files.forEach((fileObj , i) => {
                    if (fileObj.uri) {
                        const filePathInZip = path.join(currentFolder, fileObj.uri);

                        // Use helper to resolve proper res path
                        const diskPath = getResPath(currentFolder, fileObj.uri);

                        mLogs({ Y: `${(i + 1)}. ${fileObj.uri}` });

                        let fileContent = "";
                        try {
                            if (fs.existsSync(diskPath)) {
                                fileContent = fs.readFileSync(diskPath, "utf-8");
                            }
                        } catch (err) {
                            mLogs({ R: `Could not read ${diskPath}:` });
                        }

                        if (fileContent != "") {
                            mLogs(fileContent + " \n");
                        }
                        else {
                            mLogs({ R: "file empty" });
                        }

                        zip.file(filePathInZip, fileContent || fileObj.code || "");
                    } else if (typeof fileObj === "object") {
                        addFilesToZip(fileObj, currentFolder);
                    }
                });
            } else if (typeof files === "object") {
                Object.values(files).forEach(value => addFilesToZip(value, currentFolder));
            }
        }


        // Loop through frameworks
        mvc_Frameworks.forEach((framework , k) => {
            mLogs({ B: `${(k + 1)}. ${framework.title}` });
            const baseFolder = framework.title.replace(/[^a-z0-9]/gi, "_").toLowerCase(); // sanitize folder name
            addFilesToZip(framework.files, baseFolder);

            // Optional: include component diagrams as .mmd files
            if (framework.components && false) {
                Object.entries(framework.components).forEach(([compName, compCode]) => {
                    const compPath = path.join(baseFolder, `components/${compName}.mmd`);
                    zip.file(compPath, compCode || "");
                });
            }
        });

        // Generate ZIP buffer
        const zipContent = await zip.generateAsync({ type: "nodebuffer" });

        // Save file
        fs.writeFileSync(filePath, zipContent);
        //console.log(`? ZIP saved to ${filePath}`);
    }


}
 

module.exports = { Mermaid };
