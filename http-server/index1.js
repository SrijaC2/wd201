let NewForm = document.getElementById("user-form");

const retrieve = () => {
    let entries = localStorage.getItem("user_entrybox");

    if (entries) { entries = JSON.parse(entries);
    } else {
    entries = [];
    }


    return entries;
    }

    let uE = retrieve();

    const displayEntry = () => {

        const entries = retrieve();
        const tableEntries = entries.map((entry) =>{

        const nameCell = `<td class='border px-3 py-3'>${entry.name}</td>`;
        const emailCell = `<td class='border px-3 py-3'>${entry.email}</td>`;

        const passwordCell = `<td class='border px-3 py-3'>${entry.password}</td>`;
        const dobCell = `<td class='border px-3 py-3'>${entry.dob}</td>`; 

        const acceptTermsCell = `<td class='border px-3 py-3'>${entry.acceptedTermsAndconditions}</td>`;
        const row = `<tr>${nameCell} ${emailCell} ${passwordCell} ${dobCell} ${acceptTermsCell}</tr>`;
        return row;
        }).join("\n");
    const table = `<table class="table-auto w-full"><tr>
    <th class="px-3 py-3">NAME</th>
    <th class="px-3 py-3">EMAIL</th>
    <th class="px-3 py-3">PASSWORD</th>
    <th class="px-3 py-3">DOB</th>
    <th class="px-3 py-3">ACCEPTED TERMS?</th> </tr>${tableEntries} </table>`;

    let details = document.getElementById("user_entrybox");

    details.innerHTML = table; 
    }


    
const saveNewForm = (event) =>{
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;

    const acceptedTermsAndconditions = document.getElementById("acceptTerms").checked;

    const entry = {
    name,
    email,
    password,
    dob,
    acceptedTermsAndconditions
    };

    uE.push(entry);

    localStorage.setItem("user_entrybox", JSON.stringify(uE));
    displayEntry();

};
NewForm.addEventListener("submit", saveNewForm);

displayEntry()