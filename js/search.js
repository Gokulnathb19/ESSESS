const onlyUnique = (value, index, self) => { 
    return self.indexOf(value) === index;
};

const openResults = () => {
    document.getElementById('searchResults').style.display = "block";
}

const closeResults = () => {
    document.getElementById('searchResults').style.display = "none";
    document.getElementById('searchData').innerHTML = "";
}

window.addEventListener('click', function(event) {
    if (event.target === document.getElementById("searchResults")) {
        closeResults();
    }
});

const getSearchLists = (e) => {
    e.preventDefault();
    const eventName = e.explicitOriginalTarget.name;
    document.getElementById('noDataFound').style.display = "none";
    let searchData = {};
    const fileNo = document.getElementById('sFileNo').value,
    name = document.getElementById('sName').value.value,
    mobileNo = document.getElementById('sMobileNo').value,
    district = document.getElementById('sDistrict').value,
    state = document.getElementById('sState').value;
    if(fileNo !== undefined && fileNo !== "")
        searchData.fileNo = fileNo;
    if(name!== undefined && name !== "")
        searchData.name = name;
    if(mobileNo !== undefined && mobileNo !== "")
        searchData.mobileNo = mobileNo;
    if(district !== undefined && district !== "")
        searchData.district = district;
    if(state !== undefined && state !== "")
        searchData.state = state;

    if(eventName !== 'allFiles') {
        if(Object.keys(searchData).length === 0) {
            document.getElementById('noDataFound').style.display = "block";
            return false;
        }
        else {
            document.getElementById('searchBtn').value = "Loading...";
        }
    }
    else {
        searchData = {};
        document.getElementById('allFiles').value = "Loading...";
    }

    const searchRequest = $.ajax({
        url: "./php/getSearchResults.php",         
        type: "post",
        data: searchData
    });

    searchRequest.done(function (response, textStatus, jqXHR){
        let data = JSON.parse(response);
        if(data.length === 0)
            document.getElementById('noDataFound').style.display = "block";
        else {
            let resultsHTML = `<div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Download</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                                <th>File No</th>
                                                <th>Name</th>
                                                <th>Parent Name</th>
                                                <th>Email</th>
                                                <th>Mobile No1</th>
                                                <th>Mobile No2</th>
                                                <th>Address</th>
                                                <th>District</th>
                                                <th>State</th>
                                                <th>Pincode</th>
                                                <th>Date of Inspection (DD/MM/YYYY)</th>
                                                <th>Valuation Type</th>
                                                <th>Purpose of Valuation</th>
                                                <th>Market Value</th>
                                                <th>Total Extent</th>
                                                <th>Latitude</th>
                                                <th>Longitude</th>
                                                <th>Files</th>
                                                <th>Images</th>
                                            </tr>
                                        </thead>
                                        <tbody>`;
            for(let i=0; i<data.length; i++) {
                resultsHTML += `<tr>
                                    <td><a href="./users/${data[i].fileno}/summary.pdf" target="_blank"><button class="button" style="background-color:dodgerblue; color:white;"><i class="fas fa-download"></i></button></a></td>
                                    <td><button class="button" onclick="editFile(${data[i].fileNo})" style="background-color:green; color:white;"><i class="fas fa-edit"></i></button></td>
                                    <td><button class="button" onclick="deleteFile(${data[i].fileno})" style="background-color:red; color:white;"><i class="fas fa-trash-alt"></i></button></td>
                                    <td>${data[i].fileno}</td>
                                    <td>${data[i].title}.${data[i].name}</td>
                                    <td>${data[i].parentTitle}.${data[i].parentName}</td>
                                    <td>${data[i].email}</td>
                                    <td>${data[i].mobile}</td>
                                    <td>${data[i].mobile2}</td>
                                    <td>${data[i].address}</td>
                                    <td>${data[i].district}</td>
                                    <td>${data[i].state}</td>
                                    <td>${data[i].pincode}</td>
                                    <td>${data[i].day}/${data[i].month}/${data[i].year}</td>
                                    <td>${data[i].valuationType}</td>
                                    <td>${data[i].purposeOfValuation}</td>
                                    <td>Rs. ${data[i].marketValue}</td>
                                    <td>${data[i].totalExtent}</td>
                                    <td>${data[i].latitude}</td>
                                    <td>${data[i].longitude}</td>
                                    <td><a href="./users/${data[i].fileno}/files/">Files</a></td>
                                    <td><a href="./users/${data[i].fileno}/images/">Images</a></td>
                                </tr>`;
            }
            resultsHTML += `</tbody></table></div>`;
            document.getElementById('searchData').innerHTML = resultsHTML;
            openResults();
        }
        if(eventName === 'allFiles')
            document.getElementById('allFiles').value = "Get All Files";
        else
            document.getElementById('searchBtn').value = "Search";
    });

    searchRequest.fail(function (jqXHR, textStatus, errorThrown) {
        // Log the error to the console
        console.error(
            "The following error occurred while retriving search results: "+
            textStatus, errorThrown
        );
    });
};

