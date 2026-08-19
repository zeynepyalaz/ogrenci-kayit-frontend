const saveButton = getElement("kaydet");

const searchButton = getElement("ara");

let editingStudentNumber = null;


// ====================
// BACKEND URL
// ====================

const API_URL =
    "http://localhost:3000";


// ====================
// LOAD STUDENTS
// ====================

loadStudentList();


async function loadStudentList() {

    try {

        const response = await fetch(
            `${API_URL}/api/students`
        );

        if (!response.ok) {

            throw new Error(
                "Öğrenciler getirilemedi."
            );

        }

        const students =
            await response.json();

        displayStudentList(students);

    } catch (error) {

        console.error(
            "Öğrenci listesi alınamadı:",
            error
        );

    }

}


// ====================
// GET STUDENT DATA
// ====================

function getStudentData() {

    return {

        studentNumber:
            getElement("numara").value.trim(),

        firstName:
            formatFirstName(
                getElement("ad").value
            ),

        lastName:
            formatLastName(
                getElement("soyad").value
            ),

        age:
            getElement("yas").value.trim()

    };

}


// ====================
// SAVE / UPDATE STUDENT
// ====================

saveButton.addEventListener(
    "click",
    async function (event) {

        event.preventDefault();


        const studentData =
            getStudentData();


        const validationResult =
            validateStudent(
                studentData.studentNumber,
                studentData.firstName,
                studentData.lastName,
                studentData.age
            );


        if (!validationResult.status) {

            displayValidationErrors(
                validationResult
            );

            return;

        }


        clearValidationErrors();


        // ====================
        // UPDATE
        // ====================

        if (editingStudentNumber !== null) {

            try {

                window.scrollTo(0, 0);

                const response =
                    await fetch(
                        `${API_URL}/api/students/${editingStudentNumber}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    studentData
                                )

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    getElement("sonuc").innerHTML =
                        data.message ||
                        "Öğrenci güncellenemedi.";

                    getElement("sonuc").style.color =
                        "red";

                    return;

                }


                getElement("sonuc").innerHTML =
                    "Öğrenci başarıyla güncellendi.";

                getElement("sonuc").style.color =
                    "green";


                editingStudentNumber = null;


                clearForm();


                await loadStudentList();

                return;


            } catch (error) {

                console.error(
                    "Güncelleme hatası:",
                    error
                );


                getElement("sonuc").innerHTML =
                    "Sunucuya bağlanırken bir hata oluştu.";

                getElement("sonuc").style.color =
                    "red";

                return;

            }

        }


        // ====================
        // CREATE
        // ====================

        try {

            console.log(
                "Kayıt isteği gönderiliyor:",
                studentData
            );


            const response =
                await fetch(
                    `${API_URL}/api/students/studentRegister`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                studentData
                            )

                    }
                );


            const data =
                await response.json();


            if (response.ok) {

                getElement("sonuc").innerHTML =
                    "Öğrenci başarıyla kaydedildi.";

                getElement("sonuc").style.color =
                    "green";


                clearForm();


                await loadStudentList();


            } else {

                getElement("sonuc").innerHTML =
                    data.message ||
                    "Kayıt başarısız.";

                getElement("sonuc").style.color =
                    "red";

            }


        } catch (error) {

            console.error(
                "Bağlantı hatası:",
                error
            );


            getElement("sonuc").innerHTML =
                "Sunucuya bağlanılamadı.";

            getElement("sonuc").style.color =
                "red";

        }

    }
);


// ====================
// SEARCH STUDENT
// ====================

searchButton.addEventListener(
    "click",
    async function () {

        const studentNumber =
            getElement("aramaNumara")
                .value
                .trim();


        const result =
            getElement("sonuc");


        if (!/^\d{5}$/.test(studentNumber)) {

            result.innerHTML =
                "Öğrenci numarası 5 haneli olmalıdır.";

            result.style.color =
                "red";

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/students/${studentNumber}`
                );


            const data =
                await response.json();


            if (response.ok) {

                result.innerHTML = `
                    <b>Numara:</b>
                    ${data.studentNumber}<br>

                    <b>Ad:</b>
                    ${data.firstName}<br>

                    <b>Soyad:</b>
                    ${data.lastName}<br>

                    <b>Yaş:</b>
                    ${data.age}
                `;

                result.style.color =
                    "black";


            } else {

                result.innerHTML =
                    data.message;

                result.style.color =
                    "red";

            }


        } catch (error) {

            console.error(error);


            result.innerHTML =
                "Sunucuya bağlanırken bir hata oluştu.";

            result.style.color =
                "red";

        }

    }
);