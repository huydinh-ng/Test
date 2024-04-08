document.onvisibilitychange = event => {
    if (document.hidden) {
        // All NFC operations are suspended.
    } else {
        // All NFC operations can  be resumed.
    }
}

if ('NDEFReader' in window) {
    var log = document.getElementById("log");
    document.getElementById("stopButton").onclick = function () {
        log.innerHTML = "NFC Register stopped @ " + new Date().toLocaleTimeString();
    };

    navigator.permissions.query({ name: "nfc" }).then((nfcStatus) => {

        if (nfcStatus.state === "granted") {
            startScanning();
        } else {
            document.getElementById("scanButton").onclick = async (event) => {
                startScanning();
            };

        }

    });

    async function startScanning() {
        log.innerHTML = "NFC Register started...";
        const ndef = new NDEFReader();

        ndef.scan().then(() => {
            log.innerHTML = ("> Scan started");

            ndef.onreadingerror = () => {
                // Could not scan a tag, try another
                log.innerHTML = ("Argh! Cannot read data from the NFC tag. Try another one?");
            };

            ndef.onreading = event => {
                //Scanned a tag successfully
                log.innerHTML = ("ID  ${event} logged");
                if (event.recordType === "text") {
                    const textDecoder = new TextDecoder(event.encoding);
                    alert(`Text Record: ${textDecoder.decode(event.data)} ${record.lang}`);
                }
            };

        }).catch(error => {
            /// Something wrong with hardware
            log.innerHTML = (error);
        });
    }

} else {
    alert("NFS not supported");
}