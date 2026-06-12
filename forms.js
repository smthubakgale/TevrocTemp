// Example table names

let ProgressBarColor = '#61D8D0';
let cf_SQL;

function safeQuery(val) {
    if (val === null || val === undefined)
        return "";

    return String(val)
        .replace(/\\/g, "\\\\")  // escape backslashes
        .replace(/'/g, "''");    // escape quotes for SQL
}

function safeAtob(val) {
    if (val === null || val === undefined)
        return "";

    try {
        return atob(String(val));
    } catch (e) {
        return "";
    }
}

function safeBtoa(val) {
    if (val === null || val === undefined)
        return "";

    try {
        return safeBtoa(String(val));
    } catch (e) {
        return "";
    }
}

function openDatabasePopup() {

    let session = window.top.session ? `session=${encodeURIComponent(window.top.session)}` : 'server=test';
    let ogn = window.top.d_config ? window.top.d_config.url : '/';
    window.ogn = ogn || '/';

    document.getElementById("btnUI").click();

    const popup = document.getElementById("dbPopup");
    const listContainer = document.getElementById("tableList");

    // clear old content
    listContainer.innerHTML = "";

    // dynamically create buttons
    const url = `database/tables?${session}`;
    console.log(url);

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data.success && data.tables.length > 0, data);

            if (data.success && data.tables.length > 0) {
                const databaseList = document.querySelector('#tableList');
                databaseList.innerHTML = "";

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'database';

                const label = document.createElement('label');
                label.htmlFor = 'database';
                label.innerHTML = `Entities (${data.tables.length})<i class="chevron-icon fas fa-chevron-down" style="float:right"></i>`;

                const unorderedList = document.createElement('ul');

                databaseList.prepend(unorderedList);
                databaseList.prepend(label);
                databaseList.prepend(checkbox);
                 
                data.groups
                .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
                .forEach((group, index) => 
                { 
                    let tables = data.tables.filter(tb => tb.group == group.group).map(tb => tb.name)
                                     .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                    const listItem = document.createElement("li");
                    const link = document.createElement("a");
                    link.setAttribute("default", "false");
                    link.innerHTML = `${group.icon && false ? '<i class="fas fa-' + group.icon + '"></i>' : '<i class="fas fa-table"></i>'} <div style="flex:1; display:flex; padding-left:20px; padding-right:20px;"> <div style="flex:1;">${group.title}</div> <div>(${tables.length})</div> </div>  <i class="fas fa-chevron-right"></i>`
                    // 
                    const unorderedList2 = document.createElement('ul');
                    unorderedList2.style = "display:none; max-height:unset; padding-left:35px;"; 
                    unorderedList2.classList.add(`database-groups`);
                    unorderedList2.id = `database-group-${index}`;
                    tables.forEach((table) => {
                        const listItem2 = document.createElement("li");
                        const link2 = document.createElement("a"); 
                        link2.setAttribute("default", "false");

                        link2.href = "#database";
                        link2.setAttribute('queries', `table=${table}`)
                        link2.onclick = () => {
                            onTableClick(table, 'uiContainer');

                        };

                        link2.innerHTML = `${table.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} `;

                        listItem2.appendChild(link2);
                        unorderedList2.appendChild(listItem2);
                    })
                   
                    //
                    listItem.onclick = () => {
                        let el = databaseList.querySelector(`#database-group-${index}`);
                        databaseList.querySelectorAll('.database-groups').forEach((el2) => {
                            if (el != el2) {
                                el2.style.display = "none";
                            }
                        });
                        console.log(`#database-group-${index}` , el.style.display);

                        if (el.style.display == 'block') {
                            el.style.display = 'none';
                        }
                        else {
                            el.style.display = 'block';
                        }
                        
                    }

                    listItem.appendChild(link);
                    unorderedList.appendChild(listItem);
                    unorderedList.appendChild(unorderedList2);
                });
                 
            }
        })
        .catch((error) => {
            console.error(error);

        });

    popup.classList.add("open");
}

function closeDatabasePopup() {
    document.getElementById("dbPopup").classList.remove("open");
}

