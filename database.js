
const { Crypto } = require('../process/encryption');
const config = require("../../config.js");

let crypto = new Crypto(config.FIXED_STRING);

const mvc_Frameworks = [
    {
        title: "Express Server App",
        reqs: true,
        files: {
            model: {
                windows: [
                    { uri: "models/data/database.js" },
                    { uri: "models/process/database.js" },
                    { uri: "models/process/encryption.js" },
                    { uri: "models/process/mermaid.js" },
                    { uri: "models/process/sqlite_schema.js" },
                    { uri: "models/process/dialog.js" }
                ]
            },
            views: [
                { uri : "index.html" } ,
                { uri : "public/style.css" } ,
                { uri : "public/script.js" } ,
            ],
            controllers: [
                { uri: "app.js" }
            ],
            helpers: [
                { uri :"db.js" },
                { uri :"preload.js" },
            ]
        },
        components: {
            port_fowarding: `
graph TB
    subgraph Client_Side [Client Side]
        ClientApp["\uD83D\uDDA5 Client App"]
    end

    subgraph GitHub [GitHub]
        GitHubAPI["\uD83D\uDCE6 GitHub API"]
    end

    subgraph Network [Network]
        Router["\uD83D\uDCE1 Router / NAT"]
    end

    subgraph Backend [Backend]
        ExpressAPI["\u2699\uFE0F Express API Server"]
    end

    %% Connections
    ClientApp -->|HTTP Request| GitHubAPI
    GitHubAPI -->|Static File URL| ClientApp
    ClientApp -->|HTTP Request| Router
    Router -->|Port Forwarding| ExpressAPI
    ExpressAPI -->|API Response| Router
    Router -->|API Response| ClientApp

    %% Notes
    Note1["\u1F4CC Requests URL from GitHub and connects via Router Port Forwarding"]
    Note2["\u1F4CC Serves static file with current URL"]
    Note3["\u1F4CC Exposes Express API Server via Port Forwarding"]
    Note4["\u1F4CC Handles API requests and returns responses"]

    ClientApp -.-> Note1
    GitHubAPI -.-> Note2
    Router -.-> Note3
    ExpressAPI -.-> Note4

`,
            cloudflare_tunnelling: `
graph TB
    subgraph Client_Side [Client Side]
        ClientApp["\uD83D\uDDA5 Client App"]
    end

    subgraph GitHub [GitHub]
        GitHubAPI["\uD83D\uDCE6 GitHub API"]
    end

    subgraph Cloudflare_Tunnel [Cloudflare Tunnel]
        CF_Tunnel["\uD83C\uDF10 Cloudflare Tunnel"]
    end

    subgraph Backend [Backend]
        ExpressAPI["\u2699\uFE0F Express API Server"]
    end

    %% Connections
    ClientApp -->|HTTP Request| GitHubAPI
    GitHubAPI -->|Static File URL| ClientApp
    ClientApp -->|HTTPS Request| CF_Tunnel
    CF_Tunnel -->|Tunnel Traffic| ExpressAPI
    ExpressAPI -->|API Response| CF_Tunnel
    CF_Tunnel -->|API Response| ClientApp

    %% Notes
    Note1["\u1F4CC Requests URL from GitHub and connects via Cloudflare Tunnel"]
    Note2["\u1F4CC Serves static file with current URL"]
    Note3["\u1F4CC Exposes Express API Server via Cloudflare Tunnel"]
    Note4["\u1F4CC Handles API requests and returns responses"]

    ClientApp -.-> Note1
    GitHubAPI -.-> Note2
    CF_Tunnel -.-> Note3
    ExpressAPI -.-> Note4

`,
            ssh_tunnelling: `
graph TB
    subgraph Client_Side [Client Side]
        ClientApp["\uD83D\uDDA5 Client App"]
    end

    subgraph GitHub [GitHub]
        GitHubAPI["\uD83D\uDCE6 GitHub API"]
    end

    subgraph SSH_Layer [SSH Layer]
        SSHServer["\uD83D\uDD12 SSH Server"]
    end

    subgraph Backend [Backend]
        ExpressAPI["\u2699\uFE0F Express API Server"]
    end

    %% Connections
    ClientApp -->|HTTP Request| GitHubAPI
    GitHubAPI -->|Static File URL| ClientApp
    ClientApp -->|HTTP Request| SSHServer
    SSHServer -->|SSH Tunnel| ExpressAPI
    ExpressAPI -->|API Response| SSHServer
    SSHServer -->|API Response| ClientApp

    %% Notes
    Note1["\u1F4CC Requests URL from GitHub and connects to SSH Server"]
    Note2["\u1F4CC Serves static file with current URL"]
    Note3["\u1F4CC Exposes Express API Server via SSH tunnel"]
    Note4["\u1F4CC Handles API requests and returns responses"]

    ClientApp -.-> Note1
    GitHubAPI -.-> Note2
    SSHServer -.-> Note3
    ExpressAPI -.-> Note4

`
        }
    }, 
    {
        title: "Flutter Mobile App",
        reqs: true,
        files: {
            models: {
                android: {
                    gradle: [
                        { uri: "android\gradle.properties" } ,
                        { uri: "android\gradle\wrapper\gradle-wrapper.properties" } ,
                    ],
                    java: [
                        { uri: "android/app/src/main/java/com/tyg/app/MainActivity.java" },
                        { uri: "android/app/src/main/java/com/tyg/app/models/Notifications.java" },
                    ]
                },
                ios: [
                    { uri: "ios/Runner/AppDelegate.swift" },
                    { uri: "ios/Runner/models/Notifications.swift" },
                ]
            },
            views: [
                { uri: "assets/html/index.html" },
                { uri: "assets/html/styles.css" },
                { uri: "assets/html/script.js" }
            ],
            controllers: [
                { uri: "lib/main.dart" } ,
                { uri: "lib/models/Notifications.dart" } ,
            ],
            helpers: [
                { uri: "pubspec.yaml" },
                { uri: "1.verify_flutter.bat" },
                { uri: "2.build_android.bat" },
                { uri: "3.run_android.bat" },
                { uri: "4.setup_and_run.bat" }
            ]
        },
        components: {
            hybridwebview: `
%% Component Diagram for Flutter Hybrid WebView Project
graph TD
    A[Flutter App] --> B[HybridWebView Widget]
    B --> C[WebViewController]
    C --> D[HTML Assets index.html, JS, CSS]
    C --> E[JavaScript Channel]
    E -->|Sends Messages| B
    A --> F[Flutter Engine]
    F --> G[Platform Code]
    G --> H[Android: MainActivity.java]
    G --> I[iOS: AppDelegate.swift]
`
        }
    }
];

const usersData = [
    // Top Management
    {
        firstname: "Toka",
        lastname: "Lintsa",
        email: "toka@trotyourglobe.com",
        username: "Tyoka",
        password: "mdirector123",
        phonenumber: "0711111111",
        usertype: "Managing_Director"
    },

    // Department Heads / Managers
    {
        firstname: "Ngunda",
        lastname: "Phiri",
        email: "ngunda@trotyourglobe.com",
        username: "Ngundaa",
        password: "itmanager123",
        phonenumber: "0722222222",
        usertype: "IT_Manager"
    },
    {
        firstname: "Khosi",
        lastname: "NA",
        email: "Khosi@trotyourglobe.com",
        username: "Khosi",
        password: "hr123",
        phonenumber: "0733333333",
        usertype: "Human_Resource"
    },

    // Technical Roles
    {
        firstname: "Ntuthuko",
        lastname: "Ncobo",
        email: "ntuthuko@trotyourglobe.com",
        username: "ntuthuko",
        password: "techsales123",
        phonenumber: "0744444444",
        usertype: "Technical_Sales"
    },
    {
        firstname: "Mabalane",
        lastname: "Thubakgale",
        email: "sam@trotyourglobe.com",
        username: "Sam2Bee",
        password: "techsolutions123",
        phonenumber: "0755555555",
        usertype: "Technical_Solutions"
    },

    // Consulting / Instructor Roles
    {
        firstname: "Sibongile",
        lastname: "Nkosi",
        email: "sibongile.nkosi@trotyourglobe.com",
        username: "sibongilenkosi",
        password: "physician123",
        phonenumber: "0766666666",
        usertype: "Consulting_Physician"
    },
    {
        firstname: "Jermain",
        lastname: "Johnson",
        email: "jermain@trotyourglobe.com",
        username: "andilemaseko",
        password: "fitness123",
        phonenumber: "0777777777",
        usertype: "Fitness_Instructor"
    },
    {
        firstname: "Anastasia",
        lastname: "Savopoulos",
        email: "wellness@trotyourglobe.com",
        username: "anastasia",
        password: "consultingpro123",
        phonenumber: "0788888888",
        usertype: "Consulting_Professional"
    },

    // Admin
    {
        firstname: "Tshepo",
        lastname: "Radebe",
        email: "tshepo.radebe@trotyourglobe.com",
        username: "tsheporadebe",
        password: "admin123",
        phonenumber: "0799999999",
        usertype: "Admin"
    },

    // Clients
    {
        firstname: "Mpho",
        lastname: "Ngobeni",
        email: "mpho.ngobeni@example.com",
        username: "mphon",
        password: "corpclient123",
        phonenumber: "0800000001",
        usertype: "Corporate_Client"
    },
    {
        firstname: "Lwazi",
        lastname: "Cele",
        email: "lwazi.cele@example.com",
        username: "lwazicele",
        password: "corpcustomer123",
        phonenumber: "0800000002",
        usertype: "Corporate_Customer"
    },
    {
        firstname: "Nomsa",
        lastname: "Mahlangu",
        email: "nomsa.mahlangu@example.com",
        username: "nomsamahlangu",
        password: "customer123",
        phonenumber: "0800000003",
        usertype: "Customer"
    } 
    //  
];

const user_inherits = [
    // Top Management
    { user: "Managing_Director", admin: true,  inherits: ["IT_Manager", "Admin", "Human_Resource", "Consulting_Physician", "Fitness_Instructor", "Consulting_Professional", "Nutritionist"] },

    // Department Heads / Managers
    { user: "IT_Manager", admin: true,  inherits: ["Technical_Sales", "Technical_Solutions"] },
    { user: "Human_Resource", admin: true, inherits: ["Admin"] },

    // Technical Roles
    { user: "Technical_Sales", admin: true, inherits: ["default"] },
    { user: "Technical_Solutions", admin: true, inherits: ["default"] },
    { user: "Technical_Support", admin: true, inherits: ["default"] },

    // Consulting / Instructor Roles
    { user: "Consulting_Physician", admin: true, inherits: ["Customer", "Corporate_Customer"] },
    { user: "Fitness_Instructor", admin: true, inherits: ["Customer", "Corporate_Customer"] },
    { user: "Consulting_Professional", admin: true, inherits: ["Customer", "Corporate_Customer"] },
    { user: "Nutritionist", admin: true, inherits: ["Customer", "Corporate_Customer"] }, // <--- Added Nutritionist

    // Admin
    { user: "Admin", admin:true, inherits: ["default"] },

    // Clients
    { user: "Corporate_Client", inherits: ["Corporate_Customer"] },
    { user: "Institution", inherits: ["Guardian"] },
    { user: "Guardian", inherits: ["Learner"] },

    { user: "Corporate_Customer", inherits: ["default"] },
    { user: "Learner", inherits: ["default"] },
    { user: "Customer", inherits: ["default"] }
];

const onboarding_users = ["Customer", "Corporate_Customer"];

function getParentUser(user) {
    const parentUsers = [];

    // Find all users whose `inherits` array includes the given user
    user_inherits.forEach(u => {
        if (u.inherits.includes(user)) {
            parentUsers.push(u.user);
            // Recursively find users that inherit this user
            parentUsers.push(...getParentUser(u.user));
        }
    });

    return parentUsers;
}

function getInheritedUsers(user) {
    const inheritedUsers = [];
    const inherits = user_inherits.find(u => u.user === user);
    if (inherits) {
        inheritedUsers.push(...inherits.inherits);
        inherits.inherits.forEach(inheritedUser => {
            inheritedUsers.push(...getInheritedUsers(inheritedUser));
        });
    }
    return inheritedUsers;
}

function createCheck(col, values = []) {
    return {
        type: "check",
        expression: `${col} IN (${values.map(v => ` '${v}' `).join(',')})`,
        columns: [col]
    };
}

