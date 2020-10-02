
const documentsMaxSize = 6;

const renderFileDate = () => {
    let dayData = '';
    let monthData = '';
    let yearData = '';
    let day = document.getElementById("day");
    let month = document.getElementById("month");
    let year = document.getElementById("year");
    let date = new Date();
    for(let i=1; i<=31; i++)
        dayData += `<option value="${i}">${i}</option>`;
    for(let i=1; i<=12; i++)
        monthData += `<option value="${i}">${i}</option>`;
    for(let i=date.getFullYear(); i>=2000; i--)
        yearData += `<option value="${i}">${i}</option>`;

    day.innerHTML += dayData;
    month.innerHTML += monthData;
    year.innerHTML += yearData;
    setDefaultDate();
};

const renderDocumentsRefered = () => {
    const documentsReferred = ['Sale Deed', 'Property Tax', 'Water Tax', 'E.B.Connection'];
    let documentsReferredOptions = ``;
    documentsReferred.forEach(documentName => {
        documentsReferredOptions += `<option value="${documentName}">${documentName}</option>`; 
    });
    let documentsReferredHTML = '';
    for(let i=1; i<=documentsMaxSize; i++) {
        documentsReferredHTML += `<div class="col-4">
                                    <input list="documentOptions" id="filetype${i}">
                                </div>
                                <div class="col-4">
                                    <input type="text" id="filename${i}" placeholder="File Name" />
                                </div>
                                <div class="col-4">
                                    <input type="file" id="file${i}" />
                                </div>
                                <div>
                                    <datalist id="documentOptions">
                                        ${documentsReferredOptions}
                                    </datalist>
                                </div>`;
    }
    document.getElementById('documentsReferred').innerHTML = documentsReferredHTML;

};

const setDefaultDate = () => {
    let date = new Date();
    document.getElementById("day").value = date.getDate();
    document.getElementById("month").value = date.getMonth()+1;
    document.getElementById("year").value = date.getFullYear();
};

const setDefaultState = () => {
    document.getElementById("state").value = 'Tamil Nadu';
}

const changeDistrictRequired = (required = true) => {
    document.getElementById('district').required = required;
}
const changeFileRequired = (type, required = true, index = -1) => {
    if(index !== -1) {
        document.getElementById('file'+type+String(index)).required = required;
    }
    else {
        for(let i=1; i<=documentsMaxSize; i++) {
            document.getElementById('file'+type+String(i)).required = required;
        }
    }
}

const renderDistricts = () => {
    const districts = ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanniyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupattur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'];
    let districtsHTML = '';
    let districtElement = document.getElementById("district");
    for(let i=0; i<districts.length; i++)
        districtsHTML += `<option value="${districts[i]}">${districts[i]}</option>`;
    districtElement.innerHTML += districtsHTML;
    return false;
};

const openModal = () => {
    document.getElementById("preview").style.display = "block";
};

const closeModal = () => {
    document.getElementById("preview").style.display = "none";
    document.getElementById("previewData").innerHTML = "";
};

const openMap = () => {
    document.getElementById("gMap").style.display = "block";
};

const closeMap = () => {
    document.getElementById("gMap").style.display = "none";
};

window.addEventListener('click', function(event) {
    if (event.target == document.getElementById("preview")) {
        closeModal();
    }
    if (event.target == document.getElementById("gMap")) {
        closeMap();
    }
});

const download = (docName) => {
    var doc = new jsPDF();
    var elementHTML = document.getElementById('previewData');
    var specialElementHandlers = {
        '#download': function (element, renderer) {
            return true;
        }
    };
    doc.fromHTML(elementHTML, 15, 15, {
        'elementHandlers': specialElementHandlers
    });

    // Save the PDF
    doc.save(docName+'.pdf');
}