function onTableClick(tableName, containerId , refColumn = null , refFilter =null , doc = true) {
    let session = window.top.session ? `session=${encodeURIComponent(window.top.session)}` : 'server=test';
    let ogn = window.top.d_config ? window.top.d_config.url : '/'; 
    window.ogn = ogn || '/';
  
    if (tableName == null) return;

    if (refColumn == null) {
        try { document.getElementById("dbPopup").classList.remove("open"); } catch {}
    } 

    console.log("Table clicked:", tableName);
    const uiContainer = document.getElementById(containerId);
    uiContainer.innerHTML = "";

    // clear old content
    uiContainer.innerHTML = "";

    // --- Banner ---
    const banner = document.createElement("div");
    banner.id = "banner-container";
    banner.innerHTML = `<h1>Database Tables</h1>`;
    if (refColumn == null) uiContainer.appendChild(banner);

    // Create the container div for the buttons
    const btnContainer = document.createElement("div");
    btnContainer.style = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap:wrap; gap:8px";

    // --- Add New Item button (left) ---
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-primary";
    addBtn.setAttribute("onclick", `window.addBtnEvent(this)`);
    addBtn.setAttribute("data-toggle", "modal");
    addBtn.setAttribute("data-backdrop", "false");
    addBtn.setAttribute("data-target", "#add-item-modal");

    // Create icon for Add button
    const addIcon = document.createElement("i");
    addIcon.className = "fas fa-plus"; // Bootstrap icon class, me-2 adds spacing
    addBtn.appendChild(addIcon);

    // Add the text
    addBtn.appendChild(document.createTextNode(" Add New Item"));

    // --- Filters button (right) ---
    const filterBtn = document.createElement("button");
    filterBtn.type = "button";
    filterBtn.className = "btn btn-secondary";
    filterBtn.setAttribute("onclick", `window.showFilters()`);

    window.showFilters = function () {
        const filter = document.getElementById("filter-container");
        console.error(filter);

        if (filter.style.display === "none" || filter.style.display === "") {
            filter.style.display = "flex";
        } else {
            filter.style.display = "none";
        }
    }

    // Create icon for Filters button
    const filterIcon = document.createElement("i");
    filterIcon.className = "fa fa-filter me-2"; // Bootstrap icon class
    filterBtn.appendChild(filterIcon);

    // Add the text
    filterBtn.appendChild(document.createTextNode(" Filters"));

    // Append buttons to container
    btnContainer.appendChild(addBtn);
    btnContainer.appendChild(filterBtn);

    // Append container to your UI
    uiContainer.appendChild(btnContainer);


    window.updateBtnEvent = (ts) => { 

        if (window != window.top) {
            let modal = document.getElementById('update-item-modal'.replace('#database ', ''));
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
            modalInstance.show();

            if (!window.updateInits) {
                window.updateInits = true;

                modal.querySelectorAll('[data-dismiss="modal"]').forEach((close) => {
                    close.addEventListener('click', () => {
                        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                        const modalInstance2 = bootstrap.Modal.getOrCreateInstance(modal);
                        modalInstance2.hide();
                    });
                });

            }
        }

        document.querySelectorAll("#update-item-modal .subform-instance").forEach((subform, index) => { 

            if (index > 0) {
                Array.from(subform.children).forEach((child) => {
                    if (child.classList.contains("delete-subform")) { 
                        // do something with it
                        if (child.style.display == "block") {
                            subform.remove();
                        }
                    }
                });
            } 
        });
    };

    window.addBtnEvent =  (ts) => { 

        //console.error(ts);

        if (window != window.top) {
            let modal = document.getElementById('add-item-modal'.replace('#database ', ''));
            const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
            modalInstance.show();

            if (!window.addInits) {
                window.addInits = true;

                modal.querySelectorAll('[data-dismiss="modal"]').forEach((close) =>
                {
                    close.addEventListener('click', () => {
                        const modalInstance2 = bootstrap.Modal.getOrCreateInstance(modal);
                        modalInstance2.hide();
                    });
                });

            } 
        } 

        document.querySelectorAll("#add-item-modal .subform-instance").forEach((subform) => {
            // Get all direct children of subform
            Array.from(subform.children).forEach((child) => {
                if (child.classList.contains("delete-subform")) { 
                    // do something with it
                    if (child.style.display == "block") {
                        subform.remove();
                    }
                }
            });
             
        });

    };

    // --- Filter Container ---
    const filter = document.createElement("div");
    filter.className = "filter-container";
    filter.id = "filter-container";
    filter.style = `width:100%; display:none; flex-wrap:wrap`;
    uiContainer.appendChild(filter);
     
    // --- Table Container ---
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "table-container";
    tableWrapper.id = "table-container";
    uiContainer.appendChild(tableWrapper);

    const url2 = `${ogn}database/table?${session}&table=${tableName}`;
    console.log(url2);

    const url0 = `${ogn}database/sql?${session}`;


    fetch(url0)
        .then((response) => {
            console.log(response);

            return response.json();
        })
        .then((data) => {
            console.error(data);

            if (data.success) {
                cf_SQL = data.sql;

                inis();
            }
        }).catch((error) => {
            console.error(error.message);
        });

    function inis() {
        fetch(url2)
            .then((response) => {
                console.log(response);

                return response.json();
            })
            .then((data) => {
                console.log(data);

                if (data.success) {
                    let tables = data.tables;
                    window.mtable = tables;
                    let table = tables; // Assuming we only need the first table

                    console.error(table);

                    var tableHtml = createHtmlTable(table.columns.filter((column) => column.name !== "idx" && column.form != "none" && (column.group == null || refColumn != null) && column.table != false), table.reports || []);
                    var filtersHtml = createHtmlFilters(table.columns.filter((column) => column.name !== "idx" && column.form != "none"));
                    let bannerHtml = createHtmlBanner(tableName);

                    // Create the modal HTML
                    let modalHtml = `
	            <div class="modal fade" id="add-item-modal" tabindex="-1" role="dialog" aria-labelledby="add-item-modal-label" aria-hidden="true">
	                <div class="modal-dialog" role="document">
	                    <div class="modal-content">
	                        <div class="modal-header">
	                            <h5 class="modal-title" id="add-item-modal-label">Add New Item</h5>
	                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	                                <span aria-hidden="true">&times;</span>
	                            </button>
	                        </div>
	                        <div class="modal-body">
	                            <form id="add-item-form">
	                                <!-- Form fields will be generated dynamically here -->
	                            </form>
	                        </div>
	                        <div class="modal-footer">
	                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
	                            <button type="submit" class="btn btn-primary" id="add-item-btn">Add Item</button>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        `;

                    // Add the modal HTML to the page
                    uiContainer.innerHTML += modalHtml;

                    // Create the modal HTML
                    let updateModalHtml = `
		    <div class="modal fade" id="update-item-modal" tabindex="-1" role="dialog" aria-labelledby="update-item-modal-label" aria-hidden="true" style="overflow-y:scroll">
		        <div class="modal-dialog" role="document">
		            <div class="modal-content">
		                <div class="modal-header">
		                    <h5 class="modal-title" id="update-item-modal-label">Update Item</h5>
		                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                        <span aria-hidden="true">&times;</span>
		                    </button>
		                </div>
		                <div class="modal-body">
		                    <form id="update-item-form">
		                        <!-- Form fields will be generated dynamically here -->
		                    </form>
		                </div>
		                <div class="modal-footer">
		                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
		                    <button type="submit" class="btn btn-primary" id="update-item-btn">Update Item</button>
		                </div>
		            </div>
		        </div>
		    </div>
		`;
                    // Add the modal HTML to the page
                    uiContainer.innerHTML += updateModalHtml;

                    // Create the modal HTML
                    let fileManagementModalHtml = `
		    <div class="modal fade" id="file-management-modal" tabindex="-1" role="dialog" aria-labelledby="file-management-modal-label" aria-hidden="true">
		        <div class="modal-dialog modal-lg" role="document">
		            <div class="modal-content">
		                <div class="modal-header">
		                    <h5 class="modal-title" id="file-management-modal-label">File Management</h5>
		                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                        <span aria-hidden="true">&times;</span>
		                    </button>
		                </div>
		                <div class="modal-body">
		                    <ul class="nav nav-tabs" id="file-management-tabs" role="tablist" style="margin-bottom:10px;">
				      ${table.image ? `<li class="nav-item"><button class="tab-btn active" id="image-tab" style="padding:3px; margin-right:5px; margin-bottom:3px" data-toggle="tab" href="#image" role="tab" aria-controls="image" aria-selected="true"> <i class="fas fa-image" style="color:black"></i> Image</button></li>` : ''}
				      ${table.video ? `<li class="nav-item"><button class="tab-btn" id="video-tab" style="padding:3px; margin-right:5px; margin-bottom:3px" data-toggle="tab" href="#video" role="tab" aria-controls="video" aria-selected="true"> <i class="fas fa-play" style="color:black"></i> Video </button></li>` : ''}
				      ${table.panorama ? `<li class="nav-item"><button class="tab-btn" id="panorama-tab" style="padding:3px; margin-right:5px; margin-bottom:3px" data-toggle="tab" href="#panorama" role="tab" aria-controls="panorama" aria-selected="true"> <i class="fas fa-play" style="color:black"></i> 360 Video </button></li>` : ''}
				      ${table.gallery ? `<li class="nav-item"><button class="tab-btn" id="gallery-tab" style="" data-toggle="tab" href="#gallery" role="tab" aria-controls="gallery" aria-selected="false"> <i class="fas fa-gallery" style="color:black" ></i> Gallery</button></li>` : ''}
				    </ul>
		                    <div class="tab-content" id="file-management-tab-content">
		                        ${table.image ? `
		                            <div class="tab-pane fade show active" id="image" role="tabpanel" aria-labelledby="image-tab">
		                                <input type="file" id="image-input" accept="image/*" gallery="NO" onchange="uploadImage(this)" style="display:none" />
		                                <button class="btn btn-primary" id="image-upload-btn" onclick="this.parentNode.querySelector('#image-input').click()">Upload Image</button>
		                                <div id="image-preview"></div>
		                                <button class="btn btn-danger" id="image-delete-btn" style="display:none; margin-top:10px" >Delete Image</button>
		                            </div>
		                        ` : ''}
		                        ${table.video ? `
		                            <div class="tab-pane fade" id="video" role="tabpanel" aria-labelledby="video-tab">
		                                <input type="file" id="video-input" accept="video/*" gallery="NO" onchange="uploadVideo(this)" style="display:none" />
		                                <button class="btn btn-primary" id="video-upload-btn" onclick="this.parentNode.querySelector('#video-input').click()">Upload Video</button>
		                                <div id="video-preview"></div>
		                                <button class="btn btn-danger" id="video-delete-btn" style="display:none; margin-top:10px" >Delete Video</button>
		                            </div>
		                        ` : ''}
		                        ${table.panorama ? `
		                            <div class="tab-pane fade" id="panorama" role="tabpanel" aria-labelledby="panorama-tab">
		                                <input type="file" id="panorama-input" accept="video/*" gallery="NO" onchange="uploadPanorama(this)" style="display:none" />
		                                <button class="btn btn-primary" id="panorama-upload-btn" onclick="this.parentNode.querySelector('#panorama-input').click()">Upload 360 Video</button>
		                                <div id="panorama-preview"></div>
		                                <button class="btn btn-danger" id="panorama-delete-btn" style="display:none; margin-top:10px" >Delete 360 Video</button>
		                            </div>
		                        ` : ''}
		                        ${table.gallery ? `
		                            <div class="tab-pane fade" id="gallery" role="tabpanel" aria-labelledby="gallery-tab">
		                                <input type="file" id="gallery-input" accept="image/*, video/*" gallery="YES" onchange="uploadImage(this)" style="display:none;" />
		                                <button class="btn btn-primary" id="gallery-upload-btn" onclick="this.parentNode.querySelector('#gallery-input').click()">Upload Files</button>
		                                <div id="gallery-preview"></div>
		                                <ul id="gallery-list"></ul>
		                            </div>
		                        ` : ''}
		                    </div>
		                </div>
		                <div class="modal-footer">
		                    <button type="button" class="btn btn-secondary" data-dismiss="modal" >Close</button>
		                </div>
		            </div>
		        </div>
		    </div>
		`;
                    // Add the modal HTML to the page
                    uiContainer.innerHTML += fileManagementModalHtml;
                    // Add the 
                    document.body.insertAdjacentHTML("beforeend", `
		                <div class="modal fade show" id="search-item-modal" tabindex="-1" role="dialog" aria-labelledby="search-item-modal-label" aria-hidden="true" >
		                    <div class="modal-dialog modal-fullscreen" role="document" style="width: 100%; max-width: 100%; height: 100%; margin: 0;">
		                        <div class="modal-content" style="width:100vw; height:100vh; background:black;">
		                            <div class="modal-header" style="font-size:11px; padding:3px">
		                                <h6 class="modal-title" id="search-item-modal-label">Search Item</h6>
		                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                                    <span aria-hidden="true">&times;</span>
		                                </button>
		                                <button type="button" class="back" style="display:none;  padding:4px; " >
		                                    <span aria-hidden="true" style="color:#BFC1C5;"> back </span>
		                                </button>
		                            </div>
		                            <div class="modal-body">
		                                
		                            </div> 
		                        </div>
		                    </div>
		                </div>
		            `);
                    // Create the modal HTML
                    let deleteModalHtml = `
		    <div class="modal fade" id="delete-item-modal" tabindex="-1" role="dialog" aria-labelledby="delete-item-modal-label" aria-hidden="true">
		        <div class="modal-dialog" role="document">
		            <div class="modal-content">
		                <div class="modal-header">
		                    <h5 class="modal-title" id="delete-item-modal-label">Delete Item</h5>
		                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
		                        <span aria-hidden="true">&times;</span>
		                    </button>
		                </div>
		                <div class="modal-body">
		                    Are you sure you want to delete this item?
		                </div>
		                <div class="modal-footer">
		                    <button type="button" class="btn btn-secondary" id="cancel-delete-item-btn">Cancel</button>
		                    <button type="button" class="btn btn-danger" id="delete-item-btn">Delete</button>
		                </div>
		            </div>
		        </div>
		    </div>
		`;
                    // Add the modal HTML to the page
                    uiContainer.innerHTML += deleteModalHtml;

                    // Create the modal HTML
                    let viewModalHtml = `
		    <div class="modal fade" id="view-item-modal" tabindex="-1" role="dialog" aria-labelledby="view-item-modal-label" aria-hidden="true">
		        <div class="modal-dialog modal-fullscreen" role="document" style="width: 100%; max-width: 100%; height: 100%; margin: 0; overflow:hidden; padding:8px; background:#1F1F1F;">
		            <div class="modal-content" style="border:none"> 
		                <div class="modal-body ql-editor" id="view-item-modal-body" style="color:black; height:calc(100vh - 48px); background:white; overflow-y:scroll; border-radius:4px">
		                </div>
		                <div class="modal-footer" style="padding:3px">
		                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="window.closeView(event , this)">Close</button>
		                </div>
		            </div>
		        </div>
		    </div>
		`;
                    // 
                    window.closeView = function (event, ts) {
                        event.preventDefault();
                        if (ogn == "/") {
                        }
                        else {
                            // Get the modal element
                            let modal = document.getElementById('view-item-modal'.replace('#database ', ''));
                            // Show the modal
                            modalInstance.hide();
                        }

                    }
                    // Add the modal HTML to the page
                    uiContainer.innerHTML += viewModalHtml;

                    // Create the viewData function
                    window.viewData = function (_data, _atob = true) {
                        var data = _atob ? safeAtob(_data) : _data;
                        console.log(data);
                        // Get the modal body element
                        let modalBody = document.getElementById('view-item-modal-body'.replace('#database ', ''));
                        // Set the modal body HTML to the provided data
                        modalBody.innerHTML = data;
                        // Get the modal element
                        let modal = document.getElementById('view-item-modal'.replace('#database ', ''));
                        // Show the modal
                        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                        const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
                        modalInstance.show();
                    }

                    function generateFormFields(columns, groups = [], form_groups = [], constraints = [], count = 1) {
                        window.form_count = count;
                        let formFieldsHtml = '';

                        function renderField(column, group) {
                            let fieldName = column.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            let fieldHtml = '';
                            let name = (group ? group + '[0]_' : '') + column.name;
                            let df = (window.mtable.constraints || []).filter(c => c.type === "default" && c.column == column.name);
                            console.log(df);
                            let tf = (df.length == 0) ? '' : df.map(c => c.expression)[0];
                            console.log(tf);
                            df = (df.length == 0) ? '' : `value="${tf}"`;
                            console.log(df);

                            if (column.form === "datalist") {
                                fieldHtml = `
<div class="form-group">
    <label for="${name}">${fieldName}</label>
    <input class="form-control" list="${name}-options" name="${name}" id="${name}" placeholder="${fieldName}" ${df} >
    <datalist id="${name}-options">
        <!-- Options will be populated dynamically -->
    </datalist>
</div>`;
                            }
                            else if (column.form == "select" && column.filter) {
                                fieldHtml += `
		                <div class="form-group">
		                    <label for="${name}">${fieldName}</label>
		                    <select class="form-control" id="${name}" name="${name}" placeholder="${fieldName}" ${df} >
			            </select>
		                </div>
		                `;
                            }
                            else if (column.form === "select" && !column.filter) {
                                fieldHtml = `
<div class="form-group">
    <label for="${name}">${fieldName}</label>
    <select class="form-control" id="${name}" name="${name}" ${df} >
    </select>
</div>`;
                            }
                            else if (column.form === "textarea") {
                                fieldHtml = `
<div class="form-group">
    <label for="${name}">${fieldName}</label>
    <textarea class="form-control" id="${name}" name="${name}" placeholder="${fieldName}">${tf}</textarea>
</div>`;
                            }
                            else if (column.form == "none") {
                                if (column.raw) {
                                    fieldHtml += `
			        <div class="form-group">
			            <label>${fieldName} </label><br/>
			            <label> default is ${column.raw} </label>
                    </div>
`;

                                }
                            }
                            else if (column.form == "barcode") {
                                fieldHtml += `
			        <div class="form-group">
			            <label for="${name}">${fieldName}</label>
                         <div style="width:100%; display:flex; ">
			                <input class="form-control" id="${name}" style="width:calc(100% - 50px)" name="${name}" placeholder="${fieldName}" type="text" list="${name}-options" ${df} />
                             <span class="btn btn-secondary barcode" onclick="barCodeClick(this)" id="scan-${name}">
	                              <i class="fas fa-barcode"></i>
			                  </span>
                        </div>
                        <datalist id="${name}-options">
			            </datalist>
			            
	                    <div id="scanner-container-${name}"></div>
			        </div>
			    `;
                            }
                            else if (column.form == "editor") {

                                fieldHtml += `
			        <div class="form-group">
			            <label for="${name}">${fieldName}</label>
			            <div class="form-control ${name}_editor ${name}_${window.form_count}" id="${name}" name="${name}" placeholder="${fieldName}"></div>
			        </div>
			    `;
                            }
                            else if (column.form == "doc") {
                                // ? WYSIWYG modal editor
                                fieldHtml += `
        <div class="form-group">
          <label for="${name}">${fieldName}</label>
          <div class="input-group">
            <textarea class="form-control d-none" id="${name}" name="${name}"> ${df} </textarea>
            <button type="button" class="btn btn-info" onclick="openEditor(this , 'docx')">
              <i class="fas fa-edit"></i> Edit
            </button>
          </div>
        </div>
      `;
                                if (!document.getElementById("wysiwyg-modal")) {
                                    document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade" id="wysiwyg-modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen" role="document" style="width: 100%; max-width: 100%; height: 100%; margin: 0;">
        <div class="modal-content" style="height:100vh" > 
          <div class="modal-body" style="height:calc(100% - 60px);overflow:auto; background:#F3F4F6">
            <div id="wysiwyg-editor-container" style="height:100%;"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="wysiwyg-close-btn">Close</button>
            <button class="btn btn-primary" id="wysiwyg-save-btn">Save</button>
          </div>
        </div>
      </div>
    </div>
  `);
                                }

                            }
                            else if (column.form == "select" && column.check) {
                                fieldHtml += `
		                <div class="form-group">
		                    <label for="${name}">${fieldName}</label>
		                    <select class="form-control" id="${name}" name="${name}" placeholder="${fieldName}" ${df} >
			            </select>
		                </div>
		                `;
                            }
                            else if (column.form == "range") {
                                fieldHtml += `
			    <div class="form-group">
			      <label for="${name}">${fieldName}</label>
			      <input type="number" style="width:100%" class="form-control" id="${name}" name="${name}" placeholder="${fieldName}"  ${df} >
			    </div>
			  `;
                            }
                            else if (["number", "datetime-local", "date", "time", "month", "week", "email", "url", "tel", "color"].includes(column.form)) {
                                let inputAttributes = '';

                                if (column.form === 'number') {
                                    inputAttributes += `min="${column.min}" max="${column.max}" style="width:100%"`;
                                }

                                if (column.form === 'date' || column.form === 'datetime-local') {
                                    inputAttributes += `min="${column.minDate}" max="${column.maxDate}"`;
                                }

                                fieldHtml += `
			    <div class="form-group">
			      <label for="${name}">${fieldName}</label>
			      <input type="${column.form}" class="form-control" id="${name}" name="${name}" placeholder="${fieldName}" ${inputAttributes}  ${df} >
			    </div>
			  `;
                            }
                            else if (column.form == "search") {
                                const key = column.name;
                                const fk = (window.mtable.constraints || []).find(c => c.type === "foreignKey" && c.columns.includes(key));

                                if (fk) {
                                    const colDef = (window.mtable.columns || []).find(c => c.name === key);
                                    const whereCol = colDef && colDef.filter ? colDef.filter : fk.columns[0];

                                    console.log(fk, whereCol);

                                    fieldHtml = `
<div class="form-group">
    <label for="${name}">${fieldName}</label>
    <input type="text" class="form-control" id="${name}" name="${name}" placeholder="${fieldName}" style="width:calc(100% - 50px); margin-bottom:-35px" ${df} />
   <button type="button" style="padding: 6px 12px; cursor:pointer; margin-left:calc(100% - 40px); " data-toggle="modal"  data-backdrop="false" data-target="#search-item-modal" onclick="window.searchItem(event , this , '${fk.referencedTable}' , '${fk.referencedColumns[0]}' , '${whereCol}')" >
                            <i class="fas fa-search" style="color:#BFC1C5"></i>
                        </button>
</div>`;
                                } else {

                                }

                            }
                            else {
                                fieldHtml = `
<div class="form-group">
    <label for="${name}">${fieldName}</label>
    <input type="text" class="form-control" id="${name}" name="${name}" placeholder="${fieldName}" ${df} />
</div>`;
                            }

                            return fieldHtml;
                        }

                        function renderFormGroup(group, groupCols) {
                            let groupHtml = `
<fieldset class="border p-3 mb-3 rounded" data-group-wrapper="${group.name}">
    <legend class="w-auto px-2" style="font-size:1rem; color:#3577F0;">${group.title || group.name}</legend>
    <div class="subform-container">`;

                            // first red-bordered subform
                            groupHtml += `
    <div class="subform-instance p-2 mb-2 rounded" data-subform="${group.name}" style="background:#292E32" >
        ${groupCols.map(col => renderField(col, group.name)).join('')}
        <button type="button" class="btn btn-sm btn-danger delete-subform" style="display:none; margin-left:0pxo; margin-top:10px;">
            <i class="fas fa-trash"></i> Delete
        </button> 
    </div>`;

                            groupHtml += `</div>`; // close subform-container

                            groupHtml += `</fieldset>`;


                            if (group.multiple) {
                                groupHtml += `
<button type="button" class="btn btn-sm btn-danger mt-2 delete-subform" style="display:block; margin:auto;"
        onclick="addSubform(this)">
    <i class="fas fa-plus"></i> Add ${group.name.substring(0, 1).toUpperCase() + group.name.slice(1)}
</button>`;
                            }

                            return groupHtml;
                        }

                        const renderedGroups = new Set();
                        const renderedFormGroups = new Set();

                        // Render respecting original column order
                        columns.forEach(col => {

                            if (col.group && refColumn == null) {
                                const groupDef = groups.find(g => g.name === col.group);
                                if (groupDef && !renderedGroups.has(groupDef.name)) {
                                    const groupCols = columns.filter(c => c.group === groupDef.name);
                                    formFieldsHtml += renderFormGroup(groupDef, groupCols);
                                    renderedGroups.add(groupDef.name);
                                }
                            }
                            else if (col.form_group && refColumn == null) {
                                const groupDef = form_groups.find(g => g.name === col.form_group);

                                if (groupDef && !renderedFormGroups.has(groupDef.name)) {
                                    const groupCols = columns.filter(c => c.form_group === groupDef.name);
                                    formFieldsHtml += renderFormGroup(groupDef, groupCols);
                                    renderedFormGroups.add(groupDef.name);
                                }
                            }
                            else {
                                formFieldsHtml += renderField(col);
                            }
                        });

                        return formFieldsHtml;
                    }
                    //  Element Search
                    window.searchItem = function (event, ts, referencedTable, referencedColumn, filterCol) {
                        event.preventDefault();

                        let url = `${ogn == '/' ? '' : 'pages/'}search.html?table=${referencedTable}&column=${referencedColumn}&filter=${filterCol}`;
                        console.log(url);

                        const iframe = document.createElement('iframe');
                        iframe.style = `width:100%; height:100%; overflow-y:scroll; border:none; outline:none;`;
                        iframe.setAttribute('src', url);

                        // Use current iframe's own document
                        let wn = window.top;
                        wn.route = wn.route || [];
                        wn.route.push(referencedTable.replace('_', ' '));

                        wn.wins = wn.wins || [];
                        wn.wins.push(window);

                        console.error(wn.wins);
                        console.error(wn.wins);

                        function titles() {

                            let close = wn.wins[0].document.querySelector('#search-item-modal .close');
                            let back = wn.wins[0].document.querySelector('#search-item-modal .back');

                            if (wn.wins.length > 1) {
                                console.log(`clear ${referencedTable.replace('_', ' ')} header`);
                                let header = document.querySelector('#search-item-modal .modal-header');
                                header.style.display = "none";

                                wn.wins[0].document.querySelector('#search-item-modal .modal-header').style.display = "flex";

                                let title = wn.wins[0].document.querySelector('#search-item-modal .modal-title');
                                let t_html = `Search `;

                                wn.route.forEach((route) => {
                                    t_html += `<i class="fas fa-chevron-right"></i> <span style="color:#BFC1C5">${route}</span>  `;
                                })

                                title.innerHTML = t_html;


                                close.style.display = "none";
                                back.style.display = "unset";

                            }
                            else {

                                let title = wn.wins[0].document.querySelector('#search-item-modal .modal-title');
                                title.innerHTML = `Search <i class="fas fa-chevron-right"></i> <span style="color:#BFC1C5">${wn.route[0]} </span>`;

                                close.style.display = "unset";
                                back.style.display = "none";
                            }


                            let close2 = removeAllClickEvents(close);
                            close2.onclick = () => {
                                console.error("Close");
                                if (ogn == "/") {
                                    let wn2 = window.top;
                                    wn2.route = [];
                                    wn2.wins = [];
                                }
                                else {
                                    // remove iframe 
                                    let fw = wn.wins[wn.wins.length - 1];
                                    console.log(fw);
                                    // Hide the modal
                                    fw.document.querySelector('#search-item-modal').style.display = "none";
                                    fw.document.querySelector('#search-item-modal iframe').remove();

                                    fw.searchResult = null;
                                    //

                                    let wn2 = window.top;
                                    wn2.route = [];
                                    wn2.wins = [];
                                }

                            };

                            let back2 = removeAllClickEvents(back);
                            back2.onclick = () => {
                                console.error("Back");
                                console.log(wn);
                                console.log(wn.wins);
                                // remove iframe 
                                let fw = wn.wins[wn.wins.length - 1];
                                console.log(fw);
                                // Hide the modal
                                fw.document.querySelector('#search-item-modal').style.display = "none";
                                fw.document.querySelector('#search-item-modal iframe').remove();

                                fw.searchResult = null;
                                //
                                let wins = [];
                                let route = [];

                                for (var k = 0; k < wn.wins.length - 1; k++) {
                                    wins.push(wn.wins[k]);
                                    route.push(wn.route[k]);
                                }

                                wn.wins = wins;
                                wn.route = route;

                                titles();
                            };
                        }

                        function removeAllClickEvents(el) {
                            const newEl = el.cloneNode(true); // copy element + children
                            el.parentNode.replaceChild(newEl, el);
                            return newEl; // return the clean element reference
                        }

                        titles();

                        let body = document.querySelector('#search-item-modal .modal-body');
                        body.innerHTML = '';
                        body.appendChild(iframe);

                        window.searchResult = function (obj) {
                            let row = JSON.parse(safeAtob(obj));
                            console.error(row);
                            console.log(referencedColumn, filterCol);
                            const inputElement = ts.previousElementSibling;

                            if (filterCol) {
                                inputElement.value = row[filterCol];
                            } else {
                                inputElement.value = row[referencedColumn];
                            }

                            let wn2 = window.top;

                            let close = wn.wins[0].document.querySelector('#search-item-modal .close');
                            let back = wn.wins[0].document.querySelector('#search-item-modal .back');

                            if (wn2.wins.length > 1) {
                                back.click();
                            }
                            else {
                                close.click();
                            }

                            let tvs = setInterval(() => {
                                let mt = window.top.document.body.getAttribute("class");
                                let m = window.document.body.getAttribute("class");

                                if (mt == null || mt == "") window.top.document.body.setAttribute("class", "modal-open");
                                if (m == null || m == "") window.document.body.setAttribute("class", "modal-open");

                                if (m && mt) {
                                    clearInterval(tvs)
                                }
                            }, 500);
                        };

                        show();
                        function show() {
                            let dsp = document.body.querySelector('#search-item-modal').style.display;

                            if (dsp != 'block') {
                                setTimeout(function () {
                                    show();
                                }, 500);
                            }

                            document.body.querySelector('#search-item-modal').style.display = 'block';
                            document.body.querySelector('#search-item-modal').classList.add('show');
                        }

                    };

                    // Subform cloning
                    window.addSubform = function (ts) {
                        const wrapper = ts.parentNode;
                        const container = wrapper.querySelector('.subform-container');
                        const firstSubform = container.querySelector('.subform-instance');
                        const newIndex = container.querySelectorAll('.subform-instance').length;
                        if (!firstSubform) return;

                        const clone = firstSubform.cloneNode(true);
                        clone.querySelectorAll('input, select, textarea').forEach(el => el.value = '');

                        // Rename Group Ids
                        let groupName = firstSubform.getAttribute('data-subform');

                        clone.querySelectorAll('[id]').forEach(el => {
                            let oldId = el.id;
                            oldId = oldId.indexOf("]_") == -1 ? oldId : oldId.slice(oldId.indexOf("]_") + 2);

                            const newId = `${groupName}[${newIndex}]_${oldId}`;

                            el.id = newId;
                        });

                        clone.querySelectorAll('[name]').forEach(el => {
                            let oldName = el.getAttribute("name");
                            oldName = oldName.indexOf("]_") == -1 ? oldName : oldName.slice(oldName.indexOf("]_") + 2);

                            const newName = `${groupName}[${newIndex}]_${oldName}`;

                            el.setAttribute("name", newName);
                        });;

                        if (wrapper.closest("#update-item-form")) { // update/insert
                            let idxVal = null; // get idx from the row object

                            // remove old delete buttons
                            clone.querySelectorAll('button.delete-subform').forEach(btn => btn.remove());

                            // new delete button
                            const delBtn = document.createElement('button');
                            delBtn.type = 'button';
                            delBtn.className = 'btn btn-sm btn-danger delete-subform';
                            delBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
                            delBtn.style.display = 'block';
                            delBtn.style.marginLeft = '0px';
                            delBtn.style.marginTop = '10px';
                            delBtn.onclick = () => {

                                if (idxVal) {
                                    //
                                    window.del_Idx = idxVal;
                                    // Show the modal
                                    document.getElementById('delete-item-modal'.replace('#database ', '')).action = "Row";
                                    document.getElementById('delete-item-modal'.replace('#database ', '')).style.display = 'block';
                                    document.getElementById('delete-item-modal'.replace('#database ', '')).classList.add('show');
                                    //

                                    window.delCB = () => {

                                        const errorMessage = document.createElement('div');
                                        errorMessage.classList.add('alert', 'success');
                                        errorMessage.innerHTML = "Item Deleted Successfully";
                                        delBtn.parentNode.appendChild(errorMessage);
                                        setTimeout(() => { errorMessage.remove(); clone.remove(); }, 3000);

                                    }

                                    window.delER = (err) => {

                                        const errorMessage = document.createElement('div');
                                        errorMessage.classList.add('alert', 'alert-danger');
                                        errorMessage.innerHTML = err;
                                        delBtn.parentNode.appendChild(errorMessage);
                                        setTimeout(() => errorMessage.remove(), 3000);
                                    }

                                }
                                else {
                                    clone.remove();
                                }
                            };
                            clone.appendChild(delBtn);
                            // remove old file button
                            const oldfileBtn = clone.querySelector('.file-subform');
                            if (oldfileBtn) oldfileBtn.remove();

                            // new files button
                            const fileBtn = document.createElement('button');
                            fileBtn.type = 'button';
                            fileBtn.className = 'btn btn-sm btn-warning file-subform';
                            fileBtn.innerHTML = '<i class="fas fa-file"></i> Files';
                            fileBtn.style.display = 'block';
                            fileBtn.style.marginLeft = 'auto';
                            fileBtn.style.marginRight = 'auto';
                            fileBtn.style.marginTop = '-35px';

                            if (table.gallery || table.image || table.video || table.panorama) { clone.appendChild(fileBtn); }
                            // remove old save button
                            const oldSaveBtn = clone.querySelector('.save-subform');
                            if (oldSaveBtn) oldSaveBtn.remove();

                            // new save button
                            const saveBtn = document.createElement('button');
                            saveBtn.type = 'button';
                            saveBtn.className = 'btn btn-sm btn-success save-subform';
                            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
                            saveBtn.style.display = 'block';
                            saveBtn.style.marginLeft = 'auto';
                            saveBtn.style.marginTop = '-35px';

                            saveBtn.onclick = () => {
                                const inputs = clone.querySelectorAll('input, select, textarea');
                                const setClauses = [];
                                const cols = [];
                                const vals = [];

                                Object.keys(window.updateIdx).forEach((key) => {
                                    cols.push(key);

                                    let value = window.updateIdx[key];

                                    // Check FK constraint
                                    const fk = (window.mtable.constraints || []).find(c => c.type === "foreignKey" && c.columns.includes(key));

                                    if (fk) {
                                        const colDef = (window.mtable.columns || []).find(c => c.name === key);
                                        const whereCol = colDef && colDef.filter ? colDef.filter : fk.columns[0];

                                        vals.push(`(SELECT ${fk.referencedColumns[0]} FROM ${fk.referencedTable} WHERE ${whereCol} = '${safeQuery(value)}')`);
                                    } else {
                                        vals.push(`'${safeQuery(value)}'`);
                                    }
                                });


                                inputs.forEach(input => {
                                    const nameMatch = input.name.match(/\[(\d+)\]_(.+)/);
                                    if (!nameMatch) return;

                                    const fieldName = nameMatch[2];
                                    if (fieldName === 'idx') return; // skip idx

                                    let value = input.value;

                                    // Check FK constraint
                                    const fk = (window.mtable.constraints || []).find(c => c.type === "foreignKey" && c.columns.includes(fieldName));
                                    if (fk) {
                                        // get the column definition for this field
                                        const colDef = (window.mtable.columns || []).find(c => c.name === fieldName);

                                        // use filter if defined, otherwise default to fk.columns[0]
                                        const whereCol = colDef && colDef.filter ? colDef.filter : fk.columns[0];

                                        value = `(SELECT ${fk.referencedColumns[0]} FROM ${fk.referencedTable} WHERE ${whereCol} = '${safeQuery(value)}')`;
                                    } else {
                                        value = `'${safeQuery(value)}'`;
                                    }

                                    // For UPDATE
                                    setClauses.push(`${fieldName} = ${value}`);

                                    // For INSERT
                                    cols.push(fieldName);
                                    vals.push(value);
                                });

                                if (idxVal) {
                                    //
                                    fileBtn.setAttribute('id', `files-btn-${idxVal}`);

                                    fileBtn.setAttribute('data-toggle', 'modal');
                                    fileBtn.setAttribute('data-backdrop', 'false');
                                    fileBtn.setAttribute('data-target', '#file-management-modal');
                                    fileBtn.onclick = () => { window.updateId = idxVal; manageFiles(idxVal); };
                                    // UPDATE
                                    const updateQuery = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE idx = ${idxVal};`;
                                    console.log("Executing UPDATE query:", updateQuery);

                                    fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(updateQuery)}`)
                                        .then((response) => response.json())
                                        .then((data) => {
                                            console.log(data);
                                            if (data.success) {

                                            }
                                            else {
                                                console.error(data.message);
                                            }
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        });

                                }
                                else {
                                    // INSERT
                                    const insertQuery = `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${vals.join(', ')});`;
                                    console.log("Executing INSERT query:", insertQuery);

                                    fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(insertQuery)}`)
                                        .then((response) => response.json())
                                        .then((data) => {
                                            console.log(data);
                                            if (data.success) {
                                                // Build SELECT to get the idx of the inserted row
                                                const whereClauses = cols.map((col, i) => {
                                                    return `${col} = ${vals[i]}`;
                                                }).join(' AND ');

                                                const selectIdxQuery = `SELECT idx FROM ${tableName} WHERE ${whereClauses} LIMIT 1;`;
                                                console.log("Executing SELECT query to get idx:", selectIdxQuery);

                                                fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(selectIdxQuery)}`)
                                                    .then((response) => response.json())
                                                    .then((data) => {
                                                        console.log(data);

                                                        if (data.success && data.results) {
                                                            if (data.results.length > 0) {
                                                                idxVal = data.results[0].idx;
                                                                //
                                                                fileBtn.setAttribute('id', `files-btn-${idxVal}`);

                                                                fileBtn.setAttribute('data-toggle', 'modal');
                                                                fileBtn.setAttribute('data-backdrop', 'false');
                                                                fileBtn.setAttribute('data-target', '#file-management-modal');
                                                                fileBtn.onclick = () => { window.updateId = idxVal; manageFiles(idxVal); };
                                                                // 
                                                            }
                                                            else {
                                                                console.error("TODO");
                                                            }
                                                        }
                                                        else {
                                                            console.error(data);
                                                        }

                                                    }).catch((err) => {
                                                        console.error(err);
                                                    });
                                            }
                                            else {
                                                console.error(data.message);
                                            }
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        });



                                }
                            };

                            clone.appendChild(saveBtn);
                            container.appendChild(clone);
                        }
                        else {
                            // remove old delete button
                            let oldDelBtn = clone.querySelector('.delete-subform');
                            if (oldDelBtn) oldDelBtn.remove();

                            // remove old delete button
                            oldDelBtn = clone.querySelector('.delete-subform');
                            if (oldDelBtn) oldDelBtn.remove();

                            // new delete button
                            const delBtn = document.createElement('button');
                            delBtn.type = 'button';
                            delBtn.className = 'btn btn-sm btn-danger delete-subform';
                            delBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
                            delBtn.style.display = 'block';
                            delBtn.style.marginLeft = '0px';
                            delBtn.style.marginTop = '10px';
                            delBtn.onclick = () => {
                                clone.remove()
                            };

                            clone.appendChild(delBtn);
                            container.appendChild(clone);
                        }
                    }


                    // Generate the form fields dynamically and add them to the form
                    let formFieldsHtml = generateFormFields(
                        table.columns.filter((column) => column.name !== "idx"),
                        (refColumn == null ? (table.groups || []) : []),       // pass groups
                        (refColumn == null ? (table.form_groups || []) : []),  // pass form groups
                        table.constraints || [],  // pass constraints
                        1
                    );
                    document.getElementById('add-item-form').innerHTML = formFieldsHtml;

                    formFieldsHtml = generateFormFields(
                        table.columns.filter((column) => column.name !== "idx"),
                        (refColumn == null ? (table.groups || []) : []),       // pass groups
                        (refColumn == null ? (table.form_groups || []) : []),  // pass form groups
                        table.constraints || [],  // pass constraints
                        2
                    );
                    document.getElementById('update-item-form').innerHTML = formFieldsHtml;

                    // Add an event listener to the add item button
                    document.getElementById('add-item-btn').addEventListener('click', async (e) => {
                        e.preventDefault();

                        const doc = document.getElementById('add-item-form');
                        let formData = new FormData(doc);

                        // ----------------------------------------------------
                        // HANDLE QUILL EDITORS
                        // ----------------------------------------------------
                        table.columns.filter(c => c.form === "editor").forEach(column => {
                            const quillInstance = Quill.find(document.querySelector(`#add-item-form #${column.name}`));
                            if (quillInstance) {
                                formData.set(column.name, quillInstance.root.innerHTML);
                            }
                        });

                        // ----------------------------------------------------
                        // HANDLE DEFAULT "none" COLUMNS
                        // ----------------------------------------------------
                        table.columns.filter(c => c.form === "none" && c.default).forEach(column => {
                            formData.set(column.name, column.default);
                        });

                        // ----------------------------------------------------
                        // PARSE FORM INTO GROUPED STRUCTURE
                        // ---------------- product[0]_name etc. --------------
                        const groupedData = { "__root__": {} };

                        formData.forEach((value, key) => {
                            const match = key.match(/^(.+?)\[(\d+)\](?:_(.+))?$/);

                            if (match) {
                                const groupName = match[1];
                                const index = parseInt(match[2]);
                                const field = match[3];

                                if (!groupedData[groupName]) groupedData[groupName] = [];
                                if (!groupedData[groupName][index]) groupedData[groupName][index] = {};

                                groupedData[groupName][index][field] = value;
                            } else {
                                groupedData["__root__"][key] = value;
                            }
                        });

                        // ----------------------------------------------------
                        // BUILD INSERT QUERY FOR A SINGLE ROW
                        // ----------------------------------------------------
                        const buildInsert = (data) => {
                            const cols = [];
                            const vals = [];

                            for (let k of Object.keys(data)) {
                                let v = safeQuery(data[k]);

                                const view = table.columns.some(col => col.name === k && col.view === true);
                                const _btoa = table.columns.some(col => col.name === k && (col.btoa === false || col.form !== "doc"));

                                if (view && !_btoa) {
                                    v = safeBtoa(v);
                                }

                                // Foreign key?
                                const fk = (window.mtable.constraints || [])
                                    .find(c => c.type === "foreignKey" && c.columns.includes(k));

                                if (fk) {
                                    const filterCol = (table.columns.find(col => col.name === k && col.filter)?.filter)
                                        || fk.referencedColumns[0];

                                    cols.push(k);
                                    vals.push(`(SELECT ${fk.referencedColumns[0]} FROM ${fk.referencedTable} WHERE ${filterCol}='${v}')`);
                                } else {
                                    cols.push(k);
                                    vals.push(`'${v}'`);
                                }
                            }

                            return `INSERT INTO ${tableName} (${cols.join(', ')}) VALUES (${vals.join(', ')});`;
                        };


                        // ----------------------------------------------------
                        // BUILD ALL QUERIES
                        // ----------------------------------------------------
                        const queries = [];

                        const root = groupedData["__root__"];
                        const groupNames = Object.keys(groupedData).filter(k => k !== "__root__");

                        console.error(root);
                        console.error(groupNames);

                        // Case: only root fields
                        if (groupNames.length === 0) {
                            queries.push(buildInsert(root));
                        }

                        // Case: groups exist ? combine root + row
                        for (const group of groupNames) {
                            if (!Array.isArray(groupedData[group])) continue;

                            groupedData[group].forEach(row => {
                                if (!row) return; // Skip empty indexes

                                const combined = { ...root, ...row };
                                queries.push(buildInsert(combined));
                            });
                        }

                        console.log("Final Queries:", queries);


                        // ----------------------------------------------------
                        // EXECUTE QUERIES IN ORDER (no recursion bugs)
                        // ----------------------------------------------------
                        for (let q of queries) {
                            try {
                                const response = await fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(q)}`);
                                const data = await response.json();

                                if (!data.success) {
                                    const errorMessage = document.createElement('div');
                                    errorMessage.classList.add('alert', 'alert-danger');
                                    errorMessage.innerHTML = data.message;
                                    document.getElementById('add-item-btn').parentNode.appendChild(errorMessage);

                                    setTimeout(() => errorMessage.remove(), 3000);

                                    // stop inserting further queries
                                    return;
                                }
                            } catch (err) {
                                console.error("Insert error:", err);
                                return;
                            }
                        }

                        // ----------------------------------------------------
                        // SUCCESS UI
                        // ----------------------------------------------------
                        doc.reset();

                        const successMessage = document.createElement('div');
                        successMessage.classList.add('alert', 'alert-success');
                        successMessage.innerHTML = 'Item added successfully!';
                        document.getElementById('add-item-btn').parentNode.appendChild(successMessage);

                        setTimeout(() => {
                            successMessage.remove();
                            updateCount(() => {
                                updatePaginationNumbers();
                                fetchTableData();
                            });
                            window.addBtnEvent();
                        }, 3000);
                    });


                    // Add a button to open the modal 
                    if (refColumn == null) {
                        document.getElementById("banner-container").innerHTML = bannerHtml;
                    }
                    document.getElementById("filter-container").innerHTML = filtersHtml;
                    document.getElementById("table-container").innerHTML = tableHtml;

                    setTimeout(function () {
                        generateFormSearch(table.columns.filter((column) => column.name !== "idx"));
                    }, 500);

                    let whereClause = '';
                    // Add event listener for apply filter button
                    console.log(filtersHtml);
                    window.applyFilter = function () {
                        console.log("Apply");

                        let filterConditions = '';

                        // Get the columns
                        let columns = table.columns.filter(column => column.name !== "idx" && column.form != "none");

                        columns.forEach((column, index) => {
                            let inputValue = null;

                            if (column.form === "range") {
                                // For range sliders, read the values from the span
                                const rangeValueEl = document.getElementById(`${column.name}-value`);
                                if (rangeValueEl) {
                                    inputValue = rangeValueEl.textContent.split('-').map(v => v.trim());
                                }
                            } else {
                                // For normal inputs
                                const inputEl = document.querySelector(`#filter-container #${column.name}`);
                                if (inputEl) inputValue = inputEl.value;
                            }

                            if (inputValue && (Array.isArray(inputValue) || inputValue !== '')) {
                                let condition = '';

                                if (column.form === "range" && Array.isArray(inputValue)) {
                                    // Range filter: BETWEEN min and max
                                    condition = `${column.name} BETWEEN ${inputValue[0]} AND ${inputValue[1]}`;
                                } else if (column.filter) {
                                    const fks = table.constraints.filter(item => item.type === "foreignKey" && item.columns.includes(column.name));
                                    const fs = fks.filter(item => item.columns.includes(column.name));

                                    if (fs.length > 0) {
                                        condition = `EXISTS (
                        SELECT 1
                        FROM ${fs[0].referencedTable} e
                        WHERE LOWER(e.${column.filter}) LIKE '%${inputValue.toLowerCase()}%' AND
                              ${tableName}.${column.name} = e.${fs[0].referencedColumns[0]}
                    )`;
                                    } else {
                                        condition = `LOWER(${column.name}) LIKE '%${inputValue.toLowerCase()}%'`;
                                    }
                                } else {
                                    condition = `LOWER(${column.name}) LIKE '%${inputValue.toLowerCase()}%'`;
                                }

                                // Wrap the condition in parentheses
                                condition = `(${condition})`;

                                // Combine with existing filterConditions
                                if (filterConditions !== '') filterConditions += ' OR ';
                                filterConditions += condition;
                            }
                        });

                        whereClause = '';
                        if (filterConditions !== '') whereClause = ` WHERE ${filterConditions}`;

                        console.error(whereClause);

                        updateCount(() => {
                            updatePaginationNumbers();
                            fetchTableData();
                        });
                    };

                    // Add event listener for reset filter button
                    window.resetFilter = function () {
                        console.log("reset filter");
                        // Get the filter container elements
                        let filterContainerElements = document.querySelectorAll('#filter-container input, #filter-container select, #filter-container textarea');

                        console.log(filterContainerElements);
                        // Loop through the filter container elements and reset their values
                        filterContainerElements.forEach((element) => {
                            if (element.type === 'checkbox' || element.type === 'radio') {
                                element.checked = false;
                            } else if (element.tagName === 'SELECT') {
                                element.selectedIndex = 0;
                            } else {
                                element.value = '';
                            }
                        });

                        whereClause = '';
                        updateCount(() => {
                            updatePaginationNumbers();
                            fetchTableData();
                        });
                    }
                    // Get the table element from the DOM
                    let tableElement = document.getElementById('product-table');

                    window.updateCount = function (callback = () => { }) {
                        // Fetch total count of records
                        let query = `SELECT COUNT(*) AS CNT FROM ${tableName} ${whereClause}`;
                        console.log(query);
                        let countUrl = `${ogn}database/query/exec?${session}&query=${safeBtoa(query)}`;
                        fetch(countUrl)
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.success && data.results) {
                                    console.error(data.results);

                                    let totalCount = data.results[0]["CNT"];
                                    console.log(totalCount);


                                    // Set default limit and offset
                                    window.limit = 10;
                                    window.offset = 0;
                                    window.currentPage = 1;
                                    window.totalPages = Math.ceil(totalCount / limit);

                                    // Call the callback function
                                    callback();
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                                callback();
                            });
                    }
                    // Fetch total count of records
                    let countUrl = `${ogn}database/query/exec?${session}&query=${safeBtoa(`SELECT COUNT(*) AS CNT FROM ${tableName} ${whereClause}`)}`;
                    fetch(countUrl)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success && data.results) {
                                console.error(data);
                                let totalCount = data.results[0]["CNT"];
                                console.log(totalCount);

                                let options = '<option> Select Sort </option>';
                                table.columns.filter((column) => column.name !== "idx").forEach((col) => {
                                    let name = col.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                                    options += `<option val="${col.name}"> ${name} </option>`;
                                })
                                // Create select tag for limit
                                let limitSelectHtml = `
                        <div class="form-row row gap-10" >
                            <div class="form-group col-sm-3" style="min-width:150px" >
                                <label > Items per Page </label>
	                            <select id="limit-select" class="form-group col-sm-4"  style="min-width:100px">
	                                <option value="10">10</option>
	                                <option value="25">25</option>
	                                <option value="50">50</option>
	                                <option value="100">100</option>
	                                <option value="500">500</option>
	                            </select>
                            </div>
                            <div class="form-group col-sm-3" style="min-width:200px" >
                                <label> Sort By </label>
                                <select id="limit-sort-by" >
                                    ${options}
                                </select>
                            </div>
                            <div class="form-group col-sm-3" style="min-width:120px" >
                                <label> Sort Mode </label>
                                <select id="limit-sort-mode" >
                                      <option value="asc" > Ascending </option>
                                      <option value="desc" > Descending </option>
                                </select>
                            </div>
                        </div>
	                `;
                                document.getElementById("filter-container").innerHTML += limitSelectHtml;
                                document.querySelector('#filter-container #apply-filter').addEventListener('click', () => {
                                    console.log("A");
                                });

                                // Set default limit and offset
                                window.limit = 10;
                                window.sort_by = null;
                                window.sort_mode = "ASC";
                                window.sort = 'ORDER BY b.idx DESC';
                                window.offset = 0;
                                window.currentPage = 1;
                                window.totalPages = Math.ceil(totalCount / limit);

                                // Add event listener to limit select tag
                                document.getElementById('limit-select').addEventListener('change', (e) => {
                                    window.limit = parseInt(e.target.value);
                                    window.offset = 0;
                                    window.currentPage = 1;
                                    window.totalPages = Math.ceil(totalCount / limit);
                                    updatePaginationNumbers();
                                    fetchTableData();
                                });
                                // 
                                document.getElementById('limit-sort-by').addEventListener('change', (e) => {
                                    window.sort_by = e.target.value;
                                    if (window.sort_by != null) {
                                        window.sort = `ORDER BY b.${window.sort_by} ${window.sort_mode}`
                                    }
                                    else {
                                        window.sort = `ORDER BY b.idx DESC`;
                                    }

                                    updatePaginationNumbers();
                                    fetchTableData();
                                });

                                document.getElementById('limit-sort-mode').addEventListener('change', (e) => {
                                    window.sort_mode = e.target.value;
                                    if (window.sort_by != null) {
                                        window.sort = `ORDER BY b.${window.sort_by} ${window.sort_mode}`
                                    }
                                    else {
                                        window.sort = `ORDER BY b.idx DESC`;
                                    }

                                    updatePaginationNumbers();
                                    fetchTableData();
                                });

                                // Add pagination buttons
                                let paginationHtml = `
	                    <div class="pagination">
	                        <button id="prev-button">&laquo;</button>
	                        <div id="pagination-numbers" style="display:flex; gap:8px;"></div>
	                        <button id="next-button">&raquo;</button>
	                    </div>
	                `;
                                //document.getElementById("table-container").innerHTML += paginationHtml;
                                document.getElementById("table-container").insertAdjacentHTML('afterend', paginationHtml);

                                // Add event listeners to pagination buttons
                                document.getElementById('prev-button').addEventListener('click', () => {
                                    if (offset >= limit) {
                                        offset -= limit;
                                        currentPage -= 1;
                                        updatePaginationNumbers();
                                        fetchTableData();
                                    }
                                });

                                document.getElementById('next-button').addEventListener('click', () => {
                                    if (offset + limit < totalCount) {
                                        offset += limit;
                                        currentPage += 1;
                                        updatePaginationNumbers();
                                        fetchTableData();
                                    }
                                });

                                window.updatePaginationNumbers = function () {
                                    let paginationNumbersHtml = '';
                                    if (totalPages <= 4) {
                                        for (let i = 0; i < totalPages; i++) {
                                            if (i + 1 === currentPage) {
                                                paginationNumbersHtml += `<button class="active">${i + 1}</button>`;
                                            } else {
                                                paginationNumbersHtml += `<button>${i + 1}</button>`;
                                            }
                                        }
                                    } else {
                                        if (currentPage === 1) {
                                            paginationNumbersHtml += `<button class="active">1</button>`;
                                            paginationNumbersHtml += `<button>2</button>`;
                                            paginationNumbersHtml += `...`;
                                            paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                                            paginationNumbersHtml += `<button>${totalPages}</button>`;
                                        } else if (currentPage === totalPages) {
                                            paginationNumbersHtml += `<button>1</button>`;
                                            paginationNumbersHtml += `<button>2</button>`;
                                            paginationNumbersHtml += `...`;
                                            paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                                            paginationNumbersHtml += `<button class="active">${totalPages}</button>`;
                                        } else if (currentPage === 2) {
                                            paginationNumbersHtml += `<button>1</button>`;
                                            paginationNumbersHtml += `<button class="active">2</button>`;
                                            paginationNumbersHtml += `...`;
                                            paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                                            paginationNumbersHtml += `<button>${totalPages}</button>`;
                                        } else if (currentPage === totalPages - 1) {
                                            paginationNumbersHtml += `<button>1</button>`;
                                            paginationNumbersHtml += `<button>2</button>`;
                                            paginationNumbersHtml += `...`;
                                            paginationNumbersHtml += `<button class="active">${totalPages - 1}</button>`;
                                            paginationNumbersHtml += `<button>${totalPages}</button>`;
                                        } else {
                                            paginationNumbersHtml += `<button>1</button>`;
                                            paginationNumbersHtml += `<button>2</button>`;
                                            paginationNumbersHtml += `...`;
                                            paginationNumbersHtml += `<button class="active">${currentPage}</button>`;
                                            paginationNumbersHtml += `...`;
                                            paginationNumbersHtml += `<button>${totalPages - 1}</button>`;
                                            paginationNumbersHtml += `<button>${totalPages}</button>`;
                                        }
                                    }
                                    document.getElementById('pagination-numbers').innerHTML = paginationNumbersHtml;
                                }

                                window.fetchTableData = function () {
                                    let columns = table.columns.filter((column) => column.name !== "idx" && column.form != "none" && (column.group == null || refColumn != null) && column.table != false).map(column => {
                                        if (column.coalesce) {
                                            return `COALESCE(${column.name}, ${column.coalesce})`;
                                        }
                                        else if (column.nullable == true) {
                                            return `COALESCE(${column.name}, '')`;
                                        }
                                        else {
                                            return column.name
                                        }
                                    });
                                    let columns_all = table.columns.filter((column) => column.form != "none" && (column.group == null || refColumn != null) && column.table != false).map(column => {
                                        if (column.coalesce) {
                                            return `COALESCE(${column.name}, ${column.coalesce})`;
                                        }
                                        else if (column.nullable == true) {
                                            return `COALESCE(${column.name}, '')`;
                                        }
                                        else {
                                            return column.name
                                        }
                                    });
                                    let query = null;

                                    if (table.columns.filter(column => column.filter).length > 0 || table.groups) {

                                        let values = [];
                                        let tables = [`${tableName} b`];
                                        let exists = [];

                                        let joins = table.columns.filter(column => column.nullable == true || column.coalesce).length > 0;

                                        // Check if any column has a group
                                        const hasGroupColumn = table.columns.some(col => col.group != null && refColumn == null);

                                        const filteredColumns = table.columns.filter(column => {
                                            // Exclude 'none' forms, non-table columns
                                            //if (column.form === "none" || column.table === false) return false;

                                            // If any column has a group, ignore column.idx === "idx"
                                            if (hasGroupColumn && column.name === "idx") return false;

                                            // Exclude grouped columns
                                            if (column.group != null && refColumn == null) return false;

                                            return true;
                                        });

                                        console.log(filteredColumns);

                                        filteredColumns.forEach((column) => {

                                            var fks = table.constraints.filter(item => item.type == "foreignKey" &&
                                                item.columns.includes(column.name));
                                            var fs = fks.filter(item => item.columns.includes(column.name));
                                            console.log(fs);

                                            if (fs.length > 0) {
                                                if (column.coalesce) {
                                                    values.push(`COALESCE(d${values.length + 1}.${column.filter} , ${column.coalesce} ) AS ${column.name}`);
                                                    tables.push(`LEFT JOIN ${fs[0].referencedTable} d${values.length} ON b.${column.name} = d${values.length}.${fs[0].referencedColumns[0]}`);
                                                }
                                                else if (column.nullable == true) {
                                                    values.push(`COALESCE(d${values.length + 1}.${column.filter} , '') AS ${column.name}`);
                                                    tables.push(`LEFT JOIN ${fs[0].referencedTable} d${values.length} ON b.${column.name} = d${values.length}.${fs[0].referencedColumns[0]}`);
                                                }
                                                else {
                                                    values.push(`d${values.length + 1}.${column.filter} AS ${column.name}`);
                                                    if (joins) {
                                                        tables.push(`INNER JOIN ${fs[0].referencedTable} d${values.length} ON b.${column.name} = d${values.length}.${fs[0].referencedColumns[0]}`);
                                                    }
                                                    else {
                                                        tables.push(`${fs[0].referencedTable} d${values.length}`);
                                                        exists.push(`b.${column.name} = d${values.length}.${fs[0].referencedColumns[0]}`);
                                                    }
                                                }
                                            }
                                            else {
                                                if (column.coalesce) {
                                                    values.push(`COALESCE(b.${column.name} , ${column.coalesce} ) AS ${column.name}`);
                                                }
                                                else if (column.nullable == true) {
                                                    values.push(`COALESCE(b.${column.name},'') AS ${column.name}`);
                                                }
                                                else {
                                                    values.push(`b.${column.name} AS ${column.name}`);
                                                }
                                            }
                                        });

                                        let v = cf_SQL === "SqlServer" ? values[0].split(" AS ")[0] : '';
                                        console.warn(v);
                                        if (v != '') {
                                            window.sort = `ORDER BY ${v} DESC`; 
                                        }

                                        query = `SELECT DISTINCT ${values.join(', ')}
                                  FROM ${tables.join(joins ? ' ' : ', ')}
				  ${whereClause.replace(`${tableName}.`, 'b.')} ${exists.length > 0 ? (whereClause.trim() == '' ? ' WHERE ' : ' AND ') + exists.join(' AND ') : ''}
                                  ${cf_SQL === "SqlServer"
                                                ? (sort && sort.trim() !== ''
                                                    ? sort
                                                    : `ORDER BY ${v}`)
                                                : (sort || '')
                                            }
${cf_SQL === "SqlServer"
                                                ? `OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
                                                : `LIMIT ${limit} OFFSET ${offset}`
                                            } `;

                                        console.warn(query);


                                    }
                                    else {
                                        let v = cf_SQL === "SqlServer" ? columns_all[0].split(" AS ")[0] :
                                            (columns_all.filter(c => c.indexOf("idx") != -1).length == 0 ? `${tableName}.idx` : '');
                                        console.warn(v)

                                      query = `SELECT DISTINCT ${columns_all.join(', ')} 
				                      FROM ${tableName} 
				                      ${whereClause} 
				                      ORDER BY ${v} DESC 
                                      ${cf_SQL === "SqlServer"
                                    ? `OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
                                    : `LIMIT ${limit} OFFSET ${offset}`
                                            } `;

                                        console.warn(query);
                                    }

                                    console.warn(query);

                                    let tableDataUrl = `${ogn}database/query/exec?${session}&query=${safeBtoa(query)}`;

                                    fetch(tableDataUrl)
                                        .then((response) => response.json())
                                        .then((data) => {
                                            console.error(data);

                                            if (data.success && data.results) {
                                                let tableData = data.results;

                                                // Load table data
                                                let tableBodyHtml = '';
                                                tableData.forEach((row, index) => {
                                                    console.log(row, window.updateIdx);

                                                    let rowHtml = '<tr>';
                                                    rowHtml += `<td> <input type="checkbox" /> </td>`;

                                                    columns.forEach((column, index) => {
                                                        let view = table.columns.filter(col => col.name == column && col.view == true).length > 0;
                                                        let _atob = table.columns.filter(col => col.name == column && col.atob == false).length == 0;
                                                        let is_color = table.columns.filter(col => col.name == column && col.color == true).length > 0;

                                                        let c_name = extractColumnName(column);
                                                        function extractColumnName(expr) {
                                                            // Trim whitespace
                                                            expr = expr.trim();

                                                            // Check for COALESCE(...) pattern
                                                            const coalesceMatch = expr.match(/^COALESCE\s*\(\s*([a-zA-Z0-9_]+)\s*,/i);
                                                            if (coalesceMatch) {
                                                                return coalesceMatch[1]; // first argument
                                                            }

                                                            // If it's not COALESCE, return as-is (for safety)
                                                            return expr;
                                                        }


                                                        console.log(table.columns.filter(col => col.name == column));
                                                        console.log(view, column, c_name, row[c_name], atob);


                                                        if (view) {
                                                            rowHtml += `<td><button class="btn btn-sm btn-info" onclick="viewData('${row[c_name]}' , ${_atob})"><i class="fas fa-eye"></i></button></td>`;
                                                        }
                                                        else {
                                                            let cr = `<div style="width:60px; height:20px; background:${row[c_name]};" ></div>`;

                                                            rowHtml += `<td style="white-space: nowrap;">${(['null', 'undefined'].indexOf(row[c_name] + '') == -1 ? row[c_name] : '') +
                                                                (is_color ? cr : '')}</td>`;
                                                        }
                                                    });

                                                    // Add extra column for delete and update buttons
                                                    rowHtml += `<td style="display:flex; gap:8px; flex-wrap:no-wrap;">
	                                    <button class="btn btn-danger" id="delete-btn-${row['idx'] || index}">
	                                        <i class="fas fa-trash-alt"></i>
	                                    </button>
	                                    <button class="btn btn-primary" data-toggle="modal"  data-backdrop="false" data-target="#update-item-modal" id="update-btn-${row['idx'] || index}">
	                                        <i class="fas fa-edit"></i>
	                                    </button>`;

                                                    if (refColumn == null) {

                                                    }
                                                    else {
                                                        // Add extra column for delete and update buttons
                                                        rowHtml += `
	                                    <button class="btn btn-success" onclick="window.parent.searchResult('${safeBtoa(JSON.stringify(row))}')">
	                                        <i class="fas fa-mouse-pointer"></i> 
	                                    </button>
`;
                                                    }

                                                    let groups = table.columns.filter(col => col.group != null).length > 0;

                                                    if (((table.gallery == true || table.image == true || table.video || table.panorama)) && !(refColumn == null && groups)) {
                                                        rowHtml += `
					        <button class="btn btn-warning" data-toggle="modal"  data-backdrop="false" data-target="#file-management-modal" " id="files-btn-${row['idx']}" >
					         <i class="fas fa-file"></i>
					        </button>`;
                                                    }

                                                    rowHtml += `
	                                </td>`;
                                                    let reports = table.reports || [];

                                                    if (reports.length > 0) {
                                                        console.error(reports);

                                                        reports.forEach((report) => {
                                                            rowHtml += `<td style="white-space: nowrap;" > <div style="display:flex;"> <span> ${report.name} </span> <button class="btn btn-sm btn-info" onclick="window.openReport('${safeBtoa(JSON.stringify(report))}' , '${row['idx'] || safeBtoa(JSON.stringify(row))}', ${row['idx'] != null})" style="margin-left:4px; margin-right:10px; "><i class="fas fa-file-alt"></i></button> </div> </td>`;
                                                        })
                                                    }

                                                    rowHtml += '</tr>';
                                                    tableBodyHtml += rowHtml;
                                                });

                                                // Append table data to the table
                                                let tableBody = document.getElementById('table-body');
                                                tableBody.innerHTML = tableBodyHtml;

                                                console.log(tableElement);

                                                console.log(tableBody);

                                                // Add event listeners for delete and update buttons 
                                                tableData.forEach((row, index) => {
                                                    var deletes = document.getElementById(`delete-btn-${row['idx'] || index}`);
                                                    if (deletes) {
                                                        deletes.addEventListener('click', () => {
                                                            deleteRow(row['idx'] || row);
                                                        });
                                                    }

                                                    var updates = document.getElementById(`update-btn-${row['idx'] || index}`);
                                                    if (updates) {
                                                        updates.addEventListener('click', () => {
                                                            updateRow(row['idx'] || row);
                                                        });
                                                    }

                                                    var files = document.getElementById(`files-btn-${row['idx']}`);
                                                    if (files) {
                                                        files.addEventListener('click', () => {
                                                            console.log(row['idx']);
                                                            manageFiles(row['idx']);
                                                        });
                                                    }
                                                });
                                                // Add event listeners to pagination numbers 
                                                document.querySelectorAll('#pagination-numbers button').forEach((button) => {
                                                    button.addEventListener('click', (e) => {
                                                        e.preventDefault();
                                                        let newPage = parseInt(button.textContent);
                                                        if (newPage === currentPage) return;
                                                        offset = (newPage - 1) * limit;
                                                        currentPage = newPage;
                                                        updatePaginationNumbers();
                                                        fetchTableData();
                                                    });
                                                });
                                                // Function to manage files 
                                                function manageFiles(idx) {
                                                    let imageInput = document.querySelector('#file-management-modal '
                                                        + '#image '
                                                        + 'input[type="file"]');
                                                    if (imageInput) {
                                                        imageInput.setAttribute('idx', idx);
                                                    }
                                                    //
                                                    let videoInput = document.querySelector('#file-management-modal '
                                                        + '#video '
                                                        + 'input[type="file"]');
                                                    if (videoInput) {
                                                        videoInput.setAttribute('idx', idx);
                                                    }
                                                    //
                                                    let panoramaInput = document.querySelector('#file-management-modal '
                                                        + '#panorama '
                                                        + 'input[type="file"]');
                                                    if (panoramaInput) {
                                                        panoramaInput.setAttribute('idx', idx);
                                                    }
                                                    //
                                                    let galleryInput = document.querySelector('#file-management-modal '
                                                        + '#gallery '
                                                        + 'input[type="file"]');
                                                    if (galleryInput) {
                                                        galleryInput.setAttribute('idx', idx);
                                                    }

                                                    /*let tableName = tableName;*/
                                                    var img_prev = '#file-management-modal #image #image-preview';
                                                    var img_del = '#file-management-modal #image #image-delete-btn';
                                                    var img_upd = '#file-management-modal #image #image-upload-btn';

                                                    var vid_prev = '#file-management-modal #video #video-preview';
                                                    var vid_del = '#file-management-modal #video #video-delete-btn';
                                                    var vid_upd = '#file-management-modal #video #video-upload-btn';

                                                    var pan_prev = '#file-management-modal #panorama #panorama-preview';
                                                    var pan_del = '#file-management-modal #panorama #panorama-delete-btn';
                                                    var pan_upd = '#file-management-modal #panorama #panorama-upload-btn';

                                                    var list = '#file-management-modal #gallery #gallery-list';
                                                    var gal_prev = '#file-management-modal #gallery #gallery-preview';

                                                    try { document.querySelector(img_prev).innerHTML = ''; } catch { }
                                                    try { document.querySelector(vid_prev).innerHTML = ''; } catch { }
                                                    try { document.querySelector(pan_prev).innerHTML = ''; } catch { }
                                                    try { document.querySelector(list).innerHTML = ''; } catch { }
                                                    try { document.querySelector(gal_prev).innerHTML = ''; } catch { }

                                                    let isFirst = true;

                                                    console.log('request file list');
                                                    fetch(`${ogn}list-files?${session}&tableName=${tableName}&tableIdx=${idx}`)
                                                        .then(response => response.json())
                                                        .then((data) => {
                                                            console.log(data);

                                                            var proc1 = true;
                                                            var proc2 = true;
                                                            var proc3 = true;

                                                            if (data) {
                                                                console.error(data);

                                                                data.forEach((item) => {
                                                                    // Image 
                                                                    try {
                                                                        if (item.file_name && item.file_size && item.gallery == "NO" && item.file_mime.indexOf("image") != -1 && proc1) {
                                                                            proc1 = false;
                                                                            const image = document.createElement('img');
                                                                            image.width = 200;
                                                                            image.height = 200;
                                                                            image.src = `${ogn}get-file?${session}&tableName=${tableName}&idx=${encodeURI(item.idx)}`;
                                                                            document.querySelector(img_prev).innerHTML = image.outerHTML;
                                                                            document.querySelector(img_prev).style.display = "block";

                                                                            const uploadButton = document.querySelector(img_upd);
                                                                            uploadButton.style.display = "none";
                                                                            const deleteButton = document.querySelector(img_del);
                                                                            deleteButton.style.display = "block";

                                                                            deleteButton.addEventListener('click', () => {
                                                                                let button = document.getElementById('delete-item-modal'.replace('#database ', ''));

                                                                                button.setAttribute('idx', item.idx);
                                                                                button.setAttribute('table_name', tableName);
                                                                                button.setAttribute('table_idx', idx);

                                                                                window.del_idx = item.idx;
                                                                                window.del_table = tableName;
                                                                                window.del_table_idx = idx;

                                                                                deleteFile();
                                                                            });

                                                                        }
                                                                    } catch (err) {
                                                                        console.error(item);
                                                                        console.error(err);
                                                                    }
                                                                    // 3D Video 
                                                                    try {
                                                                        console.error(item, item.file_name , item.file_size , item.gallery == "NO" , item.file_mime.indexOf("video") != -1 , item.panoroma == "YES" , proc2);

                                                                        if (item.file_name && item.file_size && item.gallery == "NO" && item.file_mime.indexOf("video") != -1 && item.panaroma == "YES" && proc2) {
                                                                            console.error("render3DVideo");
                                                                            proc2 = false;

                                                                            const videoURL = `${ogn}get-file?${session}&tableName=${tableName}&idx=${encodeURI(item.idx)}`;

                                                                            const container = document.createElement("div");

                                                                            container.innerHTML = `
        
                                                                                <div style="position:relative;width:400px;height:400px;background:#000">

                                                                                    <canvas id="canvas360_${item.idx}" style="width:100%;height:100%"></canvas>

                                                                                    <video id="video360_${item.idx}" hidden crossorigin="anonymous">
                                                                                        <source src="${videoURL}" type="video/mp4">
                                                                                    </video>

                                                                                    <div style="
                                                                                        position:absolute;
                                                                                        bottom:0;
                                                                                        left:0;
                                                                                        width:100%;
                                                                                        background:rgba(0,0,0,0.65);
                                                                                        padding:6px;
                                                                                        display:flex;
                                                                                        align-items:center;
                                                                                        gap:6px;
                                                                                        color:white;
                                                                                        box-sizing:border-box;
                                                                                    ">

                                                                                        <button id="playBtn_${item.idx}"> ? </button>

                                                                                        <span id="current_${item.idx}">0:00</span>

                                                                                        <input type="range" id="seek_${item.idx}" min="0" max="0" step="0.01" value="0" style="flex:1">

                                                                                        <span id="duration_${item.idx}">0:00</span>

                                                                                    </div>

                                                                                </div>
                                                                                `;

                                                                            document.querySelector(pan_prev).innerHTML = "";
                                                                            document.querySelector(pan_prev).appendChild(container);

                                                                            document.querySelector(pan_prev).style.display = "block";

                                                                            if (Video360Player) {
                                                                                // Server vs Client 
                                                                                let w = window.top.d_config ? 400 : 400;
                                                                                let h = window.top.d_config ? 400 : 400;
                                                                                // INIT 360 PLAYER
                                                                                const player = new Video360Player(
                                                                                    `canvas360_${item.idx}`,
                                                                                    `video360_${item.idx}`,
                                                                                    {
                                                                                        playBtn: `playBtn_${item.idx}`,
                                                                                        seekBar: `seek_${item.idx}`,
                                                                                        currentTime: `current_${item.idx}`,
                                                                                        duration: `duration_${item.idx}`
                                                                                    },
                                                                                    w ,
                                                                                    h 
                                                                                );

                                                                                // Enable motion controls if available
                                                                                if (typeof DeviceMotionEvent !== "undefined" &&
                                                                                    typeof DeviceMotionEvent.requestPermission === "function") {

                                                                                    const btn = document.createElement("button");
                                                                                    btn.innerText = "Enable Motion";
                                                                                    btn.style.position = "absolute";
                                                                                    btn.style.top = "10px";
                                                                                    btn.style.left = "10px";
                                                                                    btn.style.zIndex = "9999";

                                                                                    container.appendChild(btn);

                                                                                    btn.addEventListener("click", async () => {

                                                                                        const response = await DeviceMotionEvent.requestPermission();

                                                                                        if (response === "granted") {
                                                                                            player.initDeviceOrientation();
                                                                                            btn.style.display = "none";
                                                                                        }

                                                                                    });

                                                                                } else {

                                                                                    player.initDeviceOrientation();

                                                                                }
                                                                            }
                                                                            else {
                                                                                console.error("360 Library Missing");
                                                                            }
                                                                        
                                                                            // Upload / Delete buttons logic
                                                                            const uploadButton = document.querySelector(pan_upd);
                                                                            uploadButton.style.display = "none";

                                                                            const deleteButton = document.querySelector(pan_del);
                                                                            deleteButton.style.display = "block";

                                                                            deleteButton.addEventListener('click', () => {

                                                                                let button = document.getElementById('delete-item-modal'.replace('#database ', ''));

                                                                                button.setAttribute('idx', item.idx);
                                                                                button.setAttribute('table_name', tableName);
                                                                                button.setAttribute('table_idx', idx);

                                                                                window.del_idx = item.idx;
                                                                                window.del_table = tableName;
                                                                                window.del_table_idx = idx;

                                                                                deleteFile();

                                                                            });

                                                                        }
                                                                    }
                                                                    catch (err) {
                                                                        console.error(item);
                                                                        console.error(err);
                                                                    }
                                                                    // 2D Video
                                                                    try
                                                                    {
                                                                        console.error(item.file_name , item.file_size , item.gallery == "NO" , item.file_mime.indexOf("video") != -1 , item.pararoma != "YES" , proc3);
                                                                        if (item.file_name && item.file_size && item.gallery == "NO" && item.file_mime.indexOf("video") != -1 && item.pararoma != "YES" && proc3) {
                                                                            console.error("render2DVideo");
                                                                            proc3 = false;
                                                                            const video = document.createElement('video');
                                                                            video.width = 400;
                                                                            video.height = 400;

                                                                            video.allowFullscreen = true;
                                                                            video.setAttribute('allowfullscreen', '');

                                                                            video.controls = true;          // Add play/pause controls
                                                                            video.autoplay = false;         // Set to true if you want autoplay
                                                                            video.loop = false;             // Set to true if you want the video to loop
                                                                            video.muted = true;            // Set to true if you want it muted by default

                                                                            video.src = `${ogn}get-file?${session}&tableName=${tableName}&idx=${encodeURI(item.idx)}`;
                                                                            document.querySelector(vid_prev).innerHTML = video.outerHTML;
                                                                            document.querySelector(vid_prev).style.display = "block";

                                                                            const uploadButton = document.querySelector(vid_upd);
                                                                            uploadButton.style.display = "none";
                                                                            const deleteButton = document.querySelector(vid_del);
                                                                            deleteButton.style.display = "block";

                                                                            deleteButton.addEventListener('click', () => {
                                                                                let button = document.getElementById('delete-item-modal'.replace('#database ', ''));

                                                                                button.setAttribute('idx', item.idx);
                                                                                button.setAttribute('table_name', tableName);
                                                                                button.setAttribute('table_idx', idx);

                                                                                window.del_idx = item.idx;
                                                                                window.del_table = tableName;
                                                                                window.del_table_idx = idx;

                                                                                deleteFile();
                                                                            });

                                                                        }
                                                                    } catch (err) {
                                                                        console.error(item);
                                                                        console.error(err);
                                                                    }

                                                                    try {
                                                                        if (item.file_name && item.file_size && item.gallery == "YES") {
                                                                            const li = document.createElement('li');
                                                                            li.style.display = 'flex';

                                                                            const fileNameP = document.createElement('p');
                                                                            fileNameP.textContent = item.file_name;

                                                                            const fileSizeP = document.createElement('p');
                                                                            fileSizeP.textContent = formatFileSize(item.file_size);

                                                                            const deleteButton = document.createElement('button');
                                                                            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
                                                                            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';

                                                                            deleteButton.addEventListener("click", () => {
                                                                                let button = document.getElementById('delete-item-modal'.replace('#database ', ''));

                                                                                button.setAttribute('idx', item.idx);
                                                                                button.setAttribute('table_name', tableName);
                                                                                button.setAttribute('table_idx', idx);
                                                                                deleteFile();
                                                                            });

                                                                            li.appendChild(fileNameP);
                                                                            li.appendChild(fileSizeP);
                                                                            li.appendChild(deleteButton);

                                                                            li.onclick = function () {
                                                                                if (item.file_mime.indexOf("image") != -1) {
                                                                                    const image = document.createElement('img');
                                                                                    image.width = 200;
                                                                                    image.height = 200;
                                                                                    image.src = `get-file?${session}&tableName=${tableName}&idx=${encodeURI(item.idx)}`;
                                                                                    document.querySelector(gal_prev).innerHTML = image.outerHTML;
                                                                                }
                                                                                else if (item.file_mime.indexOf("video") != -1) {
                                                                                    const video = document.createElement('video');
                                                                                    video.width = 200;
                                                                                    video.height = 200;
                                                                                    video.src = `get-file?${session}&tableName=${tableName}&idx=${encodeURI(item.idx)}`;
                                                                                    document.querySelector(gal_prev).innerHTML = video.outerHTML;
                                                                                }
                                                                                else {

                                                                                }

                                                                            };

                                                                            document.querySelector(list).appendChild(li);

                                                                            if (isFirst) {
                                                                                isFirst = false;
                                                                                li.click();
                                                                            }
                                                                        }
                                                                    } catch (err) { }
                                                                });
                                                            }

                                                            console.error(proc1, proc2, proc3);

                                                            if (proc1) {
                                                                document.querySelector(img_prev).style.display = "none";
                                                                document.querySelector(img_upd).style.display = "block";
                                                                document.querySelector(img_del).style.display = "none";
                                                            }

                                                            if (proc2) {
                                                                document.querySelector(pan_prev).style.display = "none";
                                                                document.querySelector(pan_upd).style.display = "block";
                                                                document.querySelector(pan_del).style.display = "none";
                                                            }

                                                            if (proc3) {
                                                                document.querySelector(vid_prev).style.display = "none";
                                                                document.querySelector(vid_upd).style.display = "block";
                                                                document.querySelector(vid_del).style.display = "none";
                                                            }
                                                        })
                                                        .catch(error => console.error('Error:', error));

                                                    function formatFileSize(bytes) {
                                                        if (bytes === 0) return '0 bytes';

                                                        const sizes = ['bytes', 'kB', 'MB', 'GB', 'TB'];
                                                        const index = Math.floor(Math.log(bytes) / Math.log(1024));

                                                        const size = bytes / Math.pow(1024, index);
                                                        return `${size.toFixed(2)} ${sizes[index]}`;
                                                    }
                                                }

                                                window.deleteFile = function () {
                                                    // Show the modal
                                                    document.getElementById('delete-item-modal'.replace('#database ', '')).action = "File";
                                                    document.getElementById('delete-item-modal'.replace('#database ', '')).style.display = 'block';
                                                    document.getElementById('delete-item-modal'.replace('#database ', '')).classList.add('show');
                                                    //
                                                }
                                                window.uploadPanorama = function (input) {
                                                    let file = input.files[0];
                                                    let fileName = file.name;
                                                    let fileSize = file.size;
                                                    let fileMime = file.type;   // <-- ADD THIS LINE
                                                    let filePanaroma = 'YES';

                                                    console.error(fileMime);

                                                    let reader = new FileReader();
                                                    reader.onload = function (event) {
                                                        let base64String = event.target.result;
                                                        let tableIdx = input.getAttribute('idx') || window.updateId || window.updateIdx;

                                                        let tableGallery = input.getAttribute('gallery') == 'YES';
                                                        constructSql(base64String, tableIdx, tableGallery, input, fileName, fileSize, fileMime, filePanaroma);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }

                                                window.uploadVideo = function (input) {
                                                    let file = input.files[0];
                                                    let fileName = file.name;
                                                    let fileSize = file.size;
                                                    let fileMime = file.type;   // <-- ADD THIS LINE

                                                    console.error(fileMime);

                                                    let reader = new FileReader();
                                                    reader.onload = function (event) {
                                                        let base64String = event.target.result;
                                                        let tableIdx = input.getAttribute('idx') || window.updateId || window.updateIdx;

                                                        let tableGallery = input.getAttribute('gallery') == 'YES';
                                                        constructSql(base64String, tableIdx, tableGallery, input, fileName, fileSize, fileMime);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }

                                                window.uploadImage = function (input) {
                                                    let file = input.files[0];
                                                    let fileName = file.name;
                                                    let fileSize = file.size;
                                                    let fileMime = file.type;   // <-- ADD THIS LINE

                                                    let reader = new FileReader();
                                                    reader.onload = function (event) {
                                                        let base64String = event.target.result;
                                                        let tableIdx = input.getAttribute('idx') || window.updateId || window.updateIdx;

                                                        let tableGallery = input.getAttribute('gallery') == 'YES';
                                                        constructSql(base64String, tableIdx, tableGallery, input, fileName, fileSize, fileMime);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }

                                                function constructSql(base64String, tableIdx, tableGallery, input, fileName, fileSize, fileMime, filePanaroma = 'NO') {
                                                    /*let tableName = tableName;*/
                                                    let cn = (fileSize / 10000);
                                                    cn = cn < 1 ? 1 : cn;

                                                    if (cn > 10) { cn = 5; }
                                                    else if (cn > 20) { cn = 10; }

                                                    console.log(fileSize / 10000, cn);
                                                    let sqlQuery = base64String;
                                                    function getPacketSize(fileSize) {
                                                        /**
                                                         * Determine packet size based on file size
                                                         * fileSize: in bytes
                                                         * Returns packet size in bytes
                                                         */

                                                        if (fileSize <= 50 * 1024) {         // up to 50 KB
                                                            return 50 * 1024;                 // 50 KB
                                                        } else if (fileSize <= 500 * 1024) { // up to 500 KB
                                                            return 100 * 1024;                // 100 KB
                                                        } else if (fileSize <= 5 * 1024 * 1024) { // up to 5 MB
                                                            return 200 * 1024;                // 200 KB
                                                        } else if (fileSize <= 20 * 1024 * 1024) { // up to 20 MB
                                                            return 500 * 1024;                // 500 KB
                                                        } else {                              // bigger than 20 MB
                                                            return 1024 * 1024;               // 1 MB
                                                        }
                                                    }

                                                    const packetSize = getPacketSize(fileSize);
                                                    const packets = [];

                                                    for (let i = 0; i < sqlQuery.length; i += packetSize) {
                                                        const packetId = Math.floor(i / packetSize);
                                                        const packetData = encodeURIComponent(sqlQuery.slice(i, i + packetSize));
                                                        const isLastPacket = packetId === Math.ceil(sqlQuery.length / packetSize) - 1;

                                                        packets.push({
                                                            clientId: '', // Client ID will be generated on the server-side
                                                            packetId,
                                                            packetData,
                                                            isLastPacket,
                                                            filePanaroma
                                                        });
                                                    }

                                                    packets[0]["tableName"] = tableName;
                                                    packets[0]["tableIdx"] = tableIdx;
                                                    packets[0]["server"] = "test";
                                                    packets[packets.length - 1]["server"] = "test";
                                                    packets[packets.length - 1]["tableGallery"] = tableGallery;
                                                    packets[packets.length - 1]["fileName"] = fileName;
                                                    packets[packets.length - 1]["fileSize"] = fileSize;
                                                    packets[packets.length - 1]["fileMime"] = fileMime;

                                                    // Create a progress bar container
                                                    const progressBarContainer = document.createElement('div');
                                                    progressBarContainer.style.background = '#f0f0f0'; // Grayish background
                                                    progressBarContainer.style.padding = '5px';
                                                    progressBarContainer.style.borderRadius = '5px';
                                                    progressBarContainer.style.width = '200px'; // Adjust the width as needed
                                                    progressBarContainer.style.marginTop = '10px'; // Add some margin top

                                                    // Create a progress bar
                                                    const progressBar = document.createElement('div');
                                                    progressBar.style.width = '0%';
                                                    progressBar.style.height = '20px';
                                                    progressBar.style.background = ProgressBarColor;

                                                    // Create a progress text element
                                                    const progressText = document.createElement('span');
                                                    progressText.style.float = 'right';

                                                    progressBarContainer.appendChild(progressBar);
                                                    progressBarContainer.appendChild(progressText);

                                                    input.insertAdjacentElement('afterend', progressBarContainer);

                                                    // Send the first packet to the server to generate the client ID
                                                    fetch(`${ogn}receivePacket`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(packets[0])
                                                    })
                                                        .then((response) => response.json())
                                                        .then((data) => {
                                                            const clientId = data.clientId;
                                                            //console.log(clientId);

                                                            // Send the remaining packets with the generated client ID
                                                            function sendPackets(packets, index = 0) {
                                                                if (index >= packets.length) {
                                                                    // Remove the progress bar container
                                                                    progressBarContainer.remove();
                                                                    // Refresh 
                                                                    manageFiles(tableIdx);
                                                                    //
                                                                    return;
                                                                }

                                                                const packet = packets[index];
                                                                packet.clientId = clientId;

                                                                // Update the progress bar and text
                                                                const progress = (index / packets.length) * 100;
                                                                progressBar.style.width = progress + '%';
                                                                progressText.innerText = `${Math.floor(progress)}%`;

                                                                fetch(`${ogn}receivePacket`, {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify(packet)
                                                                })
                                                                    .then((response) => response.json())
                                                                    .then((data) => {
                                                                        //console.log(data);
                                                                        sendPackets(packets, index + 1); // Send the next packet
                                                                    })
                                                                    .catch((error) => console.error(error));
                                                            }

                                                            sendPackets(packets.slice(1));
                                                        })
                                                        .catch((error) => {
                                                            console.error(error);
                                                            // Remove the progress bar container
                                                            progressBarContainer.remove();
                                                            // Refresh 
                                                            manageFiles(tableIdx);
                                                            //
                                                        });
                                                }
                                                // Function to update a row
                                                function updateRow(idx) {

                                                    console.log("?? updateRow START:", idx);

                                                    window.updateBtnEvent();
                                                    window.updateIdx = idx;

                                                    const form = document.getElementById("update-item-form");

                                                    // ============================
                                                    // SIMPLE MODE
                                                    // ============================
                                                    if (typeof (idx) !== 'object') {

                                                        console.log("?? SIMPLE MODE");

                                                        let rowData = tableData.find(row => row.idx === idx);
                                                        console.log("?? Row:", rowData);

                                                        if (typeof idx !== 'object') {

                                                            console.log("?? SIMPLE MODE (with groups support)");

                                                            let rowData = tableData.find(row => row.idx == idx);

                                                            if (!rowData) {
                                                                console.error("? Row not found");
                                                                return;
                                                            }

                                                            table.columns
                                                                .filter(col => col.name !== "idx")
                                                                .forEach(column => {

                                                                    let val = rowData[column.name];
                                                                    val = (val === null || val === 'null') ? '' : val;

                                                                    if (column.atob) {
                                                                        try { val = safeAtob(val); } catch { }
                                                                    }

                                                                    let el = null;

                                                                    // ? HANDLE group + form_group
                                                                    if (column.group || column.form_group) {

                                                                        const groupName = column.group || column.form_group;

                                                                        // ?? IMPORTANT: FIND FIRST INSTANCE
                                                                        el = document.querySelector(
                                                                            `#update-item-modal [name^="${groupName}["][name$="_${column.name}"]`
                                                                        );

                                                                        console.log(`?? Searching grouped: ${groupName} -> ${column.name}`);
                                                                    }
                                                                    else {
                                                                        el = document.querySelector(
                                                                            `#update-item-modal [name="${column.name}"], #update-item-modal #${column.name}`
                                                                        );
                                                                    }

                                                                    if (!el) {
                                                                        console.warn("?? Missing element:", column.name);
                                                                        return;
                                                                    }

                                                                    console.log("? Found:", column.name);

                                                                    setValue(el, column, val);
                                                                });
                                                        }

                                                    } else {

                                                        console.log("?? COMPLEX MODE");

                                                        const mainAlias = "b";
                                                        let values2 = [];
                                                        let joins2 = [];
                                                        let qr = [];

                                                        // ============================
                                                        // BUILD SELECT + JOINS
                                                        // ============================
                                                        table.columns
                                                            .filter(col => col.name !== "idx")
                                                            .forEach(column => {

                                                                const fk = table.constraints.find(c =>
                                                                    c.type === "foreignKey" && c.columns.includes(column.name)
                                                                );

                                                                if (fk) {
                                                                    const alias = `d${values2.length + 1}`;
                                                                    const refCol = column.filter || fk.referencedColumns[0];

                                                                    values2.push(`COALESCE(${alias}.${refCol}, '') AS ${column.name}`);
                                                                    joins2.push(`LEFT JOIN ${fk.referencedTable} ${alias} 
                        ON ${mainAlias}.${column.name} = ${alias}.${fk.referencedColumns[0]}`);
                                                                }
                                                                else {
                                                                    values2.push(`COALESCE(${mainAlias}.${column.name}, '') AS ${column.name}`);
                                                                }
                                                            });

                                                        // ============================
                                                        // WHERE CONDITIONS
                                                        // ============================
                                                        Object.keys(idx).forEach(key => {

                                                            let value = idx[key];

                                                            const fk = (window.mtable.constraints || [])
                                                                .find(c => c.type === "foreignKey" && c.columns.includes(key));

                                                            if (fk) {
                                                                const colDef = window.mtable.columns.find(c => c.name === key);
                                                                const whereCol = colDef?.filter || fk.columns[0];

                                                                qr.push(`${mainAlias}.${key} IN (
                    SELECT ${fk.referencedColumns[0]} 
                    FROM ${fk.referencedTable} 
                    WHERE ${whereCol} = '${value}'
                )`);
                                                            } else {
                                                                qr.push(`${mainAlias}.${key} = '${value}'`);
                                                            }
                                                        });

                                                        const query = `
SELECT ${mainAlias}.idx, ${values2.join(", ")}
FROM ${tableName} ${mainAlias}
${joins2.join("\n")}
WHERE ${qr.join(" AND ")}
ORDER BY ${mainAlias}.idx DESC`;

                                                        console.log("?? QUERY:", query);

                                                        fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(query)}`)
                                                            .then(r => r.json())
                                                            .then(data => {

                                                                console.log("?? RESPONSE:", data);

                                                                if (!data.success || !data.results.length) return;

                                                                fillForm(data.results);

                                                            })
                                                            .catch(err => console.error("? FETCH ERROR:", err));

                                                        // ============================
                                                        // FILL FORM
                                                        // ============================
                                                        function fillForm(data) {

                                                            const root = data[0];

                                                            // cleanup buttons
                                                            form.querySelectorAll(".delete-subform, .save-subform, .file-subform")
                                                                .forEach(el => el.remove());

                                                            // ============================
                                                            // ROOT FIELDS
                                                            // ============================
                                                            table.columns
                                                                .filter(col => !col.group && !col.form_group && col.name !== "idx")
                                                                .forEach(col => {

                                                                    const el = form.querySelector(`[name="${col.name}"]`);

                                                                    if (!el) {
                                                                        console.warn("?? Root field missing:", col.name);
                                                                        return;
                                                                    }

                                                                    setValue(el, col, root[col.name]);
                                                                });

                                                            // ============================
                                                            // GROUPS + FORM_GROUPS
                                                            // ============================
                                                            const allGroups = [
                                                                ...(table.groups || []),
                                                                ...(table.form_groups || [])
                                                            ];

                                                            console.log("?? Groups:", allGroups);

                                                            allGroups.forEach(groupDef => {

                                                                const groupName = groupDef.name;

                                                                const wrapper = form.querySelector(`[data-group-wrapper="${groupName}"]`);
                                                                if (!wrapper) {
                                                                    console.warn("?? Wrapper missing:", groupName);
                                                                    return;
                                                                }

                                                                const container = wrapper.querySelector(".subform-container");
                                                                const template = container.querySelector(`[data-subform="${groupName}"]`);

                                                                container.innerHTML = "";

                                                                const rows = data.filter(row =>
                                                                    table.columns.some(c =>
                                                                        (c.group === groupName || c.form_group === groupName)
                                                                        && row[c.name] !== undefined
                                                                    )
                                                                );

                                                                console.log(`?? ${groupName} rows:`, rows);

                                                                rows.forEach((row, i) => {

                                                                    const clone = template.cloneNode(true);

                                                                    // rename fields
                                                                    clone.querySelectorAll("[name]").forEach(el => {

                                                                        let base = el.name.includes("]_")
                                                                            ? el.name.split("]_")[1]
                                                                            : el.name;

                                                                        const newName = `${groupName}[${i}]_${base}`;
                                                                        el.name = newName;
                                                                        el.id = newName;
                                                                    });

                                                                    // fill values
                                                                    table.columns
                                                                        .filter(c =>
                                                                            (c.group === groupName || c.form_group === groupName)
                                                                            && c.name !== "idx"
                                                                        )
                                                                        .forEach(col => {

                                                                            const el = clone.querySelector(
                                                                                `[name="${groupName}[${i}]_${col.name}"]`
                                                                            );

                                                                            if (!el) {
                                                                                console.warn("?? Missing group field:", col.name);
                                                                                return;
                                                                            }

                                                                            setValue(el, col, row[col.name]);
                                                                        });

                                                                    const idxVal = row.idx;

                                                                    // ============================
                                                                    // DELETE BUTTON
                                                                    // ============================
                                                                    const delBtn = document.createElement("button");
                                                                    delBtn.type = "button";
                                                                    delBtn.className = "btn btn-sm btn-danger mt-2 delete-subform";
                                                                    delBtn.innerHTML = `<i class="fas fa-trash"></i> Delete`;

                                                                    delBtn.onclick = () => {
                                                                        window.del_Idx = idxVal;

                                                                        const modal = document.getElementById('delete-item-modal'.replace('#database ', ''));
                                                                        modal.style.display = 'block';
                                                                        modal.classList.add('show');

                                                                        window.delCB = () => {
                                                                            clone.remove();
                                                                        };
                                                                    };

                                                                    clone.appendChild(delBtn);

                                                                    // ============================
                                                                    // FILE BUTTON
                                                                    // ============================
                                                                    if (table.gallery || table.image || table.video) {
                                                                        const fileBtn = document.createElement("button");
                                                                        fileBtn.type = "button";
                                                                        fileBtn.className = "btn btn-sm btn-warning file-subform";
                                                                        fileBtn.innerHTML = `<i class="fas fa-file"></i> Files`;

                                                                        fileBtn.onclick = () => {
                                                                            window.updateId = idxVal;
                                                                            manageFiles(idxVal);
                                                                        };

                                                                        clone.appendChild(fileBtn);
                                                                    }

                                                                    // ============================
                                                                    // SAVE BUTTON
                                                                    // ============================
                                                                    const saveBtn = document.createElement("button");
                                                                    saveBtn.type = "button";
                                                                    saveBtn.className = "btn btn-sm btn-success save-subform";
                                                                    saveBtn.innerHTML = `<i class="fas fa-save"></i> Save`;

                                                                    saveBtn.onclick = () => {

                                                                        const inputs = clone.querySelectorAll("input, select, textarea");
                                                                        let setClauses = [];

                                                                        inputs.forEach(input => {

                                                                            let field = input.name.includes("]_")
                                                                                ? input.name.split("]_")[1]
                                                                                : input.name;

                                                                            if (field === "idx") return;

                                                                            let value = input.value;

                                                                            const fk = window.mtable.constraints.find(c =>
                                                                                c.type === "foreignKey" && c.columns.includes(field)
                                                                            );

                                                                            if (fk) {
                                                                                const colDef = window.mtable.columns.find(c => c.name === field);
                                                                                const whereCol = colDef?.filter || fk.columns[0];

                                                                                value = `(SELECT ${fk.referencedColumns[0]} FROM ${fk.referencedTable} WHERE ${whereCol} = '${value}')`;
                                                                            } else {
                                                                                value = `'${value}'`;
                                                                            }

                                                                            setClauses.push(`${field} = ${value}`);
                                                                        });

                                                                        const updateQuery = `UPDATE ${tableName} SET ${setClauses.join(", ")} WHERE idx = ${idxVal}`;

                                                                        console.log("?? UPDATE QUERY:", updateQuery);

                                                                        fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(updateQuery)}`)
                                                                            .then(r => r.json())
                                                                            .then(res => {
                                                                                console.log("?? UPDATE RESPONSE:", res);
                                                                            });
                                                                    };

                                                                    clone.appendChild(saveBtn);

                                                                    container.appendChild(clone);
                                                                });

                                                                if (!container.children.length) {
                                                                    container.appendChild(template.cloneNode(true));
                                                                }
                                                            });
                                                        }
                                                    }

                                                    // ============================
                                                    // VALUE SETTER
                                                    // ============================
                                                    function setValue(el, column, value) {

                                                        if (column.atob) {
                                                            try { value = safeAtob(value || ""); } catch { }
                                                        }

                                                        if (column.form === "editor") {
                                                            const quill = Quill.find(el);
                                                            if (quill) {
                                                                quill.clipboard.dangerouslyPasteHTML(value || "");
                                                            }
                                                        }
                                                        else if (column.form === "doc") {
                                                            el.value = value;
                                                        }
                                                        else if (el.tagName === "SELECT") {
                                                            el.value = value;
                                                        }
                                                        else if (el.type === "datetime-local" && value) {
                                                            el.value = value.slice(0, 16);
                                                        }
                                                        else {
                                                            el.value = value;
                                                        }
                                                    }

                                                    // ============================
                                                    // SHOW MODAL
                                                    // ============================
                                                    const modal = document.getElementById('update-item-modal'.replace('#database ', ''));
                                                    modal.style.display = 'block';
                                                    modal.classList.add('show');

                                                    console.log("?? MODAL OPENED");
                                                }

                                                // Add event listener for update item button
                                                document.getElementById('update-item-btn').addEventListener('click', async (e) => {
                                                    e.preventDefault();

                                                    console.log("?? UPDATE CLICKED");

                                                    const saveBtn = document.querySelector('#update-item-btn');
                                                    let idx = window.updateIdx;

                                                    const form = document.getElementById('update-item-form');
                                                    let formData = new FormData(form);

                                                    // ============================
                                                    // ?? FIX EDITORS (INCLUDING GROUPS)
                                                    // ============================
                                                    table.columns
                                                        .filter(col => col.form === "editor")
                                                        .forEach(column => {

                                                            // find ALL editors (normal + grouped)
                                                            const editors = document.querySelectorAll(`#update-item-form [id$="_${column.name}"], #update-item-form #${column.name}`);

                                                            editors.forEach(el => {
                                                                const quill = Quill.find(el);
                                                                if (!quill) return;

                                                                const content = quill.root.innerHTML;
                                                                console.log("?? Editor:", el.id, content);

                                                                formData.set(el.id || column.name, content);
                                                            });
                                                        });

                                                    // ============================
                                                    // ?? ADD DEFAULTS
                                                    // ============================
                                                    table.columns
                                                        .filter(col => col.form === "none" && col.default)
                                                        .forEach(col => {
                                                            formData.set(col.name, col.default);
                                                        });

                                                    // ============================
                                                    // ?? NORMALIZE FORM DATA
                                                    // ============================
                                                    let normalized = {};

                                                    formData.forEach((value, key) => {

                                                        let field = key;

                                                        // convert basic[0]_company_name ? company_name
                                                        if (key.includes("]_")) {
                                                            field = key.split("]_")[1];
                                                        }

                                                        if (!normalized[field]) {
                                                            normalized[field] = value;
                                                        }

                                                        console.log(`?? NORMALIZED: ${key} ? ${field} =`, value);
                                                    });

                                                    // ============================
                                                    // ?? FK SETUP
                                                    // ============================
                                                    const fks = (table.constraints || [])
                                                        .filter(c => c.type === "foreignKey")
                                                        .map(fk => {
                                                            const colDef = table.columns.find(c => c.name === fk.columns[0]);

                                                            return {
                                                                col: fk.columns[0],
                                                                refcol: fk.referencedColumns[0],
                                                                tab: fk.referencedTable,
                                                                ft: colDef?.filter || fk.columns[0]
                                                            };
                                                        });

                                                    // ============================
                                                    // ?? BUILD WHERE
                                                    // ============================
                                                    let where = [];

                                                    if (typeof idx === "object") {

                                                        Object.keys(idx).forEach(key => {

                                                            const value = idx[key];

                                                            const fk = fks.find(f => f.col === key);

                                                            if (fk) {
                                                                where.push(`${key} IN (
                    SELECT ${fk.refcol} 
                    FROM ${fk.tab} 
                    WHERE ${fk.ft} = '${value}'
                )`);
                                                            } else {
                                                                where.push(`${key} = '${value}'`);
                                                            }
                                                        });

                                                    } else {
                                                        where.push(`${tableName}.idx = ${idx}`);
                                                    }

                                                    // ============================
                                                    // ?? BUILD UPDATE SET
                                                    // ============================
                                                    let setClauses = [];

                                                    Object.keys(normalized).forEach(key => {

                                                        let value = normalized[key];

                                                        if (value == null || value === "null") return;

                                                        const colDef = table.columns.find(c => c.name === key);
                                                        const fk = fks.find(f => f.col === key);

                                                        // encoding
                                                        if (colDef?.view && !(colDef?.btoa === false || colDef?.form === "doc")) {
                                                            value = safeBtoa(value);
                                                        }

                                                        if (fk) {
                                                            setClauses.push(`${key} = (
                SELECT ${fk.refcol} 
                FROM ${fk.tab} 
                WHERE ${fk.ft} = '${value}'
            )`);
                                                        } else {
                                                            setClauses.push(`${key} = '${value}'`);
                                                        }

                                                        console.log("?? SET:", key, value);
                                                    });

                                                    if (!setClauses.length) {
                                                        console.warn("?? Nothing to update");
                                                        return;
                                                    }

                                                    // ============================
                                                    // ?? FINAL QUERY
                                                    // ============================
                                                    const query = `
UPDATE ${tableName}
SET ${setClauses.join(", ")}
WHERE ${where.join(" AND ")}
`;

                                                    console.log("?? FINAL UPDATE QUERY:", query);

                                                    // ============================
                                                    // ?? EXECUTE
                                                    // ============================
                                                    try {

                                                        const res = await fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(query)}`);
                                                        const data = await res.json();

                                                        console.log("?? RESPONSE:", data);

                                                        if (data.success) {
                                                            fetchTableData();

                                                            document.getElementById('update-item-modal'.replace('#database ', '')).style.display = 'none';
                                                        } else {
                                                            throw new Error(data.message);
                                                        }

                                                    } catch (err) {

                                                        console.error("? UPDATE ERROR:", err);

                                                        const errorMessage = document.createElement('div');
                                                        errorMessage.classList.add('alert', 'alert-danger');
                                                        errorMessage.innerHTML = err.message;

                                                        saveBtn.parentNode.appendChild(errorMessage);
                                                        setTimeout(() => errorMessage.remove(), 3000);
                                                    }
                                                });


                                                // Function to delete a row
                                                function deleteRow(idx) {
                                                    // Set the idx property to the modal

                                                    window.del_Idx = idx;
                                                    //document.getElementById('delete-item-modal'.replace('#database ', '')).idx = idx;

                                                    // Show the modal
                                                    document.getElementById('delete-item-modal'.replace('#database ', '')).action = "Row";
                                                    document.getElementById('delete-item-modal'.replace('#database ', '')).style.display = 'block';
                                                    document.getElementById('delete-item-modal'.replace('#database ', '')).classList.add('show');
                                                    //
                                                }

                                                // Add event listener for delete item button
                                                document.querySelector('#delete-item-modal #delete-item-btn').addEventListener('click', (e) => {
                                                    e.preventDefault();

                                                    let button = document.querySelector('#delete-item-modal'.replace('#database ', ''));
                                                    let action = button.action;

                                                    console.log(action);

                                                    if (action == "Row") {
                                                        // Get the idx from the modal
                                                        let idx = window.del_Idx;
                                                        let query = `DELETE FROM ${tableName} WHERE`;

                                                        if (typeof idx == "object") {

                                                            let qr = [];

                                                            Object.keys(idx).forEach((key) => {
                                                                let value = idx[key];

                                                                // Check FK constraint
                                                                const fk = (window.mtable.constraints || []).find(c => c.type === "foreignKey" && c.columns.includes(key));

                                                                if (fk) {
                                                                    // get the column definition
                                                                    const colDef = (window.mtable.columns || []).find(c => c.name === key);

                                                                    // use filter if defined, otherwise fallback
                                                                    const whereCol = colDef && colDef.filter ? colDef.filter : fk.columns[0];

                                                                    qr.push(`${key} IN (SELECT ${fk.referencedColumns[0]} FROM ${fk.referencedTable} WHERE ${whereCol} = '${value}')`);
                                                                }
                                                                else {
                                                                    qr.push(`${key} = '${value}'`);
                                                                }

                                                            });

                                                            query += ` ${qr.join(" AND ")} `;
                                                        }
                                                        else {
                                                            query += ` idx = ${idx}`;
                                                        }

                                                        // Send the delete query to the server
                                                        fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(query)}`)
                                                            .then((response) => response.json())
                                                            .then((data) => {
                                                                console.log(data);
                                                                if (data.success) {
                                                                    // Update the table data
                                                                    if (window.delCB) {
                                                                        window.delCB();
                                                                    }
                                                                    else {
                                                                        fetchTableData();
                                                                    }
                                                                    // Hide the modal
                                                                    button.style.display = 'none';
                                                                } else {
                                                                    if (window.delER) {
                                                                        window.delER(data.message);
                                                                    }
                                                                    else {
                                                                        console.error(data.message);
                                                                    }
                                                                }
                                                            })
                                                            .catch((error) => {
                                                                console.error(error);
                                                                // Hide the modal
                                                                button.style.display = 'none';
                                                            });
                                                    }
                                                    if (action == "File") {

                                                        const idx = window.del_idx;
                                                        const tableName = window.del_table;
                                                        const tableIdx = window.del_table_idx;

                                                        console.error(idx, tableName, tableIdx, session);

                                                        fetch(`${ogn}delete-file?${session}&tableName=${encodeURIComponent(tableName)}` +
                                                            `&tableIdx=${encodeURIComponent(tableIdx)}&idx=${encodeURIComponent(idx)}`)
                                                            .then((response) => response.json())
                                                            .then((data) => {
                                                                console.log(data);
                                                                manageFiles(tableIdx);
                                                                // Hide the modal
                                                                button.style.display = 'none';
                                                            })
                                                            .catch((error) => {
                                                                console.error(error);
                                                                // Hide the modal
                                                                button.style.display = 'none';
                                                            });
                                                    }
                                                });

                                                // Add event listener for cancel button
                                                document.querySelector('#delete-item-modal #cancel-delete-item-btn').addEventListener('click', () => {
                                                    let button = document.querySelector('#delete-item-modal'.replace('#database ', ''));
                                                    // Hide the modal
                                                    button.style.display = 'none';
                                                });
                                            }
                                        })
                                        .catch((error) => {
                                            console.error(error);
                                        });
                                }

                                // Fetch table data
                                updatePaginationNumbers();
                                fetchTableData();
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }

                function createHtmlBanner(tableName) {
                    // Adjust the table name like the columns
                    let bannerText = tableName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

                    // Create the banner
                    let banner = `
	            <div class="banner">
	                <h1>${bannerText}</h1>
	            </div>
	        `;

                    return banner;
                }

                function createHtmlTable(columns, reports = []) {
                    // Create the table header
                    let tableHeader = '<tr>';
                    tableHeader += `<th style="white-space: nowrap;" > <input type="checkbox" /> </th>`;

                    columns.forEach((column) => {
                        // Modify the column text to make it more readable
                        let columnHeader = column.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                        tableHeader += `<th style="white-space: nowrap;" >${columnHeader}</th>`;
                    });

                    tableHeader += `<th  style="white-space: nowrap; min-width:170px; max-width:170px;">Actions</th>`; // Add the "Actions" column

                    console.log(reports);

                    if (reports.length > 0) {

                        tableHeader += `<th style="min-width:170px; " colspan="${reports.length}"> Reports</th>`; // Add the "Reports" column
                    }

                    tableHeader += '</tr>';

                    // Create the table
                    let table = `
		        <table class="table table-striped" id="product-table">
		            <thead>${tableHeader}</thead>
		            <tbody id="table-body"></tbody>
		        </table>
		    `;

                    return table;
                }


                function generateFormSearch(columns) {
                    columns.forEach((column) => {

                        [`[id$="_${column.name}"]`, '#' + column.name].forEach((name_id) => {


                            if (column.form == "range") {
                                let query = `SELECT MAX(${column.name}) AS ${column.name}
	                                    FROM ${tableName}`;

                                console.log(query);
                                // Send the form data to the server using fetch API
                                fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(query)}`)
                                    .then((response) => {
                                        return response.json();
                                    })
                                    .then((data) => {
                                        console.log(data);
                                        if (data.success) {

                                            var max = data.results;
                                            if (max.length > 0) {
                                                max = max[0][column.name] + 2;
                                                console.log(max);
                                                document.querySelectorAll(`${name_id.indexOf("id$") == -1 ? name_id + '-min' : name_id.replace('"]', '-min"]')}`).forEach((mx) => {
                                                    mx.setAttribute("max", max);

                                                    mx.dispatchEvent(new Event("input"));
                                                });

                                                document.querySelectorAll(`${name_id.indexOf("id$") == -1 ? name_id + '-max' : name_id.replace('"]', '-max"]')}`).forEach((mx) => {
                                                    mx.setAttribute("max", max);
                                                    mx.setAttribute("value", max);

                                                    mx.dispatchEvent(new Event("input"));
                                                });
                                            }
                                        }
                                    }).catch((err) => {
                                        console.error(err);
                                    });
                            }
                            else if (column.form == "editor") {
                                setTimeout(function () {
                                    console.log(document.querySelectorAll(`.${name_id.indexOf("id$") == -1 ? name_id + '_editor' : name_id.replace('"]', '_editor"]')}`).length);

                                    var quill = new Quill(`.${column.name}_1`, {
                                        theme: 'snow'
                                    });

                                    var quill = new Quill(`.${column.name}_2`, {
                                        theme: 'snow'
                                    });

                                }, 1000);
                            }
                            else if (column.form == "select") {
                                var query = null;
                                var col = null;
                                var tab = null;
                                var refcol = null;

                                if (column.filter) {

                                    console.log(window.mtable);
                                    var constraint = window.mtable.constraints.filter(item => item.type == "foreignKey" &&
                                        item.columns.includes(column.name));
                                    if (constraint.length > 0) {
                                        constraint = constraint[0];
                                        console.log(constraint);

                                        query = `SELECT DISTINCT(${column.filter})
				    FROM ${constraint.referencedTable}`;
                                        col = column.filter;
                                        tab = constraint.referencedTable;
                                        refcol = constraint.referencedColumns[0];
                                        console.log(query, col, refcol, tab);
                                    }
                                }
                                else if (column.check) {

                                    console.log(window.mtable);
                                    var constraint = window.mtable.constraints.filter(item => item.type == "check" &&
                                        item.columns.includes(column.name));
                                    if (constraint.length > 0) {
                                        constraint = constraint[0];
                                        console.log(constraint);
                                        console.log(document.querySelectorAll(`${name_id}`).length);

                                        document.querySelectorAll(`${name_id}`).forEach((select) => {
                                            select.innerHTML = '';

                                            constraint.options.forEach((option, index) => {
                                                var opt = document.createElement("option");
                                                opt.value = option;
                                                opt.innerHTML = option;

                                                if (index == 0) {
                                                    var optd = document.createElement("option");
                                                    optd.value = "";
                                                    optd.innerHTML = `Select ${column.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}`;
                                                    select.appendChild(optd);
                                                }
                                                select.appendChild(opt);
                                            });
                                        });
                                    }
                                }
                                else {
                                    query = `SELECT DISTINCT(${column.name})
	                                   FROM ${tableName}`;
                                    col = column.name;
                                    console.log(query, col, tab);
                                }

                                if (query && col) {
                                    // Send the form data to the server using fetch API
                                    fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(query)}`)
                                        .then((response) => {
                                            return response.json();
                                        })
                                        .then((data) => {
                                            console.log(data);
                                            if (data.success) {
                                                var options = data.results.map(item => item[col]);
                                                console.log(options);

                                                document.querySelectorAll(`${name_id}`).forEach((select) => {

                                                    select.innerHTML = '';

                                                    select.setAttribute("col", col);
                                                    select.setAttribute("tab", tab);
                                                    select.setAttribute("refcol", refcol);

                                                    options.forEach((option, index) => {
                                                        var opt = document.createElement("option");
                                                        opt.value = option;
                                                        opt.innerHTML = option;

                                                        if (index == 0) {
                                                            var optd = document.createElement("option");
                                                            optd.value = "";
                                                            optd.innerHTML = `Select ${col.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}`;
                                                            select.appendChild(optd);
                                                        }
                                                        select.appendChild(opt);

                                                    });
                                                });
                                            }

                                        }).catch((err) => {
                                            console.error(err);
                                        });
                                }

                            }
                            else if (column.form == "datalist") {
                                let query = null;
                                let col = null;
                                let tab = null;
                                let refcol = null;

                                if (column.filter) {
                                    // foreign key filter
                                    let constraint = window.mtable.constraints.filter(item => item.type == "foreignKey" &&
                                        item.columns.includes(column.name));
                                    if (constraint.length > 0) {
                                        constraint = constraint[0];
                                        query = `SELECT DISTINCT(${column.filter}) FROM ${constraint.referencedTable}`;
                                        col = column.filter;
                                        tab = constraint.referencedTable;
                                        refcol = constraint.referencedColumns[0];
                                    }
                                } else if (column.check) {
                                    // check constraints
                                    let constraint = window.mtable.constraints.filter(item => item.type == "check" &&
                                        item.columns.includes(column.name));
                                    if (constraint.length > 0) {
                                        constraint = constraint[0];
                                        document.querySelectorAll(`${name_id}`).forEach((input) => {
                                            const datalist = document.querySelector(`#${name_id.indexOf("id$") == -1 ? name_id + '-options' : name_id.replace('"]', '-options"]')}`);
                                            datalist.innerHTML = '';
                                            constraint.options.forEach(opt => {
                                                const optionEl = document.createElement('option');
                                                optionEl.value = opt;
                                                datalist.appendChild(optionEl);
                                            });
                                        });
                                    }
                                } else {
                                    query = `SELECT DISTINCT(${column.name}) FROM ${tableName}`;
                                    col = column.name;
                                }

                                if (query && col) {
                                    fetch(`${ogn}database/query/exec?${session}&query=${safeBtoa(query)}`)
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.success) {
                                                const options = data.results.map(item => item[col]);
                                                document.querySelectorAll(`${name_id}`).forEach((input) => {
                                                    console.log(name_id.indexOf("id$") == -1 ? name_id + '-options' : name_id.replace('"]', '-options"]'))
                                                    const datalist = document.querySelector(`${name_id.indexOf("id$") == -1 ? name_id + '-options' : name_id.replace('"]', '-options"]')}`);
                                                    datalist.innerHTML = '';
                                                    input.setAttribute('col', col);
                                                    input.setAttribute('tab', tab);
                                                    input.setAttribute('refcol', refcol);

                                                    options.forEach(option => {
                                                        const optionEl = document.createElement('option');
                                                        optionEl.value = option;
                                                        datalist.appendChild(optionEl);
                                                    });
                                                });
                                            }
                                        }).catch(err => console.error(err));
                                }
                            }
                        })


                    });
                }

                function createHtmlFilters(columns) {
                    let filtersHtml = `
	            <form>
	                <div class="form-row">
	        `;

                    console.log(columns);

                    columns.forEach((column) => {
                        let filterName = column.name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
                        if (column.form == "none" || column.form == "editor" || column.view) {

                        }
                        else if (column.form == "select") {

                            filtersHtml += `
	                <div class="form-group col-md-3">
	                    <label for="${column.name}">${filterName}</label>
	                    <select class="form-control" id="${column.name}" name="${column.name}" placeholder="${filterName}">
		            </select>
	                </div>
	                `;
                        }
                        else if (column.form == "datalist") {
                            filtersHtml += `
    <div class="form-group col-md-3">
        <label for="${column.name}">${filterName}</label>
        <input class="form-control" list="${column.name}-options" id="${column.name}" name="${column.name}" placeholder="${filterName}">
        <datalist id="${column.name}-options">
            <!-- Options will be populated dynamically -->
        </datalist>
    </div>
    `;
                        }

                        else if (column.form == "barcode") {
                            filtersHtml += `
			    <div class="form-group col-md-3">
			        <label for="${column.name}">${filterName}</label>
                    <div style="display:flex;">
			             <input class="form-control" style="width:calc(100% - 50px)" id="${column.name}" name="${column.name}" placeholder="${filterName}" type="text" list="${column.name}-options">
                         <span class="btn btn-secondary barcode" onclick="barCodeClick(this)" id="scan-${column.name}">
	                               <i class="fas fa-barcode"></i>
			            </span>
                     </div>
                    <datalist id="${column.name}-options">
			        </datalist>
			        <div id="scanner-container-${column.name}"></div>
			    </div>
			    `;
                        }
                        else if (column.form == "range") {
                            filtersHtml += `
        <div class="form-group col-md-4">
          <label for="${column.name}">${filterName}</label>
          <div class="range" id="range-${column.name}" data-column-name="${column.name}" data-min="${column.min}" data-max="${column.max}">
            <div class="slider-container" id="slider-${column.name}">
              <div class="slider-track" id="track-${column.name}"></div>
              <div class="slider-thumb" id="thumbMin-${column.name}"></div>
              <div class="slider-thumb" id="thumbMax-${column.name}"></div>
            </div>
            <span id="${column.name}-value" class="range-value">${column.min} - ${column.max}</span>
          </div>
        </div>
    `;

                            // Generic function to initialize a dual slider
                            function initDualSlider(rangeEl) {
                                const columnName = rangeEl.dataset.columnName;
                                const minValue = parseFloat(rangeEl.dataset.min);
                                const maxValue = parseFloat(rangeEl.dataset.max);

                                const slider = document.getElementById('slider-' + columnName);
                                if (!slider) return;

                                const thumbMin = document.getElementById('thumbMin-' + columnName);
                                const thumbMax = document.getElementById('thumbMax-' + columnName);
                                const track = document.getElementById('track-' + columnName);
                                const valueDisplay = document.getElementById(columnName + '-value');

                                let dragging = null;

                                function updateTrack() {
                                    const left = thumbMin.offsetLeft + thumbMin.offsetWidth / 2;
                                    const right = thumbMax.offsetLeft + thumbMax.offsetWidth / 2;
                                    track.style.left = left + 'px';
                                    track.style.width = (right - left) + 'px';
                                }

                                function updateValues() {
                                    const sliderWidth = slider.offsetWidth - thumbMin.offsetWidth;
                                    const percentMin = thumbMin.offsetLeft / sliderWidth;
                                    const percentMax = thumbMax.offsetLeft / sliderWidth;

                                    const currentMin = Math.round(minValue + percentMin * (maxValue - minValue));
                                    const currentMax = Math.round(minValue + percentMax * (maxValue - minValue));

                                    valueDisplay.textContent = currentMin + ' - ' + currentMax;
                                }

                                function onMouseMove(e) {
                                    if (!dragging) return;
                                    const sliderRect = slider.getBoundingClientRect();
                                    const sliderWidth = slider.offsetWidth - thumbMin.offsetWidth;
                                    let x = e.clientX - sliderRect.left;
                                    x = Math.max(0, Math.min(x, sliderWidth));

                                    if (dragging === thumbMin) {
                                        if (x + thumbMin.offsetWidth > thumbMax.offsetLeft) {
                                            thumbMax.style.left = Math.min(x + thumbMin.offsetWidth, sliderWidth) + 'px';
                                        }
                                        thumbMin.style.left = x + 'px';
                                    } else if (dragging === thumbMax) {
                                        if (x < thumbMin.offsetLeft + thumbMin.offsetWidth) {
                                            thumbMin.style.left = Math.max(x - thumbMin.offsetWidth, 0) + 'px';
                                        }
                                        thumbMax.style.left = x + 'px';
                                    }

                                    updateTrack();
                                    updateValues();
                                }

                                function onMouseUp() {
                                    dragging = null;
                                }

                                thumbMin.addEventListener('mousedown', () => dragging = thumbMin);
                                thumbMax.addEventListener('mousedown', () => dragging = thumbMax);
                                document.addEventListener('mousemove', onMouseMove);
                                document.addEventListener('mouseup', onMouseUp);

                                // Initialize thumbs at 0% and 100%
                                const sliderWidth = slider.offsetWidth - thumbMin.offsetWidth;
                                thumbMin.style.left = '0px';
                                thumbMax.style.left = sliderWidth + 'px';

                                updateTrack();
                                updateValues();
                            }

                            // MutationObserver on document.body
                            const observer = new MutationObserver((mutations) => {
                                mutations.forEach(mutation => {
                                    mutation.addedNodes.forEach(node => {
                                        if (node.nodeType === 1) {
                                            // Check if node is a range slider or contains one
                                            if (node.id && node.id.startsWith('range-')) {
                                                initDualSlider(node);
                                            } else {
                                                const rangeChild = node.querySelector('[id^="range-"]');
                                                if (rangeChild) initDualSlider(rangeChild);
                                            }
                                        }
                                    });
                                });
                            });

                            observer.observe(document.body, { childList: true, subtree: true });

                            // Initialize any sliders already in DOM
                            document.querySelectorAll('[id^="range-"]').forEach(initDualSlider);

                        }

                        else if (["number", "datetime-local", "date", "time", "month", "week", "email", "url", "tel", "color"].includes(column.form)) {
                            let inputAttributes = '';

                            if (column.form === 'number') {
                                inputAttributes += `min="${column.min}" max="${column.max} style="width:100%""`;
                            }

                            if (column.form === 'date' || column.form === 'datetime-local') {
                                inputAttributes += `min="${column.minDate}" max="${column.maxDate}"`;
                            }

                            filtersHtml += `
			    <div class="form-group col-md-4">
			      <label for="${column.name}">${filterName}</label>
			      <input type="${column.form}" class="form-control" id="${column.name}" name="${column.name}" placeholder="${filterName}" ${inputAttributes}>
			    </div>
			  `;
                        }
                        else if (column.form == "search") {
                            const key = column.name;
                            const fk = (window.mtable.constraints || []).find(c => c.type === "foreignKey" && c.columns.includes(key));

                            if (fk) {
                                const colDef = (window.mtable.columns || []).find(c => c.name === key);
                                const whereCol = colDef && colDef.filter ? colDef.filter : fk.columns[0];

                                console.log(fk, whereCol);

                                filtersHtml = `
<div class="form-group col-md-4">
    <label for="${name}">${filterName}</label>
    <input type="text" class="form-control" id="${column.name}" name="${column.name}" placeholder="${filterName}" style="width:calc(100% - 50px); margin-bottom:-35px" />
   <button type="button" style="padding: 6px 12px; cursor:pointer; margin-left:calc(100% - 40px); " data-toggle="modal"  data-backdrop="false" data-target="#search-item-modal" onclick="window.searchItem(event , this , '${fk.referencedTable}' , '${fk.referencedColumns[0]}' , '${whereCol}')" >
                            <i class="fas fa-search" style="color:#BFC1C5"></i>
                        </button>
</div>`;
                            } else {

                            }

                        }
                        else {
                            filtersHtml += `
	                <div class="form-group col-md-3">
	                    <label for="${column.name}">${filterName}</label>
	                    <input type="text" class="form-control" id="${column.name}" name="${column.name}" placeholder="${filterName}">
	                </div>
	               `;
                        }
                    });

                    filtersHtml += `
	                </div>
<div class="form-group col-md-12">
    <div class="form-row">
        <div>
	        <button type="button" class="btn btn-sm btn-info" style="background:#138496" id="apply-filter" onclick="window.applyFilter()"> <i class="fas fa-search"></i> Refresh </button>
	    </div>
        `;
                    if (window.mtable.apps.length == 0) {
                        filtersHtml += `
        <div style="flex:1"></div>`;
                    }

                    filtersHtml += `
         <div>
		     <button type="button" class="btn btn-secondary" id="reset-filter" onclick="window.resetFilter()"> <i class="fas fa-times"></i> Reset </button>
	     </div>
         <div style="flex:1"></div>
         <div>
               <button type="button" class="btn btn-secondary" id="remove-selected" onclick="window.removeSelected()"> <i class="fas fa-trash"></i> Delete </button>
	     </div>`;

                    if (window.mtable.apps.length > 0) {
                        filtersHtml += `
<div class="form-group  col-md-4" title="Generate Reports"> 
    <select type="text" placeholder="Select Report" style="width:calc(100% - 50px); margin-top:5px" >
        <option> Select Report </option>
`;
                        window.mtable.apps.forEach((app) => {
                            filtersHtml += `
        <option value="${app.type}"> ${app.name} </option>
`;
                        });
                        filtersHtml += `
    </select>
   <button class="btn btn-sm btn-info" style="padding: 6px 12px; cursor:pointer; margin-left:calc(100% - 40px); transform:translateY(-35px); " onclick="window.generateReport(this)" >
                            <i class="fas fa-book"></i>
                        </button>
</div>`;
                    }

                    filtersHtml += `
    </div>
</div>
		        
	           </form>
	        `;

                    return filtersHtml;
                }
            })
            .catch((error) => {
                console.error(error.message);
            });
    }

}