const jsonDataArray = [
    //------------ server config
    {
        "tableName": "Server_Config",
        "system": true,
        "crud": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "columns": [
            { "name": "configKey", "type": "TEXT(255)", "nullable": false },
            { "name": "configVal", "type": "TEXT", "nullable": false }
        ],
        constraints: [
            {
                type: "unique",
                columns: ["configKey"]
            }
        ]
    },
    {
        "tableName": "Database_Access",
        "system": true,
        "crud": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "columns": [
            { "name": "tableName", "type": "TEXT(255)", "nullable": false },
            { "name": "userType", "type": "TEXT(255)", "nullable": false }, 
            { "name": "createAccess", "type": "TEXT(255)", "nullable": false , default: "NO" },  
            { "name": "readAccess", "type": "TEXT(255)", "nullable": false, default: "NO" },
            { "name": "updateAccess", "type": "TEXT(255)", "nullable": false, default: "NO" },
            { "name": "deleteAccess", "type": "TEXT(255)", "nullable": false, default: "NO" },
        ],
        constraints: [ 
            createCheck('createAccess' , ['YES', 'NO']),
            createCheck('readAccess' , ['YES', 'NO']),
            createCheck('updateAccess' , ['YES', 'NO']),
            createCheck('deleteAccess', ['YES', 'NO']), 
            {
                type: "unique",
                columns: ["tableName", "userType"]
            }
        ]
    },
    {
        "tableName": "Page_Access",
        "system": true,
        "crud": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "columns": [
            { "name": "pageName", "type": "TEXT(255)", "nullable": false },
            { "name": "userType", "type": "TEXT(255)", "nullable": false }, 
            { "name": "authAccess", "type": "TEXT(255)", "nullable": false , default: "NO" },   
        ],
        constraints: [ 
            createCheck('authAccess', ['YES', 'NO']),
            {
                type: "unique",
                columns: ["pageName", "userType"]
            }
        ]
    },
    {
        "tableName": "Admin_Access",
        "system": true,
        "crud": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "columns": [ 
            { "name": "userType", "type": "TEXT(255)", "nullable": false }, 
            { "name": "authAccess", "type": "TEXT(255)", "nullable": false , default: "NO" },   
        ],
        constraints: [ 
            createCheck('authAccess', ['YES', 'NO']),
            { type: "unique", columns: ["userType" , "authAccess"] }
        ]
    },
    //------------ system tables
    {
        "tableName": "FileUploads",
        "system": true,
        "crud": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "columns": [
            { "name": "clientId", "type": "TEXT(255)", "nullable": false },
            { "name": "tableName", "type": "TEXT(255)", "nullable": false },
            { "name": "tableIdx", "type": "INTEGER" },
            { "name": "tableGallery", "type": "TEXT(10)" },
            { "name": "fileName", "type": "TEXT(255)" },
            { "name": "fileSize", "type": "INTEGER" },
            { "name": "packetId", "type": "TEXT(255)", "nullable": false },
            {  "name": "packetData", "type": "TEXT" },
            { name: "filePanaroma", type: "TEXT(100)" }
        ],
        constraints: [
            {
                type: "check",
                expression: "tableGallery IN ('YES', 'NO')",
                columns: ["tableGallery"]
            },
            {
                type: "unique",
                columns: ["clientId"]
            }
        ]
    },
    {
        tableName: "_File",
        system: true,
        crud: {
            create: [],
            read: [],
            update: [],
            delete: []
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "table_name", type: "TEXT(255)" },
            { name: "table_idx", type: "INTEGER" },
            { name: "_file", type: "TEXT" },
            { name: "gallery", type: "TEXT(10)" },
            { name: "file_name", type: "TEXT(255)" },
            { name: "file_size", type: "INTEGER" },
            { name: "file_mime", type: "TEXT(100)" },
            { name: "panaroma", type: "TEXT(100)" }
        ],
        constraints: [
            {
                type: "check",
                expression: "gallery IN ('YES', 'NO')",
                columns: ["gallery"]
            }
        ]
    },
    {
        tableName: "File_Copy",
        system: true,
        crud: {
            create: [],
            read: [],
            update: [],
            delete: []
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "table_name", type: "TEXT(255)" },
            { name: "table_idx", type: "INTEGER" },
            { name: "file_idx", type: "INTEGER" },
            { name: "gallery", type: "TEXT(10)" },
            { name: "file_name", type: "TEXT(255)" },
            { name: "file_size", type: "INTEGER" },
            { name: "file_mime", type: "TEXT(100)" },
            { name: "panaroma", type: "TEXT(100)" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["file_idx"],
                referencedTable: "_File",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "check",
                expression: "gallery IN ('YES', 'NO')",
                columns: ["gallery"]
            }
        ]
    },
    {
        tableName: "UserSession",
        system: true,
        crud: {
            create: [],
            read: [],
            update: [],
            delete: []
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "session", type: "TEXT", nullable: false },
            { name: "email", type: "TEXT(255)", nullable: false },
            { name: "session_status", type: "TEXT(255)" },
        ],
        constraints: [
            {
                type: "check",
                expression: "session_status IN ('Online', 'Offline')",
                columns: ["session"]
            },
            {
                type: "unique",
                columns: ["session"]
            }
        ]
    },
    //------------ database
    {
        tableName: "Users",
        icon: "users",
        group: "admin",
        auth: true,
        auth_col: "email",
        image: true,
        gallery: false,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { "name": "title", "type": "TEXT(50)", "nullable": true, "form": "select", check:true },
            { name: "firstname", type: "TEXT(255)", nullable: false },
            { name: "lastname", type: "TEXT(255)", nullable: false }, 
            { name: "email", type: "TEXT(255)", nullable: false },
            { name: "username", type: "TEXT(255)" },
            { name: "password", type: "TEXT(255)", nullable: false, form: "none", raw: "password", default: `${crypto.encryptData("password").toString('utf8')}` },
            { name: "phonenumber", type: "TEXT(255)" },
            { name: "usertype", type: "TEXT(255)", nullable: false, default: "Customer" , form: "select", check: true },
            { name: "is_authenticated", type: "TEXT(10)", default:"No", form: "select", check: true },
            { name: "two_factor_enabled", type: "TEXT(10)", default:"No", form: "select", check: true },
            { name: "otp", type: "TEXT(10)", readonly: true },
            { name: "has_onboarded", type: "TEXT(10)", default: "No", form: "select", check: true },
            { name: "is_admin", type: "TEXT(10)", default: "No", form: "select", check: true },
            { name: "about", type: "TEXT(1000)", form: "doc", view: true, atob: true, btoa: true}
        ],
        constraints: [
            {
                type: "unique",
                columns: ["email"]
            },
            {
                "type": "check",
                "expression": "title IN ('Mr','Mrs','Miss','Ms','Dr','Prof') OR title IS NULL",
                "columns": ["title"],
                "options": ["Mr", "Mrs", "Miss", "Ms", "Dr", "Prof"]
            },
            {
                type: "check",
                expression: "usertype IN ('Managing_Director','IT_Manager','Technical_Sales','Technical_Solutions', 'Consulting_Physician' ,'Fitness_Instructor','Consulting_Professional', 'Nutritionist' ,'Admin','Human_Resource','Corporate_Client','Corporate_Customer','Customer' , 'Institution' , 'Guardian' , 'Learner')",
                columns: ["usertype"],
                options: ['Managing_Director', 'IT_Manager', 'Technical_Sales', 'Technical_Solutions', 'Consulting_Physician', 'Fitness_Instructor', 'Consulting_Professional', 'Nutritionist', 'Admin', 'Human_Resource', 'Corporate_Client', 'Corporate_Customer', 'Customer' , 'Institution' , 'Guardian' , 'Learner']
            }, 
            {
                type: "check",
                expression: "is_authenticated IN ('Yes', 'No')",
                columns: ["is_authenticated"],
                options: ['Yes', 'No' ]
            }, 
            {
                type: "check",
                expression: "is_admin IN ('Yes', 'No')",
                columns: ["is_admin"],
                options: ['Yes', 'No' ]
            }, 
            {
                type: "check",
                expression: "two_factor_enabled IN ('Yes', 'No')",
                columns: ["two_factor_enabled"],
                options: ['Yes', 'No' ]
            }, 
            {
                type: "check",
                expression: "has_onboarded IN ('Yes', 'No')",
                columns: ["has_onboarded"],
                options: ['Yes', 'No' ]
            }
        ] 
    }, 
    {
        tableName: "Notifications",
        group: "admin",
        image: true,
        gallery: true,
        ref_auth: true,
        crud: {
            create: ["Customer", "Corporate_Customer"],
            read: ["Customer", "Corporate_Customer"],
            update: ["Customer", "Corporate_Customer"],
            delete: ["Customer", "Corporate_Customer"],
            own: true,
            ownField: "user_no",
            excepts: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "user_no", type: "INTEGER", form: "search", filter: "email" },
            { name: "title", type: "TEXT(255)", nullable: false },
            { name: "message", type: "TEXT(255)", nullable: false },
            { name: "notification_type", type: "TEXT(255)", form: "select", check: true },
            { name: "status", type: "TEXT(255)", form: "select", check: true },
            { name: "created_at", type: "TEXT(255)", form: "datetime-local" },
            { name: "updated_at", type: "TEXT(255)", form: "datetime-local" },
        ],
        constraints: [
            {
                type: "default",
                expression: "unread",
                column: "status"
            },
            {
                type: "check",
                expression: "notification_type IN ('info', 'warning' , 'alert','success')",
                columns: ["notification_type"],
                options: ['info', 'warning', 'alert','success']
            },
            {
                type: "check",
                expression: "status IN ('unread', 'read')",
                columns: ["status"],
                options: ['unread', 'read']
            },
            {
                type: "foreignKey",
                columns: ["user_no"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        tableName: "UserActivity",
        group: "admin",
        image: false,
        gallery: false,
        ref_auth: true,

        crud: {
            create: ["Customer", "Corporate_Customer"],
            read: ["Customer", "Corporate_Customer"],
            update: ["Customer", "Corporate_Customer"],
            delete: ["Customer", "Corporate_Customer"],
            own: true,
            ownField: "user_no",
            excepts: ["Admin"]
        },

        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "user_no", type: "INTEGER", form: "search", filter: "email" },
            { name: "activity", type: "TEXT(255)", nullable: false },
            { name: "message", type: "TEXT(500)", nullable: false },
            { name: "date", type: "TEXT(100)", form: "date" },
            { name: "time", type: "TEXT(100)", form: "time" },
            { name: "created_at", type: "TEXT(100)", form: "date" },
            { name: "updated_at", type: "TEXT(100)", form: "date" }
        ],

        constraints: [
            {
                type: "foreignKey",
                columns: ["user_no"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        tableName: "Support_Chat",
        group: "admin",
        image: true,
        gallery: true,
        crud: {
            create: ["*"],
            read: ["*"],
            update: ["*"],
            delete: ["*"],
            own: true,
            ownField: "user_no",
            excepts: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "user_no", type: "INTEGER", form: "search", filter: "email" },
            { name: "admin_no", type: "INTEGER", form: "search", filter: "email" },
            { name: "message", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true },
            { name: "chat_date", type: "TEXT(255)", form: "datetime-local" },
            { name: "message_status", type: "TEXT(255)", form: "select", check: true }
        ],
        apps: [
            {
                name: "Live Chat",
                type: "/apps/tyg/video-chat/",
                actions: {
                    create: ["Support_Chat"],
                    read: ["Support_Chat", "Notifications", "Users"],
                    update: ["Support_Chat"],
                    delete: ["Support_Chat"]
                },
                services: {
                    "stun": [{
                        "users": ["*"],
                        "uri": "stun:stun.l.google.com:19302",
                        "desc": "Google open-source \\n stun server"
                    }],
                    "turn": [{
                        users: [""],
                        uri: "relay1.expressturn.com:3480",
                        desc: "expressturn free \\n turn servers"
                    }]
                }
            },
            {
                name: "Create Zoom Meeting",
                type: "/apps/tyg/zoom-meeting/",
                actions: {
                    create: ["Support_Chat"],
                    read: ["Support_Chat", "Notifications", "Users"],
                    update: ["Support_Chat"],
                    delete: ["Support_Chat"]
                },
                services: {
                    "post": [{
                        "users": ["*"],
                        "uri": "/signature",
                        "desc": " "
                    }],
                }
            },
            {
                name: "Join Zoom Meeting",
                type: "/apps/tyg/zoom-join/",
                actions: {
                    create: ["Support_Chat"],
                    read: ["Support_Chat", "Notifications", "Users"],
                    update: ["Support_Chat"],
                    delete: ["Support_Chat"]
                },
                services: {
                    "post": [{
                        "users": ["*"],
                        "uri": "/signature",
                        "desc": " "
                    }],
                }
            },
            {
                name: "Firebase Google Authentication",
                type: "/apps/tyg/auth/google/",
                actions: {
                    create: [],
                    read: ["Support_Chat", "Users"],
                    update: ["Support_Chat"],
                    delete: []
                },
                article: "/apps/tyg/auth/google/README.md"
            },
            {
                name: "Firebase Github Authentication",
                type: "/apps/tyg/auth/github/",
                actions: {
                    create: [],
                    read: ["Support_Chat", "Users"],
                    update: ["Support_Chat"],
                    delete: []
                },
                article: "/apps/tyg/auth/google/README.md"
            },
            {
                name: "Google Web Authentication",
                type: "/apps/tyg/auth/google-web/",
                actions: {
                    create: [],
                    read: ["Support_Chat", "Users"],
                    update: ["Support_Chat"],
                    delete: []
                },
                article: "/apps/tyg/auth/google/README.md"
            },
            {
                name: "Support Gallery",
                type: "/apps/tyg/support-gallery/",
                actions: {
                    create: ["Support_Chat"],
                    read: ["Support_Chat"],
                    update: [],
                    delete: []
                }
            }
        ],
        reports: [
            {
                name: "Chats per User",
                type: "/reports/tyg/support-chat/chats-per-user",
                actions: {
                    create: [],
                    read: ["Support_Chat", "Users"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Chats per Admin",
                type: "/reports/tyg/support-chat/chats-per-admin",
                actions: {
                    create: [],
                    read: ["Support_Chat", "Users"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Unread Messages",
                type: "/reports/tyg/support-chat/unread-messages",
                actions: {
                    create: [],
                    read: ["Support_Chat", "Users"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Chat Volume Over Time",
                type: "/reports/tyg/support-chat/chat-volume-over-time",
                actions: {
                    create: [],
                    read: ["Support_Chat"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Average Response Time",
                type: "/reports/tyg/support-chat/average-response-time",
                actions: {
                    create: [],
                    read: ["Support_Chat"],
                    update: [],
                    delete: []
                }
            }
        ],
        constraints: [
            {
                type: "check",
                expression: "message_status IN ('Open', 'In Progress', 'On Hold', 'Resolved', 'Closed')",
                columns: ["message_status"],
                options: ['Open', 'In Progress', 'On Hold', 'Resolved', 'Closed']
            },
            {
                type: "foreignKey",
                columns: ["user_no"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["admin_no"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },

    {
        tableName: "Rooms",
        group: "chat",
        image: false,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "room_id", type: "TEXT(255)" },
            { name: "created_at", type: "TEXT(255)" }
        ],
        constraints: [ 
        ]
    },
    {
        tableName: "Room_Clients",
        group: "chat",
        image: false,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "room_id", type: "INTEGER", form: "search", filter: "room_id" },
            { name: "socket_id", type: "TEXT(255)" },
            { name: "display_name", type: "TEXT(255)" },
            { name: "joined_at", type: "TEXT(255)" }
        ],
        constraints: [
            {
                type: "unique",
                columns: ["room_id", "socket_id"]
            },
            {
                type: "foreignKey",
                columns: ["room_id"],
                referencedTable: "Rooms",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        tableName: "Turn_Servers",
        group: "chat",
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "server", type: "TEXT(255)", nullable: false, form: "text" },
            { name: "port", type: "INTEGER", nullable: false, form: "number" },
            { name: "username", type: "TEXT(255)", nullable: false, form: "text" },
            { name: "credential", type: "TEXT(255)", nullable: false, form: "password" } 
        ],
        constraints: [],
        reports: [
            {
                name: "Active TURN Servers",
                type: "/reports/tyg/webrtc/turn-servers",
                actions: {
                    create: [],
                    read: ["Turn_Servers"],
                    update: [],
                    delete: []
                }
            }
        ]
    },

    //----------- ecommerce 
    {
        tableName: "Brands",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "brand_name", type: "TEXT(255)" }
        ]
    },

    {
        tableName: "Departments",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "department_name", type: "TEXT(255)" }
        ],
        constraints: [
            {
                type: "unique",
                columns: ["department_name"]
            }
        ]
    },
    {
        tableName: "Categories",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "department_no", type: "INTEGER", form: "search", filter: "department_name" },
            { name: "category_name", type: "TEXT(255)" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["department_no"],
                referencedTable: "Departments",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        tableName: "Products",
        group: "ecommerce",
        image: true,
        gallery: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "product_name", type: "TEXT(255)" },
            { name: "item_no", type: "TEXT(255)" }, 
            { name: "info", type: "TEXT(255)" , view:true }, 
            { name: "price", type: "DECIMAL(10, 2)", form: "range", min: "0" },
            { name: "barcode", type: "TEXT(255)", form: "barcode" },
            { name: "category_no", type: "INTEGER", form: "search", filter: "category_name" },
            { name: "brand_no", type: "INTEGER", form: "search", filter: "brand_name" },
            { name: "description", type: "TEXT(255)", form: "doc", view:true , atob:true , btoa:true },
            { name: "availability", type: "TEXT(255)", form: "select", check: true }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["category_no"],
                referencedTable: "Categories",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["brand_no"],
                referencedTable: "Brands",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "unique",
                columns: ["product_name", "category_no", "brand_no"]
            },
            {
                type: "check",
                expression: "availability IN ('In-Stock', 'Awaiting-Order', 'Out-of-Stock', 'Discontinued')",
                columns: ["availability"],
                options: ['In-Stock', 'Awaiting-Order', 'Out-of-Stock', 'Discontinued']
            }
        ],
        "reports": [
            {
                "name": "Product Sales History",
                "type": "/reports/tyg/products/product-sales-history",
                "actions": {
                    "create": [],
                    "read": ["Products", "Orders", "Order_Items"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Product Stock Movement",
                "type": "/reports/tyg/products/product-stock-movement",
                "actions": {
                    "create": [],
                    "read": ["Products", "Stock_Logs"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Product Pricing Trend",
                "type": "/reports/tyg/products/product-pricing-trend",
                "actions": {
                    "create": [],
                    "read": ["Products", "Price_History"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Product Availability Timeline",
                "type": "/reports/tyg/products/product-availability-timeline",
                "actions": {
                    "create": [],
                    "read": ["Products"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Product Supplier Performance",
                "type": "/reports/tyg/products/product-supplier-performance",
                "actions": {
                    "create": [],
                    "read": ["Products", "Suppliers", "Purchase_Orders"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Product Customer Feedback",
                "type": "/reports/tyg/products/product-customer-feedback",
                "actions": {
                    "create": [],
                    "read": ["Products", "Reviews", "Users"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Product Profit Margin",
                "type": "/reports/tyg/products/product-profit-margin",
                "actions": {
                    "create": [],
                    "read": ["Products", "Sales", "Orders"],
                    "update": [],
                    "delete": []
                }
            }
        ],
        "apps": [
            {
                "name": "Product Catalog",
                "type": "/apps/tyg/product-catalog/",
                "actions": {
                    "create": ["Products"],
                    "read": ["Products", "Categories", "Brands"],
                    "update": ["Products"],
                    "delete": ["Products"]
                }
            },
            {
                "name": "Inventory Manager",
                "type": "/apps/tyg/inventory-manager/",
                "actions": {
                    "create": ["Products"],
                    "read": ["Products", "Categories", "Brands"],
                    "update": ["Products"],
                    "delete": []
                }
            },
            {
                "name": "Price Manager",
                "type": "/apps/tyg/price-manager/",
                "actions": {
                    "create": [],
                    "read": ["Products", "Categories", "Brands"],
                    "update": ["Products"],
                    "delete": []
                }
            },
            {
                "name": "Barcode Scanner",
                "type": "/apps/tyg/barcode-scanner/",
                "actions": {
                    "create": [],
                    "read": ["Products"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Product Gallery",
                "type": "/apps/tyg/product-gallery/",
                "actions": {
                    "create": ["Products"],
                    "read": ["Products"],
                    "update": [],
                    "delete": []
                }
            }
        ]  
    }, 
    
    {
        tableName: "Dimension_Categories",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "category_name", type: "TEXT(255)" }
        ],
        constraints: [
        ]
    },
    {
        tableName: "Dimensions",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "category", type: "INTEGER", form: "search", filter: "category_name" },
            { name: "name", type: "TEXT(255)" },
            { name: "value", type: "TEXT(255)" },
            { name: "tags", type: "TEXT(255)" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["category"],
                referencedTable: "Dimension_Categories",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },

    {
        tableName: "Color_Categories",
        group: "ecommerce", 
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "category_name", type: "TEXT(255)" }
        ]
    },
    {
        tableName: "Colors",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "category", type: "INTEGER", form: "search", filter: "category_name" },
            { name: "name", type: "TEXT(255)" },
            { name: "value", type: "TEXT(255)", form: "color" , color:true }
        ],
        "groups": [
            { name: "color", title: "Category Colors", multiple: true }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["category"],
                referencedTable: "Color_Categories",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
     
    {
        tableName: "Material_Categories",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false }, 
            { name: "category_name", type: "TEXT(255)" } ,
        ] 
    },
    {
        tableName: "Materials",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["*"],
            read: ["*"],
            update: ["*"],
            delete: ["*"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "category", type: "INTEGER" , form:"search" , filter: "category_name" },
            { name: "name", type: "TEXT(255)" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["category"],
                referencedTable: "Material_Categories",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
     
    {
        tableName: "Feature_Categories",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false }, 
            { name: "category_name", type: "TEXT(255)" },
            { name: "description", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true }
        ] 
    },
    {
        tableName: "Features",
        group: "ecommerce",
        image: true,
        crud: {
            create: ["*"],
            read: ["*"],
            update: ["*"],
            delete: ["*"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "category", type: "INTEGER" , form:"search" , filter: "category_name" },
            { name: "name", type: "TEXT(255)" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["category"],
                referencedTable: "Feature_Categories",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },

    {
        tableName: "Product_Details",
        group: "ecommerce",
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "product", type: "INTEGER", filter: "product_name", form: "search" }, 
            { name: "dimension", type: "INTEGER", filter: "name", form: "search", nullable: true , group: "detail"  },
            { name: "color", type: "INTEGER", filter: "name", form: "search", nullable: true, group: "detail" } ,
            { name: "material", type: "INTEGER", filter: "name", form: "search", nullable: true, group: "detail" },
            { name: "quantity", type: "INTEGER", form: "number", min: "0", group: "detail" }, 
            { name: "can_be_ordered", type: "TEXT(255)", form: "select", check: true, group: "detail" , default:'No' },
            { name: "waiting_time", type: "INTEGER", form: "number", default: "0", min: "0", group: "detail" },
            { name: "waiting_category", type: "TEXT(255)", form: "select", check: true, group: "detail" , default:'Day' },
        ],
        "groups": [
            { name: "detail", title: "Details", multiple: true }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["product"],
                referencedTable: "Products",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }, 
            {
                type: "foreignKey",
                columns: ["dimension"],
                referencedTable: "Dimensions",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["color"],
                referencedTable: "Colors",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["material"],
                referencedTable: "Materials",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "check",
                expression: "can_be_ordered IN ('Yes', 'No')",
                columns: ["can_be_ordered"],
                options: ['Yes', 'No']
            },
            {
                type: "check",
                expression: "waiting_category IN ('Day', 'Week', 'Month')",
                columns: ["waiting_category"],
                options: ['Day', 'Week', 'Month']
            }
        ]
    },
    {
        tableName: "Product_Features",
        group: "ecommerce",
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "product", type: "INTEGER", filter: "product_name", form: "search" },
            { name: "feature", type: "INTEGER", filter: "name", form: "search" },
            { name: "dimension", type: "INTEGER", filter: "name", form: "search", nullable: true },
            { name: "color", type: "INTEGER", filter: "name", form: "search", nullable: true },
            { name: "material", type: "INTEGER", filter: "name", form: "search", nullable: true }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["product"],
                referencedTable: "Products",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["feature"],
                referencedTable: "Features",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["dimension"],
                referencedTable: "Dimensions",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["color"],
                referencedTable: "Colors",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["material"],
                referencedTable: "Materials",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
 
    //------------ wellness
    {
        "tableName": "Onboarding",
        "group": "wellness",
        "image": false,
        "crud": {
            "create": ["User", "Corporate_Customer", "Admin"],
            "read": ["User", "Corporate_Customer", "Admin"],
            "update": ["User", "Corporate_Customer", "Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },

            { "name": "email", "type": "INTEGER", "form": "search", "filter": "email" },  
            { "name": "country", "type": "INTEGER", "form": "search", "filter": "name", "table": "Countries" },

            { "name": "gender", "type": "TEXT(50)", "form": "select", "check": true },
            { "name": "height_cm", "type": "INTEGER", "form": "range", "min": 100, "max": 220 },
            { "name": "current_weight_kg", "type": "INTEGER", "form": "range", "min": 30, "max": 200 },
            { "name": "target_weight_kg", "type": "INTEGER", "form": "range", "min": 30, "max": 200 },

            { "name": "daily_activity", "type": "TEXT(100)", "form": "select", "check": true },
            { "name": "specific_sports", "type": "TEXT(255)", "form": "text" },
            { "name": "wellness_goal", "type": "TEXT(100)", "form": "select", "check": true },
            { "name": "other_goal", "type": "TEXT(255)", "form": "text" },

            { "name": "stress_level", "type": "INTEGER", "form": "range", "min": 1, "max": 10 },
            { "name": "mood", "type": "TEXT(100)", "form": "select", "check": true },

            { "name": "sleep_hours", "type": "INTEGER", "form": "range", "min": 3, "max": 12 },
            { "name": "sleep_quality", "type": "TEXT(255)", "form": "select", "check": true },

            { "name": "nutrition_type", "type": "TEXT(100)", "form": "select", "check": true },

            { "name": "created_at", "type": "TEXT(255)", "form": "datetime-local" },
            { "name": "updated_at", "type": "TEXT(255)", "form": "datetime-local" }
        ],

        "constraints": [
            {
                "type": "check",
                "expression": "gender IN ('Male', 'Female', 'Other')",
                "columns": ["gender"],
                "options": ["Male", "Female", "Other"]
            },
            {
                "type": "check",
                "expression": "daily_activity IN ('Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active')",
                "columns": ["daily_activity"],
                "options": ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"]
            },
            {
                "type": "check",
                "expression": "wellness_goal IN ('Lose Weight', 'Gain Muscle', 'Improve Sleep', 'Reduce Stress', 'Increase Energy')",
                "columns": ["wellness_goal"],
                "options": ["Lose Weight", "Gain Muscle", "Improve Sleep", "Reduce Stress", "Increase Energy"]
            },
            {
                "type": "check",
                "expression": "mood IN ('Good', 'Okay', 'Tired', 'Stressed')",
                "columns": ["mood"],
                "options": ["Good", "Okay", "Tired", "Stressed"]
            },
            {
                "type": "check",
                "expression": "sleep_quality IN ('Often struggle to fall asleep', 'Sleep well most nights', 'Wake up frequently')",
                "columns": ["sleep_quality"],
                "options": ["Often struggle to fall asleep", "Sleep well most nights", "Wake up frequently"]
            },
            {
                "type": "check",
                "expression": "nutrition_type IN ('Balanced', 'High Protein', 'Low Carb', 'Vegetarian', 'Vegan', 'Other')",
                "columns": ["nutrition_type"],
                "options": ["Balanced", "High Protein", "Low Carb", "Vegetarian", "Vegan", "Other"]
            },
            {
                "type": "foreignKey",
                "columns": ["email"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["country"],
                "referencedTable": "Countries",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "SET NULL",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },
    {
        tableName: "Health_Records",
        icon: "heart-pulse",
        group: "wellness",
        auth: true,
        auth_col: "user_no",
        image: false,
        gallery: false,
        crud: {
            create: ["*"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", identity: { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "id", type: "TEXT(500)" },
            { name: "user_no", type: "INTEGER", form: "search", filter: "email" },
            { name: "type", type: "TEXT(50)", nullable: false },
            { name: "start_time", type: "TEXT(100)", nullable: false },
            { name: "end_time", type: "TEXT(100)", nullable: false },
            { name: "value", type: "REAL", default: 0 },
            { name: "samples", type: "TEXT(255)", form: "json", nullable: true },
            { name: "metadata", type: "TEXT(255)", form: "json", nullable: true },
            { name: "source", type: "TEXT(255)", nullable: true } 
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["user_no"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "check",
                expression: "type IN ('steps', 'heartRate', 'sleep', 'calories', 'exercise', 'distance', 'hrv', 'weight')",
                columns: ["type"],
                options: ['steps', 'heartRate', 'sleep', 'calories', 'exercise', 'distance', 'hrv', 'weight']
            }, 
            {
                type: "unique",
                columns: ["user_no", "type", "start_time", "end_time","value","source"]
            }
        ]
    },
    {
        tableName: "Divisions",
        group: "wellness",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["default"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "division_name", type: "TEXT(255)" }, // e.g fit , flex , chill  
            { "name": "grid_ui", type: "TEXT(10)", form: "select", check: true, "grid": 0, nullable: true },
            { name: "description", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true }
        ],
        constraints: [
            {
                type: "unique",
                columns: ["division_name"]
            },
            {
                "type": "check",
                "expression": "grid_ui IN ('grid', 'scroll')",
                "columns": ["grid_ui"],
                "options": ['grid', 'scroll']
            }
        ]
    }, 
    {
        tableName: "Groups",
        group: "wellness",
        image: true,
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "division", type: "INTEGER", form: "search", filter: "division_name" },
            { name: "group_name", type: "TEXT(255)" },
            { name: "group_description", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true },
            { name: "group_rating", type: "TEXT(10)", form: "select", check: true, "default": 0 },
      
            { "name": "min_age", "type": "INTEGER", "form": "number" },
            { "name": "max_age", "type": "INTEGER", "form": "number" },
            { "name": "age_group", "type": "TEXT(50)", "form": "select", "check": true, default: "All" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["division"],
                referencedTable: "Divisions",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }, 
            {
                "type": "check",
                "expression": "group_rating IN ('0' ,'1', '2', '3', '4' , '5')",
                "columns": ["group_rating"],
                "options": ['0', '1', '2', '3', '4', '5']
            },
            {
                "type": "check",
                "expression": "age_group IN ('Toddlers', 'Kids', 'Teens', 'Adults', 'All')",
                "columns": ["age_group"],
                "options": ["Toddlers" , "Kids", "Teens", "Adults", "All"]
            }
        ]
    },
    {
        "tableName": "Group_Activities",
        "group": "wellness", 
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "group_no", "type": "INTEGER", "form": "search", "filter": "group_name" },
            { "name": "activity_name", "type": "TEXT(255)" }, 
            { "name": "activity_description", "type": "TEXT(255)", form: "doc", view: true, atob: true, btoa: true }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["group_no"],
                "referencedTable": "Groups",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ],
        "reports": [],
        "apps": []
    },
    {
        "tableName": "Programmes",
        "group": "wellness",
        "image": true,
        "video": true,
        "panorama": true ,
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },

            { "name": "activity_no", "type": "INTEGER", "form": "search", "filter": "activity_name" },
            { "name": "trainer_no", "type": "INTEGER", "form": "search", "filter": "email" },

            { "name": "programme_name", "type": "TEXT(255)" },
            { "name": "programme_language", "type": "INTEGER", "form": "search", "filter": "name" },
            { "name": "programme_description", "type": "TEXT(255)", "form": "doc", "view": true, "atob": true, "btoa": true },

            { "name": "session_intensity", "type": "TEXT(255)", "form": "select", "check": true },
            { "name": "session_duration", "type": "TEXT(255)", "form": "number" },
            { "name": "session_category", "type": "TEXT(255)", "form": "select", "check": true },

            { "name": "programme_duration", "type": "TEXT(255)", "form": "number" },
            { "name": "programme_category", "type": "TEXT(255)", "form": "select", "check": true }, 

            { "name": "programme_difficulty", "type": "TEXT(255)", "form": "select", "check": true },
            { "name": "programme_timeline", "type": "TEXT(255)", "form": "select", "check": true },
            { "name": "programme_schedule", "type": "TEXT(255)", "form": "datetime-local" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["activity_no"],
                "referencedTable": "Group_Activities",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["programme_language"],
                "referencedTable": "Languages",
                "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["trainer_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "unique",
                "columns": ["programme_name", "activity_no", "trainer_no"]
            },
            {
                "type": "check",
                "expression": "session_intensity IN ('Very Low', 'Low', 'Medium', 'High', 'Very High')",
                "columns": ["session_intensity"],
                "options": ["Very Low", "Low", "Medium", "High", "Very High"]
            },
            {
                "type": "check",
                "expression": "session_category IN ('Min', 'Hour' , 'Day', 'Week', 'Month', 'Year')",
                "columns": ["session_category"],
                "options": ["Min","Hour", "Day", "Week", "Month", "Year"]
            }, 
            {
                "type": "check",
                "expression": "programme_category IN ('Min', 'Hour' , 'Day', 'Week', 'Month', 'Year')",
                "columns": ["programme_category"],
                "options": ["Min", "Hour" , "Day", "Week", "Month", "Year"]
            },
            {
                "type": "check",
                "expression": "programme_difficulty IN ('Beginner', 'Intermediate', 'Advanced')",
                "columns": ["programme_difficulty"],
                "options": ["Beginner", "Intermediate", "Advanced"]
            },
            {
                "type": "check",
                "expression": "programme_timeline IN ('Past', 'Ongoing', 'Upcoming', 'None')",
                "columns": ["programme_timeline"],
                "options": ["Past", "Ongoing", "Upcoming", "None"]
            }
        ],
        "reports": [],
        "apps": []
    },

    {
        "tableName": "Practitioners",
        "group": "wellness",
        "image": true,
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "role", "type": "TEXT(255)", "form": "select" , check:true }, 
            { "name": "title", "type": "TEXT(500)" },
            { "name": "bio", "type": "TEXT(255)", form: "doc", view: true, atob: true, btoa: true }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                type: "check",
                expression: `role IN (${user_inherits.map(u => `'${u.user}'`).join(' , ')})`,
                columns: ["role"],
                options: user_inherits.map(u => u.user)
            },
            {
                "type": "unique",
                "columns": ["user_no", "role"]
            }
        ]
    },
    {
        "tableName": "Programme_Practitioners",
        "group": "wellness",
        "ref_auth": true,
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "programme_no", "type": "INTEGER", "form": "search", "filter": "programme_name" },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "assigned_role", "type": "TEXT(255)", "form": "select", "check": true }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["programme_no"],
                "referencedTable": "Programmes",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "assigned_role IN ('Lead','Assistant','Co-Trainer')",
                "columns": ["assigned_role"],
                "options": ["Lead", "Assistant", "Co-Trainer"]
            }, 
            {
                "type": "trigger",
                "timing": "BEFORE",
                "event": "INSERT",
                "statement": "SELECT CASE WHEN (SELECT usertype FROM Users WHERE idx = NEW.user_no) NOT IN ('Fitness_Instructor', 'Consulting_Professional', '') THEN RAISE(ABORT, 'User must be Fitness_Instructor or Consulting_Professional') END;"
            },
            {
                "type": "unique",
                "columns": ["programme_no", "user_no"]
            }
        ], 
    },

    {
        "tableName": "Practitioner_Schedule",
        "group": "wellness",
        "ref_auth": true,
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "working_days", "type": "TEXT(255)", "form": "select", "check": true, group: "days" },
            { "name": "include_holidays", "type": "TEXT(255)", "form": "select", "check": true },
            { "name": "start_time", "type": "TEXT(255)", "form": "time" },
            { "name": "end_time", "type": "TEXT(255)", "form": "time" },
        ],
        "groups": [
            { name: "days", title: "Working Days", multiple: true }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": `working_days IN ('Monday', 'Tuesday', 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday' , 'Sunday')`,
                "columns": ["working_days"],
                "options": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            },
            {
                "type": "check",
                "expression": `include_holidays IN ('Yes' , 'No')`,
                "columns": ["include_holidays"],
                "options": ["Yes", "No"]
            }
        ],
    },

    {
        "tableName": "ExerciseMetric",
        "group": "wellness",
        "ref_auth": true,
        "crud": { "create": ["Admin"], "read": ["*"], "update": ["Admin"], "delete": ["Admin"] },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "metric_name", "type": "TEXT(255)" }
        ],
        "constraints": [
            {
                type: "unique",
                columns: ["metric_name"]
            }
        ]
    }, 
    {
        "tableName": "WorkoutSession",
        "group": "wellness",
        "ref_auth": true,
        "crud": { "create": ["Admin"], "read": ["*"], "update": ["Admin"], "delete": ["Admin"] },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_id", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "programme_id", "type": "INTEGER", "form": "search", "filter": "programme_name" },
            { "name": "start_time", "type": "TEXT(255)", "form": "datetime-local" },
            { "name": "end_time", "type": "TEXT(255)", "form": "datetime-local" },

            { "name": "session_type", "type": "TEXT(60)", "default": '2D', "form": "select", check: true  },

            { "name": "video_start_seconds", "type": "REAL", "form": "number" , default: 0 },
            { "name": "video_end_seconds", "type": "REAL", "form": "number" , default: 0 },
            { "name": "total_watch_seconds", "type": "REAL", "form": "number" , default: 0 },
            { "name": "completion_pct", "type": "REAL", "form": "number" , default: 0 }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_id"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }, 
            {
                "type": "foreignKey",
                "columns": ["programme_id"],
                "referencedTable": "Programmes",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },

            {
                "type": "check",
                "expression": "session_type IN ('2D','3D' , 'LIVE')",
                "columns": ["session_type"],
                "options": ["2D", "3D" , "LIVE"]
            }
        ]
    },
    {
        "tableName": "WorkoutVideoProgress",
        "group": "wellness",
        "ref_auth": true,

        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },

        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },

            { "name": "session_id", "type": "INTEGER", "form": "search", "filter": "idx" },
            { "name": "user_id", "type": "INTEGER", "form": "search", "filter": "email" },

            { "name": "event_type", "type": "TEXT(100)", "form": "select", "options": ["START", "PAUSE", "SEEK", "END", "PROGRESS"] },

            { "name": "video_time", "type": "REAL", "form": "number", "default": 0 },
            { "name": "video_duration", "type": "REAL", "form": "number", "default": 0 },
            { "name": "watched_pct", "type": "REAL", "form": "number", "default": 0 } 
        ],

        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["session_id"],
                "referencedTable": "WorkoutSession",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["user_id"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },
    {
        "tableName": "SessionMetricValue",
        "group": "wellness",
        "ref_auth": true,
        "crud": { "create": ["Admin"], "read": ["*"], "update": ["Admin"], "delete": ["Admin"] },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_id", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "session_id", "type": "INTEGER", "form": "search", "filter": "start_time" },
            { "name": "metric_id", "type": "INTEGER", "form": "search", "filter": "metric_name" },
            { "name": "value", "type": "TEXT(255)" },
            { "name": "secondary_value", "type": "TEXT(255)" }
        ],
        "constraints": [
            {
                type: "unique",
                columns: ["user_id" , "session_id" , "metric_id"]
            },
            {
                "type": "foreignKey",
                "columns": ["user_id"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["metric_id"],
                "referencedTable": "ExerciseMetric",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["session_id"],
                "referencedTable": "WorkoutSession",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },
     
    {
        "tableName": "Calendar",
        "group": "wellness",
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },

            { "name": "title", "type": "TEXT(255)" },

            { "name": "start_date", "type": "TEXT(255)", "form": "date" },
            { "name": "end_date", "type": "TEXT(255)", "form": "date", "nullable": true },

            { "name": "start_time", "type": "TEXT(10)", "nullable": true },
            { "name": "end_time", "type": "TEXT(10)", "nullable": true },
             
            { "name": "working_days", "type": "TEXT(255)", "form": "json", "nullable": true },
            { "name": "include_holidays", "type": "TEXT(10)", "default": 'NO', "form": "select", check: true  },
             
            { "name": "meeting_id", "type": "INTEGER", "form": "search", "filter": "programme_name", "nullable": true },
            { "name": "professional_id", "type": "INTEGER", "form": "search", "filter": "email", "nullable": true },
            { "name": "confirmed", "type": "TEXT(10)", "default": 'NO', "form": "select", check: true },
            { "name": "comments", "type": "TEXT", form: "doc", view: true, atob: true, btoa: true },

            { "name": "email", "type": "INTEGER", "form": "search", "filter": "email", "nullable": true }
        ],

        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["meeting_id"],
                "referencedTable": "Programmes",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["professional_id"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["email"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },

            {
                "type": "check",
                "expression": "include_holidays IN ('YES','NO')",
                "columns": ["include_holidays"],
                "options": ["YES", "NO"]
            },
            {
                "type": "check",
                "expression": "confirmed IN ('YES','NO','REJECTED')",
                "columns": ["confirmed"],
                "options": ["YES", "NO" , "REJECTED"]
            }
        ]
    },

    //------------ marketing
    {
        "tableName": "Subscriptions",
        "group": "marketing",
        "image": true,
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "subscription_name", "type": "TEXT(255)" },
            { "name": "subscription_type", "type": "TEXT(255)", "form": "select", "check": true },
            { "name": "price", "type": "REAL", "form": "number", "min": "0" },
            { "name": "currency", "type": "INTEGER", "form": "search", "filter": "name" },
            { "name": "classes_per_week", "type": "INTEGER", "form": "number", "min": "0" },
            { "name": "includes_equipment", "type": "TEXT(10)", "form": "select", check: true },
            { "name": "event_replays", "type": "TEXT(10)", "form": "select", check: true },
            { "name": "discount_merch", "type": "INTEGER", "form": "number", "min": "0", max: "100", default: 0 },
            { "name": "discount_event_tickets", "type": "INTEGER", "form": "number", "min": "0", max: "100", default: 0 },
            { "name": "vip_event_access", "type": "TEXT(10)", "form": "select", check:true } 
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["currency"],
                "referencedTable": "Currencies",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "subscription_type IN ('Online','Hybrid','Studio')",
                "columns": ["subscription_type"],
                "options": ["Online", "Hybrid", "Studio"]
            },
            { "type": "check", "expression": "price >= 0", "columns": ["price"] },
            { "type": "check", "expression": "classes_per_week >= 0", "columns": ["classes_per_week"] },
            { "type": "check", "expression": "discount_merch >= 0 AND discount_merch <= 100", "columns": ["discount_merch"] },
            { "type": "check", "expression": "discount_event_tickets >= 0 AND discount_event_tickets <= 100", "columns": ["discount_event_tickets"] },
            { "type": "check", "expression": "includes_equipment IN ('Yes','No')", "columns": ["includes_equipment"], "options": ["Yes", "No"] },
            { "type": "check", "expression": "event_replays IN ('Yes','No')", "columns": ["event_replays"], "options": ["Yes", "No"] },
            { "type": "check", "expression": "vip_event_access IN ('Yes','No')", "columns": ["vip_event_access"], "options": ["Yes", "No"] }
        ],
        "reports": [],
        "apps": []
    },

    {
        "tableName": "User_Subscriptions",
        "group": "marketing",
        "image": false,
        "crud": {
            "create": ["Admin", "User"],
            "read": ["Admin", "User"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "subscription_no", "type": "INTEGER", "form": "search", "filter": "subscription_name" },
            { "name": "start_date", "type": "TEXT(20)", "form": "date-time-local" },
            { "name": "end_date", "type": "TEXT(20)", "form": "date-time-local" },
            { "name": "auto_renew", "type": "TEXT(10)", "form": "select", "check": true },
            { "name": "active_status", "type": "TEXT(20)", "form": "select", "check": true },
            { "name": "payment_received", "type": "TEXT(10)", "form": "select", "check": true }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["subscription_no"],
                "referencedTable": "Subscriptions",
                "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "check",
                "expression": "active_status IN ('Active','Expired','Cancelled','Suspended')",
                "columns": ["active_status"],
                "options": ["Active", "Expired", "Cancelled", "Suspended"]
            },
            {
                "type": "check",
                "expression": "auto_renew IN ('Yes','No')",
                "columns": ["auto_renew"],
                "options": ["Yes", "No"]
            },
            {
                "type": "check",
                "expression": "payment_received IN ('Yes','No')",
                "columns": ["payment_received"],
                "options": ["Yes", "No"]
            }
        ],
        "reports": [],
        "apps": []
    },
    {
        "tableName": "Subscription_Class_Tracking",
        "group": "marketing",
        "crud": {
            "create": ["Admin", "User"],
            "read": ["Admin", "User"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_subscription_no", "type": "INTEGER", "form": "search", "filter": "active_status" },
            { "name": "programme_no", "type": "INTEGER", "form": "search", "filter": "programme_name" },
            { "name": "class_date", "type": "TEXT(20)", "form": "date-time-local" },
            { "name": "attended", "type": "TEXT(10)", "form": "select", "check": true }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_subscription_no"],
                "referencedTable": "User_Subscriptions",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["programme_no"],
                "referencedTable": "Programmes",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            { "type": "check", "expression": "attended IN ('Yes','No')", "columns": ["attended"], "options": ["Yes", "No"] }
        ],
        "reports": [],
        "apps": []
    },

    {
        tableName: "Event_Categories",
        group: "marketing",
        image: true , 
        crud: {
            create: [ "Corporate_Client" , "Admin" ],
            read: ["*"],
            update: ["Corporate_Client", "Admin" ],
            delete: ["Corporate_Client", "Admin" ]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "category_name", type: "TEXT(225)" }, 
        ]
    },
    {
        tableName: "Events",
        group: "marketing",
        image: true,
        gallery: true,
        crud: {
            create: [ "Corporate_Client" , "Admin" ],
            read: ["*"],
            update: ["Corporate_Client", "Admin" ],
            delete: ["Corporate_Client", "Admin" ]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "title", type: "TEXT(225)" },
            { name: "description", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true },
            { name: "location", type: "TEXT(300)" , form: "textarea"  },
            { name: "start_time", type: "TEXT(30)" , form: "datetime-local"  },
            { name: "end_time", type: "TEXT(30)" , form: "datetime-local"  },
            { name: "all_day", type: "TEXT(10)" , form: "select" , check:true  },
            { name: "organizer", type: "INTEGER" , form: "search" , filter:"email"  },
            { name: "status", type: "TEXT(255)" , form: "select" , check:true },
            { name: "max_attendees", type: "INTEGER", form: "number", min: 0 }, 
            { name: "created_at", type: "TEXT(255)", form: "datetime-local" },
            { name: "updated_at", type: "TEXT(255)", form: "datetime-local" }, 
            { name: "category", type: "INTEGER", form: "search", filter: "category_name", group: "category" },
        ],
        "groups": [
            { name: "category", title: "Event Categories", multiple: true }
        ],
        constraints: [
            {
                type: "check",
                expression: "all_day IN ('Yes' , 'No')",
                columns: ["all_day"],
                options: ['Yes', 'No']
            },
            {
                type: "check",
                expression: "status IN ('scheduled', 'ongoing', 'completed', 'canceled')",
                columns: ["status"],
                options: ['scheduled', 'ongoing', 'completed', 'canceled']
            },
            {
                type: "default",
                expression: "scheduled",
                column: "status"
            }, 
            {
                type: "foreignKey",
                columns: ["category"],
                referencedTable: "Event_Categories",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["organizer"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
        ],
    },

    {
        "tableName": "Event_Tickets",
        "group": "marketing",
        "crud": {
            "create": ["Corporate_Client", "Admin"],
            "read": ["*"],
            "update": ["Corporate_Client", "Admin"],
            "delete": ["Corporate_Client", "Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "event_no", "type": "INTEGER", "form": "search", "filter": "title" },
            { "name": "ticket_name", "type": "TEXT(255)", "nullable": false },
            { "name": "description", "type": "TEXT(255)", "form": "textarea" },
            { "name": "quantity", "type": "INTEGER", "form": "number", "min": "0" },
            { "name": "price", "type": "DECIMAL(10,2)", "form": "number", "min": "0", "nullable": false, "check": true },
            { "name": "currency", "type": "INTEGER", "form": "search", "filter": "code" },
            { "name": "is_active", "type": "TEXT(10)", "form": "select", "default": "Yes", "check": true , nullable:true }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["event_no"],
                "referencedTable": "Events",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["currency"],
                "referencedTable": "Currencies",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "price >= 0",
                "columns": ["price"]
            }, 
            {
                "type": "check",
                "expression": "is_active IN ('Yes', 'No')",
                "columns": ["is_active"],
                "options": ["Yes", "No"]
            }
        ], 
        apps: [
            {
                "name": "Event Revenue Summary",
                "type": "/apps/tyg/event-tickets/revenue-summary",
                "actions": {
                    "create": [],
                    "read": ["Event_Tickets", "Events"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Ticket Popularity Analysis",
                "type": "/apps/tyg/event-tickets/popularity-analysis",
                "actions": {
                    "create": [],
                    "read": ["Event_Tickets", "Events"],
                    "update": [],
                    "delete": []
                }
            }
        ],
        reports: [
            {
                "name": "Ticket Performance Report",
                "type": "/reports/tyg/event-tickets/performance",
                "actions": {
                    "create": [],
                    "read": ["Event_Tickets", "Events"],
                    "update": [],
                    "delete": []
                }
            }
        ],
    },
    {
        tableName: "Event_Roles",
        group: "marketing",
        crud: {
            create: ["Corporate_Client", "Admin"],
            read: ["*"],
            update: ["Corporate_Client", "Admin"],
            delete: ["Corporate_Client", "Admin"]
        },
        columns: [
            {
                name: "idx",
                type: "INTEGER",
                identity: { seed: 1, increment: 1 },
                primaryKey: true,
                nullable: false
            },
            {
                name: "role_name",
                type: "TEXT(255)",
                nullable: false
            },
            {
                name: "description",
                type: "TEXT(255)",
                form: "textarea"
            }
        ],
        apps: [
            {
                "name": "Role Distribution Across Events",
                "type": "/reports/tyg/event-roles/role-distribution",
                "actions": {
                    "create": [],
                    "read": ["Event_Roles", "Event_Speakers"],
                    "update": [],
                    "delete": []
                }
            }
        ],
        reports: [
            {
                "name": "Role Utilization Report",
                "type": "/reports/tyg/event-roles/role-utilization",
                "actions": {
                    "create": [],
                    "read": ["Event_Roles", "Event_Speakers"],
                    "update": [],
                    "delete": []
                }
            }
        ]
    },
    {
        tableName: "Event_Speakers",
        group: "marketing",
        image: true,
        crud: {
            create: ["Corporate_Client", "Admin"],
            read: ["*"],
            update: ["Corporate_Client", "Admin"],
            delete: ["Corporate_Client", "Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "event_no", type: "INTEGER", form: "search", filter: "title", nullable: false },
            { name: "speaker", type: "INTEGER", form: "search", filter: "email", nullable: false },
            { name: "role_id", type: "INTEGER", form: "search", filter: "role_name", nullable: false }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["event_no"],
                referencedTable: "Events",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["speaker"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["role_id"],
                referencedTable: "Event_Roles",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ], 
        apps: [
            {
                "name": "Speaker Participation Overview",
                "type": "/reports/tyg/event-speakers/speaker-participation",
                "actions": {
                    "create": [],
                    "read": ["Events", "Event_Speakers" , "Users"],
                    "update": [],
                    "delete": []
                }
            }, 
            {
                "name": "Speaker Role Mix Report",
                "type": "/reports/tyg/event-speakers/speaker-role-mix",
                "actions": {
                    "create": [],
                    "read": ["Events", "Event_Speakers" , "Users"],
                    "update": [],
                    "delete": []
                }
            }
        ], 
        reports: [
            {
                "name": "Speaker Engagement Report",
                "type": "/reports/tyg/event-speakers/speaker-engagement",
                "actions": {
                    "create": [],
                    "read": ["Events", "Event_Speakers" , "Users"],
                    "update": [],
                    "delete": []
                }
            }
        ]
    },
    {
        tableName: "Event_Schedule",
        group: "marketing",
        crud: {
            create: ["Corporate_Client", "Admin"],
            read: ["*"],
            update: ["Corporate_Client", "Admin"],
            delete: ["Corporate_Client", "Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "event_no", type: "INTEGER", form: "search", filter: "title" },
            { name: "activity", type: "TEXT(255)" },
            { name: "time", type: "TEXT(50)", form: "time" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["event_no"],
                referencedTable: "Events",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ],
        apps: [
            {
                "name": "Event Status Dashboard",
                "type": "/reports/tyg/event-details/event-status",
                "actions": {
                    "create": [],
                    "read": ["Events", "Event_Details"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Revenue vs Attendance Analysis",
                "type": "/reports/tyg/event-details/revenue-vs-attendance",
                "actions": {
                    "create": [],
                    "read": ["Events", "Event_Details"],
                    "update": [],
                    "delete": []
                }
            }
        ],
        reports: [
            {
                "name": "Event Performance Snapshot",
                "type": "/reports/tyg/event-details/event-performance",
                "actions": {
                    "create": [],
                    "read": ["Events", "Event_Details"],
                    "update": [],
                    "delete": []
                }
            }
        ]
    }, 
    {
        tableName: "Event_Maps",
        group: "marketing",
        crud: {
            create: ["Corporate_Client", "Admin"],
            read: ["*"],
            update: ["Corporate_Client", "Admin"],
            delete: ["Corporate_Client", "Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "event_no", type: "INTEGER", form: "search", filter: "title", nullable: false },
            { name: "map_src", type: "TEXT(255)", nullable: false }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["event_no"],
                referencedTable: "Events",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        tableName: "Event_Details",
        group: "marketing",
        crud: {
            create: ["Corporate_Client", "Admin"],
            read: ["*"],
            update: ["Corporate_Client", "Admin"],
            delete: ["Corporate_Client", "Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "event_no", type: "INTEGER", form: "search", filter: "title", nullable: false },

            { name: "event_date", type: "TEXT(100)" },
            { name: "event_time", type: "TEXT(100)" },
            { name: "location", type: "TEXT(255)" },
            { name: "fee", type: "TEXT(50)" },
            { name: "status_text", type: "TEXT(100)" },
            { name: "status_type", type: "TEXT(50)" }

        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["event_no"],
                referencedTable: "Events",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "check",
                expression: "status_type IN ('success','warning','danger','info')",
                columns: ["status_type"]
            }
        ]
    },
    {
        tableName: "Event_Sponsors",
        group: "marketing", 
        crud: {
            create: ["Corporate_Client", "Admin"],
            read: ["*"],
            update: ["Corporate_Client", "Admin"],
            delete: ["Corporate_Client", "Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false }, 
            { name: "event_no", type: "INTEGER", form: "search", filter: "title", nullable: false }, 
            { name: "company", type: "INTEGER", form: "search", filter: "company_name", nullable: false }, 
            { name: "sponsor_level", type: "TEXT(100)", form: "select", check: true } 
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["event_no"],
                referencedTable: "Events",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["company"],
                referencedTable: "Company",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "check",
                expression: "sponsor_level IN ('Gold','Silver','Bronze','Partner')",
                columns: ["sponsor_level"],
                options: ["Gold", "Silver", "Bronze", "Partner"]
            }
        ],
        apps: [
            {
                "name": "Sponsorship Revenue Overview",
                "type": "/reports/tyg/event-sponsors/sponsor-revenue",
                "actions": {
                    "create": [],
                    "read": ["Event_Sponsors", "Company" , "Events"],
                    "update": [],
                    "delete": []
                }
            },
            {
                "name": "Sponsor Engagement Analysis",
                "type": "/reports/tyg/event-sponsors/sponsor-engagement",
                "actions": {
                    "create": [],
                    "read": ["Event_Sponsors", "Company" , "Events"],
                    "update": [],
                    "delete": []
                }
            },
        ],
        reports: [
            {
                "name": "Sponsor Contribution Report",
                "type": "/reports/tyg/event-sponsors/sponsor-contribution",
                "actions": {
                    "create": [],
                    "read": ["Event_Sponsors", "Company" , "Events"],
                    "update": [],
                    "delete": []
                }
            }
        ]
    },

    {
        "tableName": "Event_Attendees",
        "group": "marketing",
        "image": true,
        "crud": {
            "create": ["*"],
            "read": ["*"],
            "update": ["*"],
            "delete": ["*"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "event_ticket_no", "type": "INTEGER", "form": "search", "filter": "ticket_name" },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "user_subscription_no", "type": "INTEGER", "form": "search", "filter": "active_status", "nullable": true },
            { "name": "rsvp_status", "type": "TEXT(10)", "form": "select", "options": ["Yes", "No", "Maybe"] },
            { "name": "discount_percentage", "type": "INTEGER", "form": "number", "min": "0", "default": 0 },
            { "name": "registered_at", "type": "TEXT(20)", "form": "date-time-local" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["event_ticket_no"],
                "referencedTable": "Event_Tickets",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["user_subscription_no"],
                "referencedTable": "User_Subscriptions",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "SET NULL",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "rsvp_status IN ('Yes','No','Maybe')",
                "columns": ["rsvp_status"],
                "options": ["Yes", "No", "Maybe"]
            },
            {
                "type": "check",
                "expression": "discount_percentage >= 0",
                "columns": ["discount_percentage"]
            }
        ]
    },
    {
        "tableName": "Subscription_Event_Discounts",
        "group": "marketing",
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_subscription_no", "type": "INTEGER", "form": "search", "filter": "active_status" },
            { "name": "event_ticket_no", "type": "INTEGER", "form": "search", "filter": "ticket_name" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_subscription_no"],
                "referencedTable": "User_Subscriptions",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["event_ticket_no"],
                "referencedTable": "Event_Tickets",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },

    {
        tableName: "Blogs",
        group: "marketing",
        image: true , 
        crud: {
            create: [ "Technical_Sales" ],
            read: ["*"],
            update: [ "Technical_Sales" ],
            delete: [ "Technical_Sales" ]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "title", type: "TEXT(225)" },
            { name: "intro", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true },
            { name: "content", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true },
        ]
    },

    {
        tableName: "Media_Publications",
        group: "marketing",
        image: true,
        gallery:true,
        crud: {
            create: [ "Technical_Sales" ],
            read: ["*"],
            update: [ "Technical_Sales" ],
            delete: [ "Technical_Sales" ]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "title", type: "TEXT(225)" },
            { name: "subtile", type: "TEXT(225)" },
            { name: "subtile_size", type: "REAL", form: "number", min: "11px" }, 
            { name: "intro", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true },
            { name: "content", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true },
            { name: "youtube", type: "TEXT(255)" , form: "textrea" },
        ]
    },
    {
        tableName: "Promotions",
        group: "marketing",
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "discount_name", type: "TEXT(255)" },
            { name: "_type", type: "TEXT(255)", form: "select", check: true },
            { name: "discount_amount", type: "DECIMAL(10, 2)", form: "number", min: "0", max: "100" },
            { name: "start_date", type: "TEXT(255)", form: "datetime-local" },
            { name: "end_date", type: "TEXT(255)", form: "datetime-local" },
            { name: "_status", type: "TEXT(255)", form: "select", check: true },
        ],
        constraints: [
            {
                type: "check",
                expression: "_type IN ('Basic', 'Special')",
                columns: ["_type"],
                options: ["Basic", "Special"]
            },
            {
                type: "check",
                expression: "_status IN ('Private', 'Public')",
                columns: ["_status"],
                options: ['Private', 'Public']
            }
        ]
    },
    {
        tableName: "Promotion_Items",
        group: "marketing",
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "discount_no", type: "INTEGER", form: "search", filter: "discount_name" },
            { name: "product_no", type: "INTEGER", form: "search", filter: "product_name" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["discount_no"],
                referencedTable: "Promotions",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["product_no"],
                referencedTable: "Products",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        tableName: "Careers",
        group: "marketing",

        crud: {
            create: ["Human_Resource"],
            read: ["*"],
            update: ["Human_Resource"],
            delete: ["Human_Resource"]
        },

        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "usertype", type: "TEXT(255)", nullable: false, default: "Customer", form: "select", check: true },
            { name: "title", type: "TEXT(255)", nullable: false },
            { name: "description", type: "TEXT(5000)", form: "doc", nullable: false, view: true, atob: true, btoa: true },
            { name: "department", type: "TEXT(255)", nullable: false },
            { name: "type", type: "TEXT(255)", form: "select", check: true },
            { name: "badge", type: "TEXT(255)", form: "select", check: true },
            { name: "location", type: "TEXT(255)", form: "textarea" },
            { name: "salary_min", type: "REAL(53)", form: "number" },
            { name: "salary_max", type: "REAL(53)", form: "number" },
            { name: "currency", type: "INTEGER", form: "search", filter: "name"  },
            { name: "salary_display", type: "TEXT(255)" },
            { name: "deadline", type: "TEXT(255)", form: "datetime-local" },
            { name: "experience", type: "TEXT(255)", form: "select", check: true },
            { name: "responsibilities", type: "TEXT(5000)", form: "tagify", tag: "list" },
            { name: "skills", type: "TEXT(5000)", form: "tagify", tag: "list" },
            { name: "tags", type: "TEXT(5000)", form: "tagify", tag: "array" },
            { name: "qualification", type: "TEXT(255)" },
            { name: "application_link", type: "TEXT(500)" },
            { name: "thumbnail", type: "TEXT(500)" },
            { name: "featured", type: "BOOLEAN", default: false },
            { name: "status", type: "TEXT(255)", form: "select", check: true },
            { name: "published_date", type: "TEXT(255)", form: "datetime-local" }
        ],

        constraints: [
            { type: "unique", columns: ["title"] },

            { type: "check", expression: "salary_min IS NULL OR salary_min>=0", columns: ["salary_min"] },
            { type: "check", expression: "salary_max IS NULL OR salary_max>=0", columns: ["salary_max"] },
            { type: "check", expression: "type IN ('Full-time','Part-time','Contract','Internship','Remote')", columns: ["type"], options: ["Full-time", "Part-time", "Contract", "Internship", "Remote"] },
            { type: "check", expression: "badge IN ('green','blue','yellow','red','purple','gray')", columns: ["badge"], options: ["green", "blue", "yellow", "red", "purple", "gray"] },
            { type: "check", expression: "experience IN ('Entry Level','Mid Level','Senior Level','Executive')", columns: ["experience"], options: ["Entry Level", "Mid Level", "Senior Level", "Executive"] },
            { type: "check", expression: "status IN ('Open','Closed','Paused','Draft')", columns: ["status"], options: ["Open", "Closed", "Paused", "Draft"] },
            {
                type: "foreignKey",
                columns: ["currency"],
                referencedTable: "Currencies",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }, 
            {
                type: "check",
                expression: "usertype IN ('Managing_Director','IT_Manager','Technical_Sales','Technical_Solutions', 'Consulting_Physician' ,'Fitness_Instructor','Consulting_Professional', 'Nutritionist' ,'Admin','Human_Resource','Corporate_Client','Corporate_Customer','Customer' , 'Institution' , 'Guardian' , 'Learner')",
                columns: ["usertype"],
                options: ['Managing_Director', 'IT_Manager', 'Technical_Sales', 'Technical_Solutions', 'Consulting_Physician', 'Fitness_Instructor', 'Consulting_Professional', 'Nutritionist', 'Admin', 'Human_Resource', 'Corporate_Client', 'Corporate_Customer', 'Customer', 'Institution', 'Guardian', 'Learner']
            }
        ]
    },
    {
        tableName: "Career_Applications",
        image: true,
        gallery:true,
        group: "marketing",

        crud: {
            create: ["*"],
            read: ["*"],
            update: ["Human_Resource", "Admin"],
            delete: ["Human_Resource", "Admin"]
        },

        columns: [

            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "user", type: "INTEGER", form: "search", filter: "email" },
            { name: "career", type: "INTEGER", form: "search", filter: "title" }, 
            { name: "cover_letter", type: "TEXT(5000)", form: "doc", atob: true, btoa: true, view: true }, 
            { name: "status", type: "TEXT(255)", form: "select", check: true, default: "Pending" }, 
            { name: "created_at", type: "TEXT(255)", form: "datetime-local" }

        ],

        constraints: [

            {
                type: "foreignKey",
                columns: ["user"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },

            {
                type: "foreignKey",
                columns: ["career"],
                referencedTable: "Careers",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },

            {
                type: "check",
                expression: "status IN ('Pending','Reviewing','Accepted','Rejected')",
                columns: ["status"],
                options: ["Pending", "Reviewing", "Accepted", "Rejected"]
            }

        ]
    },
    {
        tableName: "Job_Applications",
        group: "marketing",
        crud: {
            create: ["Human_Resource"],
            read: ["*"],
            update: ["Human_Resource"],
            delete: ["Human_Resource"]
        },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "title", type: "TEXT(255)", nullable: false },
            { name: "description", type: "TEXT(255)", form: "doc", nullable: false, view: true, atob:true , btoa:true },
            { name: "deadline", type: "TEXT(255)", form: "datetime-local" },
            //
            { name: "date", type: "TEXT(255)", form: "datetime-local" },
            { name: "location", type: "TEXT(255)" , form:"textarea" },
            { name: "type", type: "TEXT(255)", form: "select", check: true },
            { name: "experience", type: "TEXT(255)", form: "select", check: true },
            { name: "salary", type: "REAL(53)", form: "number", check: true },
            { name: "department", type: "INTEGER", form: "search", filter: "department_name" },
            { name: "status", type: "TEXT(255)", form: "select", check: true },
            { name: "tags", type: "TEXT(255)" , form:"tagify" , tag: "array" },
            { name: "responsibilities", type: "TEXT(255)", form: "tagify" , tag: "list" },
            { name: "skills", type: "TEXT(255)", form: "tagify", tag: "list" },
            { name: "company", type: "INTEGER", form: "search", filter: "company_name" }, 
            { name: "qualification", type: "TEXT(255)" },
            { name: "application", type: "TEXT(255)" }
            // 
        ],
        constraints: [ 
            {
                type: "unique",
                columns: ["title"]
            }, 
            {
                type: "check",
                expression: "salary IS NULL OR salary >= 0",
                columns: ["salary"]
            }, 
            {
                type: "check",
                expression: "status IN ('Open', 'Closed', 'Paused', 'Draft')",
                columns: ["status"],
                options: ['Open', 'Closed', 'Paused', 'Draft']
            }, 
            {
                type: "check",
                expression: "type IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote')",
                columns: ["type"],
                options: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
            }, 
            {
                type: "check",
                expression: "experience IN ('Entry Level', 'Mid Level', 'Senior Level', 'Executive')",
                columns: ["experience"],
                options: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
            },   
            {
                type: "foreignKey",
                columns: ["department"],
                referencedTable: "Employee_Departments",
                referencedColumns: ["idx"],
                OnDeleteAction: "SET NULL",  
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["company"],
                referencedTable: "Company",
                referencedColumns: ["idx"],
                OnDeleteAction: "SET NULL",
                OnUpdateAction: "CASCADE"
            },
        ],
        reports: [
            {
                name: "Application Review",
                type: "/reports/tyg/job-applications/application-review",
                actions: {
                    create: [],
                    read: ["Job_Applications", "Users"],
                    update: ["Job_Applications"],
                    delete: []
                }
            }
        ]
    },
    {
        tableName: "Job_Application_Responses",
        group: "marketing",
        crud: {
            create: [ "Customer", "Corporate_Customer" ],
            read: [ "Human_Resource" ],
            update: [ "Human_Resource" ],
            delete: [ "Human_Resource" ]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "application_title", type: "INTEGER", form: "search" , filter: "title" },
            { name: "applicant", type: "INTEGER", form:"search", filter: "email" },
            { name: "status", type: "TEXT(255)" , form:"select" , check:true  }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["application_title"],
                referencedTable: "Job_Applications",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["applicant"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "check",
                expression: "status IN ('Accepted', 'Rejected' , 'Under Review')",
                columns: ["status"],
                options: ['Accepted', 'Rejected', 'Under Review']
            }
        ] 
    }, 
    {
        tableName: "Affiliate_Applications",
        group: "marketing",
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },

            { name: "affiliation_reason", type: "TEXT(255)", nullable: false },
            { name: "first_name", type: "TEXT(255)", nullable: false },
            { name: "last_name", type: "TEXT(255)", nullable: false },
            { name: "company_name", type: "TEXT(255)", nullable: false },
            { name: "usertype", type: "TEXT(255)", form: "select", check:true },

            { name: "email", type: "TEXT(255)", nullable: false },
            { name: "website", type: "TEXT(255)", nullable: false },
            { name: "phone_number", type: "TEXT(255)" } , 
            { name: "message", type: "TEXT(3000)" , form: "textarea" } , 
        ],
        constraints: [ 
            {
                type: "check",
                expression: "usertype IN ('Individual', 'Company')",
                columns: ["usertype"],
                options: ['Individual', 'Company']
            },
        ]
    },

    {
        tableName: "Affiliate_Application_Responses",
        group: "marketing",
        crud: {
            create: ["Customer", "Corporate_Customer"],
            read: ["Human_Resource"],
            update: ["Human_Resource"],
            delete: ["Human_Resource"]
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "affiliation_reason", type: "INTEGER", form: "search", filter: "affiliation_reason" },
            { name: "applicant", type: "INTEGER", form: "search", filter: "email" },
            { name: "status", type: "TEXT(255)", form: "select", check: true }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["affiliation_reason"],
                referencedTable: "Affiliate_Applications",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["applicant"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "check",
                expression: "status IN ('Accepted', 'Rejected' , 'Under Review')",
                columns: ["status"],
                options: ['Accepted', 'Rejected', 'Under Review']
            }
        ]
    },
    //------------ analytics
    {
        "tableName": "Favourites",
        "group": "analytics",
        "crud": {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "professional_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "product_no", "type": "INTEGER", "form": "search", "filter": "product_name", "nullable": true },
            { "name": "programme_no", "type": "INTEGER", "form": "search", "filter": "programme_name", "nullable": true },
            { "name": "subscription_no", "type": "INTEGER", "form": "search", "filter": "subscription_name", "nullable": true },
            { "name": "event_no", "type": "INTEGER", "form": "search", "filter": "title", "nullable": true },
            { "name": "blog_no", "type": "INTEGER", "form": "search", "filter": "title", "nullable": true }
        ],
        "constraints": [
            { "type": "foreignKey", "columns": ["user_no"], "referencedTable": "Users", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["professional_no"], "referencedTable": "Users", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["product_no"], "referencedTable": "Products", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["programme_no"], "referencedTable": "Programmes", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["subscription_no"], "referencedTable": "Subscriptions", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["event_no"], "referencedTable": "Events", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["blog_no"], "referencedTable": "Blogs", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "check", "expression": "(professional_no IS NOT NULL OR product_no IS NOT NULL OR subscription_no IS NOT NULL OR event_no IS NOT NULL OR blog_no IS NOT NULL OR programme_no IS NOT NULL)", "columns": ["product_no", "subscription_no", "event_no", "blog_no", "programme_no"] }
        ]
    },
    {
        "tableName": "Ratings",
        "group": "analytics",
        "crud": { "create": ["*"], "read": ["*"], "update": ["*"], "delete": ["*"], "own": true, "ownField": "user_no", "publicRead": ["*"] },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "professional_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "rating", "type": "INTEGER", "form": "select", "check": true },
            { "name": "product_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "product_name" },
            { "name": "event_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "title" },
            { "name": "blog_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "title" }
        ],
        "constraints": [
            { "type": "foreignKey", "columns": ["user_no"], "referencedTable": "Users", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["professional_no"], "referencedTable": "Users", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["product_no"], "referencedTable": "Products", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["event_no"], "referencedTable": "Events", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["blog_no"], "referencedTable": "Blogs", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "unique", "columns": ["professional_no" , "user_no", "product_no", "event_no", "blog_no"] },
            { "type": "check", "expression": "(professional_no IS NOT NULL OR product_no IS NOT NULL OR event_no IS NOT NULL OR blog_no IS NOT NULL)", "columns": ["product_no", "event_no", "blog_no"] },
            { "type": "check", "expression": "rating IN ('1','2','3','4','5')", "columns": ["rating"], "options": ["1", "2", "3", "4", "5"] }
        ]
    },
    {
        "tableName": "Reviews",
        "group": "analytics",
        "crud": {
            "create": ["*"],
            "read": ["*"],
            "update": ["*"],
            "delete": ["*"],
            "own": true,
            "ownField": "user_no",
            "publicRead": ["*"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "professional_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "review", "type": "TEXT(255)" },
            { "name": "review_status", "type": "TEXT(100)", "form": "select", "check": true },
            { "name": "response", "type": "TEXT(255)" },
            { "name": "notification_status", "type": "TEXT(100)", "form": "select", "check": true },
            { "name": "product_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "product_name" },
            { "name": "event_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "title" },
            { "name": "blog_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "title" },
            { "name": "parent_review_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "review" }
        ],
        "constraints": [
            { "type": "foreignKey", "columns": ["user_no"], "referencedTable": "Users", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["professional_no"], "referencedTable": "Users", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["product_no"], "referencedTable": "Products", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["event_no"], "referencedTable": "Events", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["blog_no"], "referencedTable": "Blogs", "referencedColumns": ["idx"], "OnDeleteAction": "CASCADE", "OnUpdateAction": "CASCADE" },
            { "type": "foreignKey", "columns": ["parent_review_no"], "referencedTable": "Reviews", "referencedColumns": ["idx"], "OnDeleteAction": "SET NULL", "OnUpdateAction": "CASCADE" },
            { "type": "unique", "columns": ["professional_no" , "user_no", "product_no", "event_no", "blog_no", "review"] },
            { "type": "check", "expression": "(professional_no IS NOT NULL OR product_no IS NOT NULL OR event_no IS NOT NULL OR blog_no IS NOT NULL)", "columns": ["product_no", "event_no", "blog_no"] },
            { "type": "check", "expression": "review_status IN ('Pending','Approved','Rejected')", "columns": ["review_status"], "options": ["Pending", "Approved", "Rejected"] },
            { "type": "check", "expression": "notification_status IN ('Pending','Seen')", "columns": ["notification_status"], "options": ["Pending", "Seen"] }
        ]
    },
    {
        "tableName": "Review_Reactions",
        "group": "analytics",
        "crud": {
            "create": ["*"],
            "read": ["*"],
            "update": ["*"],
            "delete": ["*"],
            "own": true,
            "ownField": "user_no"
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "review_no", "type": "INTEGER", "form": "search", "filter": "review" },
            { "name": "reaction_type", "type": "TEXT(50)", "form": "select", "check": true }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["review_no"],
                "referencedTable": "Reviews",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "reaction_type IN ('Like','Love','Haha','Wow','Sad','Angry')",
                "columns": ["reaction_type"],
                "options": ["Like", "Love", "Haha", "Wow", "Sad", "Angry"]
            },
            {
                "type": "unique",
                "columns": ["user_no", "review_no"]
            }
        ]
    },
    //------------ Human_Resource
    {
        "tableName": "Employee_Departments",
        group: "hr",
        "crud": {
            "create": ["Admin"],
            "read": ["Admin"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "department_name", type: "TEXT(15)" },
            { name: "description", type: "TEXT(255)", form: "doc", view: true, atob: true, btoa: true },
            { name: "supervisor", type: "INTEGER", form: "search", filter: "firstname" },
        ],
        "constraints": [
            {
                type: "foreignKey",
                columns: ["supervisor"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
        ],
        apps: [
            {
                name: "Department Directory",
                type: "/apps/tyg/employee-departments/department-directory",
                actions: {
                    create: [],
                    read: ["Employee_Departments"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Org Chart",
                type: "/apps/tyg/employee-departments/org-chart",
                actions: {
                    create: [],
                    read: ["Employee_Departments", "Employees", "Users"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Supervisor Dashboard",
                type: "/apps/tyg/employee-departments/supervisor-dashboard",
                actions: {
                    create: [],
                    read: ["Employee_Departments", "Employees" , "Users"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Department Knowledgebase",
                type: "/apps/tyg/employee-departments/department-knowledgebase",
                actions: {
                    create: [],
                    read: ["Employee_Departments"],
                    update: [],
                    delete: []
                }
            }
        ] ,
        reports: [
            {
                name: "Departments with Supervisors",
                type: "/reports/tyg/employee-departments/departments-with-supervisors",
                actions: {
                    create: [],
                    read: ["Employee_Departments"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Employees per Department",
                type: "/reports/tyg/employee-departments/employees-per-department",
                actions: {
                    create: [],
                    read: ["Employee_Departments", "Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Departments Without Supervisors",
                type: "/reports/tyg/employee-departments/departments-without-supervisors",
                actions: {
                    create: [],
                    read: ["Employee_Departments"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Employee Distribution",
                type: "/reports/tyg/employee-departments/employee-distribution",
                actions: {
                    create: [],
                    read: ["Employee_Departments", "Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Supervisor Workload",
                type: "/reports/tyg/employee-departments/supervisor-workload",
                actions: {
                    create: [],
                    read: ["Employee_Departments"],
                    update: [],
                    delete: []
                }
            }
        ]
    },
    {
        "tableName": "Employee_Titles",
        "group": "hr",
        "crud": {
            "create": ["Admin"],
            "read": ["*"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "title_name", "type": "TEXT(100)", "nullable": false }
        ],
        "constraints": [
            {
                "type": "unique",
                "columns": ["title_name"]
            }
        ]
    },
    {
        "tableName": "Employees",
        group: "hr",
        "crud": {
            "create": ["Admin"],
            "read": ["Admin"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { "name": "title", "type": "INTEGER", "form": "search", "filter": "title_name" },
            { name: "employee_name", type: "INTEGER", form: "search", filter: "firstname" },
            { name: "company", type: "INTEGER", form: "search", filter: "company_name" },
            { name: "department_name", type: "INTEGER", form: "search", filter: "department_name" },
            { name: "employment_type", type: "TEXT(255)", form: "select", check: true },
            { name: "time_sheet_name", type: "TEXT(225)" },
            { name: "termination_date", type: "TEXT(255)", form: "datetime-local" },
            { name: "status", type: "TEXT(255)", form: "select", check: true },
            { name: "rating_type", type: "TEXT(255)", form: "select", check: true },
            { name: "rating_amount", type: "REAL", form: "number" }, 

            { "name": "start_working_hour", "type": "TEXT(5)", "form": "time", "default": "08:00", "nullable": false },
            { "name": "end_working_hour", "type": "TEXT(5)", "form": "time", "default": "17:00", "nullable": false },

        ],
        apps: [ 
            {
                name: "Employee Directory",
                type: "/apps/tyg/employees/employee-directory",
                actions: {
                    create: [],
                    read: ["Employees", "Employee_Departments"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "HR Dashboard",
                type: "/apps/tyg/employees/hr-dashboard",
                actions: {
                    create: [],
                    read: ["Employees", "Employee_Departments"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Payroll Calculator",
                type: "/apps/tyg/employees/payroll-calculator",
                actions: {
                    create: [],
                    read: ["Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Employee Status Tracker",
                type: "/apps/tyg/employees/employee-status-tracker",
                actions: {
                    create: [],
                    read: ["Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Department View",
                type: "/apps/tyg/employees/department-view",
                actions: {
                    create: [],
                    read: ["Employees", "Employee_Departments"],
                    update: [],
                    delete: []
                }
            }
        ],
        reports: [
            {
                name: "Headcount per Department",
                type: "/reports/tyg/employees/headcount-per-department",
                actions: {
                    create: [],
                    read: ["Employees", "Employee_Departments"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Employment Type Breakdown",
                type: "/reports/tyg/employees/employment-type-breakdown",
                actions: {
                    create: [],
                    read: ["Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Employee Status Distribution",
                type: "/reports/tyg/employees/employee-status-distribution",
                actions: {
                    create: [],
                    read: ["Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Average Pay by Department",
                type: "/reports/tyg/employees/average-pay-by-department",
                actions: {
                    create: [],
                    read: ["Employees", "Employee_Departments"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Payroll Projection",
                type: "/reports/tyg/employees/payroll-projection",
                actions: {
                    create: [],
                    read: ["Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Resignations Over Time",
                type: "/reports/tyg/employees/resignations-over-time",
                actions: {
                    create: [],
                    read: ["Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Turnover Rate per Department",
                type: "/reports/tyg/employees/turnover-rate-per-department",
                actions: {
                    create: [],
                    read: ["Employees", "Employee_Departments"],
                    update: [],
                    delete: []
                }
            }
        ], 
        "constraints": [
            {
                type: "foreignKey",
                columns: ["employee_name"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["company"],
                referencedTable: "Company",
                referencedColumns: ["idx"],
                OnDeleteAction: "SET NULL",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["department_name"],
                referencedTable: "Employee_Departments",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "check",
                expression: "employment_type IN ('Full-time', 'Part-time', 'Contractor')",
                columns: ["employment_type"],
                options: ['Full-time', 'Part-time', 'Contractor']
            },
            {
                type: "check",
                expression: "status IN ('Active' , 'On Leave' , 'Resigned' , 'Terminated')",
                columns: ["status"],
                options: ['Active', 'On Leave', 'Resigned', 'Terminated']
            },
            {
                type: "check",
                expression: "rating_type IN ('Hourly' , 'Weekly' , 'Monthly')",
                columns: ["rating_type"],
                options: ['Hourly', 'Weekly', 'Monthly']
            },

        ]
    },
    //------------ accounting
    {
        "tableName": "Store_Details",
        group: "accounting",
        "crud": {
            "create": ["Admin"],
            "read": ["Admin"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "store_name", type: "TEXT(255)", nullable: false },
            { name: "company_registration_number", type: "TEXT(255)", nullable: false },
            { name: "physical_address", type: "TEXT(255)", nullable: false, form: "textarea" , view:true },
            { name: "latitude", type: "TEXT(255)"  },
            { name: "longitude", type: "TEXT(255)"  },
            { name: "email_address", type: "TEXT(255)", nullable: false, form: "email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" },
            { name: "whatsApp_number", type: "TEXT(255)", nullable: false, form: "tel", pattern: "^\+?\d{1,15}$|^\d{1,15}$|\+?\d{1,3}[-.\s]?\(?\d{1,5}?\)?[-.\s]?\d{1,9}$" },
            { name: "telephone_number", type: "TEXT(255)", nullable: false, form: "tel", pattern: "^\+?\d{1,15}$|^\d{1,15}$|\+?\d{1,3}[-.\s]?\(?\d{1,5}?\)?[-.\s]?\d{1,9}$" },
            { name: "VAT_number", type: "TEXT(255)", nullable: false },
            { name: "bank_name", type: "TEXT(255)", nullable: false },
            { name: "branch_code", type: "TEXT(255)", nullable: false },
            { name: "account_number", type: "TEXT(255)", nullable: false, pattern: "\d{8,20}" },
            { name: "account_holder", type: "TEXT(255)", nullable: false },
        ]
    },
    {
        "tableName": "Store_Operating_Hours",
        group: "data",
        "crud": {
            "create": ["Admin"],
            "read": ["Admin"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "store_name", type: "INTEGER", form: "search", filter: "store_name" },  
            { name: "open", type: "REAL", group: "hours" , form:"datetime-local" },
            { name: "close", type: "REAL", group: "hours" , form:"datetime-local" },
         ],
        "groups": [
            { name: "hours", title: "Operating Hours", multiple: true }
        ],
        "constraints": [
            {
                type: "foreignKey",
                columns: ["store_name"],
                referencedTable: "Store_Details",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            } 
        ]
    },
    {
        "tableName": "Client_Details",
        group: "accounting",
        "crud": {
            "create": ["Admin"],
            "read": ["Admin"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "email_address", type: "INTEGER", nullable: false, form: "search", filter: "email" },
            { name: "physical_address", type: "TEXT(255)" , form:"textarea" },
            { name: "VAT_number", type: "TEXT(255)" },
            { name: "tax_or_company_registration_number", type: "TEXT(255)", nullable: false }
        ],
        constraints: [
            {
                type: "unique",
                columns: ["email_address"]
            },
            {
                type: "foreignKey",
                columns: ["email_address"],
                referencedTable: "Users",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        "tableName": "Tax_Invoice",
        group: "accounting",
        "crud": {
            "create": ["Admin"],
            "read": ["Admin"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "order_or_invoice_number", type: "TEXT(15)" },
            { name: "invoice_date", type: "TEXT(255)", form: "datetime-local" },
            { name: "store_name", type: "INTEGER", form: "search", filter: "store_name" },
            { name: "client_name", type: "INTEGER", form: "search", filter: "email_address" },
            { name: "product_name", type: "INTEGER", group: "product", form: "search", filter: "product_name" },
            { name: "is_vip_member", type: "TEXT(255)", group: "product", form: "select", check: true },
            { name: "custom_discount", type: "REAL", group: "product" },
            { name: "delivery_fee", type: "REAL", table: false },
            { name: "assembly_fee", type: "REAL", table: false }
        ],
        "reports": [
            {
                name: "Tax Invoice",
                type: "/reports/tyg/accounting/tax-invoice",
                actions: {
                    create: [],
                    read: ["Tax_Invoice", "Store_Details", "Client_Details", "Products"],
                    update: [],
                    delete: []
                }
            }
        ],
        "groups": [
            { name: "product", title: "Products Information", multiple: true }
        ],
        "constraints": [
            {
                type: "foreignKey",
                columns: ["store_name"],
                referencedTable: "Store_Details",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["client_name"],
                referencedTable: "Client_Details",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["product_name"],
                referencedTable: "Products",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },  
            {
                type: "check",
                expression: "is_vip_member IN ('10%', '20%' , 'Custom', 'No')",
                columns: ["is_vip_member"],
                options: ['10%', '20%', 'Custom', 'No']
            },
            {
                type: "default",
                expression: "No",
                column: "is_vip_member"
            },
            {
                type: "default",
                expression: "0",
                column: "custom_discount"
            },
            {
                type: "default",
                expression: 0,
                column: "delivery_fee"
            },
            {
                type: "default",
                expression: 0,
                column: "assembly_fee"
            },

        ]
    },
    {
        "tableName": "Employee_Time_Sheet",
        group: "accounting",
        apps: [ 
            {
                name: "Payroll",
                type: "/apps/tyg/employee-time-sheet/payroll",
                actions: {
                    create: [],
                    read: ["Employee_Time_Sheet", "Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Pay Slips",
                type: "/apps/tyg/employee-time-sheet/payslips",
                actions: {
                    create: [],
                    read: ["Employee_Time_Sheet", "Employees"],
                    update: [],
                    delete: []
                }
            }
        ],
        "crud": {
            "create": ["Admin"],
            "read": ["Admin"],
            "update": ["Admin"],
            "delete": ["Admin"]
        },
        "columns": [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "employee_name", type: "INTEGER", form: "search", filter: "time_sheet_name" }, 
            { name: "month_start", type: "TEXT(255)", form: "date" },
            { name: "month_end", type: "TEXT(255)", form: "date" },

            { name: "shift_start", type: "TEXT(255)", form: "time" , group:"log" }, 
            { name: "lunch_start", type: "TEXT(255)", form: "time" , group:"log" }, 
            { name: "lunch_end", type: "TEXT(255)", form: "time" , group:"log" }, 
            { name: "shift_end", type: "TEXT(255)", form: "time" , group:"log" }, 
            { name: "overtime_start", type: "TEXT(255)", form: "time" , group:"log" }, 
            { name: "overtime_end", type: "TEXT(255)", form: "time" , group:"log" }, 

        ],
        groups: [
            { name: "log", title: "Timesheet Logs", multiple: false }, 
        ],
        "constraints": [
            {
                type: "foreignKey",
                columns: ["employee_name"],
                referencedTable: "Employees",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },  
        ],
        reports: [
            {
                name: "Weekly Time Sheet",
                type: "/reports/tyg/employee-time-sheet/weekly-time-sheet",
                actions: {
                    create: [],
                    read: ["Employee_Time_Sheet", "Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Monthly Sheet",
                type: "/reports/tyg/employee-time-sheet/monthly-sheet",
                actions: {
                    create: [],
                    read: ["Employee_Time_Sheet", "Employees"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "PaySlip",
                type: "/reports/tyg/employee-time-sheet/payslip",
                actions: {
                    create: [],
                    read: ["Employee_Time_Sheet", "Employees"],
                    update: [],
                    delete: []
                }
            }
        ]
    },
    //------------ payments  
    {
        "tableName": "Product_Cart",
        "group": "payments",
        "crud": {
            "create": ["Customer", "Corporate_Customer"],
            "read": user_inherits.map(u => u.user),
            "update": ["Customer", "Corporate_Customer"],
            "delete": ["Customer", "Corporate_Customer"],
            "own": true,
            "ownField": "user_no"
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "checkout_status", "type": "TEXT(255)", "form": "select", "check": true },
            { "name": "checkout_key", "type": "TEXT(255)", "view": true, "readonly": true },
            { "name": "product_no", "type": "INTEGER", "form": "search", "filter": "product_name", "nullable": true },
            { "name": "subscription_no", "type": "INTEGER", "form": "search", "filter": "subscription_name", "nullable": true },
            { "name": "event_ticket_no", "type": "INTEGER", "form": "search", "filter": "ticket_name", "nullable": true },

            { name: "dimension", type: "INTEGER", filter: "name", form: "search", nullable: true },
            { name: "color", type: "INTEGER", filter: "name", form: "search", nullable: true },
            { name: "material", type: "INTEGER", filter: "name", form: "search", nullable: true },

            { "name": "quantity", "type": "INTEGER", "form": "number", "min": "1", "default": 1 }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["product_no"],
                "referencedTable": "Products",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["subscription_no"],
                "referencedTable": "Subscriptions",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["event_ticket_no"],
                "referencedTable": "Event_Tickets",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "checkout_status IN ('Shopping', 'Paid')",
                "columns": ["checkout_status"],
                "options": ["Shopping", "Paid"]
            },
            {
                "type": "check",
                "expression": "(product_no IS NOT NULL OR subscription_no IS NOT NULL OR event_ticket_no IS NOT NULL)",
                "columns": ["product_no", "subscription_no", "event_ticket_no"]
            },
            {
                type: "foreignKey",
                columns: ["dimension"],
                referencedTable: "Dimensions",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["color"],
                referencedTable: "Colors",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["material"],
                referencedTable: "Materials",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        "tableName": "User_Payments",
        "group": "payments",
        "crud": {
            "create": ["*"],
            "read": ["*"],
            "update": ["*"],
            "delete": ["*"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" }, 
            { "name": "method", "type": "TEXT(255)" },
            { "name": "card_number", "type": "TEXT(255)" },
            { "name": "expiration_month", "type": "TEXT(255)" },
            { "name": "expiration_year", "type": "TEXT(255)" },
            { "name": "CCV", "type": "TEXT(255)" },
            { "name": "bank_name", "type": "TEXT(255)" },
            { "name": "account_number", "type": "TEXT(255)" },
            { "name": "branch_code", "type": "TEXT(255)" },
            { "name": "reference", "type": "TEXT(255)" },
            { "name": "checkout_id", "type": "TEXT(255)", "view": true, "readonly": true },
            { "name": "checkout_key", "type": "TEXT(255)", "view": true, "readonly": true },
            { "name": "checkout_status", "type": "TEXT(255)", "form": "select", "check": true },
            { "name": "checkout_date", "type": "TEXT(255)", "form": "datetime-local", "readonly": true },
            { "name": "product_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "product_name" },
            { "name": "subscription_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "subscription_name" },
            { "name": "event_ticket_no", "type": "INTEGER", "nullable": true, "form": "search", "filter": "ticket_name" },

            { name: "dimension", type: "INTEGER", filter: "name", form: "search", nullable: true },
            { name: "color", type: "INTEGER", filter: "name", form: "search", nullable: true },
            { name: "material", type: "INTEGER", filter: "name", form: "search", nullable: true },

            { "name": "quantity", "type": "INTEGER", "min": 1, "default": 1 },
            { "name": "price", "type": "REAL", "min": 0 }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }, 
            {
                "type": "foreignKey",
                "columns": ["product_no"],
                "referencedTable": "Products",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["subscription_no"],
                "referencedTable": "Subscriptions",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["event_ticket_no"],
                "referencedTable": "Event_Tickets",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "(product_no IS NOT NULL OR subscription_no IS NOT NULL OR event_ticket_no IS NOT NULL)",
                "columns": ["product_no", "subscription_no", "event_ticket_no"]
            },
            {
                "type": "check",
                "expression": "method IN ('Credit Card', 'Debit Card', 'Bank Transfer')",
                "columns": ["method"]
            },
            {
                "type": "check",
                "expression": "checkout_status IN ('pending', 'cancelled', 'failed', 'completed')",
                "columns": ["checkout_status"],
                "options": ['pending', 'cancelled', 'failed', 'completed']
            },
            {
                "type": "check",
                "expression": "quantity >= 1",
                "columns": ["quantity"]
            },
            {
                "type": "check",
                "expression": "price >= 0",
                "columns": ["price"]
            },
            {
                type: "foreignKey",
                columns: ["dimension"],
                referencedTable: "Dimensions",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["color"],
                referencedTable: "Colors",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                type: "foreignKey",
                columns: ["material"],
                referencedTable: "Materials",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        "tableName": "Checkout_Addresses",
        "group": "payments",
        "crud": {
            "create": ["*"],
            "read": ["*"],
            "update": ["*"],
            "delete": ["*"],
            "own": true,
            "ownField": "user_no"
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "user_no", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "address", "type": "TEXT(255)", "nullable": false },

            { "name": "country", "type": "INTEGER", "form": "search", "filter": "name", "nullable": false },
            { "name": "province", "type": "INTEGER", "form": "search", "filter": "name", "nullable": false },
            { "name": "city", "type": "INTEGER", "form": "search", "filter": "name", "nullable": false },

            { "name": "apartment", "type": "TEXT(255)" },
            { "name": "postal_code", "type": "TEXT(20)" },
            { "name": "phone_number", "type": "TEXT(50)" },
            { "name": "locked", "type": "TEXT(10)", form:"select" , "check": true, "default": "No" },
            { "name": "checkout_key", "type": "TEXT(255)", "view": true, "readonly": true }
        ],
        "constraints": [
            {
                "type": "check",
                "expression": "locked IN ('Yes', 'No')",
                "columns": ["locked"],
                "options": ["Yes", "No"]
            },

            {
                "type": "foreignKey",
                "columns": ["user_no"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },

            {
                "type": "foreignKey",
                "columns": ["country"],
                "referencedTable": "Countries",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },

            {
                "type": "foreignKey",
                "columns": ["province"],
                "referencedTable": "States_Or_Provinces",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },

            {
                "type": "foreignKey",
                "columns": ["city"],
                "referencedTable": "Cities",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },
    //------------ iot
    {
        tableName: "Nayax_Developer",
        group: "iot",
        crud: {
            create: [ "Technical_Sales", "Technical_Solutions" ],
            read: [ "Technical_Sales", "Technical_Solutions" ],
            update: [ "Technical_Sales", "Technical_Solutions" ],
            delete: [ "Technical_Sales", "Technical_Solutions" ],
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "client_id", type: "TEXT(255)", form: "textarea" },
            { name: "client_secret", type: "TEXT(255)", form: "textarea" },
            { name: "bearer_token", type: "TEXT(255)", form: "textarea" },
            { name: "additional_info", type: "TEXT(255)", form:"doc", view:true , atob: false, btoa: false }, 
        ],
        apps: [
            {
                name: "Data Synchronization",
                type: "/apps/tyg/nayax-developer/data-sync",
                actions: {
                    create: [],
                    read: ["Nayax_Developer"],
                    update: [],
                    delete: []
                }
            }
        ]
    },
    {
        "tableName": "Nayax_Machines",
        "group": "iot",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["Technical_Sales", "Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "machineId", "type": "TEXT(255)" },
            { "name": "operatorActorId", "type": "INTEGER" },
            { "name": "name", "type": "TEXT(255)" },
            { "name": "location", "type": "TEXT(255)" },
            { "name": "region", "type": "TEXT(255)" },
            { "name": "status", "type": "TEXT(255)" },
            { "name": "lastCommunication", "type": "TEXT(255)" },
            { "name": "errorCodes", "type": "TEXT(255)" },
            { "name": "batteryLevel", "type": "REAL" },
            { "name": "temperature", "type": "REAL" },
            { "name": "latitude", "type": "REAL" },
            { "name": "longitude", "type": "REAL" },
            { "name": "needsMaintenance", "type": "TEXT(225)" },
            { "name": "deviceType", "type": "TEXT(255)" },
            { "name": "firmwareVersion", "type": "TEXT(255)" }

        ],
        "constraints": [
            {
                "type": "unique",
                "columns": ["machineId"]
            }
        ],
        reports: [
            {
                "name": "Sales Per Machine",
                "type": "/reports/nayax/sales-per-machine",
                "actions": {
                    create: [],
                    read: ["Nayax_Machines", "Nayax_Sales"],
                    update: [],
                    delete: [],
                }
            }
        ]
    },
    {
        tableName: "Nayax_Users",
        group: "iot",
        crud: {
            create: [ "Technical_Sales", "Technical_Solutions" ],
            read: [ "Technical_Sales", "Technical_Solutions" ],
            update: [ "Technical_Sales", "Technical_Solutions" ],
            delete: [ "Technical_Sales", "Technical_Solutions" ],
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "userIdentifier", type: "TEXT(255)" },
            { name: "name", type: "TEXT(255)"  }, 
            { name: "email", type: "TEXT(255)"  }, 
            { name: "accountType", type: "TEXT(255)"  },
        ],
        constraints: [
            {
                type: "unique",
                columns: ["userIdentifier"]
            }
        ],
        reports: [
            {
                "name": "User Spending",
                "type": "/reports/nayax/user-spending",
                "actions": {
                    create: [],
                    read: ["Nayax_Users" , "Nayax_Sales"],
                    update: [],
                    delete: [],
                }
            }
        ]
    },
    {
        "tableName": "Nayax_Cards",
        "group": "iot",
        "crud" : {
            create: ["Technical_Sales", "Technical_Solutions"],
            read: ["Technical_Sales", "Technical_Solutions"],
            update: ["Technical_Sales", "Technical_Solutions"],
            delete: ["Technical_Sales", "Technical_Solutions"],
        },
        "columns": [
            { "name": "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { "name": "cardId", "type": "TEXT(255)" },
            { "name": "userIdentifier", "type": "TEXT(255)" },
            { "name": "balance", "type": "REAL" },
            { "name": "currency", "type": "TEXT(255)" },
            { "name": "totalSpent", "type": "REAL" },
            { "name": "lastTransaction", "type": "TEXT(255)" },
            { "name": "active", "type": "TEXT(225)" }
        ],
        "constraints": [
            {
                type: "unique",
                columns: ["cardId"]
            },
            {
                "type": "foreignKey",
                "columns": ["userIdentifier"],
                "referencedTable": "Nayax_Users",
                "referencedColumns": ["userIdentifier"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ],
        reports: [
            {
                "name": "Card Usage Over Time",
                "type": "/reports/nayax/card-usage-over-time",
                "actions": {
                    create: [],
                    read: ["Nayax_Cards", "Nayax_Sales"],
                    update: [],
                    delete: [],
                }
            }
        ]
    },
    {
        tableName: "Nayax_Products",
        group: "iot",
        crud: {
            create: [ "Technical_Sales", "Technical_Solutions" ],
            read: [ "Technical_Sales", "Technical_Solutions" ],
            update: [ "Technical_Sales", "Technical_Solutions" ],
            delete: [ "Technical_Sales", "Technical_Solutions" ],
        },
        columns: [
            { name: "idx", type: "INTEGER", "identity": { "seed": 1, "increment": 1 }, primaryKey: true, nullable: false },
            { name: "productId", type: "TEXT(255)" },
            { name: "name", type: "TEXT(255)"  }, 
            { name: "price", type: "TEXT(255)"  }, 
            { name: "category", type: "TEXT(255)"  },
        ],
        constraints: [
            {
                type: "unique",
                columns: ["productId"]
            }
        ],

        "apps": [
            {
                "name": "Best-selling Products",
                "type": "/apps/nayax/best-selling-products",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales", "Nayax_Products"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Daily/Weekly/Monthly Sales Trends",
                "type": "/apps/nayax/sales-trends",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales", "Nayax_Products"],
                    update: [],
                    delete: []
                }
            }
        ]
    }, 
    {
        tableName: "Nayax_Inventory",
        group: "iot",
        crud: {
            create: ["Technical_Sales", "Technical_Solutions"],
            read: ["Technical_Sales", "Technical_Solutions"],
            update: ["Technical_Sales", "Technical_Solutions"],
            delete: ["Technical_Sales", "Technical_Solutions"],
        },
        columns: [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "machineId", "type": "TEXT(255)" },
            { "name": "productId", "type": "TEXT(255)" },
            { "name": "productName", "type": "TEXT(255)" },
            { "name": "category", "type": "TEXT(255)" },
            { "name": "quantity", "type": "INTEGER" },
            { "name": "price", "type": "REAL" },
            { "name": "lastUpdated", "type": "TEXT(255)" }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["productId"],
                referencedTable: "Nayax_Products",
                referencedColumns: ["productId"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }, 
            {
                type: "foreignKey",
                columns: ["machineId"],
                referencedTable: "Nayax_Machines",
                referencedColumns: ["machineId"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
        ]
    },
    {
        "tableName": "Nayax_Promotions",
        "group": "iot",
        "crud": {
            "create": ["Marketing", "Technical_Solutions"],
            "read": ["Marketing", "Technical_Sales", "Technical_Solutions"],
            "update": ["Marketing", "Technical_Solutions"],
            "delete": ["Marketing"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "promotionId", "type": "TEXT(255)" },
            { "name": "promotionName", "type": "TEXT(255)" },
            { "name": "startDate", "type": "TEXT(255)", "form": "datetime-local" },
            { "name": "endDate", "type": "TEXT(255)", "form": "datetime-local" },
            { "name": "discountPercent", "type": "REAL", "form": "number" },
            { "name": "status", "type": "TEXT(255)", "form": "select" },
            { "name": "description", "type": "TEXT(255)" }
        ]
    },
    {
        "tableName": "Nayax_Promotion_Items",
        "group": "iot",
        "crud": {
            "create": ["Marketing", "Technical_Solutions"],
            "read": ["Marketing", "Technical_Sales", "Technical_Solutions"],
            "update": ["Marketing", "Technical_Solutions"],
            "delete": ["Marketing"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "promotionId", "type": "INTEGER", "form": "search", "filter": "name" },
            { "name": "productId", "type": "INTEGER", "form": "search", "filter": "name" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["promotionId"],
                "referencedTable": "Nayax_Promotions",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["productId"],
                "referencedTable": "Nayax_Products",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },
    {
        "tableName": "Nayax_Sales",
        "group": "iot",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["Technical_Sales", "Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "saleDate", "type": "TEXT(255)" , form:"datetime-local" },
            { "name": "machineId", "type": "INTEGER" },
            { "name": "amount", "type": "REAL" },
            { "name": "currency", "type": "TEXT(255)" },
            { "name": "paymentMethod", "type": "TEXT(255)" },
            { "name": "qrType", "type": "TEXT(255)" },
            { "name": "transactionType", "type": "TEXT(255)" },
            { "name": "userIdentifier", "type": "INTEGER", "form": "search", "filter": "name" },
            { "name": "operatorId", "type": "TEXT(255)" },
            { "name": "cardMasked", "type": "TEXT(255)" },
            { "name": "productId", "type": "INTEGER", "form": "search", "filter": "name" },
            { "name": "promotionId", "type": "INTEGER", "form": "search", "filter": "promotionName" },
            { "name": "reason", "type": "TEXT(255)" },
            { "name": "createdAt", "type": "TEXT(255)" },
            { "name": "pointsEarned", "type": "INTEGER" },
            { "name": "pointsRedeemed", "type": "INTEGER" },
            { "name": "pointsBalance", "type": "INTEGER" },
            { "name": "loyaltyTier", "type": "TEXT(255)", "form": "select" },
            { "name": "totalSpent", "type": "REAL" },
            { "name": "transactions", "type": "INTEGER" }
        ],
        "apps": [  
            {
                "name": "Payment Method Breakdown",
                "type": "/apps/nayax/payment-methods",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales", "Nayax_Machines"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Refunds and Voids Report",
                "type": "/apps/nayax/refunds",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Revenue by Location / Region",
                "type": "/apps/nayax/sales-by-location",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Customer Retention / Repeat Users",
                "type": "/apps/nayax/repeat-users",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales" , "Nayax_Users"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Peak Hours / Transaction Time Analysis",
                "type": "/apps/nayax/peak-hours",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Top 10 High-Value Transactions",
                "type": "apps/nayax/top-transactions",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales" , "Nayax_Users" , "Nayax_Cards" , "Nayax_Machines"],
                    update: [],
                    delete: []
                } 
            },
            {
                "name": "Low-performing Products",
                "type": "apps/nayax/low-performing-products",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales", "Nayax_Users", "Nayax_Cards", "Nayax_Machines"],
                    update: [],
                    delete:[]
                }
            }

        ],
        reports: [
            {
                name: "Payment Method Breakdown",
                type: "/reports/tyg/payment-method/payment-method-breakdown",
                actions: {
                    create: [],
                    read: ["Nayax_Sales", "Nayax_Machines"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Refunds and Voids Report",
                type: "/reports/nayax/refunds-and-voids",
                actions: {
                    create: [],
                    read: ["Nayax_Sales"],
                    update: [],
                    delete: []
                }
            },
            {
                name: "Revenue by Location / Region",
                type: "/reports/nayax/revenue-by-location",
                actions: {
                    create: [],
                    read: ["Nayax_Sales"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Customer Retention / Repeat Users",
                "type": "/reports/nayax/repeat-users",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales" , "Nayax_Users"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Peak Hours / Transaction Time Analysis",
                "type": "/reports/nayax/peak-hours",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales"],
                    update: [],
                    delete: []
                }
            },
            {
                "name": "Top 10 High-Value Transactions",
                "type": "reports/nayax/top-transactions",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales" , "Nayax_Users" , "Nayax_Cards" , "Nayax_Machines"],
                    update: [],
                    delete: []
                } 
            },
            {
                "name": "Low-performing Products",
                "type": "reports/nayax/low-performing-products",
                "actions": {
                    create: [],
                    read: ["Nayax_Sales", "Nayax_Users", "Nayax_Cards", "Nayax_Machines"],
                    update: [],
                    delete:[]
                }
            }
            
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["productId"],
                "referencedTable": "Nayax_Products",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["userIdentifier"],
                "referencedTable": "Nayax_Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["machineId"],
                "referencedTable": "Nayax_Machines",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["promotionId"],
                "referencedTable": "Nayax_Promotions",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    }, 
    //------------ ai
    {
        "tableName": "ChatBot",
        "group": "ai",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["Technical_Sales", "Technical_Solutions"]
        },
        "columns": [
            {
                "name": "idx",
                "type": "INTEGER",
                "identity": { "seed": 1, "increment": 1 },
                "primaryKey": true,
                "nullable": false
            },
            {
                "name": "input",
                "type": "TEXT(1000)",
                form: "textarea"
            },
            {
                "name": "output",
                "type": "TEXT(1000)",
                form:"textarea"
            }
        ],
        constraints: [
            {
                type: "unique",
                columns: ["input", "output"]
            }],
        "apps": [
            {
                "name": "Chat Bot",
                "type": "/apps/tyg/chatbot/",
                "actions": {
                    "create": ["ChatBot"],
                    "read": ["ChatBot"],
                    "update": ["ChatBot"],
                    "delete": ["ChatBot"]
                }
            }
        ]
    },
    //------------ crm
    //: helpers 
    {
        tableName: "Industries",
        group: "crm1",
        crud: { create: ["Admin"], read: ["*"], update: ["Admin"], delete: ["Admin"] },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true, nullable: false },
            { name: "name", type: "TEXT(255)", nullable: false },
            { name: "description", type: "TEXT(500)" }
        ],
        constraints: [{ type: "unique", columns: ["name"] }]
    },
    {
        tableName: "Currencies",
        group: "crm1",
        crud: { create: ["Admin"], read: ["*"], update: ["Admin"], delete: ["Admin"] },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true },
            { name: "name", type: "TEXT(255)", nullable: false },
            { name: "symbol", type: "TEXT(10)", nullable: false },
            { name: "code", type: "TEXT(10)", nullable: false }
        ],
        constraints: [{ type: "unique", columns: ["code"] }]
    },
    {
        tableName: "Languages",
        group: "crm1",
        crud: { create: ["Admin"], read: ["*"], update: ["Admin"], delete: ["Admin"] },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true },
            { name: "name", type: "TEXT(255)", nullable: false },
            { name: "code", type: "TEXT(10)" }
        ],
        constraints: [{ type: "unique", columns: ["name"] }]
    },
    {
        tableName: "Continents",
        group: "crm1",
        crud: {
            create: ["Admin"],
            read: ["*"],
            update: ["Admin"],
            delete: ["Admin"]
        },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true },
            { name: "name", type: "TEXT(255)", nullable: false },
            { name: "code", type: "TEXT(10)" }
        ],
        constraints: [
            {
                type: "unique",
                columns: ["name"]
            }
        ]
    },
    {
        tableName: "Countries",
        group: "crm1",
        crud: { create: ["Admin"], read: ["*"], update: ["Admin"], delete: ["Admin"] },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true },
            { name: "continent", type: "INTEGER", form: "search", filter: "name", table: "Continents" },
            { name: "name", type: "TEXT(255)", nullable: false },
            { name: "code", type: "TEXT(10)" },
             
            { name: "lat", type: "TEXT(100)", nullable: true },
            { name: "lon", type: "TEXT(100)", nullable: true }
        ],
        constraints: [
            {
                type: "unique",
                columns: ["name"]
            },
            {
                type: "foreignKey",
                columns: ["continent"],
                referencedTable: "Continents",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    }, 
    {
        tableName: "States_Or_Provinces",
        group: "crm1",
        crud: { create: ["Admin"], read: ["*"], update: ["Admin"], delete: ["Admin"] },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true },
            { name: "country", type: "INTEGER" , form: "search" , filter:"name" },
            { name: "name", type: "TEXT(255)", nullable: false },
            { "name": "lat", "type": "TEXT(20)", "nullable": true },
            { "name": "lon", "type": "TEXT(20)", "nullable": true }
        ],
        constraints: [
            {
                type: "foreignKey",
                columns: ["country"],
                referencedTable: "Countries",
                referencedColumns: ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        "tableName": "Cities",
        "group": "crm1",
        "crud": { "create": ["Admin"], "read": ["*"], "update": ["Admin"], "delete": ["Admin"] },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "province", "type": "INTEGER", "form": "search", "filter": "name" },
            { "name": "name", "type": "TEXT(255)", "nullable": false }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["province"],
                "referencedTable": "States_Or_Provinces",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "unique",
                "columns": ["province", "name"]
            }
        ]
    },
    {
        tableName: "Social_Media_Platforms",
        group: "crm1",
        crud: { create: ["Admin"], read: ["*"], update: ["Admin"], delete: ["Admin"] },
        columns: [
            { name: "idx", type: "INTEGER", identity: { seed: 1, increment: 1 }, primaryKey: true },
            { "name": "platform_name", "type": "TEXT(100)" }, 
            { name: "platform_ID", type: "TEXT(255)" , form:"textarea" },
            { name: "platform_token", type: "TEXT(255)" , form:"textarea" }, 
        ],
        constraints: [ 
            {
                "type": "check",
                "expression": "platform_name IN ('Google','Facebook','Instagram','LinkedIn','X','TikTok','Trustpilot','Website')",
                "columns": ["platform_name"],
                "options": ["Google", "Facebook", "Instagram", "LinkedIn", "X", "TikTok", "Trustpilot", "Website"]
            }
        ]
    },
    {
        "tableName": "SMTP",
        "group": "crm1",
        "crud": {
            "create": ["Admin", "IT_Manager"],
            "read": ["Admin", "IT_Manager"],
            "update": ["Admin", "IT_Manager"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": true, "primaryKey": true, "form_group": "basic" },
            { "name": "email_address", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "email_password", "type": "TEXT(1000)", "form_group": "basic" },
            { "name": "email_provider", "type": "TEXT(100)", "form_group": "basic", form: "select", check: true },
            { "name": "smtp_host", "type": "TEXT(255)", "form_group": "custom" },
            { "name": "smtp_port", "type": "INTEGER", "form_group": "custom" },
            { "name": "smtp_secure", "type": "TEXT(10)", "form_group": "custom" , form:"select" , check:true },
            { "name": "description", "type": "TEXT(1000)", "form_group": "details" },
            { "name": "is_active", "type": "TEXT(10)", "form": "select", "default": "No", "check": true, "form_group": "details" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Email Configuration" },
            { "name": "custom", "title": "Custom SMTP Settings" },
            { "name": "details", "title": "Details" }
        ],
        "constraints": [
            {
                "type": "check",
                "expression": "email_provider IN ('gmail','outlook','custom')",
                "columns": ["email_provider"],
                "options": ["gmail", "outlook", "custom"]
            },
            {
                "type": "check",
                "expression": "smtp_secure IN ('true','false')",
                "columns": ["smtp_secure"],
                "options": ["true", "false"]
            },
            {
                "type": "check",
                "expression": "is_active IN ('Yes','No')",
                "columns": ["is_active"],
                "options": ["Yes", "No"]
            }
        ]
    },

    {
        "tableName": "Payment_Gateway_Yoco",
        "single": true , 
        "group": "crm1",
        "crud": {
            "create": ["Admin", "IT_Manager"],
            "read": ["Admin", "IT_Manager"],
            "update": ["Admin", "IT_Manager"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": true, "primaryKey": true },

            { "name": "yoco_public_test_key", "type": "TEXT(255)" },
            { "name": "yoco_secret_test_key", "type": "TEXT(1000)" },

            { "name": "yoco_public_production_key", "type": "TEXT(255)" },
            { "name": "yoco_secret_production_key", "type": "TEXT(1000)" },

            { "name": "is_production", "type": "TEXT(10)", "form": "select", "default": "No", "check": true },
            { "name": "is_active", "type": "TEXT(10)", "form": "select", "default": "No", "check": true }

        ],
        "constraints": [
            {
                "type": "check",
                "expression": "is_production IN ('Yes','No')",
                "columns": ["is_production"],
                "options": ["Yes", "No"]
            },
            {
                "type": "check",
                "expression": "is_active IN ('Yes','No')",
                "columns": ["is_active"],
                "options": ["Yes", "No"]
            },
            // SqLite 

            {
                "type": "trigger",
                "name": "trg_yoco_single_active_insert",
                "engine": "SqLite",
                "sql": `
                CREATE TRIGGER trg_yoco_single_active_insert
                AFTER INSERT ON Payment_Gateway_Yoco
                WHEN NEW.is_active = 'Yes'
                BEGIN
                    UPDATE Payment_Gateway_Yoco
                    SET is_active = 'No'
                    WHERE idx != NEW.idx;
        END;
        `
            },
            {
                "type": "trigger",
                "name": "trg_yoco_single_active_update",
                "engine": "SqLite",
                "sql": `
                CREATE TRIGGER trg_yoco_single_active_update
                AFTER UPDATE OF is_active ON Payment_Gateway_Yoco
                WHEN NEW.is_active = 'Yes'
                BEGIN
                    UPDATE Payment_Gateway_Yoco
                    SET is_active = 'No'
                    WHERE idx != NEW.idx;
END;
`
            },
            {
                "type": "trigger",
                "name": "trg_yoco_fallback_delete",
                "engine": "SqLite",
                "sql": `
    CREATE TRIGGER trg_yoco_fallback_delete
    AFTER DELETE ON Payment_Gateway_Yoco
    WHEN OLD.is_active = 'Yes'
    BEGIN
    UPDATE Payment_Gateway_Yoco
    SET is_active = 'Yes'
    WHERE idx = (
        SELECT idx FROM Payment_Gateway_Yoco
    LIMIT 1
                    );
    END;
    `
            },

            // SqlServer

            {
                "type": "trigger",
                "name": "trg_yoco_single_active_ins_upd",
                "engine": "SqlServer",
                "sql": `
    CREATE TRIGGER trg_yoco_single_active_ins_upd
    ON Payment_Gateway_Yoco
    AFTER INSERT, UPDATE
    AS
    BEGIN
    IF EXISTS(SELECT 1 FROM INSERTED WHERE is_active = 'Yes')
    BEGIN
    UPDATE Payment_Gateway_Yoco
    SET is_active = 'No'
    WHERE idx NOT IN(
        SELECT idx FROM INSERTED WHERE is_active = 'Yes'
    );
    END
    END;
    `
            },
            {
                "type": "trigger",
                "name": "trg_yoco_fallback_delete",
                "engine": "SqlServer",
                "sql": `
    CREATE TRIGGER trg_yoco_fallback_delete
    ON Payment_Gateway_Yoco
    AFTER DELETE
    AS
    BEGIN
    IF EXISTS(SELECT 1 FROM DELETED WHERE is_active = 'Yes')
    BEGIN
    UPDATE Payment_Gateway_Yoco
    SET is_active = 'Yes'
    WHERE idx = (
        SELECT TOP 1 idx
    FROM Payment_Gateway_Yoco
    ORDER BY idx ASC
                        );
    END
    END;
    `
            }
        ]
    },
    //: core
    {
        "tableName": "Company",
        "image": true,
        "pre_image": {
            image: true , 
        },
        "group": "crm2",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions" , "Admin" ],
            "read": ["*"],
            "update": ["Technical_Sales", "Technical_Solutions", "Admin"],
            "delete": ["Technical_Sales", "Technical_Solutions", "Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },
            { "name": "company_name", "type": "TEXT(255)", form_group: "basic"  },
            { "name": "founded", "type": "TEXT(255)", form_group: "date"  },
            { "name": "email", "type": "INTEGER", form:"search", filter: "email" , form_group:"basic" }, 
            { "name": "phone_1", "type": "TEXT(255)", form: "tel", form_group: "basic" },
            { "name": "phone_2", "type": "TEXT(255)", form: "tel", form_group: "basic" },
            { "name": "website", "type": "TEXT(500)", form_group: "basic"  },
            { "name": "source", "type": "TEXT(255)", form: "select", check: true, form_group: "basic" },
            { "name": "industry", "type": "INTEGER", form: "search", filter: "name", form_group: "basic"  },
            { "name": "currency", "type": "INTEGER", form: "search", filter: "name", form_group: "basic" },
            { "name": "language", "type": "INTEGER", form: "search", filter: "name", form_group: "basic" },
            { "name": "description", "type": "TEXT(255)" , form:"doc" , atob:true , btoa:true , form_group: "basic"  },   
            { "name": "street_address", "type": "TEXT(1000)", form: "textarea" , form_group: "address" },
            { "name": "country", "type": "INTEGER", form: "search" , filter: "name" , form_group: "address" },
            { "name": "state_or_province", "type": "INTEGER", form: "search" , filter: "name" , form_group: "address" },
            { "name": "zip_code", "type": "TEXT(20)", form_group: "address" },
            { "name": "facebook", "type": "TEXT(255)", form: "textarea" , form_group: "social" },
            { "name": "skype", "type": "TEXT(255)", form: "textarea" , form_group: "social" },
            { "name": "linkedin", "type": "TEXT(255)", form: "textarea" , form_group: "social" },
            { "name": "twitter", "type": "TEXT(255)", form: "textarea" , form_group: "social" },
            { "name": "whatsapp", "type": "TEXT(255)", form: "textarea" , form_group: "social" },
            { "name": "instagram", "type": "TEXT(255)", form: "textarea" , form_group: "social" },
            { "name": "visibility", "type": "TEXT(255)", form: "select" , check:true , form_group: "access" },
            { "name": "is_approved", "type": "TEXT(255)", default:"No" , form: "select" , check:true , form_group: "access" },
        ],
        "form_groups": [
            { name: "basic", title: "Basic Info" },
            { name: "address", title: "Address Info" },
            { name: "social", title: "Social Profile" },
            { name: "access", title: "Access" },
        ],
        "apps": [ 
        ],

        "reports": [
            {
                "name": "Preview",
                "type": "/reports/tyg/companies/preview",
                "actions": {
                    "create": [],
                    "read": ["Company"],
                    "update": [],
                    "delete": []
                }
            },
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["email"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }, 
            {
                "type": "foreignKey",
                "columns": ["industry"],
                "referencedTable": "Industries",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["currency"],
                "referencedTable": "Currencies",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["language"],
                "referencedTable": "Languages",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["country"],
                "referencedTable": "Countries",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["state_or_province"],
                "referencedTable": "States_Or_Provinces",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                type: "check",
                expression: "source IN ('Phone Calls', 'Social Media' , 'Referral Sites' , 'Web Analytics' , 'Previous Purchases', 'Register')",
                columns: ["source"],
                options: ['Phone Calls', 'Social Media', 'Referral Sites', 'Web Analytics', 'Previous Purchases', 'Register']
            },
            {
                type: "check",
                expression: "visibility IN ('Public', 'Private')",
                columns: ["visibility"],
                options: ['Public', 'Private']
            },
            {
                type: "check",
                expression: "is_approved IN ('Yes', 'No')",
                columns: ["is_approved"],
                options: ['Yes', 'No']
            }
        ]
    },
    {
        "tableName": "Schools",
        "image": true,
        "pre_image": {
            "image": true
        },
        "group": "crm2",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions", "Admin"],
            "read": ["*"],
            "update": ["Technical_Sales", "Technical_Solutions", "Admin"],
            "delete": ["Technical_Sales", "Technical_Solutions", "Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true, "nullable": false },

            { "name": "school_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "established", "type": "TEXT(255)", "form_group": "date" },

            { "name": "email", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "basic" },
            { "name": "phone_1", "type": "TEXT(255)", "form": "tel", "form_group": "basic" },
            { "name": "phone_2", "type": "TEXT(255)", "form": "tel", "form_group": "basic" },

            { "name": "website", "type": "TEXT(500)", "form_group": "basic" },

            { "name": "school_type", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "basic" },
            { "name": "education_level", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "basic" },

            { "name": "student_capacity", "type": "INTEGER", "form": "number", "form_group": "basic" },
            { "name": "language", "type": "INTEGER", "form": "search", "filter": "name", "form_group": "basic" },

            { "name": "description", "type": "TEXT(255)", "form": "doc", "atob": true, "btoa": true, "form_group": "basic" },

            { "name": "street_address", "type": "TEXT(1000)", "form": "textarea", "form_group": "address" },
            { "name": "country", "type": "INTEGER", "form": "search", "filter": "name", "form_group": "address" },
            { "name": "state_or_province", "type": "INTEGER", "form": "search", "filter": "name", "form_group": "address" },
            { "name": "zip_code", "type": "TEXT(20)", "form_group": "address" },

            { "name": "facebook", "type": "TEXT(255)", "form": "textarea", "form_group": "social" },
            { "name": "linkedin", "type": "TEXT(255)", "form": "textarea", "form_group": "social" },
            { "name": "twitter", "type": "TEXT(255)", "form": "textarea", "form_group": "social" },
            { "name": "instagram", "type": "TEXT(255)", "form": "textarea", "form_group": "social" },

            { "name": "visibility", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "access" },
            { "name": "is_approved", "type": "TEXT(255)", "default": "No", "form": "select", "check": true, "form_group": "access" }
        ],

        "form_groups": [
            { "name": "basic", "title": "Basic Info" },
            { "name": "address", "title": "Address Info" },
            { "name": "social", "title": "Social Profile" },
            { "name": "access", "title": "Access" }
        ],

        "reports": [
            {
                "name": "Preview",
                "type": "/reports/tyg/schools/preview",
                "actions": {
                    "create": [],
                    "read": ["Schools"],
                    "update": [],
                    "delete": []
                }
            }
        ],

        "constraints": [
            {
                "type": "unique",
                "columns": ["school_name"]
            },
            {
                "type": "foreignKey",
                "columns": ["email"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["language"],
                "referencedTable": "Languages",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["country"],
                "referencedTable": "Countries",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["state_or_province"],
                "referencedTable": "States_Or_Provinces",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },

            {
                "type": "check",
                "expression": "school_type IN ('Public', 'Private', 'International', 'Technical', 'Online')",
                "columns": ["school_type"],
                "options": ["Public", "Private", "International", "Technical", "Online"]
            },
            {
                "type": "check",
                "expression": "education_level IN ('Pre-School', 'Primary', 'Secondary', 'College', 'University')",
                "columns": ["education_level"],
                "options": ["Pre-School", "Primary", "Secondary", "College", "University"]
            },
            {
                "type": "check",
                "expression": "visibility IN ('Public', 'Private')",
                "columns": ["visibility"],
                "options": ["Public", "Private"]
            },
            {
                "type": "check",
                "expression": "is_approved IN ('Yes', 'No')",
                "columns": ["is_approved"],
                "options": ["Yes", "No"]
            }
        ]
    },
    {
        "tableName": "Guardians",
        "group": "crm2",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions", "Admin"],
            "read": ["*"],
            "update": ["Technical_Sales", "Technical_Solutions", "Admin"],
            "delete": ["Technical_Sales", "Technical_Solutions", "Admin"]
        },

        "columns": [
            {
                "name": "idx",
                "type": "INTEGER",
                "identity": { "seed": 1, "increment": 1 },
                "primaryKey": true,
                "nullable": false
            }, 
            {
                "name": "user_id",
                "type": "INTEGER",
                "form": "search",
                "filter": "firstname",
                "form_group": "basic"
            }, 
            {
                "name": "learner_id",
                "type": "INTEGER",
                "form": "search",
                "filter": "firstname",
                "form_group": "relation"
            }, 
            {
                "name": "school_id",
                "type": "INTEGER",
                "form": "search",
                "filter": "school_name",
                "form_group": "relation"
            }, 
            {
                "name": "relationship",
                "type": "TEXT(255)",
                "form": "select",
                "check": true,
                "form_group": "relation"
            }, 
            {
                "name": "is_primary",
                "type": "TEXT(10)",
                "default": "No",
                "form": "select",
                "check": true,
                "form_group": "relation"
            }, 
            {
                "name": "has_access",
                "type": "TEXT(10)",
                "default": "Yes",
                "form": "select",
                "check": true,
                "form_group": "access"
            }, 
            {
                "name": "notes",
                "type": "TEXT(1000)",
                "form": "textarea",
                "form_group": "additional"
            }
        ],

        "form_groups": [
            {
                "name": "basic",
                "title": "Guardian (User)"
            },
            {
                "name": "relation",
                "title": "Learner & School Relation"
            },
            {
                "name": "access",
                "title": "Access Control"
            },
            {
                "name": "additional",
                "title": "Additional Info"
            }
        ],

        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user_id"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["learner_id"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["school_id"],
                "referencedTable": "Schools",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }, 
            {
                "type": "check",
                "expression": "relationship IN ('Parent', 'Guardian', 'Grandparent', 'Sibling', 'Relative', 'Other')",
                "columns": ["relationship"],
                "options": ["Parent", "Guardian", "Grandparent", "Sibling", "Relative", "Other"]
            }, 
            {
                "type": "check",
                "expression": "is_primary IN ('Yes', 'No')",
                "columns": ["is_primary"],
                "options": ["Yes", "No"]
            }, 
            {
                "type": "check",
                "expression": "has_access IN ('Yes', 'No')",
                "columns": ["has_access"],
                "options": ["Yes", "No"]
            }, 
            {
                "type": "unique",
                "columns": ["user_id", "learner_id"]
            }
        ]
    },
    {
        "tableName": "Contacts",
        "group": "crm2",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions", "IT_Manager", "Admin"],
            "read": ["Technical_Sales", "Technical_Solutions", "IT_Manager", "Admin", "Managing_Director"],
            "update": ["Technical_Sales", "Technical_Solutions", "IT_Manager", "Admin"],
            "delete": ["Admin", "Managing_Director"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "email", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "basic" },
            { "name": "phone", "type": "TEXT(100)", "form": "tel", "form_group": "basic" },
            { "name": "company_id", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "school_id", "type": "INTEGER", "form": "search", "filter": "school_name", "form_group": "relation" },
            { "name": "role", "type": "TEXT(255)", "form_group": "relation" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "access", nullable: true },
            { "name": "notes", "type": "TEXT(1000)", "form": "textarea", "form_group": "additional" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Contact Info" },
            { "name": "relation", "title": "Company Relation" },
            { "name": "access", "title": "Assigned User" },
            { "name": "additional", "title": "Notes" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["school_id"],
                "referencedTable": "Schools",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["company_id"],
                "referencedTable": "Company",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "(company_id IS NOT NULL OR school_id IS NOT NULL)",
                "columns": ["company_id", "school_id"]
            },
            {
                "type": "foreignKey",
                "columns": ["assigned_to"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["email"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },
    {
        "tableName": "Appointment_Contacts",
        "group": "wellness",
        "crud": {
            "create": ["*"],
            "read": ["*"],
            "update": ["*"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "email", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "basic" }, 
            { "name": "contact", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "access", nullable: true } 
        ], 
        "constraints": [  
            {
                "type": "foreignKey",
                "columns": ["contact"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["email"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },
    {
        "tableName": "Appointment_Chat_List",
        "group": "wellness",
        "crud": {
            "create": ["*"],
            "read": ["*"],
            "update": ["*"],
            "delete": ["Admin"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "name", "type": "TEXT(201)" },
            { "name": "user1", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "user2", "type": "INTEGER", "form": "search", "filter": "email" },
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["user1"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["user2"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            }
        ]
    },
    {
        "tableName": "Appointment_Chat_Messages",
        "group": "wellness",
        "gallery": true,
        "crud": {
            "create": ["*"],
            "read": ["*"],
            "update": ["*"],
            "delete": ["*"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "chat_no", "type": "INTEGER", "form": "search", "filter": "name" },
            { "name": "user", "type": "INTEGER", "form": "search", "filter": "email" },
            { "name": "message", "type": "TEXT(5000)" },
            { "name": "attachment", "type": "TEXT(10)" },
            { "name": "deleted", "type": "TEXT(10)" , default: "No" },
            { "name": "created_at", "type": "TEXT(100)" , form:"date-time" },
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["chat_no"],
                "referencedTable": "Appointment_Chat_List",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["user"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "attachment IN ('Yes', 'No')",
                "columns": ["attachment"],
                "options": ["Yes", "No"]
            },
            {
                "type": "check",
                "expression": "deleted IN ('Yes', 'No')",
                "columns": ["deleted"],
                "options": ["Yes", "No"]
            }

        ]
    },
    //: sales 
    {
        "tableName": "Leads",
        "group": "crm3",
        "crud": {
            "create": ["Technical_Sales", "IT_Manager"],
            "read": ["Technical_Sales", "Technical_Solutions", "IT_Manager", "Admin", "Managing_Director"],
            "update": ["Technical_Sales", "IT_Manager"],
            "delete": ["Admin", "Managing_Director"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "lead_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "contact_id", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "relation" },
            { "name": "company_id", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "basic" },
            { "name": "source", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "basic" },
            { "name": "potential_value", "type": "REAL", "form_group": "metrics" },
            { "name": "notes", "type": "TEXT(1000)", "form": "textarea", "form_group": "additional" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Lead Info" },
            { "name": "relation", "title": "Relations" },
            { "name": "metrics", "title": "Metrics" },
            { "name": "access", "title": "Assigned User" },
            { "name": "additional", "title": "Notes" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["contact_id"],
                "referencedTable": "Contacts",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["company_id"],
                "referencedTable": "Company",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["assigned_to"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "status IN ('New', 'Contacted', 'Qualified', 'Lost', 'Converted')",
                "columns": ["status"],
                "options": ["New", "Contacted", "Qualified", "Lost", "Converted"]
            },
            {
                "type": "check",
                "expression": "source IN ('Website', 'Referral', 'Email', 'Social Media', 'Cold Call')",
                "columns": ["source"],
                "options": ["Website", "Referral", "Email", "Social Media", "Cold Call"]
            }
        ]
    },
    {
        "tableName": "Deals",
        "group": "crm3",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions", "IT_Manager"],
            "read": ["Technical_Sales", "Technical_Solutions", "IT_Manager", "Admin", "Managing_Director"],
            "update": ["Technical_Sales", "Technical_Solutions", "IT_Manager"],
            "delete": ["Admin", "Managing_Director"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "deal_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "company_id", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "contact_id", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "relation" },
            { "name": "pipeline_id", "type": "INTEGER", "form": "search", "filter": "pipeline_name", "form_group": "relation" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" },
            { "name": "value", "type": "REAL", "form_group": "metrics" },
            { "name": "stage", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "basic" },
            { "name": "close_date", "type": "TEXT(50)", "form_group": "metrics", form: "date" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Deal Info" },
            { "name": "relation", "title": "Relations" },
            { "name": "metrics", "title": "Financials" },
            { "name": "access", "title": "Assigned User" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["company_id"],
                "referencedTable": "Company",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["contact_id"],
                "referencedTable": "Contacts",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["pipeline_id"],
                "referencedTable": "Pipelines",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["assigned_to"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "stage IN ('Prospecting','Qualification','Proposal','Negotiation','Closed Won','Closed Lost')",
                "columns": ["stage"],
                "options": ["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
            }
        ]
    },
    {
        "tableName": "Pipelines",
        "group": "crm3",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions", "Managing_Director", "IT_Manager"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["IT_Manager", "Managing_Director"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "pipeline_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "description", "type": "TEXT(1000)", "form": "textarea", "form_group": "basic" },
            { "name": "owner_id", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "ownership" },
            { "name": "visibility", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Pipeline Info" },
            { "name": "ownership", "title": "Ownership" },
            { "name": "access", "title": "Access Control" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["owner_id"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "visibility IN ('Public', 'Private')",
                "columns": ["visibility"],
                "options": ["Public", "Private"]
            }
        ]
    },
    {
        "tableName": "Opportunities",
        "group": "crm3",
        "crud": {
            "create": ["Technical_Sales"],
            "read": ["Technical_Sales", "Technical_Solutions", "Managing_Director"],
            "update": ["Technical_Sales"],
            "delete": ["IT_Manager"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "opportunity_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "pipeline_id", "type": "INTEGER", "form": "search", "filter": "pipeline_name", "form_group": "relation" },
            { "name": "deal", "type": "INTEGER", "form": "search", "filter": "deal_name", "form_group": "relation" },
            { "name": "probability", "type": "INTEGER", "form": "number", "form_group": "progress" },
            { "name": "expected_value", "type": "DECIMAL(15,2)", "form_group": "financial" },
            { "name": "stage", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "progress" },
            { "name": "closing_date", "type": "TEXT(255)", "form_group": "timeline", form: "datetime-local" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "assignment" },
            { "name": "visibility", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Opportunity Info" },
            { "name": "relation", "title": "Pipeline & Deal" },
            { "name": "progress", "title": "Stage & Probability" },
            { "name": "financial", "title": "Financial Info" },
            { "name": "timeline", "title": "Timeline" },
            { "name": "assignment", "title": "Assigned User" },
            { "name": "access", "title": "Access Control" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["pipeline_id"],
                "referencedTable": "Pipelines",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["deal"],
                "referencedTable": "Deals",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["assigned_to"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                "OnDeleteAction": "CASCADE",
                "OnUpdateAction": "CASCADE"
            },
            {
                "type": "check",
                "expression": "stage IN ('Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost')",
                "columns": ["stage"],
                "options": ["Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
            },
            {
                "type": "check",
                "expression": "visibility IN ('Public', 'Private')",
                "columns": ["visibility"],
                "options": ["Public", "Private"]
            }
        ]
    },
    //: marketing
    {
        "tableName": "Campaigns",
        "group": "crm4",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions", "Managing_Director"],
            "update": ["Technical_Sales"],
            "delete": ["IT_Manager"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "campaign_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "type", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "basic" },
            { "name": "start_date", "type": "TEXT(255)", "form_group": "timeline", form: "datetime-local" },
            { "name": "end_date", "type": "TEXT(255)", "form_group": "timeline", form: "datetime-local" },
            { "name": "budget", "type": "DECIMAL(15,2)", "form_group": "financial" },
            { "name": "owner_id", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "ownership" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "progress" },
            { "name": "visibility", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Campaign Info" },
            { "name": "timeline", "title": "Dates" },
            { "name": "financial", "title": "Budget" },
            { "name": "ownership", "title": "Owner" },
            { "name": "progress", "title": "Status" },
            { "name": "access", "title": "Access Control" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["owner_id"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "check",
                "expression": "type IN ('Email', 'Social Media', 'Referral', 'Event', 'Advertising')",
                "columns": ["type"],
                "options": ["Email", "Social Media", "Referral", "Event", "Advertising"]
            },
            {
                "type": "check",
                "expression": "status IN ('Planned', 'Active', 'Completed', 'Paused', 'Cancelled')",
                "columns": ["status"],
                "options": ["Planned", "Active", "Completed", "Paused", "Cancelled"]
            },
            {
                "type": "check",
                "expression": "visibility IN ('Public', 'Private')",
                "columns": ["visibility"],
                "options": ["Public", "Private"]
            }
        ]
    },
    //: projects
    {
        "tableName": "Projects",
        "group": "crm5",
        "crud": {
            "create": ["Technical_Solutions", "Technical_Sales"],
            "read": ["Technical_Solutions", "Technical_Sales", "Managing_Director"],
            "update": ["Technical_Solutions"],
            "delete": ["Managing_Director"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "project_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "company_id", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relations" },
            { "name": "deal", "type": "INTEGER", "form": "search", "filter": "deal_name", "form_group": "relations" },
            { "name": "start_date", "type": "TEXT(255)", "form_group": "timeline", form: "datetime-local" },
            { "name": "end_date", "type": "TEXT(255)", "form_group": "timeline", form: "datetime-local" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "progress" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "assignment" },
            { "name": "budget", "type": "DECIMAL(15,2)", "form_group": "financial" },
            { "name": "visibility", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Project Info" },
            { "name": "relations", "title": "Company & Deal" },
            { "name": "timeline", "title": "Timeline" },
            { "name": "progress", "title": "Status" },
            { "name": "assignment", "title": "Assigned User" },
            { "name": "financial", "title": "Financial" },
            { "name": "access", "title": "Access Control" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["company_id"],
                "referencedTable": "Company",
                "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["deal"],
                "referencedTable": "Deals",
                "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey",
                "columns": ["assigned_to"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "check",
                "expression": "status IN ('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled')",
                "columns": ["status"],
                "options": ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"]
            },
            {
                "type": "check",
                "expression": "visibility IN ('Public', 'Private')",
                "columns": ["visibility"],
                "options": ["Public", "Private"]
            }
        ]
    },
    {
        "tableName": "Tasks",
        "group": "crm5",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions", "IT_Manager", "Managing_Director"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["IT_Manager"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "task_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "related_to", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "relations" },
            { "name": "related_id", "type": "INTEGER", "form": "search", "filter": "name", "form_group": "relations" },
            { "name": "due_date", "type": "TEXT(255)", "form_group": "timeline", form: "datetime-local" },
            { "name": "priority", "type": "TEXT(50)", "form": "select", "check": true, "form_group": "progress" },
            { "name": "status", "type": "TEXT(50)", "form": "select", "check": true, "form_group": "progress" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "assignment" },
            { "name": "description", "type": "TEXT(1000)", "form": "textarea", "form_group": "additional" },
            { "name": "visibility", "type": "TEXT(255)", "form": "select", "check": true, "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Task Info" },
            { "name": "relations", "title": "Related Entity" },
            { "name": "timeline", "title": "Timeline" },
            { "name": "progress", "title": "Progress" },
            { "name": "assignment", "title": "Assignment" },
            { "name": "additional", "title": "Description" },
            { "name": "access", "title": "Access Control" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["assigned_to"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "check",
                "expression": "related_to IN ('Lead', 'Deal', 'Company', 'Project')",
                "columns": ["related_to"],
                "options": ["Lead", "Deal", "Company", "Project"]
            },
            {
                "type": "check",
                "expression": "priority IN ('Low', 'Medium', 'High', 'Critical')",
                "columns": ["priority"],
                "options": ["Low", "Medium", "High", "Critical"]
            },
            {
                "type": "check",
                "expression": "status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')",
                "columns": ["status"],
                "options": ["Pending", "In Progress", "Completed", "Cancelled"]
            },
            {
                "type": "check",
                "expression": "visibility IN ('Public', 'Private')",
                "columns": ["visibility"],
                "options": ["Public", "Private"]
            }
        ]
    },
    //: proposals
    {
        "tableName": "Proposals",
        "group": "crm6",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "proposal_title", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "proposal_details", "type": "TEXT(255)", form:"doc" , btoa:true, atob:true , "form_group": "basic" },
            { "name": "company", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "contact", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "relation" },
            { "name": "proposal_date", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "valid_until", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "total_amount", "type": "DECIMAL(10,2)", "form_group": "financial" },
            { "name": "currency", "type": "INTEGER", "form": "search", "filter": "name", "form_group": "financial" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "status" },
            { "name": "created_by", "type": "INTEGER", "form": "search", "filter": "email", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Basic Info" },
            { "name": "relation", "title": "Client Relation" },
            { "name": "details", "title": "Proposal Dates" },
            { "name": "financial", "title": "Financial Info" },
            { "name": "status", "title": "Status" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["company"], "referencedTable": "Company", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["contact"], "referencedTable": "Contacts", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["currency"], "referencedTable": "Currencies", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["created_by"], "referencedTable": "Users", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "status IN ('Draft','Sent','Accepted','Rejected','Expired')", "columns": ["status"], "options": ["Draft", "Sent", "Accepted", "Rejected", "Expired"] }
        ]
    },
    {
        "tableName": "Contracts",
        "group": "crm6",
        "crud": {
            "create": ["Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "contract_title", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "proposal", "type": "INTEGER", "form": "search", "filter": "proposal_title", "form_group": "relation" },
            { "name": "company", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "start_date", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "end_date", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "contract_value", "type": "DECIMAL(10,2)", "form_group": "financial" },
            { "name": "currency", "type": "INTEGER", "form": "search", "filter": "name", "form_group": "financial" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "status" },
            { "name": "signed_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Basic Info" },
            { "name": "relation", "title": "Relations" },
            { "name": "details", "title": "Contract Dates" },
            { "name": "financial", "title": "Financials" },
            { "name": "status", "title": "Status" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["proposal"], "referencedTable": "Proposals", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["company"], "referencedTable": "Company", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["currency"], "referencedTable": "Currencies", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["signed_by"], "referencedTable": "Users", "referencedColumns": ["idx"], "filter": "email_address",
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "status IN ('Draft','Active','Completed','Terminated')", "columns": ["status"], "options": ["Draft", "Active", "Completed", "Terminated"] }
        ]
    },
    {
        "tableName": "Estimations",
        "group": "crm6",
        "crud": {
            "create": ["Technical_Sales"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "estimate_title", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "company", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "proposal", "type": "INTEGER", "form": "search", "filter": "proposal_title", "form_group": "relation" },
            { "name": "estimate_date", "type": "TEXT(50)", "form_group": "details" , form:"date" },
            { "name": "amount", "type": "DECIMAL(10,2)", "form_group": "financial" },
            { "name": "currency", "type": "INTEGER", "form": "search", "filter": "name", "form_group": "financial" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "status" },
            { "name": "created_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Basic Info" },
            { "name": "relation", "title": "Related Docs" },
            { "name": "details", "title": "Estimate Details" },
            { "name": "financial", "title": "Financial Info" },
            { "name": "status", "title": "Status" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["proposal"], "referencedTable": "Proposals", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["company"], "referencedTable": "Company", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["currency"], "referencedTable": "Currencies", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["created_by"], "referencedTable": "Users", "referencedColumns": ["idx"],  
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "status IN ('Pending','Approved','Declined','Invoiced')", "columns": ["status"], "options": ["Pending", "Approved", "Declined", "Invoiced"] }
        ]
    },
    //: financial 
    {
        "tableName": "Invoices",
        "group": "crm7",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "invoice_number", "type": "TEXT(100)", "form_group": "basic" },
            { "name": "company", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "estimate", "type": "INTEGER", "form": "search", "filter": "estimate_title", "form_group": "relation" },
            { "name": "invoice_date", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "due_date", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "total_amount", "type": "DECIMAL(10,2)", "form_group": "financial" },
            { "name": "currency", "type": "INTEGER", "form": "search", "filter": "name", "form_group": "financial" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "status" },
            { "name": "issued_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Invoice Info" },
            { "name": "relation", "title": "Related Docs" },
            { "name": "details", "title": "Dates" },
            { "name": "financial", "title": "Financials" },
            { "name": "status", "title": "Status" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["estimate"], "referencedTable": "Estimations", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["company"], "referencedTable": "Company", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["currency"], "referencedTable": "Currencies", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["issued_by"], "referencedTable": "Users", "referencedColumns": ["idx"], 
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "status IN ('Draft','Issued','Paid','Overdue','Cancelled')", "columns": ["status"], "options": ["Draft", "Issued", "Paid", "Overdue", "Cancelled"] }
        ]
    },
    {
        "tableName": "Payments",
        "group": "crm7",
        "crud": {
            "create": ["Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "invoice", "type": "INTEGER", "form": "search", "filter": "invoice_number", "form_group": "relation" },
            { "name": "payment_date", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "amount_paid", "type": "DECIMAL(10,2)", "form_group": "financial" },
            { "name": "payment_method", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "financial" },
            { "name": "reference_number", "type": "TEXT(255)", "form_group": "details" },
            { "name": "received_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "relation", "title": "Related Invoice" },
            { "name": "details", "title": "Payment Details" },
            { "name": "financial", "title": "Financial Info" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["invoice"], "referencedTable": "Invoices", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["received_by"], "referencedTable": "Users", "referencedColumns": ["idx"], 
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "payment_method IN ('Cash','EFT','Credit Card','Debit Card','PayPal','Other')", "columns": ["payment_method"], "options": ["Cash", "EFT", "Credit Card", "Debit Card", "PayPal", "Other"] }
        ]
    },
    //: support 
    {
        "tableName": "Activities",
        "group": "crm8",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "activity_type", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "basic" },
            { "name": "subject", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "related_company", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "related_contact", "type": "INTEGER", "form": "search", "filter": "full_name", "form_group": "relation" },
            { "name": "related_user", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "relation" },
            { "name": "start_time", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" },
            { "name": "end_time", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "status" },
            { "name": "notes", "type": "TEXT(2000)", "form": "textarea", "form_group": "notes" },
            { "name": "created_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Activity Info" },
            { "name": "relation", "title": "Relations" },
            { "name": "details", "title": "Schedule" },
            { "name": "status", "title": "Status" },
            { "name": "notes", "title": "Notes" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["related_company"], "referencedTable": "Company", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["related_contact"], "referencedTable": "Contacts", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["related_user"], "referencedTable": "Users", "referencedColumns": ["idx"],  
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["created_by"], "referencedTable": "Users", "referencedColumns": ["idx"], 
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "activity_type IN ('Call','Meeting','Email','Note','Task','Follow-up')", "columns": ["activity_type"], "options": ["Call", "Meeting", "Email", "Note", "Task", "Follow-up"] },
            { "type": "check", "expression": "status IN ('Planned','Completed','Cancelled')", "columns": ["status"], "options": ["Planned", "Completed", "Cancelled"] }
        ]
    },
    {
        "tableName": "Calls",
        "group": "crm8",
        "crud": {
            "create": ["Technical_Sales"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "activity", "type": "INTEGER", "form": "search", "filter": "subject", "form_group": "relation" },
            { "name": "call_date", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" },
            { "name": "duration_minutes", "type": "INTEGER", "form_group": "details" },
            { "name": "call_result", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "result" },
            { "name": "recording_link", "type": "TEXT(500)", "form_group": "result" },
            { "name": "logged_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "relation", "title": "Linked Activity" },
            { "name": "details", "title": "Call Info" },
            { "name": "result", "title": "Outcome" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["activity"], "referencedTable": "Activities", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["logged_by"], "referencedTable": "Users", "referencedColumns": ["idx"], 
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "call_result IN ('Connected','Voicemail','No Answer','Cancelled','Rescheduled')", "columns": ["call_result"], "options": ["Connected", "Voicemail", "No Answer", "Cancelled", "Rescheduled"] }
        ]
    },
    {
        "tableName": "Meetings",
        "group": "crm8",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "activity", "type": "INTEGER", "form": "search", "filter": "subject", "form_group": "relation" },
            { "name": "meeting_title", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "meeting_date", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" },
            { "name": "location", "type": "TEXT(255)", "form_group": "details" },
            { "name": "meeting_notes", "type": "TEXT(2000)", "form": "textarea", "form_group": "notes" },
            { "name": "created_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "relation", "title": "Related Activity" },
            { "name": "basic", "title": "Meeting Info" },
            { "name": "details", "title": "Details" },
            { "name": "notes", "title": "Notes" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["activity"], "referencedTable": "Activities", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["created_by"], "referencedTable": "Users", "referencedColumns": ["idx"], 
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        "tableName": "Emails",
        "group": "crm8",
        "crud": {
            "create": ["Technical_Sales"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "activity", "type": "INTEGER", "form": "search", "filter": "subject", "form_group": "relation" },
            { "name": "subject", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "body", "type": "TEXT(5000)", "form": "textarea", "form_group": "content" },
            { "name": "sent_from", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "relation" },
            { "name": "sent_to", "type": "TEXT(1000)", "form_group": "relation" },
            { "name": "sent_date", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "status" }
        ],
        "form_groups": [
            { "name": "relation", "title": "Relations" },
            { "name": "basic", "title": "Header Info" },
            { "name": "content", "title": "Email Body" },
            { "name": "details", "title": "Timing" },
            { "name": "status", "title": "Status" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["activity"], "referencedTable": "Activities", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["sent_from"], "referencedTable": "Users", "referencedColumns": ["idx"], 
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "status IN ('Draft','Sent','Failed','Opened')", "columns": ["status"], "options": ["Draft", "Sent", "Failed", "Opened"] }
        ]
    },
    {
        "tableName": "Tickets",
        "group": "crm8",
        "crud": {
            "create": ["Customer", "Corporate_Client", "Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions", "Customer", "Corporate_Client"],
            "update": ["Technical_Solutions", "Technical_Sales"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "ticket_number", "type": "TEXT(50)", "form_group": "basic" },
            { "name": "subject", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "description", "type": "TEXT(2000)", "form": "textarea", "form_group": "details" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "status" },
            { "name": "priority", "type": "TEXT(50)", "form": "select", "check": true, "form_group": "status" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "relation" },
            { "name": "created_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "relation" },
            { "name": "company", "type": "INTEGER", "form": "search", "filter": "company_name", "form_group": "relation" },
            { "name": "contact", "type": "INTEGER", "form": "search", "filter": "full_name", "form_group": "relation" },
            { "name": "created_at", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" },
            { "name": "resolved_at", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Ticket Info" },
            { "name": "details", "title": "Details" },
            { "name": "status", "title": "Status & Priority" },
            { "name": "relation", "title": "Relations" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["assigned_to"], "referencedTable": "Users", "referencedColumns": ["idx"],  
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["created_by"], "referencedTable": "Users", "referencedColumns": ["idx"],  
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["company"], "referencedTable": "Company", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["contact"], "referencedTable": "Contacts", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "status IN ('Open','In Progress','Resolved','Closed','Reopened')", "columns": ["status"], "options": ["Open", "In Progress", "Resolved", "Closed", "Reopened"] },
            { "type": "check", "expression": "priority IN ('Low','Medium','High','Urgent')", "columns": ["priority"], "options": ["Low", "Medium", "High", "Urgent"] }
        ]
    },
    {
        "tableName": "Cases",
        "group": "crm8",
        "crud": {
            "create": ["Technical_Sales", "Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Sales", "Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "case_title", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "description", "type": "TEXT(2000)", "form": "textarea", "form_group": "basic" },
            { "name": "status", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "status" },
            { "name": "priority", "type": "TEXT(50)", "form": "select", "check": true, "form_group": "status" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "relation" },
            { "name": "related_tickets", "type": "TEXT(1000)", "form_group": "relation" },
            { "name": "created_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" },
            { "name": "created_at", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Case Info" },
            { "name": "status", "title": "Status" },
            { "name": "relation", "title": "Relations" },
            { "name": "details", "title": "Dates" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["assigned_to"], "referencedTable": "Users", "referencedColumns": ["idx"], 
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["created_by"], "referencedTable": "Users", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "status IN ('Open','Under Review','Closed')", "columns": ["status"], "options": ["Open", "Under Review", "Closed"] },
            { "type": "check", "expression": "priority IN ('Low','Medium','High')", "columns": ["priority"], "options": ["Low", "Medium", "High"] }
        ]
    },
    {
        "tableName": "Resolutions",
        "group": "crm8",
        "crud": {
            "create": ["Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "case_id", "type": "INTEGER", "form": "search", "filter": "case_title", "form_group": "relation" },
            { "name": "ticket_id", "type": "INTEGER", "form": "search", "filter": "subject", "form_group": "relation" },
            { "name": "resolution_summary", "type": "TEXT(2000)", "form": "textarea", "form_group": "details" },
            { "name": "resolved_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" },
            { "name": "resolved_at", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" }
        ],
        "form_groups": [
            { "name": "relation", "title": "Linked Items" },
            { "name": "details", "title": "Resolution Info" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["case_id"], "referencedTable": "Cases", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["ticket_id"], "referencedTable": "Tickets", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["resolved_by"], "referencedTable": "Users", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    {
        "tableName": "ServiceLevels",
        "group": "crm8",
        "crud": {
            "create": ["Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "sla_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "response_time_hours", "type": "INTEGER", "form_group": "details" },
            { "name": "resolution_time_hours", "type": "INTEGER", "form_group": "details" },
            { "name": "priority_level", "type": "TEXT(50)", "form": "select", "check": true, "form_group": "basic" },
            { "name": "active", "type": "TEXT(10)", "form_group": "status" }
        ],
        "form_groups": [
            { "name": "basic", "title": "SLA Info" },
            { "name": "details", "title": "Time Targets" },
            { "name": "status", "title": "Status" }
        ],
        "constraints": [
            { "type": "check", "expression": "priority_level IN ('Low','Medium','High','Urgent')", "columns": ["priority_level"], "options": ["Low", "Medium", "High", "Urgent"] }
        ]
    },
    {
        "tableName": "Feedback",
        "group": "crm8",
        "crud": {
            "create": ["Customer", "Corporate_Client"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "ticket_id", "type": "INTEGER", "form": "search", "filter": "subject", "form_group": "relation" },
            { "name": "case_id", "type": "INTEGER", "form": "search", "filter": "case_title", "form_group": "relation" },
            { "name": "rating", "type": "INTEGER", "form": "number", "form_group": "details" },
            { "name": "comments", "type": "TEXT(2000)", "form": "textarea", "form_group": "details" },
            { "name": "submitted_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" },
            { "name": "submitted_at", "type": "TEXT(255)", "form_group": "details", form: "datetime-local" }
        ],
        "form_groups": [
            { "name": "relation", "title": "Relations" },
            { "name": "details", "title": "Feedback Info" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["ticket_id"], "referencedTable": "Tickets", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["case_id"], "referencedTable": "Cases", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            {
                "type": "foreignKey", "columns": ["submitted_by"], "referencedTable": "Users", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "rating BETWEEN 1 AND 5", "columns": ["rating"] }
        ]
    },
    //: analytics 
    {
        "tableName": "Analytics",
        "group": "crm9",
        "crud": {
            "create": ["Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "report_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "metric_type", "type": "TEXT(100)", "form": "select", "check": true, "form_group": "basic" },
            { "name": "period_start", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "period_end", "type": "TEXT(50)", "form_group": "details", form: "date" },
            { "name": "value", "type": "DECIMAL(15,2)", "form_group": "details" },
            { "name": "generated_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
        ],
        "form_groups": [
            { "name": "basic", "title": "Analytics Info" },
            { "name": "details", "title": "Report Period" },
            { "name": "access", "title": "Access" }
        ],
        "constraints": [
            {
                "type": "foreignKey", "columns": ["generated_by"], "referencedTable": "Users", "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            },
            { "type": "check", "expression": "metric_type IN ('Lead Conversion','Revenue','Pipeline Value','Customer Retention','Average Deal Size')", "columns": ["metric_type"], "options": ["Lead Conversion", "Revenue", "Pipeline Value", "Customer Retention", "Average Deal Size"] }
        ]
    },
    {
        "tableName": "KPIs",
        "group": "crm9",
        "crud": {
            "create": ["Technical_Solutions"],
            "read": ["Technical_Sales", "Technical_Solutions"],
            "update": ["Technical_Solutions"],
            "delete": ["Technical_Solutions"]
        },
        "columns": [
            { "name": "idx", "type": "INTEGER", "identity": { "seed": 1, "increment": 1 }, "primaryKey": true },
            { "name": "kpi_name", "type": "TEXT(255)", "form_group": "basic" },
            { "name": "target_value", "type": "DECIMAL(15,2)", form:"number" , "form_group": "target" },
            { "name": "actual_value", "type": "DECIMAL(15,2)", form: "number", "form_group": "target" },
            { "name": "period", "type": "TEXT(50)", "form": "select", "form_group": "details" },
            { "name": "assigned_to", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "relation" }
        ],
        "form_groups": [
            { "name": "basic", "title": "KPI Info" },
            { "name": "target", "title": "Values" },
            { "name": "details", "title": "Period" },
            { "name": "relation", "title": "Assigned User" }
        ],
        "constraints": [
            {
                "type": "foreignKey",
                "columns": ["assigned_to"],
                "referencedTable": "Users",
                "referencedColumns": ["idx"],
                OnDeleteAction: "CASCADE",
                OnUpdateAction: "CASCADE"
            }
        ]
    },
    //{
    //    "tableName": "PostDealInteractions",
    //    "group": "crm9",
    //    "crud": {
    //        "create": ["Technical_Solutions", "Technical_Sales"],
    //        "read": ["Technical_Solutions", "Technical_Sales"],
    //        "update": ["Technical_Solutions"],
    //        "delete": ["Admin"]
    //    },
    //    "columns": [
    //        { "name": "idx", "type": "INTEGER", "identity": true, "primary": true, "form_group": "basic" },
    //        { "name": "deal", "type": "INTEGER", "form": "search", "filter": "deal_name", "form_group": "basic" },
    //        { "name": "customer", "type": "INTEGER", "form": "search", "filter": "full_name", "form_group": "basic" },
    //        { "name": "rating", "type": "INTEGER", "form_group": "details" },
    //        { "name": "review_text", "type": "TEXT(255)", "form_group": "details" },
    //        { "name": "company_name", "type": "TEXT(255)", "form_group": "details" },
    //        { "name": "consent_publish", "type": "TEXT(10)", "form_group": "details" },
    //        { "name": "status", "type": "TEXT(255)", "form_group": "details" },
    //        { "name": "created_at", "type": "TEXT(100)", form:"datetime-local", "form_group": "details" },
    //        { "name": "schedule_for", "type": "TEXT(100)", form:"datetime-local", val_eval: `(new Date()).getDate() + 3`, "form_group": "details" },
    //        { "name": "created_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
    //    ], 
    //    "apps": [
    //        {
    //            "name": "Request Deal Review",
    //            "type": "/apps/crm/post-deal-interactions/schedule-deal-review/",
    //            "actions": {
    //                "create": [],
    //                "read": ["PostDealInteractions"],
    //                "update": [],
    //                "delete": []
    //            }
    //        },
    //     ],
    //    "reports": [
    //        {
    //            "name": "Request Deal Review",
    //            "type": "/apps/crm/post-deal-interactions/request-deal-review/",
    //            "actions": {
    //                "create": [],
    //                "read": ["PostDealInteractions"],
    //                "update": [],
    //                "delete": []
    //            },
    //            "services": {
    //                "post": [
    //                    {
    //                        "users": ["Technical_Solutions", "Technical_Sales"],
    //                        "uri": "/crm/pdi/request-deal-review",
    //                        "desc": "Request Deal Review via Email"
    //                    }
    //                ] 
    //            },
    //        }, 
    //     ],
    //    "form_groups": [
    //        { "name": "basic", "title": "Interaction Details" },
    //        { "name": "details", "title": "Review Information" },
    //        { "name": "access", "title": "Access & Ownership" }
    //    ],
    //    "constraints": [
    //        {
    //            type: "default",
    //            expression: "No",
    //            column: "consent_publish"
    //        },
    //        {
    //            type: "default",
    //            expression: "logged",
    //            column: "status"
    //        }, 
    //        {
    //            "type": "foreignKey",
    //            "columns": ["deal"],
    //            "referencedTable": "Deals",
    //            "referencedColumns": ["idx"],
    //            OnDeleteAction: "CASCADE",
    //            OnUpdateAction: "CASCADE"
    //        },
    //        {
    //            "type": "foreignKey",
    //            "columns": ["customer"],
    //            "referencedTable": "Customers",
    //            "referencedColumns": ["idx"],
    //            OnDeleteAction: "CASCADE",
    //            OnUpdateAction: "CASCADE"
    //        },
    //        {
    //            "type": "foreignKey",
    //            "columns": ["created_by"],
    //            "referencedTable": "Users",
    //            "referencedColumns": ["idx"], 
    //            OnDeleteAction: "CASCADE",
    //            OnUpdateAction: "CASCADE"
    //        }, 
    //        {
    //            "type": "check",
    //            "expression": "rating BETWEEN 1 AND 5",
    //            "columns": ["rating"],
    //            "options": ["1", "2", "3", "4", "5"]
    //        },
    //        {
    //            "type": "check",
    //            "expression": "status IN ('logged','published','pending','failed')",
    //            "columns": ["status"],
    //            "options": ["logged", "published", "pending", "failed"]
    //        },
    //        {
    //            "type": "check",
    //            "expression": "consent_publish IN ('Yes','No')",
    //            "columns": ["consent_publish"],
    //            "options": ['Yes', 'No']
    //        }
    //    ]
    //}, 
    //{
    //    "tableName": "PublishedReviews",
    //    "group": "crm9",
    //    "crud": {
    //        "create": ["Technical_Solutions"],
    //        "read": ["Technical_Solutions", "Technical_Sales"],
    //        "update": ["Technical_Solutions"],
    //        "delete": ["Admin"]
    //    },
    //    "columns": [
    //        { "name": "idx", "type": "INTEGER", "identity": true, "primary": true, "form_group": "basic" },
    //        { "name": "postdeal", "type": "INTEGER", "form": "search", "filter": "interaction_name", "form_group": "basic" },
    //        { "name": "platform", "type": "INTEGER", form: "search" , filter:"platform_name", "form_group": "details" }, 
    //        { "name": "status", "type": "TEXT(255)", form: "select", check: true, "form_group": "details" },
    //        { "name": "response_message", "type": "TEXT(255)", "form_group": "details" },
    //        { "name": "published_at", "type": "TEXT(255)", "form": "datetime-local", "form_group": "details" },
    //        { "name": "public_visibility", "type": "TEXT(255)", form: "select", check: true, "form_group": "details" },
    //        { "name": "created_by", "type": "INTEGER", "form": "search", "filter": "email_address", "form_group": "access" }
    //    ],
    //    "form_groups": [
    //        { "name": "basic", "title": "Review Reference" },
    //        { "name": "details", "title": "Publishing Details" },
    //        { "name": "access", "title": "Access & Ownership" }
    //    ],
    //    "constraints": [
    //        {
    //            "type": "foreignKey",
    //            "columns": ["postdeal"],
    //            "referencedTable": "PostDealInteractions",
    //            "referencedColumns": ["idx"],
    //            OnDeleteAction: "CASCADE",
    //            OnUpdateAction: "CASCADE"
    //        },
    //        {
    //            "type": "foreignKey",
    //            "columns": ["created_by"],
    //            "referencedTable": "Users",
    //            "referencedColumns": ["idx"],
    //            OnDeleteAction: "CASCADE",
    //            OnUpdateAction: "CASCADE"
    //        }, 
    //        {
    //            "type": "foreignKey",
    //            "columns": ["platform"],
    //            "referencedTable": "Social_Media_Platforms",
    //            "referencedColumns": ["idx"],
    //            OnDeleteAction: "CASCADE",
    //            OnUpdateAction: "CASCADE"
    //        }, 
    //        {
    //            "type": "check",
    //            "expression": "status IN ('pending','success','failed')",
    //            "columns": ["status"],
    //            "options": ["pending", "success", "failed"]
    //        },
    //        {
    //            "type": "check",
    //            "expression": "public_visibility IN ('Yes','No')",
    //            "columns": ["public_visibility"],
    //            "options": ["Yes", "No"]
    //        }
    //    ]
    //}




    //
];

const jsonDataGroups = [
    { group: "admin" , title: "Admin" , icon: "admin-line" } ,
    { group: "wellness" , title: "Wellness" } ,
    { group: "marketing" , title: "Marketing" } ,
    { group: "analytics" , title: "Analytics" } ,
    { group: "hr" , title: "Human Resources" } ,
    { group: "accounting", title: "Accounting" },
    { group: "ecommerce", title: "Ecommerce" },
    { group: "payments", title: "Payments" },
    { group: "iot", title: "Internet Of Things" } , 
    { group: "ai", title: "Artificial Intelligence" },
    { group: "chat", title: "Chat" },

    { group: "crm", title: "CRM" } , 
    { group: "crm1", title: "CRM - Settings" } , 
    { group: "crm2", title: "CRM - Cores" } , 
    { group: "crm3", title: "CRM - Sales" } , 
    { group: "crm4", title: "CRM - Marketing" } , 
    { group: "crm5", title: "CRM - Projects" } , 
    { group: "crm6", title: "CRM - Proposals" } , 
    { group: "crm7", title: "CRM - Sales" } , 
    { group: "crm8", title: "CRM - Support" } , 
    { group: "crm9", title: "CRM - Analytics" } , 
];

const ui_designs = true ? [] : [
    // TYG
    {
        group:"tyg" ,
        title: "trotyourglobe Client",
        url: "https://trotyourglobe.com/"
    },
    {
        group: "tyg",
        title: "trotyourglobe Admin",
        url: "https://trot-your-globe-admin.fly.dev"
    },
    {
        group: "tyg",
        title: "Fitness UIUX Mobile App",
        url: "https://smthubakgale.github.io/Resposinator/?orientation=portrait&device=iPhone 12&tevroc=true&url=https%3A%2F%2Fadminuiux.com%2Fadminuiux%2Ffitness-mobile-uiux%2Ffitness-splash.html"
    },
    {
        group: "tyg",
        title: "MobioKit",
        url: "https://smthubakgale.github.io/Resposinator/?orientation=portrait&device=iPhone 12&tevroc=true&url=https%3A%2F%2Fsindevo.com%2Fmobiokit%2Fdemos%2Fmain%2Fmain.html%23"
    },
    {
        group: "tyg",
        title: "Coffe Shop",
        url: "https://smthubakgale.github.io/Resposinator/?orientation=portrait&device=iPhone 12&tevroc=true&url=https%3A%2F%2Fombe.dexignzone.com%2Fxhtml%2F%23!%2Fwelcome%2F"
    },
    {
        group: "tyg",
        title: "Events",
        url: "https://demo.gloriathemes.com/eventchamp/demo/categorized-events-1/"
    },
    // CRM 
    {
        group: "crm",
        title: "CRMS",
        url: "https://crms.dreamstechnologies.com/html/template/contacts.html"
    },
    {
        group: "crm",
        title: "Smart HR",
        url: "https://smarthr.co.in/demo/html/template/contacts-grid"
    },
];

let ui_groups = [
    {group:"tyg" , title : "TrotYourGlobe" } ,
    {group:"crm" , title : "CRM Application" } ,
]

const user_management = [
    {
        "page": "registered",
        "users": user_inherits.map(u => u.user)
    },
    // system 
    {
        "page": "index",
        "phase": "design", 
        "users": ["default"],
        "modals": [
            "Cart",
            "Notifications",
            "Profile",
            "Search"
        ],
        "sections": [
        ],
        "actions": {
            "create": [],
            "read": ["Products","Training_Session"],
            "update": [],
            "delete": []
        },
        "algorithms": [
            {
                "users": ["default"],
                "inherit": true,
                "title": "http intercept",
                "desc": "Intercept HTTP or Fetch request \n Override the host"
            }
        ],
        "services": {
            "tcp": [
                {
                    "users": ["Customer", "Corporate_Customer"],
                    "inherit": true,
                    "uri": "/payment/notifications",
                    "desc": "Payment Status Notifications"
                },
                {
                    "users": ["Customer", "Corporate_Customer"],
                    "inherit": true,
                    "uri": "/calendar/notifications/upcoming",
                    "desc": "Calendar Upcoming Session"
                },
                {
                    "users": ["Customer", "Corporate_Customer"],
                    "inherit": true,
                    "uri": "/subscription/notifications/expiration",
                    "desc": "Subscription Expiration"
                }
            ],
            "get": [
                // administration 
                {
                    "users": ["Admin", "Technical_Sales" , "Technical_Solutions"],
                    "inherit": true,
                    "uri": "/database/tables",
                    "desc": "List Database Administration Tables"
                }, 
                // notifications
                {
                    "users": ["Customer", "Corporate_Customer"],
                    "inherit": true,
                    "uri": "/bridge/notifications",
                    "desc": "Payment Status Notifications"
                },
                {
                    "users": ["Customer", "Corporate_Customer"],
                    "inherit": true,
                    "uri": "/bridge/calendar/notifications/upcoming",
                    "desc": "Calendar Upcoming Session"
                },
                {
                    "users": ["Customer", "Corporate_Customer"],
                    "inherit": true,
                    "uri": "/bridge/subscription/notifications/expiration",
                    "desc": "Subscription Expiration"
                }
            ]
        }
    },
    {
        "page": "home",
        "phase" : "data" ,  
        "actions": {
            "create": [
                { "table": "Product_Cart", "users": [] },
                { "table": "Favourites", "users": [] }
            ],
            "read": [
                { "table": "Divisions", "users": ["default"] },
                { "table": "Groups", "users": ["default"] }, 
                { "table": "Programmes", "users": [] },

                { "table": "Brands", "users": [] },
                { "table": "Promotion_Items", "users": [] },
                { "table": "Product_Cart", "users": [] },
                { "table": "Promotions", "users": [] },
                { "table": "Favourites", "users": ["Customer" , "Corporate_Customer"] }
            ],
            "update": [
                { "table": "Product_Cart", "users": [] },
                { "table": "Favourites", "users": [] }
            ],
            "delete": []
        },
        "services": {
            "get": [
                {
                    "users": ["default"],
                    "uri": "/email/subscription",
                    "desc": "Subscribe for Email Marketing"
                }
            ]
        }
    },

    {
        "page": "database",
        "phase": "design",  
        "algorithms": [
         {
            "users": [ "Admin" , "Technical_Sales" , "Technical_Solutions"],
            "title": "Form Generator",
            "desc": "Generate Dynamic \\n forms from Database Configuration"
        }]
    },

    {
        "page": "404",
        "users": ["default"],
        "phase": "auth",
        "static": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "serverDown",
        "users": ["default"],
        "phase": "auth",
        "static": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "notAuthorized",
        "users": ["default"],
        "phase": "auth",
        "static": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
     
    {
        "page": "register", 
        "phase": "auth", 
        "services": {
            "get": [{
                "users": ["default"],
                "inherit":false ,
                "uri": "/register",
                "desc": "Register \\n new user",
                "interaction": `
sequenceDiagram
    participant User as "User"
    participant Frontend as "Frontend"
    participant Backend as "Backend"
    participant Database as "Database"

    User->>Frontend: Enter registration details
    Frontend->>Backend: Send registration request
    note left of Backend: "/register"
    Backend->>Backend: Validate user input
    alt Input valid
        Backend->>Database: Check if user already exists
        Database->>Backend: Return existence result
        alt User does not exist
            Backend->>Database: Create new user account
            Database->>Backend: Return creation result
            alt Creation successful
                Backend->>Backend: Generate session token
                Backend->>Database: Store session token
                Backend->>Frontend: Return session token and registration success message
                Frontend->>Frontend: Store session token in local storage
                Frontend->>User: Display registration success message
                Frontend->>Frontend: Redirect to dashboard page
            else Creation failed
                Backend->>Frontend: Return error message
                Frontend->>User: Display error message
            end
        else User already exists
            Backend->>Frontend: Return error message (user already exists)
            Frontend->>User: Display error message
        end
    else Input invalid
        Backend->>Frontend: Return error message (invalid input)
        Frontend->>User: Display error message
    end
`
            },
            {
                "users": ["default"],
                "inherit":false ,
                "uri": "/register/company",
                "desc": "Register \\n new company",
                "interaction": `
sequenceDiagram
    participant User as "User"
    participant Frontend as "Frontend"
    participant Backend as "Backend"
    participant Database as "Database"

    User->>Frontend: Enter registration details
    Frontend->>Backend: Send registration request
    note left of Backend: "/register/company"
    Backend->>Backend: Validate user input
    alt Input valid
        Backend->>Database: Check if user already exists
        Database->>Backend: Return existence result
        alt User does not exist
            Backend->>Database: Create new user account
            Database->>Backend: Return creation result
            alt Creation successful
                Backend->>Backend: Generate session token
                Backend->>Database: Store session token
                Backend->>Frontend: Return session token and registration success message
                Frontend->>Frontend: Store session token in local storage
                Frontend->>User: Display registration success message
                Frontend->>Frontend: Redirect to dashboard page
            else Creation failed
                Backend->>Frontend: Return error message
                Frontend->>User: Display error message
            end
        else User already exists
            Backend->>Frontend: Return error message (user already exists)
            Frontend->>User: Display error message
        end
    else Input invalid
        Backend->>Frontend: Return error message (invalid input)
        Frontend->>User: Display error message
    end
`
            },
            {
                "users": ["default"],
                "inherit":false ,
                "uri": "/register/member",
                "desc": "Register \\n new company member",
                "interaction": `
sequenceDiagram
    participant User as "User"
    participant Frontend as "Frontend"
    participant Backend as "Backend"
    participant Database as "Database"

    User->>Frontend: Enter registration details
    Frontend->>Backend: Send registration request
    note left of Backend: "/register/member"
    Backend->>Backend: Validate user input
    alt Input valid
        Backend->>Database: Check if user already exists
        Database->>Backend: Return existence result
        alt User does not exist
            Backend->>Database: Create new user account
            Database->>Backend: Return creation result
            alt Creation successful
                Backend->>Backend: Generate session token
                Backend->>Database: Store session token
                Backend->>Frontend: Return session token and registration success message
                Frontend->>Frontend: Store session token in local storage
                Frontend->>User: Display registration success message
                Frontend->>Frontend: Redirect to dashboard page
            else Creation failed
                Backend->>Frontend: Return error message
                Frontend->>User: Display error message
            end
        else User already exists
            Backend->>Frontend: Return error message (user already exists)
            Frontend->>User: Display error message
        end
    else Input invalid
        Backend->>Frontend: Return error message (invalid input)
        Frontend->>User: Display error message
    end
`
            }
            ]
        },
        "algorithms": [
            {
                "users": ["default"],
                "inherit": false,
                "title": "Session",
                "desc": "Create User Session",
                "interaction": `
sequenceDiagram
    participant U as User
    participant C as Client (Browser/App)
    participant S as Server

    U->>C: Login / Request Session
    C->>S: Send credentials (username/password)
    S-->>C: Return encrypted session token
    C->>C: Store token in localStorage

    loop On every request
        U->>C: Perform action (e.g., fetch data)
        C->>S: Request with token as query parameter<br/>GET /api/resource?token=ENC_SESSION
        S-->>C: Respond with data (validated using token)
    end

`
            }
        ]
    },
    // /auth-link
    {
        "page": "email-auth", 
        "phase": "auth", 
        "services": {
            "get": [ 
              {
                "users": ["default"],
                "inherit": false,
                "uri": "/auth-link",
                "desc": "authenticate Account \\n from email link",
                
              }
            ]
        }
    },
    {
        "page": "two-factor-auth", 
        "phase": "auth",
        "services": {
            "get": [
                {
                    "users": ["default"],
                    "inherit": false,
                    "uri": "/auth-otp",
                    "desc": "authenticate Account \\n via email OTP",

                }
            ]
        }
    },
    {
        "page": "login",
        "phase": "auth",  
        "services": {
            "get": [{
                "users": ["default"],
                "inherit":false , 
                "uri": "/login",
                "desc": "Authenticate \\n existing user",
                "interaction": `
sequenceDiagram
    participant User as "User"
    participant Frontend as "Frontend"
    participant Backend as "Backend"
    participant Database as "Database"

    User->>Frontend: Enter login credentials
    Frontend->>Backend: Send login request
    note left of Backend: "/login"
    Backend->>Database: Verify credentials
    Database->>Backend: Return verification result
    alt Credentials valid
        Backend->>Backend: Generate session token
        Backend->>Database: Store session token
        Backend->>Frontend: Return session token
        Frontend->>Frontend: Store session token in local storage
        Frontend->>User: Display login success message
        Frontend->>Frontend: Redirect to dashboard page
    else Credentials invalid
        Backend->>Frontend: Return error message
        Frontend->>User: Display error message
    end
`
            }]
        },
        "algorithms": [
            {
                "users": ["default"],
                "inherit": false,
                "title": "Session Generator",
                "desc": "Generate and Store Session ID"
            }]
    }, 
    {
        "page": "onboarding",
        "phase": "auth", 
        "services": {
            "get": [{
                "users": onboarding_users,
                "inherit": false,
                "uri": "/onboard",
                "desc": "Onboard \\n new user",
                
            }]
        },
    },

    {
        "page": "profile",
        "users": ["Customer"],
        "inherit": false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    }, 
    {
        "page": "profile-trainer",
        "users": ["Fitness_Instructor"],
        "inherit":false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    }, 
    {
        "page": "profile-physio",
        "users": ["Consulting_Physician"],
        "inherit":false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    }, 
    {
        "page": "profile-admin",
        "users": ["Admin"],
        "inherit":false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    }, 
    {
        "page": "profile-developer",
        "users": ["Technical_Solutions"],
        "inherit": false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    }, 
    {
        "page": "profile-director",
        "users": ["Managing-Director"],
        "inherit": false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    }, 
    {
        "page": "profile-manager",
        "users": ["IT-Manager"],
        "inherit": false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },   
    {
        "page": "profile-sales",
        "users": ["Technical_Sales"],
        "inherit": false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    }, 
    {
        "page": "profile-settings",
        "users": ["Customer", "Corporate_Client", "Technical_Sales", "Technical_Solutions"],
        "inherit": false,
        "phase": "auth",
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "services": {
            "get": [{
                "users": ["Customer", "Corporate_Client", "Admin", "Technical_Sales", "Technical_Solutions"],
                "uri": "/update-profile",
                "desc": "Update \\n existing user",
                "interaction": `
sequenceDiagram
    participant User as "User"
    participant Frontend as "Frontend"
    participant Backend as "Backend"
    participant Database as "Database"

    User->>Frontend: Open profile page and edit details
    Frontend->>Backend: Send update profile request with session token
    note left of Backend: "/update-profile \\n Validate session token"
    alt Session valid
        Backend->>Database: Update user details
        Database->>Backend: Return update status
        alt Update successful
            Backend->>Frontend: Return success message
            Frontend->>User: Display update success message
            Frontend->>Frontend: Optionally refresh profile data
        else Update failed
            Backend->>Frontend: Return error message
            Frontend->>User: Display error message
        end
    else Session expired / invalid
        Backend->>Frontend: Return "session expired" response
        Frontend->>User: Display session expired message
        Frontend->>Frontend: Redirect to login page
        Frontend->>Frontend: Optionally cache unsaved profile changes
    end

`
            },
            {
                "users": ["Customer", "Corporate_Client", "Admin", "Technical_Sales", "Technical_Solutions"],
                "uri": "/get-user",
                "phase": "auth",
                "desc": "Get user info",
                "interaction": `
sequenceDiagram
participant User as "User"
participant Frontend as "Frontend"
participant Backend as "Backend"
participant Database as "Database"

User->>Frontend: Click "View Profile" or open profile page
Frontend->>Backend: Send request for profile info with session token
note left of Backend: "/get-user \\n Validate session token"
alt Session valid
    Backend->>Database: Fetch user profile data
    Database->>Backend: Return profile data
    Backend->>Frontend: Return profile data
    Frontend->>User: Display profile information
else Session expired / invalid
    Backend->>Frontend: Return "session expired" response
    Frontend->>User: Display session expired message
    Frontend->>Frontend: Redirect to login page
end

`
            },
            {
                "users": ["Customer", "Corporate_Client", "Admin", "Technical_Sales", "Technical_Solutions"],
                "uri": "/delete-file",
                "desc": "Remove profile pic",
                "interaction": `
sequenceDiagram
    participant User as "User"
    participant Frontend as "Frontend"
    participant Backend as "Backend"
    participant Database as "Database"
    participant Storage as "Storage"

    User->>Frontend: Click "Remove Profile Picture"
    Frontend->>Backend: Send remove profile picture request with session token
    note left of Backend: "/delete-file \\n Validate session token"
    alt Session valid
        Backend->>Database: Update user record to remove profile pic reference
        Database->>Backend: Return update status
        alt Removal successful
            Backend->>Storage: Delete profile picture file
            Storage->>Backend: Confirm deletion
            Backend->>Frontend: Return success message
            Frontend->>User: Display profile picture removed message
        else Removal failed
            Backend->>Frontend: Return error message
            Frontend->>User: Display error message
        end
    else Session expired / invalid
        Backend->>Frontend: Return "session expired" response
        Frontend->>User: Display session expired message
        Frontend->>Frontend: Redirect to login page
    end

`
            }
            ]
        }
    },
    {
        "page": "logout",
        "users": user_inherits.filter(u => u.user != "default").map(u => u.user),
        "phase": "auth",
        "static" : true , 
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-admin",
        "phase": "auth",
        "users": ["Admin"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-company",
        "phase": "auth",
        "users": ["Corporate_Client"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-customer",
        "phase": "auth",
        "users": ["Customer"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-developer",
        "phase": "auth",
        "users": ["Technical_Solutions", "Technical_Support"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-director",
        "phase": "auth",
        "users": ["Managing_Director"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-hr",
        "phase": "auth",
        "users": ["Human_Resource"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-manager",
        "phase": "auth",
        "users": ["Managing_Director"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-member",
        "phase": "auth",
        "users": ["Corporate_Customer"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-nutritionist",
        "phase": "auth",
        "users": ["Nutritionist"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-sales",
        "phase": "auth",
        "users": ["Technical_Sales"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-therapist",
        "phase": "auth",
        "users": ["Consulting_Professional"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "dashboard-trainer",
        "phase": "auth",
        "users": ["Fitness_Instructor"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },

    {
        "page": "calendar",
        "phase": "data",
        "users": ["Customer", "Corporate_Customer", "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "training",
        "phase": "data",
        "users": ["default", "Customer", "Corporate_Customer" , "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "training-details",
        "phase": "data",
        "users": ["default", "Customer", "Corporate_Customer" , "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "wellness-club",
        "phase": "data",
        "users": ["default", "Customer", "Corporate_Customer" , "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "booking-details",
        "phase": "data",
        "users": ["default", "Customer", "Corporate_Customer" , "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "weekly-plan",
        "phase": "data",
        "users": ["Customer", "Corporate_Customer" , "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "session",
        "phase": "data",
        "users": ["default" , "Customer", "Corporate_Customer" , "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "session2",
        "phase": "data",
        "users": ["default" , "Customer", "Corporate_Customer" , "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "subscribe",
        "phase": "data",
        "users": ["Customer", "Corporate_Customer" , "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    // client app
    {
        "page": "store",
        "users": ["default"],
        "phase" : "data" ,
        "actions": {
            "create": [],
            "read": ["Store_Details", "Store_Operating_Hours"],
            "update": [],
            "delete": []
        },
        "files": {
            "create": [],
            "read": [ "Store_Details" ],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "store_navigation",
        "users": ["default"],
        "phase" : "data" ,
        "actions": {
            "create": [],
            "read": ["Store_Details"],
            "update": [],
            "delete": []
        },
        "files": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },

        "services": {
            "get": [
             {
                "users": ["default"],
                "uri": "https://www.openstreetmap.org/directions",
                "desc": "Leaflet Directions \\n API",
                "interaction": `
sequenceDiagram
    participant U as User
    participant M as Leaflet Map
    participant N as Navigation API (Routing)
    participant S as Map Tiles / Layers

    U->>M: Pan / Zoom / Click on map
    M->>S: Request map tiles/layers
    S-->>M: Return rendered tiles

    U->>M: Request directions (Start ? End)
    M->>N: Send routing request with coordinates
    N-->>M: Return route (steps, geometry, ETA)

    M->>M: Render route polyline on map
    M->>M: Show markers (start, end, waypoints)
    M->>U: Display navigation results (map + instructions)

`
            },
            {
                "users": ["default"],
                "uri": "https://www.google.com/maps/dir",
                "desc": "Directions \\n API",
                "interaction": `
sequenceDiagram
    participant U as User
    participant GMap as Google Maps JS SDK
    participant GDir as Google Directions API
    participant GGeo as Google Geocoding API
    participant S as Map Tiles / Data

    U->>GMap: Open map (pan, zoom, click)
    GMap->>S: Request map tiles
    S-->>GMap: Return rendered tiles

    U->>GMap: Enter destination address
    GMap->>GGeo: Request geocode for address
    GGeo-->>GMap: Return coordinates (lat/lng)

    GMap->>GDir: Request directions (start ? destination)
    GDir-->>GMap: Return route (polyline, steps, ETA)

    GMap->>GMap: Render route polyline on map
    GMap->>GMap: Display step-by-step instructions
    GMap->>U: Show navigation results (map + instructions)

    U->>GMap: Start navigation (turn-by-turn)
    GMap->>U: Update live position, reroute if necessary

`
            }
            ]
        },
    },
    {
        "page": "collections",
        "users": ["default"],
        "phase" : "data" ,
        "actions": {
            "create": [],
            "read": ["Departments", "Categories", "Promotions", "Favourites", "Product_Rating" ],
            "update": [],
            "delete": []
        },
        "files": {
            "create": [],
            "read": [ "Categories" ],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "products",
        "phase": "data",
        "users": ["default"],
        "actions": {
            "create": ["Product_Cart", "Favourites"],
            "read": ["Product_Colors", "Product_Color_Items", "Product_Materials", "Material_Items", "Product_Cart", "Favourites", "Product_Rating" ],
            "update": ["Product_Cart", "Favourites"],
            "delete": ["Product_Cart", "Favourites" ]
        }
    }, 
    {
        "page": "product-details",
        "phase": "data",
        "users": ["Customer", "Corporate_Customer", "Corporate_Client"],
        "inherit": true,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "product",
        "phase": "data",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": ["Product_Colors", "Product_Color_Items", "Product_Materials", "Material_Items", "Product_Cart", "Favourites" , "Product_Rating", "Product_Reviews"],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "cart",
        "phase": "data",
        "users": ["Customer","Corporate_Customer"],
        "actions": {
            "create": ["Product_Cart"],
            "read": ["Product_Cart"],
            "update": ["Product_Cart"],
            "delete": ["Product_Cart"]
        }
    },
    {
        "page": "checkout",
        "phase": "data",
        "users": ["Corporate_Client", "Customer"],
        "actions": {
            "create": [],
            "read": ["Product_Cart", "Checkout_Addresses"],
            "update": ["Product_Cart", "User_Payments"],
            "delete": []
        }
    },
    {
        "page": "checkout-status",
        "phase": "data",
        "users": ["Corporate_Client", "Customer"],
        "actions": {
            "create": [],
            "read": ["Product_Cart", "Checkout_Addresses"],
            "update": ["Product_Cart", "User_Payments"],
            "delete": []
        }
    },

    {
        "page": "order-history",
        "phase": "data",
        "users": ["Customer", "Corporate_Client"],
        "actions": {
            "create": [],
            "read": ["Product_Cart"],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "payment-history",
        "phase": "data",
        "users": ["Customer", "Corporate_Client"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },

    {
        "page": "address-book",
        "phase": "data",
        "users": ["Customer", "Corporate_Client"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },

    {
        "page": "wishlist",
        "phase": "data",
        "users": ["Customer", "Corporate_Client"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },

    {
        "page": "faqs",
        "phase": "content",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "support_chat",
        "phase": "support",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": ["Notifications", "Support_Chat", "Users"],
            "update": [],
            "delete": []
        },
        "files": {
            "create": [],
            "read": ["Users"],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "ml-train",
        "phase": "support",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": ["Technical_Support"],
            "update": [],
            "delete": []
        },
        "files": {
            "create": [],
            "read": ["Users"],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "notifications",
        "phase": "support",
        "users": ["Customer" , "Corporate_Customer"],
        "actions": {
            "create": [],
            "read": ["Notifications" ],
            "update": [],
            "delete": []
        }
    },


    {
        "page": "terms-of-use",
        "phase": "content",
        "static": true,
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "disclaimer",
        "phase": "content",
        "static": true,
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "privacy-policy",
        "phase": "content",
        "static": true,
        "users": ["default"], 
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "shipping-policy",
        "phase": "content",
        "static": true,
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },

    {
        "page": "about",
        "phase": "content",
        "static": true , 
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },

    {
        "page": "verifyEmail",
        "phase": "content", 
        "users": user_inherits.map(u => u.user),
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },

    {
        "page": "blogs",
        "phase": "content",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [ "Blogs" ],
            "update": [],
            "delete": []
        },
        "files": {
            "create": [],
            "read": [ "Blogs" ],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "blog-overview",
        "phase": "content",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": ["Blogs" ],
            "update": [],
            "delete": []
        },
        "files": {
            "create": [],
            "read": ["Blogs"],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "events-calendar",
        "phase": "content",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": ["Event_Categories", "Events"],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "event-details",
        "phase": "content",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": ["Event_Categories", "Events"],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "affiliate-program",
        "phase": "integration",
        "users": ["default"],
        "actions": {
            "create": ["Affiliate_Application_Responses"],
            "read": ["Affiliate_Applications"],
            "update": [],
            "delete": []
        },
        "services": {
            "get": [{
                "users": ["default"],
                "uri": "/register-corporate",
                "desc": "Register \\n new Corporate_Client",
                "interaction": `

`
            }
            ]
        },
    },
    {
        "page": "rewards",
        "phase": "integration",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [ "Promotions" , "Promotion_Items"],
            "update": [],
            "delete": []
        },
        "files": {
            "create": [],
            "read": [ "Promotions"],
            "update": [],
            "delete": []
        }, 
    },
    {
        "page": "careers",
        "phase": "content",
        "users": ["default"],
        "desc": "advertise Affiliate Posts",
        "actions": {
            "create": ["Job_Application_Responses"],
            "read": ["Job_Applications"],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "job-description",
        "phase": "content",
        "users": ["default"],
        "desc": "advertise Affiliate Posts",
        "actions": {
            "create": ["Job_Application_Responses"],
            "read": ["Job_Applications"],
            "update": [],
            "delete": []
        }
    }, 
    {
        "page": "job-applications",
        "phase": "content",
        "users": ["Human_Resource"],
        "desc": "advertise Affiliate Posts",
        "actions": {
            "create": [],
            "read": [],
            "update": ["Job_Applications"],
            "delete": []
        }
    },
    {
        "page": "job-posts",
        "phase": "content",
        "users": ["Human_Resource"],
        "desc": "advertise Affiliate Posts",
        "actions": {
            "create": [],
            "read": [],
            "update": ["Job_Applications"],
            "delete": []
        }
    },
    {
        "page": "contact",
        "phase": "content",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "customer-support",
        "phase": "content",
        "users": ["Customer", "Corporate_Client"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "account",
        "phase": "data",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    // chat app 
    {
        "page": "videostream-trainer",
        "phase": "chat",
        "users": ["Fitness_Instructor"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "videostream-trainer-client",
        "phase": "chat",
        "users": ["Fitness_Instructor" , "Customer", "Corporate_Customer", "Corporate_Client"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "videostream-trainer",
        "phase": "chat",
        "users": ["Customer", "Corporate_Customer", "Corporate_Client"],
        "inherit": false,
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "chats",
        "phase": "chat",
        "users": ["Customer", "Corporate_Customer", "Corporate_Client"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "voice-call",
        "phase": "chat",
        "users": ["Customer", "Corporate_Customer", "Corporate_Client"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "video-call",
        "phase": "chat",
        "users": ["Customer", "Corporate_Customer", "Corporate_Client"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    // admin app 
    {
        page: "overview",
        "phase": "logic",
        users: [ "Managing_Director" ] ,
        action: {
            "create": [],
            "read": [],
            "update": [],
            "delete": [],
            "transmit": []
        }
    },
    {
        page: "users",
        "phase": "logic",
        users: ["*"],
        excludes: [ "default" ] ,
        inherits: true ,  
        action: {
            "create": [],
            "read": [],
            "update": [],
            "delete": [],
            "transmit": [],
            "report" : []
        }
    },
    {
        "page": "members",
        "phase": "integration",
        "users": ["Fitness_Instructor"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "services": {
            "get": [{
                "users": ["Fitness_Instructor"],
                "uri": "/create-member",
                "desc": "Create \\n new Member",
                "interaction": `

`
            },{
                "users": ["Fitness_Instructor"],
                "uri": "/read-member",
                "desc": "Read \\n existing Member",
                "interaction": `

`
            }, {
                "users": ["Fitness_Instructor"],
                "uri": "/update-member",
                "desc": "Update \\n existing Member",
                "interaction": `

`
            }
            ]
        }
    },
    {
        "page": "subscriptions",
        "phase": "data",
        "users": ["Corporate_Client", "Customer"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        }
    },
    {
        "page": "tax-invoice",
        "phase": "reporting",
        "users": ["Managing_Director"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "algorithms": [
            {
                "title": "Tax nvoice Generator",
                "desc": "Generate Tax Invoice"
            }]
    },
    // crm app 
    //{
    //    "page": "crm-post-deal-review",
    //    "users": ["Corporate_Customer"],
    //    "phase": "crm-post-deal",
    //    "inherit": false,
    //    "actions": {
    //        "create": [],
    //        "read": ["PostDealInteractions"],
    //        "update": ["PostDealInteractions"],
    //        "delete": []
    //    },
    //},
    // mobile  
    {
        "page": "more",
        "phase": "design",
        "users": ["default"],
        "actions": {
            "create": [],
            "read": [],
            "update": [],
            "delete": []
        },
        "services": {
            "get": [{
                "users": ["Admin"], 
                "uri": "/database/tables",
                "desc": "Get a list of \\n authorised tables",
                "interactions": ``
            }]
        }
    },
    // ...  
];

const server_management = [];

const project_management = [
    { phase: "design", title: "Design" },                  // wireframes, prototypes, UI/UX
    { phase: "auth", title: "Authentication" },            // login, register, sessions
    { phase: "user_mn", title: "User Management" },        // roles, permissions, accounts
    { phase: "data", title: "Data Management" },           // schema, models, CRUD
    { phase: "chat", title: "Chat Application" },          // chat 
    { phase: "logic", title: "Business Logic" },           // rules, workflows, algorithms
    { phase: "integration", title: "Integrations & APIs" },// external services, payments, APIs
    { phase: "content", title: "Static Content" },         // policies, about, blogs, FAQs
    { phase: "reporting", title: "Reporting & Analytics" },// dashboards, invoices
    { phase: "testing", title: "Testing & QA" },           // unit, integration, UAT
    { phase: "deployment", title: "Deployment" },          // release, hosting, CI/CD
    { phase: "support", title: "Support & Notifications" } // customer support, updates, fixes
];

function management_schema() {

    var ret = {};

    user_management.forEach((page) => {
        ret[page.page] = { "users": page.users, "actions": page.actions, "services": page.services };
    });

    server_management.forEach((page) => {
        ret[page.page] = { "users": page.users, "actions": page.actions, "services": page.services };
    });

    return ret;
}

module.exports = { usersData, jsonDataArray, jsonDataGroups, user_inherits, getInheritedUsers, getParentUser, user_management, server_management, management_schema, ui_designs, project_management, mvc_Frameworks, ui_groups, onboarding_users};