function printHtmlToPdf(html) {
    let pdfURL = "";
    var endpoint = 'https://v2018.api2pdf.com/chrome/html';
    var apikey = '530ddd3e-4184-4595-96be-029332741583'; //replace this with your own from portal.api2pdf.com
    var payload = {
      "html": html,
      "inlinePdf": false
    };
    $.ajax({
        url: endpoint,
        method: "POST",
        dataType: "json",
        crossDomain: true,
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(payload),
        cache: false,
        beforeSend: function (xhr) {
            /* Authorization header */
            xhr.setRequestHeader("Authorization", apikey);
        },
        success: function (data) {
            //console.log(data.pdf); //this is the url to the pdf, do something with it
            pdfURL = data.pdf;
        },
        error: function (jqXHR, textStatus, errorThrown) {
  
        }
    });
    return pdfURL;

  }

const userPDF = () => {
    /*const doc = new jsPDF();
    const elementHTML = getTemplate(getData()).templateData.replace('\\n', '').replace('\\"', '');
    doc.fromHTML(elementHTML, 15, 15, {
    });

    return doc.output('blob');*/
    return printHtmlToPdf(getTemplate(getData()).templateData.replace('\\n', '').replace('\\"', ''));
}

const getTemplate = ({userTitle, name, parentTitle, parentName, email, mobile, mobile2, address, district, state, pincode, day, month, year, valuationType, purposeOfValuation, marketValue, totalExtent, latitude, longitude, fileNo}) => {
    let serialNo = 0;
    const getSerialNo = () => {
        let no = ++serialNo;
        if(no < 10)
            return "0"+String(no);
        else
            return no;
    };
    const addCommasToAmount = (num) => {
        const a = parseFloat(num).toFixed(2).split('.');
        let k = 3;
        let b = "";
        let i = a[0].length-1;
        while(i>=0) {
            if(i !== a[0].length-1) k = 2;
            console.log(i,k);
            for(let j = 0; j < k && (i-j) >= 0; j++) {
                b += a[0][i-j];
            }
            if(i-k >= 0) b += ',';
            i -= k;
        }
        b = [...b].reverse().join('');
        return [b, a[1]].join('.');
    };

    return { 
        templateName: 'File_' + fileNo,
        templateData: `
        <html>
        <head>
        <style type="text/css">
            .preview-table {
                width:100%;height:100%;color:black;
            }
            .preview-table tr > td {
                vertical-align: top;
            }
            .preview-table tr:not([rowspaned-row="true"]) td:nth-of-type(2) { 
                width: 40%;
            }
            .preview-table tr[rowspaned-row="true"]:nth-of-type(1){
                width: 40%;
            }
            .preview-table td:last-child { 
                width: 50%;
            }
            .preview-table tr:not([rowspaned-row="true"]) td:nth-of-type(1){ 
                width: 5%;
            }
        </style>
        </head>
        <body>
        <div>
            <div style="text-align: right;color:black;">File. No. ${fileNo}</div>
            <center>
                <h2 style="margin: 0; text-decoration: underline; color:black;">VALUATION REPORT</h2>
                <h2 style="margin: 0; text-decoration: underline;color:black;">SUMMARY</h2>
            </center>
            <table class="preview-table">
                <tbody>
                    <tr>    
                        <td>${getSerialNo()}</td>
                        <td>Name</td>
                        <td>:</td>
                        <td>
                            <b>${userTitle}.${name}, ${parentTitle}.${parentName}</b><br>
                            <address>${address},</address>
                            <address>${district}, ${state} - ${pincode}.</address>
                            <b>Cell: ${mobile}, ${mobile2}</b>
                            ${email ? "<br><b>Email: " + email +"</b>": ""}
                        </td>
                    </tr>
                    <tr>    
                        <td>${getSerialNo()}</td>
                        <td>Date of Inspection</td>
                        <td>:</td>
                        <td>${parseInt(day) < 10 ? "0" + day : day}.${parseInt(month) < 10 ? "0" + month : month}.${year}</td>
                    </tr>
                    <tr>    
                        <td>${getSerialNo()}</td>
                        <td>Type of Valuation</td>
                        <td>:</td>
                        <td>${valuationType}</td>
                    </tr>
                    <tr>    
                        <td>${getSerialNo()}</td>
                        <td>Purpose for which this Valuation is made</td>
                        <td>:</td>
                        <td><b>${purposeOfValuation}</b></td>
                    </tr>
                    <tr>    
                        <td rowspan="3">${getSerialNo()}</td>
                        <td>a) Prevailing Market Value of the Property</td>
                        <td>:</td>
                        <td><b>Rs. ${addCommasToAmount(marketValue)}</b></td>
                    </tr>
                    <tr rowspaned-row="true">    
                        <td>b) Forced Sale Value of the Property (-20%)</td>
                        <td>:</td>
                        <td><b>Rs. ${addCommasToAmount(marketValue * 0.8)}</b></td>
                    </tr>
                    <tr rowspaned-row="true">    
                        <td>c) Realizable Value of the Property (-10%)</td>
                        <td>:</td>
                        <td><b>Rs. ${addCommasToAmount(marketValue * 0.8 * 0.9)}</b></td>
                    </tr>
                    <tr>    
                        <td>${getSerialNo()}</td>
                        <td>Total Extent of the Property</td>
                        <td>:</td>
                        <td>${totalExtent}</td>
                    </tr>
                    <tr>    
                        <td>${getSerialNo()}</td>
                        <td>Latitude & Longitude</td>
                        <td>:</td>
                        <td>${latitude}, ${longitude}</td>
                    </tr>
                </tbody>
            </table>
        </div></body></html>`
    };
};