// Report/Apps
window.openReport = function (_report , _row , isrow = false) {
    let report = JSON.parse(safeAtob(_report));
    let row = isrow ? _row : JSON.parse(safeAtob(_row));
    let value = report.type;

    console.log(report);
    console.log(row);

    if (!document.getElementById("app-modal")) {
        document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade" id="app-modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen" role="document" style="width: 100%; max-width: 100%; height: 100%; margin: 0;">
        <div class="modal-content" style="height:100vh" > 
          <div style="display:flex; background:#292E32; padding:10px;height:40px; font-size:14px; ">
             <div style="flex:1;">
                  Report <i class="fas fa-chevron-right" style="display:inline-block; margin-left:7px"></i>
             </div>

            <div id="app-print" style="cursor:pointer; display:inline-block; margin-right: 10px;">
                <i class="fas fa-print" style="color:#3577F1; font-size:16px;"></i>
            </div> 
             <div id="app-close" style="">
                 <i class="fas fa-times" style="color:#3577F1; cursor:pointer;"></i>
             </div>
          </div>
          <div class="modal-body" style="height:calc(100% - 30px);overflow:auto; background:#F3F4F6">
            <div id="app-container" style="height:100%;"></div>
          </div>
        </div>
      </div>
    </div>
  `);

        let print = document.querySelector("#app-modal #app-print");

        print.onclick = () => {
            let iframe = document.querySelector("#app-modal iframe");
            if (iframe && iframe.contentWindow) {
                // Trigger print inside the iframe
                iframe.contentWindow.focus();  // focus is important
                iframe.contentWindow.print();
            } else {
                console.warn("No iframe found or iframe not ready.");
            }
        };
         
        let close = document.querySelector("#app-modal #app-close");
        close.onclick = () => {
            let modal = document.querySelector(`#app-modal`);
            modal.style.display = "none";
            modal.classList.remove('show');
        };
    }

    if (value) {
        if (!value.endsWith('/')) {
            value += '/';
        }
        if (value.startsWith('/')) {
            value = value.slice(1);
        }

        console.error(value); 

        fetch(`${ogn == '/' ? '' : 'pages/'}` + value + "index.html").then((res) => {

            console.error(res);

            if (res.status == 200) {
                nex(`${ogn == '/' ? '' : 'pages/'}` + value + "index.html");
            }
            else {
                nex(`${ogn == '/404_page.html' ? '' : 'pages/404.html'}?page=${encodeURIComponent(value + "index.html")}`)
            }
        })
            .catch((er) => {
                console.error(er);

                nex(`${ogn == '/404_page.html' ? '' : 'pages/404.html'}?page=${encodeURIComponent(value + "index.html")}`)
            });

        function nex(url) {
            let search = "";
            console.error(url);
            const iframe = document.createElement('iframe');
            iframe.style = `width:100%; height:100%; overflow-y:scroll; border:none; outline:none;`;
            iframe.setAttribute('src', `${url}?search=${search}`);
            iframe.setAttribute(
                'sandbox',
                'allow-cross-origin allow-scripts allow-forms allow-popups allow-presentation'
            );

            let modal = document.querySelector(`#app-modal`);
            let body = document.querySelector(`#app-modal #app-container`);
            body.innerHTML = "";
            body.appendChild(iframe);

            modal.style.display = 'block';
            modal.classList.add('show');
        }
    }

}
window.generateReport = function (button) {
    const target = button.previousElementSibling;
    let value = target.value;

    if (!document.getElementById("report-modal")) {
        document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade" id="report-modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen" role="document" style="width: 100%; max-width: 100%; height: 100%; margin: 0;">
        <div class="modal-content" style="height:100vh" > 
          <div style="display:flex; background:#292E32; padding:10px;height:40px; font-size:14px; ">
             <div style="flex:1;">
                  App <i class="fas fa-chevron-right" style="display:inline-block; margin-left:7px"></i>
             </div> 
            <div id="report-print" style="cursor:pointer; display:inline-block; margin-right: 10px;">
                <i class="fas fa-print" style="color:#3577F1; font-size:16px;"></i>
            </div> 
             <div id="report-close" style="">
                 <i class="fas fa-times" style="color:#3577F1; cursor:pointer;"></i>
             </div>
          </div>
          <div class="modal-body" style="height:calc(100% - 30px);overflow:auto; background:#F3F4F6">
            <div id="report-container" style="height:100%;"></div>
          </div>
        </div>
      </div>
    </div>
  `);

        let print = document.querySelector("#report-modal #report-print");

        print.onclick = () => {
            let iframe = document.querySelector("#report-modal iframe");
            if (iframe && iframe.contentWindow) {
                // Trigger print inside the iframe
                iframe.contentWindow.focus();  // focus is important
                iframe.contentWindow.print();
            } else {
                console.warn("No iframe found or iframe not ready.");
            }
        };

        let close = document.querySelector("#report-modal #report-close");
        close.onclick = () =>
        {
            let modal = document.querySelector(`#report-modal`);
            modal.style.display = "none";
            modal.classList.remove('show');
        };
    }
     
    if (value.trim() != "Select Report") {


        console.error(ogn); // http://localhost:3000

        if (!value.endsWith('/')) {
            value += '/';
        }
        if (value.startsWith('/')) {
            value = value.slice(1);
        }

        fetch(`${ogn == '/' ? '/' : 'pages/'}` + value + "index.html").then((res) => {

            console.error(res);

            if (res.status == 200) {
                nex(`${ogn == '/' ? '/' : 'pages/'}` + value + "index.html");
            }
            else {
                nex(`${ogn == '/404_page.html' ? '' : 'pages/404.html'}?page=${encodeURIComponent(value + "index.html")}`)
            }
        })
            .catch((er) => {
                console.error(er);

                nex(`${ogn == '/404_page.html' ? '' : 'pages/404.html'}?page=${encodeURIComponent(value + "index.html")}`)
            });

        function nex(url) {
            let search = "";
            console.error(url);
            const iframe = document.createElement('iframe');
            iframe.style = `width:100%; height:100%; overflow-y:scroll; border:none; outline:none;`;
            iframe.setAttribute('src', `${url}?search=${search}`);

            let modal = document.querySelector(`#report-modal`);
            let body = document.querySelector(`#report-modal #report-container`);
            body.innerHTML = "";
            body.appendChild(iframe);

            modal.style.display = 'block';
            modal.classList.add('show');
        }
    }

}
// Editors
//: barcode
// Make the barcode click handler globally accessible
window.barCodeClick = function (btn) {
    const name = btn.id.replace("scan-", "");
    const container = document.getElementById(`scanner-container-${name}`);
    const input = btn.previousElementSibling; // input before scan button

    console.error(input);

    // Toggle scanner visibility
    if (container.style.display === "block") {
        window.stopBarcodeScanner(name);
    } else {
        window.barCodeScan(name, input, container);
    }
};

