# Öğrenci Kayıt Sistemi — Frontend

Öğrenci Kayıt Sistemi'nin kullanıcı arayüzünü ve frontend tarafındaki uygulama mantığını içerir.

Frontend; öğrenci kayıtlarının oluşturulması, listelenmesi, öğrenci numarası üzerinden aranması, mevcut kayıtların düzenlenmesi ve silinmesi için gerekli kullanıcı etkileşimlerini yönetir.

Frontend ve backend bilinçli olarak birbirinden ayrılmış iki bağımsız projedir.

---

## İçindekiler

- [Mimari](#mimari)
- [Teknolojiler](#teknolojiler)
- [Dosya Yapısı](#dosya-yapısı)
- [Frontend Sorumlulukları](#frontend-sorumlulukları)
- [Backend ile İletişim](#backend-ile-iletişim)
- [API Kullanımı](#api-kullanımı)
- [CRUD Akışları](#crud-akışları)
- [Create — Öğrenci Kaydetme](#create--öğrenci-kaydetme)
- [Read — Öğrencileri Listeleme](#read--öğrencileri-listeleme)
- [Read — Öğrenci Arama](#read--öğrenci-arama)
- [Update — Öğrenci Güncelleme](#update--öğrenci-güncelleme)
- [Delete — Öğrenci Silme](#delete--öğrenci-silme)
- [Dosyaların Görevleri](#dosyaların-görevleri)
- [Kurulum](#kurulum)
- [Çalıştırma](#çalıştırma)
- [Sistem Akışı](#sistem-akışı)
- [Backend Repository](#backend-repository)

---

# Mimari

Proje iki bağımsız katmandan oluşmaktadır:

```text
┌─────────────────────────────────────────────────────┐
│                     FRONTEND                        │
│                                                     │
│  HTML + CSS + JavaScript                            │
│                                                     │
│  Kullanıcı arayüzü                                  │
│  Form işlemleri                                     │
│  Validasyon                                         │
│  Listeleme                                          │
│  Düzenleme                                          │
│  Arama                                              │
│                                                     │
│                 localhost:5500                      │
└─────────────────────────┬───────────────────────────┘
                          │
                          │ HTTP / JSON
                          │ fetch()
                          ▼
┌─────────────────────────────────────────────────────┐
│                     BACKEND                         │
│                                                     │
│  Node.js + Express                                  │
│                                                     │
│  REST API                                            │
│  CRUD işlemleri                                      │
│  SQLite iletişimi                                    │
│                                                     │
│                 localhost:3000                      │
└─────────────────────────┬───────────────────────────┘
                          │
                          │ SQL
                          ▼
┌─────────────────────────────────────────────────────┐
│                  SQLite Database                    │
│                                                     │
│                    ogrenciler                       │
└─────────────────────────────────────────────────────┘
```

Frontend SQLite database'e doğrudan erişmez.

Frontend'in görevi kullanıcıdan gelen etkileşimleri HTTP isteklerine dönüştürmek ve backend'den gelen response'ları kullanıcı arayüzüne yansıtmaktır.

---

# Teknolojiler

- HTML5
- CSS3
- JavaScript
- Fetch API
- VS Code
- Live Server

Backend tarafı ayrı bir repository'de aşağıdaki teknolojileri kullanır:

- Node.js
- Express.js
- SQLite
- sqlite3
- CORS

---

# Dosya Yapısı

```text
ogrenci-kayit-frontend/
│
├── js/
│   ├── helpers.js
│   ├── script.js
│   ├── ui.js
│   └── validation.js
│
├── index.html
├── style.css
├── README.md
└── .gitignore
```

---

# Frontend Sorumlulukları

Frontend aşağıdaki görevlerden sorumludur:

1. Kullanıcı arayüzünü oluşturmak
2. Form verilerini almak
3. Kullanıcı girdilerini kontrol etmek
4. Backend API'sine HTTP istekleri göndermek
5. Backend response'larını işlemek
6. Öğrenci listesini arayüzde göstermek
7. Öğrenci arama sonuçlarını göstermek
8. Öğrenci düzenleme işlemini başlatmak
9. Öğrenci silme işlemini başlatmak
10. İşlem sonuçlarını kullanıcıya göstermek

Frontend database işlemlerini kendisi gerçekleştirmez.

---

# Backend ile İletişim

Frontend ile backend farklı portlarda çalışmaktadır.

```text
Frontend
http://localhost:5500

Backend
http://localhost:3000
```

Frontend backend'e JavaScript `fetch()` API'si üzerinden HTTP istekleri gönderir.

Backend adresi `script.js` içerisinde:

```javascript
const API_URL =
    "http://localhost:3000";
```

şeklinde tanımlanmıştır.

Bu nedenle frontend'in API istekleri:

```text
${API_URL}/api/...
```

formatında oluşturulur.

---

# API Kullanımı

Frontend tarafından kullanılan endpointler:

| İşlem | HTTP Method | Endpoint |
|---|---|---|
| Öğrenci oluştur | POST | `/api/students/studentRegister` |
| Tüm öğrencileri getir | GET | `/api/students` |
| Tek öğrenci getir | GET | `/api/students/:studentNumber` |
| Öğrenci güncelle | PUT | `/api/students/:studentNumber` |
| Öğrenci sil | DELETE | `/api/students/:studentNumber` |

Backend API'nin tamamı:

```text
http://localhost:3000/api
```

altında çalışmaktadır.

---

# CRUD Akışları

Uygulamanın temel veri işlemleri CRUD modeline göre tasarlanmıştır.

```text
CREATE → Öğrenci oluşturma
READ   → Öğrenci / öğrencileri getirme
UPDATE → Öğrenci güncelleme
DELETE → Öğrenci silme
```

Genel veri akışı:

```text
Kullanıcı
   │
   ▼
Frontend UI
   │
   ▼
JavaScript
   │
   ▼
fetch()
   │
   ▼
HTTP Request
   │
   ▼
Backend API
   │
   ▼
SQLite
   │
   ▼
HTTP Response
   │
   ▼
Frontend
   │
   ▼
UI güncellenir
```

---

# Create — Öğrenci Kaydetme

Kullanıcı form alanlarını doldurduktan sonra kaydetme işlemini başlatır.

Frontend öğrenci bilgilerini JSON formatına dönüştürür.

Örnek veri:

```json
{
    "studentNumber": "12345",
    "firstName": "Ali",
    "lastName": "Yılmaz",
    "age": 20
}
```

Backend'e gönderilen request:

```http
POST /api/students/studentRegister
```

Frontend tarafındaki istek mantığı:

```javascript
const response =
    await fetch(
        `${API_URL}/api/students/studentRegister`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        }
    );
```

Backend bu request'i alır ve SQLite database içerisinde `INSERT` işlemi gerçekleştirir.

Başarılı işlem:

```text
HTTP 201 Created
```

---

# Read — Öğrencileri Listeleme

Uygulama açıldığında frontend kayıtlı öğrencileri backend'den ister.

Request:

```http
GET /api/students
```

Frontend:

```javascript
const response =
    await fetch(
        `${API_URL}/api/students`
    );
```

Backend database'deki öğrencileri JSON olarak döndürür.

Örnek response:

```json
[
    {
        "studentNumber": "12345",
        "firstName": "Ali",
        "lastName": "Yılmaz",
        "age": 20
    },
    {
        "studentNumber": "67890",
        "firstName": "Ayşe",
        "lastName": "Demir",
        "age": 21
    }
]
```

Frontend bu response'u alarak öğrenci listesini oluşturur.

---

# Read — Öğrenci Arama

Belirli bir öğrenci numarasıyla arama yapılırken:

```http
GET /api/students/:studentNumber
```

endpoint'i kullanılır.

Örneğin:

```http
GET /api/students/12345
```

Frontend backend'den tek bir öğrenci bekler.

Öğrenci bulunursa:

```json
{
    "studentNumber": "12345",
    "firstName": "Ali",
    "lastName": "Yılmaz",
    "age": 20
}
```

response'u alınır.

Öğrenci bulunamazsa backend:

```text
404 Not Found
```

döndürür.

Frontend bu sonucu kullanıcı arayüzünde gösterir.

---

# Update — Öğrenci Güncelleme

Frontend'de mevcut öğrenci düzenleme işlemine alındığında ilgili öğrenci bilgileri backend'den alınır.

Kullanıcı bilgileri değiştirdikten sonra frontend:

```http
PUT /api/students/:studentNumber
```

request'i gönderir.

Örneğin:

```http
PUT /api/students/12345
```

Request body:

```json
{
    "studentNumber": "12345",
    "firstName": "Ali",
    "lastName": "Kaya",
    "age": 21
}
```

Backend ilgili kaydı SQLite üzerinde `UPDATE` sorgusuyla değiştirir.

Başarılı işlemden sonra frontend güncel listeyi gösterir.

---

# Delete — Öğrenci Silme

Öğrenci silme işleminde frontend:

```http
DELETE /api/students/:studentNumber
```

request'i gönderir.

Örneğin:

```http
DELETE /api/students/12345
```

Backend ilgili öğrenciyi SQLite'dan siler.

Başarılı işlemden sonra frontend öğrenci listesini günceller.

---

# Dosyaların Görevleri

## `index.html`

Uygulamanın DOM yapısını oluşturur.

Form alanları, butonlar ve öğrenci listesinin HTML yapısı burada bulunur.

---

## `style.css`

Uygulamanın görsel katmanından sorumludur.

---

## `js/script.js`

Frontend'in ana uygulama mantığını içerir.

Başlıca sorumlulukları:

- Backend API adresini tanımlamak
- Öğrenci listesini backend'den almak
- Öğrenci oluşturma request'lerini göndermek
- Öğrenci güncelleme request'lerini göndermek
- Öğrenci arama request'lerini göndermek
- İşlem sonuçlarını yönetmek

---

## `js/ui.js`

Kullanıcı arayüzünün dinamik olarak güncellenmesinden sorumludur.

Öğrencilerin listelenmesi ve düzenleme işlemleri gibi UI ile ilgili fonksiyonları içerir.

---

## `js/helpers.js`

Tekrar kullanılabilecek yardımcı fonksiyonları içerir.

---

## `js/validation.js`

Form verilerinin frontend tarafındaki doğrulama işlemlerini içerir.

---

# Kurulum

Frontend için Node.js bağımlılığı bulunmamaktadır.

Ancak frontend'in backend ile birlikte çalışabilmesi gerekir.

Gerekli araçlar:

- Git
- Visual Studio Code
- Live Server

Backend için ayrıca Node.js gereklidir.

---

# Çalıştırma

## 1. Backend'i başlat

Öncelikle backend repository'sinin çalışıyor olması gerekir.

Backend:

```text
http://localhost:3000
```

adresinde çalışmalıdır.

Backend'in nasıl kurulacağı için:

**`ogrenci-kayit-backend` repository'sindeki README'ye bakınız.**

---

## 2. Frontend'i aç

Frontend klasörünü VS Code ile açın.

`index.html` dosyasına sağ tıklayın:

```text
Open with Live Server
```

Frontend:

```text
http://localhost:5500
```

adresinde açılır.

---

# Sistem Akışı

## Yeni öğrenci kaydı

```text
Kullanıcı formu doldurur
        ↓
Frontend validation
        ↓
JavaScript
        ↓
POST /api/students/studentRegister
        ↓
Express API
        ↓
SQLite INSERT
        ↓
HTTP 201
        ↓
Frontend response'u işler
        ↓
Liste güncellenir
```

## Öğrencileri görüntüleme

```text
Frontend
   ↓
GET /api/students
   ↓
Express
   ↓
SQLite SELECT
   ↓
JSON
   ↓
Frontend
   ↓
Öğrenci listesi
```

## Öğrenci güncelleme

```text
Frontend
   ↓
GET /api/students/:studentNumber
   ↓
Öğrenci bilgileri
   ↓
Kullanıcı düzenler
   ↓
PUT /api/students/:studentNumber
   ↓
SQLite UPDATE
   ↓
Frontend
```

## Öğrenci silme

```text
Frontend
   ↓
DELETE /api/students/:studentNumber
   ↓
SQLite DELETE
   ↓
Response
   ↓
Frontend listeyi günceller
```

---

# Backend Repository

Backend ayrı bir repository'de tutulmaktadır:

```text
ogrenci-kayit-backend
```

Backend repository'si:

```text
Node.js
Express
SQLite
REST API
```

katmanlarını içerir.

Frontend yalnızca API üzerinden backend ile iletişim kurar.

Bu ayrım sayesinde iki proje birbirinden bağımsız geliştirilebilir.

---

# Özet

```text
Frontend
├── Kullanıcı arayüzü
├── Form işlemleri
├── Validation
├── UI yönetimi
└── API istemcisi
          │
          │ HTTP / JSON
          ▼
Backend
├── REST API
├── CRUD işlemleri
├── Request / Response yönetimi
└── Database erişimi
          │
          ▼
SQLite
└── ogrenciler
```

Frontend kullanıcı etkileşimlerini yönetirken backend veri işlemlerinin tamamından sorumludur.

Database'e doğrudan frontend erişimi yoktur.