
const temaAlumno = [
    {
        titulo: "Administración digital",
        temas: [
            "Certificado digital de personal física",
            "Registro electrónico",
            "Sede electrónica",
        ]
    },
    {
        titulo: "Comunicaciones",
        temas: [
            "Correo electrónico",
            "Google Meet",
            "Cuenta de Alumno",
        ]
    },
    {
        titulo: "Conectividad",
        temas: [
            "Cortafuegos corporativo",
            "VPN Acceso remoto",
            "Wifi Eduroam (ssid: eduroam)",
        ]
    },
    {
        titulo: "Docencia",
        temas: [
            "Aula Virtual",
            "Moodle: Aula Global",
            "Plataforma de cursos online Privados",
        ]
    },
    {
        titulo: "Web",
        temas: [
            "Portal de eventos",
        ]
    }
];

const temaPAS = [
    {
        titulo: "Administración digital",
        temas: [
            "Certificado digital de personal física",
            "Certificado electrónico de empleado público",
            "Registro electrónico",
            "Sede electrónica",
            "Portafirmas",
        ]
    },
    {
        titulo: "Comunicaciones",
        temas: [
            "Correo electrónico",
            "Google Meet",
            "Cuenta de personal",
            "Cuenta genérica",
        ]
    },
    {
        titulo: "Conectividad",
        temas: [
            "Cuenta as la Red SARA",
            "Conexión por cable en despachos",
            "Cortafuegos corporativo",
            "Resolución de nombres de dominio (DNS)",
            "VPN Acceso remoto",
            "Wifi Eduroam (ssid: eduroam)",
            "Wifi para visitantes (ssid: UCM-Visitantes)",
        ]
    },
    {
        titulo: "Docencia",
        temas: [
            "Blackboard Collaborate",
            "Listados de clase",
            "Moodle: Aula Global",
        ]
    },
    {
        titulo: "Web",
        temas: [
            "Analítica Web",
            "Emisión de certificados SSL",
            "Hosting: alojamiento de páginas web",
            "Portal de eventos",
            "Redirecciones web",
        ]
    }
];

const temaPDI = [
    {
        titulo: "Administración digital",
        temas: [
            "Certificado digital de personal física",
            "Certificado electrónico de empleado público",
            "Registro electrónico",
            "Sede electrónica",
            "Portafirmas",
        ]
    },
    {
        titulo: "Comunicaciones",
        temas: [
            "Correo electrónico",
            "Google Meet",
            "Cuenta de personal",
            "Cuenta genérica",
        ]
    },
    {
        titulo: "Conectividad",
        temas: [
            "Conexión por cable en despachos",
            "Cortafuegos corporativo",
            "VPN Acceso remoto",
            "Wifi Eduroam (ssid: eduroam)",
            "Wifi para visitantes (ssid: UCM-Visitantes)",
        ]
    },
    {
        titulo: "Docencia",
        temas: [
            "Aula Virtual",
            "Blackboard Collaborate",
            "Listados de clase",
            "Moodle: Aula Global",
            "Plataforma de cursos online Privados",
        ]
    },
    {
        titulo: "Web",
        temas: [
            "Analítica Web",
            "Emisión de certificados SSL",
            "Hosting: alojamiento de páginas web",
            "Portal de eventos",
            "Redirecciones web",
        ]
    }
];

const temaAA = [
    {
        titulo: "Administración digital",
        temas: [
            "Registro electrónico",
            "Sede electrónica",
        ]
    },
    {
        titulo: "Comunicaciones",
        temas: [
            "Correo electrónico",
            "Google Meet",
            "Cuenta de Alumno",
        ]
    },
    {
        titulo: "Web",
        temas: [
            "Portal de eventos",
        ]
    }
];

const temas = {
    'alumno' : temaAlumno,
    'PAS' : temaPAS,
    'PDI' : temaPDI,
    'AA' : temaAA,
};

module.exports = temas;