const getData = (formData = false) => {
    const userTitle = document.getElementById("userTitle").value,
        name = document.getElementById("name").value,
        parentTitle = document.getElementById("parentTitle").value,
        parentName = document.getElementById("parentName").value,
        email = document.getElementById("email").value,
        mobile = document.getElementById("mobile").value,
        mobile2 = document.getElementById("mobile2").value,
        address = document.getElementById("address").value,
        district = document.getElementById("district").value,
        state = document.getElementById("state").value,
        pincode = document.getElementById("pincode").value,
        valuationType = document.getElementById("valuationType").value,
        purposeOfValuation = document.getElementById("purposeOfValuation").value,
        marketValue = document.getElementById("marketValue").value,
        totalExtent = document.getElementById("totalExtent").value,
        latitude = document.getElementById("latitude").value,
        longitude = document.getElementById("longitude").value,
        day = document.getElementById("day").value,
        month = document.getElementById("month").value,
        year = document.getElementById("year").value,
        images = document.getElementById('images').files,
        fileNo = document.getElementById('fileNo').innerHTML;
    let files = [];
    let fileNames = [];
    let fileTypes = [];
    for(let i=1; i <= documentsMaxSize; i++)
        files.push(document.getElementById('file'+String(i)).files);
    for(let i=1; i <= documentsMaxSize; i++)
        fileNames.push(document.getElementById('filename'+String(i)).value);
    for(let i=1; i <= documentsMaxSize; i++)
        fileTypes.push(document.getElementById('filetype'+String(i)).value);

    console.log(files, fileNames, fileTypes);

    if(formData) {
        let registerFormData = new FormData();
        registerFormData.append('userTitle', userTitle);
        registerFormData.append('name', name);
        registerFormData.append('parentTitle', parentTitle);
        registerFormData.append('parentName', parentName);
        registerFormData.append('email', email);
        registerFormData.append('mobile', mobile);
        registerFormData.append('mobile2', mobile2);
        registerFormData.append('address', address);
        registerFormData.append('district', district);
        registerFormData.append('state', state);
        registerFormData.append('pincode', pincode);
        registerFormData.append('day', day);
        registerFormData.append('month', month);
        registerFormData.append('year', year);
        registerFormData.append('valuationType', valuationType);
        registerFormData.append('purposeOfValuation', purposeOfValuation);
        registerFormData.append('marketValue', marketValue);
        registerFormData.append('totalExtent', totalExtent);
        registerFormData.append('latitude', latitude);
        registerFormData.append('longitude', longitude);
        for(let i=0; i < documentsMaxSize; i++) {
            if(files[i].length !==0) {
                registerFormData.append('files[]', files[i][0]);
                registerFormData.append('fileNames[]', fileNames[i]);
                registerFormData.append('fileTypes[]', fileTypes[i]);
            }
        }
        if(images.length !== 0) {
            for (let i = 0; i < images.length; i++) {
                registerFormData.append("images[]", images[i]);
            }
        }
        registerFormData.append('userPDF', userPDF());
        registerFormData.append('fileNo', fileNo);

        return registerFormData;
    }
    else {
        return {
            userTitle: userTitle,
            name: name,
            parentTitle: parentTitle,
            parentName: parentName,
            email: email,
            mobile: mobile,
            mobile2: mobile2,
            address: address,
            district: district,
            state: state,
            pincode: pincode,
            valuationType: valuationType,
            purposeOfValuation: purposeOfValuation,
            marketValue: marketValue,
            totalExtent: totalExtent,
            latitude: latitude,
            longitude: longitude,
            day: day,
            month: month,
            year: year,
            fileNo: fileNo
        };
    }
};

