function validateStudent(
    studentNumber,
    firstName,
    lastName,
    age
) {

    let fieldsAreFilled = true;
    let studentNumberIsValid = true;
    let firstNameIsValid = true;
    let lastNameIsValid = true;
    let ageIsValid = true;


    if (
        studentNumber === "" ||
        firstName === "" ||
        lastName === "" ||
        age === ""
    ) {

        fieldsAreFilled = false;

    }


    if (!/^\d{5}$/.test(studentNumber)) {

        studentNumberIsValid = false;

    }


    if (
        !/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]{2,25}$/.test(firstName)
    ) {

        firstNameIsValid = false;

    }


    if (
        !/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]{2,25}$/.test(lastName)
    ) {

        lastNameIsValid = false;

    }


    if (age < 0 || age > 120) {

        ageIsValid = false;

    }


    return {

        fieldsAreFilled,
        studentNumberIsValid,
        firstNameIsValid,
        lastNameIsValid,
        ageIsValid,

        status:
            fieldsAreFilled &&
            studentNumberIsValid &&
            firstNameIsValid &&
            lastNameIsValid &&
            ageIsValid

    };

}


function displayValidationErrors(result) {

    const message = getElement("sonuc");

    let messages = [];


    if (!result.fieldsAreFilled) {

        messages.push(
            "Lütfen bütün alanları doldurun."
        );

    }

    if (!result.studentNumberIsValid) {

        messages.push(
            "Öğrenci numarası 5 haneli olmalıdır."
        );

    }

    if (!result.firstNameIsValid) {

        messages.push(
            "Geçerli bir ad giriniz."
        );

    }

    if (!result.lastNameIsValid) {

        messages.push(
            "Geçerli bir soyad giriniz."
        );

    }

    if (!result.ageIsValid) {

        messages.push(
            "Geçerli bir yaş giriniz."
        );

    }


    message.innerHTML =
        messages.join("<br>");

    message.style.color = "red";

}


function clearValidationErrors() {

    const message = getElement("sonuc");

    message.innerHTML = "";

}