// Global barcode scanner starter
window.barCodeScan = function (name, input, container) {
    // Prepare container UI
    container.style.display = "block";
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.height = "200px";
    container.style.border = "1px solid #ccc";
    container.innerHTML = `
        <video id="scanner-video-${name}" 
               style="width:100%;height:100%;object-fit:cover;border-radius:6px;"></video>
        <button id="close-scanner-${name}" 
                style="position:absolute;top:5px;right:5px;z-index:10;padding:4px 8px;border:none;
                       background:#f00;color:#fff;border-radius:4px;cursor:pointer;">
            X
        </button>
    `;

    // Close scanner manually
    document
        .getElementById(`close-scanner-${name}`)
        .addEventListener("click", () => window.stopBarcodeScanner(name));

    // Initialize QuaggaJS
    Quagga.init(
        {
            inputStream: {
                type: "LiveStream",
                target: container,
                constraints: {
                    facingMode: "environment",
                },
            },
            decoder: {
                readers: ["ean_reader", "code_128_reader", "upc_reader", "code_39_reader"],
            },
        },
        function (err) {
            if (err) {
                console.error("Quagga init error:", err);
                container.innerHTML = `<p style="color:red;">Camera not accessible</p>`;
                return;
            }

            Quagga.start();
            console.log("Barcode scanner started");

            Quagga.onDetected((result) => {
                const code = result.codeResult.code;
                console.log("Detected barcode:", code);

                // ? Add scanned value to input before #scan-
                if (input) input.value = code;

                // Stop scanner automatically after successful detection
                window.stopBarcodeScanner(name);
            });
        }
    );
};