const userData = (e) => {
    const name = e.explicitOriginalTarget.name;
    e.preventDefault();
    if(document.getElementById('district').value === "") {
        changeDistrictRequired();
        return false;
    }
    let isValid = true;
    for(let i=1; i <= documentsMaxSize; i++) {
        if(document.getElementById('file'+String(i)).files.length !== 0) {
            if(document.getElementById('filename'+String(i)).value === undefined
            || document.getElementById('filename'+String(i)).value === "") {
                changeFileRequired('name', true, i);
                isValid = false;
            }
            if(document.getElementById('filetype'+String(i)).value === undefined
            || document.getElementById('filetype'+String(i)).value === "") {
                changeFileRequired('type', true, i);
                isValid = false;
            }
        }
    }
    if(!isValid)
        return false;
    if(name==="save") {
        let saveFile = document.getElementById('saveFile');
        let saveFileName = saveFile.value;
        saveFile.value = "Loading...";
        const pdfURL = userPDF();
        let formData = getData(true);
        formData.append('pdfURL', pdfURL);
        console.log('pdfURL:', pdfURL);
        registerFile(formData);
        saveFile.value = saveFileName;
    }
    else if(name==="update") {
        let updateFile = document.getElementById('updateFile');
        let updateFileName = updateFile.value;
        updateFile.value = "Loading...";
        let formData = updatedData();
        const pdfURL = userPDF();
        formData.append('pdfURL', pdfURL);
        updateFileData(formData);
        updateFile.value = updateFileName;
    }    
    else if(name==="preview") {
        previewUserData();
    }
    else if(name==="download") {
        const formData = getTemplate(getData());
        console.log('formData:', formData);
        document.getElementById('previewData').innerHTML = formData.templateData;
        download(formData.templateName);
    }
    else
        return false;
};

const previewUserData = () => {
    const formData = getTemplate(getData());
    document.getElementById('previewData').innerHTML = formData.templateData;
    window.previewData = formData;
    openModal();
}

const modalDownload = () => {
    const formData = window.previewData;
    console.log('formData:', formData);
    download(formData.templateName);
}

const clearForm = () => {
    document.getElementById("userForm").reset();
    return false;
}

const registerFile = (data) => {
    const fileSaveRequest = $.ajax({
        url: "./php/fileRegister.php",
        type: "post",
        async: false,
        data: data,
        processData: false,
        contentType: false
    });
    // Callback handler that will be called on success
    fileSaveRequest.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        let data = JSON.parse(response);
        let success = data.success;
        if(success === undefined)
            data = JSON.parse(data);
        if(data.success) {
            alert('File Saved');
            clearForm();
            registerLoadAfterSubmission();
        }
        else 
        {
            console.log(data);
            if(data.error !== undefined)
                alert(data.error);
            else
                alert('Error in saving file');
        }
        try {
            getListSuggestions();
        }
        catch(e) {
            console.log('getListSuggestions error:', e);
        }
    });
    
    // Callback handler that will be called on failure
    fileSaveRequest.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred while retriving registering file: "+
            textStatus, errorThrown
        );
        alert('Error in saving file');
    });   
};

