function displayStudentList(students) {

    const tbody = getElement("liste");

    tbody.innerHTML = "";


    students.forEach(function (student) {

        tbody.innerHTML += `
            <tr>

                <td>
                    ${student.studentNumber}
                </td>

                <td>
                    ${student.firstName}
                </td>

                <td>
                    ${student.lastName}
                </td>

                <td>
                    ${student.age}
                </td>

                <td>

                    <button
                        onclick="editStudent('${student.studentNumber}')"
                    >
                        Düzenle
                    </button>

                    <button
                        onclick="deleteStudent('${student.studentNumber}')"
                    >
                        Sil
                    </button>

                </td>

            </tr>
        `;

    });

}


// ====================
// EDIT STUDENT
// ====================

function editStudent(studentNumber) {

    window.scrollTo(0, 0);

    fetch(
        `http://localhost:3000/api/students/${studentNumber}`
    )
        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Öğrenci bulunamadı."
                );

            }

            return response.json();

        })
        .then(function (student) {

            getElement("numara").value =
                student.studentNumber;

            getElement("ad").value =
                student.firstName;

            getElement("soyad").value =
                student.lastName;

            getElement("yas").value =
                student.age;


            editingStudentNumber =
                student.studentNumber;

        })
        .catch(function (error) {

            console.error(
                "Öğrenci getirilemedi:",
                error
            );

        });

}


// ====================
// DELETE STUDENT
// ====================

async function deleteStudent(studentNumber) {

    const confirmed =
        confirm(
            `${studentNumber} numaralı öğrenciyi silmek istediğinize emin misiniz?`
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/students/${studentNumber}`,
                {

                    method: "DELETE"

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Öğrenci silinemedi."
            );

            return;

        }


        alert(
            "Öğrenci başarıyla silindi."
        );


        loadStudentList();


    } catch (error) {

        console.error(
            "Silme hatası:",
            error
        );


        alert(
            "Sunucuya bağlanırken bir hata oluştu."
        );

    }

}