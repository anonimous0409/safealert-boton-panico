// Importaciones necesarias para Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Configuración de Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyCFZHkKsqP-qGA0P7XDpj0zNow95YCQgAY",
  authDomain: "boton-de-panico-9204f.firebaseapp.com",
  projectId: "boton-de-panico-9204f",
  storageBucket: "boton-de-panico-9204f.appspot.com",
  messagingSenderId: "1042674190394",
  appId: "1:1042674190394:web:57f9949e4b17daec6a8d03"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Configuración de EmailJS con tus nuevos IDs
emailjs.init("Ka5j7U_0iB2fDxqmS"); // Public Key

// Variables globales
let userData = {
  email: "",
  phone: ""
};

// Elementos del DOM
const panicBtn = document.getElementById('panic-btn');
const saveBtn = document.getElementById('save-btn');
const emailInput = document.getElementById('user-email');
const phoneInput = document.getElementById('contact-phone');

// Guardar datos del usuario
saveBtn.addEventListener('click', () => {
  userData = {
    email: emailInput.value,
    phone: phoneInput.value
  };
  alert("Datos guardados correctamente!");
});

// Función para obtener ubicación
function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(new Error(`Error de geolocalización: ${error.message}`)),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      reject(new Error("Geolocalización no soportada en este navegador"));
    }
  });
}

// Función para enviar alerta 
async function sendAlert() {
  if (!userData.email || !userData.phone) {
    alert("Por favor completa tus datos primero");
    return;
  }

  try {
    // 1. Obtener ubicación
    const position = await getLocation();
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    // 2. Guardar en Firebase
    await addDoc(collection(db, "emergencias"), {
      email: userData.email,
      phone: userData.phone,
      ubicacion: coords,
      fecha: new Date().toISOString()
    });

    // 3. Enviar email con EmailJS 
    await emailjs.send(
      "service_jxfn01v",    // NUEVO Service ID
      "template_et4kk2r",   // NUEVO Template ID
      {
        user_email: userData.email,
        contact_phone: userData.phone,
        location: `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
      }
    );

    alert("¡Alerta enviada con éxito! Se notificó a tu contacto.");
  } catch (error) {
    console.error("Error completo:", error);
    alert(`Error al enviar alerta: ${error.message || "Ver consola para detalles"}`);
  }
}

// Asignar evento al botón de pánico
panicBtn.addEventListener('click', sendAlert);