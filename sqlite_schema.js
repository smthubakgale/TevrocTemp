const readline = require('readline');

const ExcelJS = require('exceljs');
const {FileDialog} = require('./dialog');
const { dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const cf = require("../../config.js");
const config = require("../../desktop/sqlserver_config");
const sqltype = require("../data/sqldatatype");

const sql = require("../../desktop/sqlserver_helper");
const sqlite3 = require('sqlite3').verbose();
const { jsonDataArray  } = require('../../models/data/database');


class DatabaseSchemaManager {
    constructor(pool) {
      this.db = pool;
    }
    //: performance   
    shrinkTransactionLog(callback = (err, result) => { }, mLogs = () => { }) {

        let ts = this;

        if (cf.SQL == "SqLite") {

            ts.db.run("VACUUM;", [], (err) => {
                if (err) {
                    callback(err);
                } else {
                    mLogs("SQLite database vacuum completed");
                    callback(null, { message: "Database vacuumed (shrink complete)" });
                }
            });

        }
        else if (cf.SQL == "SqlServer") {

            const query = `
                DECLARE @logfile NVARCHAR(200);
                SELECT @logfile = name 
                FROM sys.database_files 
                WHERE type_desc = 'LOG';

                DBCC SHRINKFILE (@logfile, 1);
            `;

            ts.db.request().query(query)
                .then(() => {
                    mLogs("SQL Server transaction log shrunk");
                    callback(null, { message: "SQL Server transaction log shrink complete" });
                })
                .catch(err => {
                    callback(err);
                });

        }
    }
    //: growth 
    growDatabase(callback = (err, result) => { }, mLogs = () => { }) {
        let ts = this;

        if (cf.SQL == "SqLite") {

            try {
                const dbPath = ts.db.filename || ts.dbPath || "database.sqlite";
                const stats = fs.statSync(dbPath);

                const currentSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

                ts.db.get("PRAGMA page_size;", (err, pageSizeRow) => {
                    if (err) return callback(err);

                    const pageSize = pageSizeRow.page_size;

                    ts.db.get("PRAGMA max_page_count;", (err, maxPageRow) => {
                        if (err) return callback(err);

                        const maxPages = maxPageRow.max_page_count;
                        const maxSizeMB = ((maxPages * pageSize) / (1024 * 1024)).toFixed(2);

                        const info = {
                            FileName: dbPath,
                            CurrentSizeMB: currentSizeMB,
                            MaxSizeMB: maxSizeMB,
                            GrowthType: "Automatic (SQLite grows file as needed)"
                        };

                        mLogs({ Y: "Database growth info:" });
                        mLogs(info);

                        callback(null, info);
                    });
                });

            } catch (e) {
                callback(e);
            }

        }
        else if (cf.SQL == "SqlServer") {

            const query = `
        SELECT 
            name AS FileName,
            size * 8 / 1024 AS CurrentSizeMB,
            CASE 
                WHEN max_size = -1 THEN 'Unlimited'
                ELSE CAST(max_size * 8 / 1024 AS VARCHAR)
            END AS MaxSizeMB,
            CASE 
                WHEN is_percent_growth = 1 
                    THEN CAST(growth AS VARCHAR) + '%'
                ELSE CAST(growth * 8 / 1024 AS VARCHAR) + ' MB'
            END AS GrowthType
        FROM sys.database_files
        `;

            ts.db.request().query(query)
                .then(result => {

                    const info = result.recordset;

                    mLogs({ Y: "Database growth info:" });
                    mLogs(info);

                    callback(null, info);

                })
                .catch(err => {
                    callback(err);
                });

        }
    }
    //: foreignkey
    sortTablesByForeignKeys(jsonDataArray) {

        const tables = jsonDataArray.map(t => t.tableName);

        const graph = {};
        const inDegree = {};

        // init
        tables.forEach(t => {
            graph[t] = [];
            inDegree[t] = 0;
        });

        // -----------------------------
        // BUILD DEPENDENCY GRAPH
        // -----------------------------
        jsonDataArray.forEach(tb => {

            const table = tb.tableName;
            const constraints = tb.constraints || [];

            constraints.forEach(c => {

                if (c.type === "foreignKey" && c.referencedTable) {

                    const parent = c.referencedTable;

                    if (!graph[parent] || !graph[table]) return;

                    // child depends on parent
                    graph[table].push(parent);
                }
            });
        });

        // -----------------------------
        // IN-DEGREE CALCULATION
        // -----------------------------
        Object.keys(graph).forEach(table => {
            graph[table].forEach(parent => {
                inDegree[table]++;
            });
        });

        // -----------------------------
        // TOPOLOGICAL SORT
        // -----------------------------
        const queue = [];
        const sortedNames = [];

        Object.keys(inDegree).forEach(t => {
            if (inDegree[t] === 0) queue.push(t);
        });

        while (queue.length) {

            const current = queue.shift();
            sortedNames.push(current);

            Object.keys(graph).forEach(child => {

                if (graph[child].includes(current)) {
                    inDegree[child]--;

                    if (inDegree[child] === 0) {
                        queue.push(child);
                    }
                }
            });
        }

        // -----------------------------
        // CYCLE SAFETY (preserve remaining order)
        // -----------------------------
        if (sortedNames.length !== tables.length) {
            const missing = tables.filter(t => !sortedNames.includes(t));
            sortedNames.push(...missing);
        }

        // -----------------------------
        // RETURN ORIGINAL OBJECTS ONLY REORDERED
        // -----------------------------
        const map = new Map(
            jsonDataArray.map(t => [t.tableName, t])
        );

        return sortedNames.map(name => map.get(name));
    }
    //: back-up 
    async exportDatabaseToExcel(callback = () => { }, mLogs = () => { }) {
        let ts = this;

        try {

            mLogs("Opening save dialog...");

            const result = await dialog.showSaveDialog({
                title: "Export Database",
                defaultPath: path.join(require("os").homedir(), "Downloads", "tyg.xlsx"),
                filters: [{ name: "Excel File", extensions: ["xlsx"] }]
            });

            if (result.canceled || !result.filePath) {
                mLogs("Export cancelled");
                return;
            }

            let filePath = result.filePath;

            if (!filePath.endsWith(".xlsx")) {
                filePath += ".xlsx";
            }

            const workbook = new ExcelJS.Workbook();

            // =========================
            // SQLITE EXPORT
            // =========================
            if (cf.SQL == "SqLite") {

                const tables = await new Promise((resolve, reject) => {
                    ts.db.all(
                        `SELECT name as TABLE_NAME 
                     FROM sqlite_master 
                     WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
                        (err, rows) => err ? reject(err) : resolve(rows)
                    );
                });

                // ? sort alphabetically
                tables.sort((a, b) =>
                    a.TABLE_NAME.localeCompare(b.TABLE_NAME)
                );

                for (const table of tables) {

                    const tableName = table.TABLE_NAME;
                    const sheet = workbook.addWorksheet(tableName);

                    // ? get metadata PER TABLE (FIXED)
                    const tbMeta = jsonDataArray.find(j => j.tableName === tableName) || {};

                    // -------------------------
                    // BUILD CHECK MAP
                    // -------------------------
                    const checkMap = {};
                    const fkMap = {};

                    (tbMeta.constraints || []).forEach(c => {

                        if (c.type === "check" && c.columns && c.options) {
                            c.columns.forEach(col => {
                                checkMap[col] = c.options;
                            });
                        }

                        if (c.type === "foreignKey" && c.columns) {
                            c.columns.forEach(col => {
                                fkMap[col] = c.referencedTable;
                            });
                        }
                    });

                    const sanitizeExportValue = (colName, value) => {

                        const checkOptions = checkMap[colName];
                        const isFK = fkMap[colName];

                        // -------------------------
                        // FOREIGN KEY HANDLING
                        // -------------------------
                        if (isFK) {

                            // treat empty or null as NULL string for Excel
                            if (value === null || value === undefined || value === "") {
                                return "NULL"; // ? this is what you want
                            }

                            return value;
                        }

                        // -------------------------
                        // CHECK CONSTRAINT
                        // -------------------------
                        if (checkOptions) {

                            if (value === null || value === undefined || value === "") {
                                return checkOptions[0];
                            }

                            const v = value.toString().trim();

                            if (checkOptions.includes(v)) return v;

                            return checkOptions[0];
                        }

                        // -------------------------
                        // DEFAULT
                        // -------------------------
                        return value;
                    };

                    const columns = await new Promise((resolve, reject) => {
                        ts.db.all(`PRAGMA table_info(${tableName});`,
                            (err, rows) => err ? reject(err) : resolve(rows)
                        );
                    });

                    const headers = columns.map(c => c.name);
                    sheet.addRow(headers);
                    sheet.getRow(1).font = { bold: true };

                    const data = await new Promise((resolve, reject) => {
                        ts.db.all(`SELECT * FROM ${tableName}`,
                            (err, rows) => err ? reject(err) : resolve(rows)
                        );
                    });

                    data.forEach(row => {

                        const cleanedRow = columns.map(c => {
                            const val = sanitizeExportValue(c.name, row[c.name]);

                            // optional debug for FK issues
                            if (fkMap[c.name] && (val === null || val === "")) {
                                mLogs({ R: `FK NULL ? ${tableName}.${c.name} (row idx: ${row.idx})` });
                            }

                            return val;
                        });

                        sheet.addRow(cleanedRow);
                    });
                }

                await workbook.xlsx.writeFile(filePath);
                mLogs("SQLite database exported successfully");
                callback();
            }

            // =========================
            // SQL SERVER EXPORT
            // =========================
            else if (cf.SQL == "SqlServer") {

                const tablesResult = await ts.db.request().query(`
                SELECT TABLE_NAME
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_TYPE = 'BASE TABLE'
            `);

                const tables = tablesResult.recordset;

                // ? sort alphabetically
                tables.sort((a, b) =>
                    a.TABLE_NAME.localeCompare(b.TABLE_NAME)
                );

                for (const table of tables) {

                    const tableName = table.TABLE_NAME;
                    const sheet = workbook.addWorksheet(tableName);

                    // ? metadata per table
                    const tbMeta = jsonDataArray.find(j => j.tableName === tableName) || {};

                    const checkMap = {};
                    const fkMap = {};

                    (tbMeta.constraints || []).forEach(c => {

                        if (c.type === "check" && c.columns && c.options) {
                            c.columns.forEach(col => {
                                checkMap[col] = c.options;
                            });
                        }

                        if (c.type === "foreignKey" && c.columns) {
                            c.columns.forEach(col => {
                                fkMap[col] = c.referencedTable;
                            });
                        }
                    });

                    const sanitizeExportValue = (colName, value) => {

                        const checkOptions = checkMap[colName];
                        const isFK = fkMap[colName];

                        if (isFK) {

                            // treat empty or null as NULL string for Excel
                            if (value === null || value === undefined || value === "") {
                                return "NULL"; // ? this is what you want
                            }

                            return value;
                        }

                        if (checkOptions) {
                            if (!value) return checkOptions[0];

                            const v = value.toString().trim();
                            if (checkOptions.includes(v)) return v;

                            return checkOptions[0];
                        }

                        return value;
                    };

                    const columnResult = await ts.db.request().query(`
                    SELECT COLUMN_NAME
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME='${tableName}'
                    ORDER BY ORDINAL_POSITION
                `);

                    const columns = columnResult.recordset.map(c => c.COLUMN_NAME);

                    sheet.addRow(columns);
                    sheet.getRow(1).font = { bold: true };

                    const dataResult = await ts.db.request().query(`
                    SELECT * FROM [${tableName}]
                `);

                    const rows = dataResult.recordset;

                    rows.forEach(row => {

                        const cleanedRow = columns.map(col => {
                            const val = sanitizeExportValue(col, row[col]);

                            if (fkMap[col] && (val === null || val === "")) {
                                mLogs({ R: `FK NULL ? ${tableName}.${col} (row idx: ${row.idx})` });
                            }

                            return val;
                        });

                        sheet.addRow(cleanedRow);
                    });
                }

                await workbook.xlsx.writeFile(filePath);
                mLogs("SQL Server database exported successfully");
                callback();
            }

        } catch (err) {
            mLogs({ R: "Error exporting database: " + err.toString() });
            callback(err);
        }
    }

    async importDatabaseFromExcel(callback = () => { }, mLogs = () => { }) {
        let ts = this;

        try {

            mLogs("Opening file dialog...");

            const result = await dialog.showOpenDialog({
                title: "Import Excel",
                properties: ["openFile"],
                filters: [{ name: "Excel Files", extensions: ["xlsx"] }]
            });

            if (result.canceled || result.filePaths.length === 0) {
                mLogs("Import cancelled");
                return;
            }

            const filePath = result.filePaths[0];

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);

            const worksheets = workbook.worksheets;

            const schema = {};

            worksheets.forEach(ws => {

                const tableName = ws.name;

                const columns = ws
                    .getRow(1)
                    .values
                    .slice(1)
                    .map(c => c.toString().trim());

                schema[tableName] = {
                    name: tableName,
                    columns,
                    pk: columns[0] || null,
                    fks: []
                };
            });

            let k = 0;

            const sortedMeta = ts.sortTablesByForeignKeys(jsonDataArray);
            const metaNames = new Set(jsonDataArray.map(t => t.tableName));

            const tableNames = sortedMeta
                .map(t => t.tableName)
                .filter(name => metaNames.has(name) && schema[name]);

            const totalTables = tableNames.length;
            let missing = 0;
            let failed = 0;

            let report = {};

            for (const tableName of tableNames) {

                report[tableName.replace("_new", "")] = {
                    "new": 0,
                    "exist": 0
                };

                k++;
                mLogs({ Y: `Importing ${k}/${totalTables} ${tableName}` });

                const ws = worksheets.find(w => w.name === tableName);
                const excelColumns = schema[tableName]?.columns || [];
                const tbMeta = jsonDataArray.find(j => j.tableName === tableName);

                if (!tbMeta) {
                    mLogs({ R: `Skipping ${tableName} (not in schema metadata)` });
                    continue;
                }

                const metaColumnNames = new Set(tbMeta.columns.map(c => c.name));
                 
                const columns = excelColumns.filter(c => metaColumnNames.has(c));

                const checkMap = {};
                 
                (tbMeta.constraints || []).forEach(c => {
                    if (c.type === "check" && c.columns && c.options) {
                        c.columns.forEach(col => {
                            checkMap[col] = c.options;
                        });
                    }
                });

                const sanitizeByCheck = (colName, value) => {

                    const options = checkMap[colName];

                    // no constraint ? leave as-is
                    if (!options) return value;

                    // null / undefined / empty string ? fallback to first option
                    if (value === null || value === undefined || value === "") {
                        return options[0];
                    }

                    const v = value.toString().trim();

                    // valid ? keep
                    if (options.includes(v)) return v;

                    // invalid ? fallback
                    return options[0];
                };

                let h_failed = false;

                if (cf.SQL == "SqLite") {

                    // -------------------------
                    // TABLE CHECK (SQL SERVER STYLE)
                    // -------------------------
                    const tableCheck = await new Promise(resolve => {
                        ts.db.get(
                            "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
                            [tableName.replace("_new", "")],
                            (err, row) => resolve(!!row)
                        );
                    });

                    const exists = tableCheck;

                    // -------------------------
                    // CREATE TABLE (WITH TYPES)
                    // -------------------------
                    if (!exists) {

                        let tb = jsonDataArray.find(j => j.tableName == tableName);

                        const createCols = columns.map(c => {

                            let type = tb?.columns?.find(t => t.name == c)?.type;

                            // map SQL Server types ? SQLite types
                            let sqliteType = "TEXT";

                            if (type) {
                                if (type.includes("INT")) sqliteType = "INTEGER";
                                else if (type.includes("REAL") || type.includes("FLOAT") || type.includes("DECIMAL")) sqliteType = "REAL";
                                else if (type.includes("BLOB")) sqliteType = "BLOB";
                                else sqliteType = "TEXT";
                            }

                            return `"${c}" ${sqliteType}`;
                        });

                        const createSQL =
                            `CREATE TABLE "${tableName.replace("_new", "")}" (${createCols.join(", ")})`;

                        await new Promise((resolve, reject) => {
                            ts.db.run(createSQL, err => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });

                        mLogs({ B: `Created table ${tableName}` });
                    }

                    // -------------------------
                    // INSERT (SQL SERVER STYLE)
                    // -------------------------
                    let h_failed = false;

                    for (let i = 2; i <= ws.rowCount; i++) {

                        const row = ws.getRow(i);
                        const values = row.values.slice(1);

                        let tb = jsonDataArray.find(j => j.tableName == tableName);

                        const request = {
                            values: []
                        };

                        columns.forEach((c, idx) => {

                            let type = tb?.columns?.find(t => t.name == c)?.type;
                            let v = values[idx];

                            v = sanitizeByCheck(c, v);

                            // -------------------------
                            // TYPE CONVERSION
                            // -------------------------
                            if (v == 'NULL') {
                                v = v;
                            }
                            else if (v === undefined || v === null || v === "") {
                                v = `""`;
                            } else if (type) {
                                //mLogs({column: c , type:type })

                                if (type.includes("INT")) {
                                    v = parseInt(v);
                                    if (isNaN(v)) v = null;
                                }

                                else if (type.includes("REAL") || type.includes("FLOAT") || type.includes("DECIMAL")) {
                                    v = parseFloat(v);
                                    if (isNaN(v)) v = null;
                                }

                                else {
                                    v = v.toString().trim();
                                }
                            } else {
                                v = v?.toString?.() ?? null;
                            }

                            request.values.push(v);
                        });

                        const cols = columns.map(c => `"${c}"`).join(",");
                        const params = columns.map(() => "?").join(",");

                        const insertSQL =
                            `INSERT INTO "${tableName.replace("_new", "")}" (${cols})
                             VALUES (${params})`;

                        await new Promise((resolve, reject) => {
                            ts.db.run(insertSQL, request.values, err => {
 
                                 
                                let arr = ["UNIQUE constraint failed", "CHECK constraint failed"];
                                let proc = false;
                                arr.forEach((r) => {
                                    if (err) {
                                        if (err.toString().includes(r)) {
                                            proc = true;
                                        }
                                    }
                                });
                                try {

                                    if (err) {
                                        report[tableName.replace("_new", "")]["exist"]++;
                                    }
                                    else {
                                        report[tableName.replace("_new", "")]["new"]++;
                                    }
                                }
                                catch(er) {
                                    console.error(er);
                                    console.log(report[tableName.replace("_new", "")])
                                }

                                if (err && proc) {
                                    //mLogs({ R: err.toString() });
                                    //mLogs(insertSQL);
                                    //console.log( request.values );
                                    return resolve(); // skip duplicates
                                }
                                if (err && !proc) {
                                    mLogs({ R: err.toString() });
                                    mLogs(insertSQL);
                                    console.log( request.values );
                                    return resolve(); // skip duplicates
                                }

                                if (err && false) {
                                    mLogs({ R: err.toString() });
                                    mLogs(insertSQL);
                                    console.log(request.values);
                                    h_failed = true;
                                    return reject(err);
                                }

                                resolve();
                            });
                        });
                    }

                    if (h_failed) {
                        mLogs({ R: `Table ${tableName} had errors` });
                    }
                }
                else if (cf.SQL == "SqlServer") {

                    const tableCheck = await ts.db.request().query(`
                        SELECT TABLE_NAME
                        FROM INFORMATION_SCHEMA.TABLES
                        WHERE TABLE_NAME='${tableName.replace("_new", "")}'
                    `);

                    const exists = tableCheck.recordset.length > 0;

                    if (!exists) {
                        mLogs({ B: `Missing table ${tableName}` });
                        missing++;
                        continue;
                    }

                    let tb = jsonDataArray.filter(j => j.tableName == tableName);
                    if (tb.length > 0) {
                        tb = tb[0];

                        for (let i = 2; i <= ws.rowCount; i++) {

                            const row = ws.getRow(i);
                            const values = row.values.slice(1);

                            const request = ts.db.request();

                            let inps = [];

                            columns.forEach((c, idx) => {

                                let tp = tb.columns.find(t => t.name == c)?.type;
                                let v;

                                if (tp) {
                                    v = tp.includes("TEXT")
                                        ? (values[idx] ?? '')
                                        : (values[idx] ? values[idx].toString() : '');
                                } else {
                                    v = null;
                                }

                                inps.push([`p${idx}`, v]);
                                request.input(`p${idx}`, v);
                            });

                            const cols = columns.map(c => `[${c}]`).join(",");
                            const params = columns.map((c, i) => `@p${i}`).join(",");

                            const insertSQL = `
    SET IDENTITY_INSERT [${tableName}] ON;

    IF NOT EXISTS (
        SELECT 1 FROM [${tableName}]
        WHERE ${columns.map((c, i) => `[${c}] = @p${i}`).join(' AND ')}
    )
    BEGIN
        INSERT INTO [${tableName}] (${cols})
        VALUES (${params});
    END

    SET IDENTITY_INSERT [${tableName}] OFF;
    `;

                            try {
                                await request.query(insertSQL);

                                try { 
                                    report[tableName.replace("_new", "")]["new"]++; 
                                }
                                catch (er) {
                                    console.error(er);
                                    console.log(report[tableName.replace("_new", "")])
                                }
                            } catch (er) {

                                try { 
                                     report[tableName.replace("_new", "")]["exist"]++;  
                                }
                                catch (er) {
                                    console.error(er);
                                    console.log(report[tableName.replace("_new", "")])
                                }

                                mLogs({ R: er.toString() });
                                mLogs({ B: inps.map(p => p.join(",")).join(';') });
                                h_failed = true;
                            }
                        }
                    }
                }

                if (h_failed) failed++;
                else mLogs(`Executed`);
            }

            mLogs({ B: "Database import completed!" });
            mLogs(`success: ${totalTables - failed - missing}`);
            mLogs({ Y: `missing: ${missing}` });
            mLogs({ R: `failed: ${failed}` });

            let i = 0;
            Object.keys(report).forEach((table) => {
                i++;
                mLogs({ B: `${i}. ${table}     ------------        new : ${report[table]["new"]}  ,  failed/exist : ${report[table]["exist"]}` })
            })

            callback();

        } catch (err) {
            mLogs({ R: "Error importing database: " + err.toString() });
            callback(err);
        }
    }
    //: initialization
    async createOrUpdateTables(jsonDataArray, logic = false, mLogs = () => { }) {
        const concurrency = 3;
        let index = 0;

        const workers = Array.from({ length: concurrency }, async () => {
            while (true) {
                const current = jsonDataArray[index++];
                if (!current) break;

                await this.createOrUpdateTable(current, logic, mLogs);
            }
        });

        await Promise.all(workers);

        // ?? SAFE PLACE: all DB work is done
        if (cf.SQL === "SqLite") {
            mLogs({ Y: "Running VACUUM..." });

            await new Promise((resolve, reject) => {
                this.db.run("VACUUM;", (err) => {
                    if (err) {
                        mLogs({ R: "VACUUM error: " + err });
                        return reject(err);
                    }

                    mLogs({ G: "VACUUM completed" });
                    resolve();
                });
            });
        }
    }
  
    async createOrUpdateTable(jsonData , logic = false , mLogs = ()=>{}) {
  
      try{ 
          const existingTableSchema = await this.getTableSchema(jsonData.tableName , mLogs);
             
        if(logic)
        {
            //await this.createTable(jsonData , logic);
            await this.updateTableSchema(jsonData, existingTableSchema , logic , mLogs);
        }
        else {
            mLogs(existingTableSchema.length); 

            if (existingTableSchema.length == 0) { 
                console.log({ Y: "creating "+jsonData.tableName });
                mLogs({ Y: "creating "+jsonData.tableName });
                await this.createTable(jsonData , logic , mLogs);
            } else { 
                console.log({ Y: "updating "+jsonData.tableName });
                mLogs({ Y: "updating "+jsonData.tableName });
                await this.updateTableSchema(jsonData, existingTableSchema , logic, mLogs);
            }
        } 
      }
      catch (error) { 
          mLogs({ R: error.toString() });
      }
   
    }
    //:
    clearTables(callback = () => { }, mLogs = () => { }) {
        let ts = this;

        if (cf.SQL == "SqLite") {

            ts.db.all(
                `SELECT name AS TABLE_NAME 
             FROM sqlite_master 
             WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
                (err, tables) => {

                    if (err) {
                        mLogs({ R: 'Error retrieving table names:' + err.toString() });
                        return;
                    }

                    let ks = 0;
                    mLogs({ Y: "Clearing Tables" });

                    drop();

                    function drop() {
                        let k = 0;

                        tables.forEach((table, index) => {

                            if (table.TABLE_NAME !== "undefined") {

                                const clearQuery =
                                    `DELETE FROM "${table.TABLE_NAME}"`;

                                ts.db.run(clearQuery, (err) => {

                                    if (!err) {

                                        mLogs({ B: tables[index].TABLE_NAME });

                                        tables[index].TABLE_NAME = "undefined";

                                        ks++;
                                        nex();

                                    } else {

                                        mLogs({
                                            R: `Error clearing table ${table.TABLE_NAME}:`
                                                + err.toString()
                                        });

                                        ks++;
                                        nex();
                                    }

                                    k++;

                                });
                            }

                        });

                        function nex() {

                            if (ks === tables.length) {
                                mLogs({ G: 'All tables cleared successfully' });
                                callback();
                            }

                        }
                    }

                });

        }
        else if (cf.SQL == "SqlServer") {

            ts.db.request().query(`
            SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_TYPE='BASE TABLE'
        `).then(result => {

                const tables = result.recordset;

                let completed = 0;

                mLogs({ Y: "Clearing Tables" });

                tables.forEach(async (table) => {

                    try {

                        const tableName = table.TABLE_NAME;

                        await ts.db.request().query(
                            `DELETE FROM [${tableName}]`
                        );

                        mLogs({ B: tableName });

                    } catch (err) {

                        mLogs({
                            R: `Error clearing table ${table.TABLE_NAME}:`
                                + err.toString()
                        });

                    }

                    completed++;

                    if (completed === tables.length) {

                        mLogs({ G: "All tables cleared successfully" });

                        callback();

                    }

                });

            }).catch(err => {

                mLogs({
                    R: "Error retrieving table names:" + err.toString()
                });

            });

        }
    }

    dropTables(callback = () => { }, mLogs = () => { }) {
        let ts = this;
         
        if (cf.SQL == "SqLite") {

            ts.db.all(
                `SELECT name AS TABLE_NAME 
             FROM sqlite_master 
             WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
                (err, tables) => {

                    if (err) {
                        mLogs({ R: 'Error retrieving table names:' + err.toString() });
                        return;
                    }

                    mLogs({ Y: "Dropping Tables" });

                    dropping();

                    function dropping(index = 0) {

                        mLogs(`${index + 1}/${tables.length} : ${tables[index] ? tables[index].TABLE_NAME : ''}`);

                        if (index < tables.length) {

                            let table = tables[index];

                            if (table.TABLE_NAME !== "undefined") {

                                const dropTableQuery = `DROP TABLE IF EXISTS "${table.TABLE_NAME}"`;

                                ts.db.run(dropTableQuery, (err) => {

                                    if (!err) {
                                        mLogs({ R: `Dropped : ${table.TABLE_NAME}` });
                                        tables[index].TABLE_NAME = "undefined";
                                    }
                                    else {
                                        mLogs({ R: `Error dropping table ${table.TABLE_NAME}:` + err.toString() });
                                    }

                                    dropping(index + 1);

                                });

                            }
                            else {

                                mLogs(`Already dropped : ${table.TABLE_NAME}`);
                                dropping(index + 1);

                            }

                        }
                        else {

                            const done = tables.every(t => t.TABLE_NAME === "undefined");

                            if (done) {

                                mLogs({ G: 'All tables dropped successfully' });

                                ts.db.run("VACUUM", (err) => {

                                    if (err) {
                                        mLogs({ R: err.toString() })
                                    }
                                    else {
                                        mLogs("Database file size reduced")
                                    }

                                    callback();

                                });

                            }

                        }
                    }

                });

        } 
        else if (cf.SQL == "SqlServer") {

            ts.db.request().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE='BASE TABLE'
        `).then(result => {

                const tables = result.recordset;

                mLogs({ Y: "Dropping Tables" });

            dropping();

                async function dropping(index = 0) {

                    if (index < tables.length) {

                        mLogs(`${index + 1}/${tables.length} : ${tables[index] ? tables[index].TABLE_NAME : ''}`);

                        const table = tables[index];

                        try {
                            const fkQuery = `
SELECT
    tc.TABLE_NAME,
    kc.CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
    ON rc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kc
    ON kc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE rc.UNIQUE_CONSTRAINT_NAME IN (
    SELECT CONSTRAINT_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_NAME = '${table.TABLE_NAME}'
);
`;
                            let fkResult = await ts.db.request().query(fkQuery);


                            for (let row of fkResult.recordset) {
                                mLogs({ B: `ALTER TABLE [${row.TABLE_NAME}] DROP CONSTRAINT [${row.CONSTRAINT_NAME}]` });
                                await ts.db.request().query(`ALTER TABLE [${row.TABLE_NAME}] DROP CONSTRAINT [${row.CONSTRAINT_NAME}]`);
                            }

                            await ts.db.request().query(
                                `DROP TABLE [${table.TABLE_NAME}]`
                            );

                            mLogs({ R: `Dropped : ${table.TABLE_NAME}` });

                            tables[index].TABLE_NAME = "undefined";

                        }
                        catch (err) {

                            mLogs({
                                R: `Error dropping table ${table.TABLE_NAME}:`
                                    + err.toString()
                            });

                        }

                        dropping(index + 1);

                    }
                    else {

                        mLogs(`Complete`);

                        const done = tables.every(t => t.TABLE_NAME === "undefined");

                        if (done) {

                            mLogs({ G: "All tables dropped successfully" });

                            try {

                                await ts.db.request().query(
                                    `DBCC SHRINKDATABASE (0)`
                                );

                                mLogs("Database size reduced");

                            }
                            catch (e) {

                                mLogs({ R: e.toString() });

                            }

                            callback();

                        }

                    }

                }

            }).catch(err => {

                mLogs({
                    R: 'Error retrieving table names:' + err.toString()
                });

            });

        }

    }

    async dropTable(tableName, mLogs = () => { }) {
        let ts = this;

        if (cf.SQL == "SqLite") {

            return new Promise((resolve, reject) => {

                ts.db.run(`DROP TABLE IF EXISTS "${tableName}"`, (err) => {

                    if (err) {

                        mLogs({
                            R: `Error dropping table ${tableName}:` + err.toString()
                        });

                        reject(err);

                    } else {

                        mLogs({ R: `${tableName} dropped` });

                        resolve();

                    }

                });

            });

        }
        else if (cf.SQL == "SqlServer") {

            try {

                const query = `
                IF OBJECT_ID('${tableName}', 'U') IS NOT NULL
                DROP TABLE [${tableName}]
            `;

                await ts.db.request().query(query);

                mLogs({ R: `${tableName} dropped` });

            }
            catch (err) {

                mLogs({
                    R: `Error dropping table ${tableName}:` + err.toString()
                });

                throw err;

            }

        }

    }

    //:
    getSQL(callback = () => { }, mLogs = () => { }) {
        let ts = this;

        mLogs("getSQL");

        if (cf.SQL === "SqLite") { 
            const queryTables = `
            SELECT name, sql 
            FROM sqlite_master 
            WHERE type='table' AND name NOT LIKE 'sqlite_%' 
            ORDER BY name
        `;

            ts.db.all(queryTables, [], (err, tables) => {
                if (err) {
                    mLogs(err);
                    return callback(err, null, mLogs);
                }

                const schema = {};
                const graph = {};
                let pending = tables.length;
                if (pending === 0) return callback(null, schema, mLogs);

                tables.forEach((table) => {
                    const tableName = table.name;
                    const createSQL = table.sql || "";
                    schema[tableName] = { columns: {}, constraints: {} };
                    graph[tableName] = [];

                    ts.db.all(`PRAGMA table_info(${tableName})`, [], (err, cols) => {
                        if (!err && cols) {
                            cols.forEach((col) => {
                                let colInfo = {
                                    type: col.type,
                                    nullable: col.notnull === 0,
                                    default: col.dflt_value,
                                    isPrimaryKey: col.pk > 0,
                                    isIdentity: false
                                };
                                if (col.pk > 0 && /AUTOINCREMENT/i.test(createSQL)) {
                                    colInfo.isIdentity = true;
                                }
                                schema[tableName].columns[col.name] = colInfo;

                                if (col.pk > 0) {
                                    schema[tableName].constraints[`pk_${tableName}_${col.name}`] = {
                                        type: "PRIMARY KEY",
                                        details: `PRIMARY KEY (${col.name})`
                                    };
                                }
                            });
                        }

                        ts.db.all(`PRAGMA foreign_key_list(${tableName})`, [], (err, fks) => {
                            if (!err && fks) {
                                fks.forEach((fk, idx) => {
                                    const onDelete = fk.on_delete || "NO ACTION";
                                    const onUpdate = fk.on_update || "NO ACTION";

                                    schema[tableName].constraints[`fk_${idx}_${tableName}`] = {
                                        type: "FOREIGN KEY",
                                        details: `FOREIGN KEY (${fk.from}) REFERENCES ${fk.table}(${fk.to}) ON DELETE ${onDelete} ON UPDATE ${onUpdate}`,
                                        onDelete,
                                        onUpdate
                                    };

                                    graph[fk.table] = graph[fk.table] || [];
                                    graph[fk.table].push(tableName);
                                });
                            }

                            ts.db.all(`PRAGMA index_list(${tableName})`, [], (err, indexes) => {
                                if (!err && indexes) {
                                    let pendingIndexes = indexes.length;
                                    if (pendingIndexes === 0) finish();
                                    else {
                                        indexes.forEach((idx) => {
                                            ts.db.all(`PRAGMA index_info(${idx.name})`, [], (err2, idxCols) => {
                                                let colNames = idxCols && idxCols.length > 0
                                                    ? idxCols.map(c => c.name).join(", ")
                                                    : idx.name;

                                                schema[tableName].constraints[`idx_${idx.name}`] = {
                                                    type: idx.unique ? "UNIQUE" : "INDEX",
                                                    details: `${idx.unique ? "UNIQUE" : "INDEX"} (${colNames})`
                                                };

                                                if (--pendingIndexes === 0) finish();
                                            });
                                        });
                                    }
                                } else finish();

                                function finish() {
                                    const checkMatches = createSQL.match(/CHECK\s*\([^)]+\)/gi);
                                    if (checkMatches) {
                                        checkMatches.forEach((chk, i) => {
                                            schema[tableName].constraints[`chk_${i}_${tableName}`] = {
                                                type: "CHECK",
                                                details: chk
                                            };
                                        });
                                    }

                                    if (--pending === 0) {
                                        const sortedTableNames = topologicalSort(graph);
                                        let allQuery = "";

                                        sortedTableNames.forEach((tname) => {
                                            let createQuery = `CREATE TABLE ${tname} (\n`;

                                            Object.entries(schema[tname] ? schema[tname].columns : {}).forEach(([col, colDef]) => {
                                                createQuery += `  ${col} ${colDef.type}`;
                                                if (!colDef.nullable) createQuery += " NOT NULL";
                                                if (colDef.default !== null) createQuery += ` DEFAULT '${colDef.default}'`;
                                                if (colDef.isPrimaryKey && colDef.isIdentity) {
                                                    createQuery += " PRIMARY KEY AUTOINCREMENT";
                                                } else if (colDef.isPrimaryKey) {
                                                    createQuery += " PRIMARY KEY";
                                                }
                                                createQuery += ",\n";
                                            });

                                            const constraintsAdded = {};
                                            Object.values(schema[tname] ? schema[tname].constraints : {}).forEach((con) => {
                                                if (!constraintsAdded[con.details]) {
                                                    createQuery += `  ${con.details},\n`;
                                                    constraintsAdded[con.details] = true;
                                                }
                                            });

                                            createQuery = createQuery.replace(/,\s*$/, "\n);\n");
                                            allQuery += createQuery;
                                        });

                                        callback(allQuery, schema, mLogs);
                                    }
                                }
                            });
                        });
                    });
                });
            });

        }
        else if (cf.SQL === "SqlServer") {

            const schema = {};
            const graph = {};

            ts.db.request().query(`
        SELECT TABLE_SCHEMA, TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE='BASE TABLE'
        ORDER BY TABLE_NAME
    `).then(async result => {

                const tables = result.recordset;
                let allQuery = "";

                let k = 0;
                let len = tables.length;

                for (const t of tables) {

                    k++;

                    const tableName = t.TABLE_NAME;
                    const schemaName = t.TABLE_SCHEMA;

                    schema[tableName] = { columns: {}, constraints: {} };
                    graph[tableName] = [];

                    mLogs({ Y: `Processing ${k}/${len} : ${tableName}` });

                    // ------------------------------------------------
                    // Columns + identity + length / precision
                    // ------------------------------------------------
                    const cols = await ts.db.request().query(`
                SELECT 
                    c.COLUMN_NAME,
                    c.DATA_TYPE,
                    c.CHARACTER_MAXIMUM_LENGTH,
                    c.NUMERIC_PRECISION,
                    c.NUMERIC_SCALE,
                    c.IS_NULLABLE,
                    c.COLUMN_DEFAULT,
                    col.is_identity
                FROM INFORMATION_SCHEMA.COLUMNS c
                JOIN sys.columns col
                    ON col.object_id = OBJECT_ID(c.TABLE_SCHEMA + '.' + c.TABLE_NAME)
                   AND col.name = c.COLUMN_NAME
                WHERE c.TABLE_NAME='${tableName}'
                ORDER BY c.ORDINAL_POSITION
            `);

                    cols.recordset.forEach(col => {

                        let type = col.DATA_TYPE.toUpperCase();

                        const lengthTypes = [
                            "VARCHAR", "NVARCHAR", "CHAR", "NCHAR", "VARBINARY", "BINARY"
                        ];

                        const precisionScaleTypes = [
                            "DECIMAL", "NUMERIC"
                        ];

                        const precisionTypes = [
                            "TIME", "DATETIME2", "DATETIMEOFFSET"
                        ];

                        if (lengthTypes.includes(type) && col.CHARACTER_MAXIMUM_LENGTH !== null) {

                            if (col.CHARACTER_MAXIMUM_LENGTH === -1)
                                type += "(MAX)";
                            else
                                type += `(${col.CHARACTER_MAXIMUM_LENGTH})`;

                        }
                        else if (precisionScaleTypes.includes(type) && col.NUMERIC_PRECISION !== null) {

                            type += `(${col.NUMERIC_PRECISION},${col.NUMERIC_SCALE})`;

                        }
                        else if (precisionTypes.includes(type) && col.NUMERIC_PRECISION !== null) {

                            type += `(${col.NUMERIC_PRECISION})`;

                        }

                        schema[tableName].columns[col.COLUMN_NAME] = {
                            type: type,
                            nullable: col.IS_NULLABLE === "YES",
                            default: col.COLUMN_DEFAULT,
                            isPrimaryKey: false,
                            isIdentity: col.is_identity === 1
                        };

                    });

                    // ------------------------------------------------
                    // Primary Keys
                    // ------------------------------------------------
                    const pk = await ts.db.request().query(`
                SELECT k.COLUMN_NAME
                FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS t
                JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
                  ON t.CONSTRAINT_NAME = k.CONSTRAINT_NAME
                WHERE t.CONSTRAINT_TYPE='PRIMARY KEY'
                  AND t.TABLE_NAME='${tableName}'
            `);

                    pk.recordset.forEach(p => {

                        if (schema[tableName].columns[p.COLUMN_NAME]) {

                            schema[tableName].columns[p.COLUMN_NAME].isPrimaryKey = true;

                            schema[tableName].constraints[`pk_${tableName}_${p.COLUMN_NAME}`] = {
                                type: "PRIMARY KEY",
                                details: `PRIMARY KEY ([${p.COLUMN_NAME}])`
                            };

                        }

                    });

                    // ------------------------------------------------
                    // Foreign Keys
                    // ------------------------------------------------
                    const fks = await ts.db.request().query(`
                        SELECT
                            fk.name AS FK_NAME,
                            pt.name AS PARENT_TABLE,
                            pc.name AS PARENT_COLUMN,
                            rt.name AS REF_TABLE,
                            rc.name AS REF_COLUMN,
                            fk.delete_referential_action_desc AS ON_DELETE,
                            fk.update_referential_action_desc AS ON_UPDATE
                        FROM sys.foreign_keys fk
                        JOIN sys.foreign_key_columns fkc
                            ON fk.object_id = fkc.constraint_object_id
                        JOIN sys.tables pt
                            ON fkc.parent_object_id = pt.object_id
                        JOIN sys.columns pc
                            ON fkc.parent_object_id = pc.object_id
                           AND fkc.parent_column_id = pc.column_id
                        JOIN sys.tables rt
                            ON fkc.referenced_object_id = rt.object_id
                        JOIN sys.columns rc
                            ON fkc.referenced_object_id = rc.column_id
                           AND fkc.referenced_column_id = rc.column_id
                        WHERE pt.name='${tableName}'
                     `);

                    fks.recordset.forEach((fk, idx) => {

                        const mapAction = (val) => {
                            switch (val) {
                                case "CASCADE": return "CASCADE";
                                case "SET_NULL": return "SET NULL";
                                case "SET_DEFAULT": return "SET DEFAULT";
                                case "NO_ACTION": return "NO ACTION";
                                case "RESTRICT": return "RESTRICT";
                                default: return "NO ACTION";
                            }
                        };

                        const onDelete = mapAction(fk.ON_DELETE);
                        const onUpdate = mapAction(fk.ON_UPDATE);

                        schema[tableName].constraints[`fk_${idx}_${tableName}`] = {
                            type: "FOREIGN KEY",
                            details:
                                `FOREIGN KEY ([${fk.PARENT_COLUMN}]) REFERENCES [${fk.REF_TABLE}]([${fk.REF_COLUMN}])` +
                                ` ON DELETE ${onDelete} ON UPDATE ${onUpdate}`,
                            onDelete,
                            onUpdate
                        };

                        graph[fk.REF_TABLE] = graph[fk.REF_TABLE] || [];
                        graph[fk.REF_TABLE].push(tableName);

                    });

                    // ------------------------------------------------
                    // Build CREATE TABLE
                    // ------------------------------------------------
                    let createQuery = `CREATE TABLE [${tableName}] (\n`;

                    Object.entries(schema[tableName].columns).forEach(([col, colDef]) => {

                        createQuery += `  [${col}] ${colDef.type}`;

                        if (colDef.isIdentity)
                            createQuery += " IDENTITY(1,1)";

                        if (!colDef.nullable)
                            createQuery += " NOT NULL";

                        if (colDef.default !== null)
                            createQuery += ` DEFAULT ${colDef.default}`;

                        if (colDef.isPrimaryKey && !colDef.isIdentity)
                            createQuery += " PRIMARY KEY";

                        createQuery += ",\n";

                    });

                    const constraintsAdded = {};

                    Object.values(schema[tableName].constraints).forEach(con => {

                        if (!constraintsAdded[con.details]) {

                            createQuery += `  ${con.details},\n`;
                            constraintsAdded[con.details] = true;

                        }

                    });

                    createQuery = createQuery.replace(/,\s*$/, "\n);\n\n");

                    allQuery += createQuery;

                }

                callback(allQuery, schema, mLogs);

            }).catch(err => {

                mLogs(err);
                callback(err, null, mLogs);

            });

        }

        function topologicalSort(graph) {
            const visited = {};
            const sorted = [];

            function visit(node) {
                if (!visited[node]) {
                    visited[node] = true;
                    (graph[node] || []).forEach(visit);
                    sorted.push(node);
                }
            }

            Object.keys(graph).forEach(visit);
            return sorted;
        }
    }

    async createTable(jsonData, logic = false, mLogs = () => { }) {
        let ts = this;

        let columnDefs = [];
        let tableConstraints = [];

        // Column Definitions 
        jsonData.columns.forEach((column) => {

            let colDef = `"${column.name}"`;

            if (cf.SQL == "SqLite") {

                colDef += ` ${sqltype(column.type)}`;

                if (column.identity) {
                    colDef = `"${column.name}" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL`;
                } else {
                    if (column.primaryKey) colDef += " PRIMARY KEY";
                    if (column.nullable === false) colDef += " NOT NULL";
                    if (column.unique) colDef += " UNIQUE";
                    if (column.default !== undefined && column.default !== null) {
                        colDef += ` DEFAULT '${column.default}'`;
                    }
                }

            }
            else if (cf.SQL == "SqlServer") {

                colDef += ` ${sqltype(column.type)}`;

                if (column.identity) {
                    colDef += " IDENTITY(1,1)";
                }

                if (column.primaryKey) colDef += " PRIMARY KEY";
                if (column.nullable === false) colDef += " NOT NULL";
                if (column.unique) colDef += " UNIQUE";

                if (column.default !== undefined && column.default !== null) {
                    colDef += ` DEFAULT '${column.default}'`;
                }

            }

            columnDefs.push(colDef);

        });

        // Table Constraints 
        if (jsonData.constraints) {

            jsonData.constraints.forEach((constraint) => {

                if (constraint.type === "primaryKey") {

                    tableConstraints.push(
                        `PRIMARY KEY (${constraint.columns.join(", ")})`
                    );

                }
                else if (constraint.type === "foreignKey") {

                    tableConstraints.push(
                        `FOREIGN KEY (${constraint.columns.join(", ")}) REFERENCES ${constraint.referencedTable} (${constraint.referencedColumns.join(", ")})
                                 ${constraint.OnDeleteAction ? `ON DELETE ${constraint.OnDeleteAction} ` : ''}
                                 ${constraint.OnUpdateAction ? `ON UPDATE ${constraint.OnUpdateAction} ` : ''}
                         `
                    );

                }
                else if (constraint.type === "unique") {

                    tableConstraints.push(
                        `UNIQUE (${constraint.columns.join(", ")})`
                    );

                }
                else if (constraint.type === "check") {

                    tableConstraints.push(
                        `CHECK (${constraint.expression})`
                    );

                }

            });

        }

        // Create Table Query 
        let createTableQuery;
        let dropInit;

        if (cf.SQL == "SqLite") {
            dropInit = `DROP TABLE IF EXISTS ${jsonData.tableName}_new;`;
            createTableQuery = `CREATE TABLE IF NOT EXISTS ${jsonData.tableName} (
            ${columnDefs.concat(tableConstraints).join(",\n               ")}
        );`;

        }
        else if (cf.SQL == "SqlServer") {
            dropInit = `
        IF OBJECT_ID('${jsonData.tableName}_new', 'U') IS NOT NULL
            DROP TABLE [${jsonData.tableName}_new];
        `;

            createTableQuery = `
        IF NOT EXISTS (
            SELECT * FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME = '${jsonData.tableName}'
        )
        BEGIN
            CREATE TABLE ${jsonData.tableName} (
                ${columnDefs.concat(tableConstraints).join(",\n               ")}
            )
        END
        `;

        }

        mLogs({ B: "Execute Query :" });

        if (logic) {
            return mLogs(createTableQuery);
        }

        // Execution 
        if (cf.SQL == "SqLite") {

            await new Promise((resolve, reject) => {

                mLogs({ B: dropInit }); 
                ts.db.run(dropInit, (err) => {
                    if (err) {
                        mLogs({ R: "Error : " + err });
                        reject(err);
                    } else {
                        mLogs({ G: "Executed" });
                         
                        mLogs({ B: createTableQuery });

                        ts.db.run(createTableQuery, (err) => {
                            if (err) {
                                mLogs({ R: "Error : " + err });
                                reject(err);
                            } else {
                                mLogs({ G: "Executed" });
                                resolve();
                            }
                        });
                    }
                });

            });

        }
        else if (cf.SQL == "SqlServer") {

            try {

                mLogs({ B: dropInit });
                await ts.db.request().query(dropInit);
                mLogs({ B: createTableQuery });
                await ts.db.request().query(createTableQuery);

                mLogs({ G: "Executed" });

            }
            catch (err) {

                mLogs({ R: "Error : " + err });
                throw err;

            }

        }

    }

    query(sqlquery, data = [], callback = () => { }, mLogs = () => { }) {
        let ts = this;

        return new Promise(async (resolve, reject) => {

            const finish = (err, result) => {
                if (err) {
                    if (callback) callback(err, null);
                    reject(err);
                } else {
                    if (callback) callback(null, result);
                    resolve(result);
                }
            };

            const isSelect = /^\s*SELECT/i.test(sqlquery);

            if (ts.db) {

                if (isSelect) {
                    ts.db.all(sqlquery, data, (err, rows) => {
                        finish(err, rows);
                    });

                } else {

                    ts.db.run(sqlquery, data, function (err) {

                        if (err) {
                            finish(err);
                        } else {

                            const result = {
                                lastID: this.lastID,
                                changes: this.changes
                            };

                            finish(null, result);
                        }

                    });

                }

            } 
            else if (ts.pool) {

                try {

                    let request = ts.pool.request();

                    data.forEach((value, index) => {
                        request.input(`param${index}`, value);
                        sqlquery = sqlquery.replace("?", `@param${index}`);
                    });

                    const result = await request.query(sqlquery);

                    if (isSelect) {
                        finish(null, result.recordset);
                    } else {
                        finish(null, {
                            rowsAffected: result.rowsAffected
                        });
                    }

                } catch (err) {
                    finish(err);
                }

            }

            else {
                finish(new Error("No database driver initialized"));
            }

        });
    }

    async getForeignKeyConstraints(table, mLogs = () => { }) {
        let ts = this;

        return new Promise(async (resolve, reject) => {
            try {

                if (cf.SQL == "SqLite") {

                    ts.db.all(`PRAGMA foreign_key_list("${table}")`, (err, rows) => {
                        if (err) {
                            mLogs({ R: "Error retrieving foreign keys: " + err.toString() });
                            reject(err);
                            return;
                        }

                        const constraints = rows.map((row, idx) => ({
                            ForeignKeyConstraintName: `FK_${table}_${row.table}_${idx}`,
                            ForeignKeyTable: table,
                            ForeignKeyColumn: row.from,
                            PrimaryKeyTable: row.table,
                            PrimaryKeyColumn: row.to,
                            PrimaryKeyConstraintName: `PK_${row.table}`
                        }));

                        resolve(constraints);
                    });

                } else if (cf.SQL == "SqlServer") {

                    const result = await ts.db.request()
                        .query(`
                        SELECT fk.name AS FK_NAME,
                               tp.name AS PARENT_TABLE,
                               cp.name AS PARENT_COLUMN,
                               tr.name AS REF_TABLE,
                               cr.name AS REF_COLUMN
                        FROM sys.foreign_keys fk
                        JOIN sys.foreign_key_columns fkc
                            ON fk.object_id = fkc.constraint_object_id
                        JOIN sys.tables tp
                            ON fkc.parent_object_id = tp.object_id
                        JOIN sys.columns cp
                            ON fkc.parent_column_id = cp.column_id AND cp.object_id = tp.object_id
                        JOIN sys.tables tr
                            ON fkc.referenced_object_id = tr.object_id
                        JOIN sys.columns cr
                            ON fkc.referenced_column_id = cr.column_id AND cr.object_id = tr.object_id
                        WHERE tp.name = '${table}';
                    `);

                    const constraints = result.recordset.map((row, idx) => ({
                        ForeignKeyConstraintName: row.FK_NAME || `FK_${row.PARENT_TABLE}_${row.REF_TABLE}_${idx}`,
                        ForeignKeyTable: row.PARENT_TABLE,
                        ForeignKeyColumn: row.PARENT_COLUMN,
                        PrimaryKeyTable: row.REF_TABLE,
                        PrimaryKeyColumn: row.REF_COLUMN,
                        PrimaryKeyConstraintName: `PK_${row.REF_TABLE}`
                    }));

                    resolve(constraints);

                } else {
                    reject(new Error("Unsupported database driver"));
                }

            } catch (err) {
                mLogs({ R: "Error retrieving foreign keys: " + err.toString() });
                reject(err);
            }
        });
    }

    dbError(pre , error , mLogs = ()=>{}){
        var ts = this;

        if (error.precedingErrors) {
            error.precedingErrors.forEach((precedingError) => {
                mLogs({ R: `${pre} ${precedingError.message}` });
            });
        }
    }

    async getColumnForeignKeyConstraints(table, column , mLogs = ()=>{}) {
        // Reuse the SQLite-adapted getForeignKeyConstraints
        const constraints = await this.getForeignKeyConstraints(table , mLogs);

        mLogs("All constraints:", constraints);

        const ret = constraints.filter(
            (constraint) => constraint.PrimaryKeyColumn === column
        );

        mLogs("Filtered constraints:", ret);

        return ret;
    }

    async unChainForeignKey(table, callback = () => { }, logic = false, mLogs = () => { }) {
        let ts = this;

        try {

            // Get FK constraints for logging
            const foreignKeyConstraints = await ts.getForeignKeyConstraints(table, mLogs);

            if (foreignKeyConstraints.length > 0 && logic) {
                mLogs({ B: "Temporarily disabling foreign key constraints for:" });
                foreignKeyConstraints.forEach(constraint => {
                    if (constraint.ForeignKeyTable === table) {
                        mLogs({ B: "--:" + constraint.ForeignKeyConstraintName + "==>" + constraint.PrimaryKeyConstraintName });
                    }
                });
            }

            // ========================
            // DISABLE FOREIGN KEYS
            // ========================
            if (cf.SQL == "SqLite") {
                if (logic) {
                    mLogs("PRAGMA foreign_keys = OFF;");
                } else {
                    await new Promise((resolve, reject) =>
                        ts.db.run("PRAGMA foreign_keys = OFF;", (err) => (err ? reject(err) : resolve()))
                    );
                }
            } else if (cf.SQL == "SqlServer") {
                if (logic) {
                    mLogs(`ALTER TABLE [${table}] NOCHECK CONSTRAINT ALL;`);
                } else {
                    await ts.db.request().query(`ALTER TABLE [${table}] NOCHECK CONSTRAINT ALL;`);
                }
            }

            // ========================
            // RUN USER CALLBACK
            // ========================
            await callback();

            // ========================
            // RE-ENABLE FOREIGN KEYS
            // ========================
            if (cf.SQL == "SqLite") {
                if (logic) {
                    mLogs("PRAGMA foreign_keys = ON;");
                } else {
                    await new Promise((resolve, reject) =>
                        ts.db.run("PRAGMA foreign_keys = ON;", (err) => (err ? reject(err) : resolve()))
                    );
                }
            } else if (cf.SQL == "SqlServer") {
                if (logic) {
                    mLogs(`ALTER TABLE [${table}] WITH CHECK CHECK CONSTRAINT ALL;`);
                } else {
                    await ts.db.request().query(`ALTER TABLE [${table}] WITH CHECK CHECK CONSTRAINT ALL;`);
                }
            }

            if (foreignKeyConstraints.length > 0 && logic) {
                mLogs({ G: "Foreign key constraints enforcement re-enabled." });
            }

        } catch (error) {
            mLogs({ R: "Error unchaining foreign keys: " + error.toString() });
        }
    }
    //:  VACUUM
    async updateTableSchema(jsonData, existingTableSchema, logic = false, mLogs = () => { }) {
        let ts = this;


        let columnDefs = [];
        let tableConstraints = [];

        // Column Definitions 
        jsonData.columns.forEach((column) => {

            let colDef = `"${column.name}"`;

            if (cf.SQL == "SqLite") {

                colDef += ` ${sqltype(column.type)}`;

                if (column.identity) {
                    colDef = `"${column.name}" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL`;
                } else {
                    if (column.primaryKey) colDef += " PRIMARY KEY";
                    if (column.nullable === false) colDef += " NOT NULL";
                    if (column.unique) colDef += " UNIQUE";
                    if (column.default !== undefined && column.default !== null) {
                        colDef += ` DEFAULT '${column.default}'`;
                    }
                }

            }
            else if (cf.SQL == "SqlServer") {

                colDef += ` ${sqltype(column.type)}`;

                if (column.identity) {
                    colDef += " IDENTITY(1,1)";
                }

                if (column.primaryKey) colDef += " PRIMARY KEY";
                if (column.nullable === false) colDef += " NOT NULL";
                if (column.unique) colDef += " UNIQUE";

                if (column.default !== undefined && column.default !== null) {
                    colDef += ` DEFAULT '${column.default}'`;
                }

            }

            columnDefs.push(colDef);

        });

        // Table Constraints 
        if (jsonData.constraints) {

            jsonData.constraints.forEach((constraint) => {

                if (constraint.type === "primaryKey") {

                    tableConstraints.push(
                        `PRIMARY KEY (${constraint.columns.join(", ")})`
                    );

                }
                else if (constraint.type === "foreignKey") {

                    tableConstraints.push(
                        `FOREIGN KEY (${constraint.columns.join(", ")}) REFERENCES ${constraint.referencedTable} (${constraint.referencedColumns.join(", ")})
                                 ${constraint.OnDeleteAction ? `ON DELETE ${constraint.OnDeleteAction} ` : ''}
                                 ${constraint.OnUpdateAction ? `ON UPDATE ${constraint.OnUpdateAction} ` : ''}
                         `
                    );

                }
                else if (constraint.type === "unique") {

                    tableConstraints.push(
                        `UNIQUE (${constraint.columns.join(", ")})`
                    );

                }
                else if (constraint.type === "check") {

                    tableConstraints.push(
                        `CHECK (${constraint.expression})`
                    );

                }

            });

        }

        async function rebuildTable(jsonData) {

            const tableName = jsonData.tableName;
            const newTableName = `${tableName}_new`;

            const checkMap = {};

            (jsonData.constraints || []).forEach(c => {
                if (c.type === "check" && c.columns && c.options) {
                    c.columns.forEach(col => {
                        checkMap[col] = c.options;
                    });
                }
            });

            function sanitizeValue(columnName, value) {

                const options = checkMap[columnName];

                if (!options) return value;

                if (value === null || value === undefined || value === "") {
                    return options[0];
                }

                const isNumeric = options.every(o => !isNaN(o));

                let v = value;

                if (isNumeric) {
                    v = Number(value);
                    if (isNaN(v)) return Number(options[0]);
                } else {
                    v = value.toString().trim();
                }

                if (options.includes(v)) return v;

                return options[0];
            }

            const columnList = jsonData.columns.map(c => {
                return cf.SQL === "SqlServer" ? `[${c.name}]` : `"${c.name}"`;
            }).join(", ");

            // =========================
            // ?? ADDED: sanitized SELECT
            // =========================
            const selectList = jsonData.columns.map(c => {

                const col = c.name;
                const safeCol = cf.SQL === "SqlServer" ? `[${col}]` : `"${col}"`;

                const options = checkMap[col];

                if (!options) return safeCol;

                const fallback = options[0];
                const isNumeric = options.every(o => !isNaN(o));

                const optionList = isNumeric
                    ? options.join(",")
                    : options.map(o => `'${o}'`).join(",");

                const fallbackValue = isNumeric ? fallback : `'${fallback}'`;

                return `
        CASE 
            WHEN ${safeCol} IS NULL THEN ${fallbackValue}
            WHEN ${safeCol} IN (${optionList}) THEN ${safeCol}
            ELSE ${fallbackValue}
        END AS ${safeCol}
        `;
            }).join(", ");
            // =========================

            const allDefs = [...columnDefs, ...tableConstraints].join(",\n     ");

            let dropInit = "";
            let createSQL = "";
            let insertSQL = "";
            let dropSQL = "";
            let renameSQL = "";

            if (cf.SQL == "SqLite") {

                dropInit = `DROP TABLE IF EXISTS ${newTableName};`;
                createSQL = `CREATE TABLE ${newTableName} (${allDefs});`;

                // ?? UPDATED: use selectList instead of columnList
                insertSQL = `
INSERT INTO ${newTableName} (${columnList})
SELECT ${selectList}
FROM ${tableName};
`;

                dropSQL = `DROP TABLE IF EXISTS ${tableName};`;
                renameSQL = `ALTER TABLE ${newTableName} RENAME TO ${tableName};`;

                mLogs({ Y: "rebuildTable SQLite" });

                if (!logic) {

                    ts.db.serialize(() => {

                        ts.db.run("PRAGMA foreign_keys=OFF;");

                        ts.db.run("BEGIN TRANSACTION;");

                        mLogs({ B: dropInit });
                        ts.db.run(dropInit, errHandler);

                        mLogs({ B: createSQL });
                        ts.db.run(createSQL, errHandler);

                        mLogs({ B: insertSQL });
                        ts.db.run(insertSQL, errHandler);

                        mLogs({ B: dropSQL });
                        ts.db.run(dropSQL, errHandler);

                        mLogs({ B: renameSQL });
                        ts.db.run(renameSQL, errHandler);

                        ts.db.run("COMMIT;", (err) => {

                            if (err) {
                                createOrUpdateTables
                                rollback(err);
                                return;
                            }

                            ts.db.run("PRAGMA foreign_keys=ON;");

                            mLogs({ G: "Table rebuild completed" });
                        });

                    });

                    function errHandler(err) {
                        if (err) {
                            rollback(err);
                        }
                    }

                    function rollback(err) {

                        mLogs({ B: "ROLLBACK;" });

                        ts.db.run("ROLLBACK;", () => {
                            mLogs({ R: "Error: " + err.toString() });
                            reject(err);
                        });

                    }

                }

            }
            else if (cf.SQL == "SqlServer") {

                dropInit = `
            IF OBJECT_ID('${newTableName}', 'U') IS NOT NULL
                DROP TABLE [${newTableName}];
            `;

                createSQL = `CREATE TABLE ${newTableName} (${allDefs});`;

                const identityColumn = jsonData.columns.find(c => c.identity);

                // ?? UPDATED: use selectList instead of columnList
                insertSQL = identityColumn ? `
SET IDENTITY_INSERT [${newTableName}] ON;
INSERT INTO [${newTableName}] (${columnList})
SELECT ${selectList}
FROM [${tableName}];
SET IDENTITY_INSERT [${newTableName}] OFF;
` : `
INSERT INTO [${newTableName}] (${columnList})
SELECT ${selectList}
FROM [${tableName}];
`;

                dropSQL = `DROP TABLE [${tableName}];`;

                renameSQL = `EXEC sp_rename '${newTableName}', '${tableName}';`;

                mLogs({ Y: "rebuildTable SqlServer" });

                if (!logic) {

                    const transaction = new sql.Transaction(ts.db);

                    try {

                        await transaction.begin();

                        const request = new sql.Request(transaction);

                        const fkQuery = `
SELECT
    tc.TABLE_NAME,
    kc.CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
    ON rc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kc
    ON kc.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE rc.UNIQUE_CONSTRAINT_NAME IN (
    SELECT CONSTRAINT_NAME
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE TABLE_NAME = '${tableName}'
);
`;

                        const fkResult = await request.query(fkQuery);

                        mLogs({ G: dropInit });
                        await request.query(dropInit);

                        mLogs({ G: createSQL });
                        await request.query(createSQL);

                        mLogs({ B: insertSQL });
                        await request.query(insertSQL);

                        for (let row of fkResult.recordset) {
                            mLogs({ B: `ALTER TABLE [${row.TABLE_NAME}] DROP CONSTRAINT [${row.CONSTRAINT_NAME}]` });
                            await request.query(`ALTER TABLE [${row.TABLE_NAME}] DROP CONSTRAINT [${row.CONSTRAINT_NAME}]`);
                        }

                        mLogs({ B: dropSQL });
                        await request.query(dropSQL);

                        mLogs({ B: renameSQL });
                        await request.query(renameSQL);

                        await transaction.commit();

                    }
                    catch (err) {

                        mLogs({ R: err.toString() });

                        await transaction.rollback();
                        throw err;

                    }
                }
            }

            mLogs({ G: `Table ${tableName} rebuilt successfully for ${cf.SQL}` });

        }

        // ----------------------------
        // Add Missing Columns
        // ----------------------------

        const newColumns = jsonData.columns.filter(
            col => !existingTableSchema.find(c => c.COLUMN_NAME === col.name)
        );

        for (let column of newColumns) {

            let alterQuery = "";

            if (cf.SQL == "SqLite") {

                alterQuery = `ALTER TABLE ${jsonData.tableName} ADD COLUMN ${column.name} ${sqltype(column.type)}`;

                if (column.default) alterQuery += ` DEFAULT '${column.default}'`;
                if (column.nullable === false) alterQuery += " NOT NULL";

                await ts.db.run(alterQuery);

            } else if (cf.SQL == "SqlServer") {

                alterQuery = `ALTER TABLE [${jsonData.tableName}] ADD [${column.name}] ${sqltype(column.type)}`;

                if (column.default) alterQuery += ` DEFAULT '${column.default}'`;
                if (column.nullable === false) alterQuery += " NOT NULL";

                await ts.db.request().query(alterQuery);
            }

            mLogs({ G: `Added column ${column.name} for ${cf.SQL}` });
        }

        // ----------------------------
        // Detect Dropped Columns
        // ----------------------------

        const droppedColumns = existingTableSchema.filter(
            c => !jsonData.columns.find(col => col.name === c.COLUMN_NAME)
        );

        // ----------------------------
        // Detect Column Mismatches
        // ----------------------------

        const mismatchedColumns = jsonData.columns.filter(col => {

            const existingCol = existingTableSchema.find(c => c.COLUMN_NAME === col.name);

            if (!existingCol) return false;

            try {

                return (
                    existingCol.DATA_TYPE.toUpperCase() !== col.type.toUpperCase() ||
                    (existingCol.IS_NULLABLE === "YES") !== (col.nullable !== false) ||
                    ((existingCol.COLUMN_DEFAULT || "").replace(/[()']/g, "")) !== (col.default || "")
                );

            } catch (err) {

                console.log(existingCol, col);
                console.log(err);
                return false;
            }
        });

        // ----------------------------
        // Rebuild Table If Needed
        // ----------------------------

        if (
            droppedColumns.length > 0 ||
            mismatchedColumns.length > 0 ||
            (jsonData.constraints || []).length > 0
        ) {
            await rebuildTable(jsonData);
        }
    }
    //-- helpers
    // Rebuild table without certain columns
    async rebuildTableWithoutColumns(tableName, keepColumns, mLogs = () => { }) {
        let ts = this;
        const cols = keepColumns.join(", ");
        const tempTable = `${tableName}_backup`;

        mLogs({ B: cols });

        if (cf.SQL === "SqLite") {
            const steps = [
                `PRAGMA foreign_keys = 0;`,
                `CREATE TABLE ${tempTable} AS SELECT ${cols} FROM ${tableName};`,
                `DROP TABLE ${tableName};`,
                `ALTER TABLE ${tempTable} RENAME TO ${tableName};`,
                `PRAGMA foreign_keys = 1;`
            ];

            for (let step of steps) {
                await new Promise((resolve, reject) =>
                    ts.db.run(step, (err) => (err ? reject(err) : resolve()))
                );
            }
        } else if (cf.SQL === "SqlServer") {
            const tempCols = keepColumns.map(c => `[${c}]`).join(", ");
            // Disable FKs
            await ts.db.request().query(`ALTER TABLE [${tableName}] NOCHECK CONSTRAINT ALL;`);

            // Create temp table
            await ts.db.request().query(`SELECT ${tempCols} INTO [${tempTable}] FROM [${tableName}];`);

            // Drop old table
            await ts.db.request().query(`DROP TABLE [${tableName}];`);

            // Rename temp table
            await ts.db.request().query(`EXEC sp_rename '${tempTable}', '${tableName}';`);

            // Re-enable FKs
            await ts.db.request().query(`ALTER TABLE [${tableName}] WITH CHECK CHECK CONSTRAINT ALL;`);
        }

        mLogs({ G: `Table ${tableName} rebuilt with only specified columns for ${cf.SQL}` });
    }
    // Rebuild full table with schema from jsonData
    async rebuildTableWithSchema(jsonData, mLogs = () => { }) {
        let ts = this;
        const tableName = jsonData.tableName;
        const tempTable = `${tableName}_backup`;

        // Build CREATE TABLE query
        let createQuery = "";
        if (cf.SQL === "SqLite") {
            createQuery = `CREATE TABLE ${tableName} (`;
            createQuery += jsonData.columns.map(col => {
                let def = `${col.name} ${col.type}`;
                if (col.primaryKey) def += " PRIMARY KEY";
                if (col.unique) def += " UNIQUE";
                if (col.nullable === false) def += " NOT NULL";
                if (col.default !== undefined) def += ` DEFAULT '${col.default}'`;
                return def;
            }).join(", \n");

            if (jsonData.constraints) {
                jsonData.constraints.forEach(constraint => {
                    if (constraint.type === "foreignKey") {
                        def = `, FOREIGN KEY (${constraint.columns.join(", ")}) REFERENCES ${constraint.referencedTable} (${constraint.referencedColumns.join(", ")}) 
                                 ${constraint.OnDeleteAction ? `ON DELETE ${constraint.OnDeleteAction} ` : ''}
                                 ${constraint.OnUpdateAction ? `ON UPDATE ${constraint.OnUpdateAction} ` : ''}
                              `;
                        createQuery += def;
                    } else if (constraint.type === "check") {
                        createQuery += `, CHECK (${constraint.expression})`;
                    }
                });
            }

            createQuery += ");";
        }
        else if (cf.SQL === "SqlServer") {
            createQuery = `CREATE TABLE ${tableName} (`;
            createQuery += jsonData.columns.map(col => {
                let def = `[${col.name}] ${col.type}`;
                if (col.primaryKey) def += " PRIMARY KEY";
                if (col.unique) def += " UNIQUE";
                if (col.nullable === false) def += " NOT NULL";
                if (col.default !== undefined) def += ` DEFAULT '${col.default}'`;
                return def;
            }).join(", \n");

            if (jsonData.constraints) {
                jsonData.constraints.forEach(constraint => {
                    if (constraint.type === "foreignKey") {
                        createQuery += `, FOREIGN KEY (${constraint.columns.map(c => `[${c}]`).join(", ")}) REFERENCES [${constraint.referencedTable}] (${constraint.referencedColumns.map(c => `[${c}]`).join(", ")})
                                         ${constraint.OnDeleteAction ? `ON DELETE ${constraint.OnDeleteAction} ` : ''}
                                         ${constraint.OnUpdateAction ? `ON UPDATE ${constraint.OnUpdateAction} ` : ''}`;
                    } else if (constraint.type === "check") {
                        createQuery += `, CHECK (${constraint.expression})`;
                    }
                });
            }

            createQuery += ");";
        }

        mLogs({ B: "CREATE TABLE query:" });
        mLogs({ B: createQuery });

        if (cf.SQL === "SqLite") {
            const steps = [
                `PRAGMA foreign_keys = 0;`,
                `CREATE TABLE ${tempTable} AS SELECT * FROM ${tableName};`,
                `DROP TABLE ${tableName};`,
                createQuery,
                `INSERT INTO ${tableName} SELECT * FROM ${tempTable};`,
                `DROP TABLE ${tempTable};`,
                `PRAGMA foreign_keys = 1;`
            ];

            for (let step of steps) {
                await new Promise((resolve, reject) =>
                    ts.db.run(step, (err) => (err ? reject(err) : resolve()))
                );
            }
        }
        else if (cf.SQL === "SqlServer") {
            // Disable foreign key constraints
            await ts.db.request().query(`ALTER TABLE [${tableName}] NOCHECK CONSTRAINT ALL;`);

            // Copy data to temp table
            await ts.db.request().query(`SELECT * INTO [${tempTable}] FROM [${tableName}];`);

            // Drop old table
            await ts.db.request().query(`DROP TABLE [${tableName}];`);

            // Create new table
            await ts.db.request().query(createQuery);

            // Copy data back
            const cols = jsonData.columns.map(c => `[${c.name}]`).join(", ");
            await ts.db.request().query(`INSERT INTO [${tableName}] (${cols}) SELECT ${cols} FROM [${tempTable}];`);

            // Drop temp table
            await ts.db.request().query(`DROP TABLE [${tempTable}];`);

            // Re-enable foreign keys
            await ts.db.request().query(`ALTER TABLE [${tableName}] WITH CHECK CHECK CONSTRAINT ALL;`);
        }

        mLogs({ G: `Table ${tableName} rebuilt with schema for ${cf.SQL}` });
    }
    //-----:: 
    async getTableSchema(tableName, mLogs = () => { }) {
        let ts = this;

        mLogs("getSchema");

        if (cf.SQL === "SqLite") {
            // SQLite version
            return new Promise((resolve, reject) => {
                ts.db.all(`PRAGMA table_info(${tableName});`, (err, rows) => {
                     
                    if (err) return reject(err);

                    const schema = rows.map(row => ({
                        COLUMN_NAME: row.name,
                        DATA_TYPE: row.type,
                        IS_NULLABLE: row.notnull === 0 ? "YES" : "NO",
                        COLUMN_DEFAULT: row.dflt_value,
                        PRIMARY_KEY: row.pk === 1
                    }));
                    resolve(schema);
                });
            });
        }
        else if (cf.SQL === "SqlServer") {
            // SQL Server version
            try {
                const result = await ts.db.request()
                    .input("tableName", tableName)
                    .query(`
                    SELECT 
                        COLUMN_NAME,
                        DATA_TYPE,
                        CASE WHEN IS_NULLABLE = 'YES' THEN 'YES' ELSE 'NO' END AS IS_NULLABLE,
                        COLUMN_DEFAULT,
                        CASE WHEN COLUMNPROPERTY(object_id(TABLE_NAME), COLUMN_NAME, 'IsIdentity') = 1 THEN 1
                             WHEN COLUMN_NAME IN (
                                 SELECT COLUMN_NAME
                                 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                                 JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu
                                 ON tc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
                                 WHERE tc.TABLE_NAME = @tableName AND tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
                             ) THEN 1
                             ELSE 0
                        END AS PRIMARY_KEY
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_NAME = @tableName
                    ORDER BY ORDINAL_POSITION
                `);
                 
                const schema = result.recordset.map(row => ({
                    COLUMN_NAME: row.COLUMN_NAME,
                    DATA_TYPE: row.DATA_TYPE,
                    IS_NULLABLE: row.IS_NULLABLE,
                    COLUMN_DEFAULT: row.COLUMN_DEFAULT,
                    PRIMARY_KEY: row.PRIMARY_KEY === 1
                }));

                return schema;
            } catch (err) {
                mLogs({ R: "Error fetching SQL Server schema: " + err.toString() });
                throw err;
            }
        }
    }
      
    async getTableData(tableName, mLogs = () => { }) {
        let ts = this;

        if (cf.SQL === "SqLite") {
            // SQLite: fetch all rows
            return new Promise((resolve, reject) => {
                ts.db.all(`SELECT * FROM "${tableName}";`, (err, rows) => {
                    mLogs(err, rows);
                    if (err) reject(err);
                    else resolve(rows); // Array of objects, like recordset
                });
            });
        } else if (cf.SQL === "SqlServer") {
            // SQL Server: fetch all rows
            try {
                const result = await ts.db.request().query(`SELECT * FROM [${tableName}];`);
                mLogs(null, result.recordset);
                return result.recordset; // Array of objects
            } catch (err) {
                mLogs({ R: "Error fetching SQL Server table data: " + err.toString() });
                throw err;
            }
        }
    }
  
    async truncateTable(tableName, mLogs = () => { }) {
        let ts = this;

        if (cf.SQL === "SqLite") {
            return new Promise((resolve, reject) => {
                ts.db.serialize(() => {
                    // Delete all rows
                    ts.db.run(`DELETE FROM "${tableName}";`, function (err) {
                        if (err) {
                            mLogs({ R: "Error truncating table: " + err.toString() });
                            reject(err);
                        } else {
                            // Reset AUTOINCREMENT counter if exists
                            ts.db.run(`DELETE FROM sqlite_sequence WHERE name='${tableName}';`, function (err2) {
                                if (err2) {
                                    // Ignore error if table has no AUTOINCREMENT
                                    resolve();
                                } else {
                                    resolve();
                                }
                            });
                        }
                    });
                });
            });
        } else if (cf.SQL === "SqlServer") {
            // SQL Server: use TRUNCATE TABLE to delete all rows and reset IDENTITY
            try {
                await ts.db.request().query(`TRUNCATE TABLE [${tableName}];`);
                mLogs({ G: `Table ${tableName} truncated (SQL Server)` });
            } catch (err) {
                mLogs({ R: "Error truncating SQL Server table: " + err.toString() });
                throw err;
            }
        }
    }
    //: authentication
    register(callback){
        let ts = this;
      
        rl.question('Enter your first name: ', (firstName) => {
          rl.question('Enter your last name: ', (lastName) => {
            rl.question('Enter your email: ', (email) => {
              rl.question('Enter your password: ', (password) => {
                rl.question('Confirm your password: ', (confirmPassword) => {
                  if (password === confirmPassword) {
                    callback({firstName, lastName, email, password})
                    rl.close();
                  } else {
                    mLogs({ R: 'Passwords do not match. Please try again.' });
                    ts.register();
                  }
                });
              });
            });
          });
        });
      }
    
    login(callback){
    let ts = this;
      
    rl.question('Enter your email: ', (email) => {
        rl.question('Enter your password: ', (password) => {
        callback({email, password})
        rl.close();
        });
    });
    }
    //: debugging 
    logMagenta(...messages) {
        console.log('\x1b[35m', ...messages, '\x1b[0m');
      }
    logGreen(...messages) {
        console.log('\x1b[32m', ...messages, '\x1b[0m');
      }

      logBlue(...messages) {
        console.log('\x1b[34m', ...messages, '\x1b[0m');
      }
      logRed(...messages) {
        console.log('\x1b[31m', ...messages, '\x1b[0m');
      }
      logYellow(...messages) {
        console.log('\x1b[33m', ...messages, '\x1b[0m');
      }
    //: 

  }
          
module.exports = {DatabaseSchemaManager};
