function getElement(id) {

    return document.getElementById(id);

}


function cleanText(text) {

    return text
        .trim()
        .replace(/\s+/g, " ");

}


function formatFirstName(firstName) {

    firstName = cleanText(firstName);

    return firstName
        .split(" ")
        .map(function (word) {

            return word.charAt(0).toUpperCase() +
                   word.slice(1).toLowerCase();

        })
        .join(" ");

}


function formatLastName(lastName) {

    return cleanText(lastName)
        .toUpperCase();

}


function clearForm() {

    getElement("numara").value = "";
    getElement("ad").value = "";
    getElement("soyad").value = "";
    getElement("yas").value = "";

}