const editFile = (fileNo) => {
try {
    const searchRequest = $.ajax({
        url: "./php/getSearchResults.php",  
        async: false,       
        type: "post",
        data: {fileNo: fileNo}
    });

    searchRequest.done(function (response, textStatus, jqXHR){
        let file = JSON.parse(response)[0];
        closeResults();
        const userTitle = document.getElementById("userTitle"),
        name = document.getElementById("name"),
        parentTitle = document.getElementById("parentTitle"),
        parentName = document.getElementById("parentName"),
        email = document.getElementById("email"),
        mobile = document.getElementById("mobile"),
        mobile2 = document.getElementById("mobile2"),
        address = document.getElementById("address"),
        district = document.getElementById("district"),
        state = document.getElementById("state"),
        pincode = document.getElementById("pincode"),
        valuationType = document.getElementById("valuationType"),
        purposeOfValuation = document.getElementById("purposeOfValuation"),
        marketValue = document.getElementById("marketValue"),
        totalExtent = document.getElementById("totalExtent"),
        latitude = document.getElementById("latitude"),
        longitude = document.getElementById("longitude"),
        day = document.getElementById("day"),
        month = document.getElementById("month"),
        year = document.getElementById("year"),
        fileNo = document.getElementById('fileNo'),
        fileTitle = document.getElementById('fileTitle'),
        documents = document.getElementById('documents'),
        photos = document.getElementById('photos'),
        saveBtn = document.getElementById('saveBtn'),
        updateBtn = document.getElementById('updateBtn');
        userTitle.value = file.title;
        name.value = file.name;
        parentTitle.value = file.parentTitle;
        parentName.value = file.parentName;
        email.value = file.email;
        mobile.value = file.mobile;
        mobile2.value = file.mobile2;
        address.value = file.address;
        district.value = file.district;
        state.value = file.state;
        pincode.value = file.pincode;
        valuationType.value = file.valuationType;
        purposeOfValuation.value = file.purposeOfValuation;
        marketValue.value = file.marketValue;
        totalExtent.value = file.totalExtent;
        latitude.value = file.latitude;
        longitude.value = file.longitude;
        day.value = file.day;
        month.value = file.month;
        year.value = file.year;
        fileNo.innerHTML = file.fileno;
        fileTitle.innerHTML = "Update File";
        documents.style.display = "none";
        photos.style.display = "none";
        saveBtn.style.display = "none";
        updateBtn.style.display = "block";
        window.file = file;
    });

    searchRequest.fail(function (jqXHR, textStatus, errorThrown) {
        // Log the error to the console
        console.error(
            "The following error occurred while retriving search results: "+
            textStatus, errorThrown
        );
    });

} catch (error) {
    console.log('Edit error:', error);
}
};

const deleteFile = (fileNo) => {
    const confirmDelete = confirm('Are you sure want to delete the file no ' + fileNo + '?');
    if(confirmDelete) {
        const deleteValue = prompt('Type DELETE_FILENO to delete the file no ' + fileNo, '');
        if(deleteValue.toLowerCase() === ("delete_" + fileNo)) {
            const deleteRequest = $.ajax({
                url: "./php/deleteFile.php",
                type: "post",
                data: {fileNo: fileNo}
            });
            // Callback handler that will be called on success
            deleteRequest.done(function (response, textStatus, jqXHR){
                // Log a message to the console
                let data = JSON.parse(response);
                let success = data.success;
                console.log(data, data.success);
                if(success === undefined) {
                    data = JSON.parse(data);
                    success = data.success;
                }
                console.log(data, data.success);
                if(success) {
                    getListSuggestions();
                    closeResults();
                    alert('File ' + fileNo + ' Deleted successfully.');
                }
                else {
                    alert('Error in deleting file.');
                    console.log('Error:', data.error);
                }
            });
            
            // Callback handler that will be called on failure
            deleteRequest.fail(function (jqXHR, textStatus, errorThrown){
                // Log the error to the console
                console.error(
                    "The following error occurred while retriving suggesions: "+
                    textStatus, errorThrown
                );
            });
        }
    }
};

const getListSuggestions = () => {
    const listRequest = $.ajax({
        url: "./php/getListSuggesions.php",
        type: "post",
        data: {}
    });
    // Callback handler that will be called on success
    listRequest.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        let data = JSON.parse(response);
        let dataList = {
            fileNos: document.getElementById('fileNos'),
            names: document.getElementById('names'),
            mobileNos: document.getElementById('mobileNos'),
            districts: document.getElementById('districts'),
            states: document.getElementById('states')
        }
        let fileNos = data.map((d) => {
            if(d.fileno !== undefined)
                return `<option>${d.fileno}</option>`;
        }).filter(onlyUnique).join('');

        let names = data.map((d) => {
            if(d.name !== undefined)
                return `<option>${d.name}</option>`;
        }).filter(onlyUnique).join('');

        let mobileNos = data.map((d) => {
            let mobiles = ''
            if(d.mobile !== undefined && d.mobile !== '')
                mobiles += `<option>${d.mobile}</option>`;
            if(d.mobile2 !== undefined && d.mobile2 !== '')
                mobiles += `<option>${d.mobile2}</option>`;
            return mobiles;
        }).filter(onlyUnique).join('');

        let districts = data.map((d) => {
            if(d.district !== undefined)
                return `<option>${d.district}</option>`;
        }).filter(onlyUnique).join('');

        let states = data.map((d) => {
            if(d.state !== undefined)
                return `<option>${d.state}</option>`;
        }).filter(onlyUnique).join('');
        dataList.fileNos.innerHTML = fileNos;
        dataList.names.innerHTML = names;
        dataList.mobileNos.innerHTML = mobileNos;
        dataList.districts.innerHTML = districts;
        dataList.states.innerHTML = states;
    });
    
    // Callback handler that will be called on failure
    listRequest.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred while retriving suggesions: "+
            textStatus, errorThrown
        );
    });
};
getListSuggestions();