const updateFileData = (data) => {
    const fileSaveRequest = $.ajax({
        url: "./php/fileUpdate.php",
        type: "post",
        data: data,
        async: false,
        processData: false,
        contentType: false
    });
    // Callback handler that will be called on success
    fileSaveRequest.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        let data = JSON.parse(response);
        let success = data.success;
        if(success === undefined)
            data = JSON.parse(data);
        if(data.success) {
            alert('File Updated');
            location.reload();
        }
        else 
        {
            console.log(data);
            if(data.error !== undefined)
                alert(data.error);
            else
                alert('Error in saving file');
        }
    });
    
    // Callback handler that will be called on failure
    fileSaveRequest.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred while retriving registering file: "+
            textStatus, errorThrown
        );
        alert('Error in saving file');
    });   
};

const updatedData = () => {
    const file = window.file;
    let formData = new FormData();
    const userTitle = document.getElementById("userTitle").value,
        name = document.getElementById("name").value,
        parentTitle = document.getElementById("parentTitle").value,
        parentName = document.getElementById("parentName").value,
        email = document.getElementById("email").value,
        mobile = document.getElementById("mobile").value,
        mobile2 = document.getElementById("mobile2").value,
        address = document.getElementById("address").value,
        district = document.getElementById("district").value,
        state = document.getElementById("state").value,
        pincode = document.getElementById("pincode").value,
        valuationType = document.getElementById("valuationType").value,
        purposeOfValuation = document.getElementById("purposeOfValuation").value,
        marketValue = document.getElementById("marketValue").value,
        totalExtent = document.getElementById("totalExtent").value,
        latitude = document.getElementById("latitude").value,
        longitude = document.getElementById("longitude").value,
        day = document.getElementById("day").value,
        month = document.getElementById("month").value,
        year = document.getElementById("year").value,
        fileNo = document.getElementById('fileNo').innerHTML;
        console.log('formData length:', formData.keys, formData);
    
    formData.append('fileNo', fileNo);
    formData.append('userTitle', userTitle);
    formData.append('name', name);
    formData.append('parentTitle', parentTitle);
    formData.append('parentName', parentName);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('mobile2', mobile2);
    formData.append('address', address);
    formData.append('district', district);
    formData.append('state', state);
    formData.append('pincode', pincode);
    formData.append('day', day);
    formData.append('month', month);
    formData.append('year', year);
    formData.append('valuationType', valuationType);
    formData.append('purposeOfValuation', purposeOfValuation);
    formData.append('marketValue', marketValue);
    formData.append('totalExtent', totalExtent);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    return formData;
};

const getFileNo = () => {
    const fileRequest = $.ajax({
        url: "./php/getFileNo.php",
        type: "post",
        data: {}
    });
    // Callback handler that will be called on success
    fileRequest.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log('file response:', response)
        $('#fileNo').html(response)
    });
    
    // Callback handler that will be called on failure
    fileRequest.fail(function (jqXHR, textStatus, errorThrown){
        // Log the error to the console
        console.error(
            "The following error occurred while retriving file no: "+
            textStatus, errorThrown
        );
    });
};

const registerLoad = () => {
    renderDistricts();
    renderFileDate();
    renderDocumentsRefered();
    setDefaultState();
    getFileNo();
};

const registerLoadAfterSubmission = () => {
    setDefaultDate();
    setDefaultState();
    getFileNo();
    changeDistrictRequired(false);
    changeFileRequired('name',false);
    changeFileRequired('type',false);
};

registerLoad();