// Global stop function
window.stopBarcodeScanner = function (name) {
    try {
        Quagga.stop();
        const container = document.getElementById(`scanner-container-${name}`);
        if (container) {
            container.style.display = "none";
            container.innerHTML = "";
        }
        console.log("Barcode scanner stopped");
    } catch (e) {
        console.warn("No active scanner to stop:", e);
    }
};

//: docx
window.openEditor = function (button , editor) {

    const target = button.previousElementSibling;
    const value = target.value;
    let iframe;

    if (!document.getElementById("editor-modal")) {
        document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade" id="editor-modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen" role="document" style="width: 100%; max-width: 100%; height: 100%; margin: 0;">
        <div class="modal-content" style="height:100vh"> 
          <!-- Modal Header -->
          <div style="display:flex; background:#292E32; padding:10px; height:40px; font-size:14px;">
             <div style="flex:1;">
                  Editor <i class="fas fa-chevron-right" style="display:inline-block; margin-left:7px"></i>
                  <span id="editor-name"></span>
             </div>
             <div id="editor-save">
                 <i class="fas fa-save" style="color:#FFC107; cursor:pointer;"></i>
             </div>
             <div id="editor-close" style="margin-left:16px;">
                 <i class="fas fa-times" style="color:#3577F1; cursor:pointer;"></i>
             </div>
          </div>

          <!-- Modal Body -->
          <div class="modal-body" style="height:calc(100% - 40px); overflow:auto; background:#F3F4F6">
            <div id="editor-container" style="height:100%;"></div>
          </div>
        </div>
      </div>
    </div>
    `);
         
        let save = document.querySelector("#editor-modal #editor-save");
        save.onclick = () => {
            if (iframe) {
                let val = iframe.contentWindow.getPage(value);
                console.log(val);
                target.value = val;
            }
            let modal = document.querySelector(`#editor-modal`);
            modal.style.display = "none";
            modal.classList.remove('show');
        };

        let close = document.querySelector("#editor-modal #editor-close");
        close.onclick = () => {
            let modal = document.querySelector(`#editor-modal`);
            modal.style.display = "none";
            modal.classList.remove('show');
        };
    }

    console.error(ogn);

    if (editor == "docx") { nex1(`${ogn == '/' ? '/' : 'pages/'}editors/ckeditor/index.html?production=true`); }
    else if (editor == "docx") { nex1(`${ogn == '/' ? '/' : 'pages/'}editors/docx/index.html?production=true`); }

    function nex1(url) {
        fetch(url).then((res) => {

            console.log(res.status);

            if (res.status == 200) {
                nex(url);
            }
            else {
                nex(`404_page.html`)
            }
        })
            .catch((er) => {
                console.error(er);

            });
    }

    function nex(url) { 
        console.log(url);

        let modal = document.querySelector(`#editor-modal`);
        let title = document.querySelector(`#editor-modal #editor-name`);
        let body = document.querySelector(`#editor-modal #editor-container`);

        //: exist
        let ifm = document.querySelector(`#editor-modal iframe`);
        if (ifm) {
            let src = ifm.getAttribute("src");

            if (src == url) {
                iframe = ifm;

                modal.style.display = "block";
                modal.classList.remove('show');
                modal.classList.add('show');

                iframe.contentWindow.reloadPage(value);

                return;
            }
        }
        //: new 
        iframe = document.createElement('iframe');
        iframe.style = `width:100%; height:100%; overflow-y:scroll; border:none; outline:none;`;
        iframe.setAttribute('src', url);

        console.log(title, body);

        title.innerHTML = editor; 
        body.innerHTML = "";
        body.appendChild(iframe);

        modal.style.display = 'block';
        modal.classList.add('show');
        
        iframe.onload = () => {
            iframe.contentWindow.reloadPage(value);
        };
        //: 
    }  
};

// Modals  
window.addEventListener('click', (e) => {
    const modal = document.querySelector('.modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});