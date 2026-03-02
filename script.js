let localStream;
let peer;
let currentCall;

// Puedes editar este ID fijo según lo que necesites.
const FIXED_ID = "fmvictoria";

async function activarMicofono() {
    const log = document.getElementById('error-log');
    const idDisplay = document.getElementById('my-id');

    try {
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        document.getElementById('setup').style.display = 'none';
        document.getElementById('panel').style.display = 'block';

        // Peer con ID fijo
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
            log.innerText = "Error: " + err.type + " (" + err.message + ")";
        });

        peer.on('call', (call) => {
            if (confirm("¿Aceptar llamada?")) {
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
    if (!idDestino) return alert("Ingresa un ID de destino válido.");

    const call = peer.call(idDestino, localStream);
    gestionarStream(call);
}

function gestionarStream(call) {
    call.on('stream', (remoteStream) => {
        if (document.getElementById('remote-audio')) return;
        const audio = document.createElement('audio');
        audio.id = 'remote-audio';
        audio.srcObject = remoteStream;
        audio.autoplay = true;
        audio.controls = true;
        audio.setAttribute('playsinline', 'true');
        document.getElementById('audios').appendChild(audio);
    });
}
