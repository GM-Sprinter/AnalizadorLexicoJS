
// Esta función se llama cuando el usuario hace clic en el botón "Analizar"
function analyze() {
    // Obtengo el texto que el usuario ingresó en el área de texto
    const input = document.getElementById('code-input').value;
    // Llamo a la función tokenize para que convierta el texto en tokens
    const tokens = tokenize(input);
    // Muestro los tokens en la página
    displayTokens(tokens);
}

// Función principal para tokenizar el código fuente
function tokenize(input) {
    const tokens = []; // Aquí guardaré los tokens que se identifiquen
    // Defino las reglas de los tokens con expresiones regulares
    const tokenSpec = [
        { type: 'WHITESPACE', regex: /^\s+/ }, // Espacios en blanco (se ignorarán)
        { type: 'NUMBER', regex: /^\d+(\.\d+)?/ }, // Números enteros o decimales
        { type: 'IDENTIFIER', regex: /^[a-zA-Z_][a-zA-Z0-9_]*/ }, // Identificadores
        { type: 'OPERATOR', regex: /^[+\-*/=<>!]+/ }, // Operadores
        { type: 'PUNCTUATION', regex: /^[;(),{}]/ }, // Símbolos de puntuación
        { type: 'STRING', regex: /^"([^"\\]|\\.)*"/ }, // Cadenas de texto entre comillas
        { type: 'COMMENT', regex: /^\/\/.*|^\/\*[\s\S]*?\*\// }, // Comentarios (línea o bloque)
    ];

    let remaining = input; // Almacena la parte del código que aún no se ha analizado
    let line = 1; // Contador de líneas para rastrear la ubicación de los tokens

    // Mientras haya texto por analizar...
    while (remaining.length > 0) {
        let match = null; // Variable para almacenar el resultado de la coincidencia

        // Recorro cada tipo de token en tokenSpec
        for (let spec of tokenSpec) {
            // Intento hacer coincidir el inicio del texto restante con la expresión regular
            match = spec.regex.exec(remaining);
            if (match) {
                const value = match[0];
                // Ignoro los espacios en blanco y los comentarios, no los agrego como tokens
                if (spec.type !== 'WHITESPACE' && spec.type !== 'COMMENT') {
                    tokens.push({ type: spec.type, value: value, line: line });
                }
                // Cuento cuántas líneas nuevas hay en el token (por si hay saltos de línea)
                const newlines = (value.match(/\n/g) || []).length;
                line += newlines;
                // Elimino la parte coincidente del texto restante
                remaining = remaining.slice(value.length);
                break; // Salgo del bucle una vez que encontré un token válido
            }
        }

        // Si no se encontró ninguna coincidencia, marco un error y detengo el análisis
        if (!match) {
            tokens.push({ type: 'ERROR', value: remaining[0], line: line });
            break;
        }
    }

    // Devuelvo el array de tokens identificados
    return tokens;
}

// Función para mostrar los tokens en el HTML
function displayTokens(tokens) {
    const output = document.getElementById('tokens-output');
    // Si no hay tokens, muestro un mensaje indicándolo
    if (tokens.length === 0) {
        output.textContent = 'No se encontraron tokens.';
        return;
    }

    // Construyo una cadena de texto para mostrar cada token
    let displayText = '';
    tokens.forEach(token => {
        displayText += `Tipo: ${token.type}\tValor: "${token.value}"\tLínea: ${token.line}\n`;
    });

    // Actualizo el contenido del elemento donde se muestran los tokens
    output.textContent = displayText;
}
