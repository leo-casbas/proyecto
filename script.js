// =========================
// CONFIGURACIÓN DEL PUNTO
// =========================
// Punto A (estudio):
// const FIXED_ID = "fmvictoria";
//
// Punto B (remoto):
// const FIXED_ID = "remoto";
//
const FIXED_ID = "fmvictoria";  // <-- CAMBIAR A "remoto" EN EL PUNTO B
// =========================

let localStream;
let peer;
let currentCall;

async function activarMicofono() {
    const log = document.getElementById('error-log');
    const idDisplay = document.getElementById('my-id');

    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        document.getElementById('setup').style.display = 'none';
        document.getElementById('panel').style.display = 'block';

        peer = new Peer(FIXED_ID, {
            host: '0.peerjs.com',
            port: 443,
            secure: true,
            debug: 3
        });

        peer.on('open', (id) => {
            idDisplay.innerText = id;
        });

        peer.on('error', (err) => {
            log.style.display = 'block';
            log.innerText = "Error: " + err.type + " (" + (err.message || "") + ")";
        });

        peer.on('call', (call) => {
            if (confirm("¿Aceptar llamada de " + call.peer + "?")) {
                call.answer(localStream);
                gestionarStream(call);
            }
        });

    } catch (e) {
        alert("Error de micrófono. Revisa los permisos.");
    }
}

function realizarLlamada() {
    const idDestino = document.getElementById('peer-id').value.trim();
    if (!idDestino) {
        alert("Ingresa un ID de destino válido.");
        return;
    }

    if (!peer || peer.disconnected) {
        alert("El peer no está conectado todavía. Espera unos segundos y vuelve a intentar.");
        return;
    }

    const call = peer.call(idDestino, localStream);
    gestionarStream(call);
}

function gestionarStream(call) {
    currentCall = call;

    call.on('stream', (remoteStream) => {
        let audio = document.getElementById('remote-audio');

        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'remote-audio';
            audio.autoplay = true;
            audio.controls = true;
            audio.setAttribute('playsinline', 'true');
            document.getElementById('audios').appendChild(audio);
        }

        audio.srcObject = remoteStream;
    });

    call.on('close', () => {
        const audio = document.getElementById('remote-audio');
        if (audio) audio.remove();
    });
}
