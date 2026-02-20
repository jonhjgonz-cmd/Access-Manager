import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export default function DriveDocsUploader({ onFileSelected }) {
    const [pickerInited, setPickerInited] = useState(false);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // Obtenemos el token de acceso que guardamos en App.jsx tras el Login exitoso
        const storedToken = localStorage.getItem('access_token');
        if (storedToken && storedToken !== 'dummy_token') {
            setAccessToken(storedToken);
        }

        // Cargamos asincronamente el script de Google API (gapi) que contiene el Picker
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            window.gapi.load('picker', { callback: () => setPickerInited(true) });
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const createPicker = () => {
        if (!pickerInited) {
            toast.error('El Selector de Google Drive aún no ha cargado.');
            return;
        }

        if (!accessToken) {
            toast.error('Necesitas iniciar sesión con Google para ver tus archivos.');
            return;
        }

        const FOLDER_ID = '1qN3H4u7KembTYmL09UYqFl7Xf-zBOIve';
        console.log("Comprobando API_KEY en Cliente:", API_KEY);

        // Vista 1: Seleccionar archivos dentro de la carpeta designada
        const view = new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
            .setParent(FOLDER_ID)
            .setMimeTypes('application/pdf,application/vnd.google-apps.document,application/vnd.google-apps.spreadsheet');

        // Vista 2: Pestaña para Subir nuevos archivos directo a tu carpeta maestra
        const uploadView = new window.google.picker.DocsUploadView()
            .setParent(FOLDER_ID);

        const picker = new window.google.picker.PickerBuilder()
            .addView(view)
            .addView(uploadView)
            .setOAuthToken(accessToken)
            .setDeveloperKey(API_KEY)
            .setCallback(pickerCallback)
            .build();

        picker.setVisible(true);
    };

    const pickerCallback = (data) => {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
            const doc = data[window.google.picker.Response.DOCUMENTS][0];
            const fileData = {
                id: doc.id,
                name: doc.name,
                url: doc.url,
                iconUrl: doc.iconUrl,
                mimeType: doc.mimeType
            };

            toast.success(`Archivo seleccionado: ${fileData.name}`);

            if (onFileSelected) {
                onFileSelected(fileData);
            }
        }
    };

    return (
        <button
            onClick={createPicker}
            disabled={!pickerInited}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${pickerInited ? 'bg-primary text-white hover:bg-primary/90 shadow-sm' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Importar desde Drive
        </button>
    );
}
